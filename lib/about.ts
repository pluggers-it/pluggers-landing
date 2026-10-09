import { ORG, ORG_ADDRESS_LINE, SOCIAL_LINKS } from "@/lib/site";

export const ABOUT_UPDATED = "2026-10-09";

const FOUNDED = "6 ottobre 2026";

export const ABOUT = {
  title: "Chi siamo",
  description: "Le persone dietro Pluggers, la piattaforma nata a Torino per gli interventi in casa.",
  intro:
    "Pluggers è una piattaforma per gli interventi in casa, nata a Torino. Oggi mette in contatto privati e artigiani. " +
    "Imprese e amministratori di condominio sono in arrivo.",
};

export const STORY =
  "Abbiamo parlato con artigiani e famiglie di Torino. Le famiglie non sapevano chi chiamare per un guasto. " +
  "Gli artigiani perdevano pomeriggi in sopralluoghi per lavori che al telefono sembravano altro. " +
  "Da lì è nato Pluggers: si parte dal guasto e l'app trova il mestiere. " +
  `${ORG.legalName} è stata costituita a Torino il ${FOUNDED}.`;

export const WHAT =
  "Scrivi cosa si è rotto e aggiungi una foto. L'assistente indica mestiere, urgenza e cause più probabili. " +
  "Poi ti mostra i professionisti della tua zona. Stima, Costo Chiamata e preventivo arrivano in chat. Per chi cerca è gratis.";

export const PRINCIPLES = [
  { title: "Tutto per iscritto", text: "Stima, preventivo e accordi restano in chat. Inizio e fine si registrano con un QR." },
  { title: "Il prezzo lo fa il professionista", text: "Anche la zona e gli orari. Noi non li tocchiamo." },
  { title: "Non mandiamo noi i tecnici", text: "Ti mettiamo in contatto con il professionista. Il lavoro e il prezzo li concordate voi." },
  { title: "Per ora solo Torino", text: "Apriamo una nuova città quando ci sono abbastanza professionisti per rispondere." },
];

export const NEXT =
  "Stiamo preparando l'accesso per imprese e amministratori di condominio e il pagamento nell'app. " +
  "Poi altre città, partendo da quelle che ci chiedete nella lista d'attesa. " +
  "Gli artigiani sono sempre meno: vogliamo che più ragazzi scelgano di fare l'idraulico o l'elettricista.";

export const WHERE =
  "Oggi a Torino, con idraulici, elettricisti, fabbri e gli altri artigiani della casa. " +
  "Se vivi altrove, lascia la tua città nella lista d'attesa: ci aiuta a decidere dove aprire.";

export type TeamMember = { name: string; role: string; bio: string; photo?: string };

/** Bios from the Team page on Notion (March 2026). A photo goes in public/team/ when its owner sends it. */
export const TEAM: TeamMember[] = [
  { name: "Gianmarco Piras", role: "Chief Executive Officer", photo: "/team/gianmarco-piras.webp",
    bio: "Laureato in Psicologia del lavoro, viene da consulenza e startup ed è HR Business Partner." },
  { name: "Simone Marras", role: "Chief Strategy Officer",
    bio: "Viene dalla comunicazione e ha lavorato in startup in Italia e all'estero." },
  { name: "Andrea Iezzi", role: "Chief Marketing Officer",
    bio: "Master in Digital Marketing, ha lavorato da freelance per aziende ed enti pubblici." },
  { name: "Luca Piras", role: "Chief of Staff",
    bio: "Viene da risorse umane e informatica, con una specializzazione in cyberpsicologia. È diplomato al Conservatorio." },
  { name: "Mattia Pavone", role: "Chief Technology Officer",
    bio: "È stato IT Specialist in Fater S.p.A. e analista programmatore in Ready2Use." },
  { name: "Alberto Migliorato", role: "Tech Lead & Software Architect",
    bio: "Ha studiato AI e Data Analytics al Politecnico di Torino. Programma in Java da più di otto anni. È stato socio e tech lead di Novaverse e ha lavorato in KPMG." },
  { name: "Andrea Di Felice", role: "AI Engineer & Data Scientist",
    bio: "Ingegnere informatico specializzato in data science, è stato assegnista di ricerca sulla realtà virtuale." },
  { name: "Gabriele Merlino", role: "AI Engineer & Cloud Data Specialist",
    bio: "Data engineer in Reply S.p.A., fa ricerca sull'intelligenza artificiale generativa all'INRIM. Tesi all'ETH di Zurigo." },
];

// Advisors appear only after they have agreed to be named on the public site.
export const ADVISORS: TeamMember[] = [];

export const COMPANY_FACTS: { label: string; value: string; href?: string }[] = [
  { label: "Ragione sociale", value: ORG.legalName },
  { label: "Sede legale", value: ORG_ADDRESS_LINE },
  { label: "Partita IVA e codice fiscale", value: ORG.vatNumber },
  { label: "Costituita il", value: FOUNDED },
  { label: "Email", value: ORG.email, href: `mailto:${ORG.email}` },
  ...SOCIAL_LINKS.map((s) => ({ label: s.label, value: s.href.replace("https://www.", ""), href: s.href })),
];
