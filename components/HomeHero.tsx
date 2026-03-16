"use client";

import Link from "next/link";
import { ArrowRight, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PlugSpinner } from "@/components/PlugSpinner";
import { useEffect, useState } from "react";

const PROFESSIONS = [
  "Idraulico",
  "Elettricista",
  "Carpentiere",
  "Muratore",
  "Imbianchino",
  "...e molti altri",
];

// Each word shown for 1.4s → 6 × 1.4 = 8.4s for one full cycle
const WORD_DURATION_MS = 1400;
const ONE_CYCLE_MS = PROFESSIONS.length * WORD_DURATION_MS; // 8400 ms

export function HomeHero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [spinnerReady, setSpinnerReady] = useState(false);

  useEffect(() => {
    // Cycle words
    const id = setInterval(
      () => setWordIdx((i) => (i + 1) % PROFESSIONS.length),
      WORD_DURATION_MS
    );
    // Reveal spinner after first full cycle
    const revealId = setTimeout(() => setSpinnerReady(true), ONE_CYCLE_MS);
    return () => {
      clearInterval(id);
      clearTimeout(revealId);
    };
  }, []);

  return (
    <main className="relative flex flex-1 flex-col items-center justify-start pb-16 pt-12">

      {/* ── Dynamic text stack ── */}
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        {/* Line 1 – static */}
        <h1
          className="font-sans font-bold leading-[1.08] tracking-tight"
          style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)" }}
        >
          IL PROFESSIONISTA GIUSTO,
        </h1>

        {/* Line 2 – cycling profession
             overflowY:hidden clips the slide animation; overflowX:visible
             lets long strings (e.g. "...e molti altri") breathe             */}
        <div
          style={{
            overflowX: "visible",
            overflowY: "hidden",
            marginTop: "clamp(0.25rem, 0.6vw, 0.5rem)",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div style={{ padding: "0.35em 0" }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                className="font-sans font-extrabold italic tracking-tight"
                style={{
                  fontSize: wordIdx === PROFESSIONS.length - 1
                    ? "clamp(1.5rem, 3.8vw, 3.2rem)"
                    : "clamp(2.8rem, 7vw, 5.6rem)",
                  display: "inline-block",
                  lineHeight: 1.15,
                  whiteSpace: wordIdx === PROFESSIONS.length - 1 ? "nowrap" : "normal",
                  background: "linear-gradient(135deg, var(--color-accent), #a855f7, #38bdf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%",  opacity: 1 }}
                exit={  { y: "-110%", opacity: 0 }}
                transition={{ duration: 0.38, ease: [0.32, 0, 0.67, 0] }}
              >
                {PROFESSIONS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Line 3 – static */}
        <h2
          className="font-sans font-bold leading-[1.08] tracking-tight"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 5rem)",
            marginTop: "clamp(0.3rem, 0.8vw, 0.6rem)",
          }}
        >
          AL MOMENTO GIUSTO.
        </h2>

        {/* Subtitle */}
        <motion.p
          className="mt-6 max-w-lg text-base leading-7 text-[var(--color-muted)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          Pluggers è il marketplace che connette chi ha un problema a chi ha una soluzione.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
        >
          <Link
            href="#waitlist"
            className="group inline-flex items-center gap-2.5 rounded-full px-8 py-4 font-mono text-sm font-semibold text-white transition hover:scale-[1.04]"
            style={{
              background: "linear-gradient(135deg, var(--color-accent), #a855f7)",
              boxShadow: "0 8px 40px rgba(139,92,246,0.55)",
            }}
          >
            <BellRing className="h-4 w-4" />
            Entra in Waitlist
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-7 py-4 font-mono text-sm text-[var(--color-foreground)] backdrop-blur transition hover:border-[var(--color-accent)]"
          >
            Vai al Blog
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Radial animation (unfolds after first cycle) ── */}
      <AnimatePresence>
        {spinnerReady && (
          <motion.div
            className="mt-10 flex w-full items-center justify-center overflow-visible"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <PlugSpinner revealDelay={0} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Waitlist form ── */}
      <motion.section
        id="waitlist"
        className="mt-20 w-full max-w-2xl"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
      >
        <div
          className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] p-6 sm:p-8"
          style={{ background: "var(--color-panel)", backdropFilter: "blur(20px)" }}
        >
          <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full blur-2xl"
               style={{ background: "radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)" }} />

          <div className="relative">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.24em]"
              style={{
                border: "1px solid rgba(139,92,246,0.40)",
                background: "rgba(139,92,246,0.10)",
                color: "var(--color-accent)",
              }}
            >
              <motion.span
                className="inline-flex h-1.5 w-1.5 rounded-full bg-[#facc15]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              WAITLIST APERTA
            </div>

            <h3 className="mt-3 font-sans text-xl font-semibold tracking-tight sm:text-2xl">
              Sii tra i primi a provarlo.
            </h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Lascia la tua mail — ti avvisiamo non appena Pluggers arriva nella
              tua zona. Zero spam, solo la notifica giusta.
            </p>

            <form className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="la-tua@mail.com"
                className="h-12 flex-1 rounded-2xl border border-[var(--color-border)] bg-black/10 px-4 font-mono text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]"
              />
              <button
                type="button"
                className="h-12 rounded-2xl px-8 font-mono text-xs font-semibold tracking-[0.2em] text-white transition hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, var(--color-accent), #a855f7)",
                  boxShadow: "0 4px 20px rgba(139,92,246,0.40)",
                }}
              >
                INVIA
              </button>
            </form>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
