import Link from "next/link";
import { ORG, ORG_ADDRESS_LINE, SOCIAL_LINKS } from "@/lib/site";
import { TRADES } from "@/lib/trades";

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Termini", href: "/termini" },
  { label: "Supporto", href: "/supporto" },
  { label: "Elimina account", href: "/elimina-account" },
];

const LINK_CLASS =
  "inline-flex min-h-12 items-center text-muted underline-offset-4 transition hover:text-ink hover:underline";

/**
 * Shared footer — rendered on all public-facing pages.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-hair pt-8 text-sm">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <nav aria-labelledby="footer-trades">
          <p id="footer-trades" className="font-semibold text-ink">
            <Link href="/torino" className="inline-flex min-h-12 items-center underline-offset-4 hover:underline">
              Mestieri a Torino
            </Link>
          </p>
          <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-3">
            {TRADES.map((t) => (
              <li key={t.slug}>
                <Link href={`/torino/${t.slug}`} className={LINK_CLASS}>
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="flex min-h-12 items-center font-semibold text-ink">{ORG.legalName}</p>
          <address className="not-italic leading-6 text-muted">
            {ORG_ADDRESS_LINE}
            <br />
            P.IVA e C.F. {ORG.vatNumber}
            <br />
            <a href={`mailto:${ORG.email}`} className="inline-flex min-h-12 items-center underline-offset-4 hover:text-ink hover:underline">
              {ORG.email}
            </a>
          </address>
          <Link href="/chi-siamo" className={LINK_CLASS}>
            Chi siamo
          </Link>
        </div>
      </div>

      {/* Extra room on phones so the fixed «torna su» button never sits on the last links. */}
      <div className="mt-6 flex flex-col gap-2 border-t border-hair pb-24 pt-6 sm:flex-row sm:items-center sm:justify-between md:pb-8">
        <div className="flex min-h-12 items-center text-muted">
          © {new Date().getFullYear()} {ORG.legalName}
        </div>

        <nav aria-label="Collegamenti" className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <Link href="/blog" className={LINK_CLASS}>
            Blog
          </Link>
          {LEGAL_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className={LINK_CLASS}>
              {label}
            </Link>
          ))}

          {SOCIAL_LINKS.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer me" className={LINK_CLASS}>
              {label}
            </a>
          ))}

          {/* Staff-only entry point — intentionally subtle */}
          <Link
            href="/blog/admin"
            className="inline-flex h-12 w-6 items-center justify-center text-muted opacity-20 transition hover:opacity-60"
            title="Staff"
            aria-label="Area staff"
            rel="nofollow"
          >
            ·
          </Link>
        </nav>
      </div>
    </footer>
  );
}
