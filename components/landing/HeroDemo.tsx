"use client";

import Image from "next/image";
import { Camera, Check, Sparkles, Star, X } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { SparkCanvas, type SparkHandle } from "./SparkCanvas";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

type Scenario = {
  text: string;
  photo: string;
  trade: string;
  urgency: number;
  pro: { name: string; initial: string; rating: string; reviews: number; distance: string; fee: string };
};

const SCENARIOS: Scenario[] = [
  {
    text: "Il rubinetto della cucina perde dalla base quando lo apro",
    photo: "/demo/tap.jpg",
    trade: "Idraulico",
    urgency: 2,
    pro: { name: "Giuseppe L.", initial: "G", rating: "4,8", reviews: 32, distance: "1,2 km", fee: "10 €" },
  },
  {
    text: "Salta il salvavita ogni volta che accendo il forno",
    photo: "/demo/breaker.jpg",
    trade: "Elettricista",
    urgency: 4,
    pro: { name: "Marco R.", initial: "M", rating: "4,9", reviews: 17, distance: "2,4 km", fee: "15 €" },
  },
  {
    text: "La chiave gira a vuoto e la porta di casa non si apre",
    photo: "/demo/lock.jpg",
    trade: "Fabbro",
    urgency: 5,
    pro: { name: "Davide C.", initial: "D", rating: "4,7", reviews: 41, distance: "0,8 km", fee: "20 €" },
  },
];

type Phase = "idle" | "typing" | "photo" | "sending" | "triage" | "current" | "lit" | "out";
const ORDER: Phase[] = ["idle", "typing", "photo", "sending", "triage", "current", "lit", "out"];
const TYPE_MS = 36;
const HOLD_MS = 3200;

type Path = { d: string; end: [number, number] };

export function HeroDemo() {
  const reduce = useReducedMotionSafe();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState(0);
  const [active, setActive] = useState(false);
  const [path, setPath] = useState<Path | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sparks = useRef<SparkHandle>(null);
  const pathRef = useRef<Path | null>(null);

  // Run only while on screen and in a visible tab.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let inView = false;
    const update = () => setActive(inView && document.visibilityState === "visible");
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        update();
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  // The scenario timeline. Pausing clears it; resuming restarts the scenario.
  useEffect(() => {
    if (reduce || !active) return;
    const timers: number[] = [];
    const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const text = SCENARIOS[index].text;

    later(0, () => {
      setPhase("typing");
      setTyped(0);
    });
    for (let i = 1; i <= text.length; i++) later(250 + i * TYPE_MS, () => setTyped(i));
    let t = 250 + text.length * TYPE_MS;
    later((t += 350), () => setPhase("photo"));
    later((t += 700), () => setPhase("sending"));
    later((t += 650), () => setPhase("triage"));
    later((t += 550), () => setPhase("current"));
    later((t += 1000), () => setPhase("lit"));
    later((t += HOLD_MS), () => setPhase("out"));
    later((t += 450), () => setIndex((i) => (i + 1) % SCENARIOS.length));

    return () => timers.forEach(clearTimeout);
  }, [index, active, reduce]);

  // The current runs from the composer button to the professional card.
  const measure = useCallback(() => {
    const root = rootRef.current;
    const button = buttonRef.current;
    const card = cardRef.current;
    if (!root || !button || !card) return;
    const r = root.getBoundingClientRect();
    const b = button.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    const sx = b.left + b.width / 2 - r.left;
    const sy = b.bottom - r.top;
    const ex = c.left + 44 - r.left;
    const ey = c.top - r.top;
    const dy = Math.max(24, ey - sy);
    const next: Path = {
      d: `M ${sx} ${sy} C ${sx} ${sy + dy * 0.55}, ${ex} ${ey - dy * 0.55}, ${ex} ${ey}`,
      end: [ex, ey],
    };
    pathRef.current = next;
    setPath(next);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const id = requestAnimationFrame(measure);
    const ro = new ResizeObserver(() => requestAnimationFrame(measure));
    ro.observe(root);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
    };
  }, [measure]);

  useEffect(() => {
    if (phase !== "lit" || reduce) return;
    const end = pathRef.current?.end;
    if (end) sparks.current?.burst(end[0], end[1]);
  }, [phase, reduce]);

  const scenario = SCENARIOS[index];
  const shownPhase: Phase = reduce ? "lit" : phase;
  const count = reduce ? scenario.text.length : typed;
  const atLeast = (p: Phase) => ORDER.indexOf(shownPhase) >= ORDER.indexOf(p);
  const typingDone = count >= scenario.text.length;
  const showPhoto = atLeast("photo");
  const pressed = shownPhase === "sending";
  const showTriage = atLeast("triage");
  const flow = atLeast("current");
  const lit = shownPhase === "lit";
  const out = shownPhase === "out";

  return (
    <div className="relative">
      <p className="sr-only">
        Esempio: scrivi «{SCENARIOS[0].text}», Pluggers riconosce il mestiere e
        l&apos;urgenza e ti collega a un professionista vicino a te.
      </p>

      <div
        ref={rootRef}
        aria-hidden
        className="relative grid transition-opacity duration-500"
        style={{ opacity: out ? 0 : 1 }}
      >
        {/* The current */}
        <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible">
          {path && (
            <>
              <path d={path.d} fill="none" stroke="var(--hair)" strokeWidth={2} />
              <motion.path
                d={path.d}
                fill="none"
                stroke="var(--accent-bright)"
                strokeWidth={2.5}
                strokeLinecap="round"
                initial={false}
                animate={{ pathLength: flow ? 1 : 0, opacity: flow ? 1 : 0 }}
                transition={{
                  pathLength: { duration: flow && !reduce ? 1 : 0, ease: "easeInOut" },
                  opacity: { duration: 0.2 },
                }}
                style={{ filter: "drop-shadow(0 0 6px rgba(134,59,255,0.65))" }}
              />
            </>
          )}
        </svg>
        {path && !reduce && (
          <motion.div
            className="pointer-events-none absolute left-0 top-0 z-0 h-3.5 w-3.5 rounded-full"
            style={{
              offsetPath: `path("${path.d}")`,
              offsetRotate: "0deg",
              background:
                "radial-gradient(circle, #fff 0 24%, var(--accent-bright) 26% 58%, transparent 62%)",
              boxShadow: "0 0 18px 4px rgba(134,59,255,0.7)",
            }}
            initial={false}
            animate={{ offsetDistance: flow ? "100%" : "0%", opacity: shownPhase === "current" ? 1 : 0 }}
            transition={{
              offsetDistance: { duration: flow ? 1 : 0, ease: "easeInOut" },
              opacity: { duration: 0.15 },
            }}
          />
        )}
        <SparkCanvas ref={sparks} className="pointer-events-none absolute inset-0 z-20" />

        {/* Composer, as in the app's home */}
        <div className="relative z-10 w-full max-w-[440px]">
          <p className="mb-3 text-[20px] font-bold tracking-[-0.01em]">Di cosa hai bisogno?</p>
          <div className="rounded-card bg-surface p-4 shadow-card ring-1 ring-hair">
            <div className="flex items-start gap-3">
              <p className="min-h-[78px] flex-1 text-[17px] leading-[1.5]">
                {count === 0 ? (
                  <span className="text-muted">Descrivi il problema…</span>
                ) : (
                  scenario.text.slice(0, count)
                )}
                {!typingDone && !reduce && (
                  <span className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] bg-accent" />
                )}
              </p>
              <Camera className="h-6 w-6 shrink-0 text-accent-text" strokeWidth={1.8} />
            </div>
            <div className="mt-1 flex h-16 items-center">
              <div
                className="flex items-center gap-2 transition-all duration-300"
                style={{ opacity: showPhoto ? 1 : 0, transform: showPhoto ? "scale(1)" : "scale(0.85)" }}
              >
                <Image
                  src={scenario.photo}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <X className="h-4 w-4 text-muted" />
              </div>
            </div>
            <div
              ref={buttonRef}
              className={`mt-2 flex h-12 items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white transition-all duration-200 ${
                pressed ? "scale-[0.97] bg-accent-deep" : "bg-accent"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Trova professionisti
            </div>
          </div>
        </div>

        {/* What Pluggers understood */}
        <div className="relative z-10 flex h-[104px] items-center justify-end sm:justify-start">
          <div
            className="flex flex-col items-end gap-2 transition-all duration-300 sm:items-start"
            style={{ opacity: showTriage ? 1 : 0, transform: showTriage ? "none" : "translateY(6px)" }}
          >
            <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,var(--page))] px-3 text-sm font-semibold text-accent-deep dark:bg-[color-mix(in_srgb,var(--accent-text)_16%,var(--page))] dark:text-accent-text">
              <Sparkles className="h-4 w-4" />
              {scenario.trade}
            </span>
            <span className="inline-flex h-9 items-center rounded-full bg-page px-3 text-sm font-semibold ring-1 ring-line">
              Urgenza {scenario.urgency}/5
            </span>
          </div>
        </div>

        {/* The professional who lights up */}
        <div
          ref={cardRef}
          className="relative z-10 w-full max-w-[400px] rounded-card bg-surface p-4 ring-1 ring-hair transition-all duration-300 sm:justify-self-end"
          style={{
            boxShadow: lit ? "var(--shadow-lit)" : "var(--shadow-card)",
            transform: lit ? "scale(1.02)" : "none",
            opacity: lit || reduce ? 1 : 0.9,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#4c1d95,#863bff)] text-lg font-bold text-white">
              {scenario.pro.initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-bold leading-tight">{scenario.pro.name}</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                <Star className="h-3.5 w-3.5 fill-amber text-amber" />
                <span className="font-semibold text-ink">{scenario.pro.rating}</span>
                <span>({scenario.pro.reviews} recensioni)</span>
              </p>
              <p className="mt-0.5 text-sm">
                <span className="font-semibold text-accent-text">{scenario.trade}</span>
                <span className="text-muted">, a {scenario.pro.distance} da te</span>
              </p>
            </div>
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                lit ? "bg-accent text-white" : "text-transparent ring-1 ring-line"
              }`}
            >
              <Check className="h-4 w-4" strokeWidth={3} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-page px-4 py-3 dark:bg-surface-rest">
            <span className="text-sm text-muted">Costo Chiamata</span>
            <span className="text-[15px] font-bold">{scenario.pro.fee}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
