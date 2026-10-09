import Image from "next/image";

// https://www.plggrs.it, error correction H (made with segno): the logo in the middle covers
// about 6% of the modules, well inside the 30% that H recovers.
const ROWS = [
  "11111110100000001010001111111",
  "10000010100110001011001000001",
  "10111010001010101101101011101",
  "10111010110000000000101011101",
  "10111010100110110010001011101",
  "10000010111011001001001000001",
  "11111110101010101010101111111",
  "00000000001011100111100000000",
  "00010010000110111110000111011",
  "10111101011111001011011100101",
  "11111111010110100111101101110",
  "11000100110101011001111000110",
  "11100010110001000010001100000",
  "10010000000100111111110101010",
  "01110011111000101110110000011",
  "00001100111010110010111100010",
  "11011111010001100111110100000",
  "00101000111100111101111100111",
  "10110011010011010110110001011",
  "00111000100111111110100101001",
  "10101111111111100000111110111",
  "00000000101001100100100010001",
  "11111110011101000010101011110",
  "10000010000010010010100010111",
  "10111010000001010110111111010",
  "10111010101011101011111011001",
  "10111010001111001001100011101",
  "10000010010011101110111100010",
  "11111110010010101100110010010",
];

const N = ROWS.length;
const EYES = [[0, 0], [N - 7, 0], [0, N - 7]];
const inEye = (x: number, y: number) => EYES.some(([ex, ey]) => x >= ex && x < ex + 7 && y >= ey && y < ey + 7);
const LOGO = 7; // modules left free under the logo
const inLogo = (x: number, y: number) => Math.abs(x - (N - 1) / 2) <= LOGO / 2 && Math.abs(y - (N - 1) / 2) <= LOGO / 2;

const DOTS = ROWS.flatMap((row, y) =>
  [...row].flatMap((c, x) => (c === "1" && !inEye(x, y) && !inLogo(x, y) ? [[x, y]] : []))
);

export function BrandQr({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-square ${className}`}>
      <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} className="h-full w-full" role="img" aria-label="Codice QR per aprire plggrs.it">
        {DOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x + 0.5} cy={y + 0.5} r={0.43} fill="#17121F" />
        ))}
        {EYES.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            {/* rounder than rx 1.4 and decoders stop finding the eyes (tested with OpenCV) */}
            <rect x={x} y={y} width={7} height={7} rx={1.2} fill="#6D28D9" />
            <rect x={x + 1} y={y + 1} width={5} height={5} rx={0.3} fill="#fff" />
            <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.8} fill="#17121F" />
          </g>
        ))}
      </svg>
      <div className="absolute left-1/2 top-1/2 w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-[22%] bg-white p-[2.2%]">
        <Image src="/brand/app-icon-512.png" alt="" width={128} height={128} className="block h-auto w-full rounded-[22%]" priority />
      </div>
    </div>
  );
}
