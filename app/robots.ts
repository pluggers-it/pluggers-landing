import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/newsletter",   // hidden signup page — not for crawling
          "/blog/admin",   // staff-only admin panel
          "/api/",         // internal API routes
        ],
      },
    ],
    sitemap: "https://pluggers.it/sitemap.xml",
    host: "https://pluggers.it",
  };
}
