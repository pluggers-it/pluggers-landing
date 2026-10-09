/**
 * Newsletter sign-ups go straight into the Brevo list the newsletter is sent from, so a new
 * subscriber gets the next issue without anyone exporting anything (Gianmarco, 9/10/2026).
 * Off until BREVO_API_KEY and BREVO_LIST_ID are set on Vercel.
 */
export async function addToNewsletterList(c: { email: string; firstName?: string; lastName?: string }): Promise<"ok" | "off" | "error"> {
  const key = process.env.BREVO_API_KEY?.trim();
  const list = Number(process.env.BREVO_LIST_ID);
  if (!key || !Number.isInteger(list) || list <= 0) return "off";

  const send = (withNames: boolean) =>
    fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        email: c.email,
        listIds: [list],
        updateEnabled: true, // already a contact: just add the list
        ...(withNames && { attributes: { FIRSTNAME: c.firstName ?? "", LASTNAME: c.lastName ?? "" } }),
      }),
      signal: AbortSignal.timeout(8000),
    });

  try {
    let r = await send(true);
    // an account whose name attributes are called differently refuses them: the email alone is enough
    if (r.status === 400) r = await send(false);
    if (r.ok || r.status === 204) return "ok";
    console.error("[brevo] contact not added:", r.status, (await r.text()).slice(0, 300));
    return "error";
  } catch (e) {
    console.error("[brevo] contact not added:", e instanceof Error ? e.message : e);
    return "error";
  }
}
