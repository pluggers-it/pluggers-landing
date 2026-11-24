import { cache } from "react";
export { slugify, postPath, idFromSegment } from "./postPath";
import { getSupabase } from "@/lib/supabase";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkHtml from "remark-html";
import { formatPost, postText } from "@/lib/postFormat";
import { idFromSegment, mergePosts, slugify } from "./postPath";
import { getArticle, readArticles } from "./babylovegrowth";

export type PostStatus = "bozza" | "pubblicato";

export type PostCategory = "Idraulico" | "Elettricista" | "Muratore" | "Altro";

export type Post = {
  id: string;
  title: string;
  category: PostCategory | string;
  content: string;
  createdAt: string;
  /** Our posts only: drafts never reach the public pages. */
  status?: PostStatus;
  authorId?: number | null;
  /** Written by an author (not an admin): its inline HTML is sanitized on the public page. */
  untrusted?: boolean;
  /** BabyLoveGrowth articles only (lib/babylovegrowth.ts): served at /blog/<slug>. */
  slug?: string;
  description?: string;
  image?: string;
  jsonLd?: object[];
};

/** Row shape returned by Supabase */
type PostRow = {
  id: string;
  title: string;
  category: string;
  content: string;
  created_at: string;
  status: PostStatus;
  author_id: number | null;
};

function rowToPost(row: PostRow): Post {
  return {
    id:        String(row.id),
    title:     row.title,
    category:  row.category,
    content:   row.content,
    createdAt: row.created_at,
    status:    row.status,
    authorId:  row.author_id,
  };
}

/** Convert markdown content to HTML, after formatPost has given the newsletter lines their structure.
 *  sanitize: false allows inline HTML (colors, underline, etc.) written by admins.
 *  Only admins publish, so XSS risk is acceptable for their posts; an author's post (`untrusted`) is sanitized,
 *  or a script in a draft would run on the site once an admin publishes it.
 *  BabyLoveGrowth articles (`external`) are written elsewhere: sanitized, no newsletter formatting.
 */
export async function markdownToHtml(markdown: string, external = false, untrusted = false): Promise<string> {
  if (external) {
    return String(await remark().use(remarkGfm).use(remarkHtml, { sanitize: true }).process(markdown));
  }
  const result = await remark()
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkHtml, { sanitize: untrusted })
    .process(formatPost(markdown));
  return result.toString();
}

/** Gives every h2 an id and returns them, for the article's table of contents. */
export function withHeadingIds(html: string): { html: string; toc: { id: string; text: string }[] } {
  const toc: { id: string; text: string }[] = [];
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/[^\p{L}\p{N}\s'’.,:;!?()-]/gu, "").trim();
    let id = slugify(text, 60) || `sezione-${toc.length + 1}`;
    if (toc.some((t) => t.id === id)) id = `${id}-${toc.length + 1}`;
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}

/** Plain-text excerpt: menu and sign-off left out, markdown syntax and HTML tags stripped. */
export function excerpt(md: string): string {
  return postText(md)
    .replace(/<[^>]+>/g, "")                          // HTML tags
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")         // images → alt text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")          // links → link text
    .replace(/^#{1,6}\s+/gm, "")                      // headings
    .replace(/(\*\*|__)([\s\S]*?)\1/g, "$2")           // bold
    .replace(/(\*|_)([\s\S]*?)\1/g, "$2")             // italic
    .replace(/~~([\s\S]*?)~~/g, "$1")                 // strikethrough
    .replace(/`([^`]+)`/g, "$1")                      // inline code
    .replace(/^>\s*/gm, "")                           // blockquotes
    .replace(/^[\-*+]\s+/gm, "")                      // unordered lists
    .replace(/^\d+\.\s+/gm, "")                       // ordered lists
    .replace(/^---+$/gm, "")                           // hr
    .replace(/\n+/g, " ")
    .trim();
}

/** Plain-text excerpt cut at a word boundary, for meta descriptions. */
export function metaDescription(md: string, max = 155): string {
  // Every newsletter opens with the same greeting ("Benvenuti su Pluggers News…"): left in,
  // it became the description of every post.
  const text = excerpt(md)
    .replace(/\s+/g, " ")
    .replace(/^\W*(?:buongiorno|ciao|salve)\b[^.!?]*[.!?]\s*/i, "")
    .replace(/^[^.!?]*Pluggers News[^.!?]*[.!?]\s*/i, "");
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  // A whole first sentence reads better than one cut mid-way, when it fills most of the space.
  const sentenceEnd = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  if (sentenceEnd >= max * 0.6) return cut.slice(0, sentenceEnd + 1);
  const words = cut.slice(0, cut.lastIndexOf(" "));
  return /[.!?]$/.test(words) ? words : `${words}…`;
}

/** "5 maggio 2026", in Italian time. */
export function formatPostDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  });
}

/** Minutes of reading at ~200 words a minute. */
export function readingMinutes(md: string): number {
  return Math.max(1, Math.round(excerpt(md).split(/\s+/).length / 200));
}

/** Published posts only: what the blog, the sitemap and the public API show. */
export async function readPosts(): Promise<Post[]> {
  const { data, error } = await getSupabase()
    .from("posts")
    .select("*")
    .eq("status", "pubblicato")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as PostRow[]).map(rowToPost);
}

/** The staff panel: an admin sees every post, an author the published ones and their own drafts. */
export async function readStaffPosts(user: { id: number; role: "admin" | "autore" }): Promise<Post[]> {
  let query = getSupabase().from("posts").select("*");
  if (user.role !== "admin") query = query.or(`status.eq.pubblicato,author_id.eq.${Number(user.id)}`);
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as PostRow[]).map(rowToPost);
}

/** Our posts and the BabyLoveGrowth articles, newest first. */
export async function readAllPosts(): Promise<Post[]> {
  const [ours, theirs] = await Promise.all([readPosts(), readArticles()]);
  return mergePosts(ours, theirs);
}

// cached: metadata and page ask for the same post in one request
export const getPostById = cache(async (id: string): Promise<Post | null> => {
  if (!/^[1-9]\d*$/.test(id)) return null;
  const { data, error } = await getSupabase()
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("status", "pubblicato")
    .single();

  if (error || !data) return null;
  const post = rowToPost(data as PostRow);
  // no author: written before roles existed, when every account was an admin
  if (post.authorId != null) {
    const { data: author } = await getSupabase()
      .from("admin_users")
      .select("role")
      .eq("id", post.authorId)
      .maybeSingle();
    post.untrusted = author?.role !== "admin";
  }
  return post;
});

/** What /blog/<segment> opens: our post by id first, then a BabyLoveGrowth article by slug. */
export const getPostBySegment = cache(async (segment: string): Promise<Post | null> => {
  const id = idFromSegment(segment);
  return (id ? await getPostById(id) : null) ?? (await getArticle(segment));
});

export async function createPost(input: {
  title: string;
  category: string;
  content: string;
  status: PostStatus;
  author_id: number;
}): Promise<Post> {
  const { data, error } = await getSupabase()
    .from("posts")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToPost(data as PostRow);
}

/** Deletes a post; with `onlyDraftOf` only that author's draft. False when nothing matched. */
export async function deletePost(id: string, onlyDraftOf?: number): Promise<boolean> {
  let query = getSupabase().from("posts").delete({ count: "exact" }).eq("id", id);
  if (onlyDraftOf !== undefined) query = query.eq("author_id", onlyDraftOf).eq("status", "bozza");
  const { error, count } = await query;

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

/** Publishes or unpublishes a post. False when the post does not exist. */
export async function setPostStatus(id: string, status: PostStatus): Promise<boolean> {
  const { error, count } = await getSupabase()
    .from("posts")
    .update({ status }, { count: "exact" })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}
