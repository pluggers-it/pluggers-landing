// Blog staff roles through the real route handlers, on an in-memory fake of Supabase (no network, no DB).
// Run: node --experimental-strip-types --test lib/blogRoles.test.mjs
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";

const fakeSupabase = `
const db = () => globalThis.__fakeDb;
class Q {
  constructor(t) { this.t = t; this.f = []; this.op = "select"; }
  select() { return this; }
  insert(v) { this.op = "insert"; this.v = v; return this; }
  update(v) { this.op = "update"; this.v = v; return this; }
  delete() { this.op = "delete"; return this; }
  eq(c, v) { this.f.push((r) => String(r[c]) === String(v)); return this; }
  or(expr) {
    const parts = expr.split(",").map((p) => p.split(".eq."));
    this.f.push((r) => parts.some(([c, v]) => String(r[c]) === v));
    return this;
  }
  order() { return this; }
  maybeSingle() { this.one = "maybe"; return this; }
  single() { this.one = "single"; return this; }
  run() {
    const rows = db()[this.t];
    const hit = (r) => this.f.every((f) => f(r));
    let data;
    if (this.op === "insert") {
      const row = { id: db().nextId++, created_at: new Date().toISOString(), status: "pubblicato", author_id: null, role: "admin", ...this.v };
      rows.push(row); data = [row];
    } else if (this.op === "update") {
      data = rows.filter(hit); data.forEach((r) => Object.assign(r, this.v));
    } else if (this.op === "delete") {
      data = rows.filter(hit); db()[this.t] = rows.filter((r) => !hit(r));
    } else data = rows.filter(hit);
    const count = data.length;
    if (this.one) {
      if (!data.length) return { data: null, error: this.one === "single" ? { message: "none" } : null, count };
      return { data: data[0], error: null, count };
    }
    return { data, error: null, count };
  }
  then(res, rej) { return Promise.resolve(this.run()).then(res, rej); }
}
export function getSupabase() { return { from: (t) => new Q(t) }; }
export function isSupabaseConfigured() { return true; }
`;
const nextCache = `export function revalidatePath() { globalThis.__revalidated = (globalThis.__revalidated ?? 0) + 1; }`;
const root = new URL("../", import.meta.url).href;

// "@/..." alias, extensionless .ts imports, and the two modules swapped for fakes
register("data:text/javascript," + encodeURIComponent(`
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
const ROOT = ${JSON.stringify(root)};
const fakes = {
  "@/lib/supabase": "data:text/javascript," + encodeURIComponent(${JSON.stringify(fakeSupabase)}),
  "next/cache": "data:text/javascript," + encodeURIComponent(${JSON.stringify(nextCache)}),
};
export async function resolve(spec, ctx, next) {
  if (fakes[spec]) return { url: fakes[spec], shortCircuit: true };
  if (spec === "next/server") spec = "next/server.js";
  if (spec.startsWith("@/")) spec = ROOT + spec.slice(2);
  else if (spec.startsWith(".") && ctx.parentURL?.startsWith("file:")) spec = new URL(spec, ctx.parentURL).href;
  if (spec.startsWith("file:") && !/\\.[cm]?[jt]sx?$/.test(spec) && existsSync(fileURLToPath(spec + ".ts"))) spec += ".ts";
  return next(spec, ctx);
}
`));

const posts = await import("../app/api/posts/route.ts");
const users = await import("../app/api/admin/users/route.ts");

const future = new Date(Date.now() + 3600_000).toISOString();
beforeEach(() => {
  globalThis.__fakeDb = {
    nextId: 100,
    admin_users: [
      { id: 1, username: "mattia", role: "admin" },
      { id: 2, username: "luca@example.test", role: "autore" },
      { id: 3, username: "altro@example.test", role: "autore" },
    ],
    admin_sessions: [
      { token: "tok-admin-0000", user_id: 1, expires_at: future },
      { token: "tok-luca-00000", user_id: 2, expires_at: future },
      { token: "tok-altro-0000", user_id: 3, expires_at: future },
    ],
    posts: [
      { id: 10, title: "Pubblicato", category: "Guida", content: "x", created_at: "2026-11-01", status: "pubblicato", author_id: 1 },
      { id: 11, title: "Bozza di Luca", category: "Guida", content: "x", created_at: "2026-11-02", status: "bozza", author_id: 2 },
      { id: 12, title: "Bozza di altro", category: "Guida", content: "x", created_at: "2026-11-03", status: "bozza", author_id: 3 },
    ],
  };
});

const req = (method, token, body) =>
  new Request("http://localhost/api", {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
const ids = (list) => list.map((p) => Number(p.id)).sort();
const LUCA = "tok-luca-00000", ADMIN = "tok-admin-0000";

test("public GET shows only published posts", async () => {
  const res = await posts.GET(req("GET"));
  const data = await res.json();
  assert.deepEqual(ids(data.posts), [10]);
  assert.equal(data.role, undefined);
});

test("author sees published + own drafts; admin sees all", async () => {
  assert.deepEqual(ids((await (await posts.GET(req("GET", LUCA))).json()).posts), [10, 11]);
  const admin = await (await posts.GET(req("GET", ADMIN))).json();
  assert.deepEqual(ids(admin.posts), [10, 11, 12]);
  assert.equal(admin.role, "admin");
});

test("author's new post is always a draft, even asking for pubblicato", async () => {
  const res = await posts.POST(req("POST", LUCA, { title: "T", category: "Guida", content: "c", status: "pubblicato" }));
  assert.equal(res.status, 201);
  const row = globalThis.__fakeDb.posts.find((p) => p.title === "T");
  assert.equal(row.status, "bozza");
  assert.equal(row.author_id, 2);
});

test("admin's new post is published by default", async () => {
  await posts.POST(req("POST", ADMIN, { title: "A", category: "Guida", content: "c" }));
  assert.equal(globalThis.__fakeDb.posts.find((p) => p.title === "A").status, "pubblicato");
});

test("author cannot publish; admin can", async () => {
  assert.equal((await posts.PATCH(req("PATCH", LUCA, { id: "11", status: "pubblicato" }))).status, 403);
  assert.equal(globalThis.__fakeDb.posts.find((p) => p.id === 11).status, "bozza");
  assert.equal((await posts.PATCH(req("PATCH", ADMIN, { id: "11", status: "pubblicato" }))).status, 200);
  assert.equal(globalThis.__fakeDb.posts.find((p) => p.id === 11).status, "pubblicato");
  assert.equal((await posts.PATCH(req("PATCH", ADMIN, { id: "999", status: "pubblicato" }))).status, 404);
});

test("author deletes only own drafts", async () => {
  assert.equal((await posts.DELETE(req("DELETE", LUCA, { id: "12" }))).status, 403); // someone else's draft
  assert.equal((await posts.DELETE(req("DELETE", LUCA, { id: "10" }))).status, 403); // published
  assert.deepEqual(ids(globalThis.__fakeDb.posts), [10, 11, 12]);
  assert.equal((await posts.DELETE(req("DELETE", LUCA, { id: "11" }))).status, 200);
  assert.deepEqual(ids(globalThis.__fakeDb.posts), [10, 12]);
});

test("admin deletes anyone's post", async () => {
  assert.equal((await posts.DELETE(req("DELETE", ADMIN, { id: "12" }))).status, 200);
  assert.equal((await posts.DELETE(req("DELETE", ADMIN, { id: "12" }))).status, 404);
});

test("author cannot list, create or delete accounts", async () => {
  assert.equal((await users.GET(req("GET", LUCA))).status, 403);
  assert.equal((await users.POST(req("POST", LUCA, { username: "nuovo", password: "abcdefgh1" }))).status, 403);
  assert.equal((await users.DELETE(req("DELETE", LUCA, { id: 1 }))).status, 403);
  assert.equal(globalThis.__fakeDb.admin_users.length, 3);
});

test("admin creates accounts, autore by default", async () => {
  const res = await users.POST(req("POST", ADMIN, { username: "Nuovo", password: "abcdefgh1" }));
  assert.equal(res.status, 201);
  assert.equal(globalThis.__fakeDb.admin_users.find((u) => u.username === "nuovo").role, "autore");
  const listed = await (await users.GET(req("GET", ADMIN))).json();
  assert.ok(listed.users.every((u) => u.role));
});

test("no session or expired session is 401", async () => {
  globalThis.__fakeDb.admin_sessions[1].expires_at = "2000-01-01T00:00:00Z";
  assert.equal((await posts.POST(req("POST", LUCA, { title: "T", category: "G", content: "c" }))).status, 401);
  assert.equal((await users.GET(req("GET"))).status, 401);
});
