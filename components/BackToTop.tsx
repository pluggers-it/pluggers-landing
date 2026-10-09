"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useConsent } from "@/lib/consent";
import { useReducedMotionSafe } from "@/components/landing/useReducedMotionSafe";

/**
 * "Back to top" button, bottom-left. It appears once the reader is
 * a screen and a half down, and stays out of the way of the cookie banner,
 * which owns the bottom edge until a choice is made.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { analyticsConsent } = useConsent();
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (analyticsConsent === null) return null;

  return (
    <button
      type="button"
      aria-label="Torna su"
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] shadow-[var(--shadow-card)] transition-[opacity,transform] duration-200 hover:bg-[var(--surface-rest)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] active:scale-95 motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <ArrowUp aria-hidden="true" className="h-5 w-5" strokeWidth={2.25} />
    </button>
  );
}
