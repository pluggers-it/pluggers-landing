"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`;

const SELECT_STYLE = {
  backgroundImage: SELECT_ARROW,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 1rem center",
  backgroundSize: "1.25rem",
};

const INPUT_CLASS =
  "h-12 w-full rounded-2xl border border-[var(--color-border)] bg-black/10 px-4 font-mono text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]";

const SELECT_CLASS = `${INPUT_CLASS} appearance-none`;

const OPT = "bg-[#07070a]";

type UserType = "professionista" | "utente";

interface Props {
  badge?: string;
  title?: string;
  description?: string;
  successMessage?: string;
  formName?: string;
  submissionSource?: "waitlist" | "newsletter";
}

export function WaitlistForm({
  badge = "WAITLIST APERTA",
  title = "Accedi prima di tutti gli altri.",
  description = "Inserisci la tua email e ti contatteremo nel momento in cui il servizio sarà attivo nella tua area. Aggiornamenti rari, mai irrilevanti.",
  successMessage = "Sei in lista! Ti contatteremo presto.",
  formName = "waitlist",
  submissionSource = "waitlist",
}: Props) {
  const [userType, setUserType]             = useState<UserType>("professionista");
  const [firstName, setFirstName]           = useState("");
  const [lastName, setLastName]             = useState("");
  const [phone, setPhone]                   = useState("");
  const [region, setRegion]                 = useState("");
  const [email, setEmail]                   = useState("");
  const [profession, setProfession]         = useState("");
  const [otherProfession, setOtherProfession] = useState("");
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked]     = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [submitted, setSubmitted]           = useState(false);
  const [error, setError]                   = useState<string | null>(null);

  function handleUserTypeChange(type: UserType) {
    setUserType(type);
    setProfession("");
    setOtherProfession("");
  }

  const resolvedProfession =
    userType === "utente"
      ? "utente"
      : profession === "altro"
      ? otherProfession
      : profession;

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] p-6 sm:p-8"
      style={{ background: "var(--color-panel)", backdropFilter: "blur(20px)" }}
    >
      {/* Purple glow */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)",
        }}
      />

      <div className="relative">
        {/* Badge */}
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
          {badge}
        </div>

        <h2 className="mt-3 font-sans text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{description}</p>

        {submitted ? (
          <div className="mt-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center font-mono text-sm text-emerald-400">
            {successMessage}
          </div>
        ) : (
          <form
            className="mt-5 flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!privacyChecked || !termsChecked) {
                setError("Devi accettare la Privacy Policy e i Termini e Condizioni.");
                return;
              }
              setError(null);
              setSubmitting(true);
              try {
                const res = await fetch("/api/waitlist", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email,
                    firstName,
                    lastName,
                    phone,
                    region,
                    profession: resolvedProfession,
                    source: submissionSource,
                    privacyAccepted: true,
                  }),
                });
                if (res.ok) {
                  setSubmitted(true);
                } else {
                  const data = (await res.json().catch(() => null)) as {
                    error?: string;
                  } | null;
                  setError(data?.error ?? "Qualcosa è andato storto");
                }
              } catch {
                setError("Errore di connessione");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {/* ── User type toggle ─────────────────────────────────────────── */}
            <div
              className="flex gap-2 rounded-2xl border border-[var(--color-border)] p-1"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              {(["professionista", "utente"] as UserType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleUserTypeChange(type)}
                  className="flex-1 rounded-xl py-2.5 font-mono text-xs tracking-[0.14em] transition-all"
                  style={
                    userType === type
                      ? {
                          background:
                            "linear-gradient(135deg, var(--color-accent), #a855f7)",
                          color: "#fff",
                          boxShadow: "0 2px 12px rgba(139,92,246,0.35)",
                        }
                      : {
                          color: "var(--color-muted)",
                        }
                  }
                >
                  {type === "professionista" ? "SONO UN PROFESSIONISTA" : "SONO UN UTENTE"}
                </button>
              ))}
            </div>

            {/* ── Common fields: Nome | Cognome | Regione | Telefono ───────── */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text" required value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Nome" className={INPUT_CLASS}
              />
              <input
                type="text" required value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Cognome" className={INPUT_CLASS}
              />
              <select
                required value={region}
                onChange={(e) => setRegion(e.target.value)}
                className={SELECT_CLASS} style={SELECT_STYLE}
              >
                <option value="" disabled className={OPT}>Regione</option>
                <option value="Abruzzo" className={OPT}>Abruzzo</option>
                <option value="Basilicata" className={OPT}>Basilicata</option>
                <option value="Calabria" className={OPT}>Calabria</option>
                <option value="Campania" className={OPT}>Campania</option>
                <option value="Emilia-Romagna" className={OPT}>Emilia-Romagna</option>
                <option value="Friuli-Venezia Giulia" className={OPT}>Friuli-Venezia Giulia</option>
                <option value="Lazio" className={OPT}>Lazio</option>
                <option value="Liguria" className={OPT}>Liguria</option>
                <option value="Lombardia" className={OPT}>Lombardia</option>
                <option value="Marche" className={OPT}>Marche</option>
                <option value="Molise" className={OPT}>Molise</option>
                <option value="Piemonte" className={OPT}>Piemonte</option>
                <option value="Puglia" className={OPT}>Puglia</option>
                <option value="Sardegna" className={OPT}>Sardegna</option>
                <option value="Sicilia" className={OPT}>Sicilia</option>
                <option value="Toscana" className={OPT}>Toscana</option>
                <option value="Trentino-Alto Adige" className={OPT}>Trentino-Alto Adige</option>
                <option value="Umbria" className={OPT}>Umbria</option>
                <option value="Valle d&apos;Aosta" className={OPT}>Valle d&apos;Aosta</option>
                <option value="Veneto" className={OPT}>Veneto</option>
              </select>
              <input
                type="tel" required value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Numero di telefono"
                pattern="^\+?[\d\s\-\(\)]{7,20}$"
                className={INPUT_CLASS}
              />
            </div>

            {/* ── Email + Profession (profession only for professionals) ────── */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@email.com" className={INPUT_CLASS}
              />

              <AnimatePresence mode="wait">
                {userType === "professionista" ? (
                  <motion.div
                    key="profession-select"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <select
                      required value={profession}
                      onChange={(e) => {
                        setProfession(e.target.value);
                        if (e.target.value !== "altro") setOtherProfession("");
                      }}
                      className={SELECT_CLASS} style={SELECT_STYLE}
                    >
                      <option value="" disabled className={OPT}>Professione</option>
                      <option value="idraulico" className={OPT}>Idraulico</option>
                      <option value="elettricista" className={OPT}>Elettricista</option>
                      <option value="muratore" className={OPT}>Muratore</option>
                      <option value="fabbro" className={OPT}>Fabbro</option>
                      <option value="falegname" className={OPT}>Falegname</option>
                      <option value="imbianchino" className={OPT}>Imbianchino</option>
                      <option value="piastrellista" className={OPT}>Piastrellista</option>
                      <option value="carpentiere" className={OPT}>Carpentiere</option>
                      <option value="saldatore" className={OPT}>Saldatore</option>
                      <option value="serramentista" className={OPT}>Serramentista</option>
                      <option value="vetraio" className={OPT}>Vetraio</option>
                      <option value="tappezziere" className={OPT}>Tappezziere</option>
                      <option value="giardiniere" className={OPT}>Giardiniere</option>
                      <option value="manovale" className={OPT}>Manovale</option>
                      <option value="gessista" className={OPT}>Gessista</option>
                      <option value="lattoniere" className={OPT}>Lattoniere</option>
                      <option value="termoidraulico" className={OPT}>Termoidraulico</option>
                      <option value="frigorista" className={OPT}>Frigorista</option>
                      <option value="ascensorista" className={OPT}>Ascensorista</option>
                      <option value="altro" className={OPT}>Altro</option>
                    </select>
                  </motion.div>
                ) : (
                  <motion.div
                    key="user-label"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-12 items-center rounded-2xl border border-[var(--color-border)] bg-black/10 px-4"
                  >
                    <span className="font-mono text-sm text-[var(--color-muted)]">
                      👤 Utente finale
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* "Altro" profession free-text */}
            <AnimatePresence>
              {userType === "professionista" && profession === "altro" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <input
                    type="text" required value={otherProfession}
                    onChange={(e) => setOtherProfession(e.target.value)}
                    placeholder="Specifica la tua professione"
                    className={INPUT_CLASS}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Legal checkboxes ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <LegalCheckbox
                id="privacy-check"
                checked={privacyChecked}
                onChange={setPrivacyChecked}
              >
                Ho letto e accetto la{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-foreground)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </Link>
                {" "}e acconsento al trattamento dei dati.
              </LegalCheckbox>

              <LegalCheckbox
                id="terms-check"
                checked={termsChecked}
                onChange={setTermsChecked}
              >
                Ho letto e accetto i{" "}
                <Link
                  href="/termini"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-foreground)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  Termini e Condizioni
                </Link>
                {" "}di utilizzo del servizio.
              </LegalCheckbox>
            </div>

            <button
              type="submit"
              disabled={submitting || !privacyChecked || !termsChecked}
              className="h-12 w-full rounded-2xl px-8 font-mono text-xs font-semibold tracking-[0.2em] text-white transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: "linear-gradient(135deg, var(--color-accent), #a855f7)",
                boxShadow: "0 4px 20px rgba(139,92,246,0.40)",
              }}
            >
              {submitting ? "..." : "ISCRIVITI"}
            </button>

            {error && (
              <p className="font-mono text-xs text-red-500">{error}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

// ── Reusable legal checkbox ────────────────────────────────────────────────────
function LegalCheckbox({
  id,
  checked,
  onChange,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors ${
        checked
          ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5"
          : "border-[var(--color-border)] bg-black/5"
      }`}
    >
      {/* Custom checkbox */}
      <div className="relative mt-0.5 h-4 w-4 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute inset-0 cursor-pointer opacity-0"
        />
        <div
          className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
            checked
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
              : "border-[var(--color-border)] bg-transparent"
          }`}
        >
          {checked && (
            <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
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
      <span className="leading-relaxed text-[var(--color-muted)]">{children}</span>
    </label>
  );
}
