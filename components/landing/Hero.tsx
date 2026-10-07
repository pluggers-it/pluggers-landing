import { FieldCanvas } from "./FieldCanvas";
import { HeroDemo } from "./HeroDemo";
import { StoreBadges } from "./StoreBadges";
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
          <h1 className="text-balance text-[clamp(2.5rem,4.6vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
            Il professionista giusto, al momento giusto.
          </h1>
          <p className="mt-5 max-w-[44ch] text-[17px] leading-[1.55] text-muted sm:text-lg">
            Racconta il problema. Pluggers capisce di che si tratta e ti collega a
            chi può risolverlo, vicino a te.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={WEB_APP_URL} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
              Apri Pluggers
            </a>
            <StoreBadges />
          </div>
        </div>

        <HeroDemo />
      </div>
    </section>
  );
}
