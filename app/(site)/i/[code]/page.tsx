import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { GuidePhone } from "@/components/landing/GuideSteps";
import { StoreBadges } from "@/components/landing/StoreBadges";
import { WEB_APP_URL } from "@/components/landing/links";
import { BTN_PRIMARY, CONTAINER } from "@/components/landing/styles";
import { inviteCode, readInvite } from "@/lib/invite";
import { OG_IMAGE } from "@/lib/seo";
import { ORG } from "@/lib/site";

const SHARE_TITLE = "Ti hanno invitato su Pluggers";

// The preview WhatsApp shows when the link is shared. Not in the sitemap, kept out of search.
export const metadata: Metadata = {
  title: { absolute: "Invito su Pluggers" },
  description: ORG.summary,
  robots: { index: false, follow: false },
  openGraph: { type: "website", locale: "it_IT", siteName: ORG.name, title: SHARE_TITLE, description: ORG.summary, images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", title: SHARE_TITLE, description: ORG.summary, images: [OG_IMAGE.url] },
};

// Opened from a friend's or colleague's message: who invited you, what Pluggers is, one way in.
export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const code = inviteCode((await params).code);
  const invite = code ? await readInvite(code) : { known: false };
  const appUrl = code && invite.known ? `${WEB_APP_URL}/?ref=${code}` : WEB_APP_URL;

  return (
    <main className="min-h-[100dvh] bg-page text-ink">
      <div className={CONTAINER}>
        <header className="flex h-16 items-center sm:h-20">
          <Link href="/" className="flex items-center gap-2.5 rounded-full py-2 pr-2" aria-label="Pluggers, pagina iniziale">
            <Image src={logo} alt="" width={36} height={36} className="h-9 w-9 rounded-[10px]" priority />
            <span className="text-lg font-bold tracking-[-0.02em]">Pluggers</span>
          </Link>
        </header>

        <section className="grid items-center gap-12 pb-20 pt-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:pt-12">
          <div>
            <h1 className="max-w-[16ch] text-balance break-words text-[clamp(2.2rem,4.4vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
              {invite.firstName ? `${invite.firstName} ti ha invitato su Pluggers` : SHARE_TITLE}
            </h1>
            <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.6] text-muted sm:text-lg">{ORG.summary}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={appUrl} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
                Apri Pluggers
              </a>
              <StoreBadges />
            </div>
            <p className="mt-6 text-[15px] text-muted">
              Sei un professionista?{" "}
              <Link href="/professionisti" className="inline-flex min-h-12 items-center font-semibold text-accent-text underline-offset-4 hover:underline">
                Leggi la guida
              </Link>
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
