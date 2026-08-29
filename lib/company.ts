/**
 * Dati societari — FONTE UNICA per tutte le pagine legali (web) e citabili in
 * app. Compila questo blocco UNA VOLTA alla costituzione della SRL: i token
 * {{titolare}}, {{piva}}, {{pec}}, {{sede}}, {{privacyEmail}} nei markdown
 * legali (content/legal/*.md) vengono riempiti da qui in fase di render.
 *
 * `isDraft = true` finché non ci sono (a) i dati SRL reali e (b) la revisione
 * di un avvocato: mostra un banner "bozza" e tiene le pagine noindex.
 */
export const COMPANY = {
  /** Denominazione legale completa. */
  legalName: "Pluggers S.r.l. (in costituzione)",
  /** Partita IVA — da inserire alla costituzione. */
  vat: "DA COMPLETARE",
  /** PEC. */
  pec: "DA COMPLETARE",
  /** Sede legale. */
  registeredOffice: "DA COMPLETARE",
  /** Contatto per la privacy / esercizio dei diritti. */
  privacyEmail: "privacy@pluggers.it",
  /** Assistenza generale. */
  supportEmail: "supporto@pluggers.it",
  /** Dominio canonico del sito (allinea qui plggrs.it ⇄ pluggers.it). */
  siteUrl: "https://pluggers.it",
  /** Versione del testo legale: deve combaciare con kLegalVersion nell'app. */
  legalVersion: "2026-07-11",
  /** true finché mancano dati SRL + revisione legale. */
  isDraft: true,
} as const;

/** Sostituisce i token {{...}} nel markdown legale coi valori societari. */
export function fillLegalTokens(md: string): string {
  return md
    .replaceAll("{{titolare}}", COMPANY.legalName)
    .replaceAll("{{piva}}", COMPANY.vat)
    .replaceAll("{{pec}}", COMPANY.pec)
    .replaceAll("{{sede}}", COMPANY.registeredOffice)
    .replaceAll("{{privacyEmail}}", COMPANY.privacyEmail)
    .replaceAll("{{supportEmail}}", COMPANY.supportEmail)
    .replaceAll("{{versione}}", COMPANY.legalVersion);
}
