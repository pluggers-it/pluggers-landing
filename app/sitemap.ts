import type { MetadataRoute } from "next";
import { readAllPosts, postPath } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";
import { HOME_UPDATED } from "@/lib/home";
import { TRADES, TRADES_UPDATED } from "@/lib/trades";
import { ABOUT_UPDATED } from "@/lib/about";
import { FAQ_UPDATED } from "@/lib/faq";

// Rebuilt hourly, so a new blog post reaches the sitemap without a deploy.
export const revalidate = 3600;

/** Dates are when each page's content last changed, not the build time. */
// As stated on each legal page ("Ultimo aggiornamento").
const PRIVACY_UPDATED = "2026-10-06";
const TERMS_UPDATED = "2026-10-06";
const ACCOUNT_DELETION_UPDATED = "2026-10-07";
const SUPPORT_UPDATED = "2026-10-07";
const PROS_UPDATED = "2026-10-20";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Falls back to no posts if the database is unreachable (e.g. a build without env vars).
  // BabyLoveGrowth articles come along when their key is set.
  let posts: Awaited<ReturnType<typeof readAllPosts>> = [];
  try {
    posts = await readAllPosts();
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
    page("/professionisti", PROS_UPDATED, 0.8),
    page("/clienti", PROS_UPDATED, 0.8),
    page("/faq", FAQ_UPDATED, 0.7),
    page("/chi-siamo", ABOUT_UPDATED, 0.5),
    page("/blog", posts[0]?.createdAt ?? HOME_UPDATED, 0.6),
    ...posts.map((p) => page(postPath(p), p.createdAt, 0.5)),
    page("/privacy", PRIVACY_UPDATED, 0.2),
    page("/termini", TERMS_UPDATED, 0.2),
    page("/supporto", SUPPORT_UPDATED, 0.3),
    page("/elimina-account", ACCOUNT_DELETION_UPDATED, 0.2),
  ];
}
