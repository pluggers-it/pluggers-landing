import { NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

// Accepts digits, spaces, dashes, parentheses and a leading +
// Minimum 7 chars (shortest valid numbers) — maximum 20.
const PHONE_REGEX = /^\+?[\d\s\-()\u00B7]{7,20}$/;

const ALLOWED_SOURCES = new Set(["waitlist", "newsletter"]);

function genericDbError(): NextResponse {
  return NextResponse.json(
    { error: "Servizio temporaneamente non disponibile. Riprova tra poco." },
    { status: 500 },
  );
}

/**
 * Collects waitlist signups.
 * POST { email, firstName, lastName, phone, profession, region, source? }
 *   → 201 { ok: true }
 *   → 200 { ok: true, already: true }   (duplicate email)
 *   → 400 { error: string }             (validation failure)
 *   → 500 { error: string }             (database error)
 */
export async function POST(req: Request) {
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
    region?: string;
    source?: string;
    privacyAccepted?: boolean;
  } | null;

  const email      = (body?.email      ?? "").trim().toLowerCase();
  const firstName  = (body?.firstName  ?? "").trim();
  const lastName   = (body?.lastName   ?? "").trim();
  const phone      = (body?.phone      ?? "").trim();
  const profession = (body?.profession ?? "").trim();
  const region     = (body?.region     ?? "").trim();
  const rawSource  = (body?.source ?? "waitlist").trim().toLowerCase();
  const source     = ALLOWED_SOURCES.has(rawSource) ? rawSource : "waitlist";

  // ── Validation ──────────────────────────────────────────────────────────────
  if (body?.privacyAccepted !== true) {
    return NextResponse.json(
      { error: "È necessario accettare l'informativa privacy." },
      { status: 400 },
    );
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email non valida" }, { status: 400 });
  }

  if (!phone || !PHONE_REGEX.test(phone)) {
    return NextResponse.json(
      { error: "Numero di telefono non valido" },
      { status: 400 }
    );
  }

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "Nome e cognome obbligatori" }, { status: 400 });
  }

  if (!region) {
    return NextResponse.json({ error: "Seleziona una regione." }, { status: 400 });
  }

  // "utente" is sent when the user is not a professional — it is valid.
  if (!profession) {
    return NextResponse.json({ error: "Seleziona una professione o il tipo utente." }, { status: 400 });
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
    region,
    source,
  };

  const { error } = await supabase.from("waitlist").insert(row);

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
