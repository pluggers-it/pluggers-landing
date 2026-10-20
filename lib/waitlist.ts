/**
 * What a waitlist sign-up has to contain. The form uses it to turn what people type into fields,
 * the API (app/api/waitlist/route.ts) to check them. No imports, so the tests load it as it is.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^\+?[\d\s\-()·]{7,20}$/;

/** `profession` of a sign-up from someone who looks for a professional (the pre-registration). */
export const CLIENT = "cliente";

// Max field lengths (prevent oversized payloads)
export const MAX = { name: 80, phone: 20, profession: 60, city: 60, region: 60, email: 254, problem: 200 };

export function isEmail(value: string): boolean {
  return value.length <= MAX.email && EMAIL_REGEX.test(value);
}

/** Any phone number, as the forms have always taken it. */
export function isPhone(value: string): boolean {
  return PHONE_REGEX.test(value);
}

/** An Italian number: mobile (3xx) or landline (0x), with or without +39 / 0039. */
export function isItalianPhone(value: string): boolean {
  if (!isPhone(value)) return false;
  const national = value.replace(/[^\d+]/g, "").replace(/^(?:\+|00)39/, "");
  return /^(?:3\d{8,9}|0\d{5,10})$/.test(national);
}

/** The «Email o telefono» field: an email or an Italian phone number, anything else is null. */
export function splitContact(raw: string): { email: string; phone: string } | null {
  const value = raw.trim();
  if (isEmail(value)) return { email: value, phone: "" };
  if (isItalianPhone(value)) return { email: "", phone: value };
  return null;
}

/** «Nome e cognome» as one field: the first word is the name, the rest the surname (which may be empty). */
export function splitName(raw: string): { firstName: string; lastName: string } {
  const full = raw.trim().replace(/\s+/g, " ");
  const space = full.indexOf(" ");
  return space < 0 ? { firstName: full, lastName: "" } : { firstName: full.slice(0, space), lastName: full.slice(space + 1) };
}

export interface WaitlistFields {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profession: string;
  city: string;
  region: string;
  problem: string;
  source: string;
  privacyAccepted: unknown;
}

/**
 * The message for the first thing wrong with a sign-up, or null when it is fine (fields already trimmed).
 * A client (`profession` «cliente») leaves an email or an Italian phone number; everyone else a phone number,
 * with the email optional. The newsletter needs the email, which is what it subscribes. The surname is always optional.
 */
export function validateWaitlist(f: WaitlistFields): string | null {
  const client = f.profession === CLIENT;

  if (f.privacyAccepted !== true) return "È necessario accettare l'informativa privacy.";

  if (f.email && !isEmail(f.email)) return "Email non valida.";
  if (f.source === "newsletter" && !f.email) return "Email non valida.";

  if (f.phone && !(client ? isItalianPhone(f.phone) : isPhone(f.phone))) return "Numero di telefono non valido.";
  if (client && !f.email && !f.phone) return "Lasciaci un'email o un numero di telefono.";
  if (!client && !f.phone) return "Numero di telefono non valido.";

  if (!f.firstName || f.firstName.length > MAX.name || f.lastName.length > MAX.name) {
    return "Scrivi il tuo nome (max 80 caratteri).";
  }
  if (!f.city || f.city.length > MAX.city) return "Scrivi la tua città (max 60 caratteri).";
  if (f.region.length > MAX.region) return "Regione non valida.";
  if (!f.profession || f.profession.length > MAX.profession) return "Seleziona una professione.";
  if (f.problem.length > MAX.problem) return "Descrivi il problema in poche parole (max 200 caratteri).";

  return null;
}
