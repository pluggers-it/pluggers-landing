import Link from "next/link";
import { ChevronDown } from "lucide-react";

type Item = { q: string; a: string; link?: { href: string; label: string } };

/** Question-and-answer list; the answers are in the served HTML, so crawlers and agents read them without a click. */
export function FaqList({ items }: { items: readonly Item[] }) {
  return (
    <div className="mt-8 divide-y divide-hair border-y border-hair">
      {items.map(({ q, a, link }) => (
        <details key={q} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
            <h3 className="font-semibold">{q}</h3>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <p className="max-w-[62ch] pb-5 text-[16px] leading-[1.6] text-muted">{a}</p>
          {link && (
            <Link
              href={link.href}
              className="-mt-2 mb-3 inline-flex min-h-12 items-center text-[16px] font-semibold text-accent-text underline underline-offset-4"
            >
              {link.label}
            </Link>
          )}
        </details>
      ))}
    </div>
  );
}
