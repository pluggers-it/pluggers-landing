"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

/** Autoscroll speed, about one card every five seconds. */
const PX_PER_S = 48;
/** After the last release, swipe, wheel, drag or key, the row starts moving again after this long. */
const RESUME_MS = 2500;
/** A mouse that moves less than this is a click, not a drag. */
const DRAG_PX = 5;
/** One arrow press moves the row by this many cards. */
const STEP_CARDS = 3;

/**
 * The trades row: it scrolls by itself and by hand (swipe, trackpad, mouse drag, keyboard, the two arrows), both ways.
 * Its children are two identical copies side by side, so jumping by one copy is invisible: the row
 * starts on the second copy and jumps back or forward by a copy before reaching either end.
 * With reduced motion it only scrolls by hand.
 */
export function TradesScroller({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = useRef<(dir: -1 | 1) => void>(() => {});
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

    // The arrows: a few cards at a time. If the move would cross an end, jump by a copy first
    // (invisible), so the wrap in onScroll never cuts the smooth scroll halfway.
    step.current = (dir) => {
      pause();
      const cards = el.querySelectorAll("li");
      const card = cards.length > 1 ? cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left : 236;
      const copy = el.scrollWidth / 2;
      const max = el.scrollWidth - el.clientWidth;
      let target = el.scrollLeft + dir * STEP_CARDS * card;
      if (target < 1 || target > max - 1) {
        const shift = target < 1 ? copy : -copy;
        el.scrollLeft += shift;
        target += shift;
      }
      el.scrollTo({ left: target, behavior: reduce ? "auto" : "smooth" });
    };

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
    <div className="relative">
      <div ref={ref} className={className}>
        {children}
      </div>
      <ArrowButton side="left" label="Mestieri precedenti" onClick={() => step.current(-1)} />
      <ArrowButton side="right" label="Mestieri successivi" onClick={() => step.current(1)} />
    </div>
  );
}

/**
 * From 640px up: on phones the row is swiped and the arrows would cover the photos.
 * top-[69px] is the middle of the photos (220px wide cards, 16:10).
 */
function ArrowButton({ side, label, onClick }: { side: "left" | "right"; label: string; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-[69px] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] shadow-[var(--shadow-card)] transition hover:bg-[var(--surface-rest)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] active:scale-95 motion-reduce:transition-none sm:flex ${
        side === "left" ? "left-4 lg:left-8" : "right-4 lg:right-8"
      }`}
    >
      <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
    </button>
  );
}
