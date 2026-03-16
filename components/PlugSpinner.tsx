"use client";

import { motion } from "framer-motion";
import { Plug } from "lucide-react";

/**
 * Connection hub animation: Pluggers come nodo centrale che collega clienti e lavoratori.
 * Network di nodi che si accendono e convergono verso la spina centrale.
 */
export function PlugSpinner() {
  const nodes = Array.from({ length: 10 }).map((_, i) => {
    const ring = i < 4 ? 80 : i < 7 ? 120 : 155;
    const angle = (i / 10) * Math.PI * 2 + (i % 2 === 0 ? 0 : Math.PI / 12);
    return { id: i, ring, angle };
  });

  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="group relative inline-flex items-center justify-center"
    >
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.85),rgba(0,0,0,0)_75%)] blur-3xl opacity-90" />

      <motion.div
        variants={{
          rest: {
            rotate: 0,
          },
          hover: {
            rotate: 2,
          },
        }}
        className="relative will-change-transform"
      >
        <div className="relative flex h-60 w-60 items-center justify-center">
          {/* outer frame */}
          <div className="absolute inset-0 rounded-[32px] border border-[rgba(148,163,184,0.38)] bg-[radial-gradient(circle_at_top,rgba(15,23,42,1),rgba(15,23,42,0.4))] shadow-[0_30px_120px_rgba(15,23,42,0.9)]" />
          <div className="absolute inset-[3px] rounded-[28px] border border-[rgba(148,163,184,0.25)] bg-[radial-gradient(circle_at_top,rgba(24,24,35,0.9),rgba(15,23,42,0.4))]" />

          {/* orbit ring */}
          <motion.div
            className="absolute inset-10 rounded-full border border-[rgba(129,140,248,0.45)] [mask-image:repeating-conic-gradient(from_90deg,#000_0deg,#000_10deg,transparent_10deg,transparent_24deg)]"
            animate={{
              rotate: [0, 8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 18,
              ease: "easeInOut",
            }}
          />

          {/* connection arc */}
          <div className="absolute inset-[54px] rounded-full border-2 border-transparent [border-image:conic-gradient(from_180deg,rgba(129,140,248,0.15),rgba(56,189,248,0.5),rgba(234,179,8,0.8))_1] opacity-80 group-hover:opacity-100" />

          <Plug
            className="relative h-18 w-18 text-[var(--color-foreground)] drop-shadow-[0_20px_70px_rgba(234,179,8,0.65)] group-hover:text-[#facc15]"
            strokeWidth={1.8}
          />
        </div>
      </motion.div>

      <motion.div
        variants={{
          rest: {
            rotate: 0,
          },
          hover: {
            rotate: 4,
          },
        }}
        className="pointer-events-none absolute inset-0 will-change-transform"
      >
        {nodes.map((node) => {
          const x = Math.cos(node.angle) * node.ring;
          const y = Math.sin(node.angle) * node.ring;
          const delay = node.id * 0.12;
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.3, 1, 1.1, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: 3.4,
                delay,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              <div className="h-2 w-2 rounded-full bg-[var(--color-accent)] shadow-[0_12px_40px_rgba(129,140,248,0.7)] group-hover:bg-[#facc15]" />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

