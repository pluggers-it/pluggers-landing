import { test } from "node:test";
import assert from "node:assert/strict";
import { mergePosts, postPath } from "./postPath.ts";
import { articlesToPosts, readArticles } from "./babylovegrowth.ts";

const ours = [
  { id: "12", title: "Polizza catastrofi: scade il 31 marzo", category: "Altro", content: "Testo.", createdAt: "2026-03-01T09:00:00Z" },
  { id: "3", title: "Strisce LED da giardino", category: "Elettricista", content: "Testo.", createdAt: "2026-01-10T09:00:00Z" },
];

const article = (slug, publishedAt, languageCode = "it") => ({
  id: 1,
  title: slug,
  slug,
  hero_image_url: "",
  languageCode,
  meta_description: `Descrizione di ${slug}`,
  excerpt: "",
  orgWebsite: "https://www.plggrs.it",
  created_at: publishedAt,
  updated_at: publishedAt,
  published_at: publishedAt,
  published: true,
  seedKeyword: null,
  keywords: [],
});

test("ours and BabyLoveGrowth's together, newest first", () => {
  const merged = mergePosts(ours, articlesToPosts([
    article("caldaia-che-perde-acqua", "2026-02-01T09:00:00Z"),
    article("quadro-elettrico-che-scatta", "2026-04-01T09:00:00Z"),
  ]));
  assert.deepEqual(merged.map(postPath), [
    "/blog/quadro-elettrico-che-scatta",
    "/blog/12-polizza-catastrofi-scade-il-31-marzo",
    "/blog/caldaia-che-perde-acqua",
    "/blog/3-strisce-led-da-giardino",
  ]);
  assert.equal(merged[0].description, "Descrizione di quadro-elettrico-che-scatta");
});

test("an article whose address opens one of our posts is left out", () => {
  const merged = mergePosts(ours, articlesToPosts([
    article("12-errori-con-la-caldaia", "2026-05-01T09:00:00Z"),
    article("7-errori-con-la-caldaia", "2026-05-01T09:00:00Z"),
  ]));
  assert.deepEqual(merged.map((p) => p.id), ["7-errori-con-la-caldaia", "12", "3"]);
});

test("only Italian articles, when the language is set", () => {
  const posts = articlesToPosts([
    article("in-italiano", "2026-05-01T09:00:00Z", "it"),
    article("in-italiano-con-paese", "2026-05-01T09:00:00Z", "it-IT"),
    article("senza-lingua", "2026-05-01T09:00:00Z", ""),
    article("in-inglese", "2026-05-01T09:00:00Z", "en"),
    article("in-portoghese", "2026-05-01T09:00:00Z", "pt-BR"),
  ]);
  assert.deepEqual(posts.map((p) => p.slug), ["in-italiano", "in-italiano-con-paese", "senza-lingua"]);
});

test("without the API key there are only our posts", async () => {
  delete process.env.BABYLOVEGROWTH_BLOG_API_KEY;
  const theirs = await readArticles();
  assert.deepEqual(theirs, []);
  assert.deepEqual(mergePosts(ours, theirs), ours);
});
