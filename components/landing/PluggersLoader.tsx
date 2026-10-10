"use client";

import { memo, useEffect, useState } from "react";
import { useReducedMotionSafe } from "./useReducedMotionSafe";

/*
 * The app's loader, "la spina col cavo", ported from the Flutter app
 * (app/lib/core/widgets/spina_col_cavo_geometria.dart and spina_col_cavo_painter.dart):
 * the logo plug runs the circle dragging its cable, plugs into its socket at 12 o'clock,
 * and the socket winds the cable back while the plug starts again.
 * Same 200-unit box, same geometry, timing and strokes. Angles in degrees, from 3 o'clock, clockwise.
 */

type Pt = [number, number];

/** One full loop: run, plug in, wind back. */
export const LOADER_CYCLE_MS = 3200;
const END_RUN = 0.52;
const END_SPARKS_OUT = 0.62;
const START_REWIND = 0.72;
const END_SPARKS_IN = 0.82;
const JOINT = -90;
const CENTER = 100;

// The logo plug outline (spinaContorni, 0..1 box of brand_mark.png): body with cable, collar, two pins.
const OUTLINES: number[][] = [
  [
    0.4118, 0.2023, 0.4125, 0.2014, 0.4142, 0.2012, 0.4672, 0.2561, 0.6082, 0.3988, 0.6962, 0.4899, 0.7412,
    0.5355, 0.7469, 0.5423, 0.7463, 0.5441, 0.7201, 0.5687, 0.7073, 0.5817, 0.6911, 0.5995, 0.6689, 0.6216,
    0.6535, 0.6349, 0.6381, 0.647, 0.6142, 0.6626, 0.592, 0.6742, 0.5698, 0.6831, 0.5475, 0.6899, 0.5219,
    0.6949, 0.5014, 0.6969, 0.4741, 0.6965, 0.4604, 0.695, 0.4587, 0.6942, 0.445, 0.6917, 0.4228, 0.6848,
    0.4108, 0.6798, 0.4006, 0.6745, 0.3784, 0.6609, 0.3493, 0.6389, 0.3185, 0.6664, 0.2835, 0.6996, 0.2631,
    0.7201, 0.227, 0.7594, 0.2018, 0.7902, 0.2011, 0.7919, 0.188, 0.809, 0.1779, 0.8243, 0.1695, 0.8397,
    0.1602, 0.8602, 0.1588, 0.8619, 0.1566, 0.8688, 0.1521, 0.879, 0.1452, 0.9012, 0.143, 0.9166, 0.1431,
    0.9371, 0.1415, 0.9423, 0.1379, 0.9491, 0.1305, 0.9567, 0.1254, 0.9599, 0.1169, 0.9634, 0.1049, 0.9643,
    0.0981, 0.9632, 0.0912, 0.96, 0.0863, 0.9559, 0.0805, 0.9491, 0.0769, 0.9423, 0.0735, 0.9286, 0.0736,
    0.9115, 0.0753, 0.8961, 0.0772, 0.8859, 0.0837, 0.8619, 0.0943, 0.8346, 0.1076, 0.8073, 0.1234, 0.7799,
    0.1336, 0.7645, 0.1473, 0.7457, 0.1675, 0.7218, 0.1949, 0.691, 0.2211, 0.6635, 0.257, 0.6288, 0.2775,
    0.6101, 0.2929, 0.5976, 0.301, 0.5902, 0.3019, 0.5885, 0.2905, 0.5731, 0.2821, 0.5594, 0.2688, 0.5321,
    0.2615, 0.5116, 0.2611, 0.5082, 0.26, 0.5065, 0.2547, 0.4808, 0.2531, 0.4637, 0.2528, 0.4501, 0.2547,
    0.4244, 0.258, 0.4091, 0.2615, 0.3971, 0.2685, 0.3783, 0.2755, 0.3629, 0.2887, 0.339, 0.3025, 0.3185,
    0.313, 0.3048, 0.3384, 0.2757, 0.3681, 0.2457, 0.3903, 0.2214, 0.4023, 0.21,
  ],
  [
    0.4584, 0.1373, 0.4604, 0.1366, 0.4723, 0.1359, 0.4809, 0.1369, 0.4894, 0.1404, 0.4946, 0.1436, 0.498,
    0.1468, 0.5105, 0.1595, 0.5307, 0.1783, 0.5756, 0.2262, 0.581, 0.233, 0.6015, 0.2552, 0.6476, 0.3031,
    0.7724, 0.4279, 0.8024, 0.4586, 0.8094, 0.4689, 0.8126, 0.4757, 0.8147, 0.4843, 0.8149, 0.4911, 0.8128,
    0.5013, 0.8115, 0.5048, 0.8077, 0.5116, 0.8005, 0.5201, 0.7936, 0.5257, 0.7919, 0.5261, 0.7868, 0.5293,
    0.7817, 0.531, 0.7731, 0.5326, 0.7646, 0.5328, 0.7616, 0.5321, 0.7595, 0.5306, 0.6853, 0.4552, 0.6111,
    0.3783, 0.5185, 0.285, 0.434, 0.1971, 0.429, 0.1903, 0.4274, 0.1852, 0.4271, 0.1715, 0.4288, 0.1647,
    0.4344, 0.1544, 0.4416, 0.1468, 0.4484, 0.1416,
  ],
  [
    0.7058, 0.0365, 0.7116, 0.0357, 0.7201, 0.0357, 0.727, 0.0374, 0.7321, 0.0395, 0.7372, 0.043, 0.7427,
    0.0485, 0.7464, 0.0536, 0.748, 0.057, 0.7499, 0.0638, 0.7495, 0.0741, 0.7481, 0.0792, 0.7449, 0.0861,
    0.7413, 0.0912, 0.7338, 0.099, 0.6022, 0.2303, 0.6005, 0.2304, 0.5721, 0.1988, 0.5557, 0.1817, 0.5542,
    0.18, 0.5544, 0.1783, 0.5739, 0.1595, 0.6808, 0.0513, 0.6911, 0.0427, 0.7014, 0.0377,
  ],
  [
    0.8873, 0.2108, 0.8911, 0.2101, 0.8962, 0.2102, 0.903, 0.212, 0.9076, 0.2142, 0.9133, 0.2185, 0.9208,
    0.2279, 0.9239, 0.2347, 0.9255, 0.245, 0.9238, 0.2552, 0.9208, 0.2621, 0.915, 0.2702, 0.8914, 0.2945,
    0.7783, 0.4079, 0.7765, 0.4082, 0.7458, 0.3793, 0.727, 0.3631, 0.7262, 0.3612, 0.7492, 0.3382, 0.7731,
    0.3167, 0.8705, 0.2186, 0.8774, 0.2138, 0.8825, 0.2118,
  ],
];

// Along the pins' axis, measured from the foot (0..100 box): collar face, pin tips, the cut that drops the cable stub.
const FOOT: Pt = [47.22, 46.97];
const COLLAR_FACE = 24;
const CABLE_CUT = -21.5;
const AXIS: Pt = (() => {
  const l = Math.hypot(0.7364, -0.6766);
  return [0.7364 / l, -0.6766 / l];
})();
/** Centre of the collar face: the point that always sits on the circle. */
const REF: Pt = [FOOT[0] + AXIS[0] * COLLAR_FACE, FOOT[1] + AXIS[1] * COLLAR_FACE];

const points = (o: number[]): Pt[] => Array.from({ length: o.length / 2 }, (_, i) => [o[2 * i] * 100, o[2 * i + 1] * 100]);
const alongAxis = (q: Pt) => (q[0] - FOOT[0]) * AXIS[0] + (q[1] - FOOT[1]) * AXIS[1];

/** The body without the cable stub: the outline clipped to the half-plane in front of the cut (Path.combine intersect in the app). */
function clipBody(poly: Pt[]): Pt[] {
  const out: Pt[] = [];
  poly.forEach((p, i) => {
    const q = poly[(i + 1) % poly.length];
    const dp = alongAxis(p) - CABLE_CUT;
    const dq = alongAxis(q) - CABLE_CUT;
    if (dp >= 0) out.push(p);
    if (dp >= 0 !== dq >= 0) {
      const s = dp / (dp - dq);
      out.push([p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s]);
    }
  });
  return out;
}

const poly = (ps: Pt[]) => ps.map((p) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`).join(" ");
const BODY = poly(clipBody(points(OUTLINES[0])));
const COLLAR = poly(points(OUTLINES[1]));
/** A copy of the collar moved back: closes the logo's gap between collar and body, on the socket. */
const COLLAR_CLOSE = `translate(${AXIS[0] * -1.9} ${AXIS[1] * -1.9})`;
const PINS = [poly(points(OUTLINES[2])), poly(points(OUTLINES[3]))];

type Profile = { radius: number; scale: number; cable: number; details: boolean; sparks: number };
/** From 48 px up. */
const PAGE: Profile = { radius: 58, scale: 0.3, cable: 5.5, details: true, sparks: 2 };
/** Under 48 px: bigger plugs for the circle, thicker cable, no fine details. */
const SMALL: Profile = { radius: 46, scale: 0.44, cable: 11, details: false, sparks: 3.4 };

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const span = (t: number, from: number, to: number) => Math.min(1, Math.max(0, (t - from) / (to - from)));
const sine = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);
const cubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const onCircle = (a: number, r: number): Pt => [CENTER + Math.cos(rad(a)) * r, CENTER + Math.sin(rad(a)) * r];
const onTangent = (a: number, r: number, d: number): Pt => {
  const p = onCircle(a, r);
  return [p[0] + Math.cos(rad(a + 90)) * d, p[1] + Math.sin(rad(a + 90)) * d];
};
const f = (n: number) => n.toFixed(3);

/** Where everything is at time t (0..1) of the cycle. */
function pose(t: number, p: Profile) {
  const arc = deg((p.scale * (COLLAR_FACE - CABLE_CUT)) / p.radius);
  const start = JOINT + 2 * arc;
  const end = JOINT + 360;
  let male: number, female: number;
  if (t < END_RUN) {
    male = lerp(start, end, sine(span(t, 0, END_RUN)));
    female = JOINT;
  } else if (t < START_REWIND) {
    male = end;
    female = JOINT;
  } else {
    const e = cubic(span(t, START_REWIND, 1));
    male = end + 2 * arc * e;
    female = JOINT + 360 * e;
  }
  let sparks = 0;
  if (t >= END_RUN && t < END_SPARKS_OUT) sparks = easeOut(span(t, END_RUN, END_SPARKS_OUT));
  else if (t >= END_SPARKS_OUT && t < START_REWIND) sparks = 1;
  else if (t >= START_REWIND && t < END_SPARKS_IN) sparks = easeOut(1 - span(t, START_REWIND, END_SPARKS_IN));
  return { arc, male, female, plugged: t >= END_RUN && t < START_REWIND, sparks };
}

/** From the outline box to the 200 box, collar face on the circle at angle a; the socket is mirrored. */
function outlineTransform(a: number, p: Profile, mirrored: boolean) {
  const alpha = -Math.atan2(AXIS[1], AXIS[0]);
  const theta = rad(a + 90);
  const ca = Math.cos(alpha), sa = Math.sin(alpha), ct = Math.cos(theta), st = Math.sin(theta);
  const sx = mirrored ? -1 : 1, s = p.scale;
  const ma = s * (sx * ct * ca - st * sa);
  const mc = s * (-sx * ct * sa - st * ca);
  const mb = s * (sx * st * ca + ct * sa);
  const md = s * (-sx * st * sa + ct * ca);
  const o = onCircle(a, p.radius);
  return `matrix(${[ma, mb, mc, md, o[0] - (ma * REF[0] + mc * REF[1]), o[1] - (mb * REF[0] + md * REF[1])].map(f).join(" ")})`;
}

/** The cable: from the back of the socket along the circle to the back of the plug. Empty when fully wound. */
function cablePath(ps: ReturnType<typeof pose>, p: Profile) {
  const back = p.scale * (COLLAR_FACE - CABLE_CUT);
  const from = onTangent(ps.female, p.radius, back);
  const to = onTangent(ps.male, p.radius, -back);
  const a0 = ps.female + ps.arc;
  const a1 = ps.male - ps.arc;
  const open = a1 - a0 > 0.3;
  if (!open && Math.hypot(to[0] - from[0], to[1] - from[1]) < 0.5) return null;
  let d = `M${f(from[0])} ${f(from[1])}`;
  if (open) {
    const s = onCircle(a0, p.radius);
    const e = onCircle(a1, p.radius);
    d += `L${f(s[0])} ${f(s[1])}A${p.radius} ${p.radius} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(e[0])} ${f(e[1])}`;
  }
  return `${d}L${f(to[0])} ${f(to[1])}`;
}

// The four sparks, out and in, tilted off the circle so they never touch the bodies: each a three-stroke zig-zag.
const SPARK_DIRECTIONS = [-112, -68, 68, 112];
const ZIGZAG: Pt[] = [[0, 0], [0.42, 1.5], [0.58, -1.5], [1, 0]];

function sparkLines(ps: ReturnType<typeof pose>, p: Profile): string[] {
  const u = ps.sparks;
  if (u <= 0) return [];
  const k = p.scale / 0.3;
  const g = 0.45 + 0.55 * u;
  const length = 7.5 * k * g;
  const reach = lerp(6, 20, u) * k;
  const o = onCircle(ps.male, p.radius);
  const theta = rad(ps.male + 90);
  const ct = Math.cos(theta), st = Math.sin(theta);
  return SPARK_DIRECTIONS.map((dir) => {
    const c = Math.cos(rad(dir)), s = Math.sin(rad(dir));
    return ZIGZAG.map(([along, side]) => {
      const dist = reach - length + along * length;
      const off = side * k * g;
      const x = c * dist - s * off;
      const y = s * dist + c * off;
      return `${f(o[0] + ct * x - st * y)},${f(o[1] + st * x + ct * y)}`;
    }).join(" ");
  });
}

const ROUND = { strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;

/** The plug and its cable at time t of the cycle; colours from the --spina-* tokens. */
const Frame = memo(function Frame({ t, size }: { t: number; size: number }) {
  const p = size < 48 ? SMALL : PAGE;
  const ps = pose(t, p);
  const cable = cablePath(ps, p);
  const sparks = sparkLines(ps, p);
  return (
    <svg aria-hidden viewBox="0 0 200 200" width={size} height={size} className="block shrink-0">
      {cable && (
        <>
          <path d={cable} {...ROUND} stroke="var(--spina-corpo)" strokeWidth={p.cable} />
          {p.details && <path d={cable} {...ROUND} stroke="var(--spina-accesa)" strokeOpacity={128 / 255} strokeWidth={1.3} />}
        </>
      )}
      <g transform={outlineTransform(ps.male, p, false)}>
        {PINS.map((pin) => (
          <polygon
            key={pin}
            points={pin}
            fill={p.details ? "var(--spina-astine)" : "var(--spina-collare)"}
            stroke={p.details ? "var(--spina-bordo-astine)" : undefined}
            strokeWidth={1.2}
          />
        ))}
        <polygon points={BODY} fill="var(--spina-corpo)" />
        <polygon points={COLLAR} fill="var(--spina-collare)" />
      </g>
      <g transform={outlineTransform(ps.female, p, true)}>
        <polygon points={BODY} fill={ps.plugged ? "var(--spina-accesa)" : "var(--spina-corpo)"} />
        <polygon points={COLLAR} fill="var(--spina-collare)" />
        <polygon points={COLLAR} transform={COLLAR_CLOSE} fill="var(--spina-collare)" />
      </g>
      {sparks.map((s) => (
        <polyline
          key={s}
          points={s}
          {...ROUND}
          stroke="var(--spina-accesa)"
          strokeOpacity={Math.min(1, ps.sparks * 3)}
          strokeWidth={p.sparks}
        />
      ))}
    </svg>
  );
});

/**
 * Runs one cycle every 3.2 s. With reduced motion it stands still on the moment it plugs in.
 * `t` pins a moment of the cycle (0..1).
 */
export function PluggersLoader({ size = 96, t }: { size?: number; t?: number }) {
  const reduce = useReducedMotionSafe();
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (t !== undefined || reduce) return;
    let start: number | undefined;
    let id = requestAnimationFrame(function frame(ms) {
      start ??= ms;
      setNow(((ms - start) % LOADER_CYCLE_MS) / LOADER_CYCLE_MS);
      id = requestAnimationFrame(frame);
    });
    return () => cancelAnimationFrame(id);
  }, [t, reduce]);

  return <Frame t={t ?? (reduce ? END_RUN : now)} size={size} />;
}
