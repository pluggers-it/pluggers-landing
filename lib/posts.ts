import { cache } from "react";
export { slugify, postPath, idFromSegment } from "./postPath";
import { getSupabase } from "@/lib/supabase";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkHtml from "remark-html";
import { formatPost, postText } from "@/lib/postFormat";

export type PostCategory = "Idraulico" | "Elettricista" | "Muratore" | "Altro";

export type Post = {
  id: string;
  title: string;
  category: PostCategory | string;
  content: string;
  createdAt: string;
};

/** Row shape returned by Supabase */
type PostRow = {
  id: string;
  title: string;
  category: string;
  content: string;
  created_at: string;
};

function rowToPost(row: PostRow): Post {
  return {
    id:        String(row.id),
    title:     row.title,
    category:  row.category,
    content:   row.content,
    createdAt: row.created_at,
  };
}

/** Convert markdown content to HTML, after formatPost has given the newsletter lines their structure.
 *  sanitize: false allows inline HTML (colors, underline, etc.) written by staff.
 *  Only authenticated staff can publish posts, so XSS risk is acceptable.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkHtml, { sanitize: false })
    .process(formatPost(markdown));
  return result.toString();
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
  const text = excerpt(md).replace(/\s+/g, " ").replace(/^[^.!?]*Pluggers News[^.!?]*[.!?]\s*/i, "");
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

export async function readPosts(): Promise<Post[]> {
  const { data, error } = await getSupabase()
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as PostRow[]).map(rowToPost);
}

// cached: metadata and page ask for the same post in one request
export const getPostById = cache(async (id: string): Promise<Post | null> => {
  if (!/^[1-9]\d*$/.test(id)) return null;
  const { data, error } = await getSupabase()
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return rowToPost(data as PostRow);
});

export async function createPost(input: {
  title: string;
  category: string;
  content: string;
}): Promise<Post> {
  const { data, error } = await getSupabase()
    .from("posts")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToPost(data as PostRow);
}

export async function deletePost(id: string): Promise<boolean> {
  const { error, count } = await getSupabase()
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return (count ?? 1) > 0;
}
