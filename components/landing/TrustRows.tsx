import { MessagesSquare, Receipt, ShieldCheck, Star } from "lucide-react";
import { CONTAINER, H2 } from "./styles";

const ROWS = [
  {
    icon: Star,
    text: "Il profilo del professionista mostra le recensioni, che si possono lasciare solo dopo un intervento completato.",
  },
  {
    icon: MessagesSquare,
    text: "La chat è nell'app, con foto e allegati: tutto quello che vi dite resta insieme all'intervento.",
  },
  {
    icon: Receipt,
    text: "Il Costo Chiamata e la stima li vedi prima della visita. Il compenso lo concordi con il professionista.",
  },
  {
    icon: ShieldCheck,
    text: "I dati sono conservati su server nell'Unione Europea.",
  },
];

export function TrustRows() {
  return (
    <section className={`${CONTAINER} py-20 lg:py-28`} aria-labelledby="trust-title">
      <h2 id="trust-title" className={H2}>
        Cosa sai prima della visita
      </h2>
      <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
        {ROWS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-4 border-t border-hair py-5">
            <Icon className="mt-0.5 h-6 w-6 shrink-0 text-accent-text" strokeWidth={1.8} aria-hidden />
            <p className="text-[16px] leading-[1.55]">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
