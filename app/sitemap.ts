import type { MetadataRoute } from "next";
import { readPosts, postPath } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";
import { HOME_UPDATED } from "@/lib/home";
import { TRADES, TRADES_UPDATED } from "@/lib/trades";
import { ABOUT_UPDATED } from "@/lib/about";

// Rebuilt hourly, so a new blog post reaches the sitemap without a deploy.
export const revalidate = 3600;

/** Dates are when each page's content last changed, not the build time. */
// As stated on each legal page ("Ultimo aggiornamento").
const PRIVACY_UPDATED = "2026-10-06";
const TERMS_UPDATED = "2026-10-06";
const ACCOUNT_DELETION_UPDATED = "2026-10-07";
const SUPPORT_UPDATED = "2026-10-07";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Falls back to no posts if the database is unreachable (e.g. a build without env vars).
  let posts: Awaited<ReturnType<typeof readPosts>> = [];
  try {
    posts = await readPosts();
  } catch {
    // keep the static part of the sitemap
  }

  const page = (path: string, lastModified: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(lastModified),
    priority,
  });

  return [
    page("", HOME_UPDATED, 1),
    page("/torino", TRADES_UPDATED, 0.9),
    ...TRADES.map((t) => page(`/torino/${t.slug}`, TRADES_UPDATED, 0.8)),
    page("/chi-siamo", ABOUT_UPDATED, 0.5),
    page("/blog", posts[0]?.createdAt ?? HOME_UPDATED, 0.6),
    ...posts.map((p) => page(postPath(p), p.createdAt, 0.5)),
    page("/privacy", PRIVACY_UPDATED, 0.2),
    page("/termini", TERMS_UPDATED, 0.2),
    page("/supporto", SUPPORT_UPDATED, 0.3),
    page("/elimina-account", ACCOUNT_DELETION_UPDATED, 0.2),
  ];
}
