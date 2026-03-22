"use client";

import { motion } from "framer-motion";
import {
  Wrench, Zap, HardHat, Hammer, Paintbrush,
  Plug,
  Home, Building2, Lightbulb,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// ── Coordinate system: 300 × 520 units, scaled via CSS ───────────────────────
const VW = 300;
const VH = 520;
const CX = 150;

const TOP_ARC_CY = 118;
const TOP_RADIUS = 80;
const BOT_ARC_CY = 390;   // bottom arc center (below mid)
const BOT_RADIUS = 78;

// Hub sits slightly below the geometric centre so the bottom bulb
// has room for the large "UTENTI" label
const HUB = { x: CX, y: 268 };

const CHIP = 50;
const HUB_SIZE = 100;

// "UTENTI" section label — inside the bottom bulb, well above the chips
const UTENTI_Y = 350;

function topPos(angleDeg: number) {
  const r = (angleDeg * Math.PI) / 180;
  return { x: CX + TOP_RADIUS * Math.sin(r), y: TOP_ARC_CY - TOP_RADIUS * Math.cos(r) };
}

function botPos(angleDeg: number) {
  const r = (angleDeg * Math.PI) / 180;
  return { x: CX + BOT_RADIUS * Math.sin(r), y: BOT_ARC_CY + BOT_RADIUS * Math.cos(r) };
}

const WORKERS = [
  { icon: Wrench,     label: "Idraulico",    color: "#38bdf8", ...topPos(-60) },
  { icon: Zap,        label: "Elettricista", color: "#facc15", ...topPos(-30) },
  { icon: HardHat,    label: "Muratore",     color: "#fb923c", ...topPos(0)   },
  { icon: Hammer,     label: "Carpentiere",  color: "#34d399", ...topPos(30)  },
  { icon: Paintbrush, label: "Imbianchino",  color: "#c084fc", ...topPos(60)  },
] as const;

const CLIENTS = [
  { icon: Home,      label: "Casa",        color: "#7dd3fc", ...botPos(-35) },
  { icon: Building2, label: "Business",    color: "#86efac", ...botPos(0)   },
  { icon: Lightbulb, label: "Apparecchio", color: "#fcd34d", ...botPos(35)  },
] as const;

// 5 flows → more dots visible simultaneously, matching the mockup cluster effect
const FLOWS = [
  { wi: 0, ci: 0 },
  { wi: 1, ci: 1 },
  { wi: 2, ci: 2 },
  { wi: 3, ci: 0 },
  { wi: 4, ci: 1 },
] as const;

// Ambient dots — fixed positions near the hub (both above and below)
// give the "particle field" look from the mockup
const AMBIENT_ABOVE = [
  { x: CX - 5,  y: HUB.y - 55, color: "#38bdf8", r: 3.0, delay: 0.0 },
  { x: CX + 6,  y: HUB.y - 45, color: "#facc15", r: 2.5, delay: 0.6 },
  { x: CX - 3,  y: HUB.y - 38, color: "#c084fc", r: 3.5, delay: 1.1 },
  { x: CX + 4,  y: HUB.y - 68, color: "#fb923c", r: 2.0, delay: 0.3 },
  { x: CX - 7,  y: HUB.y - 28, color: "#34d399", r: 2.5, delay: 0.9 },
];
const AMBIENT_BELOW = [
  { x: CX + 3,  y: HUB.y + 58, color: "#38bdf8", r: 3.0, delay: 0.4 },
  { x: CX - 4,  y: HUB.y + 72, color: "#c084fc", r: 2.5, delay: 1.0 },
  { x: CX + 6,  y: HUB.y + 85, color: "#fcd34d", r: 2.0, delay: 0.1 },
  { x: CX - 2,  y: HUB.y + 44, color: "#fb923c", r: 3.0, delay: 0.7 },
];

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(4)}%`;

// ── SVG hourglass paths (dashed border) ──────────────────────────────────────
const TOP_PATH =
  "M 62,26 Q 150,-6 238,26 C 238,96 194,210 170,254 Q 157,262 150,262 Q 143,262 130,254 C 106,210 62,96 62,26 Z";

const BOT_PATH =
  "M 130,268 Q 143,260 150,260 Q 157,260 170,268 C 194,316 238,415 238,484 Q 150,524 62,484 C 62,415 106,316 130,268 Z";
// ─────────────────────────────────────────────────────────────────────────────

export function HourglassVisual() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isLight = mounted && resolvedTheme === "light";

  return (
    <div
      className="relative select-none"
      style={{ width: "100%", maxWidth: 340, aspectRatio: `${VW} / ${VH}`, overflow: "visible" }}
    >
      {/* ── Ambient purple glow at hub ── */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: "15%", right: "15%",
          top: "38%", bottom: "38%",
          background: "radial-gradient(circle, rgba(139,92,246,0.38) 0%, transparent 70%)",
          filter: "blur(42px)",
        }}
      />

      {/* ── SVG layer ── */}
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        fill="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}
      >
        {/* Top bulb — dashed border */}
        <motion.path
          d={TOP_PATH}
          fill={isLight ? "rgba(139,92,246,0.07)" : "rgba(139,92,246,0.09)"}
          stroke={isLight ? "rgba(139,92,246,0.50)" : "rgba(139,92,246,0.35)"}
          strokeWidth={1.4}
          strokeDasharray="5 8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0 }}
        />

        {/* Bottom bulb — dashed border */}
        <motion.path
          d={BOT_PATH}
          fill={isLight ? "rgba(139,92,246,0.05)" : "rgba(139,92,246,0.07)"}
          stroke={isLight ? "rgba(139,92,246,0.44)" : "rgba(139,92,246,0.28)"}
          strokeWidth={1.4}
          strokeDasharray="5 8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.15 }}
        />

        {/* Worker → Hub connection lines */}
        {WORKERS.map((w, i) => (
          <motion.line
            key={`wl-${i}`}
            x1={w.x} y1={w.y} x2={HUB.x} y2={HUB.y}
            stroke={w.color}
            strokeWidth={1.3}
            strokeLinecap="round"
            strokeOpacity={0.40}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 0.9, delay: i * 0.1 + 0.3, ease: "easeOut" },
              opacity:    { duration: 0.4, delay: i * 0.1 + 0.3 },
            }}
          />
        ))}

        {/* Hub → Client connection lines */}
        {CLIENTS.map((c, i) => (
          <motion.line
            key={`cl-${i}`}
            x1={HUB.x} y1={HUB.y} x2={c.x} y2={c.y}
            stroke={c.color}
            strokeWidth={1.3}
            strokeLinecap="round"
            strokeOpacity={0.35}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 0.9, delay: i * 0.14 + 0.65, ease: "easeOut" },
              opacity:    { duration: 0.4, delay: i * 0.14 + 0.65 },
            }}
          />
        ))}

        {/* Ambient dots above hub — fixed pulsing particles */}
        {AMBIENT_ABOVE.map((d, i) => (
          <motion.circle
            key={`aa-${i}`}
            cx={d.x} cy={d.y} r={d.r}
            fill={d.color}
            style={{ filter: `drop-shadow(0 0 5px ${d.color})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0.5, 0.85, 0] }}
            transition={{
              duration: 3.2,
              delay: d.delay + 0.8,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Ambient dots below hub */}
        {AMBIENT_BELOW.map((d, i) => (
          <motion.circle
            key={`ab-${i}`}
            cx={d.x} cy={d.y} r={d.r}
            fill={d.color}
            style={{ filter: `drop-shadow(0 0 5px ${d.color})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.75, 0.4, 0.75, 0] }}
            transition={{
              duration: 3.0,
              delay: d.delay + 1.4,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Travelling particles: worker → hub → client */}
        {FLOWS.map((f, i) => {
          const w = WORKERS[f.wi];
          const c = CLIENTS[f.ci];
          return (
            <motion.circle
              key={`flow-${i}`}
              r={5}
              fill={w.color}
              style={{ filter: `drop-shadow(0 0 9px ${w.color})` }}
              initial={{ opacity: 0 }}
              animate={{
                cx: [w.x, HUB.x, c.x],
                cy: [w.y, HUB.y, c.y],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{
                duration: 2.8,
                times: [0, 0.38, 0.52, 0.90, 1.0],
                delay: i * 0.55 + 1.0,
                repeat: Infinity,
                repeatDelay: 1.6,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* "UTENTI" — large, bright label inside the bottom bulb */}
        <motion.text
          x={CX} y={UTENTI_Y}
          textAnchor="middle"
          fontSize={18}
          letterSpacing={5}
          fontFamily="monospace"
          fontWeight={700}
          fill={isLight ? "rgba(0,0,0,0.80)" : "rgba(255,255,255,0.88)"}
          style={{ filter: "drop-shadow(0 0 12px rgba(139,92,246,0.55))" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          UTENTI
        </motion.text>
      </svg>

      {/* ── Worker chips (top bulb) ── */}
      {WORKERS.map((w, i) => {
        const Icon = w.icon;
        const rgb = hexToRgb(w.color);
        return (
          <motion.div
            key={`w-${i}`}
            className="absolute flex flex-col items-center"
            style={{ left: pct(w.x, VW), top: pct(w.y, VH), transform: "translate(-50%, -50%)" }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.12 + 0.1, duration: 0.6, type: "spring", bounce: 0.4 }}
          >
            {/* Pulsing halo */}
            <motion.div
              className="absolute rounded-[14px]"
              style={{ width: CHIP, height: CHIP, border: `2px solid ${w.color}` }}
              animate={{ scale: [1, 1.65, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3.0, delay: i * 0.55, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Chip */}
            <div
              className="relative flex items-center justify-center rounded-[14px]"
              style={{
                width: CHIP, height: CHIP,
                border: `1.5px solid rgba(${rgb}, 0.55)`,
                backgroundColor: `rgba(${rgb}, 0.13)`,
                boxShadow: `0 0 18px 3px rgba(${rgb}, 0.28)`,
                backdropFilter: "blur(8px)",
              }}
            >
              <Icon size={20} strokeWidth={1.8} style={{ color: w.color }} />
            </div>
            {/* Label */}
            <span
              className="mt-1 font-mono font-semibold whitespace-nowrap"
              style={{ fontSize: 8, letterSpacing: "0.16em", color: isLight ? "#0b0b12" : `rgba(${rgb}, 0.82)` }}
            >
              {w.label.toUpperCase()}
            </span>
          </motion.div>
        );
      })}

      {/* ── Client chips (bottom bulb) ── */}
      {CLIENTS.map((c, i) => {
        const Icon = c.icon;
        const rgb = hexToRgb(c.color);
        return (
          <motion.div
            key={`c-${i}`}
            className="absolute flex flex-col items-center"
            style={{ left: pct(c.x, VW), top: pct(c.y, VH), transform: "translate(-50%, -50%)" }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.14 + 0.5, duration: 0.6, type: "spring", bounce: 0.4 }}
          >
            <div
              className="relative flex items-center justify-center rounded-[14px]"
              style={{
                width: CHIP, height: CHIP,
                border: `1.5px solid rgba(${rgb}, 0.50)`,
                backgroundColor: `rgba(${rgb}, 0.11)`,
                boxShadow: `0 0 16px 2px rgba(${rgb}, 0.22)`,
                backdropFilter: "blur(8px)",
              }}
            >
              <Icon size={20} strokeWidth={1.8} style={{ color: c.color }} />
            </div>
            <span
              className="mt-1 font-mono font-semibold whitespace-nowrap"
              style={{ fontSize: 8, letterSpacing: "0.16em", color: isLight ? "#0b0b12" : `rgba(${rgb}, 0.82)` }}
            >
              {c.label.toUpperCase()}
            </span>
          </motion.div>
        );
      })}

      {/* ── Central hub at the waist ── */}
      <motion.div
        className="absolute flex flex-col items-center justify-center rounded-[22px]"
        style={{
          width: HUB_SIZE, height: HUB_SIZE,
          left: pct(HUB.x, VW),
          top: pct(HUB.y, VH),
          transform: "translate(-50%, -50%)",
          border: isLight ? "2px solid rgba(109,40,217,0.90)" : "2px solid rgba(139,92,246,0.72)",
          backgroundColor: isLight ? "rgba(109,40,217,0.12)" : "rgba(139,92,246,0.20)",
          backdropFilter: "blur(18px)",
        }}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{
          opacity: 1,
          scale: 1,
          boxShadow: [
            "0 0 35px 10px rgba(139,92,246,0.55)",
            "0 0 65px 28px rgba(139,92,246,0.18)",
            "0 0 35px 10px rgba(139,92,246,0.55)",
          ],
        }}
        transition={{
          opacity:   { duration: 0.5, delay: 0.25 },
          scale:     { duration: 0.6, delay: 0.25, type: "spring", bounce: 0.3 },
          boxShadow: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {/* Rotating conic gradient ring */}
        <motion.div
          className="pointer-events-none absolute rounded-[18px]"
          style={{
            inset: 6,
            background: "conic-gradient(from 0deg, rgba(139,92,246,0.70), transparent 50%, rgba(139,92,246,0.12) 100%)",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <Plug
          size={26}
          strokeWidth={isLight ? 2.0 : 1.8}
          className="relative"
          style={{ color: isLight ? "#3b0764" : "#ffffff", filter: "drop-shadow(0 0 12px rgba(139,92,246,0.95))" }}
        />
        <span
          className="relative font-mono font-bold"
          style={{ fontSize: 8, letterSpacing: "0.24em", color: isLight ? "#3b0764" : "rgba(255,255,255,0.70)" }}
        >
          PLUGGERS
        </span>
      </motion.div>

      {/* ── ✓ MATCH badge (top-right) ── */}
      <motion.div
        className="pointer-events-none absolute"
        style={{ right: "-2%", top: "2%" }}
        animate={{ opacity: [0, 1, 1, 0], y: [6, 0, 0, -6] }}
        transition={{ duration: 2.8, delay: 2.2, repeat: Infinity, repeatDelay: 5.0, ease: "easeInOut" }}
      >
        <span
          className="font-mono font-semibold"
          style={{
            display: "inline-block",
            border: "1.5px solid rgba(251,191,36,0.70)",
            background: "rgba(251,191,36,0.08)",
            borderRadius: 20,
            padding: "5px 14px",
            fontSize: 10,
            letterSpacing: "0.18em",
            color: "#fbbf24",
          }}
        >
          ✓ MATCH
        </span>
      </motion.div>
    </div>
  );
}
