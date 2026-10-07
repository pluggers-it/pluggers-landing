"use client";

import { useEffect, useRef } from "react";
import { onIdle } from "./idle";

const GAP = 26;
const RADIUS = 170;

/**
 * Faint dot field behind the hero. Dots near the pointer brighten and lean
 * towards it; the loop only runs while that reaction is settling. It starts
 * once the browser is idle, after the hero text has painted.
 */
export function FieldCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let teardown: (() => void) | undefined;
    const cancel = onIdle(() => {
      teardown = startField(ref.current);
    });
    return () => {
      cancel();
      teardown?.();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}

function startField(canvas: HTMLCanvasElement | null) {
  const host = canvas?.parentElement;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !host || !ctx) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let raf = 0;
  let energy = 0;
  let target = 0;
  let paused = false;
  const pointer = { x: -1e4, y: -1e4 };

  const draw = () => {
    const rgb = document.documentElement.classList.contains("dark")
      ? "244,241,251"
      : "23,21,26";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    for (let y = GAP / 2; y < height; y += GAP) {
      for (let x = GAP / 2; x < width; x += GAP) {
        const dx = pointer.x - x;
        const dy = pointer.y - y;
        const d = Math.hypot(dx, dy);
        let alpha = 0.1;
        let size = 1.1;
        let ox = 0;
        let oy = 0;
        if (d < RADIUS && energy > 0) {
          const k = (1 - d / RADIUS) * energy;
          alpha += 0.45 * k;
          size += 1.2 * k;
          ox = (dx / d) * 7 * k;
          oy = (dy / d) * 7 * k;
        }
        ctx.fillStyle = `rgba(${rgb},${alpha})`;
        ctx.beginPath();
        ctx.arc(x + ox, y + oy, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const loop = () => {
    raf = 0;
    if (paused) return;
    energy += (target - energy) * 0.15;
    draw();
    if (Math.abs(target - energy) > 0.004) request();
  };
  const request = () => {
    if (!raf && !paused) raf = requestAnimationFrame(loop);
  };

  const fit = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = host.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    draw();
  };
  fit();

  const ro = new ResizeObserver(fit);
  ro.observe(host);
  const themeObserver = new MutationObserver(draw);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  const onMove = (e: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    target = 1;
    request();
  };
  const onLeave = () => {
    target = 0;
    request();
  };
  const setPaused = (value: boolean) => {
    paused = value;
    if (paused) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else {
      request();
    }
  };
  const onVisibility = () => setPaused(document.hidden || !inView);
  let inView = true;
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    onVisibility();
  });
  io.observe(host);
  document.addEventListener("visibilitychange", onVisibility);

  if (!reduce) {
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
  }

  return () => {
    ro.disconnect();
    themeObserver.disconnect();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    host.removeEventListener("pointermove", onMove);
    host.removeEventListener("pointerleave", onLeave);
    cancelAnimationFrame(raf);
  };
}
