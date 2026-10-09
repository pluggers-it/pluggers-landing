/**
 * The organisation and the site, stated once. JSON-LD, footer, /chi-siamo,
 * llms.txt and the social preview all read from here so they never disagree.
 */
export const SITE_URL = "https://www.plggrs.it";

export const ORG = {
  name: "Pluggers",
  legalName: "Pluggers S.r.l.",
  foundingDate: "2026-10-06",
  /** Partita IVA and codice fiscale are the same number (Agenzia delle Entrate, 8/10/2026). */
  vatNumber: "13523080011",
  email: "supporto@plggrs.it",
  address: {
    street: "Corso Valdocco 2",
    postalCode: "10122",
    city: "Torino",
    region: "TO",
    country: "IT",
  },
  /** The one-sentence description used everywhere the brand is introduced. */
  summary:
    "Pluggers è una piattaforma per gli interventi in casa, attiva a Torino. Descrivi il guasto: " +
    "Pluggers capisce che mestiere serve e ti mostra chi lavora vicino a te.",
} as const;

export const ORG_ADDRESS_LINE = `${ORG.address.street}, ${ORG.address.postalCode} ${ORG.address.city}`;

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/pluggers.it/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/pluggers-it/" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61578519760330" },
] as const;
