import Link from "next/link";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/pluggers.it?igsh=bzQ4a3ByaXdsajd0",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/pluggers-it/about/?viewAsMember=true",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61578519760330",
  },
];

/**
 * Shared footer — rendered on all public-facing pages.
 */
export function SiteFooter() {
  return (
    <footer className="relative flex flex-col items-center gap-4 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-muted)] sm:flex-row sm:justify-between">
      <div className="font-mono tracking-widest">
        PLUGGERS © {new Date().getFullYear()}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-5">
        <Link
          href="/privacy"
          className="font-mono transition hover:text-[var(--color-foreground)]"
        >
          Privacy Policy
        </Link>
        <Link
          href="/termini"
          className="font-mono transition hover:text-[var(--color-foreground)]"
        >
          Termini e Condizioni
        </Link>

        {SOCIAL_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono transition hover:text-[var(--color-foreground)]"
          >
            {label}
          </Link>
        ))}

        {/* Staff-only entry point — intentionally subtle */}
        <Link
          href="/blog/admin"
          className="font-mono opacity-20 transition hover:opacity-60"
          title="Staff"
        >
          ·
        </Link>
      </div>
    </footer>
  );
}
