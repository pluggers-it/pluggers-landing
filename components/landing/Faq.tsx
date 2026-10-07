import { ChevronDown } from "lucide-react";
import { H2 } from "./styles";

const FAQ = [
  {
    q: "Quanto costa usare Pluggers?",
    a: "Niente: descrivere il problema, ricevere le stime e prenotare non ha costi. Paghi solo il professionista, per la visita e per il lavoro che accetti, direttamente a lui.",
  },
  {
    q: "Dove funziona Pluggers?",
    a: "Oggi a Torino e dintorni. Se sei altrove, lascia la tua città nel modulo: le prossime zone le scegliamo da lì.",
  },
  {
    q: "Come fa Pluggers a capire di che si tratta?",
    a: "Un assistente di intelligenza artificiale legge la descrizione e le foto, se serve ti fa poche domande senza termini tecnici e indica il mestiere e l'urgenza. Può sbagliare: il professionista verifica sul posto. Le foto usate per questa valutazione vengono cancellate subito dopo.",
  },
  {
    q: "Chi sono i professionisti?",
    a: "Professionisti e artigiani della tua zona, che scelgono loro in che raggio intervenire. Nel profilo vedi mestieri, città, disponibilità e le recensioni ricevute dopo interventi completati.",
  },
  {
    q: "Cosa succede dopo la richiesta?",
    a: "Scegli fino a tre professionisti tra quelli vicini e la richiesta arriva a tutti. Chi risponde ti scrive in chat con il Costo Chiamata e una stima; concordate giorno e orario, e all'arrivo registrate inizio e fine intervento con un QR. Dopo, puoi lasciare la recensione.",
  },
  {
    q: "Serve scaricare un'app?",
    a: "No: Pluggers si usa dal browser, su app.plggrs.it. Le app per iPhone e Android sono in arrivo.",
  },
];

export function Faq() {
  return (
    <section className="mx-auto w-full max-w-[760px] px-5 py-20 sm:px-8 lg:py-28" aria-labelledby="faq-title">
      <h2 id="faq-title" className={H2}>
        Domande frequenti
      </h2>
      <div className="mt-8 divide-y divide-hair border-y border-hair">
        {FAQ.map(({ q, a }) => (
          <details key={q} className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
              {q}
              <ChevronDown
                className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="max-w-[62ch] pb-5 text-[16px] leading-[1.6] text-muted">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
