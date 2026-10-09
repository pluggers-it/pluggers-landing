import type { Metadata } from "next";
import Link from "next/link";
import { Inbox, Radar, Receipt } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { WaitlistForm } from "@/components/WaitlistForm";
import { FaqList } from "@/components/landing/FaqList";
import { GuidePhone, GuideSteps, type GuideStep } from "@/components/landing/GuideSteps";
import { SitePage } from "@/components/landing/SitePage";
import { StoreBadges } from "@/components/landing/StoreBadges";
import { WEB_APP_URL } from "@/components/landing/links";
import { BTN_PRIMARY, CONTAINER, H2 } from "@/components/landing/styles";
import { PROS } from "@/lib/home";
import { breadcrumbSchema, faqSchema, graph, pageMetadata, pageSchema } from "@/lib/seo";
import { TRADES } from "@/lib/trades";

const PATH = "/professionisti";
const ICONS = [Inbox, Radar, Receipt];

export const metadata: Metadata = pageMetadata({
  title: "App per idraulici, elettricisti e artigiani a Torino",
  description:
    "I clienti di Torino ti trovano su Pluggers e ti scrivono con le foto del guasto. Scegli il raggio, manda stima e preventivo dall'app.",
  path: PATH,
});

const G = "/guida/professionisti";

// Every line describes what the real screen shows (screens rendered from the app, sample data).
const STEPS: GuideStep[] = [
  {
    id: "mestieri", short: "Mestieri", src: `${G}/01.webp`,
    alt: "Profilo professionista, passo 1 di 5: «Di cosa ti occupi?» con l'elenco dei mestieri e la descrizione di ciascuno.",
    title: "Scegli i tuoi mestieri",
    text: "Indica tutti i mestieri che fai. Per ognuno i lavori più comuni sono già selezionati.",
    points: ["Puoi sceglierne più di uno", "Togli i lavori che non fai", "Aggiungi le specializzazioni"],
    tip: "Lascia selezionati solo i lavori che fai davvero: ti arrivano richieste più giuste.",
  },
  {
    id: "raggio", short: "Zona", src: `${G}/02.webp`,
    alt: "Profilo professionista: «Fin dove ti sposti» con il cursore del raggio d'azione a 20 km e la sezione «Dove lavori».",
    title: "Decidi fin dove ti sposti",
    text: "Inserisci l'indirizzo da cui parti e il raggio, da 1 a 100 km. Ti trovano solo i clienti entro quella distanza.",
    points: ["Il raggio si imposta con il cursore", "Le città in cui lavori, anche più di una", "La descrizione dell'attività e la partita IVA"],
    tip: "Il documento d'identità serve a verificare che sei tu. I clienti vedono solo il badge della verifica, mai il documento.",
  },
  {
    id: "disponibilita", short: "Orari", src: `${G}/03.webp`,
    alt: "Profilo professionista, passo 5 di 5: «La tua disponibilità» con l'orario dalle 9 alle 18 e i giorni lavorativi selezionati.",
    title: "Imposta orari e giorni",
    text: "Indica la fascia oraria e i giorni in cui accetti interventi, poi salva il profilo.",
    points: ["Dalle 9 alle 18, o la fascia che preferisci", "I giorni in cui lavori, uno per uno", "Tocca «Salva» e il profilo è pronto"],
  },
  {
    id: "richieste", short: "Richieste", src: `${G}/04.webp`,
    alt: "Sezione «Richieste»: tre richieste da decidere con giorno e orario, mestiere, il problema, la stima indicativa, la distanza e «Rifiuta».",
    title: "Ricevi le richieste",
    text: "Le richieste arrivano dai clienti della tua zona che ti hanno scelto. Ognuna ha giorno, mestiere, problema, distanza da te e una cifra di riferimento calcolata dall'app.",
    points: ["Apri quelle che ti interessano", "Rifiuta le altre con un tocco"],
    tip: "Guarda le foto prima di uscire: spesso bastano per capire che pezzo portare.",
  },
  {
    id: "preventivo", short: "Stima e preventivo", src: `${G}/05.webp`,
    alt: "Schermata «Nuovo preventivo»: la stima automatica con la fascia tipica, le voci del preventivo e il bottone «Invia preventivo».",
    title: "Prima la stima, dopo la visita il preventivo",
    text: "Prima della visita mandi una stima: quanto può costare il lavoro e l'eventuale Costo Chiamata. Se il cliente la accetta, l'appuntamento è confermato. Dopo la visita mandi il preventivo, voce per voce.",
    points: ["L'app ti suggerisce una cifra, puoi cambiarla", "Imponibile, IVA e totale li calcola l'app, il cliente riceve anche il PDF", "Se in corso d'opera il prezzo cambia, mandi un preventivo aggiornato con motivo e foto"],
    tip: "Il Costo Chiamata è quello che chiedi per venire a vedere. Se il cliente l'ha accettato con la stima, ti spetta anche se poi rifiuta il preventivo.",
  },
  {
    id: "agenda", short: "Agenda", src: `${G}/06.webp`,
    alt: "Agenda del professionista: il calendario di ottobre, i prossimi interventi con lo stato e il bottone «Appuntamento cliente esterno».",
    title: "Gli appuntamenti in agenda",
    text: "Gli interventi confermati entrano in agenda da soli. Puoi segnare anche gli appuntamenti dei tuoi clienti di sempre.",
    points: ["Il mese a colpo d'occhio e i prossimi interventi", "Lo stato di ogni appuntamento", "Mostri il QR al cliente all'arrivo e a lavoro finito"],
    tip: "I clienti che non usano Pluggers li aggiungi con «Appuntamento cliente esterno».",
  },
];

const LEDE =
  "Il cliente descrive il guasto e manda le foto. L'app capisce che mestiere serve e quanto è urgente. " +
  "Se lavori nella sua zona, sei tra i professionisti che può scegliere. Se sceglie te, la richiesta arriva a te.";

const BENEFITS = [
  { title: "Foto e distanza", text: "Ogni richiesta ha mestiere, problema, foto e km da te. Se è urgente, lo vedi subito." },
  { title: "Raggio da 1 a 100 km", text: "Lo imposti dal tuo indirizzo. I clienti fuori dal raggio non ti vedono." },
  { title: "Prezzi tuoi", text: "Costo Chiamata, stima e preventivo li scrivi tu. L'app ti suggerisce una cifra, puoi cambiarla." },
];

const FAQ = [
  {
    q: "Quali mestieri posso indicare?",
    a: `I mestieri della casa: ${TRADES.map((t) => t.label.toLowerCase()).join(", ")}. Puoi sceglierne più di uno.`,
  },
  {
    q: "Da dove arrivano le richieste?",
    a: "Da clienti che si trovano dentro il tuo raggio e ti scelgono. Oggi Pluggers è attivo a Torino.",
  },
  {
    q: "Che differenza c'è tra stima e preventivo?",
    a: "La stima la mandi prima della visita: è indicativa, e quando il cliente la accetta l'appuntamento è confermato. Il preventivo lo mandi dopo la visita, voce per voce. Vale solo se il cliente lo accetta.",
  },
  {
    q: "Chi decide il prezzo?",
    a: "Tu: scrivi Costo Chiamata, stima e preventivo. Per ora il cliente ti paga direttamente; i pagamenti nell'app sono in arrivo.",
  },
  {
    q: "Lavoro fuori Torino: posso iscrivermi?",
    a: "Oggi le richieste arrivano solo da Torino. Lascia la tua città nel modulo qui sotto: ci aiuta a decidere dove aprire.",
  },
];

export default function ProfessionistiPage() {
  const trail = [{ name: "Professionisti", path: PATH }];
  return (
    <SitePage trail={trail}>
      <JsonLd data={graph(pageSchema({ path: PATH, name: "App per idraulici, elettricisti e artigiani a Torino" }), faqSchema(FAQ), breadcrumbSchema(trail))} />

      <section className={`${CONTAINER} grid items-center gap-12 pb-12 pt-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:pt-8`}>
        <div>
          <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-accent-text">Per idraulici, elettricisti e gli altri artigiani</p>
          <h1 className="mt-3 max-w-[20ch] text-balance text-[clamp(2.4rem,4.4vw,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
            Prima di uscire sai già che lavoro ti aspetta
          </h1>
          <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.6] text-muted sm:text-lg">{LEDE}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={WEB_APP_URL} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
              {PROS.cta}
            </a>
            <StoreBadges />
          </div>
        </div>
        <div className="relative mx-auto flex h-[560px] w-[340px] justify-center sm:w-[420px]">
          <GuidePhone src={`${G}/04.webp`} alt="" priority className="absolute left-0 top-6 rotate-[-4deg] scale-[0.86] opacity-95" />
          <GuidePhone src={`${G}/05.webp`} alt="La stima preparata nell'app, con la cifra di riferimento" priority className="absolute right-0 top-0 rotate-[3deg]" />
        </div>
      </section>

      <section id="lista-attesa" className={`${CONTAINER} scroll-mt-6 pb-12 lg:pb-16`}>
        <WaitlistForm title={PROS.waitlistTitle} description={PROS.waitlistText} />
      </section>

      <section className={`${CONTAINER} pb-12 lg:pb-16`} aria-labelledby="benefits-title">
        <h2 id="benefits-title" className={H2}>Cosa trovi nell&apos;app</h2>
        <ul className="mt-8 grid gap-8 md:grid-cols-3">
          {BENEFITS.map((b, i) => {
            const Icon = ICONS[i];
            return (
            <li key={b.title}>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-deep dark:text-accent-text">
                <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
              </span>
              <h3 className="mt-4 text-[17px] font-bold leading-snug">{b.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-muted">{b.text}</p>
            </li>
            );
          })}
        </ul>
      </section>

      <GuideSteps steps={STEPS} label="Guida per i professionisti" />

      <section className={`${CONTAINER} pb-12 lg:pb-16`} aria-labelledby="pay-title">
        <div className="rounded-card bg-surface p-6 shadow-card sm:p-8">
          <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-accent-text">In arrivo</p>
          <h2 id="pay-title" className="mt-2 text-[22px] font-extrabold leading-tight tracking-[-0.02em]">I pagamenti nell&apos;app</h2>
          <p className="mt-2 max-w-[62ch] text-[16px] leading-[1.55] text-muted">
            Il cliente potrà pagarti Costo Chiamata e preventivo dall&apos;app. Per ora vi accordate voi e ti paga direttamente.
          </p>
        </div>
      </section>

      <section className={`${CONTAINER} py-12 lg:py-16`} aria-labelledby="trades-title">
        <h2 id="trades-title" className={H2}>I mestieri su Pluggers a Torino</h2>
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

      <section className={`${CONTAINER} pb-12 lg:pb-16`} aria-labelledby="news-title">
        <div className="rounded-card bg-surface p-6 shadow-card sm:p-8">
          <h2 id="news-title" className="text-[22px] font-extrabold leading-tight tracking-[-0.02em]">Pluggers News</h2>
          <p className="mt-2 max-w-[62ch] text-[16px] leading-[1.55] text-muted">
            Una mail per chi lavora nelle case: le norme che cambiano e i lavori del periodo.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6">
            <Link href="/newsletter" className="inline-flex min-h-12 items-center font-semibold text-accent-text underline underline-offset-4">
              Iscriviti alla newsletter
            </Link>
            <Link href="/blog" className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4">
              Leggi gli articoli
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[760px] px-5 py-12 sm:px-8 lg:py-16" aria-labelledby="faq-title">
        <h2 id="faq-title" className={H2}>Domande dei professionisti</h2>
        <FaqList items={FAQ} />
      </section>

    </SitePage>
  );
}
