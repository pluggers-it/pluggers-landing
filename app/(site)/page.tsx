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
    canonical: "https://pluggers.it",
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
        <SiteFooter />
      </div>
    </div>
  );
}
