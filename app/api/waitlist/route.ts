import { NextResponse } from "next/server";
import { addToNewsletterList } from "@/lib/beehiiv";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { originPage } from "@/lib/prelaunch";

const PHONE_REGEX = /^\+?[\d\s\-()\u00B7]{7,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ALLOWED_SOURCES = new Set(["waitlist", "newsletter"]);

// Max field lengths (prevent oversized payloads)
const MAX = { name: 80, phone: 20, profession: 60, city: 60, region: 60, email: 254, problem: 200 };

function genericDbError(): NextResponse {
  return NextResponse.json(
    { error: "Servizio temporaneamente non disponibile. Riprova tra poco." },
    { status: 500 },
  );
}

/**
 * Collects waitlist signups.
 * POST { email, firstName, lastName, phone, profession, city, region?, source?, page?, problem? }
 *   `region` is the pre-city column: still accepted, never required.
 *   `page` is the path the form was sent from; `problem` a client's line from the pre-registration,
 *   where clients sign up with profession «cliente».
 *   → 201 { ok: true }
 *   → 200 { ok: true, already: true }   (duplicate email)
 *   → 400 { error: string }             (validation failure)
 *   → 500 { error: string }             (database error)
 */
export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { allowed } = rateLimit(ip, {
    windowMs: 3_600_000,  // 1 hour
    maxRequests: 5,       // max 5 signups per IP per hour
  });

  if (!allowed) {
    return NextResponse.json(
      { error: "Hai inviato troppe richieste. Riprova più tardi." },
      { status: 429 },
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Configurazione server incompleta." },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => null)) as {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    profession?: string;
    city?: string;
    region?: string;
    source?: string;
    page?: string;
    problem?: string;
    privacyAccepted?: boolean;
  } | null;

  const email      = (body?.email      ?? "").trim().toLowerCase();
  const firstName  = (body?.firstName  ?? "").trim();
  const lastName   = (body?.lastName   ?? "").trim();
  const phone      = (body?.phone      ?? "").trim();
  const profession = (body?.profession ?? "").trim();
  const city       = (body?.city       ?? "").trim();
  const region     = (body?.region     ?? "").trim();
  const rawSource  = (body?.source ?? "waitlist").trim().toLowerCase();
  const source     = ALLOWED_SOURCES.has(rawSource) ? rawSource : "waitlist";
  const page       = originPage(body?.page);
  const problem    = (body?.problem ?? "").trim();

  // ── Validation ──────────────────────────────────────────────────────────────
  if (body?.privacyAccepted !== true) {
    return NextResponse.json(
      { error: "È necessario accettare l'informativa privacy." },
      { status: 400 },
    );
  }

  if (!email || !EMAIL_REGEX.test(email) || email.length > MAX.email) {
    return NextResponse.json({ error: "Email non valida." }, { status: 400 });
  }

  if (!phone || !PHONE_REGEX.test(phone) || phone.length > MAX.phone) {
    return NextResponse.json({ error: "Numero di telefono non valido." }, { status: 400 });
  }

  if (!firstName || !lastName || firstName.length > MAX.name || lastName.length > MAX.name) {
    return NextResponse.json({ error: "Nome e cognome obbligatori (max 80 caratteri)." }, { status: 400 });
  }

  if (!city || city.length > MAX.city) {
    return NextResponse.json({ error: "Scrivi la tua città (max 60 caratteri)." }, { status: 400 });
  }

  if (region.length > MAX.region) {
    return NextResponse.json({ error: "Regione non valida." }, { status: 400 });
  }

  if (!profession || profession.length > MAX.profession) {
    return NextResponse.json({ error: "Seleziona una professione." }, { status: 400 });
  }

  if (problem.length > MAX.problem) {
    return NextResponse.json({ error: "Descrivi il problema in poche parole (max 200 caratteri)." }, { status: 400 });
  }

  // ── Insert ──────────────────────────────────────────────────────────────────
  let supabase;
  try {
    supabase = getSupabase();
  } catch {
    return NextResponse.json(
      { error: "Configurazione server incompleta." },
      { status: 503 },
    );
  }

  const row: Record<string, string> = {
    email,
    first_name: firstName,
    last_name: lastName,
    phone,
    profession,
    city,
    region,
    source,
    privacy_accepted_at: new Date().toISOString(),
  };

  let { error } = await supabase.from("waitlist").insert({ ...row, page, problem });
  // Until supabase/migrations/20261019000000_waitlist_preiscrizione.sql is applied the two columns are missing:
  // the sign-up still goes in, without them.
  if (error && (error.code === "PGRST204" || error.code === "42703")) {
    ({ error } = await supabase.from("waitlist").insert(row));
  }

  // newsletter sign-ups also go to beehiiv; a beehiiv failure never fails the sign-up
  if (source === "newsletter" && (!error || error.code === "23505")) {
    await addToNewsletterList(email);
  }

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, already: true });
    }
    // Log details server-side only (never exposed to client)
    console.error("[waitlist] Supabase insert error:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return genericDbError();
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
