import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Termini e Condizioni — Pluggers",
  description:
    "Termini e condizioni d'uso dell'app e del sito Pluggers: ruolo di intermediario, Costo Chiamata, preventivi, recensioni.",
  alternates: { canonical: `${COMPANY.siteUrl}/termini` },
  robots: COMPANY.isDraft ? { index: false, follow: false } : undefined,
};

export default function TerminiPage() {
  return <LegalPage slug="termini" label="PLUGGERS // TERMINI" />;
}
