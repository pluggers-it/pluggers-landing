import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SitePage } from "@/components/landing/SitePage";
import { WEB_APP_URL } from "@/components/landing/links";
import { GuidePhone } from "@/components/landing/GuideSteps";
import { BTN_PRIMARY, CONTAINER, H2 } from "@/components/landing/styles";
import Image from "next/image";
import { ABOUT, ADVISORS, COMPANY_FACTS, NEXT, PRINCIPLES, STORY, TEAM, WHAT, WHERE, type TeamMember } from "@/lib/about";
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

      <section className={`${CONTAINER} grid items-center gap-12 pb-4 pt-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:pt-8`}>
        <div>
          <h1 className="text-balance text-[clamp(2.4rem,4.4vw,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
            Chi siamo
          </h1>
          <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.6] text-muted sm:text-lg">{ABOUT.intro}</p>
        </div>
        <div className="relative mx-auto flex h-[560px] w-[340px] justify-center sm:w-[420px]">
          <GuidePhone src="/guida/professionisti/04.webp" alt="Le richieste dei clienti vicini, nell'app del professionista" priority className="absolute left-0 top-6 rotate-[-4deg] scale-[0.86] opacity-95" />
          <GuidePhone src="/guida/clienti/01.webp" alt="La richiesta del cliente: il problema descritto con una foto" priority className="absolute right-0 top-0 rotate-[3deg]" />
        </div>
      </section>

      <div className="mx-auto w-full max-w-[760px] px-5 pb-8 sm:px-8">

        <section className="mt-12" aria-labelledby="story-title">
          <h2 id="story-title" className={H2}>Come è nato Pluggers</h2>
          <p className="mt-4 text-[16px] leading-[1.65]">{STORY}</p>
        </section>

        <section className="mt-12" aria-labelledby="what-title">
          <h2 id="what-title" className={H2}>Cosa fa Pluggers</h2>
          <p className="mt-4 text-[16px] leading-[1.65]">{WHAT}</p>
        </section>

        <section className="mt-12" aria-labelledby="principles-title">
          <h2 id="principles-title" className={H2}>Cosa facciamo e cosa no</h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            {PRINCIPLES.map((v) => (
              <div key={v.title}>
                <dt className="font-bold">{v.title}</dt>
                <dd className="mt-2 text-[15px] leading-[1.6] text-muted">{v.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12" aria-labelledby="next-title">
          <h2 id="next-title" className={H2}>Cosa arriva dopo</h2>
          <p className="mt-4 text-[16px] leading-[1.65]">{NEXT}</p>
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

        <section className="mt-12" aria-labelledby="where-title">
          <h2 id="where-title" className={H2}>Dove siamo</h2>
          <p className="mt-4 text-[16px] leading-[1.65]">{WHERE}</p>
        </section>

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
