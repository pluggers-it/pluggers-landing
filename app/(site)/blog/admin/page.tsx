"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { ArrowLeft, Plus, Trash2, LogOut, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

// ── Types ─────────────────────────────────────────────────────────────────────
type Post = { id: string; title: string; category: string; content: string; createdAt: string };

const CATEGORIES = [
  "Prodotto", "Guida", "Notizie", "Aggiornamento",
  "Idraulico", "Elettricista", "Muratore", "Fabbro", "Falegname",
  "Imbianchino", "Piastrellista", "Carpentiere", "Saldatore",
  "Serramentista", "Vetraio", "Tappezziere", "Giardiniere",
  "Manovale", "Gessista", "Lattoniere", "Termoidraulico",
  "Frigorista", "Ascensorista", "Altro",
];

const INPUT_CLASS =
  "w-full rounded-2xl border border-[var(--color-border)] bg-black/10 px-4 py-3 font-mono text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]";

const SELECT_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 1rem center",
  backgroundSize: "1.25rem",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

// ── Password gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onAuth }: { onAuth: (key: string) => void }) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      // Verify by attempting a protected request — a POST with empty fields
      // will return 400 (bad request) if the key is valid, or 401 if not.
      const trimmed = key.trim();
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          devKey: trimmed,
          title: "",
          category: "",
          content: "",
        }),
      });
      if (res.status === 401) {
        setErr("Chiave non valida.");
        return;
      }
      // 400 = password OK, campi vuoti (flusso di verifica)
      if (res.status === 400) {
        onAuth(trimmed);
        return;
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setErr(data?.error ?? `Errore server (${res.status}). Controlla le variabili d'ambiente sul deploy.`);
        return;
      }
      onAuth(trimmed);
    } catch {
      setErr("Errore di connessione.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div
        className="w-full max-w-sm rounded-3xl border border-[var(--color-border)] p-8"
        style={{ background: "var(--color-panel)", backdropFilter: "blur(20px)" }}
      >
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Image src={logo} alt="Pluggers" width={28} height={28} className="rounded-lg" />
          <span className="font-mono text-xs tracking-[0.25em] text-[var(--color-muted)]">PLUGGERS // STAFF</span>
        </Link>

        <h1 className="font-sans text-xl font-bold tracking-tight">Accesso riservato</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Inserisci la chiave di accesso per continuare.</p>

        <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="password"
            required
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Chiave di accesso"
            className={INPUT_CLASS}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="h-12 rounded-2xl font-mono text-xs font-semibold tracking-[0.2em] text-white transition hover:scale-[1.02] disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, var(--color-accent), #a855f7)" }}
          >
            {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "ENTRA"}
          </button>
          {err && <p className="text-center font-mono text-xs text-red-500">{err}</p>}
        </form>
      </div>
    </div>
  );
}

// ── Admin dashboard ───────────────────────────────────────────────────────────
function AdminDashboard({ devKey, onLogout }: { devKey: string; onLogout: () => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // New post form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Prodotto");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formErr, setFormErr] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      const data = (await res.json()) as { posts: Post[] };
      setPosts(data.posts ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadPosts(); }, [loadPosts]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormErr("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ devKey, title, category, content }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        setFormErr(d.error ?? "Errore");
        return;
      }
      setTitle(""); setCategory("Prodotto"); setContent("");
      await loadPosts();
    } catch {
      setFormErr("Errore di connessione.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminare questo articolo?")) return;
    await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devKey, id }),
    });
    await loadPosts();
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image src={logo} alt="Pluggers" width={34} height={34} className="rounded-lg" />
            </Link>
            <span className="font-mono text-xs tracking-[0.25em] text-[var(--color-muted)]">PLUGGERS // STAFF</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 font-mono text-xs text-[var(--color-muted)] transition hover:border-[var(--color-accent)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Blog
            </Link>
            <ThemeToggle />
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 font-mono text-xs text-[var(--color-muted)] transition hover:border-red-500/50 hover:text-red-400"
            >
              <LogOut className="h-3.5 w-3.5" />
              Esci
            </button>
          </div>
        </header>

        {/* ── Create post form ── */}
        <section className="mt-10">
          <div
            className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] p-6 sm:p-8"
            style={{ background: "var(--color-panel)", backdropFilter: "blur(20px)" }}
          >
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full blur-2xl"
                 style={{ background: "radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)" }} />

            <div className="relative">
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.24em]"
                style={{ border: "1px solid rgba(139,92,246,0.40)", background: "rgba(139,92,246,0.10)", color: "var(--color-accent)" }}
              >
                <Plus className="h-3 w-3" />
                NUOVO ARTICOLO
              </div>

              <form className="flex flex-col gap-3" onSubmit={handleCreate}>
                <input
                  type="text" required value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titolo"
                  className={INPUT_CLASS}
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`${INPUT_CLASS} appearance-none`}
                  style={SELECT_STYLE}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#07070a]">{c}</option>
                  ))}
                </select>
                <textarea
                  required value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={"Contenuto (Markdown supportato)\n\n## Titolo\n\nParagrafo..."}
                  rows={12}
                  className={`${INPUT_CLASS} resize-y font-mono text-xs leading-relaxed`}
                />
                <button
                  type="submit" disabled={submitting}
                  className="h-12 rounded-2xl font-mono text-xs font-semibold tracking-[0.2em] text-white transition hover:scale-[1.02] disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, var(--color-accent), #a855f7)", boxShadow: "0 4px 20px rgba(139,92,246,0.35)" }}
                >
                  {submitting
                    ? <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                    : "PUBBLICA"}
                </button>
                {formErr && <p className="font-mono text-xs text-red-500">{formErr}</p>}
              </form>
            </div>
          </div>
        </section>

        {/* ── Posts list ── */}
        <section className="mt-8">
          <h2 className="mb-4 font-mono text-xs tracking-[0.25em] text-[var(--color-muted)]">
            ARTICOLI PUBBLICATI
          </h2>

          {loading ? (
            <div className="grid place-items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-10">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--color-accent)]" />
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-8 text-center text-sm text-[var(--color-muted)]">
              Nessun articolo ancora. Creane uno qui sopra.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--color-muted)]">
                        {post.category}
                      </span>
                      <time className="font-mono text-[11px] text-[var(--color-muted)]">
                        {formatDate(post.createdAt)}
                      </time>
                    </div>
                    <p className="mt-2 truncate font-sans font-semibold">{post.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--color-muted)]">
                      {post.content.slice(0, 120)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/blog/${post.id}`}
                      target="_blank"
                      className="rounded-xl border border-[var(--color-border)] px-3 py-2 font-mono text-[11px] text-[var(--color-muted)] transition hover:border-[var(--color-accent)]"
                    >
                      Apri
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="rounded-xl border border-transparent p-2 text-[var(--color-muted)] transition hover:border-red-500/50 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ── Root component ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [devKey, setDevKey] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("pluggers_admin_key");
    if (stored) setDevKey(stored);
  }, []);

  function handleAuth(key: string) {
    sessionStorage.setItem("pluggers_admin_key", key);
    setDevKey(key);
  }

  function handleLogout() {
    sessionStorage.removeItem("pluggers_admin_key");
    setDevKey(null);
  }

  if (!devKey) return <PasswordGate onAuth={handleAuth} />;
  return <AdminDashboard devKey={devKey} onLogout={handleLogout} />;
}
