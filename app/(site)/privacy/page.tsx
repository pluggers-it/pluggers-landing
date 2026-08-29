import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Privacy Policy — Pluggers",
  description:
    "Informativa sul trattamento dei dati personali degli utenti dell'app e del sito Pluggers (artt. 13-14 GDPR).",
  alternates: { canonical: `${COMPANY.siteUrl}/privacy` },
  // Bozza non indicizzata finché non è validata e i dati SRL sono completi.
  robots: COMPANY.isDraft ? { index: false, follow: false } : undefined,
};

export default function PrivacyPage() {
  return <LegalPage slug="privacy" label="PLUGGERS // PRIVACY" />;
}
