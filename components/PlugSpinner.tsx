"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useRef, useState } from "react";
import {
  Wrench,
  Zap,
  HardHat,
  Hammer,
  Paintbrush,
  Plug,
} from "lucide-react";

const WORKERS = [
  { icon: Wrench,     label: "Idraulico",    color: "#38bdf8", angle: -90 },
  { icon: Zap,        label: "Elettricista", color: "#facc15", angle: -18 },
  { icon: HardHat,    label: "Muratore",     color: "#fb923c", angle:  54 },
  { icon: Hammer,     label: "Carpentiere",  color: "#34d399", angle: 126 },
  { icon: Paintbrush, label: "Imbianchino",  color: "#c084fc", angle: 198 },
];

const RADIUS = 148;

/** Converts polar coords (r, angleDeg) to {x, y} offsets from center */
function polar(r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
}

export function PlugSpinner() {
  const [hovered, setHovered] = useState<number | null>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);

  // Slow continuous orbit rotation
  useAnimationFrame((_, delta) => {
    angleRef.current = (angleRef.current + delta * 0.012) % 360;
    if (orbitRef.current) {
      orbitRef.current.style.transform = `rotate(${angleRef.current}deg)`;
    }
  });

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 360, height: 360 }}
    >
      {/* ── Ambient glows ── */}
      <div className="pointer-events-none absolute inset-0 rounded-full">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.22),transparent_65%)] blur-2xl" />
      </div>

      {/* ── Orbit ring (slowly rotating dashes) ── */}
      <div
        ref={orbitRef}
        className="absolute inset-0"
        style={{ willChange: "transform" }}
      >
        <svg
          viewBox="0 0 360 360"
          fill="none"
          className="h-full w-full"
          style={{ overflow: "visible" }}
        >
          <circle
            cx={180}
            cy={180}
            r={RADIUS}
            stroke="rgba(139,92,246,0.18)"
            strokeWidth={1}
            strokeDasharray="6 10"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* ── Connection lines (SVG, behind nodes) ── */}
      <svg
        viewBox="0 0 360 360"
        fill="none"
        className="pointer-events-none absolute inset-0"
        style={{ overflow: "visible" }}
      >
        {WORKERS.map((w, i) => {
          const { x, y } = polar(RADIUS, w.angle);
          const isActive = hovered === i;
          return (
            <motion.line
              key={i}
              x1={180}
              y1={180}
              x2={180 + x}
              y2={180 + y}
              stroke={w.color}
              strokeWidth={isActive ? 1.5 : 0.8}
              strokeDasharray="4 6"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{
                opacity: isActive ? 1 : 0.35,
                pathLength: 1,
              }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: "easeOut" }}
            />
          );
        })}
      </svg>

      {/* ── Pulsing rings on active node ── */}
      {hovered !== null && (
        <motion.div
          key={hovered}
          className="pointer-events-none absolute"
          style={{
            left: 180 + polar(RADIUS, WORKERS[hovered].angle).x,
            top: 180 + polar(RADIUS, WORKERS[hovered].angle).y,
            transform: "translate(-50%,-50%)",
          }}
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div
            className="h-10 w-10 rounded-full border"
            style={{ borderColor: WORKERS[hovered].color }}
          />
        </motion.div>
      )}

      {/* ── Worker nodes ── */}
      {WORKERS.map((w, i) => {
        const { x, y } = polar(RADIUS, w.angle);
        const Icon = w.icon;
        const isActive = hovered === i;

        return (
          <motion.div
            key={i}
            className="absolute flex flex-col items-center gap-1.5"
            style={{
              left: 180 + x,
              top: 180 + y,
              transform: "translate(-50%,-50%)",
            }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.12 + 0.2, duration: 0.55, type: "spring", bounce: 0.35 }}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
          >
            {/* chip */}
            <motion.div
              className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border backdrop-blur-md"
              animate={{
                borderColor: isActive ? w.color : "rgba(255,255,255,0.14)",
                backgroundColor: isActive ? `${w.color}22` : "rgba(255,255,255,0.06)",
                boxShadow: isActive ? `0 0 24px 4px ${w.color}55` : "none",
                scale: isActive ? 1.18 : 1,
              }}
              transition={{ duration: 0.22 }}
            >
              <Icon
                size={18}
                style={{ color: isActive ? w.color : "rgba(255,255,255,0.75)" }}
              />
            </motion.div>

            {/* label pill */}
            <motion.div
              className="rounded-full px-2 py-0.5 font-mono text-[9px] tracking-widest"
              animate={{
                opacity: isActive ? 1 : 0.5,
                color: isActive ? w.color : "rgba(255,255,255,0.5)",
              }}
            >
              {w.label.toUpperCase()}
            </motion.div>
          </motion.div>
        );
      })}

      {/* ── Central hub ── */}
      <motion.div
        className="relative z-10 flex h-20 w-20 flex-col items-center justify-center rounded-3xl border border-[rgba(139,92,246,0.5)] bg-[rgba(139,92,246,0.12)] backdrop-blur-xl"
        animate={{
          boxShadow: [
            "0 0 30px 6px rgba(139,92,246,0.35)",
            "0 0 50px 12px rgba(139,92,246,0.20)",
            "0 0 30px 6px rgba(139,92,246,0.35)",
          ],
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* inner rotating arc */}
        <motion.div
          className="pointer-events-none absolute inset-1 rounded-[20px] border border-[rgba(139,92,246,0.35)]"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "conic-gradient(from 0deg, rgba(139,92,246,0.4), transparent 60%)",
          }}
        />
        <Plug
          size={26}
          className="relative text-white drop-shadow-[0_0_12px_rgba(139,92,246,0.9)]"
          strokeWidth={1.6}
        />
        <span className="relative mt-1 font-mono text-[8px] tracking-[0.22em] text-white/70">
          HUB
        </span>
      </motion.div>

      {/* ── Floating "MATCH" badge that occasionally appears ── */}
      <motion.div
        className="pointer-events-none absolute right-4 top-6 rounded-full border border-[#facc1555] bg-[#facc1511] px-3 py-1 font-mono text-[10px] tracking-widest text-[#facc15]"
        animate={{
          opacity: [0, 1, 1, 0],
          y: [6, 0, 0, -6],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          repeatDelay: 3.6,
          ease: "easeInOut",
        }}
      >
        ✓ MATCH
      </motion.div>
    </div>
  );
}
