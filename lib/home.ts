/**
 * Home page copy. The components render it and /llms-full.txt and the JSON-LD
 * read it, so what crawlers and assistants see is what people see.
 * Every product claim is checked against the app and backend code.
 */
import { WEB_APP_OPEN } from "@/components/landing/links";
import { WAITLIST_TEXT } from "@/lib/waitlist";

export const HOME_UPDATED = "2026-10-20";

/** What using Pluggers does not cost the person who looks for a professional. One sentence, said the same everywhere. */
export const COSTS_LINE = "Non c'è nessun abbonamento e non paghi per sbloccare i professionisti che trovi.";


export const HOME = {
  title: "Pluggers | Il professionista giusto, al momento giusto.",
  description:
    "Descrivi il problema di casa con parole e foto: Pluggers capisce quale professionista serve " +
    "e ti mette in contatto con chi lavora vicino a te. Oggi a Torino.",
};

export const HERO = {
  eyebrow: "Scrivi e fotografa il problema, al resto pensiamo noi",
  title: "Il professionista giusto, al momento giusto.",
  lede: "Racconti il problema, se le parole non bastano fai una foto, Pluggers capisce quale mestiere ti serve e ti mette in contatto con i professionisti della tua zona. Stima, preventivo, appuntamento e intervento si gestiscono in app.",
};

export const COMING = {
  title: "In arrivo su Pluggers",
  items: [
    { title: "Pagamenti nell'app", text: "Costo Chiamata e preventivo si potranno pagare direttamente dall'app." },
    { title: "Imprese e amministratori di condominio", text: "I profili per imprese e amministratori di condominio sono in arrivo." },
  ],
};

export const HOW = {
  title: "Come funziona",
  lede:
    "Descrivi il guasto con parole e foto: " +
    "un assistente di intelligenza artificiale capisce quale professionista serve e quanto è urgente, " +
    `e ti mostra chi lavora nella tua zona. ${COSTS_LINE}`,
  steps: [
    {
      title: "Racconta il problema",
      text: "Scrivi due righe e aggiungi una foto. Se serve, l'intelligenza artificiale ti fa qualche domanda senza termini tecnici.",
      src: "/screens/step-describe.png",
      alt: "Schermata iniziale dell'app: campo «Di cosa hai bisogno?» con la descrizione di un rubinetto che perde, una foto allegata e il bottone «Trova professionisti».",
    },
    {
      title: "Pluggers capisce di che si tratta",
      text: "Riconosce il mestiere, l'urgenza e le cause più probabili, poi mostra i professionisti della tua zona. Scegli chi contattare, fino a cinque, e il giorno tra quelli disponibili: l'orario lo propone il professionista.",
      src: "/screens/step-triage.png",
      alt: "Schermata «Cosa abbiamo capito»: chi serve (Idraulico), urgenza 2 su 5, cause probabili e bottone «Cerca un professionista».",
    },
    {
      title: "Prima stima, poi preventivo, e il QR a inizio e fine lavoro",
      text: "Il professionista ti manda in chat una stima e, se lo chiede, il Costo Chiamata. Dopo il sopralluogo arriva il preventivo. Il QR si scansiona all'inizio e alla fine del lavoro, poi lasci la recensione.",
      src: "/screens/step-estimate.png",
      alt: "Chat con il professionista: la foto del guasto, un messaggio e una stima di 85 euro con i bottoni Accetta e Rifiuta.",
    },
  ],
};

export const TRADES_SECTION = {
  title: "I mestieri su Pluggers",
  lede:
    "Su Pluggers trovi idraulici, elettricisti, fabbri, serramentisti e gli altri " +
    "mestieri della casa: impianti, aperture, edilizia e finiture, arredo ed esterni. Non serve sapere " +
    "quale ti serve, perché lo capisce l'assistente dalla tua descrizione. Per Torino ogni mestiere ha " +
    "una pagina con i problemi tipici, cosa succede con Pluggers e le domande frequenti.",
};

/** The «Gestionale» card of the professional's features: the monthly history is in the app, sending it to the accountant is not yet. */
export const GESTIONALE = {
  title: "Gestionale",
  text: "Lo storico mensile dei tuoi lavori è già nell'app. L'invio al commercialista arriva a breve. È gratuito.",
};

export const PROS = {
  title: "Per i professionisti",
  lede:
    "Pluggers porta ai professionisti della casa le richieste dei clienti vicini, già descritte e " +
    "classificate per mestiere e urgenza. Il professionista sceglie il raggio in cui lavorare, decide " +
    "il Costo Chiamata e manda la stima in chat; agenda e check-in con QR sono nell'app.",
  benefits: [
    {
      title: "Richieste già descritte e classificate",
      text: "Ogni richiesta arriva con mestiere, descrizione del problema e distanza. Se è urgente, lo vedi subito.",
    },
    {
      title: "Il raggio d'azione lo scegli tu",
      text: "Da 1 a 100 km dal tuo indirizzo operativo: ti vedono solo i clienti dentro quel raggio.",
    },
    {
      title: "Costo Chiamata e preventivo li decidi tu",
      text: "Indichi il costo del sopralluogo prima dell'appuntamento e mandi la stima in chat. Agenda e check-in con QR sono già dentro.",
    },
    GESTIONALE,
  ],
  cta: "Iscriviti come professionista",
  waitlistTitle: "Lasciaci i tuoi contatti",
  waitlistText: WAITLIST_TEXT,
};

export const TRUST = {
  title: "Cosa sai prima del sopralluogo",
  lede:
    "Prima che il professionista arrivi sai chi è, quanto costa farlo venire e quanto può costare il " +
    "lavoro: il profilo mostra le recensioni lasciate dopo interventi completati, la stima arriva in chat " +
    "insieme all'eventuale Costo Chiamata, e il compenso lo concordi direttamente con lui.",
  rows: [
    "Il profilo del professionista mostra le recensioni, che si possono lasciare solo dopo un intervento completato.",
    "La chat è nell'app: stima, preventivo e quello che vi dite restano insieme all'intervento.",
    "La stima e l'eventuale Costo Chiamata li vedi prima del sopralluogo. Il compenso lo concordi con il professionista.",
    "I dati sono conservati su server nell'Unione Europea.",
  ],
};

/** The answers on getting the app follow the admin switch (lib/prelaunch.ts): before launch they point to the pre-registration. */
export const faq = (inStores: boolean) => [
  {
    q: "Che cos'è Pluggers?",
    a: "Pluggers è un'app che ti mette in contatto con i professionisti per la casa della tua zona partendo dalla descrizione del problema. La gestisce Pluggers S.r.l., con sede legale a Torino, ed è attiva a Torino.",
  },
  {
    q: "Quanto costa usare Pluggers?",
    a: COSTS_LINE,
  },
  {
    q: "Come trovo un idraulico o un elettricista a Torino in fretta?",
    a: `${!inStores ? "Pluggers arriva a breve su iPhone e Android: lascia i contatti nella pre-iscrizione e ti avvisiamo appena è disponibile. Con l'app descrivi" : WEB_APP_OPEN ? "Apri Pluggers su app.plggrs.it e descrivi" : "Scarica Pluggers su iPhone o Android e descrivi"} il problema: l'assistente capisce quale mestiere serve e quanto è urgente, e ti mostra i professionisti che lavorano nella tua zona. Scegli a chi mandare la richiesta e il giorno tra quelli disponibili: l'orario lo propone il professionista. Le risposte arrivano in chat.`,
  },
  {
    q: "Cos'è il Costo Chiamata?",
    a: "Il Costo Chiamata è l'importo che il professionista può chiedere per fare il sopralluogo, dovuto anche se poi l'intervento non si può fare. Te lo indica nell'app prima del sopralluogo, lo accetti o lo rifiuti, e lo paghi a lui: non si paga in app. Se fai il lavoro, si scala dal totale.",
  },
  {
    q: "Dove funziona Pluggers?",
    a: "Pluggers oggi funziona a Torino e dintorni. Se sei altrove, lascia la tua città nel modulo: le prossime zone le scegliamo da lì.",
  },
  {
    q: "Come fa Pluggers a capire di che si tratta?",
    a: "Pluggers usa un assistente di intelligenza artificiale: legge la descrizione e la foto, se serve ti fa qualche domanda senza termini tecnici e indica il mestiere, l'urgenza e le cause più probabili. Può sbagliare: il professionista verifica sul posto. La foto usata per questa valutazione viene cancellata subito dopo.",
  },
  {
    q: "Chi sono i professionisti?",
    a: "Sono professionisti e artigiani della tua zona, che scelgono loro in che raggio intervenire. Nel profilo vedi mestieri, città e le recensioni ricevute dopo interventi completati; se la partita IVA è stata controllata, compare «P.IVA verificata».",
  },
  {
    q: "Cosa succede dopo la richiesta?",
    a: "La richiesta arriva ai professionisti che hai scelto, fino a cinque tra quelli vicini, e l'intervento va al primo che conferma. Ti scrive in chat con una stima e, se lo chiede, il Costo Chiamata; tu scegli il giorno e lui propone l'orario. Il QR si scansiona all'inizio e alla fine del lavoro, poi puoi lasciare la recensione.",
  },
  {
    q: "Serve scaricare un'app?",
    a: !inStores
      ? "Sì: Pluggers è un'app per iPhone e Android e arriva a breve sugli store. Lascia i contatti nella pre-iscrizione: ti avvisiamo appena è disponibile."
      : WEB_APP_OPEN
      ? "Sì: Pluggers è un'app per iPhone e Android. Da computer la usi anche dal browser, su app.plggrs.it."
      : "Sì: Pluggers è un'app per iPhone e Android. La versione da usare dal computer è in arrivo.",
  },
] as const;
