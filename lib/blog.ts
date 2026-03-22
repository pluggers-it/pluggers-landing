import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

// ── Directory where .md files live ───────────────────────────────────────────
const POSTS_DIR = path.join(process.cwd(), "content/posts");

// ── Types ────────────────────────────────────────────────────────────────────

export type PostMeta = {
  slug: string;
  title: string;
  date: string;        // ISO string, e.g. "2026-03-22"
  description: string;
  category: string;
};

export type PostFull = PostMeta & {
  contentHtml: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugFromFilename(filename: string) {
  return filename.replace(/\.md$/, "");
}

function parseFileMeta(filename: string): PostMeta {
  const slug = slugFromFilename(filename);
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
  const { data } = matter(raw);
  return {
    slug,
    title:       (data.title       as string | undefined) ?? slug,
    date:        (data.date        as string | undefined) ?? "",
    description: (data.description as string | undefined) ?? "",
    category:    (data.category    as string | undefined) ?? "Generale",
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns all posts sorted newest-first.
 * Safe to call from Server Components (reads from disk at request time).
 */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parseFileMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Returns the full post (including rendered HTML body) for a given slug,
 * or null if the file does not exist.
 */
export async function getPostBySlug(slug: string): Promise<PostFull | null> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const processed = await remark()
    .use(remarkGfm)   // tables, strikethrough, task lists, etc.
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return {
    slug,
    title:       (data.title       as string | undefined) ?? slug,
    date:        (data.date        as string | undefined) ?? "",
    description: (data.description as string | undefined) ?? "",
    category:    (data.category    as string | undefined) ?? "Generale",
    contentHtml: processed.toString(),
  };
}
