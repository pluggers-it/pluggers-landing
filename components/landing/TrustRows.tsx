import { MessagesSquare, Receipt, ShieldCheck, Star } from "lucide-react";
import { TRUST } from "@/lib/home";
import { CONTAINER, H2, LEDE_ANSWER } from "./styles";

const ICONS = [Star, MessagesSquare, Receipt, ShieldCheck];

export function TrustRows() {
  return (
    <section className={`${CONTAINER} py-20 lg:py-28`} aria-labelledby="trust-title">
      <h2 id="trust-title" className={H2}>
        {TRUST.title}
      </h2>
      <p className={LEDE_ANSWER}>{TRUST.lede}</p>
      <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
        {TRUST.rows.map((text, i) => {
          const Icon = ICONS[i];
          return (
            <li key={text} className="flex items-start gap-4 border-t border-hair py-5">
              <Icon className="mt-0.5 h-6 w-6 shrink-0 text-accent-text" strokeWidth={1.8} aria-hidden />
              <p className="text-[16px] leading-[1.55]">{text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
