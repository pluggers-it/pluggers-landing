import type { Metadata } from "next";
import { cache } from "react";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { GuidePhone } from "@/components/landing/GuideSteps";
import { webAppUrl } from "@/components/landing/links";
import { BTN_PRIMARY, CONTAINER } from "@/components/landing/styles";
import { inviteCode, readInvite } from "@/lib/invite";
import { OG_IMAGE } from "@/lib/seo";
import { ORG } from "@/lib/site";
import { CopyCode } from "./CopyCode";

type Props = { params: Promise<{ code: string }>; searchParams: Promise<{ p?: string | string[] }> };

// One lookup per request for both the metadata and the page (a fetch with a timeout signal isn't deduplicated by Next).
const lookup = cache(async (raw: string) => {
  const code = inviteCode(raw);
  const invite = code ? await readInvite(code) : { known: false };
  const title = invite.firstName ? `${invite.firstName} ti ha invitato su Pluggers` : "Ti hanno invitato su Pluggers";
  // A code core-api says doesn't exist is neither shown nor passed to the app.
  return { code: code && invite.known ? code : null, title };
});

// The preview WhatsApp shows when the link is shared. Not in the sitemap, kept out of search.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title } = await lookup((await params).code);
  return {
    title: { absolute: "Invito su Pluggers" },
    description: ORG.summary,
    robots: { index: false, follow: false },
    openGraph: { type: "website", locale: "it_IT", siteName: ORG.name, title, description: ORG.summary, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description: ORG.summary, images: [OG_IMAGE.url] },
  };
}

/** The estimate link token the web app reads, as it checks it: hex, 16 to 64 characters. */
const QUOTE_TOKEN = /^[0-9a-f]{16,64}$/i;

// Opened from a friend's or colleague's message: who invited you, what Pluggers is, one way in.
// Always the web app, on phones too: a store link can't carry the invite code to the app.
export default async function InvitePage({ params, searchParams }: Props) {
  const { code, title } = await lookup((await params).code);
  const { p } = await searchParams;
  const appUrl = webAppUrl({ ref: code, p: typeof p === "string" && QUOTE_TOKEN.test(p) ? p : null });

  return (
    <main className="min-h-[100dvh] bg-page text-ink">
      <div className={CONTAINER}>
        <header className="flex h-16 items-center sm:h-20">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain links: leaving an invite page reloads, so its address never stays in a tab's history where Google Analytics reads it on Back */}
          <a href="/" rel="noreferrer" className="flex items-center gap-2.5 rounded-full py-2 pr-2" aria-label="Pluggers, pagina iniziale">
            <Image src={logo} alt="" width={36} height={36} className="h-9 w-9 rounded-[10px]" priority />
            <span className="text-lg font-bold tracking-[-0.02em]">Pluggers</span>
          </a>
        </header>

        <section className="grid items-center gap-12 pb-20 pt-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:pt-12">
          <div>
            <h1 className="max-w-[16ch] text-balance break-words text-[clamp(2.2rem,4.4vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
              {title}
            </h1>
            <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.6] text-muted sm:text-lg">{ORG.summary}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={appUrl} target="_blank" rel="noopener noreferrer" className={`${BTN_PRIMARY} w-full sm:w-auto`}>
                Apri Pluggers
                <span className="sr-only"> (si apre in una nuova scheda)</span>
              </a>
            </div>
            {code && <CopyCode code={code} />}
            <p className="mt-4 text-[15px] text-muted">
              Sei un professionista?{" "}
              <a href="/professionisti" rel="noreferrer" className="inline-flex min-h-12 items-center font-semibold text-accent-text underline-offset-4 hover:underline">
                Leggi la guida
              </a>
            </p>
          </div>
          <div className="flex justify-center">
            <GuidePhone
              src="/guida/clienti/01.webp"
              alt="Schermata iniziale dell'app: il campo «Di cosa hai bisogno?» con la descrizione di un guasto, una foto allegata e il bottone «Trova professionisti»."
              priority
              className="lg:rotate-[3deg]"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
