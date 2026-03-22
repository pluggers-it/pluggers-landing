import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Pluggers — Trova professionisti qualificati nella tua zona";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#07070a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), " +
              "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* Purple radial glow - top */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(124,58,237,0.50) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />

        {/* Bottom right accent */}
        <div
          style={{
            position: "absolute",
            bottom: -150,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(168,85,247,0.28) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(139,92,246,0.5)",
              borderRadius: 999,
              padding: "10px 24px",
              background: "rgba(139,92,246,0.12)",
              marginBottom: 36,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#facc15",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 18,
                letterSpacing: "0.22em",
                color: "#a78bfa",
                fontWeight: 600,
              }}
            >
              EARLY ACCESS
            </span>
          </div>

          {/* Logo / Brand name */}
          <div
            style={{
              fontFamily: "sans-serif",
              fontWeight: 900,
              fontSize: 110,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              background: "linear-gradient(135deg, #ffffff 20%, #c4b5fd 60%, #7c3aed)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            PLUGGERS
          </div>

          {/* Tagline */}
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 30,
              color: "rgba(255,255,255,0.55)",
              marginTop: 20,
              letterSpacing: "0.01em",
              textAlign: "center",
              maxWidth: 720,
              lineHeight: 1.4,
            }}
          >
            Il professionista giusto, al momento giusto.
          </div>

          {/* Sub-tagline */}
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 18,
              color: "rgba(255,255,255,0.28)",
              marginTop: 28,
              letterSpacing: "0.18em",
            }}
          >
            PLUGGERS.IT
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
