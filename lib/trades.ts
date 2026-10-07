/**
 * Turin trade pages. Labels and groups follow the backend catalogue
 * (`mestieri.etichetta` / `gruppo`, supabase/migrations/20260920000000_baseline_mestieri.sql);
 * only the trades with a photo in public/mestieri get a page for now.
 *
 * Product facts used in the copy, all checked in the app and backend code:
 * one photo per request; the assistant asks one question at a time and gives
 * trade, urgency 1–5 and probable causes, and may be wrong; at urgency 5 for
 * gas, sparks, burning smell, smoke or water on electrics it shows safety
 * instructions, and the app always offers "Chiama il 112"; professionals pick a
 * radius of 1–100 km and are listed nearest first; up to three per request, the
 * first to confirm gets the job; the customer picks the day, the professional
 * proposes the time; the professional may ask a Costo Chiamata, shown before the
 * visit, accepted or refused by the customer, paid to them, deducted if the job
 * goes ahead; before the visit it is a "stima", the "preventivo" counts only if
 * accepted; the professional shows a QR the customer scans at start and end;
 * reviews only after a completed job; no payment in the app.
 */

export const TRADES_UPDATED = "2026-10-07";

export type TradeGroup = "impianti" | "aperture" | "edilizia" | "arredo" | "esterni";

export const TRADE_GROUPS: { id: TradeGroup; label: string }[] = [
  { id: "impianti", label: "Impianti" },
  { id: "aperture", label: "Aperture e chiusure" },
  { id: "edilizia", label: "Edilizia e finiture" },
  { id: "arredo", label: "Legno e arredo" },
  { id: "esterni", label: "Esterni" },
];

export type Trade = {
  slug: string;
  label: string;
  group: TradeGroup;
  /** In-sentence form: "Quando serve un idraulico". */
  who: string;
  photo: string;
  photoAlt: string;
  /** Meta description, 140–160 characters. */
  description: string;
  /** One line for the /torino cards. */
  summary: string;
  /** Opening answer, 40–80 words, readable on its own. */
  intro: string;
  problemsLede: string;
  /** Said the way a customer says it. */
  problems: string[];
  steps: { title: string; text: string }[];
  emergency: string;
  faq: { q: string; a: string }[];
};

export const TRADES: Trade[] = [
  {
    slug: "idraulico",
    label: "Idraulico",
    group: "impianti",
    who: "un idraulico",
    photo: "/mestieri/plumber.jpg",
    photoAlt: "Lavabo bianco con rubinetto cromato in un bagno luminoso",
    description:
      "Perdite, scarichi intasati, WC che non smette di scaricare: descrivi il problema su Pluggers e scegli tra gli idraulici che lavorano nella tua zona di Torino.",
    summary: "Perdite, scarichi intasati, rubinetti, WC e sanitari.",
    intro:
      "Su Pluggers trovi un idraulico a Torino partendo dal problema: scrivi cosa succede, aggiungi una foto e l'assistente capisce se serve davvero un idraulico, quanto è urgente e quali sono le cause più probabili. Poi scegli a chi mandare la richiesta tra gli idraulici che lavorano nella tua zona. Usare Pluggers è gratis; l'idraulico lo paghi direttamente.",
    problemsLede: "Sono i problemi che arrivano più spesso a un idraulico, detti come li direbbe chiunque.",
    problems: [
      "Il rubinetto della cucina perde dalla base quando lo apro",
      "L'acqua del lavandino scende lentissima e fa cattivo odore",
      "Lo sciacquone continua a scaricare e non si ferma",
      "C'è una macchia bagnata sotto il lavello e il mobile si è gonfiato",
      "Il WC è otturato e lo sturalavandini non basta",
      "Devo collegare la lavastoviglie nuova e non so da dove passare",
    ],
    steps: [
      {
        title: "Fotografa il punto esatto",
        text: "Una foto sotto il lavello, dietro il WC o sul raccordo che gocciola dice più di molte parole. L'assistente ti fa qualche domanda, una alla volta, per capire se è una guarnizione, un flessibile o uno scarico.",
      },
      {
        title: "Scegli tra gli idraulici vicini",
        text: "Vedi gli idraulici il cui raggio d'azione comprende il tuo indirizzo, dal più vicino. Puoi mandare la richiesta fino a tre: l'intervento va al primo che conferma.",
      },
      {
        title: "Sai quanto costa prima che arrivi",
        text: "In chat ricevi una stima. Se l'idraulico chiede un Costo Chiamata per venire, lo vedi prima della visita e decidi se accettarlo; lo paghi a lui, e se fai il lavoro si scala dal totale.",
      },
      {
        title: "Inizio e fine con un QR",
        text: "Tu scegli il giorno, l'idraulico propone l'orario. Quando arriva ti mostra un QR da inquadrare per segnare l'inizio, e un altro alla fine. Poi puoi lasciare la recensione.",
      },
    ],
    emergency:
      "Se l'acqua esce forte e non si ferma, chiudi il rubinetto generale. Se arriva a prese, ciabatte o al quadro elettrico, non toccare niente di bagnato: stacca l'interruttore generale solo se puoi farlo restando all'asciutto. Se l'acqua raggiunge parti elettriche e non riesci a metterti in sicurezza, o il soffitto si gonfia e rischia di cedere, chiama il 112.",
    faq: [
      {
        q: "Come trovo un idraulico a Torino in fretta?",
        a: "Apri Pluggers, descrivi la perdita o lo scarico con una foto e l'assistente ti indica l'urgenza e gli idraulici che lavorano nella tua zona. Mandi la richiesta fino a tre e l'intervento va al primo che conferma. L'orario lo propone l'idraulico in base alla sua disponibilità.",
      },
      {
        q: "Quanto costa la chiamata di un idraulico con Pluggers?",
        a: "Il Costo Chiamata, se c'è, lo decide l'idraulico e lo vedi nell'app prima della visita: puoi accettarlo o rifiutarlo, e lo paghi a lui. Il lavoro è a parte: prima ricevi una stima, poi il preventivo, che vale solo se lo accetti.",
      },
      {
        q: "Cosa faccio mentre aspetto l'idraulico?",
        a: "Chiudi il rubinetto sotto il lavello o il rubinetto generale, asciuga e metti un secchio sotto la perdita. Non usare lo scarico intasato e non versare prodotti chimici: rendono il lavoro più rischioso per chi deve aprire il sifone.",
      },
      {
        q: "Per la caldaia o lo scaldabagno chiamo un idraulico?",
        a: "Per caldaie, scaldabagni, termosifoni e impianto del gas su Pluggers c'è il termoidraulico. Se descrivi un problema di questo tipo, l'assistente indica quel mestiere al posto dell'idraulico.",
      },
    ],
  },
  {
    slug: "elettricista",
    label: "Elettricista",
    group: "impianti",
    who: "un elettricista",
    photo: "/mestieri/electrician.jpg",
    photoAlt: "Interruttore bianco su una parete chiara illuminata dal sole",
    description:
      "Salta il salvavita, una presa non va, serve un punto luce: descrivi il guasto su Pluggers e scegli tra gli elettricisti che lavorano nella tua zona di Torino.",
    summary: "Salvavita che scatta, prese, luci, quadro elettrico, citofono.",
    intro:
      "Con Pluggers trovi un elettricista a Torino descrivendo il guasto come lo vedi: il salvavita che scatta, una presa annerita, una luce da aggiungere. L'assistente capisce se è un lavoro da elettricista e quanto è urgente; se ci sono scintille, fumo o odore di bruciato ti dice subito cosa fare per metterti in sicurezza. Poi scegli tra gli elettricisti della tua zona.",
    problemsLede: "Quasi sempre il problema si riconosce da quello che succede in casa, senza sapere niente di impianti.",
    problems: [
      "Salta il salvavita ogni volta che accendo il forno",
      "Una presa in cucina non dà corrente e intorno è annerita",
      "Metà casa è senza luce ma il contatore è a posto",
      "Vorrei un punto luce nuovo sopra il tavolo",
      "Il citofono suona ma non sento chi parla",
      "L'interruttore della camera scalda e fa un ronzio",
    ],
    steps: [
      {
        title: "Racconta quando succede",
        text: "Scrivi cosa stavi accendendo quando è saltata la corrente e fotografa il quadro o la presa. L'assistente ti chiede quello che serve, per esempio se scatta il salvavita o un altro interruttore.",
      },
      {
        title: "Prima la sicurezza",
        text: "Se descrivi scintille, fumo, odore di bruciato o acqua su parti elettriche, l'urgenza va al massimo e Pluggers ti dice di staccare il generale e di non riattaccare niente prima che arrivi l'elettricista.",
      },
      {
        title: "Scegli e confronta la stima",
        text: "Scegli fino a tre elettricisti tra quelli che lavorano vicino a te. La stima arriva in chat; l'eventuale Costo Chiamata lo vedi prima della visita e lo paghi a lui.",
      },
      {
        title: "Preventivo dopo il controllo",
        text: "Un guasto elettrico spesso si capisce solo misurando. Se dopo il controllo il lavoro è diverso, l'elettricista ti manda un nuovo preventivo, che vale solo se lo accetti. Inizio e fine si segnano con un QR.",
      },
    ],
    emergency:
      "Chiama il 112 se c'è fumo o fiamme da una presa, dal quadro o da un apparecchio, o se qualcuno ha preso la scossa: non toccarlo finché la corrente non è staccata. Su un principio d'incendio elettrico non usare acqua. Per odore di bruciato o scintille senza fiamme, stacca l'interruttore generale se puoi farlo in sicurezza e aspetta l'elettricista senza riattaccare.",
    faq: [
      {
        q: "Mi salta il salvavita di continuo: chi chiamo a Torino?",
        a: "Ti serve un elettricista. Su Pluggers descrivi quando scatta e cosa era acceso: l'assistente lo riconosce e ti mostra gli elettricisti della tua zona. Intanto puoi staccare le spine degli elettrodomestici e riattaccarle una alla volta: spesso così si trova il colpevole.",
      },
      {
        q: "Quanto costa far venire un elettricista con Pluggers?",
        a: "Pluggers non fissa prezzi: la stima te la manda l'elettricista in chat e il Costo Chiamata, se lo chiede, lo vedi prima della visita. Si paga direttamente a lui, non nell'app. Se fai il lavoro, il Costo Chiamata si scala dal totale.",
      },
      {
        q: "Un elettricista su Pluggers installa anche lampadari e punti luce?",
        a: "Sì. Tra i lavori dell'elettricista ci sono punti luce, lampadari e plafoniere, faretti e LED, prese, interruttori, dimmer, quadro elettrico, messa a terra, citofono e campanello.",
      },
      {
        q: "Per l'antenna o il segnale della TV serve un elettricista?",
        a: "La presa TV a muro è un lavoro da elettricista; antenne, parabole e segnale TV sono dell'antennista. Descrivi il problema e l'assistente indica il mestiere giusto.",
      },
    ],
  },
  {
    slug: "fabbro",
    label: "Fabbro",
    group: "aperture",
    who: "un fabbro",
    photo: "/mestieri/locksmith.jpg",
    photoAlt: "Maniglia di una porta su una parete chiara",
    description:
      "Chiuso fuori, serratura bloccata, chiavi perse o cancello da sistemare: descrivi il problema su Pluggers e scegli tra i fabbri della tua zona di Torino.",
    summary: "Porte chiuse, serrature, cilindri, chiavi, cancelli e inferriate.",
    intro:
      "Su Pluggers trovi un fabbro a Torino scrivendo cosa è successo alla porta, alla serratura o al cancello. L'assistente riconosce che serve un fabbro e quanto è urgente: restare chiusi fuori casa ha un'urgenza diversa da una maniglia da cambiare. Scegli fino a tre fabbri tra quelli che lavorano nella tua zona e l'intervento va al primo che conferma.",
    problemsLede: "Ecco come arrivano di solito le richieste per un fabbro.",
    problems: [
      "Sono chiuso fuori e le chiavi sono rimaste dentro",
      "La chiave gira a vuoto e la porta non si apre",
      "Ho perso le chiavi e voglio cambiare il cilindro",
      "La serratura della porta blindata si è bloccata",
      "Il cancello del cortile non si chiude più",
      "La maniglia della porta di casa è rimasta in mano",
    ],
    steps: [
      {
        title: "Di' com'è la porta",
        text: "Scrivi se è blindata, se la chiave entra ma non gira o se è rimasta dentro, e fotografa la serratura. L'assistente ti fa poche domande per capire il tipo di intervento.",
      },
      {
        title: "L'urgenza la vede anche il fabbro",
        text: "Se la richiesta è urgente, i fabbri la ricevono con l'indicazione «Urgente». Tu scegli fino a tre fabbri vicini e lavora chi conferma per primo.",
      },
      {
        title: "Apertura e serratura nuova sono cose diverse",
        text: "Nella stima il fabbro ti dice cosa propone: aprire la porta, sostituire il cilindro o la serratura. L'eventuale Costo Chiamata lo vedi prima della visita e lo paghi a lui.",
      },
      {
        title: "Arrivo registrato con un QR",
        text: "Quando arriva, il fabbro ti mostra un QR: inquadrandolo registri l'inizio dell'intervento, e alla fine fai lo stesso. Dopo puoi recensirlo.",
      },
    ],
    emergency:
      "Chiama il 112 se dentro casa è rimasto un bambino piccolo o una persona che non può aprire, se hai lasciato un fornello acceso o se senti odore di gas: in questi casi intervengono i soccorsi. Se trovi la serratura forzata o segni di effrazione, non entrare e non toccare niente: chiama il 112 prima del fabbro.",
    faq: [
      {
        q: "Sono rimasto chiuso fuori casa a Torino: come trovo un fabbro?",
        a: "Apri Pluggers dal telefono, scrivi che sei chiuso fuori e fotografa la porta. L'assistente segna la richiesta come urgente e ti mostra i fabbri che lavorano vicino a te; l'orario di arrivo lo concordi con chi conferma.",
      },
      {
        q: "Quanto costa aprire una porta con un fabbro di Pluggers?",
        a: "Dipende dalla porta e dalla serratura, quindi la cifra te la dà il fabbro: prima con una stima in chat, poi con il preventivo, che vale solo se lo accetti. Se chiede un Costo Chiamata, lo vedi prima della visita e lo paghi a lui.",
      },
      {
        q: "Ho perso le chiavi: devo cambiare tutta la serratura?",
        a: "Non sempre. Su molte porte basta sostituire il cilindro, che è la parte dove entra la chiave. Scrivilo nella richiesta e allega una foto della serratura: il fabbro ti dice nella stima cosa serve.",
      },
      {
        q: "Il fabbro ripara anche cancelli e inferriate?",
        a: "Sì: cancelli, inferriate e grate, chiudiporta, maniglie e duplicati di chiavi sono lavori da fabbro su Pluggers. Per serrande e tapparelle invece c'è il serramentista.",
      },
    ],
  },
  {
    slug: "tecnico-elettrodomestici",
    label: "Tecnico elettrodomestici",
    group: "impianti",
    who: "un tecnico degli elettrodomestici",
    photo: "/mestieri/appliance-technician.jpg",
    photoAlt: "Lavatrice bianca in una stanza luminosa",
    description:
      "Lavatrice che non scarica, frigo che non raffredda, forno spento: descrivi il guasto su Pluggers e scegli tra i tecnici della tua zona di Torino.",
    summary: "Lavatrici, lavastoviglie, frigoriferi, forni, piani cottura e cappe.",
    intro:
      "Su Pluggers trovi un tecnico degli elettrodomestici a Torino descrivendo il guasto: la lavatrice che si ferma con l'acqua dentro, il frigo che non raffredda, il forno che non scalda. L'assistente capisce di che si tratta e ti mostra i tecnici che lavorano nella tua zona. Con la stima in chat sai quanto può costare la riparazione prima di decidere se ripararlo.",
    problemsLede: "Un elettrodomestico guasto si descrive bene da quello che fa, o che smette di fare.",
    problems: [
      "La lavatrice si ferma a metà con l'acqua dentro",
      "Il frigo fa rumore ma dentro è tiepido",
      "La lavastoviglie lascia i piatti sporchi e l'acqua sul fondo",
      "Il forno si accende ma non scalda",
      "Sul display della lavatrice compare un codice di errore",
      "La cappa aspira poco e fa un rumore forte",
    ],
    steps: [
      {
        title: "Marca, modello e codice d'errore",
        text: "Scrivi cosa fa l'apparecchio e, se c'è, il codice sul display. Fotografa la targhetta con marca e modello: di solito è dentro lo sportello o sul retro.",
      },
      {
        title: "Tecnici della tua zona",
        text: "L'assistente indica il mestiere e l'urgenza, poi vedi i tecnici il cui raggio d'azione arriva a casa tua. Puoi scriverne fino a tre.",
      },
      {
        title: "Riparare o cambiare?",
        text: "La stima arriva in chat prima della visita, così hai un'idea della spesa. Il preventivo vero il tecnico lo fa dopo aver visto il guasto, e vale solo se lo accetti.",
      },
      {
        title: "Visita, QR e recensione",
        text: "Scegli il giorno e il tecnico propone l'orario. L'eventuale Costo Chiamata lo conosci prima e lo paghi a lui; inizio e fine si registrano con il QR che ti mostra.",
      },
    ],
    emergency:
      "Se un elettrodomestico fa fumo, scintille o fiamme, stacca la spina o l'interruttore generale solo se puoi farlo senza rischi e chiama il 112. Se senti odore di gas vicino al piano cottura, chiudi il rubinetto del gas, apri le finestre, non accendere luci né elettrodomestici, esci e chiama da fuori il pronto intervento gas (a Torino 800 900 999) o il 112.",
    faq: [
      {
        q: "La lavatrice non scarica l'acqua: chi chiamo a Torino?",
        a: "Un tecnico degli elettrodomestici. Su Pluggers descrivi il problema e, se puoi, scrivi il codice di errore: l'assistente riconosce il guasto probabile e ti mostra i tecnici vicini. Intanto controlla il filtro in basso sul davanti, spesso è lì che si blocca.",
      },
      {
        q: "Conviene riparare un elettrodomestico o comprarne uno nuovo?",
        a: "Dipende dal guasto e dal costo del ricambio. Con Pluggers ricevi una stima in chat prima della visita e poi il preventivo dopo il controllo: con quei numeri puoi decidere se riparare o cambiare.",
      },
      {
        q: "Quanto costa far venire un tecnico per la lavatrice o il frigo?",
        a: "L'importo lo decide il tecnico: la stima arriva in chat e il Costo Chiamata, se lo chiede, lo vedi prima della visita. Si paga a lui, non nell'app, e se fai la riparazione il Costo Chiamata si scala dal totale.",
      },
      {
        q: "Il tecnico ripara anche il piano cottura a gas?",
        a: "Sì, il piano cottura è tra gli apparecchi del tecnico degli elettrodomestici. Se il problema è nel tubo o nell'allaccio del gas, invece, serve un termoidraulico: l'assistente te lo indica.",
      },
    ],
  },
  {
    slug: "imbianchino",
    label: "Imbianchino",
    group: "edilizia",
    who: "un imbianchino",
    photo: "/mestieri/painter.jpg",
    photoAlt: "Rullo da pittura appoggiato sul pavimento di una stanza vuota",
    description:
      "Una stanza da ridipingere, muffa sul soffitto, pareti da ritoccare: descrivi il lavoro su Pluggers e chiedi una stima agli imbianchini della tua zona di Torino.",
    summary: "Tinteggiature, ritocchi, pareti da preparare, trattamenti antimuffa.",
    intro:
      "Su Pluggers trovi un imbianchino a Torino descrivendo cosa vuoi dipingere: una stanza, un soffitto con la muffa, le pareti da sistemare dopo un trasloco. Indica le stanze, le misure se le hai e una foto delle pareti; chiedi la stima fino a tre imbianchini della tua zona. Il preventivo arriva dopo il sopralluogo e vale solo se lo accetti.",
    problemsLede: "Le richieste per un imbianchino partono quasi sempre da una stanza e da come sono le pareti.",
    problems: [
      "Vorrei ridipingere il soggiorno prima di Natale",
      "Sul soffitto del bagno torna sempre la muffa nera",
      "Dopo il trasloco le pareti sono piene di buchi e segni",
      "In camera c'è una macchia gialla dove c'era un'infiltrazione",
      "Voglio cambiare colore a una parete sola",
      "La pittura del corridoio si sfoglia vicino al pavimento",
    ],
    steps: [
      {
        title: "Stanze, misure e foto",
        text: "Scrivi quali stanze, quanti metri se li sai, e fotografa le pareti con la luce del giorno. L'assistente conferma che è un lavoro da imbianchino e non, per esempio, un'infiltrazione da risolvere prima.",
      },
      {
        title: "Fino a tre imbianchini vicini",
        text: "Vedi gli imbianchini che lavorano nella tua zona e mandi la richiesta a chi vuoi, fino a tre. Lavora chi conferma per primo.",
      },
      {
        title: "Stima, sopralluogo, preventivo",
        text: "La stima arriva in chat ed è indicativa. Se l'imbianchino chiede un Costo Chiamata per il sopralluogo, lo vedi prima e lo paghi a lui; dopo aver visto le pareti ti manda il preventivo.",
      },
      {
        title: "Lavoro registrato",
        text: "Tu scegli il giorno, lui propone l'orario. Inizio e fine del lavoro si registrano con il QR che ti mostra, e dopo puoi lasciare la recensione.",
      },
    ],
    emergency:
      "Imbiancare non è mai un'emergenza, ma quello che si vede sulle pareti a volte sì. Se una macchia d'acqua sul soffitto si allarga in fretta, l'intonaco si gonfia o gocciola, o una crepa si apre a vista d'occhio, esci dalla stanza e chiama il 112: prima della pittura va messa in sicurezza la casa e trovata la causa.",
    faq: [
      {
        q: "Come trovo un imbianchino a Torino per una stanza sola?",
        a: "Su Pluggers descrivi la stanza, aggiungi una foto e, se le hai, le misure. Ti vengono mostrati gli imbianchini che lavorano nella tua zona e puoi chiedere la stima a tre di loro. Anche i lavori piccoli, come un ritocco, si chiedono così.",
      },
      {
        q: "Quanto costa imbiancare una stanza con Pluggers?",
        a: "Dipende da metri, stato delle pareti e pittura, quindi Pluggers non dà prezzi: l'imbianchino ti manda una stima in chat e, dopo il sopralluogo, il preventivo. Paghi direttamente lui, non nell'app.",
      },
      {
        q: "Ho la muffa sul soffitto: basta ridipingere?",
        a: "No, se non si toglie la causa la muffa torna. L'imbianchino può fare il trattamento antimuffa e ridipingere, ma se la causa è un'infiltrazione o una perdita serve prima un muratore o un idraulico: descrivilo e l'assistente indica chi.",
      },
      {
        q: "Devo spostare i mobili prima che arrivi l'imbianchino?",
        a: "Scrivilo nella richiesta: la protezione di pavimenti e mobili è una voce del lavoro che l'imbianchino può includere nella stima. Liberare le pareti e i soprammobili ti fa comunque risparmiare tempo.",
      },
    ],
  },
  {
    slug: "falegname",
    label: "Falegname",
    group: "arredo",
    who: "un falegname",
    photo: "/mestieri/carpenter.jpg",
    photoAlt: "Mensola in legno chiaro fissata a una parete bianca",
    description:
      "Un mobile da riparare, un'anta che non chiude, una libreria su misura: descrivi il lavoro su Pluggers e scegli tra i falegnami della tua zona di Torino.",
    summary: "Mobili e strutture in legno da costruire o riparare.",
    intro:
      "Su Pluggers trovi un falegname a Torino per riparare o costruire mobili e strutture in legno: un'anta che non chiude, un cassetto rotto, una libreria su misura. Descrivi il lavoro con una foto e le misure, e scegli fino a tre falegnami che lavorano nella tua zona. Il falegname ti manda la stima in chat; il preventivo arriva dopo che ha visto il lavoro.",
    problemsLede: "Per il falegname contano soprattutto le misure e cosa deve fare il mobile.",
    problems: [
      "L'anta dell'armadio è scesa e non chiude più",
      "Il cassetto della cucina si è staccato dalla guida",
      "Vorrei una libreria su misura nella nicchia del corridoio",
      "La porta di legno della camera striscia sul pavimento",
      "La gamba del tavolo si è crepata",
      "Mi serve un piano in legno sopra la lavatrice",
    ],
    steps: [
      {
        title: "Misure prima di tutto",
        text: "Per un lavoro su misura scrivi larghezza, altezza e profondità e fotografa lo spazio con un metro aperto. Per una riparazione basta una foto del punto rotto.",
      },
      {
        title: "Falegnami della tua zona",
        text: "L'assistente indica il mestiere e ti mostra i falegnami il cui raggio d'azione comprende il tuo indirizzo. Mandi la richiesta fino a tre.",
      },
      {
        title: "Stima e poi preventivo",
        text: "La stima in chat ti dà un ordine di grandezza; per legno, ferramenta e finiture il falegname ti fa il preventivo dopo aver visto il lavoro, e vale solo se lo accetti.",
      },
      {
        title: "Visita con check-in",
        text: "L'eventuale Costo Chiamata lo vedi prima della visita e lo paghi a lui. All'arrivo e alla fine registrate l'intervento con un QR.",
      },
    ],
    emergency:
      "Un lavoro da falegname raramente è urgente. Se però una struttura in legno che regge peso, come un soppalco, una scala o una mensola carica, scricchiola, si piega o si crepa, svuotala e non salirci. Se è caduta su qualcuno o rischia di crollare su un passaggio, chiama il 112.",
    faq: [
      {
        q: "Come trovo un falegname a Torino per una riparazione piccola?",
        a: "Su Pluggers descrivi la riparazione, come un'anta storta o un cassetto staccato, e allega una foto. Vedi i falegnami che lavorano nella tua zona e scegli a chi scrivere; i lavori piccoli si chiedono come quelli grandi.",
      },
      {
        q: "Un falegname di Pluggers costruisce mobili su misura?",
        a: "Sì, il falegname si occupa di mobili e strutture in legno da costruire o riparare. Per un mobile su misura scrivi le misure dello spazio e cosa deve contenere: il falegname ti risponde con una stima e poi con il preventivo.",
      },
      {
        q: "Quanto costa un falegname con Pluggers?",
        a: "Il prezzo lo fa il falegname in base a legno, misure e tempo: ricevi una stima in chat e, dopo il sopralluogo, il preventivo. Il Costo Chiamata, se lo chiede, lo vedi prima e lo paghi a lui.",
      },
      {
        q: "Per montare un mobile comprato in negozio serve un falegname?",
        a: "Per montare mobili già pronti su Pluggers c'è il montatore di mobili. Il falegname serve quando il legno va lavorato, riparato o costruito.",
      },
    ],
  },
  {
    slug: "tecnico-climatizzazione",
    label: "Tecnico climatizzazione",
    group: "impianti",
    who: "un tecnico della climatizzazione",
    photo: "/mestieri/hvac-technician.jpg",
    photoAlt: "Condizionatore split bianco montato su una parete",
    description:
      "Condizionatore che non raffredda, split che gocciola, pompa di calore da controllare: descrivi il problema su Pluggers e scegli un tecnico vicino a te a Torino.",
    summary: "Condizionatori, split, pompe di calore e ventilazione.",
    intro:
      "Su Pluggers trovi un tecnico della climatizzazione a Torino per condizionatori, split, pompe di calore e ventilazione. Scrivi cosa fa l'impianto, per esempio se non raffredda, gocciola o fa rumore, e fotografa l'unità interna e la targhetta. L'assistente indica il mestiere e l'urgenza, poi scegli tra i tecnici che lavorano nella tua zona e ricevi la stima in chat.",
    problemsLede: "Le richieste per la climatizzazione arrivano quasi tutte all'inizio dell'estate o dell'inverno.",
    problems: [
      "Il condizionatore va ma esce aria calda",
      "Dallo split in camera gocciola acqua sul muro",
      "L'unità esterna fa un rumore che prima non faceva",
      "Vorrei installare un condizionatore in soggiorno",
      "La pompa di calore va in blocco con il freddo",
      "Il telecomando funziona ma lo split non parte",
    ],
    steps: [
      {
        title: "Fotografa unità e targhetta",
        text: "Una foto dell'unità interna, una di quella esterna e la targhetta con marca e modello aiutano a capire il problema. L'assistente ti chiede da quanto succede e cosa hai già provato.",
      },
      {
        title: "Tecnici nel tuo raggio",
        text: "Vedi i tecnici della climatizzazione che lavorano vicino a te, dal più vicino. Puoi scrivere fino a tre: lavora chi conferma per primo.",
      },
      {
        title: "Gas refrigerante e certificazione",
        text: "Ricariche e installazioni toccano il gas refrigerante, che può maneggiare solo personale certificato. Se devi ricaricare o installare, chiedi in chat che il tecnico abbia la certificazione per i gas fluorurati.",
      },
      {
        title: "Visita e QR",
        text: "Scegli il giorno e il tecnico propone l'orario. L'eventuale Costo Chiamata lo vedi prima e lo paghi a lui; l'intervento si apre e si chiude con un QR.",
      },
    ],
    emergency:
      "Se dal condizionatore escono fumo, scintille o odore di bruciato, spegnilo dall'interruttore e non riaccenderlo; se c'è fumo o fiamme chiama il 112. Durante un'ondata di calore, se qualcuno in casa ha capogiri, confusione o sta male, non aspettare il tecnico: chiama il 112.",
    faq: [
      {
        q: "Il condizionatore non raffredda: chi chiamo a Torino?",
        a: "Un tecnico della climatizzazione. Su Pluggers descrivi cosa fa l'impianto e aggiungi la foto dello split: l'assistente lo riconosce e ti mostra i tecnici vicini. Prima controlla che i filtri dell'unità interna siano puliti, sono la causa più semplice.",
      },
      {
        q: "Quanto costa la manutenzione del condizionatore con Pluggers?",
        a: "Il prezzo lo indica il tecnico: ricevi la stima in chat e, se chiede un Costo Chiamata, lo vedi prima della visita. Paghi direttamente lui, non nell'app.",
      },
      {
        q: "Posso far installare un condizionatore nuovo?",
        a: "Sì, puoi chiederlo descrivendo la stanza, dove vorresti l'unità esterna e se l'impianto elettrico è già predisposto. Il tecnico ti risponde con una stima e, dopo il sopralluogo, con il preventivo.",
      },
      {
        q: "Lo split gocciola dentro casa: è grave?",
        a: "Di solito è lo scarico della condensa intasato o un'unità montata storta, non un guasto grave. Metti un panno sotto, spegni l'impianto se l'acqua arriva a prese o mobili e descrivi il problema su Pluggers.",
      },
    ],
  },
  {
    slug: "termoidraulico",
    label: "Termoidraulico",
    group: "impianti",
    who: "un termoidraulico",
    photo: "/mestieri/heating-technician.jpg",
    photoAlt: "Caldaia murale bianca in un locale luminoso",
    description:
      "Caldaia in blocco, niente acqua calda, termosifoni freddi: descrivi il problema su Pluggers e scegli tra i termoidraulici che lavorano nella tua zona di Torino.",
    summary: "Caldaie, scaldabagni, riscaldamento, termosifoni e impianto del gas.",
    intro:
      "Su Pluggers trovi un termoidraulico a Torino per caldaie, scaldabagni, riscaldamento, termosifoni e impianto del gas. Descrivi cosa succede, per esempio la caldaia in blocco o l'acqua che non scalda, e fotografa il display. Se descrivi odore di gas, l'assistente ti dice subito cosa fare per metterti in sicurezza; poi scegli tra i termoidraulici della tua zona.",
    problemsLede: "Una caldaia o un termosifone che non va si fa notare subito, soprattutto d'inverno.",
    problems: [
      "La caldaia va in blocco e sul display c'è un codice",
      "Dalla doccia esce solo acqua fredda",
      "I termosifoni sono caldi sopra e freddi sotto",
      "La pressione della caldaia scende sempre",
      "Lo scaldabagno elettrico perde acqua dal fondo",
      "Sento un leggero odore di gas in cucina",
    ],
    steps: [
      {
        title: "Codice sul display e libretto",
        text: "Scrivi il codice di errore della caldaia e fotografa il display e la targhetta. Se ce l'hai, tieni a portata di mano il libretto di impianto: al termoidraulico serve.",
      },
      {
        title: "Se c'è odore di gas",
        text: "Pluggers alza l'urgenza al massimo e ti dice di aprire le finestre, chiudere il gas al contatore, non toccare interruttori e chiamare da fuori il pronto intervento gas.",
      },
      {
        title: "Scegli il termoidraulico",
        text: "Vedi i termoidraulici che lavorano nella tua zona, dal più vicino, e mandi la richiesta fino a tre. La stima arriva in chat e l'eventuale Costo Chiamata lo vedi prima della visita.",
      },
      {
        title: "Intervento registrato",
        text: "Tu scegli il giorno, il termoidraulico propone l'orario. Inizio e fine si segnano con il QR che ti mostra; il preventivo vale solo se lo accetti.",
      },
    ],
    emergency:
      "Se senti odore di gas apri porte e finestre, chiudi il rubinetto del gas al contatore, non accendere né spegnere luci, esci e chiama da fuori il pronto intervento gas (a Torino 800 900 999) o il 112. Se più persone in casa hanno mal di testa, nausea o sonnolenza mentre la caldaia è accesa, può essere monossido: fai entrare aria, esci e chiama il 112.",
    faq: [
      {
        q: "La caldaia è in blocco: come trovo un tecnico a Torino?",
        a: "Su Pluggers scrivi il codice che vedi sul display e fotografalo: l'assistente indica un termoidraulico e ti mostra quelli che lavorano nella tua zona. Puoi provare una volta il tasto di sblocco; se la caldaia torna in blocco, lascia stare.",
      },
      {
        q: "Quanto costa far venire un termoidraulico con Pluggers?",
        a: "L'importo lo decide il termoidraulico: la stima arriva in chat, il Costo Chiamata se lo chiede lo vedi prima della visita. Paghi direttamente lui, e se fai il lavoro il Costo Chiamata si scala dal totale.",
      },
      {
        q: "Che differenza c'è tra idraulico e termoidraulico su Pluggers?",
        a: "L'idraulico si occupa di acqua, rubinetti, scarichi e sanitari; il termoidraulico di caldaie, scaldabagni, riscaldamento, termosifoni e impianto del gas. Non devi sceglierlo tu: lo indica l'assistente dalla tua descrizione.",
      },
      {
        q: "I termosifoni sono freddi sotto: serve un tecnico?",
        a: "Spesso c'è aria nell'impianto e basta sfiatarli con la valvolina in alto, a caldaia spenta, controllando poi la pressione. Se non migliora o la pressione continua a scendere, descrivi il problema su Pluggers.",
      },
    ],
  },
  {
    slug: "serramentista",
    label: "Serramentista",
    group: "aperture",
    who: "un serramentista",
    photo: "/mestieri/window-fitter.jpg",
    photoAlt: "Telaio bianco di una finestra con la luce del giorno",
    description:
      "Tapparella bloccata, finestra che non chiude, serranda o zanzariera da sistemare: descrivi il problema su Pluggers e scegli un serramentista a Torino.",
    summary: "Finestre, porte-finestre, tapparelle, persiane, serrande e zanzariere.",
    intro:
      "Su Pluggers trovi un serramentista a Torino per finestre, porte-finestre, tapparelle, persiane, serrande e zanzariere. Descrivi cosa non funziona, per esempio la cinghia della tapparella rotta o l'anta che non chiude, e fotografa il punto. L'assistente indica il mestiere, poi scegli fino a tre serramentisti che lavorano nella tua zona e ricevi la stima in chat.",
    problemsLede: "Sono i guasti più comuni di finestre e chiusure, raccontati come succedono.",
    problems: [
      "La cinghia della tapparella si è rotta e la tapparella è giù",
      "La finestra della camera non chiude bene e passa aria",
      "La serranda del garage si è bloccata a metà",
      "Una stecca della persiana si è staccata",
      "Vorrei le zanzariere su tutte le finestre",
      "La maniglia della porta-finestra gira a vuoto",
    ],
    steps: [
      {
        title: "Una foto e le misure",
        text: "Fotografa la tapparella, l'anta o la serranda e, se si tratta di una zanzariera o di un pezzo da sostituire, scrivi le misure del vano. L'assistente ti chiede quello che manca.",
      },
      {
        title: "Serramentisti vicini",
        text: "Vedi i serramentisti il cui raggio d'azione comprende il tuo indirizzo, dal più vicino. Puoi scrivere fino a tre e lavora chi conferma per primo.",
      },
      {
        title: "Stima prima, preventivo dopo",
        text: "Ricevi la stima in chat. Se il serramentista deve prendere le misure sul posto, l'eventuale Costo Chiamata lo vedi prima e lo paghi a lui; il preventivo arriva dopo.",
      },
      {
        title: "Check-in con QR",
        text: "Scegli il giorno, lui propone l'orario. All'inizio e alla fine dell'intervento inquadri il QR che ti mostra, poi puoi lasciare la recensione.",
      },
    ],
    emergency:
      "Chiama il 112 se un'anta, una persiana o il cassonetto di una tapparella si stacca e può cadere in strada, su un balcone o su un cortile dove passa gente: allontana le persone e non sporgerti per trattenerlo. Una tapparella bloccata o una finestra che non chiude non sono emergenze.",
    faq: [
      {
        q: "Come trovo qualcuno per riparare una tapparella a Torino?",
        a: "Su Pluggers descrivi il problema, come la cinghia rotta o la tapparella bloccata, e aggiungi una foto. L'assistente indica il serramentista e ti mostra quelli che lavorano nella tua zona.",
      },
      {
        q: "Quanto costa cambiare la cinghia della tapparella con Pluggers?",
        a: "Il prezzo lo fa il serramentista: ricevi una stima in chat e, se chiede un Costo Chiamata, lo vedi prima della visita. Paghi direttamente lui, non nell'app.",
      },
      {
        q: "Il serramentista ripara anche le serrande dei negozi e dei garage?",
        a: "Sì, serrande e saracinesche sono tra i lavori del serramentista su Pluggers, insieme a tapparelle, persiane e zanzariere. Per serrature e cancelli invece c'è il fabbro.",
      },
      {
        q: "Si possono far misurare le finestre per le zanzariere?",
        a: "Sì. Scrivi quante finestre e di che tipo sono; se non hai le misure, il serramentista le prende durante la visita e poi ti manda il preventivo.",
      },
    ],
  },
  {
    slug: "muratore",
    label: "Muratore",
    group: "edilizia",
    who: "un muratore",
    photo: "/mestieri/mason.jpg",
    photoAlt: "Parete di mattoni a vista accanto a un muro intonacato",
    description:
      "Infiltrazioni, crepe, intonaco che si stacca o una parete da rifare: descrivi il lavoro su Pluggers e chiedi la stima ai muratori della tua zona di Torino.",
    summary: "Muri, intonaci, crepe, infiltrazioni dall'esterno, impermeabilizzazioni.",
    intro:
      "Su Pluggers trovi un muratore a Torino per muri, intonaci, crepe, infiltrazioni dall'esterno e impermeabilizzazioni. Descrivi il problema con una foto, per esempio l'intonaco che si stacca o la macchia di umidità che arriva da fuori. L'assistente indica il mestiere e l'urgenza; poi scegli fino a tre muratori della tua zona e ricevi la stima in chat.",
    problemsLede: "Per un muratore la foto e il punto della casa dicono quasi tutto.",
    problems: [
      "L'intonaco del balcone si sta staccando a pezzi",
      "Quando piove entra umidità dal muro della camera",
      "C'è una crepa sopra la porta che prima non c'era",
      "Vorrei aprire un passaggio tra cucina e soggiorno",
      "Il terrazzo perde acqua nel box sotto",
      "Devo chiudere una traccia nel muro dopo l'elettricista",
    ],
    steps: [
      {
        title: "Dove e da quando",
        text: "Scrivi in che punto della casa è il problema, se peggiora quando piove e da quanto lo vedi. Fotografa da vicino e da lontano, così si capisce anche l'intorno.",
      },
      {
        title: "Muratori della tua zona",
        text: "Vedi i muratori il cui raggio d'azione comprende il tuo indirizzo e mandi la richiesta fino a tre. Lavora chi conferma per primo.",
      },
      {
        title: "Sopralluogo e preventivo",
        text: "La stima in chat è un primo orientamento: per i lavori edili il muratore di solito deve vedere. L'eventuale Costo Chiamata lo vedi prima e lo paghi a lui; il preventivo vale solo se lo accetti.",
      },
      {
        title: "Lavori grandi e pratiche",
        text: "Per demolizioni o aperture nei muri possono servire una pratica edilizia e la verifica di un tecnico: chiedilo al muratore. Inizio e fine dell'intervento si registrano con un QR.",
      },
    ],
    emergency:
      "Esci e chiama il 112 se una crepa si allarga a vista d'occhio, se cadono pezzi di intonaco, di cornicione o di balcone, se senti scricchiolii nei muri o le porte all'improvviso non si chiudono più: possono essere segni di un problema strutturale, e la verifica la fanno i vigili del fuoco.",
    faq: [
      {
        q: "Come trovo un muratore a Torino per un lavoro piccolo?",
        a: "Su Pluggers descrivi il lavoro, anche se è piccolo come chiudere una traccia o sistemare un pezzo di intonaco, e allega una foto. Vedi i muratori che lavorano nella tua zona e scegli a chi scrivere.",
      },
      {
        q: "Quanto costa un muratore con Pluggers?",
        a: "Pluggers non fissa prezzi: il muratore ti manda una stima in chat e, dopo il sopralluogo, il preventivo, che vale solo se lo accetti. Il Costo Chiamata, se lo chiede, lo vedi prima della visita e lo paghi a lui.",
      },
      {
        q: "Ho umidità sul muro: chiamo un muratore o un idraulico?",
        a: "Se l'umidità arriva da fuori, dal terrazzo o dalle pareti esterne, è un lavoro da muratore; se viene da un tubo che perde, da idraulico. Descrivi dove compare e quando peggiora: l'assistente indica il mestiere più probabile.",
      },
      {
        q: "Per abbattere una parete serve un permesso?",
        a: "Spesso sì: aprire o demolire un muro può richiedere una pratica in Comune e la verifica che il muro non sia portante. Chiedilo al muratore quando ti manda la stima.",
      },
    ],
  },
  {
    slug: "piastrellista",
    label: "Piastrellista",
    group: "edilizia",
    who: "un piastrellista",
    photo: "/mestieri/tiler.jpg",
    photoAlt: "Parete rivestita di piastrelle bianche quadrate",
    description:
      "Piastrelle rotte o sollevate, fughe annerite, silicone da rifare in bagno: descrivi il lavoro su Pluggers e scegli un piastrellista della tua zona di Torino.",
    summary: "Piastrelle, fughe e silicone di bagno e cucina.",
    intro:
      "Su Pluggers trovi un piastrellista a Torino per piastrelle e fughe: una piastrella rotta da sostituire, le fughe annerite, il silicone del bagno o della cucina da rifare. Descrivi il lavoro con una foto e, se hai piastrelle di scorta, scrivilo. Scegli fino a tre piastrellisti che lavorano nella tua zona e ricevi la stima in chat.",
    problemsLede: "Le richieste per un piastrellista riguardano quasi sempre bagno e cucina.",
    problems: [
      "Il silicone intorno al piatto doccia è nero e si stacca",
      "Due piastrelle del pavimento si sono sollevate",
      "Mi è caduta una pentola e si è crepata una piastrella",
      "Le fughe del bagno sono scure anche dopo averle pulite",
      "Vorrei rivestire la parete dietro il piano cottura",
      "Una piastrella del rivestimento suona vuota quando la tocco",
    ],
    steps: [
      {
        title: "Foto e piastrelle di scorta",
        text: "Fotografa la zona e scrivi se hai piastrelle avanzate dalla posa: trovare lo stesso modello è spesso la parte più difficile. L'assistente conferma il mestiere.",
      },
      {
        title: "Piastrellisti vicini",
        text: "Vedi i piastrellisti che lavorano nella tua zona, dal più vicino, e mandi la richiesta fino a tre. Lavora chi conferma per primo.",
      },
      {
        title: "Stima in chat",
        text: "Per silicone e fughe la stima è già indicativa; per sostituire piastrelle il piastrellista può volerle vedere. L'eventuale Costo Chiamata lo vedi prima e lo paghi a lui.",
      },
      {
        title: "Intervento con QR",
        text: "Tu scegli il giorno, lui propone l'orario. All'inizio e alla fine inquadri il QR che ti mostra; il preventivo vale solo se lo accetti.",
      },
    ],
    emergency:
      "Il lavoro del piastrellista non è da emergenza: una piastrella sollevata si isola e si evita di camminarci sopra. Chiama il 112 solo se il pavimento si solleva insieme a crepe nei muri o nel soffitto, o se da sotto le piastrelle esce acqua vicino a prese e quadro elettrico.",
    faq: [
      {
        q: "Come trovo un piastrellista a Torino per una piastrella sola?",
        a: "Su Pluggers descrivi il lavoro e aggiungi una foto: anche una piastrella sola si chiede così. Vedi i piastrellisti della tua zona e scegli a chi scrivere; se hai una piastrella di scorta, dillo subito.",
      },
      {
        q: "Quanto costa rifare il silicone della doccia con Pluggers?",
        a: "L'importo lo decide il piastrellista e lo ricevi come stima in chat; il Costo Chiamata, se c'è, lo vedi prima della visita. Si paga direttamente a lui, non nell'app.",
      },
      {
        q: "Perché le piastrelle del pavimento si sono sollevate?",
        a: "Di solito per sbalzi di temperatura, un collante che ha ceduto o mancanza di giunti; a volte per acqua sotto il pavimento. Il piastrellista lo verifica sul posto e ti propone il preventivo.",
      },
      {
        q: "Il piastrellista posa anche il parquet?",
        a: "Su Pluggers parquet e laminati sono del posatore di pavimenti; il piastrellista si occupa di piastrelle e fughe. Descrivi il lavoro e l'assistente indica il mestiere giusto.",
      },
    ],
  },
  {
    slug: "giardiniere",
    label: "Giardiniere",
    group: "esterni",
    who: "un giardiniere",
    photo: "/mestieri/gardener.jpg",
    photoAlt: "Piante verdi in vaso accanto a una finestra luminosa",
    description:
      "Siepe da potare, prato da tagliare, irrigazione che non parte: descrivi il lavoro su Pluggers e chiedi la stima ai giardinieri della tua zona di Torino.",
    summary: "Giardino, potature, prato, piante e irrigazione esterna.",
    intro:
      "Su Pluggers trovi un giardiniere a Torino per il giardino, le piante e l'irrigazione esterna: una siepe da potare, il prato da tagliare, un impianto di irrigazione che non parte. Descrivi il lavoro con qualche foto e la superficie approssimativa, scegli fino a tre giardinieri della tua zona e ricevi la stima in chat.",
    problemsLede: "Per il giardiniere contano le dimensioni del lavoro e dove va portato il verde tagliato.",
    problems: [
      "La siepe davanti a casa è cresciuta troppo",
      "Il prato del cortile va tagliato ogni due settimane",
      "L'irrigazione automatica non parte più",
      "C'è un ramo grosso che tocca il tetto",
      "Vorrei sistemare le piante del terrazzo",
      "Le foglie dell'ulivo in vaso sono diventate gialle",
    ],
    steps: [
      {
        title: "Foto e dimensioni",
        text: "Fotografa la siepe, il prato o le piante e scrivi più o meno quanti metri sono. Se c'è da potare in alto, indica l'altezza: cambia l'attrezzatura che serve.",
      },
      {
        title: "Giardinieri della tua zona",
        text: "Vedi i giardinieri il cui raggio d'azione comprende il tuo indirizzo e mandi la richiesta fino a tre. Lavora chi conferma per primo.",
      },
      {
        title: "Stima e smaltimento",
        text: "Nella stima chiedi se è compreso lo smaltimento del verde tagliato. L'eventuale Costo Chiamata lo vedi prima della visita e lo paghi a lui.",
      },
      {
        title: "Lavoro con check-in",
        text: "Scegli il giorno, il giardiniere propone l'orario. All'inizio e alla fine si registra il lavoro con un QR, poi puoi lasciare la recensione.",
      },
    ],
    emergency:
      "Se un albero o un grosso ramo è caduto o sta per cadere su una strada, un'auto, un tetto o sui cavi elettrici, non avvicinarti, tieni lontane le persone e chiama il 112. Non toccare mai rami appoggiati a cavi elettrici, nemmeno con un attrezzo.",
    faq: [
      {
        q: "Come trovo un giardiniere a Torino per potare una siepe?",
        a: "Su Pluggers descrivi la siepe, quanto è lunga e alta, e aggiungi una foto. Vedi i giardinieri che lavorano nella tua zona e ricevi la stima in chat da chi scegli.",
      },
      {
        q: "Quanto costa un giardiniere con Pluggers?",
        a: "Dipende da superficie, tipo di lavoro e smaltimento del verde, quindi la cifra te la dà il giardiniere con una stima in chat. Il Costo Chiamata, se c'è, lo vedi prima e lo paghi a lui.",
      },
      {
        q: "Il giardiniere ripara anche l'impianto di irrigazione?",
        a: "Sì, l'irrigazione esterna è tra i lavori del giardiniere su Pluggers. Scrivi che tipo di impianto hai e cosa non fa, per esempio se non parte o se un settore resta asciutto.",
      },
      {
        q: "Posso chiedere un giardiniere per un terrazzo in città?",
        a: "Sì, anche piante in vaso e terrazzi sono lavori da giardiniere. Scrivi a che piano sei e se c'è l'ascensore: aiuta a capire come portare terra e vasi.",
      },
    ],
  },
  {
    slug: "vetraio",
    label: "Vetraio",
    group: "aperture",
    who: "un vetraio",
    photo: "/mestieri/glazier.jpg",
    photoAlt: "Pannello di vetro trasparente in una stanza con piante",
    description:
      "Vetro rotto, doppio vetro appannato, box doccia o specchio da sostituire: descrivi il lavoro su Pluggers e scegli tra i vetrai della tua zona di Torino.",
    summary: "Vetri rotti, vetrocamera, box doccia, specchi e sigillature.",
    intro:
      "Su Pluggers trovi un vetraio a Torino per vetri rotti, vetrocamera, vetri temperati, box doccia, specchi e sigillature. Descrivi il lavoro con una foto e le misure del vetro, e scrivi se è una finestra, una porta o un mobile. L'assistente indica il mestiere e l'urgenza, poi scegli fino a tre vetrai della tua zona.",
    problemsLede: "Per un vetraio servono soprattutto il tipo di vetro e le misure.",
    problems: [
      "Si è rotto il vetro della finestra della cucina",
      "Il doppio vetro della camera è appannato dentro",
      "Il box doccia ha una crepa sull'anta",
      "Vorrei uno specchio grande su misura in ingresso",
      "Il vetro della porta del soggiorno è scheggiato",
      "La sigillatura intorno al vetro della finestra si è staccata",
    ],
    steps: [
      {
        title: "Tipo di vetro e misure",
        text: "Scrivi se è un vetro singolo, un doppio vetro o temperato e misura il vetro a vista. Una foto del bordo aiuta a capire lo spessore.",
      },
      {
        title: "Vetrai vicini",
        text: "Vedi i vetrai che lavorano nella tua zona, dal più vicino, e mandi la richiesta fino a tre. Lavora chi conferma per primo.",
      },
      {
        title: "Stima, misure, preventivo",
        text: "La stima arriva in chat; spesso il vetraio prende le misure esatte sul posto e poi fa il preventivo. L'eventuale Costo Chiamata lo vedi prima e lo paghi a lui.",
      },
      {
        title: "Posa con QR",
        text: "Tu scegli il giorno, il vetraio propone l'orario. Inizio e fine dell'intervento si registrano con il QR che ti mostra.",
      },
    ],
    emergency:
      "Se un vetro rotto di una finestra ai piani alti può cadere in strada o in cortile, allontana le persone e chiama il 112. Per una ferita profonda da vetro, premi sulla ferita con un panno pulito e chiama il 112. Intanto copri il vetro rotto con nastro adesivo largo e non provare a toglierlo a mani nude.",
    faq: [
      {
        q: "Come trovo un vetraio a Torino per un vetro rotto?",
        a: "Su Pluggers descrivi dove si è rotto il vetro e aggiungi una foto e le misure. L'assistente indica il vetraio e l'urgenza e ti mostra quelli che lavorano nella tua zona.",
      },
      {
        q: "Quanto costa sostituire un vetro con Pluggers?",
        a: "Dipende da tipo, spessore e misure del vetro: il vetraio ti manda una stima in chat e, dopo aver misurato, il preventivo. Il Costo Chiamata, se lo chiede, lo vedi prima e lo paghi a lui.",
      },
      {
        q: "Il doppio vetro è appannato dentro: si può riparare?",
        a: "Quando la condensa è tra i due vetri, di solito il vetrocamera ha perso la tenuta e va sostituito; il telaio può restare. Il vetraio lo verifica e ti propone il preventivo.",
      },
      {
        q: "Il vetraio sostituisce anche il box doccia?",
        a: "Sì, box doccia, specchi e vetri temperati sono lavori da vetraio su Pluggers. Per il silicone di bagno e cucina, invece, c'è il piastrellista.",
      },
    ],
  },
  {
    slug: "montatore-mobili",
    label: "Montatore mobili",
    group: "arredo",
    who: "un montatore di mobili",
    photo: "/mestieri/furniture-assembler.jpg",
    photoAlt: "Cassettiera in legno chiaro con un attrezzo appoggiato sopra",
    description:
      "Mobili da montare, mensole e quadri da appendere, staffa per la TV: descrivi il lavoro su Pluggers e scegli tra i montatori della tua zona di Torino.",
    summary: "Montaggio e smontaggio di mobili, mensole, quadri e staffe TV.",
    intro:
      "Su Pluggers trovi un montatore di mobili a Torino per montare o smontare mobili, appendere mensole e quadri, fissare una staffa per la TV. Descrivi il lavoro, scrivi quali mobili sono e di che materiale è la parete, e scegli fino a tre montatori che lavorano nella tua zona. La stima arriva in chat prima della visita.",
    problemsLede: "Le richieste per un montatore partono quasi sempre da una consegna o da un trasloco.",
    problems: [
      "Mi hanno consegnato un armadio in scatola e non so montarlo",
      "Devo smontare la cucina per il trasloco",
      "Vorrei appendere la TV al muro del soggiorno",
      "Le mensole nuove vanno fissate su una parete in cartongesso",
      "Ho tre quadri pesanti da appendere in corridoio",
      "Il letto montato da me cigola e balla",
    ],
    steps: [
      {
        title: "Quali mobili e quale parete",
        text: "Scrivi marca e modello dei mobili se sono in scatola e fotografa la parete: per i fissaggi conta se è in muratura o in cartongesso.",
      },
      {
        title: "Montatori della tua zona",
        text: "Vedi i montatori il cui raggio d'azione comprende il tuo indirizzo e mandi la richiesta fino a tre. Lavora chi conferma per primo.",
      },
      {
        title: "Stima in base ai pezzi",
        text: "Più il lavoro è descritto, più la stima in chat è vicina al prezzo finale. L'eventuale Costo Chiamata lo vedi prima della visita e lo paghi a lui.",
      },
      {
        title: "Montaggio registrato",
        text: "Tu scegli il giorno, lui propone l'orario. Inizio e fine del montaggio si registrano con un QR, poi puoi lasciare la recensione.",
      },
    ],
    emergency:
      "Se un mobile alto o un pensile si è ribaltato su qualcuno, chiama il 112. Se forando una parete esce odore di gas, apri le finestre, non toccare interruttori, esci e chiama da fuori il pronto intervento gas (a Torino 800 900 999) o il 112; se escono scintille, stacca l'interruttore generale.",
    faq: [
      {
        q: "Come trovo qualcuno che monti un mobile a Torino?",
        a: "Su Pluggers descrivi cosa va montato, indica marca e modello se è in scatola e aggiungi una foto. Vedi i montatori di mobili della tua zona e ricevi la stima in chat da chi scegli.",
      },
      {
        q: "Quanto costa montare un armadio con Pluggers?",
        a: "Il prezzo lo fa il montatore in base a mobile, pezzi e tempo: ricevi una stima in chat prima della visita. Il Costo Chiamata, se c'è, lo vedi prima e lo paghi direttamente a lui.",
      },
      {
        q: "Il montatore può appendere la TV su una parete in cartongesso?",
        a: "Sì, il fissaggio di staffe TV, mensole e quadri è tra i lavori del montatore. Scrivi nella richiesta che la parete è in cartongesso e quanto pesa la TV: servono tasselli adatti.",
      },
      {
        q: "Il montatore smonta e rimonta i mobili per un trasloco?",
        a: "Sì, smontaggio e rimontaggio sono lavori da montatore su Pluggers. Per mobili da riparare o da costruire su misura, invece, c'è il falegname.",
      },
    ],
  },
];

export function getTrade(slug: string): Trade | undefined {
  return TRADES.find((t) => t.slug === slug);
}

export const TORINO = {
  title: "Professionisti per la casa a Torino",
  description:
    "Idraulici, elettricisti, fabbri e gli altri professionisti per la casa a Torino: descrivi il problema su Pluggers e scegli tra chi lavora nella tua zona.",
  intro:
    "Su Pluggers trovi a Torino idraulici, elettricisti, fabbri, tecnici degli elettrodomestici e gli altri professionisti per la casa. Non serve sapere quale ti serve: descrivi il problema con una foto e l'assistente indica il mestiere e l'urgenza. Poi scegli a chi scrivere tra i professionisti che lavorano nella tua zona. Usare Pluggers è gratis; il professionista lo paghi direttamente.",
  faq: [
    {
      q: "Pluggers funziona in tutta Torino?",
      a: "Pluggers ti mostra i professionisti il cui raggio d'azione comprende il tuo indirizzo: ognuno sceglie fino a che distanza lavorare. Per questo cosa vedi dipende dalla zona e dal mestiere.",
    },
    {
      q: "Funziona anche nei comuni intorno a Torino?",
      a: "Sì, se il tuo indirizzo rientra nel raggio di qualche professionista. Descrivi il problema e vedi subito chi lavora nella tua zona; se non c'è ancora nessuno per quel mestiere, l'app te lo dice.",
    },
    {
      q: "Non so quale professionista mi serve: cosa faccio?",
      a: "Non devi saperlo. Descrivi il problema come lo vedi, con una foto: l'assistente di Pluggers indica il mestiere, l'urgenza e le cause più probabili, e ti mostra i professionisti adatti.",
    },
  ],
};
