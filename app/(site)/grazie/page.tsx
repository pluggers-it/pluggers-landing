import type { Metadata } from "next";
import Link from "next/link";
import { SignedUpOnly } from "@/components/SignedUpOnly";
import { PageShell } from "@/components/landing/PageShell";
import { BTN_PRIMARY, CONTAINER } from "@/components/landing/styles";
import { GRAZIE_ROBOTS } from "@/lib/grazie";

export const metadata: Metadata = { title: "Grazie", robots: GRAZIE_ROBOTS };

export default function GraziePage() {
  return (
    <PageShell>
      <SignedUpOnly>
        <section className={`${CONTAINER} pb-16 pt-4 lg:pt-8`}>
          <h1 className="max-w-[24ch] text-balance text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
            Grazie, abbiamo ricevuto i tuoi dati. Ti scriviamo noi.
          </h1>
          <Link href="/" className={`${BTN_PRIMARY} mt-8`}>
            Torna alla home
          </Link>
        </section>
      </SignedUpOnly>
    </PageShell>
  );
}
