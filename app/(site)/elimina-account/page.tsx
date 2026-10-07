import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, SupportEmail, type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Eliminazione dell'account",
  description:
    "Come richiedere l'eliminazione dell'account Pluggers e dei dati associati: passaggi, dati cancellati, dati conservati per obbligo di legge.",
  alternates: { canonical: "https://www.plggrs.it/elimina-account" },
};

const SECTIONS: LegalSection[] = [
  {
    id: "come",
    title: "Come richiedere l'eliminazione",
    content: (
      <>
        <p>
          Dall&apos;app: <strong>Impostazioni → Account e privacy → Elimina account</strong>.
        </p>
        <p>
          Se non riesci ad accedere, scrivi a <SupportEmail />{" "}
          <strong>dall&apos;indirizzo email con cui ti sei registrato</strong>, indicando come
          oggetto <strong>«Eliminazione account»</strong>. L&apos;indirizzo del mittente è ciò che
          ci permette di verificare che la richiesta arrivi davvero da te: se ci scrivi da un altro
          indirizzo ti chiederemo una conferma prima di procedere.
        </p>
        <p>
          Riceverai una conferma dell&apos;avvenuta cancellazione. Trattiamo la richiesta entro{" "}
          <strong>30 giorni</strong>, come previsto dall&apos;art. 12(3) del GDPR.
        </p>
        <p>
          Puoi chiedere l&apos;eliminazione dell&apos;account sia come cliente sia come
          professionista.
        </p>
      </>
    ),
  },
  {
    id: "cosa-eliminiamo",
    title: "Cosa viene eliminato",
    content: (
      <>
        <p>Con la richiesta rimuoviamo:</p>
        <ul>
          <li>le credenziali di accesso, così l&apos;account non è più utilizzabile;</li>
          <li>
            i dati del profilo: nome e cognome, email, numero di telefono, indirizzo, città, data
            di nascita e, per i professionisti, partita IVA;
          </li>
          <li>la foto del profilo e i documenti d&apos;identità caricati per la verifica;</li>
          <li>i messaggi scambiati in chat e le foto inviate nelle conversazioni;</li>
          <li>
            le recensioni scritte, i feedback inviati e gli eventi di utilizzo dell&apos;app.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cosa-conserviamo",
    title: "Cosa siamo obbligati a conservare",
    content: (
      <>
        <p>
          Due categorie di dati non possono essere cancellate su richiesta, perché la legge ne
          impone la conservazione. È l&apos;eccezione prevista dall&apos;
          <strong>art. 17(3)(b) del GDPR</strong>.
        </p>
        <ul>
          <li>
            <strong>Documenti contabili e fiscali</strong> dei professionisti (compensi, fatture):
            conservati per <strong>10 anni</strong> dalla registrazione, ai sensi dell&apos;art.
            2220 del Codice civile e della normativa IVA.
          </li>
          <li>
            <strong>Storico degli interventi</strong> a cui hai partecipato: conservato perché
            riguarda anche la controparte, che ha diritto a mantenere la traccia del proprio lavoro
            o della propria richiesta.
          </li>
        </ul>
        <p>
          In entrambi i casi i dati vengono <strong>anonimizzati</strong>: il record resta, il
          collegamento con la tua identità no. Scaduto il termine di conservazione, vengono
          eliminati.
        </p>
      </>
    ),
  },
  {
    id: "solo-una-parte",
    title: "Eliminare solo una parte dei dati",
    content: (
      <p>
        Se non vuoi chiudere l&apos;account ma vuoi rimuovere dati specifici, come una foto, una
        recensione o un messaggio, scrivici allo stesso indirizzo indicando cosa vuoi cancellare.
        Dall&apos;app puoi anche scaricare una copia dei tuoi dati: Impostazioni → Account e
        privacy → Scarica i miei dati.
      </p>
    ),
  },
  {
    id: "contatti",
    title: "Contatti",
    content: (
      <>
        <p>
          Assistenza ed esercizio dei diritti previsti dagli artt. 15-22 del GDPR:{" "}
          <SupportEmail />.
        </p>
        <p>
          Il dettaglio completo del trattamento è nell&apos;
          <Link href="/privacy" className="font-semibold text-accent-text underline underline-offset-4">
            Informativa sulla privacy
          </Link>
          .
        </p>
      </>
    ),
  },
];

export default function EliminaAccountPage() {
  return (
    <LegalPage
      title="Eliminare il tuo account Pluggers"
      updated="7 ottobre 2026"
      intro={
        <p>
          Questa pagina riguarda l&apos;app Pluggers e l&apos;account che usi per accedervi. Qui
          trovi come chiederne l&apos;eliminazione, cosa viene cancellato e cosa siamo tenuti a
          conservare.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
