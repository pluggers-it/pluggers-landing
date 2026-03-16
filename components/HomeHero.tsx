"use client";

import Link from "next/link";
import { ArrowRight, BellRing, Zap, Star, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PlugSpinner } from "@/components/PlugSpinner";
import { useEffect, useState } from "react";

const ROTATING_WORDS = ["idraulici", "elettricisti", "muratori", "carpentieri", "imbianchini"];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export function HomeHero() {
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setWordIdx((i) => (i + 1) % ROTATING_WORDS.length), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="relative mt-10 flex flex-1 flex-col items-center justify-center py-10 sm:mt-16">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid w-full items-center gap-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
      >
        {/* ── Left: text block ── */}
        <div className="flex flex-col items-start">

          {/* Live badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(139,92,246,0.40)] bg-[rgba(139,92,246,0.10)] px-4 py-1.5 font-mono text-[10px] tracking-[0.26em] text-[var(--color-accent)] backdrop-blur">
              <motion.span
                className="inline-flex h-2 w-2 rounded-full bg-[#facc15]"
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              MATCH IN TEMPO REALE
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="mt-5 max-w-lg font-sans text-[2.75rem] font-bold leading-[1.12] tracking-tight sm:text-6xl"
          >
            Il professionista giusto,{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[var(--color-accent)] via-[#a855f7] to-[#38bdf8] bg-clip-text text-transparent">
                al momento
              </span>
            </span>{" "}
            giusto.
          </motion.h1>

          {/* Rotating category */}
          <motion.div
            variants={fadeUp}
            className="mt-4 flex items-center gap-2 font-mono text-sm text-[var(--color-muted)]"
          >
            <span>Trova</span>
            <span className="inline-flex h-8 overflow-hidden" style={{ minWidth: "7.5rem" }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIdx}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.32, ease: "easeInOut" }}
                  className="inline-block font-semibold text-[var(--color-foreground)]"
                >
                  {ROTATING_WORDS[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span>in pochi tap.</span>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-md text-[15px] leading-7 text-[var(--color-muted)]"
          >
            Pluggers è il marketplace che connette chi cerca un lavoratore locale
            di fiducia con i migliori professionisti della zona — verificati,
            disponibili, pronti.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="#waitlist"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[#a855f7] px-7 py-3.5 font-mono text-sm font-medium text-white shadow-[0_8px_40px_rgba(139,92,246,0.55)] transition hover:shadow-[0_8px_55px_rgba(139,92,246,0.75)] hover:scale-[1.03]"
            >
              <BellRing className="h-4 w-4" />
              Entra in Waitlist
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-6 py-3.5 font-mono text-sm text-[var(--color-foreground)] backdrop-blur transition hover:border-[var(--color-accent)]"
            >
              Vai al Blog
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* Social-proof mini stats */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center gap-6"
          >
            {[
              { icon: Users,  value: "500+",  label: "in waitlist" },
              { icon: Star,   value: "4.9",   label: "rating medio" },
              { icon: Zap,    value: "<2 min", label: "primo match" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <div className="flex items-center gap-1">
                  <Icon className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                  <span className="font-mono text-sm font-semibold">{value}</span>
                </div>
                <span className="font-mono text-[10px] tracking-widest text-[var(--color-muted)]">
                  {label.toUpperCase()}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: animated hub ── */}
        <motion.div variants={fadeUp} className="flex justify-center">
          <PlugSpinner />
        </motion.div>
      </motion.div>

      {/* ── Waitlist form ── */}
      <motion.section
        id="waitlist"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-20 w-full max-w-2xl"
      >
        <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 sm:p-8 backdrop-blur-xl">
          {/* bg glow inside card */}
          <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.25),transparent_70%)] blur-2xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(139,92,246,0.35)] bg-[rgba(139,92,246,0.10)] px-3 py-1 font-mono text-[10px] tracking-[0.24em] text-[var(--color-accent)]">
              <motion.span
                className="inline-flex h-1.5 w-1.5 rounded-full bg-[#facc15]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              WAITLIST APERTA
            </div>

            <h2 className="mt-3 font-sans text-xl font-semibold tracking-tight sm:text-2xl">
              Sii tra i primi a provarlo.
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Lascia la tua mail — ti avvisiamo non appena Pluggers arriva nella
              tua zona. Zero spam, solo la notifica giusta.
            </p>

            <form className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="la-tua@mail.com"
                className="h-12 flex-1 rounded-2xl border border-[var(--color-border)] bg-black/20 px-4 font-mono text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/30"
              />
              <button
                type="button"
                className="h-12 rounded-2xl bg-gradient-to-r from-[var(--color-accent)] to-[#a855f7] px-8 font-mono text-xs font-semibold tracking-[0.2em] text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)] transition hover:shadow-[0_4px_32px_rgba(139,92,246,0.65)] hover:scale-[1.02]"
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
