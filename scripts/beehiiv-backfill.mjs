// One-off: puts everyone who already signed up to the newsletter (waitlist, source = newsletter)
// into the beehiiv publication. New sign-ups go there on their own (lib/beehiiv.ts).
// NEXT_PUBLIC_SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… BEEHIIV_API_KEY=… BEEHIIV_PUBLICATION_ID=… node scripts/beehiiv-backfill.mjs
const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: sk, BEEHIIV_API_KEY: bk, BEEHIIV_PUBLICATION_ID: pub } = process.env;
if (!url || !sk || !bk || !pub) throw new Error("servono NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BEEHIIV_API_KEY e BEEHIIV_PUBLICATION_ID");
const r = await fetch(`${url}/rest/v1/waitlist?select=email&source=eq.newsletter`, { headers: { apikey: sk, Authorization: `Bearer ${sk}` } });
const rows = await r.json();
let ok = 0;
for (const row of rows) {
  const res = await fetch(`https://api.beehiiv.com/v2/publications/${pub}/subscriptions`, {
    method: "POST",
    headers: { authorization: `Bearer ${bk}`, "content-type": "application/json" },
    // no welcome email for people who signed up weeks ago
    body: JSON.stringify({ email: row.email, reactivate_existing: false, send_welcome_email: false, utm_source: "plggrs.it" }),
  });
  if (res.ok) ok++;
  else console.error(row.email.replace(/(.).*@/, "$1…@"), res.status, (await res.text()).slice(0, 120));
}
console.log(`${ok} su ${rows.length} iscritti aggiunti su beehiiv`);
