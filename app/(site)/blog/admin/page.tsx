"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { ArrowLeft, Plus, Trash2, LogOut, Loader2, User, Lock, UserPlus, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MarkdownEditor } from "@/components/MarkdownEditor";

// ── Types ─────────────────────────────────────────────────────────────────────
type Post = { id: string; title: string; category: string; content: string; createdAt: string };

const STORAGE_KEY = "pluggers_admin_token";

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

// ── Authenticated fetch helper ────────────────────────────────────────────────
function authFetch(token: string, url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
}

// ── Login form ────────────────────────────────────────────────────────────────
function LoginGate({ onAuth }: { onAuth: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = (await res.json().catch(() => null)) as
        | { token?: string; error?: string }
        | null;

      if (res.status === 429) { setErr("Troppi tentativi. Attendi 1 minuto."); return; }
      if (res.status === 401) { setErr("Credenziali non valide."); return; }
      if (!res.ok)            { setErr(data?.error ?? `Errore server (${res.status}).`); return; }
      if (!data?.token)       { setErr("Risposta inattesa dal server."); return; }

      onAuth(data.token);
    } catch {
      setErr("Errore di connessione.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div
        className="w-full max-w-sm overflow-hidden rounded-3xl border border-[var(--color-border)]"
        style={{ background: "var(--color-panel)", backdropFilter: "blur(20px)" }}
      >
        {/* Top accent */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, var(--color-accent), #a855f7)" }} />

        <div className="p-8">
          <Link href="/" className="mb-8 flex items-center gap-2">
            <Image src={logo} alt="Pluggers" width={28} height={28} className="rounded-lg" />
            <span className="font-mono text-xs tracking-[0.25em] text-[var(--color-muted)]">PLUGGERS // STAFF</span>
          </Link>

          <h1 className="font-sans text-xl font-bold tracking-tight">Accesso riservato</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Inserisci le tue credenziali per continuare.</p>

          <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className={`${INPUT_CLASS} pl-10`}
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`${INPUT_CLASS} pl-10`}
              />
            </div>

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
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────
type AdminUser = { id: number; username: string; created_at: string; last_login_at: string | null };

// ── Admin dashboard ───────────────────────────────────────────────────────────
function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [posts,      setPosts]      = useState<Post[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [title,      setTitle]      = useState("");
  const [category,   setCategory]   = useState("Prodotto");
  const [content,    setContent]    = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formErr,    setFormErr]    = useState("");

  // User management
  const [users,        setUsers]       = useState<AdminUser[]>([]);
  const [newUsername,  setNewUsername] = useState("");
  const [newPassword,  setNewPassword] = useState("");
  const [userErr,      setUserErr]     = useState("");
  const [userOk,       setUserOk]      = useState("");
  const [userLoading,  setUserLoading] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/posts");
      const data = (await res.json()) as { posts: Post[] };
      setPosts(data.posts ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const res  = await authFetch(token, "/api/admin/users");
      const data = (await res.json()) as { users: AdminUser[] };
      setUsers(data.users ?? []);
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => { void loadPosts(); void loadUsers(); }, [loadPosts, loadUsers]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormErr("");
    if (!content.trim()) {
      setFormErr("Il contenuto non può essere vuoto.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await authFetch(token, "/api/posts", {
        method: "POST",
        body: JSON.stringify({ title, category, content }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        if (res.status === 401) {
          setFormErr("Sessione scaduta. Rieffettua il login.");
          onLogout();
          return;
        }
        setFormErr(d.error ?? "Errore imprevisto.");
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
    const res = await authFetch(token, "/api/posts", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (res.status === 401) { onLogout(); return; }
    await loadPosts();
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setUserErr(""); setUserOk("");
    setUserLoading(true);
    try {
      const res = await authFetch(token, "/api/admin/users", {
        method: "POST",
        body: JSON.stringify({ username: newUsername.trim(), password: newPassword }),
      });
      const data = (await res.json()) as { error?: string; username?: string };
      if (!res.ok) { setUserErr(data.error ?? "Errore imprevisto."); return; }
      setUserOk(`Utente "${data.username}" creato con successo.`);
      setNewUsername(""); setNewPassword("");
      await loadUsers();
    } catch {
      setUserErr("Errore di connessione.");
    } finally {
      setUserLoading(false);
    }
  }

  async function handleDeleteUser(id: number, username: string) {
    if (!confirm(`Eliminare l'utente "${username}"?`)) return;
    await authFetch(token, "/api/admin/users", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    await loadUsers();
  }

  async function handleLogout() {
    // Invalidate session server-side
    await fetch("/api/auth", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null);
    onLogout();
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
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 font-mono text-xs text-[var(--color-muted)] transition hover:border-red-500/50 hover:text-red-400"
            >
              <LogOut className="h-3.5 w-3.5" />
              Esci
            </button>
          </div>
        </header>

        {/* Create post form */}
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
                  placeholder="Titolo" className={INPUT_CLASS}
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
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder={"Scrivi il contenuto in Markdown...\n\n## Titolo sezione\n\nParagrafo con **grassetto**, *corsivo* o [un link](https://)\n\n### Sottotitolo\n\n- Voce lista"}
                  rows={16}
                />
                <button
                  type="submit" disabled={submitting}
                  className="h-12 rounded-2xl font-mono text-xs font-semibold tracking-[0.2em] text-white transition hover:scale-[1.02] disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, var(--color-accent), #a855f7)", boxShadow: "0 4px 20px rgba(139,92,246,0.35)" }}
                >
                  {submitting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "PUBBLICA"}
                </button>
                {formErr && <p className="font-mono text-xs text-red-500">{formErr}</p>}
              </form>
            </div>
          </div>
        </section>

        {/* Posts list */}
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
        {/* User management */}
        <section className="mt-10">
          <div
            className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] p-6 sm:p-8"
            style={{ background: "var(--color-panel)", backdropFilter: "blur(20px)" }}
          >
            <div className="pointer-events-none absolute -top-16 right-0 h-32 w-64 rounded-full blur-2xl"
                 style={{ background: "radial-gradient(circle, rgba(56,189,248,0.12), transparent 70%)" }} />

            <div className="relative">
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.24em]"
                style={{ border: "1px solid rgba(56,189,248,0.35)", background: "rgba(56,189,248,0.08)", color: "#38bdf8" }}
              >
                <ShieldCheck className="h-3 w-3" />
                GESTIONE UTENTI STAFF
              </div>

              {/* Existing users */}
              {users.length > 0 && (
                <div className="mb-5 flex flex-col gap-2">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] font-mono text-xs text-[var(--color-muted)]">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-mono text-sm font-semibold">{u.username}</p>
                          <p className="font-mono text-[10px] text-[var(--color-muted)]">
                            {u.last_login_at
                              ? `Ultimo accesso: ${new Date(u.last_login_at).toLocaleDateString("it-IT")}`
                              : "Nessun accesso registrato"}
                          </p>
                        </div>
                      </div>
                      {users.length > 1 && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.username)}
                          className="rounded-xl border border-transparent p-2 text-[var(--color-muted)] transition hover:border-red-500/50 hover:text-red-400"
                          title="Elimina utente"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add new user form */}
              <form className="flex flex-col gap-3" onSubmit={handleCreateUser}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
                    <input
                      type="text" required minLength={3} value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Nuovo username" autoComplete="off"
                      className={`${INPUT_CLASS} pl-10`}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
                    <input
                      type="password" required minLength={8} value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Password (min. 8 caratteri)" autoComplete="new-password"
                      className={`${INPUT_CLASS} pl-10`}
                    />
                  </div>
                </div>
                <button
                  type="submit" disabled={userLoading}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl border font-mono text-xs font-semibold tracking-[0.16em] transition hover:scale-[1.01] disabled:opacity-50"
                  style={{ borderColor: "rgba(56,189,248,0.40)", background: "rgba(56,189,248,0.08)", color: "#38bdf8" }}
                >
                  {userLoading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <><UserPlus className="h-4 w-4" /> AGGIUNGI UTENTE STAFF</>}
                </button>
                {userErr && <p className="font-mono text-xs text-red-500">{userErr}</p>}
                {userOk  && <p className="font-mono text-xs text-emerald-400">{userOk}</p>}
              </form>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) setToken(stored);
  }, []);

  function handleAuth(t: string) {
    sessionStorage.setItem(STORAGE_KEY, t);
    setToken(t);
  }

  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }

  if (!token) return <LoginGate onAuth={handleAuth} />;
  return <AdminDashboard token={token} onLogout={handleLogout} />;
}
