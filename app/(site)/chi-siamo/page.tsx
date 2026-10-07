import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SitePage } from "@/components/landing/SitePage";
import { WEB_APP_URL } from "@/components/landing/links";
import { BTN_PRIMARY, H2 } from "@/components/landing/styles";
import { ABOUT, COMPANY_FACTS } from "@/lib/about";
import { ORG_ID, breadcrumbSchema, graph, pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: ABOUT.title,
  description: ABOUT.description,
  path: "/chi-siamo",
});

export default function ChiSiamoPage() {
  const trail = [{ name: "Chi siamo", path: "/chi-siamo" }];

  return (
    <SitePage trail={trail}>
      <JsonLd
        data={graph(
          {
            "@type": "AboutPage",
            url: `${SITE_URL}/chi-siamo`,
            name: ABOUT.title,
            about: { "@id": ORG_ID },
            inLanguage: "it-IT",
          },
          breadcrumbSchema(trail)
        )}
      />

      <div className="mx-auto w-full max-w-[760px] px-5 pb-8 pt-4 sm:px-8 lg:pt-8">
        <h1 className="text-balance text-[clamp(2.4rem,4.4vw,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
          Chi siamo
        </h1>
        <p className="mt-5 text-[17px] leading-[1.6] text-muted sm:text-lg">{ABOUT.intro}</p>

        {ABOUT.sections.map((s) => (
          <section key={s.title} className="mt-12">
            <h2 className={H2}>{s.title}</h2>
            <p className="mt-4 text-[16px] leading-[1.65]">{s.text}</p>
          </section>
        ))}

        <section className="mt-12" aria-labelledby="company-title">
          <h2 id="company-title" className={H2}>
            Dati della società
          </h2>
          <dl className="mt-6 divide-y divide-hair border-y border-hair">
            {COMPANY_FACTS.map(({ label, value, href }) => (
              <div key={label} className="grid gap-1 py-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-6">
                <dt className="text-[15px] text-muted">{label}</dt>
                <dd className="text-[16px] font-medium">
                  {href ? (
                    <a href={href} className="text-accent-text underline underline-offset-4">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-12">
          <a href={WEB_APP_URL} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
            Apri Pluggers
          </a>
        </div>
      </div>
    </SitePage>
  );
}
