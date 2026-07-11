import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { COMPANY } from "@/lib/company";
import { renderLegalDoc } from "@/lib/legal";

/**
 * Guscio condiviso delle pagine legali (privacy / termini / cookie): rende il
 * markdown di content/legal/<slug>.md con lo stesso stile prose del blog,
 * dentro l'header/footer del sito. Mostra un banner "bozza" finché
 * COMPANY.isDraft (dati SRL + revisione legale mancanti).
 */
export async function LegalPage({
  slug,
  label,
}: {
  slug: "privacy" | "termini" | "cookie";
  label: string;
}) {
  const html = await renderLegalDoc(slug);
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="relative mx-auto w-full max-w-2xl px-6 py-12 sm:px-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12),transparent_60%)] blur-3xl" />
        </div>

        <div className="relative">
          <SiteHeader label={label} />

          {COMPANY.isDraft && (
            <div className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-700 dark:text-amber-300">
              <strong>Bozza in revisione legale.</strong> I dati societari
              (denominazione, P.IVA, PEC, sede) verranno completati alla
              costituzione della società, e il testo sarà validato da un legale
              prima della pubblicazione definitiva.
            </div>
          )}

          <div
            className="blog-body mt-8"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <div className="mt-12">
            <SiteFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
