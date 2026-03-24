import bcrypt from "bcryptjs";
import { getSupabase } from "@/lib/supabase";

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ── Types ─────────────────────────────────────────────────────────────────────
type UserRow = { id: number; password_hash: string };
type SessionRow = { expires_at: string };

// ── User verification ─────────────────────────────────────────────────────────

/**
 * Verifies username + plaintext password against the DB.
 * Returns the user id on success, null on failure.
 * Uses bcrypt.compare — safe against timing attacks.
 */
export async function verifyAdminUser(
  username: string,
  password: string,
): Promise<number | null> {
  const { data, error } = await getSupabase()
    .from("admin_users")
    .select("id, password_hash")
    .eq("username", username.trim().toLowerCase())
    .maybeSingle();

  if (error || !data) return null;

  const row = data as UserRow;
  const matches = await bcrypt.compare(password, row.password_hash);
  if (!matches) return null;

  // Best-effort last-login update (ignore errors)
  void getSupabase()
    .from("admin_users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", row.id);

  return row.id;
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
 * Verifies a session token: returns true if the token exists and is not expired.
 * Auto-deletes expired sessions on access.
 */
export async function verifySession(token: string): Promise<boolean> {
  if (!token || token.length < 10) return false;

  const { data, error } = await getSupabase()
    .from("admin_sessions")
    .select("expires_at")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) return false;

  const row = data as SessionRow;
  if (new Date(row.expires_at) < new Date()) {
    void getSupabase().from("admin_sessions").delete().eq("token", token);
    return false;
  }

  // Extend last-used timestamp (best-effort)
  void getSupabase()
    .from("admin_sessions")
    .update({ last_used_at: new Date().toISOString() })
    .eq("token", token);

  return true;
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
