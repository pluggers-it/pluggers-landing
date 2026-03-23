import { NextResponse } from "next/server";
import { readPosts, createPost, deletePost } from "@/lib/posts";
import { adminPasswordMatches, normalizeAdminPassword } from "@/lib/admin-auth";

/**
 * Public endpoint: returns all posts.
 */
export async function GET() {
  const posts = await readPosts();
  return NextResponse.json({ posts });
}

/**
 * Protected endpoint: creates a new post.
 * Requires `devKey` matching `process.env.ADMIN_PASSWORD`.
 */
export async function POST(req: Request) {
  const adminPassword = normalizeAdminPassword(process.env.ADMIN_PASSWORD);
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Missing ADMIN_PASSWORD env var" },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => null)) as
    | { title?: string; category?: string; content?: string; devKey?: string }
    | null;

  if (!adminPasswordMatches(process.env.ADMIN_PASSWORD, body?.devKey)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const title = (body?.title ?? "").trim();
  const category = (body?.category ?? "").trim();
  const content = (body?.content ?? "").trim();

  if (!title || !category || !content) {
    return NextResponse.json(
      { error: "Missing title/category/content" },
      { status: 400 },
    );
  }

  const post = await createPost({ title, category, content });
  return NextResponse.json({ post }, { status: 201 });
}

/**
 * Protected endpoint: deletes a post by id.
 */
export async function DELETE(req: Request) {
  const adminPassword = normalizeAdminPassword(process.env.ADMIN_PASSWORD);
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Missing ADMIN_PASSWORD env var" },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => null)) as
    | { devKey?: string; id?: string }
    | null;

  if (!adminPasswordMatches(process.env.ADMIN_PASSWORD, body?.devKey)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = (body?.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const deleted = await deletePost(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}