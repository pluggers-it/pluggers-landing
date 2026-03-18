"use client";

import { motion } from "framer-motion";
import { Wrench, Zap, HardHat, Hammer, Paintbrush, Plug } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// ─── Pentagon geometry ────────────────────────────────────────────────────────
const SIZE = 600; // square wrapper, pixel-perfect
const HUB_SIZE = 100;
const NODE_SIZE = 60;
const RADIUS_PCT = 35; // 35% of wrapper size → 210px when SIZE=600

// Perfect regular pentagon: 5 vertices 72° apart, first at top (−90°)
const WORKERS = [
  { icon: Wrench,     label: "Idraulico",    dark: "#38bdf8", light: "#0369a1", angle: -90          },
  { icon: Zap,        label: "Elettricista", dark: "#facc15", light: "#a16207", angle: -90 + 72     },
  { icon: HardHat,    label: "Muratore",     dark: "#fb923c", light: "#c2410c", angle: -90 + 72 * 2 },
  { icon: Hammer,     label: "Carpentiere",  dark: "#34d399", light: "#047857", angle: -90 + 72 * 3 },
  { icon: Paintbrush, label: "Imbianchino",  dark: "#c084fc", light: "#7c3aed", angle: -90 + 72 * 4 },
];

function polarPct(angleDeg: number, rPct = RADIUS_PCT) {
  const rad = (angleDeg * Math.PI) / 180;
  const x = 50 + Math.cos(rad) * rPct;
  const y = 50 + Math.sin(rad) * rPct;
  return { xPct: x, yPct: y };
}

/** Convert hex #rrggbb to "r, g, b" string for rgba() */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  /** Delay (ms) before the spinner starts animating in (after parent reveal) */
  revealDelay?: number;
}

export function PlugSpinner({ revealDelay = 0 }: Props) {
  const { resolvedTheme } = useTheme();
  // Avoid hydration mismatch by waiting for mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const isLight = mounted && resolvedTheme === "light";
  const delaySec = revealDelay / 1000;

  return (
    <div
      className="radial-wrapper select-none"
      style={{ width: SIZE, height: SIZE, maxWidth: "100%" }}
    >
      {/* Ambient purple glow */}
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          inset: SIZE * 0.18,
          background: "radial-gradient(circle at center, rgba(139,92,246,0.22) 0%, transparent 68%)",
          filter: "blur(48px)",
        }}
      />

      {/* ── SVG overlay: orbit ring + connection lines + dots ── */}
      <svg
        fill="none"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        {/* Orbit ring */}
        <motion.circle
          cx="50%" cy="50%" r={`${RADIUS_PCT}%`}
          stroke={isLight ? "rgba(109,40,217,0.35)" : "rgba(139,92,246,0.22)"}
          strokeWidth={isLight ? 1.8 : 1.5}
          strokeDasharray="5 10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: delaySec + 0.2 }}
        />

        {/* Connection lines */}
        {WORKERS.map((w, i) => {
          const { xPct, yPct } = polarPct(w.angle);
          const color = isLight ? w.light : w.dark;
          return (
            <motion.line
              key={`line-${i}`}
              x1="50%" y1="50%" x2={`${xPct.toFixed(6)}%`} y2={`${yPct.toFixed(6)}%`}
              stroke={color}
              strokeWidth={isLight ? 2.2 : 1.8}
              strokeLinecap="round"
              strokeOpacity={isLight ? 0.9 : 0.55}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 1.1, delay: delaySec + i * 0.14, ease: "easeOut" },
                opacity:    { duration: 0.5, delay: delaySec + i * 0.14 },
              }}
            />
          );
        })}

        {/* Travelling dots */}
        {WORKERS.map((w, i) => {
          const { xPct, yPct } = polarPct(w.angle);
          const color = isLight ? w.light : w.dark;
          const rgb = hexToRgb(color);
          return (
            <motion.circle
              key={`dot-${i}`}
              r={5}
              fill={color}
              initial={{ cx: "50%", cy: "50%", opacity: 0 }}
              animate={{
                cx: ["50%", `${xPct.toFixed(6)}%`, "50%"],
                cy: ["50%", `${yPct.toFixed(6)}%`, "50%"],
                opacity: [0, 1, 1, 0],
              }}
              style={{ filter: `drop-shadow(0 0 7px rgba(${rgb}, 0.9))` }}
              transition={{
                duration: 2.8,
                delay: delaySec + i * 0.42 + 1.2,
                repeat: Infinity,
                repeatDelay: 2.2,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>

      {/* ── Worker node chips ── */}
      {WORKERS.map((w, i) => {
        const { xPct, yPct } = polarPct(w.angle);
        const leftPct = `${xPct.toFixed(6)}%`;
        const topPct = `${yPct.toFixed(6)}%`;
        const Icon = w.icon;
        const color = isLight ? w.light : w.dark;
        const rgb = hexToRgb(color);

        return (
          <motion.div
            key={`node-${i}`}
            className="absolute"
            style={{
              left: leftPct,
              top:  topPct,
            }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: delaySec + i * 0.14 + 0.1,
              duration: 0.65,
              type: "spring",
              bounce: 0.40,
            }}
          >
            <div className="relative flex flex-col items-center" style={{ marginLeft: -(NODE_SIZE / 2), marginTop: -(NODE_SIZE / 2), gap: 6 }}>
              {/* Pulsing halo */}
              <motion.div
                className="absolute rounded-[18px]"
                style={{
                  width: NODE_SIZE,
                  height: NODE_SIZE,
                  border: `2px solid ${color}`,
                }}
                animate={{ scale: [1, 1.65, 1], opacity: [0.50, 0, 0.50] }}
                transition={{ duration: 2.8, delay: delaySec + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Chip */}
              <div
                className="relative flex items-center justify-center rounded-[18px]"
                style={{
                  width: NODE_SIZE,
                  height: NODE_SIZE,
                  border: `${isLight ? "2.5px" : "2px"} solid rgba(${rgb}, ${isLight ? 0.9 : 0.5})`,
                  backgroundColor: `rgba(${rgb}, ${isLight ? 0.10 : 0.12})`,
                  boxShadow: `0 0 ${isLight ? 18 : 22}px 4px rgba(${rgb}, ${isLight ? 0.20 : 0.28})`,
                }}
              >
                <Icon size={22} strokeWidth={isLight ? 2.4 : 2.0} style={{ color }} />
              </div>

              {/* Label */}
              <span
                className="font-mono font-semibold text-center whitespace-nowrap"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: isLight ? "#0b0b12" : `rgba(${rgb}, 0.85)`,
                }}
              >
                {w.label.toUpperCase()}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* ── Central hub – always perfectly centered via % ── */}
      <motion.div
        className="radial-hub flex flex-col items-center justify-center rounded-[28px]"
        style={{
          width: HUB_SIZE,
          height: HUB_SIZE,
          border: isLight ? "2.5px solid rgba(109,40,217,0.85)" : "2.5px solid rgba(139,92,246,0.60)",
          backgroundColor: isLight ? "rgba(109,40,217,0.10)" : "rgba(139,92,246,0.16)",
          backdropFilter: "blur(16px)",
          position: "absolute",
          top: "50%",
          left: "50%",
          marginLeft: -(HUB_SIZE / 2),
          marginTop: -(HUB_SIZE / 2),
        }}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{
          opacity: 1,
          scale: 1,
          boxShadow: [
            "0 0 30px 8px rgba(139,92,246,0.45)",
            "0 0 55px 20px rgba(139,92,246,0.18)",
            "0 0 30px 8px rgba(139,92,246,0.45)",
          ],
        }}
        transition={{
          opacity:   { duration: 0.5, delay: delaySec },
          scale:     { duration: 0.6, delay: delaySec, type: "spring", bounce: 0.3 },
          boxShadow: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {/* Rotating conic gradient ring */}
        <motion.div
          className="pointer-events-none absolute rounded-[22px]"
          style={{
            inset: 5,
            background: "conic-gradient(from 0deg, rgba(139,92,246,0.65), transparent 50%, rgba(139,92,246,0.10) 100%)",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <Plug
          size={30}
          strokeWidth={isLight ? 2.0 : 1.8}
          className="relative"
          style={{
            color: isLight ? "#3b0764" : "#ffffff",
            filter: "drop-shadow(0 0 10px rgba(139,92,246,0.9))",
          }}
        />
        <span
          className="relative font-mono font-bold"
          style={{
            fontSize: 9,
            letterSpacing: "0.24em",
            color: isLight ? "#3b0764" : "rgba(255,255,255,0.65)",
          }}
        >
          HUB
        </span>
      </motion.div>

      {/* Floating ✓ MATCH badge */}
      <motion.div
        className="pointer-events-none absolute"
        style={{ right: "10%", top: "7%" }}
        animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -8] }}
        transition={{
          duration: 2.6,
          delay: delaySec + 2,
          repeat: Infinity,
          repeatDelay: 5,
          ease: "easeInOut",
        }}
      >
        <span
          className="rounded-full font-mono font-semibold"
          style={{
            border: `1.5px solid ${isLight ? "rgba(161,98,7,0.7)" : "rgba(250,204,21,0.55)"}`,
            background: isLight ? "rgba(161,98,7,0.08)" : "rgba(250,204,21,0.08)",
            padding: "5px 14px",
            fontSize: 11,
            letterSpacing: "0.18em",
            color: isLight ? "#a16207" : "#ca8a04",
          }}
        >
          ✓ MATCH
        </span>
      </motion.div>
    </div>
  );
}
