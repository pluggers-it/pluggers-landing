import { ORG, ORG_ADDRESS_LINE, SOCIAL_LINKS } from "@/lib/site";

export const ABOUT_UPDATED = "2026-10-07";

const FOUNDED = "6 ottobre 2026";

export const ABOUT = {
  title: "Chi siamo",
  description:
    "Pluggers è un'app che ti mette in contatto con i professionisti per la casa della tua zona. La gestisce Pluggers S.r.l., con sede in Corso Valdocco 2 a Torino.",
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
        "Oggi Pluggers è attivo a Torino e dintorni, con idraulici, elettricisti, fabbri e gli altri mestieri della casa. Chi vive altrove può lasciare la sua città nella lista d'attesa: le prossime zone le scegliamo da lì.",
    },
  ],
};

export const COMPANY_FACTS: { label: string; value: string; href?: string }[] = [
  { label: "Ragione sociale", value: ORG.legalName },
  { label: "Sede legale", value: ORG_ADDRESS_LINE },
  { label: "Costituita il", value: FOUNDED },
  { label: "Email", value: ORG.email, href: `mailto:${ORG.email}` },
  ...SOCIAL_LINKS.map((s) => ({ label: s.label, value: s.href.replace("https://www.", ""), href: s.href })),
];
