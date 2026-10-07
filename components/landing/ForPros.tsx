import { Inbox, Radar, Receipt } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";
import { WEB_APP_URL } from "./links";
import { PROS } from "@/lib/home";
import { BTN_PRIMARY, CONTAINER, H2, LEDE_ANSWER } from "./styles";

const ICONS = [Inbox, Radar, Receipt];

export function ForPros() {
  return (
    <section
      id="professionisti"
      className="border-y border-hair bg-surface py-20 lg:py-28"
      aria-labelledby="pros-title"
    >
      <div className={`${CONTAINER} grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20`}>
        <div>
          <h2 id="pros-title" className={H2}>
            {PROS.title}
          </h2>
          <p className={LEDE_ANSWER}>{PROS.lede}</p>

          <ul className="mt-10 divide-y divide-hair">
            {PROS.benefits.map(({ title, text }, i) => {
              const Icon = ICONS[i];
              return (
              <li key={title} className="flex gap-4 py-5 first:pt-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-deep dark:text-accent-text">
                  <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                </span>
                <div>
                  <h3 className="text-[17px] font-bold leading-snug">{title}</h3>
                  <p className="mt-1 max-w-[46ch] text-[15px] leading-[1.55] text-muted">{text}</p>
                </div>
              </li>
              );
            })}
          </ul>

          <a href={WEB_APP_URL} className={`${BTN_PRIMARY} mt-8`}>
            {PROS.cta}
          </a>
        </div>

        <div className="lg:pt-2">
          <WaitlistForm title={PROS.waitlistTitle} description={PROS.waitlistText} />
        </div>
      </div>
    </section>
  );
}
