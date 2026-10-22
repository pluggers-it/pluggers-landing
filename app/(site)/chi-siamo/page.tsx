import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SitePage } from "@/components/landing/SitePage";
import { AppLink } from "@/components/landing/AppLink";
import { GuidePhone } from "@/components/landing/GuideSteps";
import { BTN_PRIMARY, CONTAINER, H2 } from "@/components/landing/styles";
import Image from "next/image";
import { ABOUT, ADVISORS, NEXT, PRINCIPLES, STORY, TEAM, WHAT, type TeamMember } from "@/lib/about";
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
        {/* The box fits the phones (571px tall from sm, 502px below) and shrinks on narrow screens: the rotated phone used to stick out of the right margin, and past the edge on 360px phones. */}
        <div className="relative mx-auto h-[520px] w-[340px] max-w-full sm:h-[590px] sm:w-[420px]">
          <GuidePhone src="/guida/professionisti/04.webp" alt="Le richieste dei clienti vicini, nell'app del professionista" priority className="absolute left-0 top-6 rotate-[-4deg] scale-[0.86] opacity-95" />
          <GuidePhone src="/guida/clienti/01.webp" alt="La richiesta del cliente: il problema descritto con una foto" priority className="absolute right-4 top-0 rotate-[3deg]" />
        </div>
      </section>

      {/* Same container as the hero, so the title and the text start on the same line; the text itself stays 760px wide. */}
      <div className={`${CONTAINER} pb-8`}>
        <div className="max-w-[760px]">
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
        </div>

        <div className="mt-12 flex justify-center">
          <AppLink beforeLaunch="Pre-iscriviti" className={`${BTN_PRIMARY} w-full sm:w-auto`}>
            Apri Pluggers
          </AppLink>
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
    <li className="flex items-center gap-4">
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
      </div>
    </li>
  );
}
