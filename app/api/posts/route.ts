import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readPosts, readStaffPosts, createPost, deletePost, setPostStatus, type PostStatus } from "@/lib/posts";
import { sessionFromRequest } from "@/lib/auth-db";
import { isSupabaseConfigured } from "@/lib/supabase";

// the blog and the sitemap are cached: a new or deleted post shows at once
function aggiornaPagine() {
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// ── GET — public: published posts; with a staff session also the drafts the user may see, and the role
export async function GET(req: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ posts: [] });
  const user = await sessionFromRequest(req);
  try {
    if (user) return NextResponse.json({ posts: await readStaffPosts(user), role: user.role });
    return NextResponse.json({ posts: await readPosts() });
  } catch {
    return NextResponse.json({ posts: [] });
  }
}

// ── POST — protected: creates a post. Authors only ever save drafts.
export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "DB non configurato." }, { status: 503 });
  }
  const user = await sessionFromRequest(req);
  if (!user) return unauthorized();

  const body = (await req.json().catch(() => null)) as
    | { title?: string; category?: string; content?: string; status?: string }
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

  const status: PostStatus =
    user.role === "admin" && body?.status !== "bozza" ? "pubblicato" : "bozza";

  const post = await createPost({ title, category, content, status, author_id: user.id });
  if (status === "pubblicato") aggiornaPagine();
  return NextResponse.json({ post }, { status: 201 });
}

// ── PATCH — admin only: publishes or unpublishes a post. Body: { id, status }
export async function PATCH(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "DB non configurato." }, { status: 503 });
  }
  const user = await sessionFromRequest(req);
  if (!user) return unauthorized();
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Solo un admin può pubblicare." }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as { id?: string; status?: string } | null;
  const id = String(body?.id ?? "").trim();
  const status = body?.status;
  if (!id || (status !== "bozza" && status !== "pubblicato")) {
    return NextResponse.json({ error: "ID o stato non valido." }, { status: 400 });
  }

  if (!(await setPostStatus(id, status))) {
    return NextResponse.json({ error: "Post non trovato." }, { status: 404 });
  }
  aggiornaPagine();
  return NextResponse.json({ ok: true });
}

// ── DELETE — protected: an admin deletes any post, an author only their own drafts
export async function DELETE(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "DB non configurato." }, { status: 503 });
  }
  const user = await sessionFromRequest(req);
  if (!user) return unauthorized();

  const body = (await req.json().catch(() => null)) as
    | { id?: string }
    | null;

  const id = String(body?.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ error: "ID mancante." }, { status: 400 });
  }

  const isAdmin = user.role === "admin";
  const deleted = await deletePost(id, isAdmin ? undefined : user.id);
  if (!deleted) {
    return isAdmin
      ? NextResponse.json({ error: "Post non trovato." }, { status: 404 })
      : NextResponse.json({ error: "Puoi eliminare solo le tue bozze." }, { status: 403 });
  }

  aggiornaPagine();
  return NextResponse.json({ ok: true });
}
