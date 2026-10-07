#!/usr/bin/env node
// Tells Bing, Yandex and the other IndexNow engines that the site's pages changed.
// Reads the URLs from the live sitemap, so it always matches what is published.
// Run after a production deploy: node scripts/indexnow.mjs
// No account needed: the key file at /280cc552a0a03d339f3c2d46f3b33a89.txt proves we own the host.

const HOST = "www.plggrs.it";
const KEY = "280cc552a0a03d339f3c2d46f3b33a89";

const sitemap = await fetch(`https://${HOST}/sitemap.xml`).then((r) => {
  if (!r.ok) throw new Error(`sitemap: HTTP ${r.status}`);
  return r.text();
});
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: HTTP ${res.status}, ${urlList.length} URL segnalati`);
if (res.status >= 400) process.exit(1);
