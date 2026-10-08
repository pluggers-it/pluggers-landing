import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// /blog/admin is not here on purpose: it carries its own noindex, which a Disallow would hide
const DISALLOW = ["/api/"];

/** Search and AI crawlers are welcome on every public page; named so a blanket rule elsewhere can't shut them out. */
const AI_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_AGENTS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
