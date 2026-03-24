import type { MetadataRoute } from "next";
import { readPosts } from "@/lib/posts";

const BASE = "https://pluggers.it";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  // Dynamic blog post pages — fetched from Supabase at build time.
  // Falls back to an empty array if the DB is unreachable (e.g. CI build
  // without env vars), so the build never fails.
  let postPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await readPosts();
    postPages = posts.map((post) => ({
      url: `${BASE}/blog/${post.id}`,
      lastModified: new Date(post.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB not available — skip dynamic post URLs
  }

  // Explicitly excluded from sitemap (also blocked in robots.txt):
  //   /newsletter, /blog/admin

  return [...staticPages, ...postPages];
}
