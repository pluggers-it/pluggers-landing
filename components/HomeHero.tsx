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
];

// Each word shown for 1.4s; spinner reveals after 3 professions (~4.2s)
const WORD_DURATION_MS = 1400;
const SPINNER_REVEAL_MS = 3 * WORD_DURATION_MS;

export function HomeHero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [spinnerReady, setSpinnerReady] = useState(false);

  // Waitlist form state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profession, setProfession] = useState("");
  const [otherProfession, setOtherProfession] = useState("");
  const [region, setRegion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);

  useEffect(() => {
    // Cycle words
    const id = setInterval(
      () => setWordIdx((i) => (i + 1) % PROFESSIONS.length),
      WORD_DURATION_MS
    );
    // Reveal spinner after 3 professions instead of a full cycle
    const revealId = setTimeout(() => setSpinnerReady(true), SPINNER_REVEAL_MS);
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
        className="mt-20 w-full max-w-3xl"
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
              Accedi prima di tutti gli altri.
            </h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Inserisci la tua email e ti contatteremo nel momento in cui il
              servizio sarà attivo nella tua area. Aggiornamenti rari, mai irrilevanti.
            </p>

            {submitted ? (
              <div className="mt-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center font-mono text-sm text-emerald-400">
                Sei in lista! Ti contatteremo presto.
              </div>
            ) : (
              <form
                className="mt-5 flex flex-col gap-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setWaitlistError(null);
                  setSubmitting(true);
                  try {
                    const res = await fetch("/api/waitlist", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email,
                        firstName,
                        lastName,
                        region,
                        profession: profession === "altro" ? otherProfession : profession
                      }),
                    });
                    if (res.ok) {
                      setSubmitted(true);
                    } else {
                      const data = (await res.json().catch(() => null)) as
                        | { error?: string }
                        | null;
                      setWaitlistError(data?.error ?? "Something went wrong");
                    }
                  } catch {
                    setWaitlistError("Connection error");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Nome"
                    className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-black/10 px-4 font-mono text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]"
                  />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Cognome"
                    className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-black/10 px-4 font-mono text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]"
                  />
                  <select
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-black/10 px-4 font-mono text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)] appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "1.25rem" }}
                  >
                    <option value="" disabled className="bg-[#07070a]">Regione</option>
                    <option value="Abruzzo" className="bg-[#07070a]">Abruzzo</option>
                    <option value="Basilicata" className="bg-[#07070a]">Basilicata</option>
                    <option value="Calabria" className="bg-[#07070a]">Calabria</option>
                    <option value="Campania" className="bg-[#07070a]">Campania</option>
                    <option value="Emilia-Romagna" className="bg-[#07070a]">Emilia-Romagna</option>
                    <option value="Friuli-Venezia Giulia" className="bg-[#07070a]">Friuli-Venezia Giulia</option>
                    <option value="Lazio" className="bg-[#07070a]">Lazio</option>
                    <option value="Liguria" className="bg-[#07070a]">Liguria</option>
                    <option value="Lombardia" className="bg-[#07070a]">Lombardia</option>
                    <option value="Marche" className="bg-[#07070a]">Marche</option>
                    <option value="Molise" className="bg-[#07070a]">Molise</option>
                    <option value="Piemonte" className="bg-[#07070a]">Piemonte</option>
                    <option value="Puglia" className="bg-[#07070a]">Puglia</option>
                    <option value="Sardegna" className="bg-[#07070a]">Sardegna</option>
                    <option value="Sicilia" className="bg-[#07070a]">Sicilia</option>
                    <option value="Toscana" className="bg-[#07070a]">Toscana</option>
                    <option value="Trentino-Alto Adige" className="bg-[#07070a]">Trentino-Alto Adige</option>
                    <option value="Umbria" className="bg-[#07070a]">Umbria</option>
                    <option value="Valle d'Aosta" className="bg-[#07070a]">Valle d'Aosta</option>
                    <option value="Veneto" className="bg-[#07070a]">Veneto</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@email.com"
                    className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-black/10 px-4 font-mono text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]"
                  />
                  <select
                    required
                    value={profession}
                    onChange={(e) => {
                      setProfession(e.target.value);
                      if (e.target.value !== "altro") {
                        setOtherProfession("");
                      }
                    }}
                    className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-black/10 px-4 font-mono text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)] appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "1.25rem" }}
                  >
                    <option value="" disabled className="bg-[#07070a]">Professione</option>
                    <option value="idraulico" className="bg-[#07070a]">Idraulico</option>
                    <option value="elettricista" className="bg-[#07070a]">Elettricista</option>
                    <option value="muratore" className="bg-[#07070a]">Muratore</option>
                    <option value="carpentiere" className="bg-[#07070a]">Carpentiere</option>
                    <option value="imbianchino" className="bg-[#07070a]">Imbianchino</option>
                    <option value="altro" className="bg-[#07070a]">Altro</option>
                  </select>
                </div>

                {profession === "altro" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <input
                      type="text"
                      required
                      value={otherProfession}
                      onChange={(e) => setOtherProfession(e.target.value)}
                      placeholder="Specifica la tua professione"
                      className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-black/10 px-4 font-mono text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]"
                    />
                  </motion.div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="h-12 w-full rounded-2xl px-8 font-mono text-xs font-semibold tracking-[0.2em] text-white transition hover:scale-[1.02] disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, var(--color-accent), #a855f7)",
                      boxShadow: "0 4px 20px rgba(139,92,246,0.40)",
                    }}
                  >
                    {submitting ? "..." : "ISCRIVITI"}
                  </button>
                </div>
                {waitlistError && (
                  <div className="w-full font-mono text-xs text-red-500 sm:w-auto">
                    {waitlistError}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </motion.section>
    </main>
  );
}
