import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { FaqList } from "@/components/landing/FaqList";
import { SitePage } from "@/components/landing/SitePage";
import { WEB_APP_URL } from "@/components/landing/links";
import { BTN_PRIMARY, CONTAINER, H2 } from "@/components/landing/styles";
import { breadcrumbSchema, faqSchema, graph, pageMetadata, serviceSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { TORINO, TRADE_GROUPS, TRADES } from "@/lib/trades";

export const metadata: Metadata = pageMetadata({
  title: TORINO.title,
  description: TORINO.description,
  path: "/torino",
});

export default function TorinoPage() {
  const trail = [{ name: "Torino", path: "/torino" }];

  return (
    <SitePage trail={trail}>
      <JsonLd
        data={graph(
          serviceSchema({
            name: "Professionisti per la casa a Torino con Pluggers",
            serviceType: "Ricerca di professionisti per interventi in casa",
            description: TORINO.intro,
            path: "/torino",
          }),
          {
            "@type": "ItemList",
            itemListElement: TRADES.map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `${t.label} a Torino`,
              url: `${SITE_URL}/torino/${t.slug}`,
            })),
          },
          faqSchema(TORINO.faq),
          breadcrumbSchema(trail)
        )}
      />

      <section className={`${CONTAINER} pb-12 pt-4 lg:pb-16 lg:pt-8`}>
        <h1 className="max-w-[18ch] text-balance text-[clamp(2.4rem,4.4vw,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
          Professionisti per la casa a Torino
        </h1>
        <p className="mt-5 max-w-[62ch] text-[17px] leading-[1.6] text-muted sm:text-lg">{TORINO.intro}</p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted">
          <MapPin className="h-4 w-4 text-accent-text" strokeWidth={2} aria-hidden />
          Oggi attivo a Torino
        </p>
        <div className="mt-8">
          <a href={WEB_APP_URL} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
            Apri Pluggers
          </a>
        </div>
      </section>

      {TRADE_GROUPS.map((group) => {
        const trades = TRADES.filter((t) => t.group === group.id);
        return (
          <section key={group.id} className={`${CONTAINER} py-8 lg:py-10`} aria-labelledby={`group-${group.id}`}>
            <h2 id={`group-${group.id}`} className="text-[24px] font-extrabold tracking-[-0.025em]">
              {group.label}
            </h2>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {trades.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/torino/${t.slug}`}
                    className="group flex items-center overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-hair transition hover:ring-line sm:block"
                  >
                    <Image
                      src={t.photo}
                      alt=""
                      width={800}
                      height={450}
                      sizes="(min-width: 1024px) 373px, (min-width: 640px) calc(50vw - 42px), 112px"
                      className="h-24 w-28 shrink-0 self-stretch object-cover sm:aspect-[16/9] sm:h-auto sm:w-full"
                    />
                    <div className="px-4 py-3 sm:p-5">
                      <h3 className="text-[18px] font-bold leading-snug group-hover:text-accent-text">
                        {t.label} a Torino
                      </h3>
                      <p className="mt-1 text-[15px] leading-[1.5] text-muted">{t.summary}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <section className="mx-auto w-full max-w-[760px] px-5 py-12 sm:px-8 lg:py-16" aria-labelledby="faq-title">
        <h2 id="faq-title" className={H2}>
          Domande frequenti
        </h2>
        <FaqList items={TORINO.faq} />
        <div className="mt-10">
          <a href={WEB_APP_URL} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
            Apri Pluggers
          </a>
        </div>
      </section>
    </SitePage>
  );
}
