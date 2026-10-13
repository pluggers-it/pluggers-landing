"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { useConsent } from "@/lib/consent";
import { useReducedMotionSafe } from "@/components/landing/useReducedMotionSafe";

/**
 * "Back to top" button, bottom-left. It appears once the reader has scrolled
 * past the page's opening section (the hero on the home), and stays out of the
 * way of the cookie banner, which owns the bottom edge until a choice is made.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { choice } = useConsent();
  const reduced = useReducedMotionSafe();
  const pathname = usePathname();

  useEffect(() => {
    // a screen down on pages without a section
    const hero = document.querySelector("main section");
    const onScroll = () =>
      setVisible(hero ? hero.getBoundingClientRect().bottom < 0 : window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (choice === null) return null;

  return (
    <button
      type="button"
      aria-label="Torna su"
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] shadow-[var(--shadow-card)] transition-[opacity,transform] duration-200 hover:bg-[var(--surface-rest)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] active:scale-95 motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))", left: "max(1rem, env(safe-area-inset-left))" }}
    >
      <ArrowUp aria-hidden="true" className="h-5 w-5" strokeWidth={2.25} />
    </button>
  );
}
