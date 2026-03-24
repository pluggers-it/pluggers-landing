import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Informativa sul trattamento dei dati personali per Pluggers: iscrizione waitlist, newsletter e utilizzo del sito.",
  alternates: { canonical: "https://pluggers.it/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="relative mx-auto w-full max-w-2xl px-6 py-12 sm:px-10">
        <SiteHeader label="PLUGGERS // PRIVACY" />

        <main className="mt-12 space-y-8">
          <div>
            <h1 className="font-sans text-3xl font-bold tracking-tight">
              Informativa sulla privacy
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
            </p>
          </div>

          <section className="space-y-3 text-sm leading-7 text-[var(--color-muted)]">
            <h2 className="font-sans text-lg font-semibold text-[var(--color-foreground)]">
              Titolare del trattamento
            </h2>
            <p>
              Il titolare del trattamento dei dati è <strong className="text-[var(--color-foreground)]">Pluggers</strong>{" "}
              (riferimenti di contatto da integrare con i vostri dati societari e PEC/email dedicata).
            </p>
          </section>

          <section className="space-y-3 text-sm leading-7 text-[var(--color-muted)]">
            <h2 className="font-sans text-lg font-semibold text-[var(--color-foreground)]">
              Dati raccolti e finalità
            </h2>
            <p>
              Attraverso i moduli presenti sul sito raccogliamo dati identificativi e di contatto (nome, cognome, email,
              telefono, regione, professione) per:
            </p>
            <ul className="list-inside list-disc space-y-2 pl-1">
              <li>
                <strong className="text-[var(--color-foreground)]">Lista d&apos;attesa (landing)</strong> — gestire
                l&apos;interesse verso il servizio e ricontattarti quando sarà disponibile nella tua area.
              </li>
              <li>
                <strong className="text-[var(--color-foreground)]">Newsletter</strong> — inviarti aggiornamenti e
                comunicazioni sul settore, se ti iscrivi dalla pagina dedicata.
              </li>
            </ul>
            <p>
              La base giuridica è il tuo <strong className="text-[var(--color-foreground)]">consenso</strong>, espresso
              tramite flag sull&apos;informativa al momento dell&apos;invio del modulo.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-7 text-[var(--color-muted)]">
            <h2 className="font-sans text-lg font-semibold text-[var(--color-foreground)]">
              Conservazione e luogo del trattamento
            </h2>
            <p>
              I dati sono conservati su server gestiti tramite fornitori infrastrutturali (es. hosting e database
              cloud). I tempi di conservazione vanno definiti in base alle vostre policy interne e comunicati qui.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-7 text-[var(--color-muted)]">
            <h2 className="font-sans text-lg font-semibold text-[var(--color-foreground)]">
              Cookie e strumenti di analisi
            </h2>
            <p>
              Utilizziamo cookie tecnici necessari al funzionamento del sito. Strumenti di analisi (es. Google
              Analytics, Microsoft Clarity) vengono attivati <strong className="text-[var(--color-foreground)]">solo
              dopo</strong> che acconsenti dal banner cookie.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-7 text-[var(--color-muted)]">
            <h2 className="font-sans text-lg font-semibold text-[var(--color-foreground)]">
              Diritti dell&apos;interessato
            </h2>
            <p>
              Puoi esercitare i diritti previsti dagli artt. 15–22 GDPR (accesso, rettifica, cancellazione, limitazione,
              opposizione, portabilità) scrivendo al titolare. Hai inoltre diritto di proporre reclamo al Garante per la
              protezione dei dati personali (
              <a
                href="https://www.garanteprivacy.it"
                className="text-[var(--color-accent)] underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                garanteprivacy.it
              </a>
              ).
            </p>
          </section>

          <p className="border-t border-[var(--color-border)] pt-8 font-mono text-xs text-[var(--color-muted)]">
            Questo testo è un modello informativo: va completato e revisionato da un legale in base alla vostra
            organizzazione e al registro trattamenti.
          </p>

          <Link
            href="/"
            className="inline-block font-mono text-xs text-[var(--color-accent)] underline-offset-4 hover:underline"
          >
            ← Torna alla home
          </Link>
        </main>
      </div>
    </div>
  );
}
