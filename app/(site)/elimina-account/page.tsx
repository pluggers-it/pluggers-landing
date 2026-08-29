import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Eliminazione dell'account",
  description:
    "Come richiedere l'eliminazione dell'account Pluggers e dei dati associati: passaggi, dati cancellati, dati conservati per obbligo di legge.",
  alternates: { canonical: "https://pluggers.it/elimina-account" },
};

const SUPPORTO = "supporto@plggrs.it";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-sans text-lg font-bold tracking-tight text-[var(--color-foreground)]">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-7 text-[var(--color-muted)]">
        {children}
      </div>
    </section>
  );
}

function Bold({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-[var(--color-foreground)]">{children}</strong>;
}

export default function EliminaAccountPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="relative mx-auto w-full max-w-2xl px-6 py-12 sm:px-10">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12),transparent_60%)] blur-3xl" />
        </div>

        <div className="relative">
          <SiteHeader label="PLUGGERS // ACCOUNT" />

          <main className="mt-12 space-y-10">

            <div>
              <p className="font-mono text-xs tracking-[0.25em] text-[var(--color-accent)]">GESTIONE DEI DATI</p>
              <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight">
                Eliminare il tuo account Pluggers
              </h1>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                Questa pagina riguarda l&apos;app <Bold>Pluggers</Bold> e l&apos;account che usi per
                accedervi. Qui trovi come chiederne l&apos;eliminazione, cosa viene cancellato e
                cosa siamo tenuti a conservare.
              </p>
            </div>

            <hr className="border-[var(--color-border)]" />

            <Section title="Come richiedere l'eliminazione">
              <p>
                Scrivi a <Bold>{SUPPORTO}</Bold> <Bold>dall&apos;indirizzo email con cui ti sei
                registrato</Bold>, indicando come oggetto <Bold>&quot;Eliminazione account&quot;</Bold>.
                L&apos;indirizzo del mittente è ciò che ci permette di verificare che la richiesta
                arrivi davvero da te: se ci scrivi da un altro indirizzo ti chiederemo una conferma
                prima di procedere.
              </p>
              <p>
                Riceverai una conferma dell&apos;avvenuta cancellazione. Trattiamo la richiesta entro
                <Bold> 30 giorni</Bold>, come previsto dall&apos;art. 12(3) del GDPR.
              </p>
              <p>
                Puoi chiedere l&apos;eliminazione dell&apos;account sia come cliente sia come
                professionista.
              </p>
            </Section>

            <Section title="Cosa viene eliminato">
              <p>Con la richiesta rimuoviamo:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>le credenziali di accesso, così l&apos;account non è più utilizzabile;</li>
                <li>i dati del profilo: nome e cognome, email, numero di telefono, indirizzo, città, data di nascita e — per i professionisti — partita IVA;</li>
                <li>la foto del profilo e i documenti d&apos;identità caricati per la verifica;</li>
                <li>i messaggi scambiati in chat e le foto inviate nelle conversazioni;</li>
                <li>le recensioni scritte, i metodi di pagamento salvati, i feedback inviati e gli eventi di utilizzo dell&apos;app.</li>
              </ul>
            </Section>

            <Section title="Cosa siamo obbligati a conservare">
              <p>
                Due categorie di dati non possono essere cancellate su richiesta, perché la legge ne
                impone la conservazione. È l&apos;eccezione prevista dall&apos;
                <Bold>art. 17(3)(b) del GDPR</Bold>.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <Bold>Documenti contabili e fiscali</Bold> dei professionisti (compensi, fatture):
                  conservati per <Bold>10 anni</Bold> dalla registrazione, ai sensi dell&apos;art. 2220
                  del Codice civile e della normativa IVA.
                </li>
                <li>
                  <Bold>Storico degli interventi</Bold> a cui hai partecipato: conservato perché
                  riguarda anche la controparte, che ha diritto a mantenere la traccia del proprio
                  lavoro o della propria richiesta.
                </li>
              </ul>
              <p>
                In entrambi i casi i dati vengono <Bold>anonimizzati</Bold>: il record resta, il
                collegamento con la tua identità no. Scaduto il termine di conservazione, vengono
                eliminati.
              </p>
            </Section>

            <Section title="Eliminare solo una parte dei dati">
              <p>
                Se non vuoi chiudere l&apos;account ma vuoi rimuovere dati specifici — una foto, una
                recensione, un messaggio — scrivici allo stesso indirizzo indicando cosa vuoi
                cancellare.
              </p>
            </Section>

            <Section title="Contatti">
              <p>
                Assistenza ed esercizio dei diritti previsti dagli artt. 15-22 del GDPR:{" "}
                <Bold>{SUPPORTO}</Bold>.
              </p>
              <p>
                Il dettaglio completo del trattamento è nell&apos;
                <Link href="/privacy" className="underline underline-offset-4 hover:text-[var(--color-foreground)]">
                  informativa sulla privacy
                </Link>.
              </p>
            </Section>

          </main>

          <div className="mt-12">
            <SiteFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
