"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

const MAX_TILT = 14;

/**
 * The app icon floating beside the demo. It tilts towards the pointer while it
 * moves over the hero, and drifts slowly on its own; still with reduced motion.
 */
export function HeroIcon({ className = "" }: { className?: string }) {
  const reduce = useReducedMotionSafe();
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tiltRef.current;
    const hero = el?.closest("section");
    if (!el || !hero || reduce) return;

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateY(${(x * MAX_TILT * 2).toFixed(2)}deg) rotateX(${(-y * MAX_TILT * 2).toFixed(2)}deg)`;
    };
    const onLeave = () => {
      el.style.transform = "";
    };
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{ perspective: "600px" }}
      aria-hidden
    >
      <div className={reduce ? "" : "hero-float"}>
        <div ref={tiltRef} className="transition-transform duration-300 ease-out will-change-transform">
          <Image
            src="/brand/app-icon-512.png"
            alt=""
            width={512}
            height={512}
            sizes="(min-width: 640px) 128px, 56px"
            className="h-full w-full rounded-[22%] [filter:drop-shadow(0_24px_28px_rgba(76,29,149,0.35))]"
            priority
          />
        </div>
      </div>
    </div>
  );
}
