"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useConsent } from "@/lib/consent";

/**
 * Non-blocking cookie consent banner.
 *
 * - Visible at the bottom only when the user hasn't made a cookie choice yet.
 * - Does NOT block access to the site (GDPR Art. 7 — consent must be freely given).
 * - Privacy Policy + T&C acceptance is handled at form level (waitlist/newsletter).
 * - "Accetta" → consent granted.  "Solo tecnici" → consent denied.
 */
export function ConsentGate() {
  const { analyticsConsent, acceptAll, acceptNecessary } = useConsent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Don't render during SSR or once a choice has been made
  if (!mounted || analyticsConsent !== null) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="cookie-banner"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        exit={{ y: 24,  opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2"
        role="dialog"
        aria-label="Preferenze cookie"
        aria-live="polite"
      >
        <div
          className="flex flex-col gap-4 rounded-3xl border border-[var(--color-border)] p-5 sm:flex-row sm:items-center sm:gap-5"
          style={{
            background: "rgba(7,7,10,0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* Icon */}
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
            style={{
              background: "rgba(139,92,246,0.15)",
              border: "1px solid rgba(139,92,246,0.30)",
            }}
          >
            <Cookie className="h-5 w-5 text-[var(--color-accent)]" />
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="font-sans text-sm font-semibold leading-snug">
              Utilizziamo i cookie
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-muted)]">
              Usiamo cookie tecnici necessari al funzionamento del sito.{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 transition hover:text-[var(--color-foreground)]"
              >
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={acceptNecessary}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-foreground)]"
            >
              Solo tecnici
            </button>
            <button
              onClick={acceptAll}
              className="rounded-xl px-4 py-2 font-mono text-[11px] font-semibold tracking-[0.12em] text-white transition hover:scale-[1.03]"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-accent), #a855f7)",
                boxShadow: "0 2px 12px rgba(139,92,246,0.40)",
              }}
            >
              Accetta
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
