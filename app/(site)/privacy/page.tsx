import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { CookiePreferencesButton } from "@/components/CookiePreferencesButton";
import { LegalPage, SupportEmail, type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "Come Pluggers S.r.l. tratta i dati di chi usa l'app e il sito: dati raccolti, finalità, intelligenza artificiale, con chi li condivide, conservazione e diritti.",
  path: "/privacy",
});

// All sections but the last are the app's notice (pluggers-it/mvp, app/web/legal/privacy.html)
// word for word: it is the text users accept, so it changes only together with kLegalVersion.
// The 06/11/2026 factual corrections (where the data lives, processing that was missing) went in on both
// sides without a new version: whether users must accept again is a decision for the Compliance.
const SECTIONS: LegalSection[] = [
  {
    id: "titolare",
    title: "Titolare del trattamento",
    content: (
      <p>
        Pluggers S.r.l., con sede legale in Torino, Corso Valdocco 2, Partita IVA e codice
        fiscale 13523080011. Per qualsiasi richiesta:{" "}
        <SupportEmail />.
      </p>
    ),
  },
  {
    id: "dati",
    title: "Quali dati raccogliamo",
    content: (
      <p>
        Dati account (nome, email, telefono). Se entri con Google o Apple riceviamo da loro nome ed
        email (con Apple può essere un indirizzo schermato). Poi gli indirizzi che salvi;
        descrizioni e foto dei problemi che invii; posizione approssimata quando la concedi, per
        mostrarti i professionisti vicini; messaggi della chat con i loro allegati (foto, video e
        file, con didascalia e nome del file), prenotazioni e preventivi. Se usi l&apos;app senza
        registrarti, quello che inserisci (richiesta, indirizzo, foto) viene salvato in una sessione
        anonima, che passa al tuo account quando ti registri. Le foto del guasto usate per il triage
        vengono cancellate subito dopo l&apos;elaborazione; gli allegati della chat restano insieme
        alla conversazione. Se accetti le notifiche, il telefono ci dà un codice (token) che serve
        ad Apple e Google per consegnartele: lo salviamo solo se hai un account e lo togliamo quando
        esci. Per capire come viene usata l&apos;app registriamo eventi d&apos;uso, come le
        schermate che apri, senza il testo che scrivi e senza la posizione. Se usi la dettatura (il
        pulsante «Detta»), il microfono si apre solo mentre detti e la voce diventa testo con il
        riconoscimento del telefono o, se non è disponibile, con il servizio di Apple o di Google
        (sul web, quello del browser): Pluggers non registra la voce, e a noi arriva solo il testo
        che invii dopo averlo riletto. Quando l&apos;app va in errore o si chiude da sola, ci arriva
        un rapporto tecnico che serve solo a correggere il problema (tipo di errore, punto del
        codice, modello del telefono, versioni del sistema e dell&apos;app, un identificativo
        casuale dell&apos;installazione), tramite Firebase Crashlytics di Google: non contiene nome,
        email, telefono né quello che scrivi, e non è collegato al tuo account. Mentre scrivi un
        indirizzo, il testo che digiti (e, se hai concesso la posizione, il punto in cui ti trovi)
        passa dai nostri server a Google Places, o a OpenStreetMap quando Google non è disponibile.
        Per aprire la mappa l&apos;app chiede le immagini a CARTO, che vede l&apos;indirizzo IP del
        telefono. Se usi la tua posizione per compilare un indirizzo, a ricavarlo è il servizio del
        telefono (Apple o Google).
      </p>
    ),
  },
  {
    id: "professionisti",
    title: "Se sei un professionista",
    content: (
      <p>
        Dati dell&apos;attività: nome, Partita IVA, zona di lavoro, mestieri e disponibilità. Per
        iscriverti carichi il fronte e il retro di un documento d&apos;identità (carta
        d&apos;identità, patente o passaporto): è un passaggio obbligatorio. Un sistema di
        intelligenza artificiale (Gemini di Google, nell&apos;Unione Europea) legge le due foto per
        controllare il tipo di documento, la scadenza, che il nome sia quello che hai indicato e che
        tu sia maggiorenne. Per la patente e la carta d&apos;identità cartacea, e ogni volta che
        c&apos;è un dubbio, decide una persona del team: il sistema automatico non ti esclude mai da
        solo, al massimo ti chiede di ricaricare le foto. Non confrontiamo il tuo volto. Di ogni
        controllo salviamo l&apos;esito, il tipo e la scadenza del documento e un&apos;impronta dei
        file e del numero (un codice da cui non si torna alle foto né al numero, che non salviamo in
        chiaro). I file restano in un archivio privato e non sono mai mostrati ai clienti. Se
        inserisci un cliente che non ha l&apos;app, scrivi tu il suo nome, il telefono,
        l&apos;indirizzo e il lavoro da fare. Il preventivo si apre da un link valido 30 giorni, che
        condividi tu: la pagina non richiede l&apos;app e mostra il nome di battesimo del cliente,
        la data, l&apos;indirizzo, il lavoro e il totale. Questa informativa vale anche per quel
        cliente: i suoi diritti li esercita scrivendo a <SupportEmail />.
      </p>
    ),
  },
  {
    id: "finalita",
    title: "Perché li usiamo",
    content: (
      <p>
        Per erogare il servizio (metterti in contatto col professionista giusto), gestire le
        prenotazioni e le notifiche, controllare i documenti dei professionisti, migliorare
        l&apos;app con statistiche di utilizzo aggregate, e per obblighi di legge.
      </p>
    ),
  },
  {
    id: "intelligenza-artificiale",
    title: "Intelligenza artificiale",
    content: (
      <p>
        La descrizione del problema, con la foto se la aggiungi, viene analizzata da un modello di
        intelligenza artificiale (Gemini di Google, tramite Google Cloud Vertex AI) per classificare
        il guasto e indirizzarti. Testo e foto sono elaborati nell&apos;Unione Europea. Non inviamo
        il tuo testo per addestrare modelli. Le foto del problema vengono cancellate dopo
        l&apos;analisi. Lo stesso modello legge le foto del documento d&apos;identità dei
        professionisti, come spiegato in «Se sei un professionista».
      </p>
    ),
  },
  {
    id: "condivisione",
    title: "Con chi li condividiamo",
    content: (
      <p>
        Con il professionista con cui scegli di interagire. Con i fornitori tecnici necessari, come
        responsabili del trattamento: Hetzner (i server in Germania dove stanno database, account e
        file), Google Cloud (i servizi dell&apos;app e l&apos;intelligenza artificiale,
        nell&apos;Unione Europea; le copie di sicurezza, cifrate, sono in Belgio) e Resend (le email
        di accesso e di conferma). Con i servizi che l&apos;app usa per funzionare: Google e Apple
        (accesso con il loro account, notifiche, rapporti di errore), Google Places e OpenStreetMap
        (suggerimento degli indirizzi), CARTO (mappa). Google e Apple possono trattare dati anche
        fuori dall&apos;Unione Europea, per esempio negli Stati Uniti. Non vendiamo i tuoi dati.
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
        Accesso, rettifica, cancellazione, portabilità, opposizione. Dall&apos;app puoi scaricare i
        tuoi dati ed eliminare l&apos;account in autonomia (Impostazioni → Privacy e account; se sei
        un professionista, Impostazioni → Dati personali e privacy). Per gli altri diritti: <SupportEmail />.
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
          I dati del modulo sono scritti nello stesso database dell&apos;app, su un server in
          Germania (Hetzner); le copie di sicurezza, cifrate, stanno in Belgio (Google Cloud). Il
          sito è ospitato da Vercel: le pagine e il modulo passano dai suoi server, che vedono
          l&apos;indirizzo IP di chi visita il sito. Le connessioni sono cifrate e adottiamo misure
          di sicurezza adeguate (art. 32). Non vendiamo i dati: i fornitori che usiamo sono nominati
          responsabili del trattamento (art. 28).
        </p>
        <p>
          Il modulo è riservato ai maggiorenni. Se ci accorgiamo di aver raccolto dati di un
          minore senza il consenso di chi ne ha la responsabilità genitoriale, li cancelliamo.
        </p>
        <h3>Cookie, statistiche e marketing</h3>
        <p>
          Il sito non usa cookie propri per funzionare. Nel tuo browser salva solo la scelta fatta
          sul banner dei cookie (nella memoria locale del browser) e, a chi gestisce il blog, il
          codice di accesso all&apos;area riservata, che sparisce quando chiudi la scheda. Per
          questi non serve il consenso. L&apos;elenco completo, con i nomi e la durata, è nella{" "}
          <Link href="/cookie" className="font-semibold text-accent-text underline underline-offset-4">
            Cookie policy
          </Link>
          .
        </p>
        <p>
          Gli altri cookie li usiamo solo se acconsenti dal banner che compare alla prima visita:
          «Accetta» attiva sia le statistiche sia il marketing, «Scegli» ti fa decidere
          separatamente per ciascuno, «Solo tecnici» li rifiuta entrambi.
        </p>
        <p>
          <strong>Statistiche.</strong>{" "}Con il consenso alle statistiche usiamo Google Analytics
          4, fornito da Google Ireland Limited, per misurare in forma aggregata come viene usato il
          sito: pagine visitate, provenienza della visita, tipo di dispositivo e durata. Google
          Analytics usa cookie e un identificativo del browser; non lo usiamo per pubblicità né per
          profilarti, e i segnali pubblicitari sono disattivati. Base giuridica: consenso (art.
          6(1)(a)). Google conserva questi dati per il periodo impostato nel servizio, da 2 a 14
          mesi, e può trasferirli negli Stati Uniti nell&apos;ambito del Data Privacy Framework
          UE-USA.
        </p>
        <p>
          <strong>Marketing.</strong>{" "}Con il consenso al marketing usiamo il pixel di Meta, uno
          strumento di Meta Platforms Ireland Limited, la società che gestisce Facebook e
          Instagram in Europa. Serve a misurare le nostre pubblicità su Facebook e Instagram (per
          esempio quante persone arrivano sul sito da una pubblicità e si iscrivono alla lista
          d&apos;attesa) e a mostrarle a chi ha già visitato il sito. Il pixel invia a Meta le
          pagine che visiti, l&apos;iscrizione alla lista d&apos;attesa o alla newsletter, i tocchi
          sui pulsanti che aprono o scaricano l&apos;app, l&apos;indirizzo IP, informazioni sul
          browser e sul dispositivo e un identificativo salvato in un cookie, che dura 90 giorni;
          se arrivi da una pubblicità, anche l&apos;identificativo di quel clic. Non inviamo a Meta
          nome, cognome, email, telefono né quello che scrivi nei moduli. Meta può collegare
          questi dati al tuo account Facebook o Instagram, se ne hai uno.
        </p>
        <p>
          Per la raccolta di questi dati e il loro invio a Meta siamo contitolari del trattamento
          insieme a Meta Platforms Ireland Limited; per l&apos;uso che Meta ne fa dopo, per
          esempio per scegliere le pubblicità da mostrarti, il titolare è Meta Platforms Ireland
          Limited, secondo la sua{" "}
          <a
            href="https://www.facebook.com/privacy/policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent-text underline underline-offset-4"
          >
            informativa sulla privacy
          </a>
          , a cui puoi rivolgerti anche per esercitare i tuoi diritti. Base giuridica: consenso
          (art. 6(1)(a)). Meta può trasferire questi dati negli Stati Uniti a Meta Platforms, Inc.
          nell&apos;ambito del Data Privacy Framework UE-USA.
        </p>
        <p>
          <strong>Immagini del blog.</strong>{" "}Le immagini dentro gli articoli del blog si
          caricano dal servizio che ci fornisce gli articoli (BabyLoveGrowth,
          media.babylovegrowth.ai): per mostrarle, il tuo browser lo contatta e quel servizio vede
          il tuo indirizzo IP. Questo non dipende dalla scelta fatta sul banner.
        </p>
        <p>
          Senza il consenso, Google Analytics e il pixel di Meta non vengono caricati e il tuo
          browser non contatta i loro server. Puoi cambiare la tua scelta in qualsiasi momento, e la revoca
          vale da subito: <CookiePreferencesButton />
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
      updated="6 novembre 2026"
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
