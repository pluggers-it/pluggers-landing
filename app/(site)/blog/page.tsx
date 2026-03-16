"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { BlogAdminPanel } from "@/components/BlogAdminPanel";

type Post = {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
};

/**
 * Blog page: shows posts if present, otherwise empty state.
 * Admin login + CRUD lives inside this page.
 */
export default function BlogPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasPosts = useMemo(() => (posts?.length ?? 0) > 0, [posts]);

  async function load() {
    setError(null);
    try {
      const res = await fetch("/api/posts", { method: "GET" });
      const data = (await res.json()) as { posts: Post[] };
      setPosts(data.posts ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setPosts([]);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
        <SiteHeader label="PLUGGERS // BLOG" />

        <main className="mt-12 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-mono text-xs tracking-[0.25em] text-[var(--color-muted)]">
                  FEED
                </div>
                <div className="mt-2 font-sans text-2xl font-semibold tracking-tight">
                  Interventi & aggiornamenti
                </div>
                <div className="mt-2 text-sm text-[var(--color-muted)]">
                  Quando ci sono post, li trovi qui. Se è vuoto, è normale.
                </div>
              </div>
              <button
                onClick={() => void load()}
                type="button"
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 font-mono text-xs text-[var(--color-muted)] transition hover:border-[var(--color-accent)]"
              >
                Refresh
              </button>
            </div>

            {error ? (
              <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-black/10 p-4 font-mono text-xs text-red-500">
                {error}
              </div>
            ) : null}

            {posts === null ? (
              <div className="mt-6 grid place-items-center rounded-xl border border-[var(--color-border)] bg-black/10 p-10">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
                <div className="mt-3 font-mono text-xs tracking-[0.22em] text-[var(--color-muted)]">
                  LOADING
                </div>
              </div>
            ) : hasPosts ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {posts.map((p) => (
                  <article
                    key={p.id}
                    className="rounded-2xl border border-[var(--color-border)] bg-black/10 p-5 transition hover:border-[var(--color-accent)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1 font-mono text-xs text-[var(--color-muted)]">
                        {p.category}
                      </span>
                      <time className="font-mono text-[11px] text-[var(--color-muted)]">
                        {new Date(p.createdAt).toLocaleDateString("it-IT")}
                      </time>
                    </div>
                    <h2 className="mt-4 font-sans text-lg font-semibold leading-snug tracking-tight">
                      {p.title}
                    </h2>
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-[var(--color-muted)]">
                      {p.content}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-black/10 p-8">
                <div className="font-mono text-xs tracking-[0.25em] text-[var(--color-muted)]">
                  EMPTY
                </div>
                <div className="mt-3 font-sans text-2xl font-semibold tracking-tight">
                  Nessun post ancora.
                </div>
                <div className="mt-2 text-sm text-[var(--color-muted)]">
                  Se sei admin, fai login qui a destra e pubblica.
                </div>
              </div>
            )}
          </section>

          <BlogAdminPanel onChanged={load} />
        </main>
      </div>
    </div>
  );
}

