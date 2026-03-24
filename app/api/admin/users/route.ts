import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifySession } from "@/lib/auth-db";
import { getSupabase } from "@/lib/supabase";

async function authenticate(req: Request): Promise<boolean> {
  const auth  = req.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return false;
  try { return await verifySession(token); } catch { return false; }
}

/**
 * POST /api/admin/users — creates a new admin user.
 * Body: { username: string; password: string }
 * Requires: Authorization: Bearer <session-token>
 */
export async function POST(req: Request) {
  if (!(await authenticate(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  const username = (body?.username ?? "").trim().toLowerCase();
  const password = (body?.password ?? "").trim();

  if (!username || username.length < 3) {
    return NextResponse.json(
      { error: "Username deve avere almeno 3 caratteri." },
      { status: 400 },
    );
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "La password deve avere almeno 8 caratteri." },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const { error } = await getSupabase()
    .from("admin_users")
    .insert({ username, password_hash: passwordHash });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Username già esistente." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Errore durante la creazione dell'utente." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, username }, { status: 201 });
}

/**
 * GET /api/admin/users — lists all admin usernames (no hashes).
 * Requires: Authorization: Bearer <session-token>
 */
export async function GET(req: Request) {
  if (!(await authenticate(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await getSupabase()
    .from("admin_users")
    .select("id, username, created_at, last_login_at")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Errore DB." }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}

/**
 * DELETE /api/admin/users — deletes an admin user by id.
 * Body: { id: number }
 * Requires: Authorization: Bearer <session-token>
 * Cannot delete yourself.
 */
export async function DELETE(req: Request) {
  if (!(await authenticate(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { id?: number } | null;
  const id   = body?.id;

  if (!id) {
    return NextResponse.json({ error: "ID mancante." }, { status: 400 });
  }

  const { error } = await getSupabase()
    .from("admin_users")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Errore durante l'eliminazione." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
