/**
 * /llms.txt (index, per llmstxt.org) and /llms-full.txt (the pages' text),
 * built from the same copy the pages render.
 */
import { WEB_APP_URL } from "@/components/landing/links";
import { ABOUT, COMPANY_FACTS } from "@/lib/about";
import { FAQ, HERO, HOW, PROS, TRADES_SECTION, TRUST } from "@/lib/home";
import { ORG, ORG_ADDRESS_LINE, SITE_URL, SOCIAL_LINKS } from "@/lib/site";
import { TORINO, TRADE_GROUPS, TRADES, type Trade } from "@/lib/trades";

const FACTS =
  `${ORG.name} è gestita da ${ORG.legalName}, sede legale in ${ORG_ADDRESS_LINE}, P.IVA ${ORG.vatNumber}. ` +
  "Per chi cerca un professionista è gratis: se il professionista chiede un Costo Chiamata lo indica " +
  "nell'app prima della visita, e il compenso si paga direttamente a lui, non nell'app. " +
  `È un'app per iPhone e Android, in arrivo su App Store e Google Play, e si usa anche dal browser su ${WEB_APP_URL}. ` +
  `Contatti: ${ORG.email}.`;

const faqMd = (items: readonly { q: string; a: string }[]) =>
  items.map(({ q, a }) => `### ${q}\n\n${a}`).join("\n\n");

export function llmsIndex(): string {
  const tradeLinks = TRADES.map(
    (t) => `- [${t.label} a Torino](${SITE_URL}/torino/${t.slug}): ${t.summary}`
  ).join("\n");

  return `# ${ORG.name}

> ${ORG.summary}

${FACTS}

## Pagine principali

- [Home](${SITE_URL}/): cos'è Pluggers, come funziona, mestieri, professionisti e domande frequenti
- [Come funziona](${SITE_URL}/#come-funziona): dalla descrizione del problema alla visita
- [Professionisti per la casa a Torino](${SITE_URL}/torino): tutti i mestieri disponibili a Torino
- [Per i professionisti](${SITE_URL}/#professionisti): cosa offre Pluggers a chi lavora nella casa
- [Domande frequenti](${SITE_URL}/#domande-frequenti): costi, zone, assistente, professionisti
- [Chi siamo](${SITE_URL}/chi-siamo): la società, la sede e i contatti
- [Per i clienti](${SITE_URL}/clienti): come si trova un idraulico, un elettricista o un altro artigiano a Torino con Pluggers
- [Per i professionisti](${SITE_URL}/professionisti): l'app per artigiani di Torino, come si ricevono le richieste dei clienti vicini e chi decide il prezzo
- [Apri Pluggers](${WEB_APP_URL}): la versione web dell'app, per descrivere il problema dal browser

## Mestieri a Torino

${tradeLinks}

## Blog

- [Blog](${SITE_URL}/blog): articoli per artigiani e professionisti della casa

## Note legali

- [Privacy Policy](${SITE_URL}/privacy)
- [Termini e Condizioni](${SITE_URL}/termini)
- [Assistenza](${SITE_URL}/supporto)
- [Eliminazione dell'account](${SITE_URL}/elimina-account)

## Optional

- [Testo completo delle pagine](${SITE_URL}/llms-full.txt): home, mestieri a Torino e chi siamo in un unico file
`;
}

function tradeMd(t: Trade): string {
  return `## ${t.label} a Torino

URL: ${SITE_URL}/torino/${t.slug}

${t.intro}

### Quando serve ${t.who}

${t.problemsLede}

${t.problems.map((p) => `- «${p}»`).join("\n")}

### Come funziona con Pluggers

${t.steps.map((s, i) => `${i + 1}. **${s.title}.** ${s.text}`).join("\n")}

### Quando chiamare il 112

${t.emergency}

### Domande frequenti

${faqMd(t.faq).replaceAll("### ", "#### ")}`;
}

export function llmsFull(): string {
  const groups = TRADE_GROUPS.map(
    (g) =>
      `- ${g.label}: ${TRADES.filter((t) => t.group === g.id)
        .map((t) => t.label)
        .join(", ")}`
  ).join("\n");

  return `# ${ORG.name}

> ${ORG.summary}

${FACTS}

---

# Home

URL: ${SITE_URL}/

## ${HERO.title}

${HERO.lede}

## ${HOW.title}

${HOW.lede}

${HOW.steps.map((s, i) => `${i + 1}. **${s.title}.** ${s.text}`).join("\n")}

## ${TRADES_SECTION.title}

${TRADES_SECTION.lede}

${groups}

## ${PROS.title}

${PROS.lede}

${PROS.benefits.map((b) => `- **${b.title}.** ${b.text}`).join("\n")}

## ${TRUST.title}

${TRUST.lede}

${TRUST.rows.map((r) => `- ${r}`).join("\n")}

## Domande frequenti

${faqMd(FAQ)}

---

# ${TORINO.title}

URL: ${SITE_URL}/torino

${TORINO.intro}

## Domande frequenti

${faqMd(TORINO.faq)}

---

${TRADES.map(tradeMd).join("\n\n---\n\n")}

---

# ${ABOUT.title}

URL: ${SITE_URL}/chi-siamo

${ABOUT.intro}

${ABOUT.sections.map((s) => `## ${s.title}\n\n${s.text}`).join("\n\n")}

## Dati della società

${COMPANY_FACTS.map((f) => `- ${f.label}: ${f.href && !f.href.startsWith("mailto:") ? f.href : f.value}`).join("\n")}

Profili ufficiali: ${SOCIAL_LINKS.map((s) => s.href).join(", ")}
`;
}
