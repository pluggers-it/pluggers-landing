import { TORINO_ZONES, zonesText } from "@/lib/trades";
import { CONTAINER, H2 } from "./styles";

/** The quartieri of Turin, for the trade pages and /torino: the search works from any address. */
export function TorinoZones({ who }: { who: string }) {
  const text = zonesText(who);
  return (
    <section className={`${CONTAINER} py-12 lg:py-16`} aria-labelledby="zones-title">
      <h2 id="zones-title" className={H2}>
        Quartieri di Torino e comuni vicini
      </h2>
      <p className="mt-3 max-w-[64ch] text-[17px] leading-[1.6] text-muted">{text.lede}</p>
      <dl className="mt-8 grid gap-x-12 md:grid-cols-2">
        {TORINO_ZONES.map(([name, areas]) => (
          <div key={name} className="border-t border-hair py-4">
            <dt className="text-[16px] font-semibold">{name}</dt>
            <dd className="mt-1 text-[16px] leading-[1.55] text-muted">{areas}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 max-w-[64ch] text-[16px] leading-[1.6] text-muted">{text.nearby}</p>
    </section>
  );
}
