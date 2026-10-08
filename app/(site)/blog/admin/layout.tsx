import type { Metadata } from "next";

// The editor is reachable but must never show up in search results. A robots.txt Disallow
// would hide this noindex from crawlers, so the page stays crawlable and says it itself.
export const metadata: Metadata = { title: "Pubblica", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
