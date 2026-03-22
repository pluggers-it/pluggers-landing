"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { trackFormStart, trackFormSubmit } from "@/lib/analytics";

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

interface Props {
  badge?: string;
  title?: string;
  description?: string;
  successMessage?: string;
  /** GA4 form_name used in form_start / form_submit events */
  formName?: string;
}

export function WaitlistForm({
  badge = "WAITLIST APERTA",
  title = "Accedi prima di tutti gli altri.",
  description = "Inserisci la tua email e ti contatteremo nel momento in cui il servizio sarà attivo nella tua area. Aggiornamenti rari, mai irrilevanti.",
  successMessage = "Sei in lista! Ti contatteremo presto.",
  formName = "waitlist",
}: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [otherProfession, setOtherProfession] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fire form_start only on the first interaction
  const startFired = useRef(false);
  function onFirstInteraction() {
    if (startFired.current) return;
    startFired.current = true;
    trackFormStart(formName);
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] p-6 sm:p-8"
      style={{ background: "var(--color-panel)", backdropFilter: "blur(20px)" }}
    >
      {/* Purple glow */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)" }}
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
                    profession: profession === "altro" ? otherProfession : profession,
                  }),
                });
                if (res.ok) {
                  setSubmitted(true);
                  trackFormSubmit(formName);
                } else {
                  const data = (await res.json().catch(() => null)) as { error?: string } | null;
                  setError(data?.error ?? "Qualcosa è andato storto");
                }
              } catch {
                setError("Errore di connessione");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {/* Row 1: Nome | Cognome | Regione | Telefono */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text" required value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onFocus={onFirstInteraction}
                placeholder="Nome" className={INPUT_CLASS}
              />
              <input
                type="text" required value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onFocus={onFirstInteraction}
                placeholder="Cognome" className={INPUT_CLASS}
              />
              <select
                required value={region}
                onChange={(e) => setRegion(e.target.value)}
                onFocus={onFirstInteraction}
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
                <option value="Valle d'Aosta" className={OPT}>Valle d'Aosta</option>
                <option value="Veneto" className={OPT}>Veneto</option>
              </select>
              <input
                type="tel" required value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={onFirstInteraction}
                placeholder="Numero di telefono"
                pattern="^\+?[\d\s\-\(\)]{7,20}$"
                className={INPUT_CLASS}
              />
            </div>

            {/* Row 2: Email | Professione */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={onFirstInteraction}
                placeholder="nome@email.com" className={INPUT_CLASS}
              />
              <select
                required value={profession}
                onChange={(e) => {
                  setProfession(e.target.value);
                  if (e.target.value !== "altro") setOtherProfession("");
                }}
                onFocus={onFirstInteraction}
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
            </div>

            {/* "Altro" profession free-text */}
            {profession === "altro" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="text" required value={otherProfession}
                  onChange={(e) => setOtherProfession(e.target.value)}
                  placeholder="Specifica la tua professione"
                  className={INPUT_CLASS}
                />
              </motion.div>
            )}

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

            {error && (
              <p className="font-mono text-xs text-red-500">{error}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
