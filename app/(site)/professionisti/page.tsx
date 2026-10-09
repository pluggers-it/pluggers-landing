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
  title: "App per artigiani e professionisti a Torino",
  description:
    "Ricevi le richieste dei clienti vicini già descritte e con le foto, scegli il raggio da 1 a 100 km e decidi tu Costo Chiamata e preventivo. Pluggers, a Torino.",
  path: PATH,
});

const G = "/guida/professionisti";

// Every line describes what the real screen shows (screens rendered from the app, sample data).
const STEPS: GuideStep[] = [
  {
    id: "mestieri", short: "Mestieri", src: `${G}/01.webp`,
    alt: "Profilo professionista, passo 1 di 5: «Di cosa ti occupi?» con l'elenco dei mestieri e la descrizione di ciascuno.",
    title: "Scegli i mestieri di cui ti occupi",
    text: "Nel profilo professionista indichi tutto quello che fai: è così che i clienti ti trovano.",
    points: ["Puoi scegliere più di un mestiere", "Per ogni mestiere i lavori di base arrivano già spuntati", "Le specializzazioni le aggiungi a parte"],
    tip: "Lascia spuntati solo i lavori che fai davvero: le richieste che ricevi saranno più giuste.",
  },
  {
    id: "raggio", short: "Raggio", src: `${G}/02.webp`,
    alt: "Profilo professionista: «Fin dove ti sposti» con il cursore del raggio d'azione a 20 km e la sezione «Dove lavori».",
    title: "Decidi fin dove ti sposti",
    text: "Indichi il tuo indirizzo operativo e il raggio d'azione: i clienti ti trovano solo entro quella distanza.",
    points: ["Raggio d'azione da 1 a 100 km, con il cursore", "Le città in cui accetti interventi, anche più di una", "Descrizione dell'attività, partita IVA e documento d'identità"],
    tip: "I clienti vedono solo il badge della verifica, mai il tuo documento.",
  },
  {
    id: "disponibilita", short: "Disponibilità", src: `${G}/03.webp`,
    alt: "Profilo professionista, passo 5 di 5: «La tua disponibilità» con l'orario dalle 9 alle 18 e i giorni lavorativi selezionati.",
    title: "Indica quando lavori",
    text: "Imposti la fascia oraria e i giorni in cui accetti interventi, poi salvi il profilo.",
    points: ["L'orario: dalle, alle", "I giorni lavorativi, uno per uno", "Tocca «Salva» e il profilo è pronto"],
  },
  {
    id: "richieste", short: "Richieste", src: `${G}/04.webp`,
    alt: "Sezione «Richieste»: tre richieste da decidere con giorno e orario, mestiere, il problema, la stima indicativa, la distanza e «Rifiuta».",
    title: "Ricevi le richieste dei clienti vicini",
    text: "Nella sezione Richieste trovi quelle dei clienti dentro il tuo raggio, già descritte e classificate.",
    points: ["Per ognuna: giorno e orario, mestiere e il problema in breve", "La stima indicativa e la distanza da te", "Apri quelle che ti interessano, rifiuta le altre"],
    tip: "La richiesta arriva con la descrizione e le foto del cliente: spesso capisci il lavoro prima di uscire.",
  },
  {
    id: "preventivo", short: "Preventivo", src: `${G}/05.webp`,
    alt: "Schermata «Nuovo preventivo»: la stima automatica con la fascia tipica, le voci del preventivo e il bottone «Invia preventivo».",
    title: "Prepara il preventivo in pochi tocchi",
    text: "Pluggers ti suggerisce una stima automatica come riferimento; tu aggiungi le voci e mandi il preventivo al cliente.",
    points: ["Una riga per ogni lavorazione o materiale", "Totale e IVA li calcola l'app", "Il cliente vede il dettaglio e può scaricare il PDF"],
    tip: "La stima automatica è solo un riferimento: il prezzo lo decidi sempre tu.",
  },
  {
    id: "agenda", short: "Agenda", src: `${G}/06.webp`,
    alt: "Agenda del professionista: il calendario di ottobre, i prossimi interventi con lo stato e il bottone «Appuntamento cliente esterno».",
    title: "Tieni tutto in agenda",
    text: "Gli interventi confermati finiscono nell'agenda dell'app, insieme agli appuntamenti con i clienti che hai già.",
    points: ["Il calendario del mese e i prossimi interventi", "Lo stato di ogni appuntamento: confermato, da inviare, invito inviato", "All'arrivo mostri al cliente il QR per registrare inizio e fine"],
    tip: "Aggiungi anche i clienti che non usano Pluggers con «Appuntamento cliente esterno»: la settimana sta tutta in un posto.",
  },
];

const FAQ = [
  {
    q: "Quali mestieri possono entrare in Pluggers?",
    a: `I mestieri della casa: ${TRADES.map((t) => t.label.toLowerCase()).join(", ")}. Scegli il tuo quando crei il profilo.`,
  },
  {
    q: "Da dove arrivano le richieste?",
    a: "Dai clienti che usano Pluggers e il cui indirizzo è dentro il raggio che hai scelto, da 1 a 100 km dal tuo indirizzo operativo. Oggi Pluggers è attivo a Torino.",
  },
  {
    q: "Chi decide il prezzo?",
    a: "Tu. Indichi il Costo Chiamata prima della visita e mandi la stima in chat; il compenso lo concordi direttamente con il cliente. Pluggers non incassa pagamenti nell'app.",
  },
  {
    q: "Lavoro fuori Torino: posso iscrivermi?",
    a: "Lasciaci la tua città nel modulo in fondo alla pagina: le prossime zone le scegliamo da lì, e ti scriviamo quando arriviamo da te.",
  },
];

export default function ProfessionistiPage() {
  const trail = [{ name: "Professionisti", path: PATH }];
  return (
    <SitePage trail={trail}>
      <JsonLd data={graph(pageSchema({ path: PATH, name: "App per artigiani e professionisti a Torino" }), faqSchema(FAQ), breadcrumbSchema(trail))} />

      <section className={`${CONTAINER} grid items-center gap-12 pb-12 pt-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:pt-8`}>
        <div>
          <p className="text-[15px] font-bold uppercase tracking-[0.08em] text-accent-text">Guida per i professionisti</p>
          <h1 className="mt-3 max-w-[20ch] text-balance text-[clamp(2.4rem,4.4vw,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
            L&apos;app per artigiani e professionisti della casa a Torino
          </h1>
          <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.6] text-muted sm:text-lg">{PROS.lede}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={WEB_APP_URL} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
              {PROS.cta}
            </a>
            <StoreBadges />
          </div>
        </div>
        <div className="relative mx-auto flex h-[560px] w-[340px] justify-center sm:w-[420px]">
          <GuidePhone src={`${G}/04.webp`} alt="" priority className="absolute left-0 top-6 rotate-[-4deg] scale-[0.86] opacity-95" />
          <GuidePhone src={`${G}/05.webp`} alt="Il preventivo preparato nell'app" priority className="absolute right-0 top-0 rotate-[3deg]" />
        </div>
      </section>

      <section className={`${CONTAINER} pb-12 lg:pb-16`} aria-labelledby="benefits-title">
        <h2 id="benefits-title" className={H2}>Cosa cambia nel tuo lavoro</h2>
        <ul className="mt-8 grid gap-8 md:grid-cols-3">
          {PROS.benefits.map((b, i) => {
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

      <section className={`${CONTAINER} py-12 lg:py-16`} aria-labelledby="trades-title">
        <h2 id="trades-title" className={H2}>I clienti di Torino ti cercano per questi mestieri</h2>
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
          <h2 id="news-title" className="text-[22px] font-extrabold leading-tight tracking-[-0.02em]">Pluggers News, la newsletter per i professionisti</h2>
          <p className="mt-2 max-w-[62ch] text-[16px] leading-[1.55] text-muted">
            Ogni settimana consigli pratici per chi fa un mestiere della casa: norme che cambiano, lavori di stagione, errori da evitare e come proporli ai clienti.
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

      <section className={`${CONTAINER} pb-16`}>
        <WaitlistForm title={PROS.waitlistTitle} description={PROS.waitlistText} />
      </section>
    </SitePage>
  );
}
