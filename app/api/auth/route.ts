import { NextResponse } from "next/server";
import { adminPasswordMatches, normalizeAdminPassword } from "@/lib/admin-auth";

/**
 * Validates the admin password.
 * POST { password: string } → { ok: true } | 401
 */
export async function POST(req: Request) {
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
