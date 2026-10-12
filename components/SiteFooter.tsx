import Link from "next/link";
import { ORG, ORG_ADDRESS_LINE, SOCIAL_LINKS } from "@/lib/site";

type FooterLink = { label: string; href: string };

const SITE_LINKS: FooterLink[] = [
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Per i professionisti", href: "/professionisti" },
  { label: "Per i clienti", href: "/clienti" },
  { label: "Blog", href: "/blog" },
  { label: "Supporto", href: "/supporto" },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Termini", href: "/termini" },
  { label: "Elimina account", href: "/elimina-account" },
];

const TITLE_CLASS = "flex min-h-12 items-center font-semibold text-ink";
const ITEM_CLASS = "flex min-h-11 items-center text-muted";
const LINK_CLASS =
  "inline-flex min-h-11 items-center text-muted underline-offset-4 transition hover:text-ink hover:underline";

/**
 * Shared footer — rendered on all public-facing pages.
 * Four columns with the same shape: company data, site links, legal links, socials.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-hair pt-8 text-sm">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <p className={TITLE_CLASS}>{ORG.legalName}</p>
          <address className="not-italic">
            <ul>
              <li className={ITEM_CLASS}>{ORG_ADDRESS_LINE}</li>
              <li className={ITEM_CLASS}>P.IVA e C.F. {ORG.vatNumber}</li>
              <li>
                <a href={`mailto:${ORG.email}`} className={LINK_CLASS}>
                  {ORG.email}
                </a>
              </li>
            </ul>
          </address>
        </div>

        {/* On phones this column spans two rows, so «Note legali» and «Seguici» stack beside it. */}
        <FooterLinks id="footer-site" title="Link utili" links={SITE_LINKS} className="row-span-2 sm:row-span-1" />
        <FooterLinks id="footer-legal" title="Note legali" links={LEGAL_LINKS} />

        <nav aria-labelledby="footer-social">
          <p id="footer-social" className={TITLE_CLASS}>
            Seguici
          </p>
          <ul>
            {SOCIAL_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer me" className={LINK_CLASS}>
                  {label}
                  <span className="sr-only"> (si apre in una nuova scheda)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Extra room on phones so the fixed «torna su» button never sits on the last links. */}
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-hair pb-24 pt-6 md:pb-8">
        <p className="flex min-h-12 items-center text-muted">
          © {new Date().getFullYear()} {ORG.legalName}
        </p>

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
      </div>
    </footer>
  );
}

function FooterLinks({
  id,
  title,
  links,
  className,
}: {
  id: string;
  title: string;
  links: FooterLink[];
  className?: string;
}) {
  return (
    <nav aria-labelledby={id} className={className}>
      <p id={id} className={TITLE_CLASS}>
        {title}
      </p>
      <ul>
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link href={href} className={LINK_CLASS}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
