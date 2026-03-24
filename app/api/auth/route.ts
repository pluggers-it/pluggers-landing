import { NextResponse } from "next/server";
import { verifyAdminUser, createSession, deleteSession } from "@/lib/auth-db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * POST /api/auth
 * Body: { username: string; password: string }
 * → 200 { token: string }   (24-hour session token)
 * → 401                     (wrong credentials)
 * → 429                     (rate limited)
 *
 * DELETE /api/auth
 * Header: Authorization: Bearer <token>
 * → 200 { ok: true }        (session invalidated)
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

  let userId: number | null;
  try {
    userId = await verifyAdminUser(username, password);
  } catch {
    return NextResponse.json(
      { error: "Errore di configurazione server." },
      { status: 500 },
    );
  }

  if (!userId) {
    // Uniform message — don't reveal whether the username exists
    return NextResponse.json(
      { error: "Credenziali non valide." },
      { status: 401 },
    );
  }

  const token = await createSession(userId);
  return NextResponse.json({ token });
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function DELETE(req: Request) {
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (token) await deleteSession(token).catch(() => null);
  return NextResponse.json({ ok: true });
}
