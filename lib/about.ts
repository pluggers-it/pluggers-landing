import { ORG, ORG_ADDRESS_LINE, SOCIAL_LINKS } from "@/lib/site";

export const ABOUT_UPDATED = "2026-10-12";

const FOUNDED = "6 ottobre 2026";

export const ABOUT = {
  title: "Chi siamo",
  description: "Le persone dietro Pluggers, la piattaforma nata a Torino per gli interventi in casa.",
  intro:
    "Pluggers è una piattaforma per gli interventi in casa. Oggi mette in contatto privati e artigiani. " +
    "I profili ottimizzati per imprese e amministratori di condominio sono in arrivo.",
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

export type TeamMember = { name: string; role: string; photo?: string };

/** Only photo, name and role: the bios were removed (site review S-41). Photos: public/team/, 288px square, face framed like Gianmarco's. */
export const TEAM: TeamMember[] = [
  { name: "Gianmarco Piras", role: "Chief Executive Officer", photo: "/team/gianmarco-piras.webp" },
  { name: "Simone Marras", role: "Chief Strategy Officer", photo: "/team/simone-marras.webp" },
  { name: "Andrea Iezzi", role: "Chief Marketing Officer", photo: "/team/andrea-iezzi.webp" },
  { name: "Luca Piras", role: "Chief of Staff", photo: "/team/luca-piras.webp" },
  { name: "Mattia Pavone", role: "Chief Technology Officer", photo: "/team/mattia-pavone.webp" },
  { name: "Alberto Migliorato", role: "Tech Lead & Software Architect", photo: "/team/alberto-migliorato.webp" },
  { name: "Andrea Di Felice", role: "AI Engineer & Data Scientist" },
  { name: "Gabriele Merlino", role: "AI Engineer & Cloud Data Specialist", photo: "/team/gabriele-merlino.webp" },
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
