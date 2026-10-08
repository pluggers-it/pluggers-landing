/** Blog addresses: pure helpers, safe to import from client components too. */

/** Title as URL words: «Polizza catastrofi: scade il 31 marzo» → "polizza-catastrofi-scade-il-31-marzo". */
export function slugify(title: string, max = 70): string {
  const s = title
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return cut.slice(0, cut.lastIndexOf("-") > 20 ? cut.lastIndexOf("-") : max);
}

/** The canonical address of a post: id first (that's what we look up), then the title's words. */
export function postPath(post: { id: string; title: string }): string {
  const words = slugify(post.title);
  return `/blog/${post.id}${words ? `-${words}` : ""}`;
}

/** The id at the start of a /blog/<id>-<words> segment, or null if it isn't one. */
export function idFromSegment(segment: string): string | null {
  return /^([1-9]\d*)(?:-[a-z0-9-]*)?$/.exec(segment)?.[1] ?? null;
}
