import { FAQ } from "@/lib/home";
import { FaqList } from "./FaqList";
import { H2 } from "./styles";

export function Faq() {
  return (
    <section id="domande-frequenti" className="mx-auto w-full max-w-[760px] px-5 py-20 sm:px-8 lg:py-28" aria-labelledby="faq-title">
      <h2 id="faq-title" className={H2}>
        Domande frequenti
      </h2>
      <FaqList items={FAQ} />
    </section>
  );
}
