/**
 * Normalizza la password admin letta da env (spazi, virgolette accidentali).
 */
export function normalizeAdminPassword(raw: string | undefined): string {
  if (raw == null) return "";
  let v = raw.trim();
  // Copia-incolla da .env con virgolette incluse nel valore
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

export function adminPasswordMatches(
  envPassword: string | undefined,
  submittedKey: string | undefined,
): boolean {
  const a = normalizeAdminPassword(envPassword);
  const b = (submittedKey ?? "").trim();
  if (!a || !b) return false;
  return a === b;
}
