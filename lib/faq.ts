/**
 * The FAQ page (/faq). The page, the FAQPage JSON-LD and /llms-full.txt read it,
 * so what crawlers and assistants see is what people see.
 *
 * Every answer was checked against the app (pluggers-it/mvp, main of 20/10/2026) and the
 * backend (pluggers-it/pluggers-backend, main of 20/10/2026). Where a feature sits behind a switch
 * of the admin panel (`ui` config of core-api) the line says so:
 *  - identity verification (`identity_verification`): off in production on 20/10/2026;
 *  - quiet hours for new requests (backend #595, merged 20/10/2026).
 * The cap of professionals per request is 3 in the app and the backend
 * (`kMaxProfessionalsPerRequest`, `MAX_PROFESSIONISTI_PER_RICHIESTA`): keep this text in step with them.
 */
import { faq as homeFaq } from "@/lib/home";

export const FAQ_UPDATED = "2026-10-20";

export type FaqItem = {
  q: string;
  a: string;
  /** A page that says more, shown under the answer. */
  link?: { href: string; label: string };
};

export type FaqGroup = {
  id: string;
  title: string;
  lede: string;
  items: readonly FaqItem[];
};

const CLIENT: FaqItem[] = [
  {
    q: "Devo creare un account?",
    a: "Puoi guardare l'app e cominciare senza account. Appena la richiesta deve arrivare a un professionista serve un account: ti registri con email e password, oppure con Google o Apple. Devi dichiarare di avere almeno 18 anni.",
  },
  {
    q: "Come faccio una richiesta?",
    a: "Scrivi cosa è successo, per esempio «il rubinetto della cucina perde dalla base». Poi scrivi l'indirizzo dell'intervento, o usa la posizione attuale, e tocca «Trova professionisti». La foto è facoltativa.",
  },
  {
    q: "Posso aggiungere una foto?",
    a: "Sì, una foto del problema, quando le parole non bastano. Puoi cambiarla o toglierla prima di inviare. L'intelligenza artificiale la usa per capire il guasto e la foto viene cancellata subito dopo l'analisi. In chat con il professionista puoi mandare altre foto, video e file.",
  },
  {
    q: "Che domande mi fa l'assistente?",
    a: "Di solito tre o quattro, una alla volta e senza termini tecnici. Tocchi la risposta giusta, oppure scegli «Altro» e rispondi con parole tue. Se non lo sai, scegli «Non lo so». Se vuoi fermarti prima, chiudi la richiesta con quello che hai detto.",
  },
  {
    q: "Cosa mi dice alla fine delle domande?",
    a: "Trovi il riepilogo «Cosa abbiamo capito»: quale professionista serve, quanto è urgente da 1 a 5 e le cause più probabili, con la più probabile in evidenza. Sono ipotesi, non una diagnosi. La causa certa la trova il professionista sul posto.",
  },
  {
    q: "E se il riepilogo non è giusto?",
    a: "Tocca «Non è questo il problema» e scegli tu la categoria dall'elenco. Se l'assistente scrive che non serve un intervento ma il problema c'è ancora, aggiungi i dettagli che mancano: lo valuta di nuovo.",
  },
  {
    q: "E se non è un lavoro per la casa, o è un'emergenza?",
    a: "Pluggers trova professionisti per la casa: impianti, aperture, edilizia, arredo ed esterni. Se quello che descrivi è altro, o non serve nessun intervento, te lo diciamo subito e la richiesta non parte. Pluggers non è un servizio di emergenza: se c'è un pericolo immediato, chiama il 112.",
  },
  {
    q: "Come scelgo i professionisti?",
    a: "Dopo il riepilogo vedi i professionisti che fanno quel mestiere nella tua zona, dal più vicino. Per ognuno trovi nome, valutazione, numero di recensioni e zona, e puoi guardarli anche sulla mappa. Ne scegli fino a tre: la richiesta arriva a tutti.",
  },
  {
    q: "Cosa succede se nella mia zona non c'è nessuno?",
    a: "L'app te lo dice e ti chiede se vuoi confermare l'interesse. Se confermi, la richiesta resta in attesa per 30 giorni: il primo professionista adatto che si iscrive nella tua zona la riceve e tu ricevi una notifica. Puoi annullare l'attesa quando vuoi. Se dopo 30 giorni non è arrivato nessuno, ti avvisiamo.",
  },
  {
    q: "Come scelgo il giorno?",
    a: "Sul calendario i giorni cerchiati in viola sono quelli disponibili. Se hai scelto più professionisti, vedi i giorni in cui lavorano tutti. Scegli solo il giorno: l'orario te lo propone il professionista.",
  },
  {
    q: "Posso cambiare giorno?",
    a: "Il professionista può proporti l'orario oppure un altro giorno. Tu accetti, o rispondi con un altro giorno. Ogni proposta resta valida 48 ore: se nessuno risponde, la richiesta si chiude e puoi scegliere un altro professionista.",
  },
  {
    q: "Come funziona la chat?",
    a: "Scrivi al professionista dall'app e con la graffetta mandi foto, video e file. I numeri di telefono e le email scritti nei messaggi vengono nascosti. Se qualcosa non va, puoi segnalare o bloccare il professionista.",
  },
  {
    q: "Che differenza c'è tra stima e preventivo?",
    a: "La stima arriva prima del sopralluogo ed è indicativa. Se la accetti, l'appuntamento è confermato e le richieste agli altri professionisti si chiudono. Il preventivo arriva dopo il sopralluogo, voce per voce, con imponibile, IVA e totale, e puoi aprire o scaricare il PDF. Vale solo se lo accetti. Se il prezzo cambia durante il lavoro, ricevi un preventivo aggiornato con il motivo e le foto: decidi tu se accettarlo.",
  },
  {
    q: "Come si paga il professionista?",
    a: "Paghi direttamente il professionista, come vi accordate: nell'app non si paga. I pagamenti nell'app sono in arrivo. In «Le mie ricevute» trovi il riepilogo di ogni intervento; la fattura la chiedi al professionista.",
  },
  {
    q: "A cosa serve il QR?",
    a: "Serve a registrare l'inizio e la fine del lavoro. Il professionista mostra il QR nell'app e tu lo inquadri con la fotocamera del telefono: una volta quando inizia e una quando finisce. Se non riesci a inquadrarlo, il professionista può chiudere l'intervento senza il QR e tu ricevi la richiesta di conferma.",
  },
  {
    q: "Come lascio una recensione?",
    a: "A lavoro finito l'app ti chiede di confermare l'intervento e di dare da 1 a 5 stelle. Puoi anche confermare senza valutare. Una recensione si può lasciare solo dopo un intervento completato e compare sul profilo del professionista.",
  },
  {
    q: "Posso annullare o spostare un appuntamento?",
    a: "Sì, finché è confermato. Puoi annullarlo fino a 24 ore prima e spostarlo fino a 4 ore lavorative prima, dalle 8 alle 18. Dopo questi limiti ci si accorda in chat con il professionista.",
  },
];

const PRO: FaqItem[] = [
  {
    q: "Come mi iscrivo come professionista?",
    a: "Apri l'app, scegli «Offro un servizio» e crea l'account con email, Google o Apple. Poi completi il profilo in cinque passi: i mestieri, i lavori che fai, le competenze (facoltative), la tua attività e la disponibilità. Per ricevere richieste accetti le condizioni e la privacy per i professionisti: finché non lo fai, i clienti non ti vedono.",
  },
  {
    q: "Serve la partita IVA?",
    a: "Sì, è obbligatoria: 11 cifre con il codice di controllo corretto. Dichiari di averla in regola e di avere i requisiti di legge per i lavori che offri, cioè abilitazioni, assicurazioni e autorizzazioni. Nelle impostazioni indichi anche se sei in regime ordinario o forfettario.",
  },
  {
    q: "Come scelgo mestieri e zona?",
    a: "Scegli tutti i mestieri che fai: i clienti ti trovano così. Per ogni mestiere i lavori più comuni sono già selezionati e togli quelli che non fai. Poi indichi l'indirizzo da cui parti e fin dove ti sposti, da 1 a 100 km, e le città in cui accetti interventi. Ricevi solo richieste dentro quella distanza.",
  },
  {
    q: "Posso verificare la mia identità?",
    a: "Sì, è facoltativa e la trovi nel profilo. Fotografi il documento e fai un selfie: ci vogliono circa due minuti e l'esito compare nell'app. Se la verifica riesce, sulla tua scheda compare il badge «Identità verificata». Il controllo lo fa un servizio esterno: noi teniamo solo l'esito e la scadenza del documento, non le foto né il numero.",
  },
  {
    q: "Come ricevo le richieste?",
    a: "Le richieste dei clienti che ti hanno scelto arrivano nella sezione «Richieste», divise in «Da decidere» e «Da preventivare». Ognuna mostra il giorno chiesto, il problema, la distanza da te e una cifra di riferimento calcolata dall'app, e puoi leggere le parole del cliente e la scheda del problema. La stessa richiesta può arrivare fino a tre professionisti: il lavoro va a chi arriva per primo alla conferma.",
  },
  {
    q: "Come rispondo e come si sceglie l'orario?",
    a: "Il cliente sceglie solo il giorno. Se sei libero, accetti e proponi l'orario: l'app ti suggerisce fino a tre orari liberi in base alla tua agenda e puoi sceglierne un altro. Se quel giorno non va, proponi un altro giorno con il suo orario. Se non puoi, rifiuti. Il cliente accetta oppure risponde con un altro giorno. Tu puoi fare al massimo tre proposte e ognuna resta valida 48 ore: se nessuno risponde, la richiesta si chiude.",
  },
  {
    q: "Come preparo stima e preventivo?",
    a: "Prima del sopralluogo mandi una stima: quanto può costare il lavoro e l'eventuale Costo Chiamata. L'app ti suggerisce le cifre dai prezzi della tua zona e puoi cambiarle. Dopo il sopralluogo mandi il preventivo, voce per voce: l'app calcola imponibile, IVA e totale e il cliente riceve anche il PDF. Se durante il lavoro il prezzo cambia, mandi un preventivo aggiornato con il motivo e le foto.",
  },
  {
    q: "Chi decide i prezzi e come vengo pagato?",
    a: "Li decidi tu. Il Costo Chiamata va da 0 a 500 euro e l'app ti suggerisce una cifra: il cliente lo accetta con la stima, prima dell'appuntamento, e se conferma il lavoro viene scalato dal totale. Stima e preventivo li scrivi tu. Il cliente ti paga direttamente, come vi accordate: nell'app non si paga. I pagamenti nell'app sono in arrivo.",
  },
  {
    q: "Come funzionano agenda e appuntamenti?",
    a: "Gli interventi confermati entrano in agenda da soli. Con «Appuntamento cliente esterno» segni anche i lavori che prendi fuori da Pluggers: così ai clienti proponiamo solo orari davvero liberi. Se due lavori si sovrappongono, l'app ti avvisa. Orari, giorni di lavoro e ferie li imposti nelle impostazioni.",
  },
  {
    q: "Cos'è il gestionale?",
    a: "È lo «Storico» dell'app: vedi i lavori conclusi, gli importi concordati e le recensioni, per questo mese, per il mese scorso o per l'anno. Su ogni lavoro segni tu come ti ha pagato il cliente: contanti, bonifico o altro. L'invio al commercialista arriva a breve. È gratuito.",
  },
  {
    q: "Come uso il QR?",
    a: "All'arrivo apri l'intervento e tocchi «Genera il QR di inizio lavoro»: il cliente lo inquadra con il suo telefono. A lavoro finito fai lo stesso con il QR di fine lavoro e puoi caricare una foto del lavoro. Il QR di inizio si apre dopo la conferma dell'appuntamento. Se il cliente non può inquadrarlo, puoi chiudere l'intervento senza il QR: il cliente riceve la richiesta di conferma.",
  },
  {
    q: "Come funzionano le notifiche e le richieste di notte?",
    a: "Ti avvisiamo delle nuove richieste, dei messaggi dei clienti e degli appuntamenti, e ti mandiamo promemoria e riepiloghi: la tua giornata al mattino, quella di domani la sera. Di notte, dalle 22 alle 8, non ti mandiamo promemoria né riepiloghi. L'avviso di una nuova richiesta aspetta le 8, ma la richiesta la trovi subito nell'elenco. Se la vuoi subito anche di notte, attiva «Ricevi richieste anche di notte» nelle notifiche. Gli appuntamenti non aspettano.",
  },
  {
    q: "Posso mettermi in pausa?",
    a: "Sì. In «Ferie e pause» scegli il periodo: finché sei in pausa non ricevi richieste nuove e i clienti non possono prenotarti.",
  },
  {
    q: "Posso annullare o spostare un appuntamento?",
    a: "Sì, finché è confermato. Puoi annullarlo fino a 24 ore prima e spostarlo fino a 4 ore lavorative prima, dalle 8 alle 18. Dopo questi limiti ci si accorda in chat con il cliente.",
  },
  {
    q: "Come funzionano le recensioni?",
    a: "I clienti possono recensirti solo dopo un intervento completato, con da 1 a 5 stelle. Le recensioni compaiono sul tuo profilo e le ritrovi nello Storico.",
  },
  {
    q: "Posso usare Pluggers anche come cliente?",
    a: "Sì, con lo stesso account. Nelle impostazioni tocchi «Passa al profilo cliente».",
  },
];

const PRIVACY: FaqItem[] = [
  {
    q: "Come elimino l'account o scarico i miei dati?",
    a: "Dall'app, in Impostazioni, Account e privacy: lì elimini l'account e scarichi una copia dei tuoi dati. Vale per clienti e professionisti. Se non riesci ad accedere, scrivi a supporto@plggrs.it dall'email con cui ti sei registrato.",
    link: { href: "/elimina-account", label: "Cosa viene cancellato e cosa si conserva" },
  },
  {
    q: "Quali dati vede l'altra persona?",
    a: "Del cliente il professionista vede il nome con l'iniziale del cognome e la scheda del problema. Del professionista il cliente vede il nome con l'iniziale del cognome, i mestieri, la città, la disponibilità e le recensioni. Il documento d'identità del professionista non viene mai mostrato ai clienti.",
  },
  {
    q: "Cosa fa l'intelligenza artificiale con i miei dati?",
    a: "Analizza la descrizione e la foto per capire il problema. Testo e foto sono elaborati nell'Unione Europea, non li usiamo per addestrare modelli e la foto viene cancellata dopo l'analisi. L'intelligenza artificiale può sbagliare: il professionista verifica sul posto.",
    link: { href: "/privacy", label: "Informativa sulla privacy" },
  },
];

/** The groups of the page, in order. The first one is the home's FAQ, which follows the pre-launch switch. */
export function faqGroups(inStores: boolean): FaqGroup[] {
  return [
    {
      id: "per-cominciare",
      title: "Per cominciare",
      lede: "Cos'è Pluggers, dove funziona e come si prende l'app.",
      items: homeFaq(inStores),
    },
    {
      id: "clienti",
      title: "Per chi cerca un professionista",
      lede: "Dalla richiesta alla recensione.",
      items: CLIENT,
    },
    {
      id: "professionisti",
      title: "Per i professionisti",
      lede: "Dall'iscrizione al gestionale.",
      items: PRO,
    },
    {
      id: "account-e-privacy",
      title: "Account e privacy",
      lede: "Per tutti.",
      items: PRIVACY,
    },
  ];
}

export const faqAll = (inStores: boolean): FaqItem[] => faqGroups(inStores).flatMap((g) => [...g.items]);
