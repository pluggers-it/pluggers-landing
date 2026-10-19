import { NextResponse } from "next/server";
import { addToNewsletterList } from "@/lib/beehiiv";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { originPage } from "@/lib/prelaunch";
import { validateWaitlist } from "@/lib/waitlist";

const ALLOWED_SOURCES = new Set(["waitlist", "newsletter"]);

function genericDbError(): NextResponse {
  return NextResponse.json(
    { error: "Servizio temporaneamente non disponibile. Riprova tra poco." },
    { status: 500 },
  );
}

/**
 * Collects waitlist signups.
 * POST { email, firstName, lastName, phone, profession, city, region?, source?, page?, problem? }
 *   Rules in `validateWaitlist` (lib/waitlist.ts): a client (profession «cliente») needs an email or an Italian
 *   phone number, anyone else a phone number; surname and, for professionals, email are optional.
 *   `region` is the pre-city column: still accepted, never required.
 *   `page` is the path the form was sent from; `problem` a client's line from the pre-registration.
 *   A sign-up without email is stored with `email` "".
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
  const invalid = validateWaitlist({
    email, firstName, lastName, phone, profession, city, region, problem, source,
    privacyAccepted: body?.privacyAccepted,
  });
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

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
    // A repeated email is a duplicate. With no email the clash is on the empty one, which means
    // supabase/migrations/20261019000001_waitlist_contatto_facoltativo.sql isn't applied yet: not a duplicate.
    if (error.code === "23505" && email) {
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
