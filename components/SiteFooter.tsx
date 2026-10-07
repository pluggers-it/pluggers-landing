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

const LINK_CLASS =
  "inline-flex min-h-12 items-center text-muted underline-offset-4 transition hover:text-ink hover:underline";

/**
 * Shared footer — rendered on all public-facing pages.
 */
export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-2 border-t border-hair pb-8 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-h-12 items-center text-muted">
        © {new Date().getFullYear()} Pluggers S.r.l.
      </div>

      <nav
        aria-label="Collegamenti"
        className="flex flex-wrap items-center gap-x-6 gap-y-1"
      >
        <Link href="/privacy" className={LINK_CLASS}>
          Privacy Policy
        </Link>
        <Link href="/termini" className={LINK_CLASS}>
          Termini e Condizioni
        </Link>

        {SOCIAL_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            {label}
          </Link>
        ))}

        {/* Staff-only entry point — intentionally subtle */}
        <Link
          href="/blog/admin"
          className="inline-flex h-12 w-6 items-center justify-center text-muted opacity-20 transition hover:opacity-60"
          title="Staff"
        >
          ·
        </Link>
      </nav>
    </footer>
  );
}
