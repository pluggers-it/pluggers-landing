import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { WaitlistForm } from "@/components/WaitlistForm";
import { FaqList } from "@/components/landing/FaqList";
import { GuidePhone, GuideSteps, type GuideStep } from "@/components/landing/GuideSteps";
import { SitePage } from "@/components/landing/SitePage";
import { TrustRows } from "@/components/landing/TrustRows";
import { StoreBadges } from "@/components/landing/StoreBadges";
import { WEB_APP_URL } from "@/components/landing/links";
import { BTN_PRIMARY, CONTAINER, H2 } from "@/components/landing/styles";
import { FAQ } from "@/lib/home";
import { breadcrumbSchema, graph, pageMetadata, pageSchema } from "@/lib/seo";
import { TRADES } from "@/lib/trades";

const PATH = "/clienti";
const G = "/guida/clienti";

export const metadata: Metadata = pageMetadata({
  title: "Come trovare un idraulico o un elettricista a Torino",
  description:
    "Scrivi cosa si è rotto e aggiungi una foto: Pluggers ti indica il mestiere e i professionisti vicini. Stima e preventivo arrivano in chat.",
  path: PATH,
});

// Every line describes what the real screen shows (screens rendered from the app, Turin sample data).
const STEPS: GuideStep[] = [
  {
    id: "racconta", short: "Il problema", src: `${G}/01.webp`,
    alt: "Schermata iniziale: campo «Di cosa hai bisogno?» con la descrizione di un rubinetto che perde, una foto allegata e il bottone «Trova professionisti».",
    title: "Scrivi cosa succede e fai una foto",
    text: "Scrivilo come lo diresti a un amico: «il rubinetto della cucina perde dalla base». Non serve sapere chi chiamare.",
    points: ["Scrivi nel campo «Di cosa hai bisogno?»", "Aggiungi una foto con la fotocamera", "Tocca «Trova professionisti»"],
    tip: "Fotografa il guasto da vicino e poi da un passo indietro: così si capisce anche dove si trova.",
  },
  {
    id: "domande", short: "Le domande", src: `${G}/02.webp`,
    alt: "Schermata «Capiamo il problema»: la domanda «Da dove esce l'acqua?» con tre risposte da toccare, «Altro» e «Non lo so».",
    title: "Rispondi a due o tre domande",
    text: "L'assistente chiede quello che gli serve per capire il guasto. Le risposte sono già scritte, basta toccare quella giusta.",
    points: ["Tocca la risposta che corrisponde a quello che vedi", "Se non sei sicuro, scegli «Non lo so»", "Se c'è pericolo, l'app ti dice di chiamare il 112"],
  },
  {
    id: "diagnosi", short: "Il riepilogo", src: `${G}/03.webp`,
    alt: "Schermata «Cosa abbiamo capito»: chi serve, Idraulico, urgenza 2 su 5, la spiegazione dell'assistente e le cause più probabili.",
    title: "Controlla cosa ha capito Pluggers",
    text: "Prima di cercare vedi il riepilogo: quale professionista serve, quanto è urgente e le cause più probabili.",
    points: ["Il mestiere, per esempio idraulico", "L'urgenza, da 1 a 5", "Se il riepilogo è sbagliato, tocca «Non è questo il problema» e correggi"],
  },
  {
    id: "scegli", short: "I professionisti", src: `${G}/04.webp`,
    alt: "Schermata «Risultati»: tre idraulici con valutazione, numero di recensioni e zona, due selezionati, e il bottone «Continua con 2 professionisti».",
    title: "Scegli fino a tre professionisti",
    text: "Vedi chi fa quel mestiere vicino a te, con le recensioni dei clienti per cui ha già lavorato. La richiesta arriva a tutti quelli che scegli.",
    points: ["Nome, valutazione e numero di recensioni", "La zona in cui lavora", "Puoi guardarli anche sulla mappa"],
  },
  {
    id: "giorno", short: "Il giorno", src: `${G}/05.webp`,
    alt: "Schermata «Prenota»: il calendario di ottobre con i giorni disponibili cerchiati in viola e il bottone «Richiedi stima».",
    title: "Scegli il giorno",
    text: "I giorni cerchiati in viola sono quelli disponibili. L'orario te lo propone il professionista in chat, prima che tu accetti.",
    points: ["Tocca il giorno che preferisci", "Tocca «Richiedi stima»"],
  },
  {
    id: "stima", short: "La stima", src: `${G}/06.webp`,
    alt: "Chat con il professionista: la foto del rubinetto, un messaggio e la scheda «Stima» con il lavoro previsto, i materiali e i bottoni «Accetta» e «Rifiuta».",
    title: "Ricevi la stima in chat",
    text: "Il professionista guarda descrizione e foto. Poi ti scrive quanto può costare il lavoro. Se chiede un Costo Chiamata, cioè la cifra per venire a vedere il guasto, lo trovi lì.",
    points: ["La stima è indicativa: il prezzo esatto è nel preventivo, dopo la visita", "Tocca «Accetta» e l'appuntamento è confermato: le richieste agli altri professionisti si chiudono", "Tocca «Rifiuta» e non devi niente"],
    tip: "Hai un dubbio? Chiedilo in chat prima di accettare, anche con una foto.",
  },
  {
    id: "preventivo", short: "Il preventivo", src: `${G}/07.webp`,
    alt: "Schermata «Preventivo»: tre voci con il loro prezzo, imponibile, IVA 22% e totale, e i bottoni «Apri» e «Scarica» per il PDF.",
    title: "Dopo la visita, il preventivo",
    text: "Il professionista ti manda il preventivo in chat. Ogni voce ha il suo prezzo, poi trovi imponibile, IVA e totale.",
    points: ["Toccalo per vedere il dettaglio e aprire o scaricare il PDF", "Tocca «Accetta» o «Rifiuta» sulla scheda in chat", "Se durante il lavoro il prezzo cambia, ricevi un preventivo aggiornato con motivo e foto. Decidi tu se accettarlo"],
    tip: "Se il preventivo non ti convince, rifiutalo. Paghi solo il Costo Chiamata, se era nella stima che hai accettato.",
  },
  {
    id: "intervento", short: "L'intervento", src: `${G}/08.webp`,
    alt: "Schermata «Dettaglio intervento»: il professionista, quando e dove, il problema, la stima, lo stato e il bottone «Scansiona QR».",
    title: "Il giorno dell'intervento",
    text: "Nella scheda dell'appuntamento trovi data, indirizzo, problema e prezzo concordato. Quando il professionista arriva, registrate l'inizio insieme.",
    points: ["Tocca «Scansiona QR» e inquadra il codice sul telefono del professionista", "A lavoro finito fate lo stesso", "Poi puoi lasciare una recensione"],
  },
];

const CLIENT_FAQ = [
  {
    q: "Che differenza c'è tra stima e preventivo?",
    a: "La stima arriva prima della visita: è indicativa e, se la accetti, confermi l'appuntamento. Il preventivo arriva dopo la visita, voce per voce. Vale solo se lo accetti.",
  },
  {
    q: "Se scelgo tre professionisti, pago tre chiamate?",
    a: "No. Ognuno può risponderti con una stima, ma ne accetti una sola. Quando accetti, le richieste agli altri si chiudono.",
  },
];

export default function ClientiPage() {
  const trail = [{ name: "Per i clienti", path: PATH }];
  return (
    <SitePage trail={trail}>
      <JsonLd data={graph(pageSchema({ path: PATH, name: "Come trovare un idraulico o un elettricista a Torino" }), breadcrumbSchema(trail))} />

      <section className={`${CONTAINER} grid items-center gap-12 pb-16 pt-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:pt-8`}>
        <div>
          <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-accent-text">Guida per chi cerca un professionista</p>
          <h1 className="mt-3 max-w-[18ch] text-balance text-[clamp(2.4rem,4.4vw,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
            Scrivi il guasto, scegli chi lo ripara
          </h1>
          <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.6] text-muted sm:text-lg">
            Otto passi, con i nomi dei pulsanti che trovi nell&apos;app. Non serve sapere che professionista ti serve: lo capisce l&apos;assistente dalla tua descrizione. Per te Pluggers è gratis.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={WEB_APP_URL} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
              Racconta il tuo problema
            </a>
            <StoreBadges />
          </div>
        </div>
        <div className="relative mx-auto flex h-[560px] w-[340px] justify-center sm:w-[420px]">
          <GuidePhone src={`${G}/01.webp`} alt="" priority className="absolute left-0 top-6 rotate-[-4deg] scale-[0.86] opacity-95" />
          <GuidePhone src={`${G}/06.webp`} alt="La chat con la stima del professionista" priority className="absolute right-0 top-0 rotate-[3deg]" />
        </div>
      </section>

      <GuideSteps steps={STEPS} label="Guida per i clienti" />

      <section className={`${CONTAINER} pb-12 lg:pb-16`} aria-labelledby="pay-title">
        <div className="rounded-card bg-surface p-6 shadow-card sm:p-8">
          <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-accent-text">In arrivo</p>
          <h2 id="pay-title" className="mt-2 text-[22px] font-extrabold leading-tight tracking-[-0.02em]">Il pagamento nell&apos;app</h2>
          <p className="mt-2 max-w-[62ch] text-[16px] leading-[1.55] text-muted">
            Il Costo Chiamata e il preventivo accettato si potranno pagare dall&apos;app. Per ora li paghi al professionista, come vi accordate.
          </p>
        </div>
      </section>

      <TrustRows />

      <section className={`${CONTAINER} py-12 lg:py-16`} aria-labelledby="trades-title">
        <h2 id="trades-title" className={H2}>Chi trovi su Pluggers a Torino</h2>
        <ul className="mt-6 grid grid-cols-2 gap-x-6 sm:grid-cols-3">
          {TRADES.map((t) => (
            <li key={t.slug}>
              <Link href={`/torino/${t.slug}`} className="inline-flex min-h-12 items-center underline-offset-4 hover:underline">
                {t.label} a Torino
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-[760px] px-5 py-12 sm:px-8 lg:py-16" aria-labelledby="faq-title">
        <h2 id="faq-title" className={H2}>Domande frequenti</h2>
        <FaqList items={[...FAQ, ...CLIENT_FAQ]} />
      </section>

      <section className={`${CONTAINER} pb-16`}>
        <WaitlistForm />
      </section>
    </SitePage>
  );
}
