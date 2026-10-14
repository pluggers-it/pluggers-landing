import Link from "next/link";
import { MapPin, MapPinPlus } from "lucide-react";
import { FieldCanvas } from "./FieldCanvas";
import { HeroDemo } from "./HeroDemo";
import { HeroIcon } from "./HeroIcon";
import { StoreBadges } from "./StoreBadges";
import { HERO } from "@/lib/home";
import { AppLink } from "./AppLink";
import { BTN_PRIMARY, CONTAINER } from "./styles";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <FieldCanvas />
      <div
        className={`${CONTAINER} relative z-10 grid items-center gap-12 pb-16 pt-6 sm:pt-10 lg:grid-cols-[minmax(0,10fr)_minmax(0,11fr)] lg:gap-16 lg:pb-28 lg:pt-16`}
      >
        {/* Container: the eyebrow scales with this column so it stays on one line from 640px up. */}
        <div className="@container">
          <p className="mb-4 text-[clamp(12px,2.9cqi,15px)] font-bold uppercase tracking-[0.04em] text-accent-text sm:whitespace-nowrap">
            {HERO.eyebrow}
          </p>
          <h1 className="text-balance text-[clamp(2.5rem,4.6vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
            {HERO.title}
          </h1>
          <p className="mt-5 max-w-[44ch] text-[17px] leading-[1.55] text-muted sm:text-lg">
            {HERO.lede}
          </p>
          <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm font-medium text-muted">
            <li className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-accent-text" strokeWidth={2} aria-hidden />
              Oggi attivo a Torino
            </li>
            <li className="inline-flex items-center gap-1.5">
              <MapPinPlus className="h-4 w-4 text-accent-text" strokeWidth={2} aria-hidden />
              Prossimamente in arrivo in tutta Italia
            </li>
          </ul>
          {/* From a computer the web app, where the request starts; phones get the store badges only. */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <AppLink computerOnly whenClosed="stores" className={`${BTN_PRIMARY} max-sm:hidden`}>
              Racconta il problema
            </AppLink>
            <StoreBadges />
          </div>
          <Link href="/professionisti" className="mt-4 inline-flex min-h-12 items-center gap-1.5 text-[15px] font-semibold underline underline-offset-4">
            Sei un professionista? Ecco come funziona
          </Link>
        </div>

        <div className="relative">
          <HeroDemo />
          {/* Beside the demo label on phones; from sm up, in the free corner left of the list of professionals. */}
          <HeroIcon className="absolute -top-3 right-0 z-0 h-12 w-12 sm:bottom-0 sm:left-0 sm:right-auto sm:top-auto sm:h-32 sm:w-32" />
        </div>
      </div>
    </section>
  );
}
