"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

/** Autoscroll speed, about one card every five seconds. */
const PX_PER_S = 48;
/** After the last swipe, wheel, drag or key, the row starts moving again after this long. */
const RESUME_MS = 2500;
/** A mouse that moves less than this is a click, not a drag. */
const DRAG_PX = 5;

/**
 * The trades row: it scrolls by itself and by hand (swipe, trackpad, mouse drag, keyboard).
 * Its children are two identical copies side by side, so moving back by one copy is invisible.
 * With reduced motion it only scrolls by hand.
 */
export function TradesScroller({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pos = el.scrollLeft;
    let raf = 0;
    let last = 0;
    let hover = false;
    let pausedUntil = 0;
    let drag: { x: number; left: number; moved: boolean } | null = null;

    const pause = () => {
      pausedUntil = performance.now() + RESUME_MS;
    };
    const half = () => el.scrollWidth / 2;

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(t - last, 64) : 0;
      last = t;
      // Keyboard focus on a card holds the row still; a mouse click on one does not.
      if (hover || drag || el.querySelector(":focus-visible") || t < pausedUntil) {
        pos = el.scrollLeft;
        return;
      }
      pos += (PX_PER_S * dt) / 1000;
      if (pos >= half()) pos -= half();
      el.scrollLeft = pos;
    };

    const onScroll = () => {
      // Any scroll that is not ours is someone scrolling by hand.
      if (Math.abs(el.scrollLeft - pos) > 2) pause();
      if (el.scrollLeft >= half()) el.scrollLeft -= half();
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hover = true;
    };
    const onLeave = () => {
      hover = false;
    };
    const onDown = (e: PointerEvent) => {
      pause();
      if (e.pointerType === "mouse" && e.button === 0) drag = { x: e.clientX, left: el.scrollLeft, moved: false };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > DRAG_PX) drag.moved = true;
      if (drag.moved) el.scrollLeft = drag.left - dx;
    };
    // A drag ends over a card: the click that follows is not a choice.
    const swallow = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onUp = () => {
      if (!drag) return;
      if (drag.moved) {
        el.addEventListener("click", swallow, { capture: true, once: true });
        setTimeout(() => el.removeEventListener("click", swallow, true), 0);
      }
      drag = null;
      pause();
    };
    const noNativeDrag = (e: DragEvent) => e.preventDefault();

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("wheel", pause, { passive: true });
    el.addEventListener("keydown", pause);
    el.addEventListener("dragstart", noNativeDrag);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    // Move only while on screen.
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (entry.isIntersecting && !reduce) raf = requestAnimationFrame(tick);
    });
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("wheel", pause);
      el.removeEventListener("keydown", pause);
      el.removeEventListener("dragstart", noNativeDrag);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [reduce]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
