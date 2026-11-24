import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { getSupabase } from "@/lib/supabase";

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const TEMP_PASSWORD_TTL_MS = 7 * 24 * 60 * 60 * 1000; // an unused temporary password stops working after 7 days

// ── Types ─────────────────────────────────────────────────────────────────────
type UserRow = { id: number; password_hash: string; must_change_password: boolean | null; created_at: string };
type SessionRow = { expires_at: string; user_id: number };

export type Role = "admin" | "autore";
export type SessionUser = { id: number; role: Role; mustChangePassword: boolean };

// ── User verification ─────────────────────────────────────────────────────────

/**
 * Verifies username + plaintext password against the DB.
 * Returns the user id (and whether the password is a temporary one) on success, null on failure.
 * Uses bcrypt.compare — safe against timing attacks.
 */
export async function verifyAdminUser(
  username: string,
  password: string,
): Promise<{ id: number; mustChangePassword: boolean } | null> {
  const { data, error } = await getSupabase()
    .from("admin_users")
    .select("id, password_hash, must_change_password, created_at")
    .eq("username", username.trim().toLowerCase())
    .maybeSingle();

  if (error || !data) return null;

  const row = data as UserRow;
  const matches = await bcrypt.compare(password, row.password_hash);
  if (!matches) return null;
  // the temporary password is set only when the account is created: created_at is when it was issued
  const temporary = row.must_change_password === true;
  if (temporary && Date.now() - new Date(row.created_at).getTime() > TEMP_PASSWORD_TTL_MS) return null;

  // Best-effort last-login update: errors are returned (not thrown) and ignored
  await getSupabase()
    .from("admin_users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", row.id);

  return { id: row.id, mustChangePassword: temporary };
}

// ── Session management ────────────────────────────────────────────────────────

/**
 * Creates a new session for the given user id.
 * Returns the opaque session token (UUID pair — 73 random chars).
 */
export async function createSession(userId: number): Promise<string> {
  const token    = crypto.randomUUID() + "-" + crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  const { error } = await getSupabase()
    .from("admin_sessions")
    .insert({ token, user_id: userId, expires_at: expiresAt });

  if (error) throw new Error("Could not create session: " + error.message);
  return token;
}

/**
 * Verifies a session token: returns the user (id + role) if the token exists and is not expired.
 * Auto-deletes expired sessions on access.
 */
export async function verifySession(token: string): Promise<SessionUser | null> {
  if (!token || token.length < 10) return null;

  const { data, error } = await getSupabase()
    .from("admin_sessions")
    .select("expires_at, user_id")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as SessionRow;
  if (new Date(row.expires_at) < new Date()) {
    await getSupabase().from("admin_sessions").delete().eq("token", token);
    return null;
  }

  const { data: user, error: userError } = await getSupabase()
    .from("admin_users")
    .select("id, role, must_change_password")
    .eq("id", row.user_id)
    .maybeSingle();

  if (userError || !user) return null;

  // Extend last-used timestamp (best-effort)
  await getSupabase()
    .from("admin_sessions")
    .update({ last_used_at: new Date().toISOString() })
    .eq("token", token);

  // anything that is not exactly "admin" gets the smaller rights
  return {
    id: user.id as number,
    role: user.role === "admin" ? "admin" : "autore",
    mustChangePassword: user.must_change_password === true,
  };
}

/** The bearer token of a request, or "". */
export function bearerToken(req: Request): string {
  const auth = req.headers.get("Authorization") ?? "";
  return auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
}

/**
 * The user behind `Authorization: Bearer <token>`, or null.
 * Null also while the user still has a temporary password: until they change it, the session only
 * opens PATCH /api/auth (which calls verifySession itself).
 */
export async function sessionFromRequest(req: Request): Promise<SessionUser | null> {
  const token = bearerToken(req);
  if (!token) return null;
  try {
    const user = await verifySession(token);
    return user && !user.mustChangePassword ? user : null;
  } catch {
    return null;
  }
}

/**
 * Replaces a user's password after checking the current one, clears the temporary-password flag
 * and closes the user's other sessions (`keepToken` stays open). False when the current password is wrong.
 */
export async function changePassword(userId: number, current: string, next: string, keepToken: string): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from("admin_users")
    .select("password_hash")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return false;
  if (!(await bcrypt.compare(current, (data as { password_hash: string }).password_hash))) return false;

  const { error: updateError } = await getSupabase()
    .from("admin_users")
    .update({ password_hash: await hashPassword(next), must_change_password: false })
    .eq("id", userId);
  if (updateError) throw new Error("Could not change password: " + updateError.message);

  const { error: sessionsError } = await getSupabase()
    .from("admin_sessions")
    .delete()
    .eq("user_id", userId)
    .neq("token", keepToken);
  if (sessionsError) throw new Error("Could not close the other sessions: " + sessionsError.message);
  return true;
}

/** A random temporary password (16 URL-safe chars, 96 bits): shown once to the admin, stored only as a bcrypt hash. */
export function temporaryPassword(): string {
  return randomBytes(12).toString("base64url");
}

/**
 * Invalidates a session (logout).
 */
export async function deleteSession(token: string): Promise<void> {
  await getSupabase().from("admin_sessions").delete().eq("token", token);
}

// ── Password hashing utility (used by create-admin script) ───────────────────

/** Hashes a plaintext password with bcrypt (12 rounds). */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}
