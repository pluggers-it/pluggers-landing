import { NextResponse } from "next/server";
import { adminPasswordMatches, normalizeAdminPassword } from "@/lib/admin-auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * Validates the admin password.
 * POST { password: string } → { ok: true } | 401
 *
 * Rate limit: 5 attempts per IP per minute (brute-force protection).
 */
export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { allowed, remaining, resetAt } = rateLimit(ip, {
    windowMs: 60_000,   // 1 minute
    maxRequests: 5,
  });

  if (!allowed) {
    return NextResponse.json(
      { error: "Troppi tentativi. Riprova tra un minuto." },
      {
        status: 429,
        headers: {
          "Retry-After":          String(Math.ceil((resetAt - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  if (!normalizeAdminPassword(process.env.ADMIN_PASSWORD)) {
    return NextResponse.json(
      { error: "Missing ADMIN_PASSWORD env var" },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => null)) as
    | { password?: string }
    | null;

  if (!adminPasswordMatches(process.env.ADMIN_PASSWORD, body?.password)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
