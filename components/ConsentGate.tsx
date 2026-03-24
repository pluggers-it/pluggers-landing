"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Shield } from "lucide-react";
import { useConsent } from "@/lib/consent";

/**
 * Full-page consent gate — blocks all interaction until the user
 * explicitly accepts Privacy Policy and Terms of Service.
 *
 * GDPR compliance notes:
 *  - Privacy Policy + T&C: required to access the service (Art. 6(1)(b) GDPR).
 *    Both require an explicit tick — no pre-checked boxes.
 *  - Analytics cookies: freely given, separate optional checkbox (Art. 7 GDPR).
 *    Pre-checked for convenience but the user can uncheck it — this is valid
 *    because the service is accessible regardless of this choice.
 *  - The "Continua" button stays disabled until both required boxes are ticked.
 *  - Both documents open in a new tab so the user can read without losing state.
 */
export function ConsentGate() {
  const { termsAccepted, acceptAll, acceptNecessary } = useConsent();

  const [privacyChecked,   setPrivacyChecked]   = useState(false);
  const [termsChecked,     setTermsChecked]      = useState(false);
  const [analyticsChecked, setAnalyticsChecked]  = useState(true);

  const canProceed = privacyChecked && termsChecked;

  function handleContinue() {
    if (!canProceed) return;
    analyticsChecked ? acceptAll() : acceptNecessary();
  }

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
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
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
            background: "rgba(7,7,10,0.97)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.05)",
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
                  Per accedere al sito conferma di aver letto e di accettare i
                  documenti qui sotto. Puoi anche scegliere se abilitare i
                  cookie analitici.
                </p>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="mt-5 space-y-3">

              {/* Privacy Policy — required */}
              <CheckRow
                id="consent-privacy"
                checked={privacyChecked}
                onChange={setPrivacyChecked}
                required
                label={
                  <>
                    Ho letto e accetto la{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--color-foreground)] underline underline-offset-2 hover:text-[var(--color-accent)]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Privacy Policy
                    </Link>
                    {" "}(trattamento dati personali — GDPR)
                  </>
                }
                badge="RICHIESTO"
                badgeColor="emerald"
              />

              {/* T&C — required */}
              <CheckRow
                id="consent-terms"
                checked={termsChecked}
                onChange={setTermsChecked}
                required
                label={
                  <>
                    Ho letto e accetto i{" "}
                    <Link
                      href="/termini"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[var(--color-foreground)] underline underline-offset-2 hover:text-[var(--color-accent)]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Termini e Condizioni
                    </Link>
                    {" "}di utilizzo del servizio
                  </>
                }
                badge="RICHIESTO"
                badgeColor="emerald"
              />

              {/* Analytics — optional */}
              <CheckRow
                id="consent-analytics"
                checked={analyticsChecked}
                onChange={setAnalyticsChecked}
                label={
                  <>
                    Acconsento all&apos;uso di{" "}
                    <span className="font-medium text-[var(--color-foreground)]">
                      cookie analitici
                    </span>
                    {" "}(GA4 + Clarity, statistiche anonime)
                  </>
                }
                badge="OPZIONALE"
                badgeColor="amber"
              />
            </div>

            {/* CTA */}
            <button
              onClick={handleContinue}
              disabled={!canProceed}
              className="mt-6 w-full rounded-2xl py-3.5 font-mono text-xs font-bold tracking-[0.18em] text-white transition"
              style={
                canProceed
                  ? {
                      background:
                        "linear-gradient(135deg, var(--color-accent), #a855f7)",
                      boxShadow: "0 4px 24px rgba(139,92,246,0.45)",
                      transform: "scale(1)",
                    }
                  : {
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.25)",
                      cursor: "not-allowed",
                    }
              }
            >
              {canProceed ? "CONTINUA" : "SPUNTA LE VOCI OBBLIGATORIE PER CONTINUARE"}
            </button>

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

// ── Internal checkbox row component ───────────────────────────────────────────
function CheckRow({
  id,
  checked,
  onChange,
  label,
  badge,
  badgeColor,
  required = false,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
  badge: string;
  badgeColor: "emerald" | "amber";
  required?: boolean;
}) {
  const colors = {
    emerald: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
    },
    amber: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
    },
  }[badgeColor];

  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
        checked
          ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5"
          : "border-[var(--color-border)] bg-white/[0.02] hover:border-[var(--color-accent)]/20"
      }`}
    >
      {/* Custom checkbox */}
      <div className="relative mt-0.5 h-5 w-5 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          required={required}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute inset-0 cursor-pointer opacity-0"
        />
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
            checked
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
              : "border-[var(--color-border)] bg-transparent"
          }`}
        >
          {checked && (
            <svg
              className="h-3 w-3 text-white"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Label + badge */}
      <div className="flex flex-1 flex-wrap items-start justify-between gap-2">
        <span className="text-sm leading-relaxed text-[var(--color-muted)]">
          {label}
        </span>
        <span
          className={`shrink-0 self-start rounded-full border px-2 py-0.5 font-mono text-[10px] ${colors.border} ${colors.bg} ${colors.text}`}
        >
          {badge}
        </span>
      </div>
    </label>
  );
}
