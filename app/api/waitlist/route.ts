import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Accepts digits, spaces, dashes, parentheses and a leading +
// Minimum 7 chars (shortest valid numbers) — maximum 20.
const PHONE_REGEX = /^\+?[\d\s\-()\u00B7]{7,20}$/;

/**
 * Collects waitlist signups.
 * POST { email, firstName, lastName, phone, profession, region }
 *   → 201 { ok: true }
 *   → 200 { ok: true, already: true }   (duplicate email)
 *   → 400 { error: string }             (validation failure)
 *   → 500 { error: string }             (database error)
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    profession?: string;
    region?: string;
  } | null;

  const email      = (body?.email      ?? "").trim().toLowerCase();
  const firstName  = (body?.firstName  ?? "").trim();
  const lastName   = (body?.lastName   ?? "").trim();
  const phone      = (body?.phone      ?? "").trim();
  const profession = (body?.profession ?? "").trim();
  const region     = (body?.region     ?? "").trim();

  // ── Validation ──────────────────────────────────────────────────────────────
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

  // ── Insert ──────────────────────────────────────────────────────────────────
  const { error } = await supabase.from("waitlist").insert({
    email,
    first_name:  firstName,
    last_name:   lastName,
    phone,
    profession,
    region,
  });

  if (error) {
    // Unique constraint violation — email already registered
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, already: true });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
