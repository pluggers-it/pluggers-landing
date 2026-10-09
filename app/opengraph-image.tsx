import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Pluggers | Il professionista giusto, al momento giusto.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const root = process.cwd();
  const [icon, bold, medium] = await Promise.all([
    readFile(join(root, "public/brand/app-icon-512.png")),
    readFile(join(root, "assets/fonts/PlusJakartaSans-800.ttf")),
    readFile(join(root, "assets/fonts/PlusJakartaSans-500.ttf")),
  ]);
  // Satori takes the raw bytes as `src`; the img type still says string.
  const iconSrc = Uint8Array.from(icon).buffer as unknown as string;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "72px 80px",
          background: "#f2f2f7",
          backgroundImage:
            "radial-gradient(60% 80% at 85% 20%, rgba(109,40,217,0.14), rgba(109,40,217,0) 70%)",
          fontFamily: "Jakarta",
          color: "#17151a",
        }}
      >
        <img
          src={iconSrc}
          width={300}
          height={300}
          alt=""
          style={{
            borderRadius: 66,
            boxShadow: "0 40px 70px -30px rgba(76,29,149,0.55)",
            flexShrink: 0,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 72, maxWidth: 700 }}>
          <div style={{ fontSize: 30, fontWeight: 500, color: "#6f6a76" }}>Pluggers</div>
          <div
            style={{
              marginTop: 14,
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
            }}
          >
            Il professionista giusto, al momento giusto.
          </div>
          <div style={{ marginTop: 26, fontSize: 28, fontWeight: 500, color: "#6f6a76", lineHeight: 1.4 }}>
            Racconta il problema: Pluggers capisce di che si tratta e ti collega a chi può risolverlo, vicino a te.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Jakarta", data: bold, weight: 800, style: "normal" },
        { name: "Jakarta", data: medium, weight: 500, style: "normal" },
      ],
    }
  );
}
