import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { LegalPage, SupportEmail, type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = pageMetadata({
  title: "Termini e Condizioni",
  description:
    "Le condizioni d'uso di Pluggers per clienti e professionisti: ruolo della piattaforma, Costo Chiamata, preventivi, pagamenti, chat, recensioni, responsabilità.",
  path: "/termini",
});

// The terms and the professionals' terms are the app's (pluggers-it/mvp, app/web/legal/termini.html
// and the proTerms* strings of app_it.arb) word for word: they are the texts users accept.
const SECTIONS: LegalSection[] = [
  {
    id: "cosa-e-pluggers",
    title: "Cosa è Pluggers",
    content: (
      <p>
        Pluggers è una piattaforma di intermediazione: ti mette in contatto con professionisti
        indipendenti per interventi domestici. Non eseguiamo noi gli interventi e non siamo parte
        del contratto tra te e il professionista.
      </p>
    ),
  },
  {
    id: "costo-chiamata",
    title: "Costo Chiamata",
    content: (
      <p>
        Alla prenotazione può essere dovuto un «Costo Chiamata» al professionista per presentarsi
        e valutare il lavoro, anche se l&apos;intervento non risulta fattibile. L&apos;importo te
        lo indica il professionista nell&apos;app prima della visita, e lo paghi a lui: non si
        paga in app.
      </p>
    ),
  },
  {
    id: "preventivi-e-pagamenti",
    title: "Preventivi e pagamenti",
    content: (
      <p>
        Il prezzo dell&apos;intervento è quello del preventivo che accetti. I pagamenti in-app,
        quando attivi, sono gestiti da provider certificati; fino ad allora l&apos;accordo
        economico è tra te e il professionista.
      </p>
    ),
  },
  {
    id: "chat-e-contatti",
    title: "Chat e contatti",
    content: (
      <p>
        Ti tuteliamo per quello che succede nell&apos;app: assistenza, gestione delle
        contestazioni, recensioni verificate e, quando attivi, pagamenti protetti. Se vi accordate
        su altri canali (telefono, email, messaggi, social) non vediamo cosa succede, non possiamo
        intervenire e non rispondiamo di quegli accordi, fermi i diritti che la legge ti
        riconosce. Per questo non scambiare numeri di telefono, email o altri recapiti per
        continuare fuori dall&apos;app, nemmeno con foto, video, documenti, immagini di testo o
        link esterni: se lo riteniamo un abuso del servizio possiamo sospendere o chiudere
        l&apos;account, a nostra discrezione. Ti diciamo il motivo e puoi chiedere un riesame.
        Quello che ricevi in chat, allegati compresi, puoi usarlo solo per l&apos;intervento
        richiesto.
      </p>
    ),
  },
  {
    id: "recensioni",
    title: "Recensioni",
    content: (
      <p>
        Puoi recensire un professionista solo dopo un intervento completato. Le recensioni devono
        essere veritiere e rispettose.
      </p>
    ),
  },
  {
    id: "responsabilita",
    title: "Responsabilità",
    content: (
      <p>
        Pluggers non è responsabile della qualità dell&apos;intervento eseguito dal
        professionista, ma si adopera per la sicurezza e la trasparenza della piattaforma e per
        la gestione delle segnalazioni.
      </p>
    ),
  },
  {
    id: "contatti-e-foro",
    title: "Contatti e foro",
    content: (
      <p>
        Per assistenza: <SupportEmail />. Le condizioni complete, inclusa la disciplina del
        recesso del consumatore e il foro competente, sono in fase di revisione legale.
      </p>
    ),
  },
  {
    id: "professionisti",
    title: "Termini e Privacy per i professionisti",
    content: (
      <>
        <p>
          Se ti registri come professionista, oltre ai Termini e alla Privacy generali accetti
          anche queste condizioni specifiche. Sono un riassunto leggibile; la versione
          contrattuale completa è in revisione legale ed è disponibile su richiesta a{" "}
          <SupportEmail />.
        </p>
        <p className="text-[15px] text-muted">Versione 2026-09-26</p>
        <h3>Il tuo ruolo</h3>
        <p>
          Operi su Pluggers come professionista indipendente. Pluggers è una piattaforma di
          intermediazione: non è il tuo datore di lavoro, non esegue gli interventi e non è parte
          del contratto tra te e il cliente.
        </p>
        <h3>Requisiti e Partita IVA</h3>
        <p>
          Dichiari di avere una Partita IVA valida e tutti i requisiti di legge (abilitazioni,
          assicurazioni e autorizzazioni) per le attività che offri. Sei responsabile della tua
          posizione fiscale e previdenziale e degli adempimenti di legge legati al tuo lavoro.
        </p>
        <h3>Come lavori</h3>
        <p>
          Ti impegni a svolgere gli interventi a regola d&apos;arte e in sicurezza, a fornire
          preventivi chiari e a rispettare gli accordi presi con il cliente. Le competenze che
          dichiari devono essere veritiere: una falsa dichiarazione può comportare la sospensione
          dell&apos;account e le conseguenze previste dalla legge.
        </p>
        <h3>Cosa mostriamo ai clienti</h3>
        <p>
          Per farti trovare mostriamo ai clienti il tuo profilo professionale: nome (con il cognome
          puntato), mestieri e competenze dichiarate, città in cui operi, disponibilità e
          recensioni ricevute. Il documento d&apos;identità che carichi serve solo alla verifica e
          NON viene mostrato ai clienti.
        </p>
        <h3>Recensioni e reputazione</h3>
        <p>
          I clienti possono recensirti dopo un intervento completato. Le recensioni veritiere
          restano visibili; ci adoperiamo contro quelle abusive, ma non le rimuoviamo solo perché
          negative.
        </p>
        <h3>Sospensione</h3>
        <p>
          Possiamo sospendere o chiudere il tuo profilo in caso di false dichiarazioni, condotte
          scorrette verso i clienti, o violazioni di legge o di questi termini. Assistenza,
          gestione delle contestazioni, recensioni verificate e, quando attivi, pagamenti protetti
          valgono solo per quello che succede nell&apos;app: sugli accordi presi con il cliente su
          altri canali non abbiamo visibilità, non possiamo intervenire e non ne rispondiamo. Per
          questo, se scambi o chiedi recapiti per continuare con il cliente fuori dall&apos;app,
          anche con foto, video, documenti, immagini di testo o link esterni, e a nostra
          discrezione lo riteniamo un abuso del servizio, possiamo sospendere o chiudere il
          profilo. Ti diciamo il motivo e puoi chiedere un riesame. Se chiudiamo il profilo in modo
          definitivo ti avvisiamo almeno 30 giorni prima, salvo violazioni ripetute di questi
          termini o altri casi previsti dalla legge. Quello che ricevi in chat, allegati compresi,
          puoi usarlo solo per l&apos;intervento richiesto.
        </p>
        <h3>Trattamento dei tuoi dati</h3>
        <p>
          Trattiamo i tuoi dati professionali per erogare il servizio, metterti in contatto con i
          clienti e adempiere agli obblighi di legge. Valgono i diritti e le modalità
          dell&apos;Informativa sulla privacy; per esercitarli: <SupportEmail />.
        </p>
        <h3>Contatti e revisione</h3>
        <p>
          Per assistenza: <SupportEmail />. Le condizioni complete, incluse responsabilità,
          recesso e foro competente, sono in fase di revisione legale.
        </p>
      </>
    ),
  },
  {
    id: "sito",
    title: "Il sito plggrs.it",
    content: (
      <>
        <p>
          Il sito e l&apos;app Pluggers sono gestiti da Pluggers S.r.l., con sede legale in
          Torino, Corso Valdocco 2, Partita IVA e codice fiscale 13523080011.
        </p>
        <p>
          Sul sito puoi iscriverti gratuitamente alla lista d&apos;attesa e alla newsletter. Se ti
          iscrivi come professionista possiamo pre-creare il tuo account, per semplificarti
          l&apos;accesso all&apos;app. Per i dati che lasci nel modulo vale la sezione «Il sito
          plggrs.it» dell&apos;
          <Link href="/privacy#sito" className="font-semibold text-accent-text underline underline-offset-4">
            Informativa sulla privacy
          </Link>
          .
        </p>
      </>
    ),
  },
];

export default function TerminiPage() {
  return (
    <LegalPage
      title="Termini e condizioni"
      updated="9 ottobre 2026"
      version="2026-10-06"
      intro={
        <p>
          Usando Pluggers accetti questi termini. Sono un riassunto leggibile; la versione
          contrattuale completa è disponibile su richiesta.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
