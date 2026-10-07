import { PageShell } from "@/components/landing/PageShell";
import { CONTAINER } from "@/components/landing/styles";

export type LegalSection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export const SUPPORT_EMAIL = "supporto@plggrs.it";

export function SupportEmail() {
  return (
    <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-accent-text underline underline-offset-4">
      {SUPPORT_EMAIL}
    </a>
  );
}

/** Reading column with the section index beside it (above it on the phone). */
export function LegalPage({
  title,
  updated,
  version,
  intro,
  sections,
}: {
  title: string;
  /** Date of the last change, e.g. "6 ottobre 2026". */
  updated: string;
  /** Version of the accepted text, when the page is one. */
  version?: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <PageShell>
      <div className={`${CONTAINER} pt-8 sm:pt-14`}>
        <div className="mx-auto max-w-[60rem] lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-x-16">
          <header className="lg:col-start-2">
            <h1 className="text-balance text-[clamp(2.1rem,4.6vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.035em]">
              {title}
            </h1>
            <p className="mt-3 text-[15px] text-muted">
              Ultimo aggiornamento: {updated}
              {version && <span className="whitespace-nowrap"> · versione {version}</span>}
            </p>
            <div className="mt-6 max-w-[38rem] text-[17px] leading-[1.65] text-muted">{intro}</div>
          </header>

          <nav
            aria-label="Indice"
            className="mt-8 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mt-1"
          >
            <div className="rounded-card bg-surface px-5 py-4 lg:sticky lg:top-6 lg:bg-transparent lg:p-0">
              <p className="text-[14px] font-semibold text-muted">In questa pagina</p>
              <ol className="mt-1">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex min-h-12 items-center text-[15px] leading-snug text-ink underline-offset-4 hover:text-accent-text hover:underline"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="mt-4 max-w-[38rem] lg:col-start-2 lg:mt-2">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-6 border-t border-hair pt-8 mt-10 first:mt-8">
                <h2 className="text-[22px] font-extrabold leading-snug tracking-[-0.02em]">{s.title}</h2>
                <div className="legal-body mt-3">{s.content}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
