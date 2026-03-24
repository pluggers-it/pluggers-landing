import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { readPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articoli, guide e aggiornamenti sul mondo degli artigiani e professionisti della mano d'opera. " +
    "Consigli per idraulici, elettricisti, muratori e altri professionisti.",
  alternates: { canonical: "https://pluggers.it/blog" },
};

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof readPosts>> = [];
  try {
    posts = await readPosts();
  } catch {
    // DB not yet set up or unreachable — show empty state
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="relative mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-56 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.20),rgba(0,0,0,0)_60%)] blur-3xl" />
        </div>

        <div className="relative">
          <SiteHeader label="PLUGGERS // BLOG" showBlogAdmin />

          <main className="mt-14">
            {/* Heading + CTA pubblicazione */}
            <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs tracking-[0.25em] text-[var(--color-accent)]">FEED</p>
                <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight sm:text-4xl">
                  Interventi & aggiornamenti
                </h1>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Articoli, guide e novità dal team di Pluggers.
                </p>
              </div>
              <Link
                href="/blog/admin"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl px-6 py-3 font-mono text-xs font-semibold tracking-[0.18em] text-white transition hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, var(--color-accent), #a855f7)",
                  boxShadow: "0 4px 24px rgba(139,92,246,0.45)",
                }}
              >
                <PenLine className="h-4 w-4" aria-hidden />
                AGGIUNGI ARTICOLO
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-10 text-center">
                <p className="font-mono text-xs tracking-[0.25em] text-[var(--color-muted)]">EMPTY</p>
                <p className="mt-3 font-sans text-xl font-semibold">Nessun articolo ancora.</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Pubblica il primo articolo dalla console staff (serve la chiave di accesso).
                </p>
                <Link
                  href="/blog/admin"
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-mono text-xs font-semibold tracking-[0.18em] text-white transition hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, var(--color-accent), #a855f7)",
                    boxShadow: "0 4px 24px rgba(139,92,246,0.45)",
                  }}
                >
                  <PenLine className="h-4 w-4" aria-hidden />
                  VAI ALLA PUBBLICAZIONE
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="group flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 transition hover:border-[var(--color-accent)]"
                  >
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
                        {formatDate(post.createdAt)}
                      </time>
                    </div>
                    <h2 className="mt-4 font-sans text-lg font-semibold leading-snug tracking-tight transition group-hover:text-[var(--color-accent)]">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--color-muted)]">
                      {post.content.slice(0, 200)}
                    </p>
                    <div className="mt-5 flex items-center gap-1.5 font-mono text-xs text-[var(--color-accent)]">
                      Leggi
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
          <div className="mt-12">
            <SiteFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
