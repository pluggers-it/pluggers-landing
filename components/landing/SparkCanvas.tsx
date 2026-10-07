"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type SparkHandle = { burst: (x: number, y: number) => void };

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  ttl: number;
  size: number;
  color: string;
};

// White disappears on the light page on purpose: it only reads as a spark on dark.
const LIGHT = ["#6d28d9", "#863bff", "#4c1d95", "#c2861b", "#ffffff"];
const DARK = ["#a78bfa", "#863bff", "#ffffff", "#c2861b", "#e3d2ff"];
const GRAVITY = 1100;
const COUNT = 90;

/** Particle engine bound to one canvas. Lives outside React: nothing here is render state. */
function createEngine(canvas: HTMLCanvasElement) {
  let particles: Particle[] = [];
  let raf = 0;
  let last = 0;

  const tick = (now: number) => {
    const ctx = canvas.getContext("2d");
    if (!ctx || canvas.clientWidth === 0) {
      raf = 0;
      return;
    }
    const dt = Math.min(0.032, (now - last) / 1000);
    last = now;
    const dpr = canvas.width / canvas.clientWidth;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    const alive: Particle[] = [];
    for (const p of particles) {
      p.age += dt;
      if (p.age >= p.ttl) continue;
      p.vy += GRAVITY * dt;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const alpha = (1 - p.age / p.ttl) ** 1.5;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha * 0.3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      alive.push(p);
    }
    ctx.globalAlpha = 1;
    particles = alive;
    raf = alive.length ? requestAnimationFrame(tick) : 0;
  };

  return {
    burst(x: number, y: number) {
      const palette = document.documentElement.classList.contains("dark") ? DARK : LIGHT;
      for (let i = 0; i < COUNT; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.15;
        const speed = 140 + Math.random() * 460;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          age: 0,
          ttl: 0.9 + Math.random() * 0.6,
          size: 1.2 + Math.random() * 2.2,
          color: palette[(Math.random() * palette.length) | 0],
        });
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
      particles = [];
      canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
}

/**
 * Short burst of sparks drawn on a canvas that covers its parent.
 * The frame loop only runs while particles are alive and the tab is visible.
 */
export const SparkCanvas = forwardRef<SparkHandle, { className?: string }>(
  function SparkCanvas({ className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engine = useRef<ReturnType<typeof createEngine> | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      const host = canvas?.parentElement;
      if (!canvas || !host) return;

      const fit = () => {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const { width, height } = host.getBoundingClientRect();
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      };
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(host);

      const current = createEngine(canvas);
      engine.current = current;
      const onVisibility = () => {
        if (document.hidden) current.stop();
      };
      document.addEventListener("visibilitychange", onVisibility);

      return () => {
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        current.stop();
        engine.current = null;
      };
    }, []);

    useImperativeHandle(ref, () => ({
      burst: (x, y) => engine.current?.burst(x, y),
    }), []);

    return <canvas ref={canvasRef} className={className} aria-hidden />;
  }
);
