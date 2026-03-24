import { getSupabase } from "@/lib/supabase";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

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

/** Convert markdown content to HTML */
export async function markdownToHtml(markdown: string): Promise<string> {
  // sanitize: true strips raw HTML injected in Markdown.
  // GFM tables/task-lists still work; only raw <script>/<iframe> blocks are removed.
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: true })
    .process(markdown);
  return result.toString();
}

export async function readPosts(): Promise<Post[]> {
  const { data, error } = await getSupabase()
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as PostRow[]).map(rowToPost);
}

export async function getPostById(id: string): Promise<Post | null> {
  const { data, error } = await getSupabase()
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return rowToPost(data as PostRow);
}

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
