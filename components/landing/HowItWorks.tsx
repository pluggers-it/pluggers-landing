"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CONTAINER, H2, LEDE } from "./styles";

const STEPS = [
  {
    title: "Racconta il problema",
    text: "Scrivi due righe e aggiungi una foto. Se serve, l'assistente ti fa qualche domanda senza termini tecnici.",
    src: "/screens/step-describe.png",
    alt: "Schermata iniziale dell'app: campo «Di cosa hai bisogno?» con la descrizione di un rubinetto che perde, una foto allegata e il bottone «Trova professionisti».",
  },
  {
    title: "Pluggers capisce di che si tratta",
    text: "Riconosce il mestiere e l'urgenza e mostra i professionisti che lavorano nella tua zona. Scegli tu chi contattare, fino a tre.",
    src: "/screens/step-triage.png",
    alt: "Schermata «Cosa abbiamo capito»: chi serve (Idraulico), urgenza 2 su 5, cause probabili e bottone «Cerca un professionista».",
  },
  {
    title: "Stima prima, QR dopo",
    text: "Il professionista ti scrive in chat con il Costo Chiamata e una stima. All'arrivo registrate inizio e fine intervento con un QR, poi lasci la recensione.",
    src: "/screens/step-estimate.png",
    alt: "Chat con il professionista: la foto del guasto, un messaggio e una stima di 85 euro con i bottoni Accetta e Rifiuta.",
  },
];

const VIEWPORT = { once: true, amount: 0.35 } as const;

function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-[232px] rounded-[40px] bg-[var(--phone)] p-2 shadow-[0_32px_64px_-32px_rgba(23,21,26,0.5)]">
      <div className="overflow-hidden rounded-[32px] bg-[#f2f2f7]">
        <div className="flex h-8 items-start justify-center pt-2">
          <div className="h-[18px] w-[72px] rounded-full bg-[var(--phone)]" />
        </div>
        <Image
          src={src}
          alt={alt}
          width={600}
          height={1304}
          sizes="232px"
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}

export function HowItWorks() {
  const reduce = useReducedMotion();

  const lineProps = reduce
    ? {}
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: VIEWPORT,
        transition: { duration: 1.6, ease: "easeInOut" as const },
      };

  return (
    <section id="come-funziona" className={`${CONTAINER} py-20 lg:py-28`} aria-labelledby="how-title">
      <h2 id="how-title" className={H2}>
        Come funziona
      </h2>
      <p className={LEDE}>Tre passaggi, dal problema alla visita.</p>

      <div className="relative mt-12">
        {/* The current that joins the steps: a row on desktop, a column on phones */}
        <svg className="pointer-events-none absolute left-0 top-0 hidden h-12 w-full md:block" aria-hidden>
          <line x1="16.666%" y1="24" x2="83.333%" y2="24" stroke="var(--hair)" strokeWidth="2" />
          <motion.line
            x1="16.666%"
            y1="24"
            x2="83.333%"
            y2="24"
            stroke="var(--accent-bright)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(134,59,255,0.6))" }}
            {...lineProps}
          />
        </svg>
        <svg className="pointer-events-none absolute left-0 top-0 h-full w-12 md:hidden" aria-hidden>
          <line x1="24" y1="24" x2="24" y2="100%" stroke="var(--hair)" strokeWidth="2" />
          <motion.line
            x1="24"
            y1="24"
            x2="24"
            y2="100%"
            stroke="var(--accent-bright)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(134,59,255,0.6))" }}
            {...lineProps}
          />
        </svg>

        <ol className="grid gap-14 md:grid-cols-3 md:gap-0">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="relative grid grid-cols-[48px_minmax(0,1fr)] gap-x-4 md:grid-cols-1 md:justify-items-center md:px-4 md:text-center"
            >
              <motion.span
                className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[17px] font-bold text-white ring-4 ring-page"
                initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={VIEWPORT}
                transition={{ delay: 0.25 + i * 0.45, duration: 0.35 }}
              >
                {i + 1}
              </motion.span>
              <div className="md:mt-8 md:flex md:flex-col md:items-center">
                <PhoneFrame src={step.src} alt={step.alt} />
                <h3 className="mt-6 max-w-[28ch] text-[21px] font-bold leading-tight tracking-[-0.02em]">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[38ch] text-[16px] leading-[1.55] text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
