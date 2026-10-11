"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; text: string };

/** The article's contents column, wide screens only: the section being read is marked as the reader scrolls. */
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items
      .map((t) => document.getElementById(t.id))
      .filter((h): h is HTMLElement => h !== null);
    if (headings.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // the last heading above the top third of the screen; the last one when the page can't scroll further
      const line = window.innerHeight / 3;
      let current = headings[0];
      for (const h of headings) if (h.getBoundingClientRect().top <= line) current = h;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = headings[headings.length - 1];
      }
      setActive(current.id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <nav aria-label="In questo articolo" className="hidden lg:col-start-1 lg:row-start-2 lg:mt-10 lg:block">
      <div className="sticky top-8 border-t border-hair pt-8">
        <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-muted">In questo articolo</p>
        <ol className="mt-3 grid gap-1 border-l border-hair">
          {items.map((t) => {
            const current = t.id === active;
            return (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  aria-current={current ? "location" : undefined}
                  className={`-ml-px block rounded-r-lg border-l-2 py-1.5 pl-3 pr-2 text-[15px] leading-snug text-accent-text underline-offset-4 transition-colors hover:underline focus-visible:underline motion-reduce:transition-none ${
                    current
                      ? "border-accent-text bg-accent-soft font-semibold"
                      : "border-transparent font-medium hover:border-accent-text/40"
                  }`}
                >
                  {t.text}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
