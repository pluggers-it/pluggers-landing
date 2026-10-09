import Image from "next/image";
import { Lightbulb } from "lucide-react";
import { CONTAINER } from "./styles";

export type GuideStep = {
  id: string;
  /** Short label for the step index ("Racconta il problema"). */
  short: string;
  title: string;
  text: string;
  /** What the person sees or does on that screen. */
  points: string[];
  tip?: string;
  src: string;
  alt: string;
};

/** A real app screen in a phone, the same frame as «Come funziona» on the home. */
export function GuidePhone({ src, alt, priority = false, className = "" }: { src: string; alt: string; priority?: boolean; className?: string }) {
  return (
    <div className={`w-[228px] shrink-0 rounded-[40px] sm:w-[260px] sm:rounded-[44px] bg-[var(--phone)] p-2.5 shadow-[0_40px_80px_-36px_rgba(23,21,26,0.55)] ${className}`}>
      <div className="overflow-hidden rounded-[36px] bg-[#f2f2f7]">
        <div className="flex h-8 items-start justify-center pt-2">
          <div className="h-[18px] w-[76px] rounded-full bg-[var(--phone)]" />
        </div>
        <Image src={src} alt={alt} width={600} height={1298} sizes="260px" priority={priority} className="block h-auto w-full" />
      </div>
    </div>
  );
}

/** Step-by-step guide: a sticky index, then one row per screen, phone and explanation side by side. */
export function GuideSteps({ steps, label }: { steps: GuideStep[]; label: string }) {
  return (
    <section aria-label={label} className="pb-8">
      <nav aria-label={`Indice: ${label}`} className="sticky top-0 z-30 border-y border-hair bg-page/90 backdrop-blur">
        <ol className={`${CONTAINER} flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]`}>
          {steps.map((s, i) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-hair bg-surface px-4 text-[14px] font-semibold transition hover:border-accent"
              >
                <span className="text-accent-text">{i + 1}</span>
                {s.short}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <ol className={`${CONTAINER} mt-6`}>
        {steps.map((s, i) => (
          <li
            key={s.id}
            id={s.id}
            className="grid scroll-mt-24 items-center gap-10 border-b border-hair py-14 last:border-b-0 lg:grid-cols-2 lg:gap-20 lg:py-20"
          >
            <div className={`flex justify-center ${i % 2 === 1 ? "lg:order-2" : ""}`}>
              <GuidePhone src={s.src} alt={s.alt} />
            </div>
            <div className="max-w-[34rem]">
              <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-accent-text">Passo {i + 1}</p>
              <h2 className="mt-2 text-balance text-[clamp(1.7rem,2.6vw,2.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em]">{s.title}</h2>
              <p className="mt-4 text-[17px] leading-[1.6] text-muted">{s.text}</p>
              <ul className="mt-6 grid gap-3">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-3 text-[16px] leading-[1.55]">
                    <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              {s.tip && (
                <p className="mt-7 flex gap-3 rounded-2xl bg-accent-soft p-4 text-[15px] leading-[1.55]">
                  <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-accent-text" aria-hidden />
                  <span>
                    <span className="font-bold">Consiglio: </span>
                    {s.tip}
                  </span>
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
