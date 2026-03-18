import { NextResponse } from "next/server";

/**
 * Validates the admin password.
 * POST { password: string } → { ok: true } | 401
 */
export async function POST(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Missing ADMIN_PASSWORD env var" },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => null)) as
    | { password?: string }
    | null;

  if (body?.password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
