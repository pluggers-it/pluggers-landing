import { ORG, ORG_ADDRESS_LINE, SOCIAL_LINKS } from "@/lib/site";

export const ABOUT_UPDATED = "2026-10-09";

const FOUNDED = "6 ottobre 2026";

export const ABOUT = {
  title: "Chi siamo",
  description:
    "La storia, la visione e le persone di Pluggers, l'app nata a Torino che ti mette in contatto con i professionisti per la casa della tua zona.",
  intro:
    `${ORG.summary} La gestisce ${ORG.legalName}, società con sede legale in ${ORG_ADDRESS_LINE}, ` +
    `costituita il ${FOUNDED}.`,
  sections: [
    {
      title: "Cosa fa Pluggers",
      text:
        "Pluggers parte dalla descrizione del problema: un testo e una foto. Un assistente di intelligenza artificiale indica il mestiere, l'urgenza e le cause più probabili, e ti mostra i professionisti il cui raggio d'azione comprende il tuo indirizzo. Scegli a chi mandare la richiesta; stima, eventuale Costo Chiamata e preventivo arrivano in chat, e inizio e fine dell'intervento si registrano con un QR. Per chi cerca un professionista usare Pluggers è gratis.",
    },
    {
      title: "Il ruolo di Pluggers",
      text:
        "Pluggers mette in contatto cliente e professionista e dà a entrambi gli strumenti per organizzare l'intervento. Il lavoro, il prezzo e il pagamento li concordano direttamente cliente e professionista: Pluggers non è parte di quell'accordo e non incassa pagamenti nell'app.",
    },
    {
      title: "Dove siamo attivi",
      text:
        "Oggi Pluggers è attivo a Torino, con idraulici, elettricisti, fabbri e gli altri mestieri della casa. Chi vive altrove può lasciare la sua città nella lista d'attesa: le prossime zone le scegliamo da lì.",
    },
  ],
};

// Story, vision, mission and values come from the Company page on Notion (Teamspace Home), rewritten
// to what the app does today: protected payments, escrow and the Academy are not live and stay out.
export const STORY =
  "Pluggers nasce da due domande. Perché trovare un professionista affidabile per un guasto in casa è ancora così complicato? E perché per un artigiano è così faticoso ricevere richieste chiare? " +
  "Abbiamo ascoltato professionisti e famiglie, e da lì abbiamo costruito un'app che parte dal problema invece che da un elenco di nomi. " +
  `Il team unisce tecnologia, organizzazione, strategia e marketing. ${ORG.legalName} è stata costituita a Torino il ${FOUNDED}, e da Torino parte il lancio.`;

export const VISION =
  "Diventare il punto di riferimento digitale per i mestieri della casa in Italia. Non una vetrina in più, ma un modo diverso di chiedere, fare e gestire un lavoro: semplice per chi lo chiede, più leggero per chi lo fa. " +
  "I professionisti attivi diminuiscono e la loro età media cresce: per questo vogliamo anche dare più valore ai mestieri manuali e aiutare nuove persone a sceglierli.";

export const MISSION =
  "Accorciare la strada tra un problema in casa e il professionista giusto, e togliere al professionista il lavoro che non è il suo mestiere. " +
  "Per chi cerca: una richiesta guidata, il mestiere giusto e professionisti della zona, con il preventivo scritto e l'intervento registrato all'inizio e alla fine. " +
  "Per chi lavora: richieste già descritte e con le foto, meno sopralluoghi a vuoto, accordi e documenti nello stesso posto.";

export const VALUES = [
  { title: "Trasparenza", text: "Preventivi chiari e lavoro documentato, così cliente e professionista sanno sempre cosa aspettarsi." },
  { title: "Tutela per entrambi", text: "La piattaforma deve proteggere il cliente e il professionista, non uno dei due a spese dell'altro." },
  { title: "Prima i professionisti", text: "L'artigiano è al centro, non un nome in un elenco: ogni strumento serve a restituirgli tempo per il suo lavoro." },
];

export type TeamMember = { name: string; role: string; bio: string; photo?: string };

/** Bios from the Team page on Notion (March 2026), condensed. A photo goes in public/team/ when its owner sends it. */
export const TEAM: TeamMember[] = [
  { name: "Gianmarco Piras", role: "Chief Executive Officer",
    bio: "Si occupa di crescita e di organizzazioni che scalano. Laurea magistrale in Psicologia del lavoro, certificazioni PRINCE2 e PROSCI; è HR Business Partner in aziende in forte crescita, dopo esperienze in consulenza e startup." },
  { name: "Simone Marras", role: "Chief Strategy Officer",
    bio: "Definisce la strategia di Pluggers. Viene dalla strategia e dalla comunicazione, con esperienza in startup internazionali tra l'Italia e l'estero." },
  { name: "Andrea Iezzi", role: "Chief Marketing Officer",
    bio: "Guida marketing e comunicazione con un approccio basato sui dati. Master in Digital Marketing, freelance per aziende ed enti pubblici in diverse regioni italiane." },
  { name: "Luca Piras", role: "Chief of Staff",
    bio: "Coordina vertici e team. Unisce competenze di risorse umane, informatica e organizzazione con una specializzazione in Cyberpsicologia; diplomato al Conservatorio." },
  { name: "Mattia Pavone", role: "Chief Technology Officer",
    bio: "Cura l'efficienza e la solidità del software. È stato IT Specialist in Fater S.p.A. e analista programmatore in Ready2Use." },
  { name: "Alberto Migliorato", role: "Tech Lead & Software Architect",
    bio: "Formazione in AI e Data Analytics al Politecnico di Torino, più di otto anni da sviluppatore Java, già co-titolare e tech lead di Novaverse con un team di venti persone; ha lavorato in KPMG." },
  { name: "Andrea Di Felice", role: "AI Engineer & Data Scientist",
    bio: "Ingegnere informatico specializzato in data science: machine learning, deep learning e reinforcement learning. Ha avuto un assegno di ricerca per applicazioni in realtà virtuale." },
  { name: "Gabriele Merlino", role: "AI Engineer & Cloud Data Specialist",
    bio: "Data engineer su sistemi big data e cloud in Reply S.p.A. e ricercatore sui modelli di intelligenza artificiale generativa all'INRIM; tesi sperimentale all'ETH di Zurigo." },
];

export const ADVISORS: TeamMember[] = [
  { name: "Alessandro Antonini", role: "Advisor",
    bio: "Più di tredici anni tra consulenza di direzione e organizzazioni pubbliche e private complesse, con ruoli di guida anche in istituzioni internazionali. Insegna all'università." },
];

export const COMPANY_FACTS: { label: string; value: string; href?: string }[] = [
  { label: "Ragione sociale", value: ORG.legalName },
  { label: "Sede legale", value: ORG_ADDRESS_LINE },
  { label: "Partita IVA e codice fiscale", value: ORG.vatNumber },
  { label: "Costituita il", value: FOUNDED },
  { label: "Email", value: ORG.email, href: `mailto:${ORG.email}` },
  ...SOCIAL_LINKS.map((s) => ({ label: s.label, value: s.href.replace("https://www.", ""), href: s.href })),
];
