import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { WaitlistForm } from "@/components/WaitlistForm";
import { FaqList } from "@/components/landing/FaqList";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SitePage } from "@/components/landing/SitePage";
import { TrustRows } from "@/components/landing/TrustRows";
import { WEB_APP_URL } from "@/components/landing/links";
import { BTN_PRIMARY, CONTAINER, H2 } from "@/components/landing/styles";
import { FAQ } from "@/lib/home";
import { breadcrumbSchema, graph, pageMetadata, pageSchema } from "@/lib/seo";
import { TRADES } from "@/lib/trades";

const PATH = "/clienti";

export const metadata: Metadata = pageMetadata({
  title: "Trovare un idraulico o un artigiano a Torino",
  description:
    "Descrivi il guasto con parole e foto: Pluggers capisce quale professionista serve e ti mostra chi lavora vicino a te a Torino. Gratis per chi cerca.",
  path: PATH,
});

export default function ClientiPage() {
  const trail = [{ name: "Per i clienti", path: PATH }];
  return (
    <SitePage trail={trail}>
      <JsonLd data={graph(pageSchema({ path: PATH, name: "Trovare un idraulico o un artigiano a Torino" }), breadcrumbSchema(trail))} />

      <section className={`${CONTAINER} pb-4 pt-4 lg:pt-8`}>
        <h1 className="max-w-[20ch] text-balance text-[clamp(2.4rem,4.4vw,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
          Trovare il professionista giusto per casa, a Torino
        </h1>
        <p className="mt-5 max-w-[62ch] text-[17px] leading-[1.6] text-muted sm:text-lg">
          Non serve sapere quale professionista ti serve: lo capisce l&apos;assistente di Pluggers dalla tua descrizione e ti mostra chi lavora nella tua zona. Per chi cerca è gratis.
        </p>
        <a href={WEB_APP_URL} className={`${BTN_PRIMARY} mt-8`}>
          Racconta il tuo problema
        </a>
      </section>

      <HowItWorks />
      <TrustRows />

      <section className={`${CONTAINER} py-12 lg:py-16`} aria-labelledby="trades-title">
        <h2 id="trades-title" className={H2}>Chi trovi su Pluggers a Torino</h2>
        <ul className="mt-6 grid grid-cols-2 gap-x-6 sm:grid-cols-3">
          {TRADES.map((t) => (
            <li key={t.slug}>
              <Link href={`/torino/${t.slug}`} className="inline-flex min-h-12 items-center underline-offset-4 hover:underline">
                {t.label} a Torino
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-[760px] px-5 py-12 sm:px-8 lg:py-16" aria-labelledby="faq-title">
        <h2 id="faq-title" className={H2}>Domande frequenti</h2>
        <FaqList items={FAQ} />
      </section>

      <section className={`${CONTAINER} pb-16`}>
        <WaitlistForm />
      </section>
    </SitePage>
  );
}
