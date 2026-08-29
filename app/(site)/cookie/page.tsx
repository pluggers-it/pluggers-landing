import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Cookie Policy — Pluggers",
  description:
    "Uso di cookie e identificatori tecnici sul sito e nell'app Pluggers.",
  alternates: { canonical: `${COMPANY.siteUrl}/cookie` },
  robots: COMPANY.isDraft ? { index: false, follow: false } : undefined,
};

export default function CookiePage() {
  return <LegalPage slug="cookie" label="PLUGGERS // COOKIE" />;
}
