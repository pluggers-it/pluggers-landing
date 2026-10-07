import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, TriangleAlert } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { FaqList } from "@/components/landing/FaqList";
import { SitePage } from "@/components/landing/SitePage";
import { WEB_APP_URL } from "@/components/landing/links";
import { BTN_OUTLINE, BTN_PRIMARY, CONTAINER, H2 } from "@/components/landing/styles";
import { breadcrumbSchema, faqSchema, graph, pageMetadata, serviceSchema } from "@/lib/seo";
import { TRADES, getTrade } from "@/lib/trades";

type Props = { params: Promise<{ mestiere: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return TRADES.map((t) => ({ mestiere: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trade = getTrade((await params).mestiere);
  if (!trade) return {};
  return pageMetadata({
    title: `${trade.label} a Torino`,
    description: trade.description,
    path: `/torino/${trade.slug}`,
  });
}

export default async function TradePage({ params }: Props) {
  const trade = getTrade((await params).mestiere);
  if (!trade) notFound();

  const path = `/torino/${trade.slug}`;
  const trail = [
    { name: "Torino", path: "/torino" },
    { name: trade.label, path },
  ];
  const others = TRADES.filter((t) => t.slug !== trade.slug);

  return (
    <SitePage trail={trail}>
      <JsonLd
        data={graph(
          serviceSchema({
            name: `${trade.label} a Torino con Pluggers`,
            serviceType: trade.label,
            description: trade.intro,
            path,
          }),
          faqSchema(trade.faq),
          breadcrumbSchema(trail)
        )}
      />

      <section
        className={`${CONTAINER} grid gap-10 pb-6 pt-4 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:items-center lg:gap-16 lg:pb-12 lg:pt-8`}
      >
        <div>
          <h1 className="text-balance text-[clamp(2.4rem,4.4vw,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
            {trade.label} a Torino
          </h1>
          <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.6] text-muted sm:text-lg">{trade.intro}</p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted">
            <MapPin className="h-4 w-4 text-accent-text" strokeWidth={2} aria-hidden />
            Oggi attivo a Torino
          </p>
          <div className="mt-8">
            <a href={WEB_APP_URL} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
              Apri Pluggers
            </a>
          </div>
        </div>
        <Image
          src={trade.photo}
          alt={trade.photoAlt}
          width={800}
          height={450}
          priority
          sizes="(min-width: 1200px) 480px, (min-width: 1024px) 40vw, calc(100vw - 40px)"
          className="aspect-[16/10] w-full rounded-card object-cover shadow-card"
        />
      </section>

      <section className={`${CONTAINER} py-12 lg:py-16`} aria-labelledby="problems-title">
        <h2 id="problems-title" className={H2}>
          Quando serve {trade.who}
        </h2>
        <p className="mt-3 max-w-[60ch] text-[17px] leading-[1.55] text-muted">{trade.problemsLede}</p>
        <ul className="mt-8 grid gap-x-12 md:grid-cols-2">
          {trade.problems.map((p) => (
            <li key={p} className="border-t border-hair py-4 text-[16px] leading-[1.55]">
              «{p}»
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-hair bg-surface py-16 lg:py-20" aria-labelledby="steps-title">
        <div className={CONTAINER}>
          <h2 id="steps-title" className={H2}>
            Come funziona con Pluggers
          </h2>
          <ol className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {trade.steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-[15px] font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[18px] font-bold leading-snug">{step.title}</h3>
                  <p className="mt-1 max-w-[52ch] text-[16px] leading-[1.55] text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${CONTAINER} py-12 lg:py-16`} aria-labelledby="emergency-title">
        <div className="rounded-card bg-[color-mix(in_srgb,var(--danger)_7%,var(--surface))] p-6 ring-1 ring-[color-mix(in_srgb,var(--danger)_30%,transparent)] sm:p-8">
          <h2 id="emergency-title" className="flex items-center gap-2.5 text-[22px] font-bold tracking-[-0.02em]">
            <TriangleAlert className="h-6 w-6 shrink-0 text-danger" strokeWidth={2} aria-hidden />
            Quando chiamare il 112
          </h2>
          <p className="mt-3 max-w-[70ch] text-[16px] leading-[1.6]">{trade.emergency}</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[760px] px-5 py-12 sm:px-8 lg:py-16" aria-labelledby="faq-title">
        <h2 id="faq-title" className={H2}>
          Domande frequenti
        </h2>
        <FaqList items={trade.faq} />
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={WEB_APP_URL} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
            Apri Pluggers
          </a>
          <Link href="/#come-funziona" className={`${BTN_OUTLINE} w-full sm:w-auto`}>
            Come funziona Pluggers
          </Link>
        </div>
      </section>

      <section className={`${CONTAINER} py-12 lg:py-16`} aria-labelledby="others-title">
        <h2 id="others-title" className={H2}>
          Altri mestieri a Torino
        </h2>
        <ul className="mt-8 flex flex-wrap gap-2">
          {others.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/torino/${t.slug}`}
                className="inline-flex h-12 items-center rounded-full border border-hair bg-surface px-4 text-[15px] font-semibold transition hover:border-line"
              >
                {t.label} a Torino
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[15px] text-muted">
          <Link href="/torino" className="font-semibold text-accent-text underline underline-offset-4">
            Tutti i mestieri a Torino
          </Link>
          {" · "}
          <Link href="/" className="font-semibold text-accent-text underline underline-offset-4">
            Torna alla home
          </Link>
        </p>
      </section>
    </SitePage>
  );
}
