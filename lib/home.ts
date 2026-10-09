/**
 * Home page copy. The components render it and /llms-full.txt and the JSON-LD
 * read it, so what crawlers and assistants see is what people see.
 * Every product claim is checked against the app and backend code.
 */

import { APP_STORE_URL, PLAY_STORE_URL } from "@/components/landing/links";

export const HOME_UPDATED = "2026-10-07";

export const HOME = {
  title: "Pluggers — Il professionista giusto, al momento giusto.",
  description:
    "Descrivi il problema di casa con parole e foto: Pluggers capisce quale professionista serve " +
    "e ti mette in contatto con chi lavora vicino a te. Oggi a Torino.",
};

export const HERO = {
  title: "Il professionista giusto, al momento giusto.",
  lede: "Racconta il problema. Pluggers capisce di che si tratta e ti collega a chi può risolverlo, vicino a te.",
};

export const HOW = {
  title: "Come funziona",
  lede:
    "Pluggers è un'app per chi ha un problema in casa a Torino. Descrivi il guasto con parole e foto: " +
    "un assistente di intelligenza artificiale capisce quale professionista serve e quanto è urgente, " +
    "e ti mostra chi lavora nella tua zona. Per te usarla è gratis: se il professionista chiede un " +
    "Costo Chiamata te lo indica prima della visita, e lo paghi a lui.",
  steps: [
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
      text: "Il professionista ti manda in chat una stima e, se lo chiede, il Costo Chiamata. All'arrivo registrate inizio e fine intervento con un QR, poi lasci la recensione.",
      src: "/screens/step-estimate.png",
      alt: "Chat con il professionista: la foto del guasto, un messaggio e una stima di 85 euro con i bottoni Accetta e Rifiuta.",
    },
  ],
};

export const TRADES_SECTION = {
  title: "I mestieri su Pluggers",
  lede:
    "Su Pluggers trovi idraulici, elettricisti, fabbri, tecnici degli elettrodomestici e gli altri " +
    "mestieri della casa: impianti, aperture, edilizia e finiture, arredo ed esterni. Non serve sapere " +
    "quale ti serve, perché lo capisce l'assistente dalla tua descrizione. Per Torino ogni mestiere ha " +
    "una pagina con i problemi tipici, cosa succede con Pluggers e le domande frequenti.",
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
      text: "Indichi il costo della visita prima dell'appuntamento e mandi la stima in chat. Agenda e check-in con QR sono già dentro.",
    },
  ],
  cta: "Iscriviti come professionista",
  waitlistTitle: "Non sei a Torino? Lasciaci la tua città.",
  waitlistText: "Le prossime zone le scegliamo da lì. Ti scriviamo quando arriviamo da te.",
};

export const TRUST = {
  title: "Cosa sai prima della visita",
  lede:
    "Prima che il professionista arrivi sai chi è, quanto costa farlo venire e quanto può costare il " +
    "lavoro: il profilo mostra le recensioni lasciate dopo interventi completati, la stima arriva in chat " +
    "insieme all'eventuale Costo Chiamata, e il compenso lo concordi direttamente con lui.",
  rows: [
    "Il profilo del professionista mostra le recensioni, che si possono lasciare solo dopo un intervento completato.",
    "La chat è nell'app: stima, preventivo e quello che vi dite restano insieme all'intervento.",
    "La stima e l'eventuale Costo Chiamata li vedi prima della visita. Il compenso lo concordi con il professionista.",
    "I dati sono conservati su server nell'Unione Europea.",
  ],
};

export const FAQ = [
  {
    q: "Che cos'è Pluggers?",
    a: "Pluggers è un'app che ti mette in contatto con i professionisti per la casa della tua zona partendo dalla descrizione del problema. La gestisce Pluggers S.r.l., con sede legale a Torino, ed è attiva a Torino.",
  },
  {
    q: "Quanto costa usare Pluggers?",
    a: "Per chi cerca un professionista Pluggers è gratis: descrivere il problema, ricevere le stime e prenotare non costa niente. Paghi solo il professionista, per la visita e per il lavoro che accetti, direttamente a lui.",
  },
  {
    q: "Come trovo un idraulico o un elettricista a Torino in fretta?",
    a: "Apri Pluggers su app.plggrs.it e descrivi il problema: l'assistente capisce quale mestiere serve e quanto è urgente, e ti mostra i professionisti che lavorano nella tua zona. Scegli a chi mandare la richiesta e ricevi le risposte in chat. Quando può venire lo concordi con il professionista.",
  },
  {
    q: "Cos'è il Costo Chiamata?",
    a: "Il Costo Chiamata è l'importo che il professionista può chiedere per venire a vedere il lavoro, dovuto anche se poi l'intervento non si può fare. Te lo indica nell'app prima della visita, lo accetti o lo rifiuti, e lo paghi a lui: non si paga in app. Se fai il lavoro, si scala dal totale.",
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
    a: "La richiesta arriva ai professionisti che hai scelto, fino a tre tra quelli vicini, e l'intervento va al primo che conferma. Ti scrive in chat con una stima e, se lo chiede, il Costo Chiamata; tu scegli il giorno e lui propone l'orario. All'arrivo registrate inizio e fine intervento con un QR, poi puoi lasciare la recensione.",
  },
  {
    q: "Serve scaricare un'app?",
    a: APP_STORE_URL || PLAY_STORE_URL
      ? "Sì: Pluggers è un'app per iPhone e Android, la scarichi da App Store o Google Play. Da computer la usi anche dal browser, su app.plggrs.it."
      : "Sì: Pluggers è un'app per iPhone e Android, in arrivo su App Store e Google Play. La stessa app si usa anche dal browser, su app.plggrs.it.",
  },
] as const;
