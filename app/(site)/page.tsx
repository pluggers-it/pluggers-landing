import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { PlugSpinner } from "@/components/PlugSpinner";

/**
 * Landing page (single-page style) for Pluggers.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-16 sm:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-56 left-1/2 h-[620px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.32),rgba(0,0,0,0)_60%)] blur-3xl" />
          <div className="absolute bottom-[-280px] right-[-220px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.20),rgba(0,0,0,0)_62%)] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.18]" />
        </div>

        <div className="relative">
          <SiteHeader label="PLUGGERS // COOMING SOON" />
        </div>

        <main className="relative flex flex-1 flex-col items-center justify-center py-18 text-center">
          <PlugSpinner />

          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-2 font-mono text-xs tracking-[0.22em] text-[var(--color-muted)] backdrop-blur">
            COOMING SOON
          </div>

          <h1 className="mt-10 max-w-3xl font-sans text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Il software di cui non sapevi avere bisogno a cui non potrai fare a
            meno.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-muted)] sm:text-lg">
            Un’esperienza semplice, veloce e sorprendentemente utile.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-6 py-3 font-mono text-sm text-[var(--color-foreground)] backdrop-blur transition hover:border-[var(--color-accent)]"
            >
              Entra nel Blog
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <div className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-3 font-mono text-xs text-[var(--color-muted)]">
              accent: <span className="text-[var(--color-accent)]">purple</span>
            </div>
          </div>
        </main>

        <footer className="relative flex flex-col items-center justify-between gap-3 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-muted)] sm:flex-row">
          <div className="font-mono">© {new Date().getFullYear()} Pluggers</div>
          <div className="font-mono">Next.js • Tailwind • Framer Motion</div>
        </footer>
      </div>
    </div>
  );
}

