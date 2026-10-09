import { Building2, CreditCard, Smartphone } from "lucide-react";
import { COMING } from "@/lib/home";
import { CONTAINER, H2 } from "./styles";

const ICONS = [Smartphone, CreditCard, Building2];

export function ComingSoon() {
  return (
    <section className={`${CONTAINER} py-20 lg:py-28`} aria-labelledby="coming-title">
      <h2 id="coming-title" className={H2}>
        {COMING.title}
      </h2>
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {COMING.items.map(({ title, text }, i) => {
          const Icon = ICONS[i];
          return (
            <li key={title} className="rounded-card bg-surface p-6 shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-deep dark:text-accent-text">
                <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
              </span>
              <h3 className="mt-4 text-[17px] font-bold leading-snug">{title}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-muted">{text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
