import { test } from "node:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { GRAZIE_PATH, GRAZIE_ROBOTS, hasSignedUp, markSignedUp, takeConversion } from "./grazie.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path) => readFileSync(join(root, path), "utf8");
const store = () => {
  const map = new Map();
  return { getItem: (k) => map.get(k) ?? null, setItem: (k, v) => void map.set(k, v) };
};
const broken = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };

test("the sign-up flag lets /grazie open, and the conversion goes out once per sign-up", () => {
  const s = store();
  assert.equal(hasSignedUp(s), false);
  assert.equal(takeConversion(s), false, "no sign-up, no conversion");
  assert.equal(markSignedUp(s), true);
  assert.equal(hasSignedUp(s), true);
  assert.equal(takeConversion(s), true);
  assert.equal(takeConversion(s), false, "a reload of /grazie does not count again");
  assert.equal(hasSignedUp(s), true, "and still opens");
  assert.equal(markSignedUp(s), true);
  assert.equal(takeConversion(s), true, "a new sign-up in the same tab counts");
});

test("a browser that refuses storage keeps the form on its in-page thanks", () => {
  assert.equal(markSignedUp(broken), false);
  assert.equal(hasSignedUp(broken), false);
  assert.equal(takeConversion(broken), false);
});

test("/grazie is noindex, out of the sitemap, and linked from nowhere", () => {
  assert.equal(GRAZIE_PATH, "/grazie");
  assert.deepEqual(GRAZIE_ROBOTS, { index: false, follow: false });
  assert.match(read("app/(site)/grazie/page.tsx"), /export const metadata: Metadata = \{[^}]*robots: GRAZIE_ROBOTS/);

  // not in the sitemap, and not hidden from crawlers by robots.txt either (that would hide the noindex)
  assert.doesNotMatch(read("app/sitemap.ts"), /grazie/i);
  assert.doesNotMatch(read("app/robots.ts"), /grazie/i);

  // the address is written once, in lib/grazie.ts; the form and the tag read it from there
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(join(root, dir))) {
      const path = join(dir, name);
      if (statSync(join(root, path)).isDirectory()) walk(path);
      else if (/\.(tsx?|mjs|json)$/.test(name) && !name.endsWith(".test.mjs")) files.push(path);
    }
  };
  for (const dir of ["app", "components", "lib"]) walk(dir);
  const mentions = files.filter((path) => /["'`]\/grazie\b/.test(read(path))).map((path) => relative(".", path));
  assert.deepEqual(mentions, [join("lib", "grazie.ts")]);
});

test("the form sends Meta one Lead, then goes to /grazie only for a waitlist sign-up", () => {
  const form = read("components/WaitlistForm.tsx");
  assert.equal(form.match(/metaEvent\("track", "Lead"/g).length, 1);
  const go = form.indexOf("router.push(GRAZIE_PATH)");
  assert.ok(go > form.indexOf('metaEvent("track", "Lead"'), "the Lead goes first");
  assert.match(form, /submissionSource === "waitlist" && !afterSubmit && markSignedUp\(\)\) router\.push\(GRAZIE_PATH\)/);
});
