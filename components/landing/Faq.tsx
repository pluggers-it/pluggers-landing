import Link from "next/link";
import { FaqList } from "./FaqList";
import { H2 } from "./styles";

export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <section id="domande-frequenti" className="mx-auto w-full max-w-[760px] px-5 py-20 sm:px-8 lg:py-28" aria-labelledby="faq-title">
      <h2 id="faq-title" className={H2}>
        Domande frequenti
      </h2>
      <FaqList items={items} />
      <Link href="/faq" className="mt-6 inline-flex min-h-12 items-center font-semibold text-accent-text underline underline-offset-4">
        Vedi tutte le domande
      </Link>
    </section>
  );
}
