"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Shield } from "lucide-react";
import { useConsent } from "@/lib/consent";

/**
 * Full-page consent gate — blocks all interaction until the user
 * accepts the Terms of Service and Privacy Policy.
 *
 * GDPR compliance notes:
 *  - T&C + Privacy: required to access the service (Art. 6(1)(b) GDPR).
 *  - Analytics cookies: freely given, separate choice (Art. 7 GDPR).
 *    "Accetta tutto"         → T&C + Privacy + analytics granted.
 *    "Solo cookie tecnici"   → T&C + Privacy accepted, analytics denied.
 *  - No pre-ticked boxes; no deceptive UI patterns.
 *  - Gate disappears permanently once a choice is stored in localStorage.
 */
export function ConsentGate() {
  const { termsAccepted, acceptAll, acceptNecessary } = useConsent();

  // null = still hydrating (SSR) → don't flash the gate
  if (termsAccepted !== false) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="consent-gate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[9999] flex items-end justify-center px-4 pb-4 sm:items-center sm:pb-0"
        style={{
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        aria-modal="true"
        role="dialog"
        aria-label="Consenso obbligatorio"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-lg overflow-hidden rounded-3xl border border-[var(--color-border)]"
          style={{
            background: "rgba(7,7,10,0.95)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Top accent bar */}
          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, var(--color-accent), #a855f7, #38bdf8)",
            }}
          />

          <div className="px-6 py-7 sm:px-8 sm:py-8">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: "rgba(139,92,246,0.15)",
                  border: "1px solid rgba(139,92,246,0.30)",
                }}
              >
                <Shield className="h-5 w-5 text-[var(--color-accent)]" />
              </div>
              <div>
                <h2 className="font-sans text-base font-bold leading-snug tracking-tight">
                  Prima di continuare
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">
                  Per accedere al sito è necessario accettare i nostri documenti
                  legali. Utilizziamo anche cookie analitici per migliorare
                  l&apos;esperienza — puoi scegliere se includerli.
                </p>
              </div>
            </div>

            {/* Legal docs summary */}
            <div
              className="mt-5 space-y-2 rounded-2xl border border-[var(--color-border)] p-4"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span className="text-[var(--color-muted)]">
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--color-foreground)] underline underline-offset-2 hover:text-[var(--color-accent)]"
                    >
                      Privacy Policy
                    </Link>
                    {" "}— trattamento dei tuoi dati (GDPR)
                  </span>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                  RICHIESTO
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span className="text-[var(--color-muted)]">
                    <Link
                      href="/termini"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--color-foreground)] underline underline-offset-2 hover:text-[var(--color-accent)]"
                    >
                      Termini e Condizioni
                    </Link>
                    {" "}— regole di utilizzo del servizio
                  </span>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                  RICHIESTO
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span className="text-[var(--color-muted)]">
                    <span className="font-medium text-[var(--color-foreground)]">
                      Cookie analitici
                    </span>
                    {" "}— statistiche anonime (GA4 + Clarity)
                  </span>
                </div>
                <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-400">
                  OPZIONALE
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {/* Primary CTA */}
              <button
                onClick={acceptAll}
                className="flex-1 rounded-2xl py-3.5 font-mono text-xs font-bold tracking-[0.18em] text-white transition hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-accent), #a855f7)",
                  boxShadow: "0 4px 24px rgba(139,92,246,0.45)",
                }}
              >
                ACCETTA E CONTINUA
              </button>

              {/* Secondary: accept terms, deny analytics */}
              <button
                onClick={acceptNecessary}
                className="flex-1 rounded-2xl border border-[var(--color-border)] py-3.5 font-mono text-xs text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-foreground)]"
              >
                Solo cookie tecnici
              </button>
            </div>

            <p className="mt-4 text-center font-mono text-[10px] leading-relaxed text-[var(--color-muted)] opacity-60">
              Puoi revocare il consenso in qualsiasi momento scrivendo a{" "}
              <a
                href="mailto:support@plggrs.it"
                className="underline underline-offset-2 hover:opacity-100"
              >
                support@plggrs.it
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
