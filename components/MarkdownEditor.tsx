"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold, Code, Eye, Heading1, Heading2, Heading3,
  Italic, Link2, List, ListOrdered, Minus, Palette,
  Pencil, Quote, Underline,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

const COLORS = [
  { label: "Viola",     hex: "#8b5cf6" },
  { label: "Rosso",     hex: "#ef4444" },
  { label: "Verde",     hex: "#22c55e" },
  { label: "Giallo",    hex: "#facc15" },
  { label: "Blu",       hex: "#60a5fa" },
  { label: "Arancione", hex: "#f97316" },
  { label: "Rosa",      hex: "#f472b6" },
  { label: "Grigio",    hex: "#9ca3af" },
];

export function MarkdownEditor({ value, onChange, placeholder, rows = 16 }: Props) {
  const taRef        = useRef<HTMLTextAreaElement>(null);
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tab,            setTab]           = useState<"write" | "preview">("write");
  const [previewHtml,    setPreviewHtml]   = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [colorOpen,      setColorOpen]     = useState(false);

  // ── Insert helpers ─────────────────────────────────────────────────────────

  /** Wrap selection (or fallback text) with before/after markers. */
  function wrap(before: string, after: string, fallback: string) {
    const ta = taRef.current;
    if (!ta) return;
    const s   = ta.selectionStart;
    const e   = ta.selectionEnd;
    const sel = value.slice(s, e) || fallback;
    onChange(value.slice(0, s) + before + sel + after + value.slice(e));
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(s + before.length, s + before.length + sel.length);
    }, 0);
  }

  /** Prepend a prefix to the current line. */
  function linePrefix(prefix: string) {
    const ta = taRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const ls  = value.lastIndexOf("\n", pos - 1) + 1;
    onChange(value.slice(0, ls) + prefix + value.slice(ls));
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(pos + prefix.length, pos + prefix.length);
    }, 0);
  }

  // ── Live preview ───────────────────────────────────────────────────────────

  const fetchPreview = useCallback(async (md: string) => {
    if (!md.trim()) { setPreviewHtml(""); return; }
    setLoadingPreview(true);
    try {
      const res  = await fetch("/api/preview", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ markdown: md }),
      });
      const data = (await res.json()) as { html?: string };
      setPreviewHtml(data.html ?? "");
    } finally {
      setLoadingPreview(false);
    }
  }, []);

  useEffect(() => {
    if (tab !== "preview") return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPreview(value), 350);
  }, [tab, value, fetchPreview]);

  // ── Styles ─────────────────────────────────────────────────────────────────
  const btn = [
    "flex h-7 w-7 items-center justify-center rounded-lg",
    "text-[var(--color-muted)] transition",
    "hover:bg-white/10 hover:text-[var(--color-foreground)]",
  ].join(" ");

  const tabBtn = (active: boolean) => [
    "flex items-center gap-1.5 rounded-lg px-3 py-1",
    "font-mono text-[10px] tracking-[0.1em] transition",
    active
      ? "bg-white/10 text-[var(--color-foreground)]"
      : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]",
  ].join(" ");

  const divider = <div className="mx-1 h-4 w-px shrink-0 bg-[var(--color-border)]" />;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black/10">

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-0.5 border-b border-[var(--color-border)] px-2 py-1.5"
        style={{ background: "rgba(0,0,0,0.25)" }}
      >
        {/* Headings */}
        <button type="button" title="Titolo H1  →  # " onClick={() => linePrefix("# ")} className={btn}>
          <Heading1 className="h-4 w-4" />
        </button>
        <button type="button" title="Titolo H2  →  ## " onClick={() => linePrefix("## ")} className={btn}>
          <Heading2 className="h-4 w-4" />
        </button>
        <button type="button" title="Titolo H3  →  ### " onClick={() => linePrefix("### ")} className={btn}>
          <Heading3 className="h-4 w-4" />
        </button>

        {divider}

        {/* Inline formatting */}
        <button type="button" title="Grassetto  →  **testo**" onClick={() => wrap("**", "**", "testo in grassetto")} className={btn}>
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" title="Corsivo  →  *testo*" onClick={() => wrap("*", "*", "testo in corsivo")} className={btn}>
          <Italic className="h-4 w-4" />
        </button>
        <button type="button" title="Sottolineato  →  <u>testo</u>" onClick={() => wrap("<u>", "</u>", "testo sottolineato")} className={btn}>
          <Underline className="h-4 w-4" />
        </button>

        {divider}

        {/* Color picker */}
        <div className="relative">
          <button
            type="button"
            title="Colore testo"
            onClick={() => setColorOpen((o) => !o)}
            className={btn}
          >
            <Palette className="h-4 w-4" />
          </button>
          {colorOpen && (
            <div
              className="absolute left-0 top-full z-30 mt-1 flex gap-1.5 rounded-xl border border-[var(--color-border)] p-2 shadow-xl"
              style={{ background: "rgba(8,8,12,0.97)", backdropFilter: "blur(20px)" }}
            >
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  title={c.label}
                  onClick={() => {
                    wrap(`<span style="color:${c.hex}">`, "</span>", "testo colorato");
                    setColorOpen(false);
                  }}
                  className="h-5 w-5 shrink-0 rounded-full border border-white/15 transition hover:scale-125"
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          )}
        </div>

        {divider}

        {/* Blocks */}
        <button type="button" title="Lista puntata  →  - " onClick={() => linePrefix("- ")} className={btn}>
          <List className="h-4 w-4" />
        </button>
        <button type="button" title="Lista numerata  →  1. " onClick={() => linePrefix("1. ")} className={btn}>
          <ListOrdered className="h-4 w-4" />
        </button>
        <button type="button" title="Citazione  →  > " onClick={() => linePrefix("> ")} className={btn}>
          <Quote className="h-4 w-4" />
        </button>
        <button type="button" title="Codice inline  →  `code`" onClick={() => wrap("`", "`", "codice")} className={btn}>
          <Code className="h-4 w-4" />
        </button>
        <button type="button" title="Separatore  →  ---" onClick={() => wrap("\n\n---\n\n", "", "")} className={btn}>
          <Minus className="h-4 w-4" />
        </button>
        <button type="button" title="Link  →  [testo](url)" onClick={() => wrap("[", "](https://)", "testo del link")} className={btn}>
          <Link2 className="h-4 w-4" />
        </button>

        {/* Write / Preview tabs */}
        <div className="ml-auto flex items-center gap-1">
          <button type="button" onClick={() => setTab("write")} className={tabBtn(tab === "write")}>
            <Pencil className="h-3 w-3" /> SCRIVI
          </button>
          <button type="button" onClick={() => setTab("preview")} className={tabBtn(tab === "preview")}>
            <Eye className="h-3 w-3" /> ANTEPRIMA
          </button>
        </div>
      </div>

      {/* ── Editor ──────────────────────────────────────────────────────────── */}
      {tab === "write" && (
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="resize-y bg-transparent px-4 py-3 font-mono text-xs leading-relaxed text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted)]/40"
        />
      )}

      {/* ── Preview ─────────────────────────────────────────────────────────── */}
      {tab === "preview" && (
        <div className="min-h-64 overflow-auto px-6 py-5">
          {loadingPreview ? (
            <p className="font-mono text-xs text-[var(--color-muted)]">Caricamento anteprima…</p>
          ) : previewHtml ? (
            <div className="blog-body" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          ) : (
            <p className="font-mono text-xs text-[var(--color-muted)]/50">
              Scrivi qualcosa per vedere l&apos;anteprima.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
