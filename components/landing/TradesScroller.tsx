"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

/** Autoscroll speed, about one card every five seconds. */
const PX_PER_S = 48;
/** After the last release, swipe, wheel, drag or key, the row starts moving again after this long. */
const RESUME_MS = 2500;
/** A mouse that moves less than this is a click, not a drag. */
const DRAG_PX = 5;

/**
 * The trades row: it scrolls by itself and by hand (swipe, trackpad, mouse drag, keyboard), both ways.
 * Its children are two identical copies side by side, so jumping by one copy is invisible: the row
 * starts on the second copy and jumps back or forward by a copy before reaching either end.
 * With reduced motion it only scrolls by hand.
 */
export function TradesScroller({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let last = 0;
    let hover = false;
    let held = false;
    let pausedUntil = 0;
    let drag: { x: number; left: number; moved: boolean } | null = null;

    // The same spot one copy away, if this one is at an end.
    const wrap = (x: number) => {
      const copy = el.scrollWidth / 2;
      const max = el.scrollWidth - el.clientWidth;
      if (x < 1) return x + copy;
      if (x > max - 1) return x - copy;
      return x;
    };
    // Keyboard focus on a card: jumping would carry the card out of view.
    const focused = () => el.querySelector(":focus-visible") !== null;

    el.scrollLeft = wrap(el.scrollLeft);
    let pos = el.scrollLeft;

    const pause = () => {
      pausedUntil = performance.now() + RESUME_MS;
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(t - last, 64) : 0;
      last = t;
      if (hover || held || focused() || t < pausedUntil) {
        pos = el.scrollLeft;
        return;
      }
      pos = wrap(pos + (PX_PER_S * dt) / 1000);
      el.scrollLeft = pos;
    };

    const onScroll = () => {
      // Any scroll that is not ours is someone scrolling by hand.
      if (Math.abs(el.scrollLeft - pos) > 2) pause();
      const now = el.scrollLeft;
      const x = focused() ? now : wrap(now);
      if (x !== now) {
        el.scrollLeft = x;
        if (drag) drag.left += x - now;
      }
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hover = true;
    };
    const onLeave = () => {
      if (hover) pause();
      hover = false;
    };
    // Mouse and pen: pointer events. Touch: touch events, because the browser cancels the pointer
    // as soon as it takes over the swipe, while the finger is still down.
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      held = true;
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
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !held) return;
      if (drag?.moved) {
        el.addEventListener("click", swallow, { capture: true, once: true });
        setTimeout(() => el.removeEventListener("click", swallow, true), 0);
      }
      drag = null;
      held = false;
      pause();
    };
    const onTouchStart = () => {
      held = true;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!held || e.touches.length > 0) return;
      held = false;
      pause();
    };
    // Focus leaving the row may have left it at an end: move it back between the ends.
    const onFocusOut = () => {
      requestAnimationFrame(() => {
        if (!focused()) el.scrollLeft = pos = wrap(el.scrollLeft);
      });
    };
    const noNativeDrag = (e: DragEvent) => e.preventDefault();

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("wheel", pause, { passive: true });
    el.addEventListener("keydown", pause);
    el.addEventListener("focusout", onFocusOut);
    el.addEventListener("dragstart", noNativeDrag);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

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
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("wheel", pause);
      el.removeEventListener("keydown", pause);
      el.removeEventListener("focusout", onFocusOut);
      el.removeEventListener("dragstart", noNativeDrag);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [reduce]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
