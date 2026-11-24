import { NextResponse } from "next/server";
import { hashPassword, sessionFromRequest, temporaryPassword } from "@/lib/auth-db";
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
 * Body: { username: string; role?: "admin" | "autore" } — role defaults to "autore"
 * → 201 { ok, username, role, tempPassword }: the temporary password is generated here, returned this once
 *   and stored only as a bcrypt hash; the new user must replace it at the first login.
 * Requires: Authorization: Bearer <session-token>
 */
export async function POST(req: Request) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as
    | { username?: string; role?: string }
    | null;

  const username = (body?.username ?? "").trim().toLowerCase();

  if (!username || username.length < 3) {
    return NextResponse.json(
      { error: "Username deve avere almeno 3 caratteri." },
      { status: 400 },
    );
  }

  const role = body?.role === "admin" ? "admin" : "autore";
  const tempPassword = temporaryPassword();
  const passwordHash = await hashPassword(tempPassword);

  const { error } = await getSupabase()
    .from("admin_users")
    .insert({ username, password_hash: passwordHash, role, must_change_password: true });

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

  return NextResponse.json(
    { ok: true, username, role, tempPassword },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
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
 * Refused (409) while the user still has posts: a post without author counts as an admin's and keeps its raw HTML.
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

  const { count, error: postsError } = await getSupabase()
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("author_id", id);
  if (postsError) {
    return NextResponse.json({ error: "Errore DB." }, { status: 500 });
  }
  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: "Questo utente ha ancora articoli: eliminali prima di eliminare l'utente." },
      { status: 409 },
    );
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
