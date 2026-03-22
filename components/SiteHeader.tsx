import Link from "next/link";
import Image from "next/image";
import { PenLine } from "lucide-react";
import logo from "@/assets/logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * Simple top navigation shared across pages.
 */
export function SiteHeader({
  label,
  /** Mostra link allo staff editor (solo sezioni blog). */
  showBlogAdmin = false,
}: {
  /** Small mono label shown on the left. */
  label: string;
  showBlogAdmin?: boolean;
}) {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src={logo}
          alt="Pluggers"
          width={34}
          height={34}
          className="rounded-lg"
        />
        <div className="font-mono text-xs tracking-[0.25em] text-[var(--color-muted)]">
          {label}
        </div>
      </Link>
      <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
        {showBlogAdmin && (
          <Link
            href="/blog/admin"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 font-mono text-[11px] font-semibold tracking-[0.12em] text-white shadow-[0_4px_20px_rgba(139,92,246,0.35)] transition hover:scale-[1.02] sm:px-4"
            style={{
              background: "linear-gradient(135deg, var(--color-accent), #a855f7)",
            }}
            title="Pubblica un nuovo articolo (accesso staff)"
          >
            <PenLine className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="hidden sm:inline">NUOVO ARTICOLO</span>
            <span className="sm:hidden">NUOVO</span>
          </Link>
        )}
        <Link
          href="/"
          className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 font-mono text-xs text-[var(--color-muted)] backdrop-blur transition hover:border-[var(--color-accent)]"
        >
          Home
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 font-mono text-xs text-[var(--color-muted)] backdrop-blur transition hover:border-[var(--color-accent)]"
        >
          Blog
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}

