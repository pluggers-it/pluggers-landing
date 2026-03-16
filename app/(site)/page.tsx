import { SiteHeader } from "@/components/SiteHeader";
import { HomeHero } from "@/components/HomeHero";

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

        <HomeHero />

        <footer className="relative flex flex-col items-center justify-between gap-3 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-muted)] sm:flex-row">
          <div className="font-mono">© {new Date().getFullYear()} Pluggers</div>
          <div className="font-mono">Next.js • Tailwind • Framer Motion</div>
        </footer>
      </div>
    </div>
  );
}

