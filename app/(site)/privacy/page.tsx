import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Informativa sul trattamento dei dati personali per Pluggers: iscrizione waitlist, newsletter e utilizzo del sito.",
  alternates: { canonical: "https://pluggers.it/privacy" },
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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="relative mx-auto w-full max-w-2xl px-6 py-12 sm:px-10">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12),transparent_60%)] blur-3xl" />
        </div>

        <div className="relative">
          <SiteHeader label="PLUGGERS // PRIVACY" />

          <main className="mt-12 space-y-10">

            {/* Header */}
            <div>
              <p className="font-mono text-xs tracking-[0.25em] text-[var(--color-accent)]">DOCUMENTO LEGALE</p>
              <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight">
                Informativa sulla Privacy
              </h1>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                <Bold>Ultimo aggiornamento: 23 Marzo 2026</Bold>
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                Benvenuto sul nostro sito. La tua privacy è molto importante per noi. In questa pagina ti spieghiamo
                in modo trasparente quali dati personali raccogliamo, perché li raccogliamo, come li proteggiamo e
                quali sono i tuoi diritti, in stretta conformità con il{" "}
                <Bold>Regolamento (UE) 2016/679 (GDPR)</Bold> e il{" "}
                <Bold>D.Lgs. 196/2003 (Codice della Privacy)</Bold> e successive modifiche.
              </p>
            </div>

            <hr className="border-[var(--color-border)]" />

            {/* 1 */}
            <Section title="1. Chi è il Titolare del Trattamento?">
              <p>
                Ai sensi degli Artt. 4(7) e 24 del GDPR, in attesa della formale costituzione della società{" "}
                <Bold>Pluggers s.r.l.</Bold>, il Titolare del Trattamento dei dati è:
              </p>
              <ul className="space-y-1 pl-1">
                <li><Bold>Nome e Cognome:</Bold> Gianmarco Piras</li>
                <li><Bold>Sede:</Bold> Via Sardegna 39/A, Decimoputzu (SU)</li>
                <li>
                  <Bold>Email di contatto:</Bold>{" "}
                  <a href="mailto:support@plggrs.it" className="text-[var(--color-accent)] underline underline-offset-2">
                    support@plggrs.it
                  </a>
                </li>
              </ul>
            </Section>

            {/* 2 */}
            <Section title="2. Quali dati raccogliamo?">
              <p>
                Nel rispetto del principio di <Bold>minimizzazione dei dati</Bold> (Art. 5(1)(c) del GDPR), raccogliamo
                solo i dati strettamente necessari per offrirti i nostri servizi. Nello specifico:
              </p>
              <ul className="list-inside list-disc space-y-2 pl-1">
                <li>
                  <Bold>Dati forniti volontariamente dall&apos;utente:</Bold> Nome, cognome, indirizzo email, numero
                  di telefono, regione di residenza e tipologia professionale.
                </li>
                <li>
                  <Bold>Dati di navigazione:</Bold> Tramite <Bold>Google Analytics 4 (GA4)</Bold> raccogliamo
                  informazioni statistiche anonimizzate su come utilizzi il nostro sito (es. pagine visitate,
                  tempo di permanenza), <Bold>previo tuo esplicito consenso</Bold> tramite il nostro Cookie Banner.
                </li>
              </ul>
            </Section>

            {/* 3 */}
            <Section title="3. Perché raccogliamo i tuoi dati (Finalità e Base Giuridica)?">
              <p>
                Utilizziamo i tuoi dati esclusivamente per le seguenti finalità, basandoci sulle condizioni di
                liceità previste dall&apos;<Bold>Art. 6 del GDPR</Bold>:
              </p>
              <ul className="list-inside list-disc space-y-3 pl-1">
                <li>
                  <Bold>A. Waitlist e rilascio App:</Bold> Per inserirti nella nostra lista d&apos;attesa, inviarti
                  la notifica di rilascio dell&apos;applicazione (anche tramite invito su WhatsApp) e pre-creare il
                  tuo account professionale per facilitare il processo di onboarding.{" "}
                  <em>(Base giuridica: Esecuzione di misure precontrattuali ai sensi dell&apos;Art. 6(1)(b) e
                  Consenso ai sensi dell&apos;Art. 6(1)(a))</em>
                </li>
                <li>
                  <Bold>B. Newsletter:</Bold> Per inviarti aggiornamenti, curiosità sul mondo artigiano e
                  comunicazioni relative al nostro progetto.{" "}
                  <em>(Base giuridica: Consenso espresso ai sensi dell&apos;Art. 6(1)(a))</em>
                </li>
                <li>
                  <Bold>C. Contatto Commerciale:</Bold> Per poterti contattare telefonicamente con proposte
                  commerciali relative ai nostri futuri servizi.{" "}
                  <em>(Base giuridica: Consenso espresso ai sensi dell&apos;Art. 6(1)(a))</em>
                </li>
                <li>
                  <Bold>D. Statistiche di navigazione:</Bold> Per analizzare il traffico sul sito e migliorarne
                  le prestazioni.{" "}
                  <em>(Base giuridica: Consenso espresso ai sensi dell&apos;Art. 6(1)(a) tramite Cookie Banner)</em>
                </li>
              </ul>
            </Section>

            {/* 4 */}
            <Section title="4. Dove e come salviamo i tuoi dati?">
              <p>
                I tuoi dati sono trattati con strumenti informatici sicuri e sono conservati su{" "}
                <Bold>server cloud situati all&apos;interno dell&apos;Unione Europea</Bold>. Ai sensi dell&apos;
                <Bold>Art. 32 del GDPR</Bold>, adottiamo misure di sicurezza tecniche e organizzative adeguate
                (inclusa la <Bold>crittografia dei dati</Bold>) per garantire un livello di sicurezza proporzionato
                al rischio.
              </p>
              <p>
                <Bold>I dati non vengono mai venduti a terzi.</Bold> Per l&apos;erogazione dei servizi ci affidiamo
                a fornitori esterni di comprovata affidabilità, regolarmente nominati{" "}
                <Bold>Responsabili del Trattamento</Bold> ai sensi dell&apos;Art. 28 del GDPR.
              </p>
            </Section>

            {/* 5 */}
            <Section title="5. Per quanto tempo conserviamo i dati (Data Retention)?">
              <p>
                Nel rispetto del principio di <Bold>limitazione della conservazione</Bold> (Art. 5(1)(e) del GDPR),
                i tuoi dati personali legati all&apos;iscrizione verranno conservati{" "}
                <Bold>fino alla tua richiesta di disiscrizione o revoca del consenso</Bold>. In fondo a ogni nostra
                email troverai sempre un link per disiscriverti con un solo clic.
              </p>
            </Section>

            {/* 6 */}
            <Section title="6. Protezione dei Minori">
              <p>
                In ottemperanza all&apos;<Bold>Art. 8 del GDPR</Bold>, il nostro servizio è rivolto
                esclusivamente a un pubblico <Bold>maggiorenne (18+)</Bold>. Non raccogliamo intenzionalmente dati
                personali di minori. Se dovessimo accorgerci di aver raccolto dati di un minore senza il consenso
                dei titolari della responsabilità genitoriale, provvederemo a cancellarli immediatamente.
              </p>
            </Section>

            {/* 7 */}
            <Section title="7. Quali sono i tuoi diritti?">
              <p>
                Ai sensi degli <Bold>Artt. 15–22 del GDPR</Bold>, hai il diritto di contattarci in qualsiasi
                momento all&apos;indirizzo{" "}
                <a href="mailto:support@plggrs.it" className="text-[var(--color-accent)] underline underline-offset-2">
                  support@plggrs.it
                </a>{" "}
                per esercitare i tuoi diritti, tra cui:
              </p>
              <ul className="list-inside list-disc space-y-2 pl-1">
                <li><Bold>Diritto di Accesso (Art. 15):</Bold> Sapere quali dati possediamo e ottenerne copia.</li>
                <li><Bold>Diritto di Rettifica (Art. 16):</Bold> Correggere dati inesatti o incompleti.</li>
                <li><Bold>Diritto alla Cancellazione / &quot;Oblio&quot; (Art. 17):</Bold> Richiedere la rimozione dei tuoi dati.</li>
                <li><Bold>Diritto di Limitazione (Art. 18) e Opposizione (Art. 21):</Bold> Limitare o opporti al trattamento dei dati.</li>
                <li><Bold>Diritto alla Portabilità (Art. 20):</Bold> Ricevere i tuoi dati in un formato strutturato e leggibile da dispositivo automatico.</li>
                <li>
                  <Bold>Revoca del consenso (Art. 7(3)):</Bold> Puoi revocare in qualsiasi momento il consenso
                  prestato, senza pregiudicare la liceità del trattamento basata sul consenso prima della revoca.
                </li>
              </ul>
              <p>
                Se ritieni che il trattamento dei tuoi dati violi la normativa, ai sensi dell&apos;
                <Bold>Art. 77 del GDPR</Bold> hai il diritto di proporre reclamo all&apos;
                <Bold>Autorità Garante per la Protezione dei Dati Personali</Bold>{" "}
                (
                <a
                  href="https://www.garanteprivacy.it"
                  className="text-[var(--color-accent)] underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  garanteprivacy.it
                </a>
                ).
              </p>
            </Section>

            <div className="flex items-center gap-4 border-t border-[var(--color-border)] pt-8">
              <Link
                href="/termini"
                className="font-mono text-xs text-[var(--color-accent)] underline-offset-4 hover:underline"
              >
                Termini e Condizioni →
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
