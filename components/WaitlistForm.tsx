"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236f6a76'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`;

const SELECT_STYLE = {
  backgroundImage: SELECT_ARROW,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 1rem center",
  backgroundSize: "1.25rem",
};

const INPUT_CLASS =
  "h-12 w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink outline-none transition placeholder:text-muted hover:border-ink focus:border-accent focus:ring-2 focus:ring-accent/25";

const SELECT_CLASS = `${INPUT_CLASS} appearance-none pr-11`;

const LABEL_CLASS = "mb-1.5 block text-sm font-medium text-ink";

/** A visible label tied to its control, so people, screen readers and agents read the same name. */
function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      {children}
    </div>
  );
}

const PROFESSIONS: [string, string][] = [
  ["idraulico", "Idraulico"], ["elettricista", "Elettricista"], ["muratore", "Muratore"],
  ["fabbro", "Fabbro"], ["falegname", "Falegname"], ["imbianchino", "Imbianchino"],
  ["piastrellista", "Piastrellista"], ["carpentiere", "Carpentiere"], ["saldatore", "Saldatore"],
  ["serramentista", "Serramentista"], ["vetraio", "Vetraio"], ["tappezziere", "Tappezziere"],
  ["giardiniere", "Giardiniere"], ["manovale", "Manovale"], ["gessista", "Gessista"],
  ["lattoniere", "Lattoniere"], ["termoidraulico", "Termoidraulico"], ["frigorista", "Frigorista"],
  ["ascensorista", "Ascensorista"], ["altro", "Altro"],
];

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
  title = "Non sei ancora nella tua zona? Lasciaci i dati.",
  description = "Ti scriviamo quando Pluggers arriva da te.",
  successMessage = "Dati ricevuti. Ti scriviamo noi.",
  submissionSource = "waitlist",
}: Props) {
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;
  const [userType, setUserType]             = useState<UserType>("professionista");
  const [firstName, setFirstName]           = useState("");
  const [lastName, setLastName]             = useState("");
  const [phone, setPhone]                   = useState("");
  const [city, setCity]                     = useState("");
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

  const canSubmit = privacyChecked && termsChecked && !submitting;

  return (
    <div className="rounded-card bg-surface p-6 shadow-card ring-1 ring-hair sm:p-8">
      <h3 className="text-balance text-[22px] font-bold leading-tight tracking-[-0.02em]">
        {title}
      </h3>
      <p className="mt-2 text-[15px] text-muted">{description}</p>

      {submitted ? (
        <p
          role="status"
          className="mt-6 rounded-2xl bg-accent-soft px-4 py-3 text-[15px] font-medium text-accent-deep dark:text-accent-text"
        >
          {successMessage}
        </p>
      ) : (
        <form
          className="mt-6 flex flex-col gap-3"
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
                  city,
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
            role="group"
            aria-label="Ti iscrivi come"
            className="grid grid-cols-2 gap-1 rounded-2xl bg-page p-1 dark:bg-surface-rest"
          >
            {(["professionista", "utente"] as UserType[]).map((type) => (
              <button
                key={type}
                type="button"
                aria-pressed={userType === type}
                onClick={() => handleUserTypeChange(type)}
                className="h-12 rounded-xl text-sm font-semibold text-muted transition hover:text-ink aria-pressed:bg-surface aria-pressed:text-ink aria-pressed:shadow-sm"
              >
                {type === "professionista" ? "Professionista" : "Cliente"}
              </button>
            ))}
          </div>

          {/* ── Common fields: Nome | Cognome | Città | Telefono ──────────── */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field id={fid("first-name")} label="Nome">
              <input
                id={fid("first-name")} name="firstName"
                type="text" required value={firstName} autoComplete="given-name"
                onChange={(e) => setFirstName(e.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
            <Field id={fid("last-name")} label="Cognome">
              <input
                id={fid("last-name")} name="lastName"
                type="text" required value={lastName} autoComplete="family-name"
                onChange={(e) => setLastName(e.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
            <Field id={fid("city")} label="Città">
              <input
                id={fid("city")} name="city"
                type="text" required value={city} maxLength={60}
                autoCapitalize="words" autoComplete="address-level2"
                onChange={(e) => setCity(e.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
            <Field id={fid("phone")} label="Telefono">
              <input
                id={fid("phone")} name="phone"
                type="tel" required value={phone} autoComplete="tel"
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+39 333 123 4567"
                pattern="^\+?[\d\s\-\(\)]{7,20}$"
                className={INPUT_CLASS}
              />
            </Field>
          </div>

          {/* ── Email + Profession (profession only for professionals) ────── */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className={userType === "utente" ? "sm:col-span-2" : ""}>
              <Field id={fid("email")} label="Email">
                <input
                  id={fid("email")} name="email"
                  type="email" required value={email} autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@email.com"
                  className={INPUT_CLASS}
                />
              </Field>
            </div>

            {userType === "professionista" && (
              <Field id={fid("profession")} label="Professione">
                <select
                  id={fid("profession")} name="profession"
                  required value={profession}
                  onChange={(e) => {
                    setProfession(e.target.value);
                    if (e.target.value !== "altro") setOtherProfession("");
                  }}
                  className={`${SELECT_CLASS} ${profession ? "" : "text-muted"}`} style={SELECT_STYLE}
                >
                  <option value="" disabled>Scegli</option>
                  {PROFESSIONS.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </Field>
            )}
          </div>

          {/* "Altro" profession free-text */}
          {userType === "professionista" && profession === "altro" && (
            <Field id={fid("other-profession")} label="La tua professione">
              <input
                id={fid("other-profession")} name="otherProfession"
                type="text" required value={otherProfession}
                onChange={(e) => setOtherProfession(e.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
          )}

          {/* ── Legal checkboxes ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-1">
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
                className="font-medium text-accent-text underline underline-offset-2"
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
                className="font-medium text-accent-text underline underline-offset-2"
                onClick={(e) => e.stopPropagation()}
              >
                Termini e Condizioni
              </Link>
              {" "}di utilizzo del servizio.
            </LegalCheckbox>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            aria-busy={submitting}
            className="mt-1 h-12 w-full rounded-full bg-accent text-[15px] font-semibold text-white transition hover:bg-accent-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent dark:hover:bg-accent-bright"
          >
            {submitting ? "Invio…" : "Iscriviti"}
          </button>

          {error && (
            <p role="alert" className="text-sm font-medium text-danger">{error}</p>
          )}
        </form>
      )}
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
      className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl px-1 py-2 text-sm leading-relaxed text-muted transition hover:text-ink"
    >
      <span className="relative mt-0.5 h-5 w-5 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute inset-0 h-5 w-5 cursor-pointer appearance-none rounded-md border border-line bg-surface transition checked:border-accent checked:bg-accent"
        />
        <Check
          className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 text-white opacity-0 transition peer-checked:opacity-100"
          strokeWidth={3}
          aria-hidden
        />
      </span>
      <span>{children}</span>
    </label>
  );
}
