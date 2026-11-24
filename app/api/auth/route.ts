import { NextResponse } from "next/server";
import {
  verifyAdminUser, createSession, deleteSession, verifySession, changePassword, bearerToken,
} from "@/lib/auth-db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * POST /api/auth
 * Body: { username: string; password: string }
 * → 200 { token: string; mustChangePassword: boolean }   (24-hour session token;
 *         with mustChangePassword the token only opens PATCH /api/auth)
 * → 401                     (wrong credentials)
 * → 429                     (rate limited)
 *
 * DELETE /api/auth
 * Header: Authorization: Bearer <token>
 * → 200 { ok: true }        (session invalidated)
 *
 * PATCH /api/auth — the logged-in user changes their own password
 * Header: Authorization: Bearer <token>
 * Body: { password: string; newPassword: string }
 * → 200 { ok: true } (the user's other sessions are closed) · 400 (new password too short or same) · 401 (no session or wrong current password)
 */

// ── Login ─────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  // 5 attempts per minute per IP — brute-force protection
  const ip = getClientIp(req);
  const { allowed, resetAt } = rateLimit(ip, { windowMs: 60_000, maxRequests: 5 });
  if (!allowed) {
    return NextResponse.json(
      { error: "Troppi tentativi. Riprova tra un minuto." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)) },
      },
    );
  }

  const body = (await req.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  const username = (body?.username ?? "").trim();
  const password = (body?.password ?? "").trim();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username e password obbligatori." },
      { status: 400 },
    );
  }

  let user: Awaited<ReturnType<typeof verifyAdminUser>>;
  try {
    user = await verifyAdminUser(username, password);
  } catch {
    return NextResponse.json(
      { error: "Errore di configurazione server." },
      { status: 500 },
    );
  }

  if (!user) {
    // Uniform message — don't reveal whether the username exists
    return NextResponse.json(
      { error: "Credenziali non valide." },
      { status: 401 },
    );
  }

  const token = await createSession(user.id);
  return NextResponse.json({ token, mustChangePassword: user.mustChangePassword });
}

// ── Change own password ───────────────────────────────────────────────────────
export async function PATCH(req: Request) {
  // same brute-force limit as the login: the current password is checked here too
  const { allowed } = rateLimit(getClientIp(req), { windowMs: 60_000, maxRequests: 5 });
  if (!allowed) {
    return NextResponse.json({ error: "Troppi tentativi. Riprova tra un minuto." }, { status: 429 });
  }

  // verifySession, not sessionFromRequest: this is the one call a temporary password may make
  const token = bearerToken(req);
  const user = await verifySession(token).catch(() => null);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | { password?: string; newPassword?: string }
    | null;
  const password    = (body?.password ?? "").trim();
  const newPassword = (body?.newPassword ?? "").trim();

  if (newPassword.length < 10) {
    return NextResponse.json({ error: "La nuova password deve avere almeno 10 caratteri." }, { status: 400 });
  }
  if (newPassword === password) {
    return NextResponse.json({ error: "La nuova password deve essere diversa da quella attuale." }, { status: 400 });
  }

  if (!(await changePassword(user.id, password, newPassword, token))) {
    return NextResponse.json({ error: "Password attuale non valida." }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function DELETE(req: Request) {
  const token = bearerToken(req);
  if (token) await deleteSession(token).catch(() => null);
  return NextResponse.json({ ok: true });
}
