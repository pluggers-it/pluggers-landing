import type { Metadata } from "next";
import Link from "next/link";
import { Inbox, Radar, Receipt } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { WaitlistForm } from "@/components/WaitlistForm";
import { FaqList } from "@/components/landing/FaqList";
import { SitePage } from "@/components/landing/SitePage";
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

// Only what the app does today (see PROS in lib/home.ts and the about page): no payments in the app.
const STEPS = [
  { title: "Crei il profilo", text: "Scegli il mestiere, l'indirizzo da cui parti, il raggio in cui lavori, da 1 a 100 km, e il tuo Costo Chiamata." },
  { title: "Ricevi le richieste dei clienti vicini", text: "Arrivano già descritte, con le foto quando il cliente le carica, e classificate per mestiere e urgenza." },
  { title: "Mandi la stima in chat", text: "Il cliente vede il Costo Chiamata e la stima prima della visita. Il compenso lo concordate direttamente voi." },
  { title: "Fissi l'appuntamento", text: "L'intervento finisce nell'agenda dell'app, insieme agli altri." },
  { title: "Registri inizio e fine con il QR", text: "Dopo l'intervento il cliente può lasciarti una recensione, che compare nel tuo profilo." },
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

      <section className={`${CONTAINER} pb-12 pt-4 lg:pb-16 lg:pt-8`}>
        <h1 className="max-w-[20ch] text-balance text-[clamp(2.4rem,4.4vw,3.6rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
          L&apos;app per artigiani e professionisti della casa a Torino
        </h1>
        <p className="mt-5 max-w-[62ch] text-[17px] leading-[1.6] text-muted sm:text-lg">{PROS.lede}</p>
        <a href={WEB_APP_URL} className={`${BTN_PRIMARY} mt-8`}>
          {PROS.cta}
        </a>
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

      <section className="border-y border-hair bg-surface py-16 lg:py-20" aria-labelledby="steps-title">
        <div className={CONTAINER}>
          <h2 id="steps-title" className={H2}>Come funziona</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft font-extrabold text-accent-text">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold leading-snug">{s.title}</h3>
                  <p className="mt-1 text-[15px] leading-[1.6] text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

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
