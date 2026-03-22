"use client";

import Link from "next/link";
import { ArrowRight, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WaitlistForm } from "@/components/WaitlistForm";
import { useEffect, useState } from "react";

const PROFESSIONS = [
  "Idraulico",
  "Elettricista",
  "Muratore",
  "Fabbro",
  "Falegname",
  "Imbianchino",
  "Piastrellista",
  "Carpentiere",
  "Saldatore",
  "Serramentista",
  "Vetraio",
  "Tappezziere",
  "Giardiniere",
  "Manovale",
  "Gessista",
  "Lattoniere",
  "Termoidraulico",
  "Frigorista",
  "Ascensorista",
];

const WORD_DURATION_MS = 1400;

export function HomeHero() {
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setWordIdx((i) => (i + 1) % PROFESSIONS.length),
      WORD_DURATION_MS
    );
    return () => clearInterval(id);
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

        {/* Line 2 – cycling profession */}
        <div
          style={{
            marginTop: "clamp(0.25rem, 0.6vw, 0.5rem)",
            width: "100%",
            textAlign: "center",
            overflow: "visible",
          }}
        >
          <div
            style={{
              padding: "0.35em 0",
              overflow: "hidden",
              paddingBottom: "0.2em",
              paddingInline: "0.28em",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                className="font-sans font-extrabold italic tracking-tight"
                style={{
                  fontSize: "clamp(2.8rem, 7vw, 5.6rem)",
                  display: "inline-block",
                  lineHeight: 1.25,
                  paddingRight: "0.22em",
                  whiteSpace: "normal",
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
          L'applicazione che mette in contatto chi ha un problema con chi ha la soluzione.
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
            Unisciti alla Waitlist
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-7 py-4 font-mono text-sm text-[var(--color-foreground)] backdrop-blur transition hover:border-[var(--color-accent)]"
          >
            Scopri il Blog
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Waitlist form ── */}
      <motion.section
        id="waitlist"
        className="mt-20 w-full max-w-3xl"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
      >
        <WaitlistForm />
      </motion.section>
    </main>
  );
}
