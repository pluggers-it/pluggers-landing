import { NextResponse } from "next/server";
import { readPosts, createPost, deletePost } from "@/lib/posts";
import { verifySession } from "@/lib/auth-db";
import { isSupabaseConfigured } from "@/lib/supabase";

// ── Auth helper ───────────────────────────────────────────────────────────────
async function authenticate(req: Request): Promise<boolean> {
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!token) return false;
  try {
    return await verifySession(token);
  } catch {
    return false;
  }
}

// ── GET — public: returns all posts ──────────────────────────────────────────
export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ posts: [] });
  try {
    const posts = await readPosts();
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ posts: [] });
  }
}

// ── POST — protected: creates a new post ─────────────────────────────────────
export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "DB non configurato." }, { status: 503 });
  }
  if (!(await authenticate(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | { title?: string; category?: string; content?: string }
    | null;

  const title    = (body?.title    ?? "").trim();
  const category = (body?.category ?? "").trim();
  const content  = (body?.content  ?? "").trim();

  if (!title || !category || !content) {
    return NextResponse.json(
      { error: "Titolo, categoria e contenuto sono obbligatori." },
      { status: 400 },
    );
  }

  const post = await createPost({ title, category, content });
  return NextResponse.json({ post }, { status: 201 });
}

// ── DELETE — protected: deletes a post by id ─────────────────────────────────
export async function DELETE(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "DB non configurato." }, { status: 503 });
  }
  if (!(await authenticate(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | { id?: string }
    | null;

  const id = (body?.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ error: "ID mancante." }, { status: 400 });
  }

  const deleted = await deletePost(id);
  if (!deleted) {
    return NextResponse.json({ error: "Post non trovato." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
