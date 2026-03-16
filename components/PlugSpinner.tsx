"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/assets/logo.png";

/**
 * Animated plug spinner based on the brand logo.
 * Rotates indefinitely and speeds up on hover.
 */
export function PlugSpinner() {
  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="group relative inline-flex items-center justify-center"
    >
      <motion.div
        variants={{
          rest: {
            rotate: 360,
            transition: { repeat: Infinity, ease: "linear", duration: 6 },
          },
          hover: {
            rotate: 360,
            transition: { repeat: Infinity, ease: "linear", duration: 1.25 },
          },
        }}
        className="will-change-transform"
      >
        <Image
          src={logo}
          alt="Pluggers logo"
          width={220}
          height={220}
          priority
          className="select-none drop-shadow-[0_20px_60px_rgba(139,92,246,0.25)]"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.25),rgba(0,0,0,0)_65%)] blur-2xl opacity-80 transition group-hover:opacity-100" />
    </motion.div>
  );
}

