"use client";

/**
 * Bord-componist: tekent een gastronomisch bord in de huisstijl op basis van een
 * korte beschrijving (`ComposedDish`): bord, compositie, saus, hoofdonderdeel,
 * garnituur en kruiden. Zo krijgt elk recept een eigen, consistente illustratie
 * met dezelfde lagen als de handgecomponeerde borden (voor de plating-animatie).
 */

import type { ReactNode } from "react";
import type { ComposedDish, GarnishKind, HerbKind } from "@/lib/types";
import { PALETTE, type PaletteKey, type Tri } from "./palette";
import { INK, LinearGradient, RadialGradient, cos, outline, rand, sin, useUid } from "./kit";
import {
  BeetWedge,
  Berry,
  CherryHalf,
  Chervil,
  Chives,
  Cress,
  Dot,
  Flakes,
  FondantPotato,
  Hazelnut,
  Leaf,
  Micro,
  MushroomHalf,
  OnionPetal,
  ParsnipCrisp,
  Pepper,
  Pop,
  Quenelle,
  RoastCarrot,
  RoastedShallot,
  Rosemary,
  SageLeaf,
  Samphire,
  Smudges,
  Swoosh,
  TomatoHalf,
  scatter,
  spiralPath,
  type DishLayers,
} from "./dishes";

type Pt = [number, number];
type Bezier = [Pt, Pt, Pt, Pt];

const pal = (key: PaletteKey | undefined, fallback: PaletteKey): Tri => PALETTE[key ?? fallback];
const r1 = (v: number) => Math.round(v * 10) / 10;
const rad = (deg: number) => (deg * Math.PI) / 180;

function bezierPoint([p0, p1, p2, p3]: Bezier, t: number): Pt {
  const u = 1 - t;
  const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
  const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
  return [r1(x), r1(y)];
}

const bezierPath = (b: Bezier) => `M${b[0][0]} ${b[0][1]} C ${b[1][0]} ${b[1][1]} ${b[2][0]} ${b[2][1]} ${b[3][0]} ${b[3][1]}`;

/* ------------------------------------------------------------------ */
/* Composities                                                         */
/* ------------------------------------------------------------------ */
interface Geometry {
  sauce: Bezier;
  pool: Pt;
  main: Pt;
  rot: number;
  cluster: Pt[];
  garnish: Pt[];
  herbs: Pt[];
  smudges: [number, number, number][];
}

const LAYOUTS: Record<ComposedDish["layout"], Geometry> = {
  diagonal: {
    sauce: [[116, 266], [150, 206], [222, 170], [302, 176]],
    pool: [205, 214],
    main: [205, 212],
    rot: -30,
    cluster: [[160, 238], [208, 214], [256, 190], [184, 176], [238, 252]],
    garnish: [[282, 262], [124, 206], [244, 140], [318, 232], [150, 286], [168, 158], [300, 196], [230, 292]],
    herbs: [[196, 196], [228, 208], [176, 226], [250, 184]],
    smudges: [[338, 104, 6], [70, 286, 5]],
  },
  center: {
    sauce: [[132, 236], [166, 176], [242, 166], [282, 216]],
    pool: [200, 206],
    main: [200, 202],
    rot: 0,
    cluster: [[168, 190], [232, 190], [200, 240], [200, 160], [160, 236]],
    garnish: [[259, 135], [291, 221], [231, 291], [141, 275], [109, 189], [169, 119], [280, 251], [114, 236]],
    herbs: [[194, 188], [214, 206], [184, 214], [210, 180]],
    smudges: [[334, 130, 5], [76, 272, 6]],
  },
  trio: {
    sauce: [[122, 238], [170, 224], [232, 220], [292, 192]],
    pool: [206, 216],
    main: [214, 208],
    rot: -15,
    cluster: [[160, 228], [214, 212], [268, 194], [186, 180], [242, 250]],
    garnish: [[188, 254], [242, 240], [292, 224], [134, 256], [306, 176], [146, 182], [240, 166], [180, 188]],
    herbs: [[162, 214], [214, 198], [268, 180], [296, 206]],
    smudges: [[330, 290, 6], [84, 128, 5]],
  },
  bowl: {
    sauce: [[132, 240], [160, 180], [240, 160], [286, 206]],
    pool: [200, 200],
    main: [220, 190],
    rot: -20,
    cluster: [[190, 176], [246, 196], [212, 232], [170, 222], [236, 150]],
    garnish: [[160, 238], [252, 248], [146, 178], [278, 160], [206, 146], [186, 274], [290, 212], [128, 214]],
    herbs: [[214, 176], [238, 204], [196, 212], [228, 158]],
    smudges: [[340, 150, 5], [80, 270, 6]],
  },
  offset: {
    sauce: [[128, 292], [146, 238], [150, 176], [196, 132]],
    pool: [234, 208],
    main: [236, 206],
    rot: 20,
    cluster: [[222, 178], [262, 214], [216, 240], [270, 160], [196, 206]],
    garnish: [[146, 206], [168, 266], [174, 150], [292, 274], [306, 170], [122, 244], [250, 128], [220, 298]],
    herbs: [[226, 194], [252, 212], [236, 228], [210, 206]],
    smudges: [[70, 150, 5], [330, 300, 6]],
  },
  scatter: {
    sauce: [[126, 252], [170, 212], [240, 192], [290, 152]],
    pool: [200, 204],
    main: [200, 204],
    rot: 0,
    cluster: [[150, 172], [238, 150], [278, 228], [198, 240], [128, 250], [212, 196]],
    garnish: [[182, 140], [302, 180], [252, 272], [146, 212], [224, 302], [106, 198], [276, 130], [160, 294]],
    herbs: [[150, 172], [238, 150], [278, 228], [198, 240]],
    smudges: [[336, 116, 5], [72, 286, 6]],
  },
};

/* ------------------------------------------------------------------ */
/* Saus                                                                */
/* ------------------------------------------------------------------ */
function Pool({ at, c, accent }: { at: Pt; c: Tri; accent: Tri | null }) {
  const id = useUid();
  const points = Array.from({ length: 14 }).map((_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const jitter = 0.86 + rand(i, 41) * 0.22;
    return [r1(at[0] + cos(a) * 92 * jitter), r1(at[1] + sin(a) * 76 * jitter)] as Pt;
  });
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ") + " Z";
  return (
    <g>
      <defs>
        <RadialGradient id={id} cx={0.42} cy={0.38} r={0.75} stops={[[0, c[0]], [0.6, c[1]], [1, c[2]]]} />
      </defs>
      <path d={d} fill={`url(#${id})`} stroke={INK} strokeWidth={1.6} strokeOpacity={0.55} strokeLinejoin="round" />
      <ellipse cx={at[0] - 34} cy={at[1] - 42} rx={32} ry={9} fill="#FFFFFF" opacity={0.55} transform={`rotate(-18 ${at[0] - 34} ${at[1] - 42})`} />
      {accent &&
        [0.1, 0.32, 0.55, 0.78, 0.92].map((t, i) => {
          const a = t * Math.PI * 2;
          return <Dot key={i} x={r1(at[0] + cos(a) * 66)} y={r1(at[1] + sin(a) * 52)} r={[5, 3.6, 4.4, 3, 3.8][i]} c={accent} />;
        })}
    </g>
  );
}

function Fill({ c, accent, deep }: { c: Tri; accent: Tri | null; deep: boolean }) {
  const id = useUid();
  const r = deep ? 122 : 114;
  return (
    <g>
      <defs>
        <RadialGradient id={id} cx={0.42} cy={0.38} r={0.72} stops={[[0, c[0]], [0.6, c[1]], [1, c[2]]]} />
      </defs>
      <circle cx={200} cy={200} r={r} fill={`url(#${id})`} stroke={INK} strokeWidth={1.4} strokeOpacity={0.55} />
      <path d={`M${200 - r * 0.78} ${200 - r * 0.35} A ${r * 0.85} ${r * 0.85} 0 0 1 ${200 - r * 0.25} ${200 - r * 0.82}`} stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={8} fill="none" strokeLinecap="round" />
      {accent &&
        [
          [150, 168, 4.5],
          [262, 234, 5],
          [236, 142, 3.4],
          [146, 246, 3],
          [290, 178, 2.8],
        ].map(([x, y, rr], i) => <Dot key={i} x={x} y={y} r={rr} c={accent} />)}
    </g>
  );
}

function ComposedSauce({ spec, g }: { spec: ComposedDish; g: Geometry }) {
  const c = pal(spec.sauce.color, "cream");
  const accent = spec.sauce.accent ? PALETTE[spec.sauce.accent] : null;
  const d = bezierPath(g.sauce);
  const [p2, p3] = [g.sauce[2], g.sauce[3]];
  const len = Math.hypot(p3[0] - p2[0], p3[1] - p2[1]) || 1;
  const dir: Pt = [(p3[0] - p2[0]) / len, (p3[1] - p2[1]) / len];
  const tail = [14, 30, 43].map((k, i) => [r1(p3[0] + dir[0] * k + i * 2), r1(p3[1] + dir[1] * k + 6 + i * 6)] as Pt);

  switch (spec.sauce.style) {
    case "swoosh":
      return (
        <g>
          <Swoosh d={d} w={24} c={c} />
          {tail.map(([x, y], i) => (
            <Dot key={i} x={x} y={y} r={[7.5, 5, 3.2][i]} c={accent ?? c} />
          ))}
        </g>
      );
    case "smear":
      return (
        <g>
          <Swoosh d={d} w={46} c={c} />
          <path d={d} transform="translate(8 -8)" stroke={c[2]} strokeOpacity={0.3} strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d={d} transform="translate(-6 10)" stroke={c[2]} strokeOpacity={0.25} strokeWidth={1.5} fill="none" strokeLinecap="round" />
          {accent &&
            [0.12, 0.45, 0.8].map((t, i) => {
              const [x, y] = bezierPoint(g.sauce, t);
              return <Dot key={i} x={x + 32} y={y + 30} r={[5, 3.8, 4.4][i]} c={accent} />;
            })}
        </g>
      );
    case "line":
      return (
        <g>
          <Swoosh d={d} w={9} c={c} />
          {tail.map(([x, y], i) => (
            <Dot key={i} x={x} y={y} r={[5.5, 3.8, 2.6][i]} c={accent ?? c} />
          ))}
        </g>
      );
    case "dots":
      return (
        <g>
          {[0.02, 0.24, 0.46, 0.66, 0.84, 0.97].map((t, i) => {
            const [x, y] = bezierPoint(g.sauce, t);
            return <Dot key={i} x={x} y={y} r={[12, 9.5, 7.5, 6, 4.4, 3.2][i]} c={i % 2 && accent ? accent : c} />;
          })}
        </g>
      );
    case "pool":
      return <Pool at={g.pool} c={c} accent={accent} />;
    case "fill":
      return <Fill c={c} accent={accent} deep={spec.plate === "bowl" || spec.plate === "bowl-stone"} />;
    case "crumble":
      return (
        <g>
          {Array.from({ length: 48 }).map((_, i) => {
            const [bx, by] = bezierPoint(g.sauce, i / 47);
            const x = r1(bx + (rand(i, 51) - 0.5) * 18);
            const y = r1(by + (rand(i, 52) - 0.5) * 18);
            const s = r1(2.5 + rand(i, 53) * 4.5);
            return (
              <path
                key={i}
                d={`M${r1(x - s)} ${y} L ${r1(x - s * 0.2)} ${r1(y - s)} L ${r1(x + s)} ${r1(y - s * 0.3)} L ${r1(x + s * 0.4)} ${r1(y + s * 0.8)} Z`}
                fill={i % 3 === 0 ? c[1] : c[2]}
                stroke={INK}
                strokeWidth={0.8}
                strokeLinejoin="round"
              />
            );
          })}
          {accent && [0.9, 0.97].map((t, i) => {
            const [x, y] = bezierPoint(g.sauce, t);
            return <Dot key={`a${i}`} x={x + 16} y={y + 22} r={[7, 4.5][i]} c={accent} />;
          })}
        </g>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Hoofdonderdelen                                                     */
/* ------------------------------------------------------------------ */
const SLICE = "M-15 -36 Q -20 0 -15 36 Q 0 42 15 36 Q 20 0 15 -36 Q 0 -42 -15 -36 Z";
const FILLET = "M-109 24 C -81 -28 33 -50 89 -32 C 109 -26 111 -6 93 2 C 39 34 -69 52 -109 24 Z";

function Slices({ at, rot, c, crust, count, fat }: { at: Pt; rot: number; c: Tri; crust: Tri; count: number; fat?: Tri }) {
  const id = useUid();
  const dx = cos(rad(rot)) * 25;
  const dy = sin(rad(rot)) * 25;
  return (
    <g>
      <defs>
        <RadialGradient id={id} cx={0.5} cy={0.5} r={0.6} stops={[[0, c[0]], [0.5, c[1]], [0.82, c[2]], [1, crust[2]]]} />
        {fat && <LinearGradient id={`${id}f`} stops={[[0, fat[0]], [1, fat[2]]]} />}
      </defs>
      <ellipse cx={at[0] + 6} cy={at[1] + 10} rx={count * 20 + 20} ry={34} fill={INK} opacity={0.12} transform={`rotate(${rot} ${at[0]} ${at[1]})`} />
      {Array.from({ length: count }).map((_, i) => {
        const k = i - (count - 1) / 2;
        return (
          <g key={i} transform={`translate(${r1(at[0] + k * dx)} ${r1(at[1] + k * dy)}) rotate(${rot})`}>
            <path d={SLICE} fill="none" stroke={INK} strokeWidth={9.5} strokeLinejoin="round" />
            <path d={SLICE} fill={`url(#${id})`} stroke={crust[1]} strokeWidth={6} strokeLinejoin="round" />
            {fat && <path d="M-16 -36 Q 0 -44 16 -36 L 15 -20 Q 0 -26 -15 -20 Z" fill={`url(#${id}f)`} stroke={INK} strokeWidth={1.2} />}
            <path d="M-6 -16 Q -8 4 -5 22" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" fill="none" />
          </g>
        );
      })}
    </g>
  );
}

function Fillet({ at, rot, c, flesh }: { at: Pt; rot: number; c: Tri; flesh: Tri }) {
  const id = useUid();
  return (
    <g transform={`translate(${at[0]} ${at[1]}) rotate(${rot + 18})`}>
      <defs>
        <LinearGradient id={id} x2={0.3} y2={1} stops={[[0, c[0]], [0.45, c[1]], [1, c[2]]]} />
      </defs>
      <path d={FILLET} transform="translate(5 9)" fill={INK} opacity={0.16} />
      <path d={FILLET} transform="translate(2 5)" fill={flesh[0]} {...outline} />
      <path d={FILLET} fill={`url(#${id})`} {...outline} />
      {[-54, -12, 30].map((x0) => (
        <path key={x0} d={`M${x0} 14 C ${x0 + 12} 0 ${x0 + 26} -8 ${x0 + 40} -12`} stroke={c[2]} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.7} />
      ))}
      <path d="M-86 14 C -46 -18 34 -34 84 -26" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  );
}

function Medallions({ pts, c, ring, r = 27 }: { pts: Pt[]; c: Tri; ring: Tri; r?: number }) {
  const id = useUid();
  return (
    <g>
      <defs>
        <RadialGradient id={id} cx={0.45} cy={0.42} r={0.62} stops={[[0, c[0]], [0.55, c[1]], [1, c[2]]]} />
      </defs>
      {pts.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r={r + 1} fill={INK} opacity={0.22} transform="translate(3 5)" />
          <circle r={r} fill={ring[0]} {...outline} />
          <circle r={r * 0.8} fill={`url(#${id})`} stroke={ring[2]} strokeWidth={1.2} />
          <circle r={r * 0.48} fill="none" stroke={c[2]} strokeWidth={1} opacity={0.45} />
          <ellipse cx={-r * 0.3} cy={-r * 0.32} rx={r * 0.26} ry={r * 0.14} fill="#FFFFFF" opacity={0.5} />
        </g>
      ))}
    </g>
  );
}

function Dome({ at, c, accent, r = 52 }: { at: Pt; c: Tri; accent: Tri | null; r?: number }) {
  const id = useUid();
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <defs>
        <RadialGradient id={id} cx={0.38} cy={0.34} r={0.75} stops={[[0, c[0]], [0.6, c[1]], [1, c[2]]]} />
      </defs>
      <circle r={r + 2} fill={INK} opacity={0.16} transform="translate(5 9)" />
      <circle r={r} fill={`url(#${id})`} {...outline} />
      {accent && (
        <path
          d={`M${r1(-r * 0.58)} ${r1(-r * 0.12)} C ${r1(-r * 0.36)} ${r1(-r * 0.62)} ${r1(r * 0.36)} ${r1(-r * 0.66)} ${r1(r * 0.6)} ${r1(-r * 0.18)} C ${r1(r * 0.44)} ${r1(r * 0.08)} ${r1(r * 0.24)} ${r1(-r * 0.06)} ${r1(r * 0.08)} ${r1(r * 0.16)} C ${r1(-r * 0.14)} ${r1(r * 0.34)} ${r1(-r * 0.3)} ${r1(r * 0.04)} ${r1(-r * 0.58)} ${r1(-r * 0.12)} Z`}
          fill={accent[1]}
          stroke={accent[2]}
          strokeWidth={1.2}
        />
      )}
      <path d={`M${r1(-r * 0.66)} ${r1(-r * 0.16)} A ${r1(r * 0.7)} ${r1(r * 0.7)} 0 0 1 ${r1(-r * 0.14)} ${r1(-r * 0.68)}`} stroke="#FFFFFF" strokeOpacity={0.75} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
}

function Nest({ at, c }: { at: Pt; c: Tri }) {
  const d = spiralPath(at[0], at[1], 4.2, 4, 70);
  return (
    <g>
      <ellipse cx={at[0] + 6} cy={at[1] + 10} rx={78} ry={70} fill={INK} opacity={0.12} />
      <path d={d} stroke={INK} strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={c[1]} strokeWidth={11.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={c[0]} strokeWidth={5.5} fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(-1.2 -1.6)" />
    </g>
  );
}

function Tart({ at, c, crust }: { at: Pt; c: Tri; crust: Tri }) {
  const id = useUid();
  const R = 76;
  const d =
    Array.from({ length: 26 })
      .map((_, i) => {
        const a0 = (i / 26) * Math.PI * 2;
        const am = ((i + 0.5) / 26) * Math.PI * 2;
        const a1 = ((i + 1) / 26) * Math.PI * 2;
        return `${i === 0 ? `M${r1(at[0] + cos(a0) * R)} ${r1(at[1] + sin(a0) * R)}` : ""} Q ${r1(at[0] + cos(am) * (R + 6))} ${r1(at[1] + sin(am) * (R + 6))} ${r1(at[0] + cos(a1) * R)} ${r1(at[1] + sin(a1) * R)}`;
      })
      .join(" ") + " Z";
  return (
    <g>
      <defs>
        <RadialGradient id={`${id}p`} cx={0.4} cy={0.35} r={0.75} stops={[[0, crust[0]], [0.7, crust[1]], [1, crust[2]]]} />
        <RadialGradient id={`${id}f`} cx={0.4} cy={0.35} r={0.75} stops={[[0, c[0]], [0.6, c[1]], [1, c[2]]]} />
      </defs>
      <circle cx={at[0] + 6} cy={at[1] + 8} r={84} fill={INK} opacity={0.15} />
      <path d={d} fill={`url(#${id}p)`} {...outline} />
      <circle cx={at[0]} cy={at[1]} r={60} fill={`url(#${id}f)`} stroke={INK} strokeWidth={1.6} />
      <ellipse cx={at[0] - 20} cy={at[1] - 24} rx={24} ry={9} fill="#FFFFFF" opacity={0.5} transform={`rotate(-30 ${at[0] - 20} ${at[1] - 24})`} />
    </g>
  );
}

function Tower({ at, c, accent }: { at: Pt; c: Tri; accent: Tri | null }) {
  const cubes = scatter(28, 0, 0, 36, 36, 301);
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <circle r={50} fill={INK} opacity={0.15} transform="translate(4 8)" />
      <circle r={47} fill={c[2]} {...outline} />
      <circle r={44} fill={c[1]} />
      {cubes.map(([x, y], i) => (
        <rect key={i} x={r1(x - 4)} y={r1(y - 4)} width={8} height={8} rx={1.5} fill={i % 3 === 0 ? c[0] : c[1]} stroke={c[2]} strokeWidth={0.8} transform={`rotate(${Math.round(rand(i, 302) * 90)} ${r1(x)} ${r1(y)})`} />
      ))}
      {accent && (
        <g>
          <circle r={17} fill={accent[1]} {...outline} strokeWidth={1.6} />
          <ellipse cx={-5} cy={-6} rx={6} ry={3.5} fill="#FFFFFF" opacity={0.6} />
        </g>
      )}
    </g>
  );
}

function Spears({ at, rot, c, count }: { at: Pt; rot: number; c: Tri; count: number }) {
  const id = useUid();
  const len = 130;
  return (
    <g transform={`translate(${at[0]} ${at[1]}) rotate(${rot})`}>
      <defs>
        <LinearGradient id={id} stops={[[0, c[0]], [1, c[2]]]} />
      </defs>
      {Array.from({ length: count }).map((_, i) => {
        const k = i - (count - 1) / 2;
        return (
          <g key={i} transform={`translate(${-len / 2 + (i % 2) * 8} ${r1(k * 15)})`}>
            <path d={`M0 -5 L ${len} -5 C ${len + 10} -8 ${len + 22} -3 ${len + 24} 0 C ${len + 22} 3 ${len + 10} 8 ${len} 5 L 0 5 Z`} fill={`url(#${id})`} {...outline} strokeWidth={1.8} />
            {[0.3, 0.55, 0.8].map((t) => (
              <path key={t} d={`M${len * t} -5 l 7 5 l -7 1`} stroke={INK} strokeWidth={0.9} fill={c[1]} />
            ))}
            <path d={`M6 -2 L ${len - 10} -2`} stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={1.6} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

function Swirl({ at, c }: { at: Pt; c: Tri }) {
  const d = spiralPath(at[0], at[1], 2.6, 4, 40, 0.9);
  return (
    <g>
      <path d={d} stroke={c[2]} strokeWidth={11} fill="none" strokeLinecap="round" opacity={0.45} transform="translate(2 3)" />
      <path d={d} stroke={c[0]} strokeWidth={8} fill="none" strokeLinecap="round" />
      <path d={d} stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" transform="translate(-1 -2)" />
    </g>
  );
}

function Grains({ at, c }: { at: Pt; c: Tri }) {
  const id = useUid();
  const points = Array.from({ length: 16 }).map((_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const j = 0.88 + rand(i, 61) * 0.18;
    return [r1(at[0] + cos(a) * 96 * j), r1(at[1] + sin(a) * 88 * j)] as Pt;
  });
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ") + " Z";
  return (
    <g>
      <defs>
        <RadialGradient id={id} cx={0.42} cy={0.38} r={0.75} stops={[[0, c[0]], [0.6, c[1]], [1, c[2]]]} />
      </defs>
      <path d={d} fill={`url(#${id})`} stroke={INK} strokeWidth={1.8} strokeOpacity={0.7} strokeLinejoin="round" />
      {scatter(100, at[0], at[1], 84, 76, 62).map(([x, y], i) => (
        <ellipse key={i} cx={r1(x)} cy={r1(y)} rx={4.4} ry={2.4} fill={c[0]} stroke={c[2]} strokeWidth={0.7} transform={`rotate(${Math.round(rand(i, 63) * 180)} ${r1(x)} ${r1(y)})`} />
      ))}
    </g>
  );
}

function Wedges({ at, c, accent, count }: { at: Pt; c: Tri; accent: Tri | null; count: number }) {
  const id = useUid();
  return (
    <g>
      <defs>
        <RadialGradient id={id} cx={0.5} cy={0.1} r={1} stops={[[0, c[0]], [0.6, c[1]], [1, c[2]]]} />
      </defs>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * 360 + 18;
        const x = r1(at[0] + cos(rad(a)) * 38);
        const y = r1(at[1] + sin(rad(a)) * 38);
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${Math.round(a + 90)})`}>
            <path d="M0 -34 L 28 18 Q 0 34 -28 18 Z" fill={`url(#${id})`} {...outline} strokeLinejoin="round" />
            <path d="M-18 14 Q 0 24 18 14 M -10 4 Q 0 10 10 4" stroke={accent ? accent[2] : c[0]} strokeWidth={1.8} fill="none" opacity={0.7} />
          </g>
        );
      })}
    </g>
  );
}

function Bar({ at, rot, c, accent }: { at: Pt; rot: number; c: Tri; accent: Tri }) {
  return (
    <g transform={`translate(${at[0]} ${at[1]}) rotate(${rot})`}>
      <rect x={-80} y={-30} width={164} height={64} rx={6} fill={INK} opacity={0.15} transform="translate(4 8)" />
      <rect x={-80} y={-32} width={160} height={64} rx={6} fill={c[1]} {...outline} />
      <rect x={-80} y={-32} width={160} height={16} rx={6} fill={accent[1]} stroke={INK} strokeWidth={1.2} />
      <rect x={-80} y={-2} width={160} height={9} fill={accent[0]} stroke={INK} strokeWidth={1} strokeOpacity={0.6} />
      <rect x={-80} y={20} width={160} height={12} rx={4} fill={accent[2]} stroke={INK} strokeWidth={1.2} />
      {scatter(14, 0, 8, 70, 6, 71).map(([x, y], i) => (
        <circle key={i} cx={r1(x)} cy={r1(y - 16)} r={1.6} fill={c[2]} opacity={0.6} />
      ))}
      <path d="M-70 -26 L 60 -26" stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}

function Chops({ at, rot, c, crust, count }: { at: Pt; rot: number; c: Tri; crust: Tri; count: number }) {
  const id = useUid();
  return (
    <g>
      <defs>
        <RadialGradient id={id} cx={0.5} cy={0.5} r={0.6} stops={[[0, c[0]], [0.55, c[1]], [1, c[2]]]} />
      </defs>
      {Array.from({ length: count }).map((_, i) => {
        const k = i - (count - 1) / 2;
        const angle = rot + k * 24;
        const x = r1(at[0] + k * 34);
        const y = r1(at[1] + Math.abs(k) * 10);
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${angle})`}>
            <rect x={-6} y={-92} width={12} height={62} rx={6} fill="#F6EEDF" {...outline} strokeWidth={1.8} />
            <path d="M-3 -86 L -3 -40" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
            <ellipse cx={0} cy={0} rx={31} ry={34} fill={INK} opacity={0.14} transform="translate(3 6)" />
            <ellipse cx={0} cy={0} rx={31} ry={34} fill={crust[1]} {...outline} />
            <ellipse cx={1} cy={2} rx={22} ry={25} fill={`url(#${id})`} />
            <path d="M-12 -14 Q -16 0 -10 12" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={3} fill="none" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

function Shells({ pts, c, shell }: { pts: Pt[]; c: Tri; shell: Tri }) {
  const id = useUid();
  return (
    <g>
      <defs>
        <RadialGradient id={id} cx={0.45} cy={0.4} r={0.7} stops={[[0, c[0]], [0.6, c[1]], [1, c[2]]]} />
      </defs>
      {pts.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${[-20, 30, 160, 80, -70][i % 5]})`}>
          <path d="M0 -40 C 26 -36 36 -8 30 14 C 26 38 -20 42 -30 18 C -38 -2 -26 -36 0 -40 Z" fill={shell[1]} {...outline} />
          <path d="M-18 -20 C -8 -24 10 -24 20 -18 M -24 0 C -10 -4 14 -4 26 2 M -22 20 C -8 16 12 16 22 22" stroke={shell[2]} strokeWidth={1.4} fill="none" opacity={0.7} />
          <path d="M0 -28 C 16 -24 22 -6 18 8 C 14 24 -12 26 -18 12 C -22 0 -16 -24 0 -28 Z" fill={`url(#${id})`} stroke={INK} strokeWidth={1.2} />
          <path d="M-10 -12 C -2 -18 8 -16 12 -8" stroke={c[2]} strokeWidth={1.2} fill="none" />
          <ellipse cx={-6} cy={-14} rx={5} ry={3} fill="#FFFFFF" opacity={0.7} />
        </g>
      ))}
    </g>
  );
}

function Ravioli({ pts, c }: { pts: Pt[]; c: Tri }) {
  const id = useUid();
  return (
    <g>
      <defs>
        <RadialGradient id={id} cx={0.45} cy={0.4} r={0.7} stops={[[0, c[0]], [0.65, c[1]], [1, c[2]]]} />
      </defs>
      {pts.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${Math.round(rand(i, 81) * 40 - 20)})`}>
          <rect x={-26} y={-26} width={52} height={52} rx={8} fill={INK} opacity={0.15} transform="translate(3 5)" />
          <rect x={-26} y={-26} width={52} height={52} rx={8} fill={`url(#${id})`} {...outline} />
          <rect x={-20} y={-20} width={40} height={40} rx={6} fill="none" stroke={c[2]} strokeWidth={1.4} strokeDasharray="3 3" />
          <circle r={12} fill={c[0]} stroke={c[2]} strokeWidth={1} opacity={0.9} />
          <ellipse cx={-5} cy={-6} rx={5} ry={3} fill="#FFFFFF" opacity={0.6} />
        </g>
      ))}
    </g>
  );
}

function Gnocchi({ at, c, count }: { at: Pt; c: Tri; count: number }) {
  const id = useUid();
  const pts = scatter(count, at[0], at[1], 58, 52, 91);
  return (
    <g>
      <defs>
        <RadialGradient id={id} cx={0.4} cy={0.35} r={0.75} stops={[[0, c[0]], [0.6, c[1]], [1, c[2]]]} />
      </defs>
      {pts.map(([x, y], i) => (
        <g key={i} transform={`translate(${r1(x)} ${r1(y)}) rotate(${Math.round(rand(i, 92) * 180)})`}>
          <ellipse rx={17} ry={11} fill={`url(#${id})`} {...outline} strokeWidth={1.8} />
          {[-8, -3, 2, 7].map((gx) => (
            <path key={gx} d={`M${gx} -8 q 2 8 0 16`} stroke={c[2]} strokeWidth={1.1} fill="none" opacity={0.7} />
          ))}
          <ellipse cx={-6} cy={-4} rx={5} ry={2.4} fill="#FFFFFF" opacity={0.5} />
        </g>
      ))}
    </g>
  );
}

function Ramekin({ at, c, accent }: { at: Pt; c: Tri; accent: Tri | null }) {
  const id = useUid();
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <defs>
        <RadialGradient id={id} cx={0.42} cy={0.38} r={0.72} stops={[[0, c[0]], [0.6, c[1]], [1, c[2]]]} />
      </defs>
      <circle r={74} fill={INK} opacity={0.16} transform="translate(5 9)" />
      <circle r={72} fill="#FFFFFF" {...outline} />
      {Array.from({ length: 28 }).map((_, i) => {
        const a = (i / 28) * Math.PI * 2;
        return <line key={i} x1={r1(cos(a) * 62)} y1={r1(sin(a) * 62)} x2={r1(cos(a) * 71)} y2={r1(sin(a) * 71)} stroke={INK} strokeWidth={0.8} opacity={0.25} />;
      })}
      <circle r={60} fill={`url(#${id})`} stroke={INK} strokeWidth={1.6} />
      <path d="M-30 -10 L -8 4 L 14 -6 L 30 12 M -8 4 L -2 30" stroke={c[2]} strokeWidth={1.4} fill="none" opacity={0.55} />
      {accent && scatter(40, 0, 0, 50, 50, 101).map(([x, y], i) => <circle key={i} cx={r1(x)} cy={r1(y)} r={1.3} fill={accent[0]} opacity={0.9} />)}
      <ellipse cx={-22} cy={-26} rx={18} ry={7} fill="#FFFFFF" opacity={0.45} transform="rotate(-30 -22 -26)" />
    </g>
  );
}

function Halves({ at, rot, c, skin }: { at: Pt; rot: number; c: Tri; skin: Tri }) {
  const id = useUid();
  return (
    <g transform={`translate(${at[0]} ${at[1]}) rotate(${rot})`}>
      <defs>
        <RadialGradient id={id} cx={0.45} cy={0.4} r={0.7} stops={[[0, c[0]], [0.6, c[1]], [1, c[2]]]} />
      </defs>
      {[-28, 30].map((oy, i) => (
        <g key={oy} transform={`translate(${i ? 14 : -10} ${oy})`}>
          <ellipse rx={76} ry={27} fill={INK} opacity={0.15} transform="translate(4 7)" />
          <ellipse rx={76} ry={27} fill={skin[1]} {...outline} />
          <ellipse rx={69} ry={21} fill={`url(#${id})`} stroke={INK} strokeWidth={1.1} />
          {[-40, -20, 0, 20, 40].map((x) => (
            <path key={`a${x}`} d={`M${x - 10} -14 L ${x + 10} 14`} stroke={c[2]} strokeWidth={1.2} opacity={0.6} />
          ))}
          {[-40, -20, 0, 20, 40].map((x) => (
            <path key={`b${x}`} d={`M${x + 10} -14 L ${x - 10} 14`} stroke={c[2]} strokeWidth={1.2} opacity={0.6} />
          ))}
          <path d="M-54 -10 C -20 -18 20 -18 50 -10" stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M76 0 l 14 -4 l -2 8 Z" fill="#6A7A3A" {...outline} strokeWidth={1.2} />
        </g>
      ))}
    </g>
  );
}

function Prawns({ at, c, count }: { at: Pt; c: Tri; count: number }) {
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const a = -70 + (i * 140) / Math.max(1, count - 1);
        const x = r1(at[0] + cos(rad(a - 90)) * 44);
        const y = r1(at[1] + 30 + sin(rad(a - 90)) * 44);
        const body = "M-22 -20 C 4 -32 30 -14 24 10 C 20 26 2 30 -8 22";
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${Math.round(a)})`}>
            <path d={body} stroke={INK} strokeWidth={19} fill="none" strokeLinecap="round" />
            <path d={body} stroke={c[1]} strokeWidth={15} fill="none" strokeLinecap="round" />
            <path d={body} stroke={c[0]} strokeWidth={5} fill="none" strokeLinecap="round" transform="translate(-2 -3)" />
            {[
              [-6, -26, -4, -16],
              [8, -22, 4, -12],
              [18, -10, 10, -4],
              [18, 6, 10, 4],
            ].map(([x1, y1, x2, y2], k) => (
              <path key={k} d={`M${x1} ${y1} L ${x2} ${y2}`} stroke={c[2]} strokeWidth={1.4} />
            ))}
            <path d="M-8 22 l -14 10 l 2 -14 Z" fill={c[2]} {...outline} strokeWidth={1.2} />
            <path d="M-22 -20 l -10 -8 M -20 -18 l -12 -2" stroke={c[2]} strokeWidth={1.2} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

function Carpaccio({ at, c }: { at: Pt; c: Tri }) {
  const discs: Pt[] = [
    ...Array.from({ length: 9 }).map((_, i) => {
      const a = (i / 9) * Math.PI * 2;
      return [r1(at[0] + cos(a) * 66), r1(at[1] + sin(a) * 60)] as Pt;
    }),
    ...Array.from({ length: 4 }).map((_, i) => {
      const a = (i / 4) * Math.PI * 2 + 0.4;
      return [r1(at[0] + cos(a) * 26), r1(at[1] + sin(a) * 24)] as Pt;
    }),
  ];
  return (
    <g>
      {discs.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={32} fill={c[1]} fillOpacity={0.94} stroke={c[2]} strokeWidth={1.3} />
          <circle cx={x - 4} cy={y - 4} r={20} fill={c[0]} opacity={0.45} />
          <path d={`M${x - 20} ${y + 4} q 10 -10 20 0 t 18 0`} stroke={c[0]} strokeWidth={1.2} fill="none" opacity={0.8} />
        </g>
      ))}
    </g>
  );
}

function Cubes({ at, c, accent }: { at: Pt; c: Tri; accent: Tri | null }) {
  const pts = scatter(26, at[0], at[1], 48, 44, 111);
  return (
    <g>
      <ellipse cx={at[0] + 5} cy={at[1] + 8} rx={58} ry={52} fill={INK} opacity={0.1} />
      {pts.map(([x, y], i) => {
        const fill = accent && i % 4 === 0 ? accent[1] : i % 2 ? c[1] : c[0];
        return (
          <g key={i} transform={`translate(${r1(x)} ${r1(y)}) rotate(${Math.round(rand(i, 112) * 90)})`}>
            <rect x={-7} y={-7} width={14} height={14} rx={3} fill={fill} stroke={INK} strokeWidth={1} />
            <path d="M-4 -4 L 3 -4" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={1.4} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

function PoachedEgg({ at, c, yolk }: { at: Pt; c: Tri; yolk: Tri }) {
  const id = useUid();
  const pts = Array.from({ length: 12 }).map((_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const j = 0.82 + rand(i, 121) * 0.3;
    return [r1(at[0] + cos(a) * 46 * j), r1(at[1] + sin(a) * 40 * j)] as Pt;
  });
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ") + " Z";
  return (
    <g>
      <defs>
        <RadialGradient id={id} cx={0.4} cy={0.35} r={0.7} stops={[[0, yolk[0]], [0.6, yolk[1]], [1, yolk[2]]]} />
      </defs>
      <path d={d} fill={INK} opacity={0.12} transform="translate(4 7)" />
      <path d={d} fill={c[0]} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
      <path d={d} fill="none" stroke={c[2]} strokeWidth={4} opacity={0.35} transform={`translate(${r1(at[0] * 0.04)} ${r1(at[1] * 0.04)}) scale(0.96)`} />
      <circle cx={at[0] + 4} cy={at[1] - 2} r={19} fill={`url(#${id})`} {...outline} strokeWidth={1.6} />
      <ellipse cx={at[0] - 3} cy={at[1] - 9} rx={6} ry={3.5} fill="#FFFFFF" opacity={0.75} />
    </g>
  );
}

function Roll({ pts, c, pastry }: { pts: Pt[]; c: Tri; pastry: Tri }) {
  const id = useUid();
  const duxelles = PALETTE.duxelles;
  return (
    <g>
      <defs>
        <RadialGradient id={id} cx={0.5} cy={0.5} r={0.6} stops={[[0, c[0]], [0.6, c[1]], [1, c[2]]]} />
      </defs>
      {pts.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r={48} fill={INK} opacity={0.15} transform="translate(4 7)" />
          <circle r={46} fill={pastry[1]} {...outline} />
          {Array.from({ length: 12 }).map((_, k) => {
            const a = (k / 12) * Math.PI * 2;
            return <line key={k} x1={r1(cos(a) * 39)} y1={r1(sin(a) * 39)} x2={r1(cos(a) * 46)} y2={r1(sin(a) * 46)} stroke={pastry[2]} strokeWidth={1.2} />;
          })}
          <circle r={38} fill={duxelles[1]} stroke={INK} strokeWidth={1.2} />
          <circle r={31} fill={`url(#${id})`} stroke={c[2]} strokeWidth={2.5} />
          <path d="M-14 -12 Q -18 2 -12 14" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

function Pavlova({ at, c }: { at: Pt; c: Tri }) {
  const id = useUid();
  const m = PALETTE.meringue;
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <defs>
        <RadialGradient id={id} cx={0.4} cy={0.35} r={0.7} stops={[[0, m[0]], [0.7, m[1]], [1, m[2]]]} />
      </defs>
      <circle r={78} fill={INK} opacity={0.14} transform="translate(5 9)" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <circle key={i} cx={r1(cos(a) * 60)} cy={r1(sin(a) * 58)} r={19} fill={`url(#${id})`} {...outline} strokeWidth={1.6} />;
      })}
      <circle r={50} fill={c[1]} stroke={INK} strokeWidth={1.4} />
      <path d="M-30 -14 C -10 -30 20 -28 34 -10" stroke={c[0]} strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
  );
}

function Puffs({ pts, c }: { pts: Pt[]; c: Tri }) {
  const id = useUid();
  return (
    <g>
      <defs>
        <RadialGradient id={id} cx={0.38} cy={0.32} r={0.75} stops={[[0, c[0]], [0.6, c[1]], [1, c[2]]]} />
      </defs>
      {pts.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r={25} fill={INK} opacity={0.18} transform="translate(3 6)" />
          <circle r={24} fill={`url(#${id})`} {...outline} />
          <path d="M-12 -4 l 6 -6 l 5 4 M 4 8 l 6 -5 l 5 3 M -6 12 l 4 -4" stroke={c[2]} strokeWidth={1.3} fill="none" opacity={0.7} />
          {scatter(6, 0, -2, 14, 12, 131 + i).map(([fx, fy], k) => (
            <rect key={k} x={r1(fx - 1.5)} y={r1(fy - 1.5)} width={3} height={3} fill="#FFF4C8" opacity={0.9} />
          ))}
          <ellipse cx={-8} cy={-10} rx={7} ry={3.5} fill="#FFFFFF" opacity={0.45} />
        </g>
      ))}
    </g>
  );
}

function Fritters({ at, rot, c, count }: { at: Pt; rot: number; c: Tri; count: number }) {
  const id = useUid();
  return (
    <g>
      <defs>
        <RadialGradient id={id} cx={0.4} cy={0.35} r={0.75} stops={[[0, c[0]], [0.6, c[1]], [1, c[2]]]} />
      </defs>
      {Array.from({ length: count }).map((_, i) => {
        const k = i - (count - 1) / 2;
        return (
          <g key={i} transform={`translate(${r1(at[0] + k * 12)} ${r1(at[1] + k * 34)}) rotate(${rot + k * 10})`}>
            <ellipse rx={56} ry={18} fill={INK} opacity={0.14} transform="translate(4 6)" />
            <ellipse rx={56} ry={18} fill={`url(#${id})`} {...outline} />
            {scatter(14, 0, 0, 44, 10, 141 + i).map(([x, y], j) => (
              <circle key={j} cx={r1(x)} cy={r1(y)} r={1.5} fill={c[2]} opacity={0.55} />
            ))}
            <path d="M56 -2 l 12 -8 l 0 18 Z" fill="#6E9A4A" {...outline} strokeWidth={1.2} />
            <path d="M-40 -8 C -10 -14 20 -14 44 -8" stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

function ComposedMain({ spec, g }: { spec: ComposedDish; g: Geometry }) {
  const { kind, color, accent: accentKey, count } = spec.main;
  const c = pal(color, "beef");
  const accent = accentKey ? PALETTE[accentKey] : null;
  const n = (fallback: number) => Math.max(1, Math.min(count ?? fallback, 6));
  switch (kind) {
    case "slices":
      return <Slices at={g.main} rot={g.rot} c={c} crust={accent ?? PALETTE.crust} count={n(5)} fat={spec.main.accent === "golden" || spec.main.accent === "goldenSkin" ? PALETTE.golden : undefined} />;
    case "fillet":
      return <Fillet at={g.main} rot={g.rot} c={c} flesh={accent ?? PALETTE.whiteFish} />;
    case "medallions":
      return <Medallions pts={g.cluster.slice(0, n(3))} c={c} ring={accent ?? PALETTE.whiteFish} />;
    case "quenelle":
      return (
        <g>
          {g.cluster.slice(0, n(1)).map(([x, y], i) => (
            <Quenelle key={i} x={n(1) === 1 ? g.main[0] : x} y={n(1) === 1 ? g.main[1] : y} rot={g.rot - 2} s={n(1) === 1 ? 1.05 : 0.7} c={c} seeds={accentKey === "vanilla"} ridge={accent ? accent[0] : "#FFFFFF"} />
          ))}
        </g>
      );
    case "dome":
      return <Dome at={g.main} c={c} accent={accent} />;
    case "nest":
      return <Nest at={g.main} c={c} />;
    case "tart":
      return <Tart at={g.main} c={c} crust={accent ?? PALETTE.pastry} />;
    case "tower":
      return <Tower at={g.main} c={c} accent={accent} />;
    case "spears":
      return <Spears at={g.main} rot={g.rot} c={c} count={n(4)} />;
    case "swirl":
      return <Swirl at={g.main} c={c} />;
    case "grains":
      return <Grains at={g.pool} c={c} />;
    case "wedges":
      return <Wedges at={g.main} c={c} accent={accent} count={n(4)} />;
    case "bar":
      return <Bar at={g.main} rot={g.rot} c={c} accent={accent ?? PALETTE.pastry} />;
    case "chops":
      return <Chops at={g.main} rot={g.rot + 30} c={c} crust={accent ?? PALETTE.crust} count={n(3)} />;
    case "shells":
      return <Shells pts={g.cluster.slice(0, n(3))} c={c} shell={accent ?? PALETTE.shell} />;
    case "ravioli":
      return <Ravioli pts={g.cluster.slice(0, n(4))} c={c} />;
    case "gnocchi":
      return <Gnocchi at={g.main} c={c} count={Math.max(4, Math.min(count ?? 11, 16))} />;
    case "ramekin":
      return <Ramekin at={g.main} c={c} accent={accent} />;
    case "halves":
      return <Halves at={g.main} rot={g.rot} c={c} skin={accent ?? PALETTE.aubergine} />;
    case "prawns":
      return <Prawns at={g.main} c={c} count={n(5)} />;
    case "carpaccio":
      return <Carpaccio at={g.pool} c={c} />;
    case "cubes":
      return <Cubes at={g.main} c={c} accent={accent} />;
    case "egg":
      return <PoachedEgg at={g.main} c={c} yolk={accent ?? PALETTE.yolk} />;
    case "roll":
      return <Roll pts={g.cluster.slice(0, n(2))} c={c} pastry={accent ?? PALETTE.pastry} />;
    case "pavlova":
      return <Pavlova at={g.main} c={c} />;
    case "puffs":
      return <Puffs pts={g.cluster.slice(0, n(5))} c={c} />;
    case "fritters":
      return <Fritters at={g.main} rot={g.rot} c={c} count={n(3)} />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Garnituur                                                           */
/* ------------------------------------------------------------------ */
function GarnishPiece({ kind, at, i, c, variant }: { kind: GarnishKind; at: Pt; i: number; c: Tri; variant?: "blueberry" | "raspberry" | "cherry" }) {
  const [x, y] = at;
  const rot = Math.round(rand(i, 151) * 160 - 80);
  switch (kind) {
    case "berries":
      return (
        <g>
          <Berry x={x} y={y} r={variant === "raspberry" ? 10 : variant === "cherry" ? 11 : 8} kind={variant ?? "blueberry"} />
          <Berry x={x + 16} y={y - 10} r={variant === "raspberry" ? 8.5 : 7} kind={variant ?? "blueberry"} />
        </g>
      );
    case "dots":
      return (
        <g>
          <Dot x={x} y={y} r={6} c={c} />
          <Dot x={x + 14} y={y + 8} r={3.8} c={c} />
        </g>
      );
    case "tomatoes":
      return (
        <g>
          <TomatoHalf x={x} y={y} r={14} rot={rot} />
          <TomatoHalf x={x + 22} y={y + 12} r={11} yellow rot={-rot} />
        </g>
      );
    case "shallots":
      return <RoastedShallot x={x} y={y} rot={rot} />;
    case "mushrooms":
      return <MushroomHalf x={x} y={y} rot={rot} s={0.72} />;
    case "carrots":
      return <RoastCarrot x={x} y={y} rot={rot} s={0.6} />;
    case "crumble":
      return (
        <g>
          {scatter(10, x, y, 16, 12, 160 + i).map(([cx, cy], k) => (
            <path key={k} d={`M${r1(cx - 3)} ${r1(cy)} L ${r1(cx)} ${r1(cy - 4)} L ${r1(cx + 4)} ${r1(cy - 1)} L ${r1(cx + 2)} ${r1(cy + 3)} Z`} fill={k % 2 ? c[1] : c[2]} stroke={INK} strokeWidth={0.7} />
          ))}
        </g>
      );
    case "shards":
      return (
        <g transform={`translate(${x} ${y}) rotate(${rot / 3})`}>
          <path d="M0 0 L 26 -44 L 38 -38 L 12 6 Z" fill={c[1]} {...outline} />
          <path d="M4 -4 L 28 -40" stroke={c[0]} strokeWidth={2} strokeLinecap="round" />
          <path d="M16 6 L 44 -20 L 50 -12 L 24 12 Z" fill={c[2]} {...outline} strokeWidth={1.6} />
        </g>
      );
    case "nuts":
      return (
        <g>
          <Hazelnut x={x} y={y} rot={rot} />
          <Hazelnut x={x + 14} y={y + 6} rot={-rot} />
          <Hazelnut x={x + 4} y={y + 14} rot={rot + 40} />
        </g>
      );
    case "cubes":
      return (
        <g>
          {scatter(8, x, y, 16, 12, 170 + i).map(([cx, cy], k) => (
            <rect key={k} x={r1(cx - 3)} y={r1(cy - 3)} width={6} height={6} rx={1} fill={k % 2 ? c[0] : c[1]} stroke={INK} strokeWidth={0.7} />
          ))}
        </g>
      );
    case "crisps":
      return <ParsnipCrisp x={x} y={y} rot={rot} />;
    case "samphire":
      return <Samphire x={x} y={y} rot={rot} />;
    case "radish":
      return (
        <g>
          {[
            [0, 0, 11],
            [18, 8, 9],
          ].map(([dx, dy, rr], k) => (
            <g key={k}>
              <circle cx={x + dx} cy={y + dy} r={rr} fill="#FFFFFF" stroke="#D83A6A" strokeWidth={2.4} />
              <circle cx={x + dx} cy={y + dy} r={rr} fill="none" stroke={INK} strokeWidth={0.8} />
            </g>
          ))}
        </g>
      );
    case "citrus":
      return (
        <g transform={`translate(${x} ${y}) rotate(${rot})`}>
          {[0, 16].map((ox, k) => (
            <g key={k} transform={`translate(${ox} ${k * 6})`}>
              <path d="M-16 0 C -14 -16 14 -16 16 0 C 8 -6 -8 -6 -16 0 Z" fill={c[1]} {...outline} strokeWidth={1.4} />
              <path d="M-10 -5 L -6 -10 M 0 -6 L 0 -12 M 10 -5 L 6 -10" stroke={c[0]} strokeWidth={1} />
            </g>
          ))}
        </g>
      );
    case "roe":
      return (
        <g>
          {scatter(11, x, y, 12, 9, 180 + i).map(([cx, cy], k) => (
            <g key={k}>
              <circle cx={r1(cx)} cy={r1(cy)} r={3.2} fill={c[1]} stroke={INK} strokeWidth={0.7} />
              <circle cx={r1(cx - 1)} cy={r1(cy - 1)} r={1} fill="#FFFFFF" opacity={0.8} />
            </g>
          ))}
        </g>
      );
    case "cherries":
      return (
        <g>
          <CherryHalf x={x} y={y} r={10} rot={rot} />
          <Berry x={x + 18} y={y + 10} r={10} kind="cherry" />
        </g>
      );
    case "fondant":
      return <FondantPotato x={x} y={y} />;
    case "asparagus":
      return (
        <g transform={`translate(${x - 30} ${y}) rotate(${rot / 4})`}>
          <path d="M0 -4 L 50 -4 C 58 -6 66 -2 68 0 C 66 2 58 6 50 4 L 0 4 Z" fill={PALETTE.green[1]} {...outline} strokeWidth={1.6} />
          <path d="M4 -1 L 44 -1" stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={1.4} strokeLinecap="round" />
        </g>
      );
    case "petals":
      return (
        <g transform={`translate(${x} ${y})`}>
          {Array.from({ length: 5 }).map((_, k) => {
            const a = (k / 5) * Math.PI * 2;
            const px = r1(cos(a) * 5);
            const py = r1(sin(a) * 5);
            return <ellipse key={k} cx={px} cy={py} rx={5} ry={3.2} fill={c[1]} stroke={INK} strokeWidth={0.7} transform={`rotate(${Math.round((k / 5) * 360)} ${px} ${py})`} />;
          })}
          <circle r={2.2} fill="#F7D445" />
        </g>
      );
    case "onionRings":
      return (
        <g>
          <ellipse cx={x} cy={y} rx={12} ry={9} fill="none" stroke={INK} strokeWidth={5} />
          <ellipse cx={x} cy={y} rx={12} ry={9} fill="none" stroke="#D56A9C" strokeWidth={3} />
          <ellipse cx={x + 16} cy={y + 8} rx={8} ry={6} fill="none" stroke={INK} strokeWidth={4.5} />
          <ellipse cx={x + 16} cy={y + 8} rx={8} ry={6} fill="none" stroke="#E9A2C2" strokeWidth={2.6} />
        </g>
      );
    case "capers":
      return (
        <g>
          {[
            [0, 0],
            [9, 5],
            [-4, 9],
          ].map(([dx, dy], k) => (
            <circle key={k} cx={x + dx} cy={y + dy} r={4} fill="#6E8A3A" stroke={INK} strokeWidth={0.9} />
          ))}
        </g>
      );
    case "appleFan":
      return (
        <g transform={`translate(${x} ${y}) rotate(${rot})`}>
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d="M-20 0 C -18 -14 18 -14 20 0 C 10 -5 -10 -5 -20 0 Z" transform={`rotate(${k * 14 - 20}) translate(0 ${k * 2})`} fill={c[0]} stroke={INK} strokeWidth={1.1} />
          ))}
          <path d="M-20 0 C -18 -14 18 -14 20 0" transform="rotate(22) translate(0 6)" stroke="#B83A3A" strokeWidth={1.6} fill="none" />
        </g>
      );
    case "beets":
      return <BeetWedge x={x} y={y} rot={rot} />;
    case "leaves":
      return <Leaf x={x} y={y} rot={rot} len={26} wid={13} c={c[1]} dark={c[2]} />;
    case "peas":
      return (
        <g>
          {scatter(6, x, y, 14, 10, 190 + i).map(([cx, cy], k) => (
            <g key={k}>
              <circle cx={r1(cx)} cy={r1(cy)} r={4.6} fill={PALETTE.pea[1]} stroke={INK} strokeWidth={0.9} />
              <circle cx={r1(cx - 1.4)} cy={r1(cy - 1.4)} r={1.4} fill="#FFFFFF" opacity={0.7} />
            </g>
          ))}
        </g>
      );
    case "mussels":
      return (
        <g transform={`translate(${x} ${y}) rotate(${rot})`}>
          <path d="M0 -20 C 14 -18 18 0 12 14 C 6 24 -10 22 -12 10 C -14 -4 -10 -18 0 -20 Z" fill="#26262E" {...outline} />
          <path d="M0 -12 C 8 -10 10 0 7 8 C 3 14 -6 13 -7 6 C -8 -2 -6 -11 0 -12 Z" fill="#F29A4A" stroke={INK} strokeWidth={0.9} />
        </g>
      );
    case "potatoes":
      return (
        <g>
          {[
            [0, 0, 13],
            [22, 10, 11],
          ].map(([dx, dy, rr], k) => (
            <g key={k}>
              <circle cx={x + dx} cy={y + dy} r={rr} fill={PALETTE.golden[1]} {...outline} strokeWidth={1.6} />
              <circle cx={x + dx - 2} cy={y + dy - 2} r={rr * 0.6} fill={PALETTE.golden[0]} />
            </g>
          ))}
        </g>
      );
    case "figs":
      return (
        <g transform={`translate(${x} ${y}) rotate(${rot})`}>
          <path d="M0 -16 C 14 -14 16 10 0 16 C -16 10 -14 -14 0 -16 Z" fill={PALETTE.fig[1]} {...outline} strokeWidth={1.6} />
          <path d="M0 -11 C 9 -9 10 7 0 11 C -10 7 -9 -9 0 -11 Z" fill="#F29AAA" />
          {scatter(8, 0, 0, 5, 7, 200 + i).map(([cx, cy], k) => (
            <circle key={k} cx={r1(cx)} cy={r1(cy)} r={0.9} fill="#FFF4C8" />
          ))}
        </g>
      );
    default:
      return null;
  }
}

function ComposedGarnish({ spec, g }: { spec: ComposedDish; g: Geometry }) {
  let cursor = 0;
  const pieces: ReactNode[] = [];
  spec.garnish.forEach((item, gi) => {
    const c = pal(item.color, "herbOil");
    const anchors = g.garnish.slice(cursor, cursor + 2);
    cursor += 2;
    anchors.forEach((at, ai) => {
      pieces.push(
        <Pop key={`${gi}-${ai}`} i={pieces.length}>
          <GarnishPiece kind={item.kind} at={at} i={gi * 10 + ai} c={c} variant={item.variant} />
        </Pop>,
      );
    });
  });
  return <g>{pieces}</g>;
}

/* ------------------------------------------------------------------ */
/* Kruiden en afwerking                                                */
/* ------------------------------------------------------------------ */
function HerbPiece({ kind, g, i }: { kind: HerbKind; g: Geometry; i: number }) {
  const [x, y] = g.herbs[i % g.herbs.length];
  const [x2, y2] = g.herbs[(i + 1) % g.herbs.length];
  switch (kind) {
    case "cress":
      return <Cress x={x + 40} y={y + 44} s={0.8} />;
    case "micro":
      return (
        <g>
          <Micro x={x} y={y} rot={-20} />
          <Micro x={x2} y={y2} rot={30} c="#8A5A8A" />
        </g>
      );
    case "chervil":
      return (
        <g>
          <Chervil x={x} y={y} rot={20} s={0.8} />
          <Chervil x={x2} y={y2} rot={-30} s={0.7} />
        </g>
      );
    case "dill":
      return (
        <g stroke="#4F8A3A" strokeWidth={1.3} fill="none" strokeLinecap="round">
          <path d={`M${x - 16} ${y + 8} C ${x - 6} ${y - 4} ${x + 8} ${y - 10} ${x + 20} ${y - 12}`} />
          <path d={`M${x - 8} ${y} l -2 -8 M ${x} ${y - 4} l 0 -8 M ${x + 8} ${y - 8} l 2 -8 M ${x - 6} ${y} l 7 3 M ${x + 2} ${y - 5} l 7 3 M ${x + 10} ${y - 9} l 7 3`} />
        </g>
      );
    case "chives":
      return <Chives pts={scatter(10, g.main[0], g.main[1], 60, 50, 210)} />;
    case "flakes":
      return (
        <Flakes
          pts={g.herbs.map(([hx, hy]) => [hx + 6, hy + 4] as [number, number])}
        />
      );
    case "pepper":
      return <Pepper pts={scatter(14, g.main[0], g.main[1], 62, 52, 220)} />;
    case "basil":
      return (
        <g>
          <Leaf x={x} y={y} rot={-40} len={20} wid={10} c="#4F9336" />
          <Leaf x={x2} y={y2} rot={140} len={16} wid={8} c="#4F9336" />
        </g>
      );
    case "mint":
      return (
        <g>
          <Leaf x={x} y={y} rot={-60} len={17} wid={9} c="#5FA048" />
          <Leaf x={x2} y={y2} rot={30} len={14} wid={7} c="#5FA048" />
        </g>
      );
    case "flowers":
      return (
        <g>
          {[
            [x, y],
            [x2, y2],
          ].map(([fx, fy], k) => (
            <g key={k} transform={`translate(${fx} ${fy})`}>
              {Array.from({ length: 5 }).map((_, p) => {
                const a = (p / 5) * Math.PI * 2;
                const px = r1(cos(a) * 4);
                const py = r1(sin(a) * 4);
                return <ellipse key={p} cx={px} cy={py} rx={4} ry={2.6} fill={k ? "#F2A2C0" : "#A78BD0"} stroke={INK} strokeWidth={0.6} transform={`rotate(${Math.round((p / 5) * 360)} ${px} ${py})`} />;
              })}
              <circle r={1.8} fill="#F7D445" />
            </g>
          ))}
        </g>
      );
    case "zest":
      return (
        <g stroke="#E8C22C" strokeWidth={2} fill="none" strokeLinecap="round">
          <path d={`M${x} ${y} q 4 -5 8 0`} />
          <path d={`M${x2} ${y2} q 4 -5 8 0`} />
          <path d={`M${x + 20} ${y + 16} q 3 -4 7 0`} />
        </g>
      );
    case "thyme":
      return (
        <g>
          {scatter(16, g.main[0], g.main[1], 64, 54, 230).map(([tx, ty], k) => (
            <ellipse key={k} cx={r1(tx)} cy={r1(ty)} rx={3} ry={1.8} fill="#6E8F4A" stroke={INK} strokeWidth={0.6} transform={`rotate(${Math.round(rand(k, 231) * 180)} ${r1(tx)} ${r1(ty)})`} />
          ))}
        </g>
      );
    case "sage":
      return <SageLeaf x={x - 10} y={y} rot={-20} s={0.7} />;
    case "rosemary":
      return <Rosemary x={x - 20} y={y} rot={-24} s={0.7} />;
    case "sesame":
      return (
        <g>
          {scatter(18, g.main[0], g.main[1], 70, 56, 240).map(([sx, sy], k) => (
            <ellipse key={k} cx={r1(sx)} cy={r1(sy)} rx={1.9} ry={1} fill={k % 3 ? "#FFF6E2" : "#1F1B19"} stroke={INK} strokeWidth={0.3} transform={`rotate(${Math.round(rand(k, 241) * 180)} ${r1(sx)} ${r1(sy)})`} />
          ))}
        </g>
      );
    case "gold":
      return (
        <g>
          {[
            [x, y],
            [x2, y2],
            [x + 14, y + 20],
          ].map(([gx, gy], k) => (
            <path key={k} d={`M${gx - 5} ${gy - 3} L ${gx + 2} ${gy - 6} L ${gx + 6} ${gy + 1} L ${gx - 1} ${gy + 5} Z`} fill="#E9C45A" stroke="#9A7420" strokeWidth={0.8} />
          ))}
        </g>
      );
    case "cocoa":
      return <Pepper pts={scatter(24, g.main[0], g.main[1], 70, 60, 250)} color="#5A3522" />;
    default:
      return null;
  }
}

function ComposedHerbs({ spec, g }: { spec: ComposedDish; g: Geometry }) {
  return (
    <g>
      {spec.herbs.map((kind, i) => (
        <Pop key={`${kind}-${i}`} i={i} drop>
          <HerbPiece kind={kind} g={g} i={i} />
        </Pop>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Publieke API                                                        */
/* ------------------------------------------------------------------ */
const cache = new WeakMap<ComposedDish, DishLayers>();

export function composeDish(spec: ComposedDish): DishLayers {
  const cached = cache.get(spec);
  if (cached) return cached;
  const g = LAYOUTS[spec.layout] ?? LAYOUTS.diagonal;
  const layers: DishLayers = {
    plate: spec.plate,
    Sauce: () => <ComposedSauce spec={spec} g={g} />,
    Main: () => <ComposedMain spec={spec} g={g} />,
    Garnish: () => <ComposedGarnish spec={spec} g={g} />,
    Herbs: () => <ComposedHerbs spec={spec} g={g} />,
    Smudge: () => <Smudges c={pal(spec.sauce.color, "cream")[1]} pts={g.smudges} />,
  };
  cache.set(spec, layers);
  return layers;
}
