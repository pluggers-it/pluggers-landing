/**
 * JSON-LD Structured Data — Schema.org
 *
 * Serves three purposes:
 *  1. Brand disambiguation: alternateName covers common typos ("Plugers",
 *     "Plughers", "Plugger") so Google associates those queries with us.
 *  2. Service/keyword coverage: description + keywords carry synonyms
 *     ("trovare artigiani", "professionisti per la casa", etc.) in a way
 *     that doesn't pollute the visible UI.
 *  3. Rich result eligibility: WebSite + Organization schemas enable
 *     sitelinks search box and knowledge panel features.
 */

const BASE_URL = "https://pluggers.it";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Pluggers",
  // Common typos and alternate spellings — help Google deduplicate brand queries
  alternateName: [
    "Plugers",
    "Plughers",
    "Plugger",
    "Pluggers.it",
    "Plugers.it",
  ],
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description:
    "Pluggers è l'applicazione italiana che mette in contatto chi ha un problema " +
    "con chi ha la soluzione. Trova artigiani qualificati, professionisti per la casa, " +
    "idraulici, elettricisti veloci, muratori, falegnami e altri professionisti della " +
    "mano d'opera nella tua zona.",
  foundingLocation: {
    "@type": "Country",
    name: "Italia",
  },
  sameAs: [
    "https://instagram.com/pluggers.it",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    areaServed: "IT",
    availableLanguage: "Italian",
  },
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Pluggers",
  url: BASE_URL,
  // Synonyms and long-tail keywords embedded in description (not shown to users)
  description:
    "Trova artigiani professionisti per la casa: idraulico vicino a me, " +
    "elettricista veloce, muratore qualificato, falegname, imbianchino, " +
    "piastrellista, carpentiere, saldatore, giardiniere e altri artigiani di fiducia. " +
    "Pluggers — la piattaforma italiana per trovare professionisti qualificati " +
    "nella tua zona, veloci, verificati e sempre disponibili al momento giusto.",
  inLanguage: "it-IT",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Pluggers — Marketplace per artigiani professionisti",
  provider: { "@type": "Organization", name: "Pluggers", url: BASE_URL },
  serviceType: "Marketplace per professionisti della mano d'opera",
  areaServed: { "@type": "Country", name: "Italia" },
  description:
    "Servizio di intermediazione per trovare artigiani qualificati: " +
    "idraulici, elettricisti, muratori, fabbri, falegnami, imbianchini, " +
    "piastrellisti, carpentieri, saldatori, serramentisti, vetrai, tappezzieri, " +
    "giardinieri, manovali, gessisti, lattonieri, termoidraulici, frigoristi, " +
    "ascensoristi.",
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/ComingSoon",
    areaServed: "IT",
  },
};

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}
