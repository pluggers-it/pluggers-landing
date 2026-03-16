import { NextResponse } from "next/server";
import { makeId, readPosts, writePosts } from "@/lib/posts";

/**
 * Public endpoint: returns the full posts list.
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
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Missing ADMIN_PASSWORD env var" },
      { status: 500 },
    );
  }

  const body = (await req.json().catch(() => null)) as
    | {
        title?: string;
        category?: string;
        content?: string;
        devKey?: string;
      }
    | null;

  const devKey = body?.devKey ?? "";
  if (devKey !== adminPassword) {
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

  const posts = await readPosts();
  const createdAt = new Date().toISOString();
  const post = { id: makeId(), title, category, content, createdAt };

  await writePosts([post, ...posts]);

  return NextResponse.json({ post }, { status: 201 });
}

/**
 * Protected endpoint: deletes an existing post by id.
 * Accepts `id` either in querystring (?id=...) or JSON body.
 */
export async function DELETE(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: "Missing ADMIN_PASSWORD env var" },
      { status: 500 },
    );
  }

  const url = new URL(req.url);
  const idFromQuery = (url.searchParams.get("id") ?? "").trim();

  const body = (await req.json().catch(() => null)) as
    | { devKey?: string; id?: string }
    | null;

  const devKey = body?.devKey ?? "";
  if (devKey !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = (body?.id ?? idFromQuery).trim();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const posts = await readPosts();
  const nextPosts = posts.filter((p) => p.id !== id);

  if (nextPosts.length === posts.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await writePosts(nextPosts);

  return NextResponse.json({ ok: true });
}

