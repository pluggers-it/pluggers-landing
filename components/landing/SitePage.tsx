import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageShell } from "./PageShell";
import { CONTAINER } from "./styles";

export type Crumb = { name: string; path: string };

/** The home's frame with a visible breadcrumb, for the Turin and "chi siamo" pages. */
export function SitePage({ trail, children }: { trail: Crumb[]; children: React.ReactNode }) {
  const crumbs = [{ name: "Home", path: "/" }, ...trail];
  return (
    <PageShell>
      <nav aria-label="Percorso" className={CONTAINER}>
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
          {crumbs.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
              {i < crumbs.length - 1 ? (
                <Link href={c.path} className="inline-flex min-h-12 items-center underline-offset-4 hover:text-ink hover:underline">
                  {c.name}
                </Link>
              ) : (
                <span aria-current="page" className="font-medium text-ink">
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {children}
    </PageShell>
  );
}
