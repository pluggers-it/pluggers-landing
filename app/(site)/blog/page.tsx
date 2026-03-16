import { SiteHeader } from "@/components/SiteHeader";

/**
 * Blog page intentionally starts empty (content is created via /admin).
 */
export default async function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
        <SiteHeader label="PLUGGERS // BLOG" />

        <main className="mt-12">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-8">
            <div className="font-mono text-xs tracking-[0.25em] text-[var(--color-muted)]">
              EMPTY
            </div>
            <div className="mt-3 font-sans text-2xl font-semibold tracking-tight">
              Nessun post ancora.
            </div>
            <div className="mt-2 text-sm text-[var(--color-muted)]">
              Crea i contenuti da{" "}
              <span className="text-[var(--color-accent)]">/admin</span>.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

