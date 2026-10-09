import Link from "next/link";
import { MapPin } from "lucide-react";
import { FieldCanvas } from "./FieldCanvas";
import { HeroDemo } from "./HeroDemo";
import { HeroIcon } from "./HeroIcon";
import { StoreBadges } from "./StoreBadges";
import { HERO } from "@/lib/home";
import { WEB_APP_URL } from "./links";
import { BTN_PRIMARY, CONTAINER } from "./styles";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <FieldCanvas />
      <div
        className={`${CONTAINER} relative z-10 grid items-center gap-12 pb-16 pt-6 sm:pt-10 lg:grid-cols-[minmax(0,10fr)_minmax(0,11fr)] lg:gap-16 lg:pb-28 lg:pt-16`}
      >
        <div>
          <p className="mb-4 text-[15px] font-bold uppercase tracking-[0.08em] text-accent-text">{HERO.eyebrow}</p>
          <h1 className="text-balance text-[clamp(2.5rem,4.6vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
            {HERO.title}
          </h1>
          <p className="mt-5 max-w-[44ch] text-[17px] leading-[1.55] text-muted sm:text-lg">
            {HERO.lede}
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted">
            <MapPin className="h-4 w-4 text-accent-text" strokeWidth={2} aria-hidden />
            Oggi attivo a Torino
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={WEB_APP_URL} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
              Racconta il problema
            </a>
            <StoreBadges />
          </div>
          <Link href="/professionisti" className="mt-4 inline-flex min-h-12 items-center gap-1.5 text-[15px] font-semibold underline underline-offset-4">
            Sei un professionista? Ecco come funziona
          </Link>
        </div>

        <div className="relative">
          <HeroDemo />
          {/* Beside the demo label on phones; in the free corner left of the professional card from sm up. */}
          <HeroIcon className="absolute -top-3 right-0 z-0 h-12 w-12 sm:bottom-1 sm:left-0 sm:right-auto sm:top-auto sm:h-32 sm:w-32" />
        </div>
      </div>
    </section>
  );
}
