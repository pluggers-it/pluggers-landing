import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { LegalPage, SupportEmail, type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = pageMetadata({
  title: "Assistenza",
  description:
    "Assistenza Pluggers: come contattarci per un problema con l'app, una prenotazione o il tuo account, e come chiedere l'eliminazione dell'account e dei dati.",
  path: "/supporto",
});

const LINK = "font-semibold text-accent-text underline underline-offset-4";

// Same content as the app's support page (pluggers-it/mvp, app/web/legal/supporto.html).
const SECTIONS: LegalSection[] = [
  {
    id: "contatti",
    title: "Contatti",
    content: (
      <>
        <p>
          Email: <SupportEmail />
        </p>
        <p>
          Se scrivi per una richiesta o una prenotazione, indica l&apos;email del tuo account: ci
          aiuta a trovarla subito.
        </p>
      </>
    ),
  },
  {
    id: "eliminare-account",
    title: "Eliminare l'account",
    content: (
      <>
        <p>
          Dall&apos;app: Impostazioni → Account e privacy → Elimina account. Se non riesci ad
          accedere, scrivici dall&apos;email con cui ti sei registrato e lo facciamo noi.
        </p>
        <p>
          Cosa viene cancellato e cosa la legge ci obbliga a conservare:{" "}
          <Link href="/elimina-account" className={LINK}>
            Eliminare il tuo account
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: "documenti",
    title: "Documenti",
    content: (
      <ul>
        <li>
          <Link href="/privacy" className={`${LINK} inline-flex min-h-12 items-center`}>
            Informativa sulla privacy
          </Link>
        </li>
        <li>
          <Link href="/termini" className={`${LINK} inline-flex min-h-12 items-center`}>
            Termini e condizioni
          </Link>
        </li>
      </ul>
    ),
  },
];

export default function SupportoPage() {
  return (
    <LegalPage
      title="Assistenza"
      updated="7 ottobre 2026"
      intro={
        <p>Per qualsiasi problema con l&apos;app, una prenotazione o il tuo account, scrivici.</p>
      }
      sections={SECTIONS}
    />
  );
}
