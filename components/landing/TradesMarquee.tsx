import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TRADES_SECTION } from "@/lib/home";
import { TRADES } from "@/lib/trades";
import { CONTAINER, H2, LEDE_ANSWER } from "./styles";

export function TradesMarquee() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="trades-title">
      <div className={CONTAINER}>
        <h2 id="trades-title" className={H2}>
          {TRADES_SECTION.title}
        </h2>
        <p className={LEDE_ANSWER}>{TRADES_SECTION.lede}</p>
        <Link
          href="/torino"
          className="mt-4 inline-flex min-h-12 items-center gap-1.5 text-[15px] font-semibold text-accent-text underline-offset-4 hover:underline"
        >
          Tutti i mestieri a Torino
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <div className="marquee mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex gap-4 pr-4" aria-hidden={copy === 1}>
              {TRADES.map((trade) => (
                <li key={trade.slug} className="w-[220px] shrink-0">
                  <Link
                    href={`/torino/${trade.slug}`}
                    tabIndex={copy === 1 ? -1 : undefined}
                    className="group block rounded-2xl"
                  >
                    <Image
                      src={trade.photo}
                      alt=""
                      width={800}
                      height={450}
                      sizes="220px"
                      className="aspect-[16/10] w-full rounded-2xl object-cover"
                    />
                    <span className="mt-2.5 block text-[15px] font-semibold group-hover:text-accent-text">
                      {trade.label} <span className="sr-only">a Torino</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
