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
  neq(c, v) { this.f.push((r) => String(r[c]) !== String(v)); return this; }
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
// the real limiter keeps a setInterval alive (the test would never exit) and would cap the logins below
const rateLimit = `export const rateLimit = () => ({ allowed: true, remaining: 1, resetAt: 0 }); export const getClientIp = () => "test";`;
const root = new URL("../", import.meta.url).href;

// "@/..." alias, extensionless .ts imports, and the two modules swapped for fakes
register("data:text/javascript," + encodeURIComponent(`
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
const ROOT = ${JSON.stringify(root)};
const fakes = {
  "@/lib/supabase": "data:text/javascript," + encodeURIComponent(${JSON.stringify(fakeSupabase)}),
  "next/cache": "data:text/javascript," + encodeURIComponent(${JSON.stringify(nextCache)}),
  "@/lib/rate-limit": "data:text/javascript," + encodeURIComponent(${JSON.stringify(rateLimit)}),
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
const auth = await import("../app/api/auth/route.ts");
const lib = await import("./posts.ts");
const sitemap = (await import("../app/sitemap.ts")).default;
const bcrypt = (await import("bcryptjs")).default;

const future = new Date(Date.now() + 3600_000).toISOString();
const MATTIA_HASH = await bcrypt.hash("vecchia-password", 4);
const LUCA_HASH = await bcrypt.hash("password-di-luca", 4);
beforeEach(() => {
  globalThis.__fakeDb = {
    nextId: 100,
    admin_users: [
      { id: 1, username: "mattia", role: "admin", password_hash: MATTIA_HASH },
      { id: 2, username: "luca@example.test", role: "autore", password_hash: LUCA_HASH },
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
  const res = await users.POST(req("POST", ADMIN, { username: "Nuovo" }));
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

// ── temporary password, forced change at the first login ───────────────────────

test("a new account gets a generated temporary password, shown once and stored only hashed", async () => {
  const res = await users.POST(req("POST", ADMIN, { username: "luca.piras@example.test", role: "autore", password: "ignored-by-the-api" }));
  assert.equal(res.status, 201);
  const { tempPassword, role } = await res.json();
  assert.equal(role, "autore");
  assert.match(tempPassword, /^[A-Za-z0-9_-]{16}$/);
  const row = globalThis.__fakeDb.admin_users.find((u) => u.username === "luca.piras@example.test");
  assert.equal(row.must_change_password, true);
  assert.ok(!JSON.stringify(row).includes(tempPassword), "the plain password is not in the row");
  assert.ok(await bcrypt.compare(tempPassword, row.password_hash));
  assert.ok(!(await bcrypt.compare("ignored-by-the-api", row.password_hash)));
});

test("admin can create another admin", async () => {
  await users.POST(req("POST", ADMIN, { username: "secondo", role: "admin" }));
  assert.equal(globalThis.__fakeDb.admin_users.find((u) => u.username === "secondo").role, "admin");
});

test("with a temporary password the session opens nothing until the password is changed", async () => {
  const res = await users.POST(req("POST", ADMIN, { username: "nuovo.autore", role: "autore" }));
  const { tempPassword } = await res.json();

  const login = await (await auth.POST(req("POST", null, { username: "nuovo.autore", password: tempPassword }))).json();
  assert.equal(login.mustChangePassword, true);
  const T = login.token;

  assert.equal((await posts.POST(req("POST", T, { title: "X", category: "Guida", content: "c" }))).status, 401);
  assert.equal((await (await posts.GET(req("GET", T))).json()).role, undefined); // public list only
  assert.equal((await users.GET(req("GET", T))).status, 401);

  // wrong current password, too short, same as before
  assert.equal((await auth.PATCH(req("PATCH", T, { password: "sbagliata", newPassword: "unapasswordlunga" }))).status, 401);
  assert.equal((await auth.PATCH(req("PATCH", T, { password: tempPassword, newPassword: "corta" }))).status, 400);
  assert.equal((await auth.PATCH(req("PATCH", T, { password: tempPassword, newPassword: tempPassword }))).status, 400);
  assert.equal((await auth.PATCH(req("PATCH", null, { password: tempPassword, newPassword: "unapasswordlunga" }))).status, 401);

  assert.equal((await auth.PATCH(req("PATCH", T, { password: tempPassword, newPassword: "unapasswordlunga" }))).status, 200);
  const row = globalThis.__fakeDb.admin_users.find((u) => u.username === "nuovo.autore");
  assert.equal(row.must_change_password, false);
  assert.ok(await bcrypt.compare("unapasswordlunga", row.password_hash));

  // now an ordinary author: drafts only
  assert.equal((await posts.POST(req("POST", T, { title: "Dopo", category: "Guida", content: "c" }))).status, 201);
  assert.equal(globalThis.__fakeDb.posts.find((p) => p.title === "Dopo").status, "bozza");
  assert.equal((await (await auth.POST(req("POST", null, { username: "nuovo.autore", password: "unapasswordlunga" }))).json()).mustChangePassword, false);
});

test("existing admins (rows from before the migration defaults) keep every right", async () => {
  // a pre-existing row: no must_change_password set by the app, role from the column default
  const res = await auth.POST(req("POST", null, { username: "mattia", password: "vecchia-password" }));
  assert.equal(res.status, 200);
  const { token, mustChangePassword } = await res.json();
  assert.equal(mustChangePassword, false);
  assert.equal((await (await posts.GET(req("GET", token))).json()).role, "admin");
  assert.equal((await users.GET(req("GET", token))).status, 200);
  assert.equal((await posts.PATCH(req("PATCH", token, { id: "11", status: "pubblicato" }))).status, 200);
  assert.equal((await posts.DELETE(req("DELETE", token, { id: "12" }))).status, 200);
});

test("author cannot change roles or passwords of others: no such route, and PATCH /api/auth only touches the caller", async () => {
  assert.equal(users.PATCH, undefined);
  assert.equal(users.PUT, undefined);
  const before = globalThis.__fakeDb.admin_users.find((u) => u.id === 1).password_hash;
  // Luca's own current password is not "vecchia-password": the admin's row is not reachable this way
  assert.equal((await auth.PATCH(req("PATCH", LUCA, { password: "vecchia-password", newPassword: "unapasswordlunga" }))).status, 401);
  assert.equal(globalThis.__fakeDb.admin_users.find((u) => u.id === 1).password_hash, before);
});

test("an account with posts is not deleted (its posts would lose the author and count as an admin's)", async () => {
  assert.equal((await users.DELETE(req("DELETE", ADMIN, { id: 2 }))).status, 409);
  assert.equal(globalThis.__fakeDb.admin_users.length, 3);
  globalThis.__fakeDb.posts = globalThis.__fakeDb.posts.filter((p) => p.author_id !== 2);
  assert.equal((await users.DELETE(req("DELETE", ADMIN, { id: 2 }))).status, 200);
});

// ── public pages: drafts never leave the panel ─────────────────────────────────

test("drafts are not on /blog, not at their address, not in the sitemap", async () => {
  assert.deepEqual(ids(await lib.readAllPosts()), [10]);
  assert.equal(await lib.getPostById("11"), null);
  assert.equal(await lib.getPostBySegment("11-bozza-di-luca"), null);
  const urls = (await sitemap()).map((e) => e.url);
  assert.ok(urls.some((u) => /\/blog\/10-/.test(u)));
  assert.ok(!urls.some((u) => /\/blog\/1[12]-/.test(u)));
});

test("an author's published post has its HTML sanitized; an admin's and an old one's do not", async () => {
  const db = globalThis.__fakeDb;
  db.posts.push(
    { id: 20, title: "Di Luca", category: "Guida", content: "<img src=x onerror=alert(1)>", created_at: "2026-11-05", status: "pubblicato", author_id: 2 },
    { id: 21, title: "Vecchio", category: "Guida", content: "x", created_at: "2026-10-01", status: "pubblicato", author_id: null },
  );
  assert.equal((await lib.getPostById("20")).untrusted, true);
  assert.ok(!(await lib.getPostById("10")).untrusted);
  assert.ok(!(await lib.getPostById("21")).untrusted);
  const html = await lib.markdownToHtml("<img src=x onerror=alert(1)> <u>ok</u>", false, true);
  assert.ok(!/<img|<u>/.test(html));
  assert.ok(/<u>/.test(await lib.markdownToHtml("<u>ok</u>", false, false)));
});

test("an author's post: every way to inject markup is cleaned, the newsletter formatting stays", async () => {
  const md = [
    "Il menù di oggi:",
    "🔧 Primo punto",
    "💡 Secondo punto",
    "",
    "## 🔧 Il titolo",
    "",
    "Testo con <img src=x onerror=alert(1)> e <svg onload=alert(2)></svg> e <iframe src=//evil.test></iframe>.",
    "",
    "<style>body{display:none}</style>",
    "",
    '<form action="https://evil.test"><input name=p></form>',
    "",
    '<p style="background:url(javascript:alert(3))">stile</p>',
    "",
    "[clic](javascript:alert(4)) [tab](java\tscript:alert(5)) [ent](javascript&#58;alert(6)) ![img](data:image/svg+xml,x) <javascript:alert(7)>",
    "",
    "[buono](https://plggrs.it/blog) [relativo](/newsletter) [mail](mailto:info@plggrs.it)",
    "",
    "Il Consiglio di Pluggers:",
    "Fai così.",
    "",
    "👉 Iscriviti alla newsletter su plggrs.it/newsletter",
  ].join("\n");
  const html = await lib.markdownToHtml(md, false, true);
  assert.ok(html.includes('<img src="" alt="img">'), "a markdown image keeps its alt text, without the data: address");
  for (const tag of ["<img", "<svg", "<iframe", "<style", "<form", "<input", "<script", "<p style"]) {
    assert.ok(!html.replace('<img src="" alt="img">', "").includes(tag), `${tag} survived: ${html}`);
  }
  assert.ok(!/(?:href|src)="(?:java|data:)/i.test(html), html);
  assert.ok(!/<[a-z][^>]*\s(?:on[a-z]+|style)=/i.test(html), "no tag with an event handler or a style");
  // safe links stay
  assert.ok(html.includes('href="https://plggrs.it/blog"'));
  assert.ok(html.includes('href="/newsletter"'));
  assert.ok(html.includes('href="mailto:info@plggrs.it"'));
  // formatPost's own structure is intact
  for (const cls of ["post-box post-menu", "post-label", "post-emoji", "post-box post-tip", "post-box post-cta"]) {
    assert.ok(html.includes(`class="${cls}`), `${cls} lost: ${html}`);
  }
  // an admin's post keeps its inline HTML
  assert.ok((await lib.markdownToHtml("<u>ok</u>", false, false)).includes("<u>ok</u>"));
});

test("changing the password closes the user's other sessions, not the one in use nor anyone else's", async () => {
  const db = globalThis.__fakeDb;
  db.admin_sessions.push({ token: "tok-luca-altro", user_id: 2, expires_at: future });
  assert.equal((await auth.PATCH(req("PATCH", LUCA, { password: "password-di-luca", newPassword: "unapasswordlunga" }))).status, 200);
  assert.deepEqual(db.admin_sessions.map((s) => s.token).sort(), ["tok-admin-0000", "tok-altro-0000", LUCA].sort());
  assert.equal((await posts.POST(req("POST", "tok-luca-altro", { title: "T", category: "G", content: "c" }))).status, 401);
  assert.equal((await posts.POST(req("POST", LUCA, { title: "T", category: "G", content: "c" }))).status, 201);
});

test("an unused temporary password stops working after 7 days", async () => {
  const { tempPassword } = await (await users.POST(req("POST", ADMIN, { username: "tardivo" }))).json();
  const row = globalThis.__fakeDb.admin_users.find((u) => u.username === "tardivo");
  const login = () => auth.POST(req("POST", null, { username: "tardivo", password: tempPassword }));
  row.created_at = new Date(Date.now() - 6 * 86400_000).toISOString();
  assert.equal((await login()).status, 200);
  row.created_at = new Date(Date.now() - 8 * 86400_000).toISOString();
  assert.equal((await login()).status, 401);
  // a changed password does not expire: existing accounts are untouched
  row.must_change_password = false;
  assert.equal((await login()).status, 200);
});
