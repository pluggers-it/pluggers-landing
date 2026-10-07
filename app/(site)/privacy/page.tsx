import type { Metadata } from "next";
import { LegalPage, SupportEmail, type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Informativa sul trattamento dei dati personali per Pluggers: iscrizione waitlist, newsletter e utilizzo del sito.",
  alternates: { canonical: "https://www.plggrs.it/privacy" },
};

// All sections but the last are the app's notice (pluggers-it/mvp, app/web/legal/privacy.html)
// word for word: it is the text users accept, so it changes only together with kLegalVersion.
const SECTIONS: LegalSection[] = [
  {
    id: "titolare",
    title: "Titolare del trattamento",
    content: (
      <p>
        Pluggers S.r.l., con sede legale in Torino, Corso Valdocco 2. La Partita IVA sarà
        pubblicata all&apos;iscrizione nel Registro delle Imprese. Per qualsiasi richiesta:{" "}
        <SupportEmail />.
      </p>
    ),
  },
  {
    id: "dati",
    title: "Quali dati raccogliamo",
    content: (
      <p>
        Dati account (nome, email, telefono); descrizioni e foto dei problemi che invii;
        posizione approssimata quando la concedi, per mostrarti i professionisti vicini; messaggi
        della chat con i loro allegati (foto, video e file, con didascalia e nome del file),
        prenotazioni e preventivi. Le foto del guasto usate per il triage vengono cancellate
        subito dopo l&apos;elaborazione; gli allegati della chat restano insieme alla
        conversazione.
      </p>
    ),
  },
  {
    id: "finalita",
    title: "Perché li usiamo",
    content: (
      <p>
        Per erogare il servizio (metterti in contatto col professionista giusto), gestire le
        prenotazioni, migliorare l&apos;app con statistiche di utilizzo aggregate, e per obblighi
        di legge.
      </p>
    ),
  },
  {
    id: "intelligenza-artificiale",
    title: "Intelligenza artificiale",
    content: (
      <p>
        La descrizione del problema viene analizzata da un modello di intelligenza artificiale
        (Gemini di Google, tramite Google Cloud Vertex AI) per classificare il guasto e
        indirizzarti. Testo e foto sono elaborati nell&apos;Unione Europea. Non inviamo il tuo
        testo per addestrare modelli. Le foto del problema vengono cancellate dopo l&apos;analisi.
      </p>
    ),
  },
  {
    id: "condivisione",
    title: "Con chi li condividiamo",
    content: (
      <p>
        Solo con i fornitori tecnici necessari (hosting e cloud) come responsabili del
        trattamento, e con il professionista con cui scegli di interagire. Non vendiamo i tuoi
        dati.
      </p>
    ),
  },
  {
    id: "conservazione",
    title: "Per quanto li conserviamo",
    content: (
      <p>
        Per il tempo necessario al servizio e agli obblighi di legge. Puoi chiedere la
        cancellazione in ogni momento (vedi sotto).
      </p>
    ),
  },
  {
    id: "diritti",
    title: "I tuoi diritti",
    content: (
      <p>
        Accesso, rettifica, cancellazione, portabilità, opposizione. Dall&apos;app puoi scaricare
        i tuoi dati ed eliminare l&apos;account in autonomia (Impostazioni → profilo). Per gli
        altri diritti: <SupportEmail />.
      </p>
    ),
  },
  {
    id: "sito",
    title: "Il sito plggrs.it",
    content: (
      <>
        <p>
          Questa parte riguarda solo il sito www.plggrs.it. Il titolare è lo stesso: Pluggers
          S.r.l., con sede legale in Torino, Corso Valdocco 2.
        </p>
        <h3>Il modulo di iscrizione</h3>
        <p>
          Se compili il modulo della lista d&apos;attesa o della newsletter raccogliamo nome,
          cognome, città, numero di telefono, email e professione, oppure l&apos;indicazione che
          sei un cliente. Li usiamo per:
        </p>
        <ul>
          <li>
            <strong>lista d&apos;attesa e rilascio dell&apos;app</strong>: inserirti nella lista
            d&apos;attesa, avvisarti del rilascio dell&apos;app, anche con un invito su WhatsApp,
            e pre-creare il tuo account professionale per semplificare l&apos;accesso. Base
            giuridica: misure precontrattuali (art. 6(1)(b) del GDPR) e consenso (art. 6(1)(a));
          </li>
          <li>
            <strong>newsletter</strong>: inviarti aggiornamenti, curiosità sul mondo artigiano e
            comunicazioni sul progetto. Base giuridica: consenso (art. 6(1)(a));
          </li>
          <li>
            <strong>contatto commerciale</strong>: contattarti per telefono con proposte
            commerciali sui nostri servizi. Base giuridica: consenso (art. 6(1)(a)).
          </li>
        </ul>
        <p>
          Li conserviamo finché non chiedi la disiscrizione o revochi il consenso: in fondo a ogni
          nostra email trovi il link per disiscriverti con un clic. La revoca non tocca la
          liceità del trattamento svolto prima (art. 7(3)).
        </p>
        <p>
          I dati sono conservati su server cloud nell&apos;Unione Europea, con misure di
          sicurezza adeguate (art. 32), compresa la crittografia. Non li vendiamo: i fornitori che
          usiamo sono nominati responsabili del trattamento (art. 28).
        </p>
        <p>
          Il modulo è riservato ai maggiorenni. Se ci accorgiamo di aver raccolto dati di un
          minore senza il consenso di chi ne ha la responsabilità genitoriale, li cancelliamo.
        </p>
        <h3>Cookie</h3>
        <p>
          Il sito non usa cookie di profilazione né strumenti di statistica. Nel tuo browser
          salva solo il tema chiaro o scuro e la scelta fatta sul banner dei cookie; a chi
          gestisce il blog, anche l&apos;accesso all&apos;area riservata.
        </p>
        <h3>Reclamo</h3>
        <p>
          Oltre ai diritti descritti sopra, puoi proporre reclamo al Garante per la protezione dei
          dati personali (
          <a
            href="https://www.garanteprivacy.it"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent-text underline underline-offset-4"
          >
            garanteprivacy.it
          </a>
          ), come previsto dall&apos;art. 77 del GDPR.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Informativa sulla privacy"
      updated="6 ottobre 2026"
      version="2026-10-06"
      intro={
        <p>
          Questa informativa spiega quali dati raccogliamo quando usi Pluggers, perché, e quali
          diritti hai. È scritta in modo chiaro; la versione legale estesa è disponibile su
          richiesta a <SupportEmail />.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
