import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";

// Always fetch fresh posts from Supabase — never use static cache.
export const dynamic = "force-dynamic";
import { PageShell } from "@/components/landing/PageShell";
import { CONTAINER, LEDE } from "@/components/landing/styles";
import { excerpt, formatPostDate, readPosts, readingMinutes, type Post } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articoli, guide e aggiornamenti sul mondo degli artigiani e professionisti della mano d'opera. " +
    "Consigli per idraulici, elettricisti, muratori e altri professionisti.",
  alternates: { canonical: "https://www.plggrs.it/blog" },
};

/** Separator that wraps together with the item after it. */
const SEP = "before:mr-2 before:content-['·']";

function PostMeta({ post }: { post: Post }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 text-[14px] text-muted">
      <span className="font-semibold text-accent-text">{post.category}</span>
      <time dateTime={post.createdAt} className={SEP}>
        {formatPostDate(post.createdAt)}
      </time>
      <span className={SEP}>{readingMinutes(post.content)} min di lettura</span>
    </p>
  );
}

export default async function BlogPage() {
  let posts: Post[] = [];
  try {
    posts = await readPosts();
  } catch {
    // DB not yet set up or unreachable — show empty state
  }
  const [latest, ...older] = posts;

  return (
    <PageShell>
      <div className={`${CONTAINER} pt-8 sm:pt-14`}>
        <header className="max-w-[46rem]">
          <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
            Blog
          </h1>
          <p className={LEDE}>
            Notizie, norme e consigli pratici per artigiani e professionisti della casa.
          </p>
          <Link
            href="/newsletter"
            className="mt-2 inline-flex min-h-12 items-center gap-1.5 text-[15px] font-semibold underline decoration-1 underline-offset-4 transition hover:text-accent-text"
          >
            Iscriviti alla newsletter
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </header>

        {!latest ? (
          <div className="mt-10 rounded-card bg-surface p-8 shadow-card sm:p-10">
            <p className="text-xl font-bold">I primi articoli stanno arrivando.</p>
            <p className="mt-2 text-[15px] text-muted">
              Torna a trovarci presto per guide, novità e consigli dal team di Pluggers.
            </p>
          </div>
        ) : (
          <>
            <Link
              href={`/blog/${latest.id}`}
              className="group mt-10 block rounded-card bg-surface p-6 shadow-card transition hover:shadow-lit sm:p-10"
            >
              <PostMeta post={latest} />
              <h2 className="mt-3 max-w-[30ch] text-balance text-[clamp(1.6rem,3.2vw,2.4rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
                {latest.title}
              </h2>
              <p className="mt-4 line-clamp-3 max-w-[62ch] text-[16px] leading-[1.6] text-muted sm:text-[17px]">
                {excerpt(latest.content)}
              </p>
              <span className="mt-6 inline-flex min-h-12 items-center gap-2 text-[15px] font-semibold text-accent-text">
                Leggi l&apos;articolo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>

            {older.length > 0 && (
              <ul className="mt-6 divide-y divide-hair sm:mt-10">
                {older.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.id}`}
                      className="group grid gap-2 py-6 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8 sm:py-8"
                    >
                      <time
                        dateTime={post.createdAt}
                        className="hidden pt-1 text-[15px] text-muted sm:block"
                      >
                        {formatPostDate(post.createdAt)}
                      </time>
                      <div className="min-w-0">
                        <div className="sm:hidden">
                          <PostMeta post={post} />
                        </div>
                        <h2 className="mt-1 text-balance text-[19px] font-bold leading-snug tracking-[-0.015em] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 sm:mt-0 sm:text-[22px]">
                          {post.title}
                        </h2>
                        <p className="mt-2 line-clamp-2 max-w-[68ch] text-[15px] leading-[1.6] text-muted sm:text-[16px]">
                          {excerpt(post.content)}
                        </p>
                        <p className="mt-3 hidden text-[14px] text-muted sm:block">
                          <span className="font-semibold text-accent-text">{post.category}</span>
                          <span aria-hidden> · </span>
                          {readingMinutes(post.content)} min di lettura
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/blog/admin"
            className="inline-flex min-h-12 items-center gap-2 px-3 text-[14px] text-muted underline-offset-4 transition hover:text-ink hover:underline"
          >
            <PenLine className="h-4 w-4" aria-hidden />
            Pubblica un articolo
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
