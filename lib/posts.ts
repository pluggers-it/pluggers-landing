import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Common categories (free text still allowed).
 */
export type PostCategory = "Idraulico" | "Elettricista" | "Muratore" | "Altro";

/**
 * Post model stored in the JSON "stupid DB".
 */
export type Post = {
  id: string;
  title: string;
  category: PostCategory | string;
  content: string;
  createdAt: string;
};

type PostsFile = {
  posts: Post[];
};

/**
 * Absolute path to the local JSON file used as a zero-cost database.
 */
const POSTS_FILE = path.join(process.cwd(), "data", "posts.json");

function safeJsonParse<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Reads all posts from `data/posts.json`.
 */
export async function readPosts(): Promise<Post[]> {
  const raw = await fs.readFile(POSTS_FILE, "utf8");
  const parsed = safeJsonParse<PostsFile>(raw, { posts: [] });
  return Array.isArray(parsed.posts) ? parsed.posts : [];
}

/**
 * Writes the posts list to `data/posts.json` (pretty-printed).
 */
export async function writePosts(posts: Post[]): Promise<void> {
  const payload: PostsFile = { posts };
  await fs.writeFile(
    POSTS_FILE,
    JSON.stringify(payload, null, 2) + "\n",
    "utf8",
  );
}

/**
 * Generates a simple unique id suitable for local JSON storage.
 */
export function makeId(): string {
  return `post-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

