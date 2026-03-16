"use client";

import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

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

/**
 * Admin panel embedded inside the Blog page.
 * Auth is a local "developer key" stored in memory (page-session only).
 */
export function BlogAdminPanel({
  onChanged,
}: {
  /** Callback fired after create/delete to refresh the public list. */
  onChanged: () => void;
}) {
  const [devKey, setDevKey] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);

  const [title, setTitle] = useState("");
  const [categoryChoice, setCategoryChoice] = useState("Idraulico");
  const [customCategory, setCustomCategory] = useState("");
  const [content, setContent] = useState("");
  const [state, setState] = useState<CreatePostState>({ status: "idle" });

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
      onChanged();
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
      onChanged();
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <div className="font-mono text-xs tracking-[0.25em] text-[var(--color-muted)]">
            ADMIN
          </div>
          <div className="mt-2 font-sans text-lg font-semibold tracking-tight">
            Gestione post
          </div>
        </div>
        {isAuthed ? (
          <button
            onClick={() => setIsAuthed(false)}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 font-mono text-xs text-[var(--color-muted)] transition hover:border-[var(--color-accent)]"
            type="button"
          >
            Esci
          </button>
        ) : null}
      </div>

      {!isAuthed ? (
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
            La verifica reale avviene lato server su <code>/api/posts</code>.
          </div>
        </form>
      ) : (
        <form onSubmit={createPost} className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="font-mono text-xs text-[var(--color-muted)]">
              Titolo
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 rounded-xl border border-[var(--color-border)] bg-black/20 px-4 font-sans text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]"
              placeholder="Es. Riparazione rubinetto…"
            />
          </label>

          <div className="grid gap-2">
            <span className="font-mono text-xs text-[var(--color-muted)]">
              Categoria
            </span>
            <div className="flex flex-wrap gap-2">
              {["Idraulico", "Elettricista", "Muratore", "Ferramenta", "Altro"].map(
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
                  placeholder="Es. Fabbro, Caldaie…"
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
              className="min-h-[150px] rounded-xl border border-[var(--color-border)] bg-black/20 p-4 font-sans text-sm leading-6 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]"
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

          <button
            type="button"
            onClick={() => {
              const id = window.prompt("ID post da eliminare (opzionale):");
              if (!id) return;
              void deletePost(id.trim());
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-black/10 px-4 py-2 font-mono text-xs text-[var(--color-muted)] transition hover:border-red-500 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
            Elimina per ID
          </button>
        </form>
      )}
    </section>
  );
}

