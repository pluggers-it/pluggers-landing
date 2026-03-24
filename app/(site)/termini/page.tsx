import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Termini e Condizioni",
  description:
    "Termini e Condizioni Generali di Utilizzo della piattaforma Pluggers.",
  alternates: { canonical: "https://pluggers.it/termini" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-sans text-lg font-bold tracking-tight text-[var(--color-foreground)]">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-7 text-[var(--color-muted)]">
        {children}
      </div>
    </section>
  );
}

function Bold({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-[var(--color-foreground)]">{children}</strong>;
}

export default function TerminiPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="relative mx-auto w-full max-w-2xl px-6 py-12 sm:px-10">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12),transparent_60%)] blur-3xl" />
        </div>

        <div className="relative">
          <SiteHeader label="PLUGGERS // TERMINI" />

          <main className="mt-12 space-y-10">

            {/* Header */}
            <div>
              <p className="font-mono text-xs tracking-[0.25em] text-[var(--color-accent)]">DOCUMENTO LEGALE</p>
              <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight">
                Termini e Condizioni
              </h1>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                <Bold>Ultimo aggiornamento: 23 Marzo 2026</Bold>
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                Benvenuto su Pluggers. I presenti Termini e Condizioni (di seguito, <Bold>&quot;Termini&quot;</Bold>)
                costituiscono un <Bold>accordo legale vincolante</Bold> tra l&apos;utente (Professionista o Cliente)
                e Pluggers. Attualmente, in attesa della formale costituzione della società{" "}
                <Bold>Pluggers s.r.l.</Bold>, i servizi sono erogati e gestiti da{" "}
                <Bold>Gianmarco Piras</Bold>, con sede in{" "}
                <Bold>Via Sardegna 39/A, Decimoputzu (SU)</Bold> (di seguito, &quot;Pluggers&quot;, &quot;noi&quot;
                o il &quot;Gestore&quot;).
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                <Bold>L&apos;accesso, la navigazione e l&apos;utilizzo dei nostri servizi comportano
                l&apos;accettazione espressa dei presenti Termini.</Bold>
              </p>
            </div>

            <hr className="border-[var(--color-border)]" />

            {/* 1 */}
            <Section title="1. Definizioni">
              <ul className="list-inside list-disc space-y-2 pl-1">
                <li>
                  <Bold>Piattaforma:</Bold> Indica l&apos;insieme dei servizi digitali (sito web, newsletter, futura
                  App mobile e WebApp) forniti da Pluggers.
                </li>
                <li>
                  <Bold>Utente Cliente (o &quot;Cliente&quot;):</Bold> L&apos;utente consumatore finale che utilizza
                  la Piattaforma per cercare, prenotare e gestire interventi artigianali.
                </li>
                <li>
                  <Bold>Utente Professionista (o &quot;Artigiano&quot;):</Bold> Il lavoratore autonomo o l&apos;impresa
                  che utilizza la Piattaforma come strumento gestionale e come vetrina per offrire i propri servizi
                  ai Clienti.
                </li>
                <li>
                  <Bold>Servizi di Terzi (Contratto d&apos;Opera):</Bold> I lavori manuali o intellettuali eseguiti
                  dai Professionisti in favore dei Clienti, disciplinati dagli{" "}
                  <Bold>Artt. 2222 e seguenti del Codice Civile italiano</Bold>.
                </li>
              </ul>
            </Section>

            {/* 2 */}
            <Section title="2. Oggetto del Servizio e Fasi di Rilascio">
              <p>L&apos;offerta di Pluggers si articola nelle seguenti fasi:</p>
              <ul className="list-inside list-disc space-y-3 pl-1">
                <li>
                  <Bold>Fase 1 (Attuale — Waitlist e Informativa):</Bold> Erogazione di newsletter informativa
                  per aggiornamenti sul mondo artigiano e inserimento in lista d&apos;attesa per il rilascio
                  dell&apos;applicazione. In questa fase, Pluggers procede alla{" "}
                  <Bold>pre-creazione dell&apos;account professionale</Bold> per facilitare il futuro processo di
                  onboarding.
                </li>
                <li>
                  <Bold>Fase 2 (Piattaforma Operativa):</Bold> Rilascio dell&apos;applicazione omnicanale che
                  fungerà da <Bold>marketplace e calendario digitale</Bold> per i Clienti, e da{" "}
                  <Bold>software gestionale</Bold> per i Professionisti.
                </li>
              </ul>
            </Section>

            {/* 3 */}
            <Section title="3. Requisiti di Accesso e Registrazione">
              <ul className="list-inside list-disc space-y-3 pl-1">
                <li>
                  <Bold>Maggiore età:</Bold> In ottemperanza all&apos;Art. 8 del GDPR e alle disposizioni
                  contrattuali vigenti, il servizio è rivolto esclusivamente a soggetti{" "}
                  <Bold>maggiorenni (18+)</Bold>.
                </li>
                <li>
                  <Bold>Dati e Finalizzazione:</Bold> I dati forniti in fase di pre-registrazione (nome, cognome,
                  email, telefono, regione, tipologia professionale) dovranno essere integrati e confermati al
                  rilascio dell&apos;App. Gli Utenti Professionisti saranno tenuti a fornire la propria{" "}
                  <Bold>Partita IVA</Bold> e gli estremi della propria{" "}
                  <Bold>abilitazione professionale</Bold>, ove richiesta dalla legge.
                </li>
                <li>
                  <Bold>Responsabilità delle credenziali:</Bold> L&apos;Utente è l&apos;unico responsabile
                  della custodia e della segretezza delle proprie credenziali di accesso.
                </li>
              </ul>
            </Section>

            {/* 4 */}
            <Section title="4. Condizioni Economiche (Ai sensi del D.Lgs. 70/2003)">
              <ul className="list-inside list-disc space-y-3 pl-1">
                <li>
                  <Bold>Utilizzo Base:</Bold> Attualmente, l&apos;iscrizione alla waitlist e la fruizione della
                  Piattaforma nelle sue funzionalità base sono a titolo <Bold>gratuito</Bold>.
                </li>
                <li>
                  <Bold>Commissioni sulle Transazioni:</Bold> Pluggers si riserva il diritto unilaterale di
                  introdurre, in futuro, commissioni (fee) sulle transazioni concluse tramite l&apos;App, sia a
                  carico dei Clienti che dei Professionisti (Art. 1322 c.c.). Ogni modifica delle condizioni
                  economiche sarà comunicata agli utenti con un preavviso di almeno{" "}
                  <Bold>30 (trenta) giorni</Bold>. In caso di mancata accettazione, l&apos;utente avrà il diritto
                  di recedere dal servizio senza penali.
                </li>
              </ul>
            </Section>

            {/* 5 */}
            <Section title="5. Contenuti Generati dagli Utenti (UGC) e Uso dell'Intelligenza Artificiale">
              <p>
                La Piattaforma consentirà il caricamento di contenuti quali recensioni e materiale fotografico
                dei danni da riparare.
              </p>
              <ul className="list-inside list-disc space-y-3 pl-1">
                <li>
                  <Bold>Integrazione AI:</Bold> Le immagini relative ai danni da riparare e le richieste testuali
                  caricate dagli utenti verranno sottoposte a elaborazione algoritmica tramite sistemi di{" "}
                  <Bold>Intelligenza Artificiale</Bold> per ottimizzare l&apos;erogazione del servizio (stima
                  dell&apos;intervento, categorizzazione). L&apos;utente concede a Pluggers una{" "}
                  <Bold>licenza d&apos;uso gratuita, non esclusiva e trasferibile</Bold> su tali contenuti al
                  solo scopo di far funzionare e migliorare il servizio.
                </li>
                <li>
                  <Bold>Responsabilità sui Contenuti:</Bold> L&apos;utente garantisce di detenere i diritti sui
                  contenuti caricati e si impegna a non inserire recensioni false, diffamatorie o materiale lesivo
                  dei diritti di terzi. Ai sensi dell&apos;Art. 16 del D.Lgs. 70/2003, Pluggers, in qualità di
                  hosting provider, non è soggetto a un obbligo generale di sorveglianza sui contenuti, ma
                  provvederà alla loro tempestiva rimozione qualora venga a conoscenza della loro illiceità.
                </li>
              </ul>
            </Section>

            {/* 6 */}
            <Section title="6. Limitazione di Responsabilità">
              <p>
                Pluggers agisce esclusivamente in qualità di{" "}
                <Bold>fornitore di servizi della società dell&apos;informazione e intermediario tecnologico</Bold>,
                facilitando il contatto tra Cliente e Professionista.
              </p>
              <ul className="list-inside list-disc space-y-3 pl-1">
                <li>
                  <Bold>Nessuna responsabilità sull&apos;esecuzione:</Bold> Il contratto d&apos;opera
                  (Art. 2222 c.c. e ss.) per la prestazione dei servizi artigianali si perfeziona{" "}
                  <Bold>esclusivamente tra il Cliente e il Professionista</Bold>. Pluggers è del tutto estranea
                  a tale rapporto negoziale.
                </li>
                <li>
                  <Bold>Esonero danni:</Bold> Pluggers non garantisce in alcun modo l&apos;esito, la qualità, le
                  tempistiche o la conformità a regola d&apos;arte degli interventi effettuati dai Professionisti,
                  né garantisce la solvibilità dei Clienti. Fatti salvi i casi di{" "}
                  <Bold>dolo o colpa grave di Pluggers</Bold>, quest&apos;ultima non potrà in alcun caso essere
                  ritenuta responsabile per danni diretti, indiretti, materiali o morali derivanti dall&apos;
                  esecuzione o mancata esecuzione dell&apos;intervento artigianale.
                </li>
              </ul>
            </Section>

            {/* 7 */}
            <Section title="7. Trattamento dei Dati Personali">
              <p>
                I dati personali degli utenti sono trattati nel rispetto del{" "}
                <Bold>Regolamento (UE) 2016/679 (GDPR)</Bold> e del D.Lgs. 196/2003 e successive modifiche. Per
                i dettagli completi su finalità, modalità di trattamento e diritti degli interessati, l&apos;utente
                è invitato a consultare l&apos;{" "}
                <Link
                  href="/privacy"
                  className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-foreground)]"
                >
                  Informativa sulla Privacy
                </Link>
                , reperibile sulla Piattaforma o richiedibile all&apos;indirizzo{" "}
                <a href="mailto:support@plggrs.it" className="text-[var(--color-accent)] underline underline-offset-2">
                  support@plggrs.it
                </a>.
              </p>
            </Section>

            {/* 8 */}
            <Section title="8. Sospensione e Risoluzione dell'Account">
              <p>
                Ai sensi dell&apos;<Bold>Art. 1456 c.c. (Clausola risolutiva espressa)</Bold>, Pluggers si riserva
                il diritto di <Bold>sospendere o cancellare l&apos;account</Bold> di un utente, senza preavviso
                e senza diritto ad alcun risarcimento, qualora l&apos;utente violi le disposizioni di cui ai
                punti 3 (Veridicità dei dati), 5 (Caricamento di contenuti illeciti) o tenga comportamenti
                fraudolenti o lesivi della reputazione della Piattaforma.
              </p>
            </Section>

            {/* 9 */}
            <Section title="9. Legge Applicabile e Foro Competente">
              <ul className="list-inside list-disc space-y-3 pl-1">
                <li>
                  <Bold>Legge Applicabile:</Bold> I presenti Termini sono regolati in via esclusiva dalla{" "}
                  <Bold>Legge Italiana</Bold>.
                </li>
                <li>
                  <Bold>Foro B2C (Clienti Consumatori):</Bold> Qualora il Cliente agisca in qualità di
                  &quot;Consumatore&quot; ai sensi dell&apos;Art. 3 del Codice del Consumo (D.Lgs. 206/2005), per
                  ogni controversia sarà competente in via esclusiva il{" "}
                  <Bold>Foro del luogo di residenza o domicilio del consumatore</Bold>, se ubicato nel territorio
                  dello Stato.
                </li>
                <li>
                  <Bold>Foro B2B (Professionisti):</Bold> Per ogni controversia derivante dall&apos;utilizzo della
                  Piattaforma da parte di Utenti Professionisti (soggetti con Partita IVA), la competenza
                  territoriale spetta in via esclusiva al <Bold>Foro di Decimoputzu (SU)</Bold>; a seguito della
                  costituzione della società Pluggers s.r.l., la competenza esclusiva si trasferirà
                  inderogabilmente al <Bold>Foro di Torino</Bold>.
                </li>
              </ul>
            </Section>

            {/* Clausole ex 1341 */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5 text-sm leading-7 text-[var(--color-muted)]">
              <p>
                Ai sensi e per gli effetti degli <Bold>Artt. 1341 e 1342 del Codice Civile italiano</Bold>,
                l&apos;Utente dichiara di aver letto attentamente e di <Bold>approvare specificamente</Bold> le
                seguenti clausole:{" "}
                <Bold>4</Bold> (Modifiche delle Condizioni Economiche),{" "}
                <Bold>5</Bold> (Licenza d&apos;uso dei contenuti UGC e AI),{" "}
                <Bold>6</Bold> (Limitazione di Responsabilità per il Contratto d&apos;Opera),{" "}
                <Bold>8</Bold> (Sospensione e Risoluzione dell&apos;Account) e{" "}
                <Bold>9</Bold> (Legge Applicabile e Foro Competente).
              </p>
            </div>

            <div className="flex items-center gap-4 border-t border-[var(--color-border)] pt-8">
              <Link
                href="/privacy"
                className="font-mono text-xs text-[var(--color-accent)] underline-offset-4 hover:underline"
              >
                Privacy Policy →
              </Link>
              <Link
                href="/"
                className="font-mono text-xs text-[var(--color-muted)] underline-offset-4 hover:underline"
              >
                ← Home
              </Link>
            </div>
          </main>

          <div className="mt-12">
            <SiteFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
