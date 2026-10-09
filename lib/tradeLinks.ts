import { TRADES, type Trade } from "@/lib/trades";

/**
 * The trades a blog post talks about, from the words it uses: each post links to their Turin pages,
 * so the articles pass relevance to the pages that should rank for "<mestiere> Torino".
 */
const WORDS: Record<string, RegExp> = {
  idraulico: /\b(idraulic\w*|rubinett\w*|flessibil\w*|scaric\w*|sifon\w*|addolcitor\w*|disconnettor\w*|tubazion\w*|perdit\w* d.acqua|pompa di sollevamento)/gi,
  elettricista: /\b(elettric\w*|contator\w*|salvavita|differenzial\w*|quadr\w* elettric\w*|pres[ae] |prolung\w*|interruttor\w*|magnetotermic\w*|scaricator\w*)/gi,
  termoidraulico: /\b(termoidraulic\w*|caldai\w*|termosifon\w*|riscaldament\w*|valvol\w* termostatic\w*)/gi,
  "tecnico-climatizzazione": /\b(climatizz\w*|condizionator\w*|split|condensa|aria condizionata)/gi,
  serramentista: /\b(serrament\w*|infiss\w*|tapparell\w*|zanzarier\w*|finestr\w*|cassonett\w*|tende da sole)/gi,
  fabbro: /\b(fabbr\w*|serratur\w*|cilindr\w*|porta blindata|porte blindate)/gi,
  piastrellista: /\b(piastrell\w*|fughe|bagno da rifare|pavimento)/gi,
  imbianchino: /\b(imbianc\w*|pittur\w*|tinteggi\w*|facciat\w*|vernic\w*)/gi,
  muratore: /\b(murator\w*|massett\w*|intonac\w*|crep[ae]\b|grondai\w*|infiltrazion\w*)/gi,
  giardiniere: /\b(giardin\w*|prat[oi]\b|irrigazion\w*|trasemin\w*|siep\w*)/gi,
  vetraio: /\b(vetr[oi]\b|vetrocamer\w*|vetrat\w*)/gi,
};

export function tradesForPost(text: string, max = 2): Trade[] {
  return TRADES.map((t) => ({ t, n: (text.match(WORDS[t.slug] ?? /$^/g) ?? []).length }))
    .filter((x) => x.n >= 2)
    .sort((a, b) => b.n - a.n)
    .slice(0, max)
    .map((x) => x.t);
}
