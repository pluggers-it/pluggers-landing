import { test } from "node:test";
import assert from "node:assert/strict";
import { formatPost, postText } from "./postFormat.ts";

const POST_16 = `Benvenuti su Pluggers News, il blog per professionisti e artigiani che vogliono lavorare meglio.

Il menù di oggi:
1) Impianti Elettrici: I rischi delle strisce LED economiche.
2) Serramenti e Infissi: Prevenire la deformazione del PVC scuro.
3)Curiosità Storica: Perché il nastro isolante è nero?

⚡ Elettricità: La Trappola delle Strisce LED da Giardino
In estate, i clienti comprano strisce LED economiche online.

✏️ Il Consiglio di Pluggers:
Assicurati sempre che il materiale abbia un grado di protezione IP65 o IP67.
La mossa vincente: Proponi le tue strisce professionali.



🕰️ Curiosità Flash: Il Nastro Isolante Nero (1946)
Prima del 1946, gli elettricisti usavano nastro in cotone e catrame.



📱 L'Angolo di Pluggers
👉 Questo articolo ti è stato utile? Iscriviti alla newsletter completa: www.plggrs.it/newsletter

Nota: I nostri sono consigli generali.

Ci sentiamo presto!
Il Team di Pluggers
© 2026 Pluggers`;

test("post 16: every newsletter pattern gets its structure", () => {
  const out = formatPost(POST_16);
  assert.match(out, /<div class="post-box post-menu">\n\n<p class="post-label">In questo numero<\/p>\n\n1\. Impianti Elettrici/);
  assert.match(out, /^3\. Curiosità Storica: Perché il nastro isolante è nero\?$/m);
  assert.match(out, /^## <span class="post-emoji" aria-hidden="true">⚡<\/span> Elettricità: La Trappola/m);
  assert.match(out, /^## <span class="post-emoji" aria-hidden="true">🕰️<\/span> Curiosità Flash/m);
  assert.match(out, /<div class="post-box post-tip">\n\n<p class="post-label">Il Consiglio di Pluggers<\/p>/);
  assert.match(out, /^\*\*La mossa vincente:\*\* Proponi/m);
  assert.match(out, /<p class="post-label">L'Angolo di Pluggers<\/p>/);
  assert.match(out, /<div class="post-note">\n\nNota: I nostri/);
  assert.match(out, /<div class="post-signoff">\n\nCi sentiamo presto!\nIl Team di Pluggers\n\n<\/div>/);
  assert.doesNotMatch(out, /©/);
  assert.doesNotMatch(out, /\n{3,}/);
});

test("menu items numbered with no space after the parenthesis", () => {
  const out = formatPost("Il menù di oggi:\n1)Primo\n2)  Secondo");
  assert.match(out, /^1\. Primo\n2\. Secondo$/m);
});

test("newsletter address becomes a link, with or without protocol", () => {
  for (const url of ["www.plggrs.it/newsletter", "https://www.plggrs.it/newsletter", "plggrs.it/newsletter"]) {
    const out = formatPost(`👉 Condividila dal seguente link -> ${url} `);
    assert.match(out, /dal seguente link: \[plggrs\.it\/newsletter\]\(\/newsletter\)$/m, url);
  }
  const bare = formatPost("### 👉 Condividila tramite il link della newsletter");
  assert.match(bare, /tramite il link della \[newsletter\]\(\/newsletter\)/);
});

test("a post outside the scheme goes through unchanged", () => {
  const md = `Un'introduzione con **grassetto** e un [link](https://example.com).

## Un titolo

Un paragrafo con <span style="color:#8b5cf6">colore</span>.

- punto uno
- punto due

![foto](https://example.com/a.jpg)`;
  assert.equal(formatPost(md), md);
});

test("plain lines become titles only in posts without markdown headings", () => {
  const body = "\n\nCosa Rischi Tu e il Tuo Cliente\nSe una pompa di calore si guasta, il cliente riterrà te responsabile.";
  assert.match(formatPost(`Intro.${body}`), /^### Cosa Rischi Tu e il Tuo Cliente$/m);
  assert.match(formatPost(`## Già strutturato${body}`), /^Cosa Rischi Tu e il Tuo Cliente$/m);
});

test("lost line breaks are put back without splitting abbreviations or brand names", () => {
  const out = formatPost("## 1. Fotovoltaico da balcone e il ruolo dell'installatoreLa richiesta di pannelli è in forte crescita.\nI dati.Per questi ultimi serve la DiCo, anche per la S.p.A. e su iPhone.");
  assert.match(out, /^## 1\. Fotovoltaico da balcone e il ruolo dell'installatore\n\nLa richiesta di pannelli/m);
  assert.match(out, /I dati\.\n\nPer questi ultimi serve la DiCo, anche per la S\.p\.A\. e su iPhone\./);
});

test("excerpt text skips the menu, the labels and the sign-off", () => {
  const text = postText(POST_16);
  assert.ok(text.startsWith("Benvenuti su Pluggers News"));
  assert.doesNotMatch(text, /In questo numero|Il Consiglio di Pluggers|Ci sentiamo|Impianti Elettrici: I rischi/);
});

test("a line that is only emphasis, with text below, becomes a subheading", () => {
  const out = formatPost("## Titolo\nTesto.\n*Cosa si rischia*\nSanzioni pesanti.\n\n*Una frase in corsivo.*\nAltro testo.");
  assert.match(out, /^Testo\.\n\n#### Cosa si rischia\nSanzioni pesanti\.$/m);
  assert.match(out, /^\*Una frase in corsivo\.\*$/m);
});
