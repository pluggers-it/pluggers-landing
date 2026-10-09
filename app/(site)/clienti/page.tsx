import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { WaitlistForm } from "@/components/WaitlistForm";
import { FaqList } from "@/components/landing/FaqList";
import { GuidePhone, GuideSteps, type GuideStep } from "@/components/landing/GuideSteps";
import { SitePage } from "@/components/landing/SitePage";
import { TrustRows } from "@/components/landing/TrustRows";
import { WEB_APP_URL } from "@/components/landing/links";
import { BTN_PRIMARY, CONTAINER, H2 } from "@/components/landing/styles";
import { FAQ } from "@/lib/home";
import { breadcrumbSchema, graph, pageMetadata, pageSchema } from "@/lib/seo";
import { TRADES } from "@/lib/trades";

const PATH = "/clienti";
const G = "/guida/clienti";

export const metadata: Metadata = pageMetadata({
  title: "Come trovare un idraulico o un artigiano a Torino",
  description:
    "La guida a Pluggers passo per passo: racconti il guasto con una foto, l'app capisce chi serve, scegli fino a tre professionisti vicini e ricevi la stima in chat.",
  path: PATH,
});

// Every line describes what the real screen shows (screens rendered from the app, Turin sample data).
const STEPS: GuideStep[] = [
  {
    id: "racconta", short: "Racconta", src: `${G}/01.webp`,
    alt: "Schermata iniziale: campo «Di cosa hai bisogno?» con la descrizione di un rubinetto che perde, una foto allegata e il bottone «Trova professionisti».",
    title: "Racconta il problema con parole e una foto",
    text: "Apri Pluggers e scrivi cosa succede, come lo racconteresti a un amico. Non serve sapere quale professionista ti serve.",
    points: ["Scrivi due righe nel campo «Di cosa hai bisogno?»", "Tocca la fotocamera e aggiungi una foto del guasto", "Poi tocca «Trova professionisti»"],
    tip: "Una foto vicina al guasto, con un po' di contesto intorno, aiuta più di tre righe di descrizione.",
  },
  {
    id: "domande", short: "Domande", src: `${G}/02.webp`,
    alt: "Schermata «Capiamo il problema»: la domanda «Da dove esce l'acqua?» con tre risposte da toccare, «Altro» e «Non lo so».",
    title: "Rispondi a qualche domanda semplice",
    text: "L'assistente ti fa poche domande, con le risposte già pronte da toccare, per capire bene il guasto.",
    points: ["Scegli la risposta che descrive meglio quello che vedi", "Se non sei sicuro, tocca «Non lo so» oppure «Altro» e scrivi", "Se c'è un pericolo immediato, l'app ti ricorda di chiamare il 112"],
    tip: "Rispondi su quello che vedi, non su quella che pensi sia la causa: alla causa ci pensa l'assistente.",
  },
  {
    id: "diagnosi", short: "Cosa abbiamo capito", src: `${G}/03.webp`,
    alt: "Schermata «Cosa abbiamo capito»: chi serve, Idraulico, urgenza 2 su 5, le cause più probabili e il bottone «Cerca un professionista».",
    title: "Leggi cosa ha capito Pluggers",
    text: "Prima di cercare, l'app ti mostra il riassunto: chi serve, quanto è urgente e le cause più probabili.",
    points: ["Il mestiere giusto e l'urgenza, da 1 a 5", "Le cause più probabili, in parole semplici", "Cosa ha verificato con te e cosa non ti ha chiesto"],
    tip: "Se il riassunto non torna, tocca «Non è questo il problema» e correggi prima di cercare.",
  },
  {
    id: "scegli", short: "Scegli", src: `${G}/04.webp`,
    alt: "Schermata «Risultati»: tre idraulici con valutazione, numero di recensioni e zona, due selezionati, e il bottone «Continua con 2 professionisti».",
    title: "Scegli fino a tre professionisti",
    text: "Vedi chi lavora vicino a te per quel mestiere, con le recensioni lasciate dopo interventi completati.",
    points: ["Per ognuno: nome, valutazione, numero di recensioni e zona", "Selezionane fino a tre: la richiesta arriva a tutti", "Puoi vederli in elenco o sulla mappa"],
    tip: "Chi ha la scritta «Nuovo su Pluggers» non ha ancora recensioni: è appena arrivato, non vuol dire che lavori peggio.",
  },
  {
    id: "giorno", short: "Il giorno", src: `${G}/05.webp`,
    alt: "Schermata «Prenota»: il calendario di ottobre con i giorni disponibili cerchiati in viola e il bottone «Richiedi stima».",
    title: "Scegli il giorno che ti va bene",
    text: "Nel calendario indichi quando preferisci l'intervento. L'orario te lo propone il professionista.",
    points: ["I giorni cerchiati in viola sono quelli disponibili", "Se hai scelto più professionisti, la stessa richiesta arriva anche a loro", "Tocca «Richiedi stima» per mandarla"],
  },
  {
    id: "stima", short: "La stima", src: `${G}/06.webp`,
    alt: "Chat con il professionista: la foto del rubinetto, un messaggio e la scheda «Stima» con il lavoro previsto, i materiali e i bottoni «Accetta» e «Rifiuta».",
    title: "Ricevi la stima in chat",
    text: "Il professionista guarda la descrizione e le foto e ti risponde in chat con una stima di quanto può costare il lavoro. Se chiede un Costo Chiamata per venire a vedere, lo trovi scritto lì.",
    points: ["La stima è indicativa: il prezzo vero arriva dopo la visita", "Tocca «Accetta» e l'appuntamento è confermato, oppure «Rifiuta»", "Scrivigli per qualsiasi dubbio, anche con una foto"],
  },
  {
    id: "preventivo", short: "Il preventivo", src: `${G}/07.webp`,
    alt: "Schermata «Preventivo»: tre voci con il loro prezzo, imponibile, IVA 22% e totale, e i bottoni «Apri» e «Scarica» per il PDF.",
    title: "Dopo la visita, il preventivo",
    text: "Visto il guasto, il professionista ti manda il preventivo in chat: ogni voce con il suo prezzo, poi imponibile, IVA e totale.",
    points: ["Toccalo per vedere il dettaglio e aprire o scaricare il PDF", "Tocca «Accetta» o «Rifiuta» sulla scheda in chat", "Se durante il lavoro il prezzo cambia, ricevi un preventivo aggiornato con il motivo e le foto: decidi tu se accettarlo"],
    tip: "Se il preventivo non ti convince, al professionista devi solo il Costo Chiamata, se l'avevi accettato.",
  },
  {
    id: "intervento", short: "Intervento", src: `${G}/08.webp`,
    alt: "Schermata «Dettaglio intervento»: il professionista, quando e dove, il problema, la stima, lo stato e il bottone «Scansiona QR».",
    title: "Il giorno dell'intervento, inizio e fine con un QR",
    text: "Nel dettaglio dell'intervento trovi quando, dove, il problema e quanto avete concordato. Quando il professionista arriva, registrate insieme l'inizio.",
    points: ["Tocca «Scansiona QR» e inquadra il codice che ti mostra il professionista", "Fate lo stesso a lavoro finito", "Poi puoi lasciare una recensione"],
    tip: "Lo stato si aggiorna da solo: in attesa, confermato, in corso, completato.",
  },
];

export default function ClientiPage() {
  const trail = [{ name: "Per i clienti", path: PATH }];
  return (
    <SitePage trail={trail}>
      <JsonLd data={graph(pageSchema({ path: PATH, name: "Come trovare un idraulico o un artigiano a Torino" }), breadcrumbSchema(trail))} />

      <section className={`${CONTAINER} grid items-center gap-12 pb-16 pt-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:pt-8`}>
        <div>
          <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-accent-text">Guida per chi cerca un professionista</p>
          <h1 className="mt-3 max-w-[18ch] text-balance text-[clamp(2.4rem,4.4vw,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
            Scrivi il guasto, scegli chi lo ripara
          </h1>
          <p className="mt-5 max-w-[56ch] text-[17px] leading-[1.6] text-muted sm:text-lg">
            Dal guasto in casa all&apos;intervento finito in otto passi. Non serve sapere quale professionista ti serve: lo capisce l&apos;assistente dalla tua descrizione. Per chi cerca è gratis.
          </p>
          <a href={WEB_APP_URL} className={`${BTN_PRIMARY} mt-8`}>
            Racconta il tuo problema
          </a>
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
            Presto potrai pagare il Costo Chiamata e il preventivo accettato direttamente da Pluggers. Fino ad allora li paghi al professionista, come vi accordate.
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
        <FaqList items={FAQ} />
      </section>

      <section className={`${CONTAINER} pb-16`}>
        <WaitlistForm />
      </section>
    </SitePage>
  );
}
