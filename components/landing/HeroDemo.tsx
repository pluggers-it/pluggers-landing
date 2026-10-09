"use client";

import Image from "next/image";
import { Camera, Check, Plus, Sparkles, Star, X } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent } from "react";
import { SparkCanvas, type SparkHandle } from "./SparkCanvas";
import { useReducedMotionSafe } from "./useReducedMotionSafe";
import { onIdle } from "./idle";

type Scenario = {
  text: string;
  photo: string;
  trade: string;
  urgency: number;
  pro: { name: string; initial: string; rating: string; reviews: number; distance: string };
};

const SCENARIOS: Scenario[] = [
  {
    text: "Il rubinetto della cucina perde dalla base quando lo apro",
    photo: "/demo/tap.jpg",
    trade: "Idraulico",
    urgency: 2,
    pro: { name: "Giuseppe L.", initial: "G", rating: "4,8", reviews: 32, distance: "1,2 km" },
  },
  {
    text: "Salta il salvavita ogni volta che accendo il forno",
    photo: "/demo/breaker.jpg",
    trade: "Elettricista",
    urgency: 4,
    pro: { name: "Marco R.", initial: "M", rating: "4,9", reviews: 17, distance: "2,4 km" },
  },
  {
    text: "La chiave gira a vuoto e la porta di casa non si apre",
    photo: "/demo/lock.jpg",
    trade: "Fabbro",
    urgency: 5,
    pro: { name: "Davide C.", initial: "D", rating: "4,7", reviews: 41, distance: "0,8 km" },
  },
];

type Phase = "idle" | "typing" | "photo" | "sending" | "triage" | "current" | "lit" | "out";
const ORDER: Phase[] = ["idle", "typing", "photo", "sending", "triage", "current", "lit", "out"];
/** The step after each phase, and how long the phase lasts. "out" moves to the next scenario. */
const NEXT: Record<Exclude<Phase, "out">, [Phase, number]> = {
  idle: ["typing", 250],
  typing: ["photo", 350],
  photo: ["sending", 700],
  sending: ["triage", 650],
  triage: ["current", 550],
  current: ["lit", 1000],
  lit: ["out", 3200],
};
/** Phases the demo stops on while someone is playing with it; the others always run to the next one. */
const RESTING: Phase[] = ["idle", "typing", "photo", "triage", "lit"];
const TYPE_MS = 36;
/** With no touch for this long, the demo goes back to playing by itself. */
const RESUME_MS = 6000;

/** Every control: a hand cursor and no grey tap flash, the press feedback is the control's own. */
const TAP = "cursor-pointer touch-manipulation [-webkit-tap-highlight-color:transparent]";

type Path = { d: string; end: [number, number] };

export function HeroDemo() {
  const reduce = useReducedMotionSafe();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [text, setText] = useState("");
  const [edited, setEdited] = useState(false);
  const [photo, setPhoto] = useState(false);
  const [chip, setChip] = useState<number | null>(null);
  const [picked, setPicked] = useState(false);
  const [manual, setManual] = useState(false);
  const [active, setActive] = useState(false);
  const [path, setPath] = useState<Path | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cameraRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const sparks = useRef<SparkHandle>(null);
  const pathRef = useRef<Path | null>(null);
  const resumeRef = useRef<number | undefined>(undefined);
  const holdRef = useRef(false);
  const proId = useId();

  // Run only while on screen and in a visible tab, and not before the browser is idle after the first paint.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let inView = false;
    let idle = false;
    const update = () => setActive(idle && inView && document.visibilityState === "visible");
    const cancelIdle = onIdle(() => {
      idle = true;
      update();
    });
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
      cancelIdle();
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  // One step at a time, so the demo can stop on any step and carry on from there.
  useEffect(() => {
    if (!active && !reduce) return;
    const full = SCENARIOS[index].text;
    let ms = 0;
    let step: () => void;
    if (reduce && phase === "idle") {
      // No motion: open on the finished scene, still playable.
      step = () => {
        setText(full);
        setPhoto(true);
        setPicked(true);
        setPhase("lit");
      };
    } else if ((manual || reduce) && RESTING.includes(phase)) {
      return;
    } else if (phase === "typing" && !edited && text.length < full.length) {
      ms = TYPE_MS;
      step = () => setText(full.slice(0, text.length + 1));
    } else if (phase === "out") {
      ms = 450;
      step = () => {
        setIndex((index + 1) % SCENARIOS.length);
        setText("");
        setEdited(false);
        setPhoto(false);
        setChip(null);
        setPicked(false);
        setPhase("idle");
      };
    } else {
      const [next, wait] = NEXT[phase];
      ms = wait;
      step = () => {
        if (next === "photo") setPhoto(true);
        if (next === "lit") setPicked(true);
        setPhase(next);
      };
    }
    const id = window.setTimeout(step, ms);
    return () => clearTimeout(id);
  }, [phase, text, edited, manual, reduce, active, index]);

  useEffect(() => () => clearTimeout(resumeRef.current), []);

  // Any touch pauses the autoplay; it comes back RESUME_MS after the last one, unless keyboard focus is still inside.
  const touch = useCallback(() => {
    setManual(true);
    clearTimeout(resumeRef.current);
    if (!holdRef.current) resumeRef.current = window.setTimeout(() => setManual(false), RESUME_MS);
  }, []);

  const onFocus = (e: FocusEvent) => {
    holdRef.current = e.target.matches(":focus-visible");
    touch();
  };
  const onBlur = () => {
    holdRef.current = false;
    touch();
  };

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

  const burst = useCallback(() => {
    const end = pathRef.current?.end;
    if (end && !reduce) sparks.current?.burst(end[0], end[1]);
  }, [reduce]);

  useEffect(() => {
    if (phase === "lit") burst();
  }, [phase, burst]);

  const scenario = SCENARIOS[index];
  const atLeast = (p: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p);
  const autoTyping = phase === "typing" && !manual && !edited && !reduce && text.length < scenario.text.length;
  const canSend = text.trim().length > 0 || photo;
  const pressed = phase === "sending";
  const showTriage = atLeast("triage");
  const flow = atLeast("current");
  const out = phase === "out";

  // Sending from the composer opens the triage; once it is open, it runs the current to the professional again.
  const send = () => {
    touch();
    if (atLeast("triage")) {
      setPhase("current");
      return;
    }
    // A half-typed example is finished before it goes; text written by hand goes as it is.
    if (!edited && text) setText(scenario.text);
    setPhase("sending");
  };

  const addPhoto = () => {
    touch();
    setPhoto(true);
  };

  const removePhoto = () => {
    touch();
    setPhoto(false);
    cameraRef.current?.focus();
  };

  const pickChip = (i: number) => {
    touch();
    const selecting = chip !== i;
    setChip(selecting ? i : null);
    if (selecting && phase === "triage") setPhase("current");
  };

  const togglePro = () => {
    touch();
    setPicked(!picked);
    if (!picked) burst();
  };

  const chipClass = (i: number, rest: string) =>
    `${TAP} relative inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold ring-1 transition duration-150 after:absolute after:inset-x-0 after:-inset-y-1 motion-safe:active:scale-95 ${
      chip === i ? "bg-accent text-white ring-accent" : rest
    }`;

  return (
    <div
      role="region"
      aria-label="Prova la demo di Pluggers"
      className="relative"
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <p className="sr-only">
        Simulazione dell&apos;app: puoi scrivere, aggiungere una foto e premere i pulsanti. Non viene inviato nulla.
      </p>

      <div
        ref={rootRef}
        className="relative grid transition-opacity duration-500"
        style={{ opacity: out ? 0 : 1 }}
      >
        {/* The current */}
        <svg aria-hidden className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible">
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
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-0 h-3.5 w-3.5 rounded-full"
            style={{
              offsetPath: `path("${path.d}")`,
              offsetRotate: "0deg",
              background:
                "radial-gradient(circle, #fff 0 24%, var(--accent-bright) 26% 58%, transparent 62%)",
              boxShadow: "0 0 18px 4px rgba(134,59,255,0.7)",
            }}
            initial={false}
            animate={{ offsetDistance: flow ? "100%" : "0%", opacity: phase === "current" ? 1 : 0 }}
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
          <div className="rounded-card bg-surface p-4 shadow-card ring-1 ring-hair transition-shadow has-[textarea:focus-visible]:ring-2 has-[textarea:focus-visible]:ring-accent-text">
            <div className="flex items-start gap-3">
              <div className="grid flex-1">
                <textarea
                  value={text}
                  onChange={(e) => {
                    setEdited(true);
                    setText(e.target.value);
                    touch();
                  }}
                  rows={3}
                  aria-label="Descrivi il problema"
                  placeholder="Descrivi il problema…"
                  className={`[grid-area:1/1] min-h-[78px] w-full resize-none bg-transparent text-[17px] leading-[1.5] outline-none placeholder:text-muted ${
                    autoTyping ? "text-transparent caret-transparent" : ""
                  }`}
                />
                {autoTyping && (
                  <p
                    aria-hidden
                    className="pointer-events-none [grid-area:1/1] whitespace-pre-wrap break-words text-[17px] leading-[1.5]"
                  >
                    {text}
                    <span className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] bg-accent" />
                  </p>
                )}
              </div>
              <button
                ref={cameraRef}
                type="button"
                onClick={addPhoto}
                aria-label="Aggiungi una foto"
                className={`${TAP} -m-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-accent-text transition duration-150 hover:bg-accent-soft active:bg-accent-soft motion-safe:active:scale-90`}
              >
                <Camera className="h-6 w-6" strokeWidth={1.8} />
              </button>
            </div>
            <div className="mt-1 flex h-16 items-center">
              <div
                inert={!photo}
                className="flex items-center gap-2 transition-all duration-300"
                style={{ opacity: photo ? 1 : 0, transform: photo ? "scale(1)" : "scale(0.85)" }}
              >
                <Image
                  src={scenario.photo}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  aria-label="Togli la foto"
                  className={`${TAP} -ml-4 flex h-12 w-12 items-center justify-center rounded-full text-muted transition duration-150 hover:bg-page hover:text-ink active:bg-page motion-safe:active:scale-90`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <button
              ref={buttonRef}
              type="button"
              onClick={send}
              disabled={!canSend}
              className={`${TAP} mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white transition-all duration-200 enabled:hover:bg-accent-deep enabled:active:bg-accent-deep motion-safe:enabled:active:scale-[0.97] disabled:cursor-default disabled:bg-ink/8 disabled:text-ink/45 dark:enabled:hover:bg-accent-bright ${
                pressed ? "bg-accent-deep motion-safe:scale-[0.97]" : "bg-accent"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Trova professionisti
            </button>
          </div>
        </div>

        {/* What Pluggers understood */}
        <div className="relative z-10 flex h-[104px] items-center justify-end sm:justify-start">
          <div
            inert={!showTriage}
            className="flex flex-col items-end gap-2 transition-all duration-300 sm:items-start"
            style={{ opacity: showTriage ? 1 : 0, transform: showTriage ? "none" : "translateY(6px)" }}
          >
            <button
              type="button"
              aria-pressed={chip === 0}
              onClick={() => pickChip(0)}
              className={chipClass(
                0,
                "bg-[color-mix(in_srgb,var(--accent)_10%,var(--page))] text-accent-deep ring-transparent hover:ring-accent dark:bg-[color-mix(in_srgb,var(--accent-text)_16%,var(--page))] dark:text-accent-text"
              )}
            >
              <Sparkles className="h-4 w-4" />
              {scenario.trade}
            </button>
            <button
              type="button"
              aria-pressed={chip === 1}
              onClick={() => pickChip(1)}
              className={chipClass(1, "bg-page ring-line hover:ring-accent")}
            >
              Urgenza {scenario.urgency}/5
            </button>
          </div>
        </div>

        {/* The professional who lights up */}
        <button
          ref={cardRef}
          type="button"
          aria-pressed={picked}
          aria-label={`Scegli ${scenario.pro.name}`}
          aria-describedby={proId}
          onClick={togglePro}
          className={`${TAP} relative z-10 block w-full max-w-[400px] rounded-card bg-surface p-4 text-left ring-1 ring-hair transition-all duration-300 hover:ring-line motion-safe:active:scale-[0.98] motion-reduce:transition-none sm:justify-self-end`}
          style={{
            boxShadow: picked ? "var(--shadow-lit)" : "var(--shadow-card)",
            transform: picked ? "scale(1.02)" : "none",
            opacity: picked || reduce ? 1 : 0.9,
          }}
        >
          <span className="flex items-center gap-3">
            <span
              aria-hidden
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#4c1d95,#863bff)] text-lg font-bold text-white"
            >
              {scenario.pro.initial}
            </span>
            <span className="block min-w-0 flex-1">
              <span className="block text-[17px] font-bold leading-tight">
                {scenario.pro.name}
              </span>
              <span id={proId} className="block">
                <span className="mt-1 flex items-center gap-1 text-sm text-muted">
                  <Star className="h-3.5 w-3.5 fill-amber text-amber" />
                  <span className="font-semibold text-ink">{scenario.pro.rating}</span>
                  <span>({scenario.pro.reviews} recensioni)</span>
                </span>
                <span className="mt-0.5 block text-sm">
                  <span className="font-semibold text-accent-text">{scenario.trade}</span>
                  <span className="text-muted">, a {scenario.pro.distance} da te</span>
                </span>
              </span>
            </span>
            <span
              aria-hidden
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                picked ? "bg-accent text-white" : "text-muted ring-1 ring-line"
              }`}
            >
              {picked ? <Check className="h-4 w-4" strokeWidth={3} /> : <Plus className="h-4 w-4" strokeWidth={2.5} />}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
