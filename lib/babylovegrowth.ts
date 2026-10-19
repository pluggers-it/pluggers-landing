/**
 * Articles written on BabyLoveGrowth: shown on /blog next to ours, managed on their platform.
 * Without BABYLOVEGROWTH_BLOG_API_KEY, or when their API fails, the blog shows only our posts.
 */
import { BlogClient, type BlogArticle, type BlogArticleSummary } from "babylovegrowth-next-js-blog";
import type { Post } from "./posts";

let warned = false;
function warnOnce(message: string) {
  if (warned) return;
  warned = true;
  console.warn(`BabyLoveGrowth: ${message}. The blog shows only our posts.`);
}

function client(): BlogClient | null {
  const apiKey = process.env.BABYLOVEGROWTH_BLOG_API_KEY;
  if (!apiKey) {
    warnOnce("BABYLOVEGROWTH_BLOG_API_KEY not set");
    return null;
  }
  // re-read hourly, like the sitemap
  return new BlogClient({ apiKey, baseUrl: process.env.BABYLOVEGROWTH_BLOG_API_URL || undefined, revalidate: 3600 });
}

/** Italian only, when the article states its language. */
function isItalian(a: BlogArticleSummary): boolean {
  return !a.languageCode || /^it(?:[-_]|$)/i.test(a.languageCode);
}

function toPost(a: BlogArticleSummary & Partial<BlogArticle>): Post {
  return {
    id: a.slug,
    slug: a.slug,
    title: a.title,
    category: "Guide",
    // The list has no body, only the article does. A leading H1 would repeat the page's title.
    content: (a.content_markdown ?? "").replace(/^\s*# .*\n+/, ""),
    createdAt: a.published_at || a.created_at,
    description: a.meta_description || a.excerpt,
    image: a.hero_image_url || undefined,
    jsonLd: [a.jsonLd, a.faqJsonLd].filter((d): d is Record<string, unknown> => d != null),
  };
}

export function articlesToPosts(articles: BlogArticleSummary[]): Post[] {
  return articles.filter(isItalian).map(toPost);
}

export async function readArticles(): Promise<Post[]> {
  const blog = client();
  if (!blog) return [];
  try {
    return articlesToPosts(await blog.getAllArticles());
  } catch (e) {
    warnOnce(e instanceof Error ? e.message : String(e));
    return [];
  }
}

export async function getArticle(slug: string): Promise<Post | null> {
  // their slugs are lowercase words: anything else is not worth a request
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const blog = client();
  if (!blog) return null;
  try {
    const article = await blog.getArticleBySlug(slug);
    return article?.published && isItalian(article) ? toPost(article) : null;
  } catch (e) {
    warnOnce(e instanceof Error ? e.message : String(e));
    return null;
  }
}
