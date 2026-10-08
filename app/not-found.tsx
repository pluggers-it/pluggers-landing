import type { Metadata } from "next";
import Link from "next/link";
import { SitePage } from "@/components/landing/SitePage";
import { BTN_PRIMARY, CONTAINER } from "@/components/landing/styles";

export const metadata: Metadata = { title: "Pagina non trovata", robots: { index: false } };

export default function NotFound() {
  return (
    <SitePage trail={[{ name: "Pagina non trovata", path: "/404" }]}>
      <section className={`${CONTAINER} pb-16 pt-4 lg:pt-8`}>
        <h1 className="text-balance text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
          Questa pagina non c&apos;è
        </h1>
        <p className="mt-4 max-w-[60ch] text-muted">
          L&apos;indirizzo è sbagliato oppure la pagina è stata spostata. Da qui ritrovi le pagine principali.
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          <li><Link href="/" className={BTN_PRIMARY}>Vai alla home</Link></li>
          <li><Link href="/torino" className="inline-flex min-h-12 items-center px-2 font-semibold underline underline-offset-4">Professionisti a Torino</Link></li>
          <li><Link href="/blog" className="inline-flex min-h-12 items-center px-2 font-semibold underline underline-offset-4">Blog</Link></li>
        </ul>
      </section>
    </SitePage>
  );
}
