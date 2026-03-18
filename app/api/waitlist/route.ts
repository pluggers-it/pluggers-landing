import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * Collects waitlist signups.
 * POST { email: string } → { ok: true } | 400 | 500
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { email?: string }
    | null;

  const email = (body?.email ?? "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { error } = await supabase.from("waitlist").insert({ email });

  if (error) {
    // Unique constraint violation — already registered
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, already: true });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}