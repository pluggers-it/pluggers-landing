"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { useConsent } from "@/lib/consent";

/**
 * GDPR Cookie Consent Banner.
 *
 * - Visible only when the user hasn't made a choice yet (consent === null).
 * - Blocks ALL tracking scripts until "Accetta tutti" is clicked.
 * - "Solo necessari" stores "denied" — no analytics or tracking scripts load.
 * - Exits with a smooth slide animation once a choice is made.
 */
export function CookieBanner() {
  const { consent, accept, deny } = useConsent();

  return (
    <AnimatePresence>
      {consent === null && (
        <motion.div
          key="cookie-banner"
          role="dialog"
          aria-label="Preferenze cookie"
          aria-live="polite"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2"
          style={{ willChange: "transform, opacity" }}
        >
          <div
            className="flex flex-col gap-4 rounded-3xl border border-[var(--color-border)] p-5 sm:flex-row sm:items-center sm:gap-5"
            style={{
              background: "rgba(7,7,10,0.85)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {/* Icon */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.30)" }}
            >
              <Cookie className="h-4.5 w-4.5 text-[var(--color-accent)]" />
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="font-sans text-sm font-semibold leading-snug">
                Usiamo i cookie
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-muted)]">
                Utilizziamo cookie analitici per capire come migliorare il servizio.
                Nessun dato viene ceduto a terzi.{" "}
                <a
                  href="/privacy"
                  className="underline underline-offset-2 transition hover:text-[var(--color-foreground)]"
                >
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={deny}
                className="rounded-xl border border-[var(--color-border)] px-4 py-2 font-mono text-[11px] tracking-[0.15em] text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-foreground)]"
              >
                Solo necessari
              </button>
              <button
                onClick={accept}
                className="rounded-xl px-4 py-2 font-mono text-[11px] font-semibold tracking-[0.15em] text-white transition hover:scale-[1.03]"
                style={{
                  background: "linear-gradient(135deg, var(--color-accent), #a855f7)",
                  boxShadow: "0 2px 12px rgba(139,92,246,0.45)",
                }}
              >
                Accetta tutti
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
