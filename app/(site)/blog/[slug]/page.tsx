import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getPostById, markdownToHtml } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostById(slug);
  if (!post) return { title: "Articolo non trovato — Pluggers" };
  return {
    title: `${post.title} — Pluggers`,
    description: post.content.slice(0, 160),
  };
}

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPostById(slug);
  if (!post) notFound();

  const contentHtml = await markdownToHtml(post.content);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="relative mx-auto w-full max-w-3xl px-6 py-12 sm:px-10">

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.18),rgba(0,0,0,0)_60%)] blur-3xl" />
        </div>

        <div className="relative">
          <SiteHeader label="PLUGGERS // BLOG" />

          <main className="mt-12">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Torna al Blog
            </Link>

            {/* Article header */}
            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.18em]"
                  style={{
                    border: "1px solid rgba(139,92,246,0.35)",
                    background: "rgba(139,92,246,0.08)",
                    color: "var(--color-accent)",
                  }}
                >
                  {post.category.toUpperCase()}
                </span>
                <time className="font-mono text-[11px] text-[var(--color-muted)]">
                  {formatDate(post.createdAt)}
                </time>
              </div>

              <h1 className="mt-4 font-sans text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                {post.title}
              </h1>
            </div>

            <hr className="my-8 border-[var(--color-border)]" />

            {/* Article body — rendered markdown */}
            <div
              className="blog-body"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Footer nav */}
            <div className="mt-10 border-t border-[var(--color-border)] pt-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Torna al Blog
              </Link>
            </div>
            <div className="mt-8">
              <SiteFooter />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
