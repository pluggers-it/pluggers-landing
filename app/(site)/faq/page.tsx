import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { FaqList } from "@/components/landing/FaqList";
import { SitePage } from "@/components/landing/SitePage";
import { H2 } from "@/components/landing/styles";
import { faqAll, faqGroups } from "@/lib/faq";
import { appInStores } from "@/lib/prelaunch";
import { breadcrumbSchema, faqSchema, graph, pageMetadata, pageSchema } from "@/lib/seo";

const PATH = "/faq";

export const metadata: Metadata = pageMetadata({
  title: "Domande frequenti su Pluggers",
  description:
    "Come si fa una richiesta, come si sceglie il giorno, cosa sono stima, preventivo e QR, come si iscrive un professionista: le risposte a tutte le domande.",
  path: PATH,
});

export default async function FaqPage() {
  const inStores = await appInStores();
  const groups = faqGroups(inStores);
  const trail = [{ name: "FAQ", path: PATH }];
  return (
    <SitePage trail={trail}>
      <JsonLd
        data={graph(
          pageSchema({ path: PATH, name: "Domande frequenti su Pluggers" }),
          faqSchema(faqAll(inStores)),
          breadcrumbSchema(trail)
        )}
      />

      <section className="mx-auto w-full max-w-[760px] px-5 pt-4 sm:px-8 lg:pt-8">
        <h1 className="text-balance text-[clamp(2.4rem,4.4vw,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
          Domande frequenti
        </h1>
        <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.6] text-muted sm:text-lg">
          Le risposte a quello che ci chiedono di più, per chi cerca un professionista e per chi lo è.
        </p>
        <nav aria-label="Argomenti" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="inline-flex min-h-12 items-center rounded-full border border-hair bg-surface px-4 text-[15px] font-semibold transition hover:border-accent"
                >
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {groups.map((g) => (
        <section
          key={g.id}
          id={g.id}
          aria-labelledby={`${g.id}-titolo`}
          className="mx-auto w-full max-w-[760px] scroll-mt-6 px-5 pt-14 sm:px-8 lg:pt-20"
        >
          <h2 id={`${g.id}-titolo`} className={H2}>
            {g.title}
          </h2>
          <p className="mt-3 text-[17px] leading-[1.55] text-muted">{g.lede}</p>
          <FaqList items={g.items} />
        </section>
      ))}
    </SitePage>
  );
}
