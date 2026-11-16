import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { CookiePreferencesButton } from "@/components/CookiePreferencesButton";
import { LegalPage, SupportEmail, type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = pageMetadata({
  title: "Cookie policy",
  description:
    "Quali cookie usa il sito plggrs.it e che cosa salva l'app Pluggers: cosa serve a funzionare, cosa parte solo con il tuo consenso e come cambiare scelta.",
  path: "/cookie",
});

const LINK = "font-semibold text-accent-text underline underline-offset-4";

// Facts checked against the code on 06/11/2026: components/Analytics.tsx, MetaPixel.tsx, ConsentGate.tsx,
// lib/consent.tsx, next.config.ts (this repo) and pubspec.yaml, core/push, core/errors/crash_reporting.dart
// (pluggers-it/mvp). Keep it in step with them: a new third-party tool means a new line here BEFORE it ships.
const SECTIONS: LegalSection[] = [
  {
    id: "scelta",
    title: "Come scegliere",
    content: (
      <>
        <p>
          Alla prima visita il sito mostra un banner. «Accetta» attiva sia le statistiche sia il
          marketing, «Scegli» ti fa decidere separatamente per ciascuno, «Solo tecnici» li rifiuta
          entrambi. Per usare il sito non serve accettare.
        </p>
        <p>
          Senza il consenso, Google Analytics e il pixel di Meta non vengono caricati e il tuo
          browser non contatta i loro server. Puoi cambiare la tua scelta in qualsiasi momento, e la
          revoca vale da subito: <CookiePreferencesButton />
        </p>
      </>
    ),
  },
  {
    id: "tecnici",
    title: "Sul sito: quello che serve a funzionare",
    content: (
      <>
        <p>
          Il sito non usa cookie propri e non serve il consenso per quello che salva. Nel browser
          resta solo:
        </p>
        <ul>
          <li>
            <strong>la scelta fatta sul banner</strong> (<code>pluggers_cookies_v2</code>): ricorda
            se hai accettato le statistiche e il marketing, per non chiedertelo a ogni visita. Sta
            nella memoria locale del browser, non in un cookie, e resta finché non cambi la scelta o
            cancelli i dati del sito;
          </li>
          <li>
            <strong>l&apos;accesso all&apos;area riservata del blog</strong> (
            <code>pluggers_admin_token</code>): solo per chi gestisce il blog. Sta nella memoria di
            sessione del browser e sparisce quando chiudi la scheda.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "statistiche",
    title: "Sul sito: statistiche (Google Analytics 4)",
    content: (
      <>
        <p>
          Solo con il consenso alle statistiche. È uno strumento di Google Ireland Limited (proprietà{" "}
          <code>G-HXNSEPDBLD</code>) che misura in forma aggregata come viene usato il sito: pagine
          visitate, provenienza della visita, tipo di dispositivo e durata.
        </p>
        <p>
          Salva nel browser i cookie <code>_ga</code> e <code>_ga_HXNSEPDBLD</code>, con un
          identificativo casuale del browser, che durano fino a 2 anni. I segnali pubblicitari sono
          disattivati: non lo usiamo per pubblicità né per profilarti. Google conserva i dati per il
          periodo impostato nel servizio, da 2 a 14 mesi, e può trasferirli negli Stati Uniti
          nell&apos;ambito del Data Privacy Framework UE-USA.
        </p>
      </>
    ),
  },
  {
    id: "marketing",
    title: "Sul sito: marketing (pixel di Meta)",
    content: (
      <>
        <p>
          Solo con il consenso al marketing. È uno strumento di Meta Platforms Ireland Limited che
          serve a misurare le nostre pubblicità su Facebook e Instagram e a mostrarle a chi ha già
          visitato il sito.
        </p>
        <p>
          Invia a Meta le pagine che visiti, l&apos;iscrizione alla lista d&apos;attesa o alla
          newsletter, i tocchi sui pulsanti che aprono o scaricano l&apos;app, l&apos;indirizzo IP e
          informazioni sul browser e sul dispositivo. Non invia nome, cognome, email, telefono né
          quello che scrivi nei moduli. Salva nel browser il cookie <code>_fbp</code>, che dura 90
          giorni; se arrivi da una pubblicità, anche <code>_fbc</code>, con l&apos;identificativo di
          quel clic. Come Meta usa questi dati e chi ne risponde è spiegato nell&apos;
          <Link href="/privacy#sito" className={LINK}>
            informativa sulla privacy
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: "inviti",
    title: "Sul sito: le pagine d'invito",
    content: (
      <p>
        Sulle pagine d&apos;invito (www.plggrs.it/i/ seguito dal codice) il pixel di Meta non si
        carica, anche se hai dato il consenso, e a Google Analytics non arrivano il codice
        dell&apos;invito né il token della stima.
      </p>
    ),
  },
  {
    id: "esterni",
    title: "Sul sito: altri servizi che si contattano",
    content: (
      <>
        <p>Questi servizi si contattano anche senza il consenso del banner:</p>
        <ul>
          <li>
            <strong>Vercel</strong> ospita il sito: vede l&apos;indirizzo IP di ogni visita e non
            imposta cookie nel tuo browser;
          </li>
          <li>
            <strong>BabyLoveGrowth</strong> (<code>media.babylovegrowth.ai</code>) fornisce gli
            articoli del blog: le immagini dentro gli articoli si caricano direttamente dal suo
            servizio, che vede il tuo indirizzo IP.
          </li>
        </ul>
        <p>Il sito non carica caratteri, mappe o altri contenuti di altri siti.</p>
      </>
    ),
  },
  {
    id: "app",
    title: "L'app",
    content: (
      <>
        <p>
          L&apos;app non usa cookie. Salva sul telefono la sessione di accesso nell&apos;area
          protetta del sistema (Keychain su iPhone, Keystore su Android), gli account che scegli di
          ricordare per rientrare più in fretta e alcune preferenze d&apos;uso. Si cancellano con
          l&apos;uscita dall&apos;account o disinstallando l&apos;app. Nella versione web
          (app.plggrs.it) stanno nella memoria locale del browser.
        </p>
        <p>
          Nell&apos;app non ci sono strumenti di pubblicità. Le statistiche d&apos;uso le
          raccogliamo sui nostri server (eventi come le schermate che apri, senza il testo che
          scrivi e senza la posizione). Gli strumenti di altri che l&apos;app contatta sono questi:
        </p>
        <ul>
          <li>
            <strong>Firebase Crashlytics</strong> (Google): rapporti di errore, solo nelle versioni
            di rilascio per iPhone e Android; il sito e la versione web non ne inviano. Contengono
            il tipo di errore, il punto del codice, il modello del telefono, le versioni del sistema
            e dell&apos;app, il nome interno della schermata, il ruolo attivo (cliente o
            professionista) e un identificativo casuale dell&apos;installazione; mai nome, email,
            telefono o quello che scrivi, e nessun identificativo del tuo account;
          </li>
          <li>
            <strong>Notifiche</strong> (Firebase Cloud Messaging di Google e il servizio di
            notifiche di Apple): il token del dispositivo, che salviamo solo per gli account
            registrati e solo se accetti le notifiche; si spengono dalle impostazioni del telefono;
          </li>
          <li>
            <strong>CARTO</strong>: le immagini della mappa, che CARTO ti manda vedendo
            l&apos;indirizzo IP del telefono;
          </li>
          <li>
            <strong>Google e Apple</strong>: l&apos;accesso con il loro account, quando lo scegli;
            il riconoscimento vocale e la ricerca di un indirizzo dalla tua posizione, che fa il
            sistema del telefono.
          </li>
        </ul>
        <p>
          Google Places e OpenStreetMap non sono nell&apos;app: i suggerimenti per gli indirizzi li
          chiede il nostro server, con il testo che digiti (e, se hai concesso la posizione, il
          punto in cui ti trovi): il tuo indirizzo IP non arriva a loro.
        </p>
      </>
    ),
  },
  {
    id: "domande",
    title: "Domande",
    content: (
      <p>
        Per qualsiasi dubbio su questa pagina scrivi a <SupportEmail />. Il dettaglio sui dati
        personali è nell&apos;
        <Link href="/privacy" className={LINK}>
          informativa sulla privacy
        </Link>
        .
      </p>
    ),
  },
];

export default function CookiePage() {
  return (
    <LegalPage
      title="Cookie policy"
      updated="6 novembre 2026"
      intro={
        <p>
          Questa pagina elenca i cookie e le tecnologie simili che usano il sito www.plggrs.it e
          l&apos;app Pluggers, a cosa servono e come cambiare la tua scelta.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
