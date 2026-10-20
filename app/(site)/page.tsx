import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { faq, HOME, HOW } from "@/lib/home";
import { appInStores } from "@/lib/prelaunch";
import { appSchema, faqSchema, graph, pageMetadata, pageSchema, serviceSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { SiteFooter } from "@/components/SiteFooter";
import { ComingSoon } from "@/components/landing/ComingSoon";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TradesMarquee } from "@/components/landing/TradesMarquee";
import { ForPros } from "@/components/landing/ForPros";
import { TrustRows } from "@/components/landing/TrustRows";
import { Faq } from "@/components/landing/Faq";
import { CONTAINER } from "@/components/landing/styles";

export const metadata: Metadata = pageMetadata({
  title: HOME.title,
  description: HOME.description,
  path: "/",
  absolute: true,
});

export default async function Home() {
  const inStores = await appInStores();
  const faqItems = faq(inStores);
  return (
    <div className="min-h-screen bg-page text-ink">
      <JsonLd
        data={graph(
          pageSchema({ path: "/", name: "Pluggers", mainEntity: `${SITE_URL}/#app` }),
          appSchema(inStores),
          serviceSchema({
            name: "Pluggers",
            serviceType: "Ricerca di professionisti per interventi in casa",
            description: HOW.lede,
            path: "/",
          }),
          faqSchema(faqItems)
        )}
      />
      <LandingHeader />
      <main>
        <Hero />
        <HowItWorks />
        <TradesMarquee />
        <ForPros />
        <TrustRows />
        <ComingSoon />
        <Faq items={faqItems} />
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
