import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * Simple top navigation shared across pages.
 */
export function SiteHeader({
  label,
}: {
  /** Small mono label shown on the left. */
  label: string;
}) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
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
      </div>
      <nav className="flex items-center gap-3">
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
        <Link
          href="/admin"
          className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 font-mono text-xs text-[var(--color-muted)] backdrop-blur transition hover:border-[var(--color-accent)]"
        >
          Admin
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}

