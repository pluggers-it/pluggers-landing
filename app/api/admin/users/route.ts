import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sessionFromRequest } from "@/lib/auth-db";
import { getSupabase } from "@/lib/supabase";

/** Account management is for admins only: null when the caller may go on, the error response otherwise. */
async function requireAdmin(req: Request): Promise<NextResponse | null> {
  const user = await sessionFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Solo un admin gestisce gli account." }, { status: 403 });
  }
  return null;
}

/**
 * POST /api/admin/users — creates a staff user (admin only).
 * Body: { username: string; password: string; role?: "admin" | "autore" } — role defaults to "autore"
 * Requires: Authorization: Bearer <session-token>
 */
export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as
    | { username?: string; password?: string; role?: string }
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

  const role = body?.role === "admin" ? "admin" : "autore";
  const passwordHash = await bcrypt.hash(password, 12);

  const { error } = await getSupabase()
    .from("admin_users")
    .insert({ username, password_hash: passwordHash, role });

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

  return NextResponse.json({ ok: true, username, role }, { status: 201 });
}

/**
 * GET /api/admin/users — lists staff usernames and roles (no hashes). Admin only.
 * Requires: Authorization: Bearer <session-token>
 */
export async function GET(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { data, error } = await getSupabase()
    .from("admin_users")
    .select("id, username, role, created_at, last_login_at")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Errore DB." }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}

/**
 * DELETE /api/admin/users — deletes a staff user by id. Admin only.
 * Body: { id: number }
 * Requires: Authorization: Bearer <session-token>
 */
export async function DELETE(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

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
