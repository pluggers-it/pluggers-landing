"use client";

import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import { metaEvent } from "@/lib/analytics";
import type { Role } from "@/lib/prelaunch";
import { MAX, splitContact, splitName, WAITLIST_TEXT } from "@/lib/waitlist";
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
function Field({
  id, label, optional, wide, children,
}: { id: string; label: string; optional?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
        {optional && <span className="font-normal text-muted"> ({optional})</span>}
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

const ROLES: [Role, string][] = [
  ["cliente", "Cerco un professionista"],
  ["pro", "Sono un professionista"],
];

/** A trade label from the site's pages as the select's value, or «Altro» with the label written in. */
function professionFor(trade: string | null): [string, string] {
  if (!trade) return ["", ""];
  const known = PROFESSIONS.find(([, label]) => label.toLowerCase() === trade.toLowerCase());
  return known ? [known[0], ""] : ["altro", trade];
}

interface Props {
  badge?: string;
  title?: string;
  description?: string;
  successMessage?: string;
  formName?: string;
  submissionSource?: "waitlist" | "newsletter";
  /**
   * The pre-registration: asks who is signing up, then the few things each needs (a client an email or phone and
   * the problem, a professional name, phone and trade), with only the privacy notice to accept.
   * `page` is the page the visitor came from.
   */
  prelaunch?: { role: Role | null; trade: string | null; page: string };
  /** Under the thanks, once sent. */
  afterSubmit?: React.ReactNode;
}

export function WaitlistForm({
  title = "Lasciaci i tuoi contatti",
  description = WAITLIST_TEXT,
  successMessage = "Dati ricevuti. Ti scriviamo noi.",
  submissionSource = "waitlist",
  prelaunch,
  afterSubmit,
}: Props) {
  const pathname = usePathname();
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;
  const [firstName, setFirstName]           = useState("");
  const [lastName, setLastName]             = useState("");
  const [fullName, setFullName]             = useState("");
  const [contact, setContact]               = useState("");
  const [phone, setPhone]                   = useState("");
  const [city, setCity]                     = useState("");
  const [email, setEmail]                   = useState("");
  const [role, setRole]                     = useState<Role | null>(prelaunch?.role ?? null);
  const [prefilled, prefilledOther]         = professionFor(prelaunch?.trade ?? null);
  const [profession, setProfession]         = useState(prefilled);
  const [otherProfession, setOtherProfession] = useState(prefilledOther);
  const [problem, setProblem]               = useState("");
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked]     = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [submitted, setSubmitted]           = useState(false);
  const [error, setError]                   = useState<string | null>(null);

  const resolvedProfession = profession === "altro" ? otherProfession : profession;
  // Before launch clients sign up too: their profession column says «cliente».
  const isClient = Boolean(prelaunch) && role === "cliente";

  // The pre-registration takes the privacy notice only: a waitlist sign-up is not a service contract.
  const canSubmit = privacyChecked && (Boolean(prelaunch) || termsChecked) && !submitting;

  return (
    <div className="rounded-card bg-surface p-6 shadow-card ring-1 ring-hair sm:p-8">
      <h3 className="text-balance text-[22px] font-bold leading-tight tracking-[-0.02em]">
        {title}
      </h3>
      <p className="mt-2 text-pretty text-[15px] text-muted">{description}</p>

      {submitted ? (
        <>
          <p
            role="status"
            className="mt-6 rounded-2xl bg-accent-soft px-4 py-3 text-[15px] font-medium text-accent-deep dark:text-accent-text"
          >
            {successMessage}
          </p>
          {afterSubmit}
        </>
      ) : (
        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!privacyChecked || (!prelaunch && !termsChecked)) {
              setError(
                prelaunch
                  ? "Devi leggere l'Informativa privacy."
                  : "Devi accettare la Privacy Policy e i Termini e Condizioni.",
              );
              return;
            }
            const clientContact = isClient ? splitContact(contact) : null;
            if (isClient && !clientContact) {
              setError("Scrivi un'email valida o un numero di telefono italiano.");
              return;
            }
            setError(null);
            setSubmitting(true);
            try {
              const who = !prelaunch
                ? { email, firstName, lastName, phone }
                : clientContact
                  ? { ...clientContact, firstName: fullName.trim(), lastName: "" }
                  : { ...splitName(fullName), email, phone };
              const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...who,
                  city,
                  profession: isClient ? "cliente" : resolvedProfession,
                  problem: isClient ? problem : "",
                  page: prelaunch?.page ?? pathname,
                  source: submissionSource,
                  privacyAccepted: true,
                }),
              });
              if (res.ok) {
                setSubmitted(true);
                metaEvent("track", "Lead", { content_name: prelaunch ? "preiscrizione" : submissionSource });
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
          {prelaunch && (
            <fieldset>
              <legend className={LABEL_CLASS}>Chi sei?</legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ROLES.map(([value, label]) => (
                  <label
                    key={value}
                    className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-line bg-surface px-4 text-[15px] font-semibold text-ink transition hover:border-ink has-checked:border-accent has-checked:bg-accent-soft"
                  >
                    <input
                      type="radio" name="role" value={value} required
                      checked={role === value}
                      onChange={() => setRole(value)}
                      className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border border-line bg-surface transition checked:border-[6px] checked:border-accent focus-visible:ring-2 focus-visible:ring-accent/25"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {prelaunch ? (
            role && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field key="name" id={fid("name")} label={isClient ? "Nome" : "Nome e cognome"}>
                  <input
                    id={fid("name")} name="name"
                    type="text" required value={fullName} autoComplete={isClient ? "given-name" : "name"}
                    maxLength={isClient ? MAX.name : MAX.name * 2 + 1}
                    onChange={(e) => setFullName(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </Field>

                {isClient ? (
                  <Field key="contact" id={fid("contact")} label="Email o telefono">
                    <input
                      id={fid("contact")} name="contact"
                      type="text" required value={contact} autoComplete="email" maxLength={MAX.email}
                      autoCapitalize="none" autoCorrect="off" spellCheck={false}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="nome@email.com o 333 123 4567"
                      className={INPUT_CLASS}
                    />
                  </Field>
                ) : (
                  <Field key="phone" id={fid("phone")} label="Telefono">
                    <input
                      id={fid("phone")} name="phone"
                      type="tel" required value={phone} autoComplete="tel"
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+39 333 123 4567"
                      pattern="^\+?[\d\s\-\(\)]{7,20}$"
                      className={INPUT_CLASS}
                    />
                  </Field>
                )}

                {!isClient && (
                  <Field key="profession" id={fid("profession")} label="Mestiere">
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

                <Field key="city" id={fid("city")} label="Città o CAP">
                  <input
                    id={fid("city")} name="city"
                    type="text" required value={city} maxLength={MAX.city}
                    autoCapitalize="words" autoComplete="address-level2"
                    onChange={(e) => setCity(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </Field>

                {!isClient && profession === "altro" && (
                  <Field key="other-profession" id={fid("other-profession")} label="Il tuo mestiere" wide>
                    <input
                      id={fid("other-profession")} name="otherProfession"
                      type="text" required value={otherProfession}
                      onChange={(e) => setOtherProfession(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </Field>
                )}

                {isClient ? (
                  <Field key="problem" id={fid("problem")} label="Che problema hai?" optional="facoltativo" wide>
                    <input
                      id={fid("problem")} name="problem"
                      type="text" value={problem} maxLength={MAX.problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="Il rubinetto della cucina perde"
                      className={INPUT_CLASS}
                    />
                  </Field>
                ) : (
                  <Field key="email" id={fid("email")} label="Email" optional="facoltativa" wide>
                    <input
                      id={fid("email")} name="email"
                      type="email" value={email} autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nome@email.com"
                      className={INPUT_CLASS}
                    />
                  </Field>
                )}
              </div>
            )
          ) : (
            <>
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

              {/* ── Email + Profession ─────────────────────────────────────────── */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field id={fid("email")} label="Email">
                  <input
                    id={fid("email")} name="email"
                    type="email" required value={email} autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@email.com"
                    className={INPUT_CLASS}
                  />
                </Field>

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
              </div>

              {/* "Altro" profession free-text */}
              {profession === "altro" && (
                <Field id={fid("other-profession")} label="La tua professione">
                  <input
                    id={fid("other-profession")} name="otherProfession"
                    type="text" required value={otherProfession}
                    onChange={(e) => setOtherProfession(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </Field>
              )}
            </>
          )}

          {(!prelaunch || role) && (
            <>
              {/* ── Legal checkboxes ─────────────────────────────────────────── */}
              <div className="flex flex-col gap-1">
                <LegalCheckbox
                  id="privacy-check"
                  checked={privacyChecked}
                  onChange={setPrivacyChecked}
                >
                  {prelaunch ? "Ho letto l'" : <>Ho letto e accetto la{" "}</>}
                  <Link
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent-text underline underline-offset-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {prelaunch ? "Informativa privacy" : "Privacy Policy"}
                  </Link>
                  {!prelaunch && " e acconsento al trattamento dei dati."}
                </LegalCheckbox>

                {!prelaunch && (
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
                )}
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                aria-busy={submitting}
                className="mt-1 h-12 w-full rounded-full bg-accent text-[15px] font-semibold text-white transition hover:bg-accent-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent dark:hover:bg-accent-bright"
              >
                {submitting ? "Invio…" : prelaunch ? "Avvisami" : "Iscriviti"}
              </button>
            </>
          )}

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
