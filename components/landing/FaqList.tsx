import { ChevronDown } from "lucide-react";

/** Question-and-answer list; the answers are in the served HTML, so crawlers and agents read them without a click. */
export function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="mt-8 divide-y divide-hair border-y border-hair">
      {items.map(({ q, a }) => (
        <details key={q} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
            <h3 className="font-semibold">{q}</h3>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <p className="max-w-[62ch] pb-5 text-[16px] leading-[1.6] text-muted">{a}</p>
        </details>
      ))}
    </div>
  );
}
