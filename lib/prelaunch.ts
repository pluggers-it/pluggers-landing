/**
 * Pre-launch: until the app is public in the stores, every way into Pluggers leads to the pre-registration form.
 * The switch is `app_negli_store` in the admin panel's product switches, which core-api serves on its public config.
 */

const CONFIG_URL = "https://api.plggrs.it/api/v1/config";

/** Off, missing, or core-api unreachable: pre-launch. Pages are rebuilt at most every minute, so flipping it needs no deploy. */
export async function appInStores(): Promise<boolean> {
  try {
    const res = await fetch(CONFIG_URL, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return false;
    const body = (await res.json()) as { config?: { ui?: Record<string, unknown> } } | null;
    return body?.config?.ui?.app_negli_store === true;
  } catch {
    return false;
  }
}

export type Role = "cliente" | "pro";

/** The page a sign-up came from, as stored: a path of the site, an invite page without its code, "" for anything else. */
export function originPage(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const path = raw.trim();
  if (!/^\/[\w\-/]{0,119}$/.test(path)) return "";
  return path.startsWith("/i/") ? "/i/[codice]" : path;
}

/**
 * What the pre-registration form starts with, from the link that led there (`prelaunchUrl`):
 * who is signing up, guessed from the page when the link doesn't say, and the trade of a Turin trade page.
 */
export function prelaunchPrefill(params: { da?: string | string[]; ruolo?: string | string[] }): {
  role: Role | null;
  tradeSlug: string | null;
  page: string;
} {
  const page = originPage(params.da);
  const role: Role | null =
    params.ruolo === "pro" || params.ruolo === "cliente"
      ? params.ruolo
      : page.startsWith("/professionisti")
        ? "pro"
        : page.startsWith("/clienti") || page.startsWith("/torino")
          ? "cliente"
          : null;
  const tradeSlug = /^\/torino\/([\w-]+)$/.exec(page)?.[1] ?? null;
  return { role, tradeSlug, page };
}
