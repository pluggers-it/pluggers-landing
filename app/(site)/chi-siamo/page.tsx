import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SitePage } from "@/components/landing/SitePage";
import { WEB_APP_URL } from "@/components/landing/links";
import { BTN_PRIMARY, H2 } from "@/components/landing/styles";
import Image from "next/image";
import { ABOUT, ADVISORS, COMPANY_FACTS, MISSION, STORY, TEAM, VALUES, VISION, type TeamMember } from "@/lib/about";
import { ORG_ID, breadcrumbSchema, graph, pageMetadata, pageSchema } from "@/lib/seo";
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
          { ...pageSchema({ path: "/chi-siamo", name: ABOUT.title, type: "AboutPage" }), about: { "@id": ORG_ID } },
          ...[...TEAM, ...ADVISORS].map((m) => ({
            "@type": "Person",
            name: m.name,
            jobTitle: m.role,
            worksFor: { "@id": ORG_ID },
          })),
          breadcrumbSchema(trail)
        )}
      />

      <div className="mx-auto w-full max-w-[760px] px-5 pb-8 pt-4 sm:px-8 lg:pt-8">
        <h1 className="text-balance text-[clamp(2.4rem,4.4vw,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
          Chi siamo
        </h1>
        <p className="mt-5 text-[17px] leading-[1.6] text-muted sm:text-lg">{ABOUT.intro}</p>

        <section className="mt-12" aria-labelledby="story-title">
          <h2 id="story-title" className={H2}>La nostra storia</h2>
          <p className="mt-4 text-[16px] leading-[1.65]">{STORY}</p>
        </section>

        <section className="mt-12 grid gap-8 sm:grid-cols-2" aria-label="Visione e missione">
          <div>
            <h2 className={H2}>Visione</h2>
            <p className="mt-4 text-[16px] leading-[1.65]">{VISION}</p>
          </div>
          <div>
            <h2 className={H2}>Missione</h2>
            <p className="mt-4 text-[16px] leading-[1.65]">{MISSION}</p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="values-title">
          <h2 id="values-title" className={H2}>In cosa crediamo</h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title}>
                <dt className="font-bold">{v.title}</dt>
                <dd className="mt-2 text-[15px] leading-[1.6] text-muted">{v.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12" aria-labelledby="team-title">
          <h2 id="team-title" className={H2}>Le persone</h2>
          <ul className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {TEAM.map((m) => <Member key={m.name} m={m} />)}
          </ul>
          {ADVISORS.length > 0 && (
            <>
              <h3 className="mt-10 text-[15px] font-semibold uppercase tracking-[0.06em] text-muted">Advisor</h3>
              <ul className="mt-4 grid gap-x-8 gap-y-8 sm:grid-cols-2">
                {ADVISORS.map((m) => <Member key={m.name} m={m} />)}
              </ul>
            </>
          )}
        </section>

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

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("");
}

function Member({ m }: { m: TeamMember }) {
  return (
    <li className="flex gap-4">
      {m.photo ? (
        <Image src={m.photo} alt={m.name} width={72} height={72} className="h-[72px] w-[72px] shrink-0 rounded-full object-cover" />
      ) : (
        <span
          aria-hidden
          className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-accent-soft text-[22px] font-extrabold tracking-[-0.02em] text-accent-text"
        >
          {initials(m.name)}
        </span>
      )}
      <div className="min-w-0">
        <p className="font-bold leading-snug">{m.name}</p>
        <p className="text-[15px] font-medium text-accent-text">{m.role}</p>
        <p className="mt-2 text-[15px] leading-[1.6] text-muted">{m.bio}</p>
      </div>
    </li>
  );
}
