import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Pluggers",
  description: "Articoli, guide e aggiornamenti dal team di Pluggers.",
};

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="relative mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">

        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-56 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.20),rgba(0,0,0,0)_60%)] blur-3xl" />
        </div>

        <div className="relative">
          <SiteHeader label="PLUGGERS // BLOG" />

          <main className="mt-14">
            {/* Page heading */}
            <div className="mb-10">
              <p className="font-mono text-xs tracking-[0.25em] text-[var(--color-accent)]">
                FEED
              </p>
              <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight sm:text-4xl">
                Interventi & aggiornamenti
              </h1>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Articoli, guide e novità dal team di Pluggers.
              </p>
            </div>

            {posts.length === 0 ? (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-10 text-center">
                <p className="font-mono text-xs tracking-[0.25em] text-[var(--color-muted)]">EMPTY</p>
                <p className="mt-3 font-sans text-xl font-semibold">Nessun articolo ancora.</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">I contenuti arriveranno presto.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group relative flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 transition hover:border-[var(--color-accent)]"
                  >
                    {/* Category + date */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.18em]"
                        style={{
                          border: "1px solid rgba(139,92,246,0.35)",
                          background: "rgba(139,92,246,0.08)",
                          color: "var(--color-accent)",
                        }}
                      >
                        {post.category.toUpperCase()}
                      </span>
                      <time className="font-mono text-[11px] text-[var(--color-muted)]">
                        {formatDate(post.date)}
                      </time>
                    </div>

                    {/* Title */}
                    <h2 className="mt-4 font-sans text-lg font-semibold leading-snug tracking-tight transition group-hover:text-[var(--color-accent)]">
                      {post.title}
                    </h2>

                    {/* Description */}
                    {post.description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--color-muted)]">
                        {post.description}
                      </p>
                    )}

                    {/* Read more */}
                    <div className="mt-5 flex items-center gap-1.5 font-mono text-xs text-[var(--color-accent)]">
                      Leggi
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
