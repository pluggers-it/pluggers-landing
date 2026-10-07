import Image from "next/image";
import { CONTAINER, H2, LEDE } from "./styles";

/** Labels match the app's catalogue (`mestieri.etichetta`). */
const TRADES = [
  { file: "plumber", label: "Idraulico" },
  { file: "electrician", label: "Elettricista" },
  { file: "locksmith", label: "Fabbro" },
  { file: "appliance-technician", label: "Tecnico elettrodomestici" },
  { file: "painter", label: "Imbianchino" },
  { file: "carpenter", label: "Falegname" },
  { file: "hvac-technician", label: "Tecnico climatizzazione" },
  { file: "heating-technician", label: "Termoidraulico" },
  { file: "window-fitter", label: "Serramentista" },
  { file: "mason", label: "Muratore" },
  { file: "tiler", label: "Piastrellista" },
  { file: "gardener", label: "Giardiniere" },
  { file: "glazier", label: "Vetraio" },
  { file: "furniture-assembler", label: "Montatore mobili" },
];

export function TradesMarquee() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="trades-title">
      <div className={CONTAINER}>
        <h2 id="trades-title" className={H2}>
          I mestieri su Pluggers
        </h2>
        <p className={LEDE}>Impianti, aperture, edilizia e finiture, arredo, esterni.</p>
      </div>

      <div className="marquee mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex gap-4 pr-4" aria-hidden={copy === 1}>
              {TRADES.map((trade) => (
                <li key={trade.file} className="w-[220px] shrink-0">
                  <Image
                    src={`/mestieri/${trade.file}.jpg`}
                    alt=""
                    width={800}
                    height={450}
                    sizes="220px"
                    className="aspect-[16/10] w-full rounded-2xl object-cover"
                  />
                  <p className="mt-2.5 text-[15px] font-semibold">{trade.label}</p>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
