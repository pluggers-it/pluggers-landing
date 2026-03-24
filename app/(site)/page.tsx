import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { HomeHero } from "@/components/HomeHero";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Pluggers — Il professionista giusto, al momento giusto.",
  description:
    "L'applicazione che mette in contatto chi ha un problema con chi ha la soluzione. " +
    "Trova idraulici, elettricisti, muratori e altri artigiani qualificati vicino a te.",
  alternates: {
    canonical: "https://pluggers.it",
  },
};

/**
 * Landing page (single-page style) for Pluggers.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <JsonLd />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col overflow-visible px-6 py-16 sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-56 left-1/2 h-[620px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.32),rgba(0,0,0,0)_60%)] blur-3xl" />
          <div className="absolute bottom-[-280px] right-[-220px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.20),rgba(0,0,0,0)_62%)] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.18]" />
        </div>

        <div className="relative">
          <SiteHeader label="PLUGGERS // EARLY ACCESS" />
        </div>

        <HomeHero />

        <SiteFooter />
      </div>
    </div>
  );
}

