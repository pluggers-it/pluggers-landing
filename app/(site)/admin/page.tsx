"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";

type Post = {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
};

type CreatePostState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved"; id: string }
  | { status: "error"; message: string };

type PostsState =
  | { status: "idle"; posts: Post[] }
  | { status: "loading"; posts: Post[] }
  | { status: "error"; posts: Post[]; message: string };

/**
 * Admin area: login via Developer Key and manage posts.
 */
export default function AdminPage() {
  const [devKey, setDevKey] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);

  const [title, setTitle] = useState("");
  const [categoryChoice, setCategoryChoice] = useState("Idraulico");
  const [customCategory, setCustomCategory] = useState("");
  const [content, setContent] = useState("");
  const [state, setState] = useState<CreatePostState>({ status: "idle" });
  const [postsState, setPostsState] = useState<PostsState>({
    status: "idle",
    posts: [],
  });

  const resolvedCategory =
    categoryChoice === "Altro"
      ? (customCategory || "Altro").trim()
      : categoryChoice.trim();

  const canSave = useMemo(() => {
    return (
      isAuthed &&
      title.trim().length > 0 &&
      resolvedCategory.length > 0 &&
      content.trim().length > 0 &&
      state.status !== "saving"
    );
  }, [content, isAuthed, resolvedCategory, state.status, title]);

  async function loadPosts() {
    setPostsState((s) => ({ status: "loading", posts: s.posts }));
    try {
      const res = await fetch("/api/posts", { method: "GET" });
      const data = (await res.json()) as { posts: Post[] };
      setPostsState({ status: "idle", posts: data.posts ?? [] });
    } catch (err) {
      setPostsState({
        status: "error",
        posts: [],
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  useEffect(() => {
    if (isAuthed) void loadPosts();
  }, [isAuthed]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setIsAuthed(devKey.trim().length > 0);
    setState({ status: "idle" });
  }

  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;

    setState({ status: "saving" });
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          devKey,
          title,
          category: resolvedCategory,
          content,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setState({
          status: "error",
          message: data?.error ?? `HTTP ${res.status}`,
        });
        return;
      }

      const data = (await res.json()) as { post: { id: string } };
      setState({ status: "saved", id: data.post.id });
      setTitle("");
      setContent("");
      setCustomCategory("");
      setCategoryChoice("Idraulico");
      await loadPosts();
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  async function deletePost(id: string) {
    const ok = window.confirm("Eliminare questo post?");
    if (!ok) return;
    try {
      const res = await fetch("/api/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ devKey, id }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setState({
          status: "error",
          message: data?.error ?? `HTTP ${res.status}`,
        });
        return;
      }
      await loadPosts();
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10">
        <SiteHeader label="PLUGGERS // ADMIN" />

        <main className="mt-10 grid gap-4">
          {!isAuthed ? (
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <h2 className="font-sans text-lg font-semibold tracking-tight">
                Login
              </h2>
              <form onSubmit={login} className="mt-4 grid gap-3">
                <label className="grid gap-2">
                  <span className="font-mono text-xs text-[var(--color-muted)]">
                    Developer Key
                  </span>
                  <input
                    value={devKey}
                    onChange={(e) => setDevKey(e.target.value)}
                    className="h-11 rounded-xl border border-[var(--color-border)] bg-black/20 px-4 font-mono text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]"
                    placeholder="ADMIN_PASSWORD…"
                    type="password"
                    autoComplete="off"
                  />
                </label>
                <button
                  type="submit"
                  className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] font-mono text-sm text-[var(--color-foreground)] transition hover:border-[var(--color-accent)]"
                >
                  Entra
                </button>
                <div className="font-mono text-xs text-[var(--color-muted)]">
                  La verifica reale avviene lato server su <code>/api/posts</code>
                  .
                </div>
              </form>
            </section>
          ) : (
            <>
              <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <h2 className="font-sans text-lg font-semibold tracking-tight">
                    Nuovo post
                  </h2>
                  <button
                    onClick={() => setIsAuthed(false)}
                    className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 font-mono text-xs text-[var(--color-muted)] transition hover:border-[var(--color-accent)]"
                  >
                    Esci
                  </button>
                </div>

                <form onSubmit={createPost} className="mt-5 grid gap-4">
                  <label className="grid gap-2">
                    <span className="font-mono text-xs text-[var(--color-muted)]">
                      Titolo
                    </span>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-11 rounded-xl border border-[var(--color-border)] bg-black/20 px-4 font-sans text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]"
                      placeholder="Es. Sostituzione rubinetto…"
                    />
                  </label>

                  <div className="grid gap-2">
                    <span className="font-mono text-xs text-[var(--color-muted)]">
                      Categoria
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {["Idraulico", "Elettricista", "Muratore", "Altro"].map(
                        (c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setCategoryChoice(c)}
                            className={[
                              "rounded-full border px-4 py-2 font-mono text-xs transition",
                              categoryChoice === c
                                ? "border-[var(--color-accent)] bg-[rgba(124,58,237,0.10)] text-[var(--color-accent)]"
                                : "border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-muted)] hover:border-[var(--color-accent)]",
                            ].join(" ")}
                          >
                            {c}
                          </button>
                        ),
                      )}
                    </div>

                    {categoryChoice === "Altro" ? (
                      <label className="mt-2 grid gap-2">
                        <span className="font-mono text-xs text-[var(--color-muted)]">
                          Scrivi categoria
                        </span>
                        <input
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className="h-11 rounded-xl border border-[var(--color-border)] bg-black/20 px-4 font-sans text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]"
                          placeholder="Es. Caldaie, Serramenti…"
                        />
                      </label>
                    ) : null}
                  </div>

                  <label className="grid gap-2">
                    <span className="font-mono text-xs text-[var(--color-muted)]">
                      Contenuto
                    </span>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[160px] rounded-xl border border-[var(--color-border)] bg-black/20 p-4 font-sans text-sm leading-6 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]"
                      placeholder="Descrivi il lavoro…"
                    />
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      disabled={!canSave}
                      type="submit"
                      className="h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] px-6 font-mono text-sm text-[var(--color-foreground)] transition enabled:hover:border-[var(--color-accent)] disabled:opacity-50"
                    >
                      {state.status === "saving" ? "Salvataggio…" : "Pubblica"}
                    </button>

                    <div className="font-mono text-xs text-[var(--color-muted)]">
                      {state.status === "saved" ? (
                        <span>
                          Salvato:{" "}
                          <span className="text-[var(--color-foreground)]">
                            {state.id}
                          </span>
                        </span>
                      ) : null}
                      {state.status === "error" ? (
                        <span className="text-red-500">{state.message}</span>
                      ) : null}
                    </div>
                  </div>
                </form>
              </section>

              <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-sans text-lg font-semibold tracking-tight">
                    Post
                  </h2>
                  <button
                    onClick={() => void loadPosts()}
                    className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 font-mono text-xs text-[var(--color-muted)] transition hover:border-[var(--color-accent)]"
                  >
                    {postsState.status === "loading" ? "Caricamento…" : "Refresh"}
                  </button>
                </div>

                {postsState.status === "error" ? (
                  <div className="mt-3 font-mono text-xs text-red-500">
                    {postsState.message}
                  </div>
                ) : null}

                <div className="mt-4 grid gap-2">
                  {postsState.posts.length === 0 ? (
                    <div className="rounded-xl border border-[var(--color-border)] bg-black/10 p-4 text-sm text-[var(--color-muted)]">
                      Nessun post.
                    </div>
                  ) : (
                    postsState.posts.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-black/10 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-sans font-semibold">
                              {p.title}
                            </span>
                            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1 font-mono text-xs text-[var(--color-muted)]">
                              {p.category}
                            </span>
                          </div>
                          <div className="mt-1 font-mono text-xs text-[var(--color-muted)]">
                            {p.id}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => void deletePost(p.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 font-mono text-xs text-[var(--color-muted)] transition hover:border-red-500 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                          Elimina
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

