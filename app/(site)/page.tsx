import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TradesMarquee } from "@/components/landing/TradesMarquee";
import { ForPros } from "@/components/landing/ForPros";
import { TrustRows } from "@/components/landing/TrustRows";
import { Faq } from "@/components/landing/Faq";
import { CONTAINER } from "@/components/landing/styles";

export const metadata: Metadata = {
  title: "Pluggers — Il professionista giusto, al momento giusto.",
  description:
    "Racconta il problema con testo e foto: Pluggers capisce di che si tratta e ti collega " +
    "ai professionisti della tua zona. Costo Chiamata indicato prima della visita, chat e preventivo in app.",
  alternates: {
    canonical: "https://www.plggrs.it",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <JsonLd />
      <LandingHeader />
      <main>
        <Hero />
        <HowItWorks />
        <TradesMarquee />
        <ForPros />
        <TrustRows />
        <Faq />
      </main>
      <div className={CONTAINER}>
        {/* The mark alone, in the quiet text colour, so it reads in both themes. */}
        <div
          aria-hidden
          className="mx-auto mb-8 h-[30px] w-[30px] bg-[color-mix(in_srgb,var(--ink)_30%,transparent)] [mask-image:url(/brand/brand-mark.png)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
        />
        <SiteFooter />
      </div>
    </div>
  );
}
