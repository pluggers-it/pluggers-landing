import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageShell } from "@/components/landing/PageShell";
import { WEB_APP_URL } from "@/components/landing/links";
import { BTN_PRIMARY, CONTAINER } from "@/components/landing/styles";
import { JsonLd } from "@/components/JsonLd";
import { ORG_ID, breadcrumbSchema, graph, pageMetadata } from "@/lib/seo";
import { ORG, SITE_URL } from "@/lib/site";
import { tradesForPost } from "@/lib/tradeLinks";
import {
  excerpt,
  formatPostDate,
  getPostById,
  idFromSegment,
  markdownToHtml,
  metaDescription,
  postPath,
  readPosts,
  readingMinutes,
  type Post,
} from "@/lib/posts";

// served from the cache and rebuilt at most every five minutes; publishing revalidates at once
export const revalidate = 300;

// none at build time: each post is rendered on its first visit, then served from the cache
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const id = idFromSegment(slug);
  const post = id ? await getPostById(id) : null;
  if (!post) return { title: "Articolo non trovato", robots: { index: false } };
  // Long headlines go out as they are rather than with the brand suffix: Google cuts them anyway.
  const withBrand = `${post.title} — Pluggers`;
  return pageMetadata({
    title: post.title,
    absolute: withBrand.length > 60,
    description: metaDescription(post.content),
    path: postPath(post),
    publishedTime: new Date(post.createdAt).toISOString(),
  });
}

/** Up to three other posts: same category first, then the most recent. */
async function relatedPosts(post: Post): Promise<Post[]> {
  try {
    const others = (await readPosts()).filter((p) => p.id !== post.id);
    const same = others.filter((p) => p.category === post.category);
    const rest = others.filter((p) => p.category !== post.category);
    return [...same, ...rest].slice(0, 3);
  } catch {
    return [];
  }
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const id = idFromSegment(slug);
  const post = id ? await getPostById(id) : null;
  if (!post) notFound();
  // /blog/16 and any old or mistyped words lead to the one canonical address
  if (`/blog/${slug}` !== postPath(post)) permanentRedirect(postPath(post));

  const [contentHtml, related] = await Promise.all([
    markdownToHtml(post.content),
    relatedPosts(post),
  ]);

  const path = postPath(post);
  const trades = tradesForPost(`${post.title} ${excerpt(post.content)}`);
  const published = new Date(post.createdAt).toISOString();

  return (
    <PageShell>
      <JsonLd
        data={graph(
          {
            "@type": "BlogPosting",
            "@id": `${SITE_URL}${path}#article`,
            headline: post.title,
            description: metaDescription(post.content),
            datePublished: published,
            inLanguage: "it-IT",
            articleSection: post.category,
            url: `${SITE_URL}${path}`,
            mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${path}` },
            image: `${SITE_URL}/opengraph-image`,
            // inline, not only by @id: the Organization node lives in another <script> (layout)
            author: { "@type": "Organization", "@id": ORG_ID, name: ORG.name, url: SITE_URL },
            publisher: {
              "@type": "Organization",
              "@id": ORG_ID,
              name: ORG.name,
              logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
            },
          },
          breadcrumbSchema([
            { name: "Blog", path: "/blog" },
            { name: post.title, path },
          ])
        )}
      />
      <div className={CONTAINER}>
        <article className="mx-auto max-w-[38rem] pt-4 sm:pt-10">
          <nav aria-label="Percorso">
            <ol className="flex min-w-0 items-center gap-1.5 text-[15px] text-muted">
              <li className="shrink-0">
                <Link
                  href="/blog"
                  className="inline-flex min-h-12 items-center font-semibold text-ink underline-offset-4 hover:underline"
                >
                  Blog
                </Link>
              </li>
              <li aria-hidden className="shrink-0">
                <ChevronRight className="h-4 w-4" />
              </li>
              <li aria-current="page" className="min-w-0 truncate">
                {post.title}
              </li>
            </ol>
          </nav>

          <header className="mt-4 sm:mt-6">
            <p className="text-[14px] font-semibold text-accent-text">{post.category}</p>
            <h1 className="mt-2 text-balance text-[clamp(2rem,4.6vw,2.9rem)] font-extrabold leading-[1.08] tracking-[-0.035em]">
              {post.title}
            </h1>
            <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-muted">
              <span className="font-semibold text-ink">Il team di Pluggers</span>
              <time dateTime={post.createdAt} className="before:mr-2 before:content-['·']">
                {formatPostDate(post.createdAt)}
              </time>
              <span className="before:mr-2 before:content-['·']">
                {readingMinutes(post.content)} min di lettura
              </span>
            </p>
          </header>

          <div
            className="blog-body mt-10 border-t border-hair pt-8"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </article>

        {trades.length > 0 && (
          <nav aria-label="Professionisti a Torino" className="mx-auto mt-12 max-w-[38rem] border-t border-hair pt-6">
            <p className="text-[15px] text-muted">Professionisti su Pluggers</p>
            <ul className="mt-1 flex flex-wrap gap-x-6">
              {trades.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/torino/${t.slug}`}
                    className="inline-flex min-h-12 items-center font-semibold text-accent-text underline underline-offset-4"
                  >
                    {t.label} a Torino
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <aside
          aria-labelledby="cta-title"
          className="mx-auto mt-16 max-w-[38rem] rounded-card bg-surface p-6 shadow-card sm:p-8"
        >
          <h2 id="cta-title" className="text-[22px] font-extrabold leading-tight tracking-[-0.02em]">
            Pluggers per i professionisti
          </h2>
          <p className="mt-2 text-[16px] leading-[1.55] text-muted">
            Richieste già descritte e classificate, dai clienti dentro il raggio che scegli tu.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href={WEB_APP_URL} className={BTN_PRIMARY}>
              Apri Pluggers
            </a>
            <Link href="/professionisti" className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4">
              Come funziona per i professionisti
            </Link>
          </div>
        </aside>

        {related.length > 0 && (
          <section aria-labelledby="related-title" className="mt-20">
            <h2 id="related-title" className="text-[24px] font-extrabold tracking-[-0.02em]">
              Altri articoli
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {related.map((p) => (
                <li key={p.id} className="min-w-0">
                  <Link
                    href={postPath(p)}
                    className="group flex h-full flex-col rounded-card bg-surface p-6 shadow-card transition hover:shadow-lit"
                  >
                    <p className="text-[14px] text-muted">
                      <time dateTime={p.createdAt}>{formatPostDate(p.createdAt)}</time>
                    </p>
                    <h3 className="mt-2 line-clamp-3 text-[18px] font-bold leading-snug tracking-[-0.01em]">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[15px] leading-[1.55] text-muted">
                      {excerpt(p.content)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </PageShell>
  );
}
