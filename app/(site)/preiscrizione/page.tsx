import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { WaitlistForm } from "@/components/WaitlistForm";
import { SitePage } from "@/components/landing/SitePage";
import { BETA_BEFORE_LAUNCH, PRELAUNCH_PATH, TESTFLIGHT_URL } from "@/components/landing/links";
import { appInStores, prelaunchPrefill } from "@/lib/prelaunch";
import { ORG } from "@/lib/site";
import { getTrade } from "@/lib/trades";

export const metadata: Metadata = {
  title: "Pre-iscrizione",
  description: "Pluggers arriva a breve su iPhone e Android. Lasciaci i contatti: ti avvisiamo appena è disponibile.",
  alternates: { canonical: PRELAUNCH_PATH },
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ da?: string | string[]; ruolo?: string | string[] }> };

// Where links into Pluggers lead until the app is in the stores. Once it is, old links land on the home.
export default async function PreiscrizionePage({ searchParams }: Props) {
  if (await appInStores()) redirect("/");
  const { role, tradeSlug, page } = prelaunchPrefill(await searchParams);
  const trade = tradeSlug ? (getTrade(tradeSlug)?.label ?? null) : null;

  return (
    <SitePage trail={[{ name: "Pre-iscrizione", path: PRELAUNCH_PATH }]}>
      <section className="mx-auto w-full max-w-[760px] px-5 pt-4 sm:px-8 lg:pt-8">
        <h1 className="text-balance text-[clamp(2.2rem,4.4vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
          Pluggers arriva a breve su iPhone e Android
        </h1>
        <div className="mt-8">
          <WaitlistForm
            title="Pre-iscrizione"
            description="Per chi cerca un professionista e per chi lo è."
            successMessage="Grazie, sei nella lista. Ti avvisiamo appena Pluggers è disponibile su iPhone e Android."
            prelaunch={{ role, trade, page }}
            afterSubmit={BETA_BEFORE_LAUNCH && <BetaInvite />}
          />
        </div>
      </section>
    </SitePage>
  );
}

/** Shown after the thanks only with BETA_BEFORE_LAUNCH on: offering the beta is the owner's call. */
function BetaInvite() {
  return (
    <div className="mt-4 rounded-2xl border border-line p-4">
      <p className="text-[15px] font-semibold">Intanto puoi provare la beta</p>
      <p className="mt-1 text-[15px] leading-[1.55] text-muted">
        Su iPhone con TestFlight, l&apos;app di Apple per le versioni di prova. Su Android la beta è su invito: scrivici a{" "}
        <a href={`mailto:${ORG.email}`} className="font-medium text-accent-text underline underline-offset-2">
          {ORG.email}
        </a>
        .
      </p>
      <a href={TESTFLIGHT_URL} className="mt-2 inline-flex min-h-12 items-center font-semibold text-accent-text underline underline-offset-4">
        Prova la beta su iPhone
      </a>
    </div>
  );
}
