import { Inbox, Radar, Receipt } from "lucide-react";
import { WaitlistForm } from "@/components/WaitlistForm";
import { WEB_APP_URL } from "./links";
import { BTN_PRIMARY, CONTAINER, H2, LEDE } from "./styles";

const BENEFITS = [
  {
    icon: Inbox,
    title: "Richieste già descritte e classificate",
    text: "Ogni richiesta arriva con mestiere, descrizione del problema e distanza. Se è urgente, lo vedi subito.",
  },
  {
    icon: Radar,
    title: "Il raggio d'azione lo scegli tu",
    text: "Da 1 a 100 km dal tuo indirizzo operativo: ti vedono solo i clienti dentro quel raggio.",
  },
  {
    icon: Receipt,
    title: "Costo Chiamata e preventivo li decidi tu",
    text: "Indichi il costo della visita prima dell'appuntamento e mandi la stima in chat. Agenda e check-in con QR sono già dentro.",
  },
];

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
            Per i professionisti
          </h2>
          <p className={LEDE}>Lavori con chi è già vicino e ha già spiegato il problema.</p>

          <ul className="mt-10 divide-y divide-hair">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 py-5 first:pt-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-deep dark:text-accent-text">
                  <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                </span>
                <div>
                  <h3 className="text-[17px] font-bold leading-snug">{title}</h3>
                  <p className="mt-1 max-w-[46ch] text-[15px] leading-[1.55] text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <a href={WEB_APP_URL} className={`${BTN_PRIMARY} mt-8`}>
            Entra come professionista
          </a>
        </div>

        <div className="lg:pt-2">
          <WaitlistForm
            title="Non sei a Torino? Lasciaci la tua città."
            description="Le prossime zone le scegliamo da lì. Ti scriviamo quando arriviamo da te."
          />
        </div>
      </div>
    </section>
  );
}
