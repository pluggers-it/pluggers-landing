"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Cookie } from "lucide-react";
import { ACCEPT_ALL, TECHNICAL_ONLY, useConsent } from "@/lib/consent";

const BUTTON = "h-11 rounded-full text-sm font-semibold transition";
const PRIMARY = `${BUTTON} bg-[var(--accent)] px-5 text-white hover:bg-[var(--accent-deep)]`;

/**
 * Non-blocking cookie consent banner.
 *
 * - Visible at the bottom only when the user hasn't made a cookie choice yet.
 * - Does NOT block access to the site (GDPR Art. 7 — consent must be freely given).
 * - Privacy Policy + T&C acceptance is handled at form level (waitlist/newsletter).
 * - "Accetta" → statistics and marketing.  "Solo tecnici" → neither.  "Scegli" → one by one, both off to start.
 */
export function ConsentGate() {
  const { choice, choose } = useConsent();
  const [mounted, setMounted] = useState(false);
  const [picking, setPicking] = useState(false);
  const [picked, setPicked] = useState(TECHNICAL_ONLY);
  const pathname = usePathname();

  // Show it from the frame after hydration, once the stored choice has been read.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Don't render during SSR or once a choice has been made
  // the QR page is held up to someone else's camera
  if (!mounted || choice !== null || pathname === "/qr") return null;

  // CSS entrance instead of framer-motion: keeps the animation library off every page but the home.
  return (
      <div
        className="consent-in fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2"
        role="dialog"
        aria-label="Preferenze cookie"
        aria-live="polite"
      >
        <div
          className="rounded-3xl border border-[var(--color-border)] p-5"
          style={{
            background: "var(--surface)",
            boxShadow: "0 24px 48px -24px rgba(23,21,26,0.35)",
          }}
        >
          <div className="flex gap-4">
            {/* Icon */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: "var(--accent-soft)" }}
            >
              <Cookie className="h-5 w-5 text-[var(--accent-text)]" />
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="font-sans text-sm font-semibold leading-snug">
                Utilizziamo i cookie
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-muted)]">
                Usiamo cookie tecnici, necessari al sito. Se accetti, usiamo anche i cookie di
                statistica di Google Analytics, per capire come viene usato il sito, e i cookie di
                marketing di Meta, per misurare le nostre pubblicità e mostrarle a chi lo ha
                visitato.{" "}
                {/* A full page load, not <Link>: leaving an invite page (/i/…) without reloading would keep its
                    address in this tab's history, where Google Analytics, once accepted, would read it on Back. */}
                <a
                  href="/privacy"
                  className="underline underline-offset-2 transition hover:text-[var(--color-foreground)]"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Actions */}
          {picking ? (
            <div className="mt-3 flex flex-col">
              <Switch
                label="Statistiche"
                detail="Google Analytics: quali pagine vengono visitate, in forma aggregata."
                checked={picked.analytics}
                onChange={(analytics) => setPicked({ ...picked, analytics })}
                autoFocus
              />
              <Switch
                label="Marketing"
                detail="Meta: misura le nostre pubblicità su Facebook e Instagram e le mostra a chi ha visitato il sito."
                checked={picked.marketing}
                onChange={(marketing) => setPicked({ ...picked, marketing })}
              />
              <button onClick={() => choose(picked)} className={`${PRIMARY} mt-2 self-end`}>
                Salva le scelte
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <button
                onClick={() => setPicking(true)}
                className={`${BUTTON} mr-auto px-3 text-[var(--accent-text)] hover:bg-[var(--accent-soft)]`}
              >
                Scegli
              </button>
              <button
                onClick={() => choose(TECHNICAL_ONLY)}
                className={`${BUTTON} border border-[var(--line)] px-4 text-[var(--ink)] hover:bg-[var(--page)]`}
              >
                Solo tecnici
              </button>
              <button onClick={() => choose(ACCEPT_ALL)} className={PRIMARY}>
                Accetta
              </button>
            </div>
          )}
        </div>
      </div>
  );
}

function Switch({
  label,
  detail,
  checked,
  onChange,
  autoFocus,
}: {
  label: string;
  detail: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  autoFocus?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      autoFocus={autoFocus}
      className="flex min-h-12 w-full items-center gap-4 rounded-2xl px-3 py-2 text-left transition hover:bg-[var(--page)]"
    >
      <span className="flex-1">
        <span className="block text-sm font-semibold text-[var(--ink)]">{label}</span>
        <span className="block text-xs leading-relaxed text-[var(--color-muted)]">{detail}</span>
      </span>
      <span
        aria-hidden
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${checked ? "bg-[var(--accent)]" : "bg-[var(--line)]"}`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none ${checked ? "translate-x-4" : ""}`}
        />
      </span>
    </button>
  );
}
