"use client";

import { motion } from "framer-motion";
import {
  Wrench, Zap, HardHat, Hammer, Paintbrush,
  Plug,
  Home, Building2, Lightbulb,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// ── Coordinate system: 300 × 500 units, scaled via CSS ───────────────────────
const VW = 300;
const VH = 500;
const CX = 150;
const WAIST_Y = 250;

const TOP_ARC_CY = 120;
const TOP_RADIUS = 80;
const BOT_ARC_CY = VH - 120; // 380
const BOT_RADIUS = 80;

const CHIP = 48;
const HUB_SIZE = 88;

function topPos(angleDeg: number) {
  const r = (angleDeg * Math.PI) / 180;
  return {
    x: CX + TOP_RADIUS * Math.sin(r),
    y: TOP_ARC_CY - TOP_RADIUS * Math.cos(r),
  };
}

function botPos(angleDeg: number) {
  const r = (angleDeg * Math.PI) / 180;
  return {
    x: CX + BOT_RADIUS * Math.sin(r),
    y: BOT_ARC_CY + BOT_RADIUS * Math.cos(r),
  };
}

const WORKERS = [
  { icon: Wrench,     label: "Idraulico",    color: "#38bdf8", ...topPos(-60) },
  { icon: Zap,        label: "Elettricista", color: "#facc15", ...topPos(-30) },
  { icon: HardHat,    label: "Muratore",     color: "#fb923c", ...topPos(0)   },
  { icon: Hammer,     label: "Carpentiere",  color: "#34d399", ...topPos(30)  },
  { icon: Paintbrush, label: "Imbianchino",  color: "#c084fc", ...topPos(60)  },
] as const;

// 3 user categories: symmetric at −35°, 0°, +35°
const CLIENTS = [
  { icon: Home,      label: "Casa",        color: "#7dd3fc", ...botPos(-35) },
  { icon: Building2, label: "Business",    color: "#86efac", ...botPos(0)   },
  { icon: Lightbulb, label: "Apparecchio", color: "#fcd34d", ...botPos(35)  },
] as const;

const HUB = { x: CX, y: WAIST_Y };

// "UTENTI" section label: SVG y-coordinate above the bottom icon cluster
const UTENTI_Y = 398;

// Flows: each particle travels worker → hub → client
const FLOWS = [
  { wi: 0, ci: 0 },
  { wi: 2, ci: 1 },
  { wi: 4, ci: 2 },
] as const;

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(4)}%`;

// ── Hourglass SVG paths ───────────────────────────────────────────────────────
const TOP_PATH =
  "M 62,26 Q 150,-6 238,26 C 238,96 194,204 170,246 Q 157,254 150,254 Q 143,254 130,246 C 106,204 62,96 62,26 Z";

const BOT_PATH =
  "M 130,258 Q 143,250 150,250 Q 157,250 170,258 C 194,308 238,404 238,472 Q 150,512 62,472 C 62,404 106,308 130,258 Z";
// ─────────────────────────────────────────────────────────────────────────────

export function HourglassVisual() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isLight = mounted && resolvedTheme === "light";

  return (
    <div
      className="relative select-none"
      style={{
        width: "100%",
        maxWidth: 340,
        aspectRatio: `${VW} / ${VH}`,
        overflow: "visible",
      }}
    >
      {/* Ambient glow at the waist */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: "18%", right: "18%",
          top: "40%", bottom: "40%",
          background: "radial-gradient(circle, rgba(139,92,246,0.32) 0%, transparent 70%)",
          filter: "blur(38px)",
        }}
      />

      {/* ── SVG layer: bulb outlines, connection lines, travelling particles ── */}
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        fill="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        {/* Top bulb */}
        <motion.path
          d={TOP_PATH}
          fill={isLight ? "rgba(139,92,246,0.07)" : "rgba(139,92,246,0.09)"}
          stroke={isLight ? "rgba(139,92,246,0.42)" : "rgba(139,92,246,0.28)"}
          strokeWidth={1.5}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0 }}
        />

        {/* Bottom bulb */}
        <motion.path
          d={BOT_PATH}
          fill={isLight ? "rgba(139,92,246,0.05)" : "rgba(139,92,246,0.07)"}
          stroke={isLight ? "rgba(139,92,246,0.36)" : "rgba(139,92,246,0.22)"}
          strokeWidth={1.5}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.15 }}
        />

        {/* "UTENTI" label — centered above the bottom icon cluster */}
        <motion.text
          x={CX} y={UTENTI_Y}
          textAnchor="middle"
          fontSize={7.5}
          letterSpacing={3}
          fontFamily="monospace"
          fontWeight={600}
          fill={isLight ? "rgba(0,0,0,0.38)" : "rgba(255,255,255,0.30)"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          UTENTI
        </motion.text>

        {/* Worker → Hub connection lines */}
        {WORKERS.map((w, i) => (
          <motion.line
            key={`wl-${i}`}
            x1={w.x} y1={w.y}
            x2={HUB.x} y2={HUB.y}
            stroke={w.color}
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeOpacity={0.38}
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
            x1={HUB.x} y1={HUB.y}
            x2={c.x} y2={c.y}
            stroke={c.color}
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeOpacity={0.32}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 0.9, delay: i * 0.14 + 0.65, ease: "easeOut" },
              opacity:    { duration: 0.4, delay: i * 0.14 + 0.65 },
            }}
          />
        ))}

        {/* Travelling particles: worker → hub → client (top-to-bottom flow) */}
        {FLOWS.map((f, i) => {
          const w = WORKERS[f.wi];
          const c = CLIENTS[f.ci];
          return (
            <motion.circle
              key={`flow-${i}`}
              r={5}
              fill={w.color}
              style={{ filter: `drop-shadow(0 0 8px ${w.color})` }}
              initial={{ opacity: 0 }}
              animate={{
                cx: [w.x, HUB.x, c.x],
                cy: [w.y, HUB.y, c.y],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{
                duration: 3.6,
                times: [0, 0.40, 0.55, 0.92, 1.0],
                delay: i * 0.9 + 1.1,
                repeat: Infinity,
                repeatDelay: 4.2,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>

      {/* ── Worker chips (top bulb) ── */}
      {WORKERS.map((w, i) => {
        const Icon = w.icon;
        const rgb = hexToRgb(w.color);
        return (
          <motion.div
            key={`w-${i}`}
            className="absolute flex flex-col items-center"
            style={{
              left: pct(w.x, VW),
              top: pct(w.y, VH),
              transform: "translate(-50%, -50%)",
            }}
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
                width: CHIP,
                height: CHIP,
                border: `1.5px solid rgba(${rgb}, 0.55)`,
                backgroundColor: `rgba(${rgb}, 0.12)`,
                boxShadow: `0 0 16px 3px rgba(${rgb}, 0.25)`,
                backdropFilter: "blur(8px)",
              }}
            >
              <Icon size={18} strokeWidth={2} style={{ color: w.color }} />
            </div>
            {/* Label */}
            <span
              className="mt-1 font-mono font-semibold whitespace-nowrap"
              style={{
                fontSize: 8,
                letterSpacing: "0.16em",
                color: isLight ? "#0b0b12" : `rgba(${rgb}, 0.82)`,
              }}
            >
              {w.label.toUpperCase()}
            </span>
          </motion.div>
        );
      })}

      {/* ── Client / Utenti chips (bottom bulb) ── */}
      {CLIENTS.map((c, i) => {
        const Icon = c.icon;
        const rgb = hexToRgb(c.color);
        return (
          <motion.div
            key={`c-${i}`}
            className="absolute flex flex-col items-center"
            style={{
              left: pct(c.x, VW),
              top: pct(c.y, VH),
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.14 + 0.5, duration: 0.6, type: "spring", bounce: 0.4 }}
          >
            {/* Chip */}
            <div
              className="relative flex items-center justify-center rounded-[14px]"
              style={{
                width: CHIP,
                height: CHIP,
                border: `1.5px solid rgba(${rgb}, 0.45)`,
                backgroundColor: `rgba(${rgb}, 0.10)`,
                boxShadow: `0 0 14px 2px rgba(${rgb}, 0.20)`,
                backdropFilter: "blur(8px)",
              }}
            >
              <Icon size={18} strokeWidth={2} style={{ color: c.color }} />
            </div>
            {/* Label */}
            <span
              className="mt-1 font-mono font-semibold whitespace-nowrap"
              style={{
                fontSize: 8,
                letterSpacing: "0.16em",
                color: isLight ? "#0b0b12" : `rgba(${rgb}, 0.82)`,
              }}
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
          width: HUB_SIZE,
          height: HUB_SIZE,
          left: pct(HUB.x, VW),
          top: pct(HUB.y, VH),
          transform: "translate(-50%, -50%)",
          border: isLight
            ? "2px solid rgba(109,40,217,0.88)"
            : "2px solid rgba(139,92,246,0.68)",
          backgroundColor: isLight
            ? "rgba(109,40,217,0.10)"
            : "rgba(139,92,246,0.18)",
          backdropFilter: "blur(16px)",
        }}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{
          opacity: 1,
          scale: 1,
          boxShadow: [
            "0 0 30px 8px rgba(139,92,246,0.50)",
            "0 0 55px 22px rgba(139,92,246,0.18)",
            "0 0 30px 8px rgba(139,92,246,0.50)",
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
            inset: 5,
            background:
              "conic-gradient(from 0deg, rgba(139,92,246,0.65), transparent 50%, rgba(139,92,246,0.10) 100%)",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <Plug
          size={24}
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
            fontSize: 7.5,
            letterSpacing: "0.22em",
            color: isLight ? "#3b0764" : "rgba(255,255,255,0.65)",
          }}
        >
          PLUGGERS
        </span>
      </motion.div>
    </div>
  );
}
