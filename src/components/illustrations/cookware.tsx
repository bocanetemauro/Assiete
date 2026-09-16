"use client";

import type { ReactNode } from "react";
import type { LiquidTone } from "@/lib/types";
import { GroundShadow, INK, LinearGradient, RadialGradient, SW, cos, hairline, outline, sin, useUid } from "./kit";

/** [licht, midden, donker] per vloeistof. */
export const LIQUID: Record<LiquidTone, [string, string, string]> = {
  berry: ["#8A6BB0", "#4B2C6B", "#2A163D"],
  cherry: ["#C5475A", "#7E1D2E", "#480E19"],
  cream: ["#FFFAF0", "#F1E4C8", "#D8C49E"],
  butter: ["#FFF3C6", "#F2D98A", "#D4B055"],
  "brown-butter": ["#E7B570", "#B97A36", "#7A471B"],
  wine: ["#F0E2B0", "#CDB274", "#9A8140"],
  broth: ["#EBC685", "#C48F45", "#8C5F27"],
  herb: ["#A7CF73", "#5E9235", "#34581B"],
  pumpkin: ["#FFBA64", "#EA842F", "#B15515"],
  chocolate: ["#946246", "#5A3522", "#301A10"],
  lemon: ["#FFF394", "#F5D63D", "#CDA212"],
  soy: ["#A1623A", "#5E3319", "#2E1609"],
  "egg-white": ["#FFFFFF", "#F4F1EA", "#D7D0C3"],
  risotto: ["#FCF3DA", "#EAD6A2", "#C4AA70"],
  saffron: ["#FFE39A", "#F2B53A", "#C07A12"],
  caramel: ["#F7C77A", "#C9822E", "#7A4410"],
  tomato: ["#FF8A6E", "#D8392A", "#8A1A10"],
  jus: ["#B7634A", "#5E2416", "#2C0E07"],
};

/** Afgeronde rechthoek in perspectief (hoeken als ellipsbogen). */
export function roundRect(x: number, y: number, w: number, h: number, rx: number, ry: number): string {
  return [
    `M${x + rx} ${y}`,
    `H${x + w - rx}`,
    `A${rx} ${ry} 0 0 1 ${x + w} ${y + ry}`,
    `V${y + h - ry}`,
    `A${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h}`,
    `H${x + rx}`,
    `A${rx} ${ry} 0 0 1 ${x} ${y + h - ry}`,
    `V${y + ry}`,
    `A${rx} ${ry} 0 0 1 ${x + rx} ${y}`,
    "Z",
  ].join(" ");
}

/* ------------------------------------------------------------------ */
/* Snijplank                                                           */
/* ------------------------------------------------------------------ */
export function Board({ cx = 240, cy = 255, w = 380, d = 96 }: { cx?: number; cy?: number; w?: number; d?: number }) {
  const id = useUid();
  const x = cx - w / 2;
  const y = cy - d / 2;
  return (
    <g>
      <defs>
        <LinearGradient id={`${id}t`} x2={1} y2={1} stops={[[0, "#E6B983"], [0.45, "#D29E66"], [1, "#B47C47"]]} />
        <LinearGradient id={`${id}s`} stops={[[0, "#9C6638"], [1, "#6A4022"]]} />
      </defs>
      <GroundShadow cx={cx + 10} cy={cy + d / 2 + 16} rx={w * 0.56} ry={d * 0.34} opacity={0.26} />
      <path d={roundRect(x, y + 13, w, d, 30, 15)} fill={`url(#${id}s)`} {...outline} />
      <path d={roundRect(x, y, w, d, 30, 15)} fill={`url(#${id}t)`} {...outline} />
      <g {...hairline} stroke="#7A4B26" opacity={0.35}>
        <path d={`M${x + 36} ${y + 22} C ${x + 120} ${y + 14} ${x + 220} ${y + 30} ${x + w - 70} ${y + 18}`} />
        <path d={`M${x + 24} ${y + 48} C ${x + 110} ${y + 40} ${x + 200} ${y + 58} ${x + w - 40} ${y + 46}`} />
        <path d={`M${x + 50} ${y + 72} C ${x + 150} ${y + 66} ${x + 230} ${y + 82} ${x + w - 60} ${y + 70}`} />
      </g>
      <ellipse cx={x + w - 34} cy={cy} rx={11} ry={6} fill="#5A361C" {...outline} strokeWidth={1.6} />
      <path d={`M${x + 34} ${y + 6} H${x + w * 0.45}`} stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Gasbrander                                                          */
/* ------------------------------------------------------------------ */
export function Burner({ cx, cy, w = 110, intensity = 1 }: { cx: number; cy: number; w?: number; intensity?: number }) {
  const id = useUid();
  const flames = 11;
  return (
    <g>
      <defs>
        <LinearGradient id={`${id}f`} stops={[[0, "#BFE0FF"], [0.45, "#4F8DEB"], [1, "#1F4FA8"]]} />
      </defs>
      <ellipse cx={cx} cy={cy + 10} rx={w * 0.95} ry={w * 0.2} fill="#2E2826" {...outline} />
      <ellipse cx={cx} cy={cy + 6} rx={w * 0.55} ry={w * 0.11} fill="#57504B" {...outline} strokeWidth={1.6} />
      {Array.from({ length: flames }).map((_, i) => {
        const a = Math.PI + (Math.PI * i) / (flames - 1);
        const fx = cx + cos(a) * w * 0.55;
        const fy = cy + 6 + sin(a) * w * 0.11;
        const s = (0.75 + ((i * 7) % 5) * 0.08) * intensity;
        return (
          <g key={i} transform={`translate(${fx} ${fy}) scale(${s})`}>
            <path
              className="a-flame o-bottom"
              style={{ animationDelay: `${(i * 0.13) % 0.9}s` }}
              d="M0 0 C -7 -5 -6 -16 0 -26 C 6 -16 7 -5 0 0 Z"
              fill={`url(#${id}f)`}
              stroke="#1B3F86"
              strokeWidth={1}
            />
          </g>
        );
      })}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Gietijzeren koekenpan                                               */
/* ------------------------------------------------------------------ */
export function Pan({
  cx = 220,
  cy = 190,
  r = 140,
  oil = false,
  shadow = true,
  children,
}: {
  cx?: number;
  cy?: number;
  r?: number;
  oil?: boolean;
  shadow?: boolean;
  children?: ReactNode;
}) {
  const id = useUid();
  const ry = r * 0.34;
  const depth = r * 0.2;
  const rb = r * 0.84;
  const ryb = rb * 0.34;
  const wall = `M${cx - r} ${cy} L${cx - rb} ${cy + depth} A${rb} ${ryb} 0 0 0 ${cx + rb} ${cy + depth} L${cx + r} ${cy} A${r} ${ry} 0 0 1 ${cx - r} ${cy} Z`;
  const ir = r - 10;
  const iry = ry - 5;
  const clip = `M${cx - ir} ${cy + 2} A${ir} ${iry} 0 0 0 ${cx + ir} ${cy + 2} L${cx + ir} ${cy - 400} L${cx - ir} ${cy - 400} Z`;
  return (
    <g>
      <defs>
        <LinearGradient id={`${id}b`} x2={1} y2={0} stops={[[0, "#1B1715"], [0.28, "#4D4541"], [0.55, "#2B2522"], [1, "#141110"]]} />
        <LinearGradient id={`${id}r`} stops={[[0, "#78706A"], [1, "#2D2724"]]} />
        <RadialGradient id={`${id}i`} cx={0.45} cy={0.6} r={0.7} stops={[[0, "#433B37"], [0.7, "#241F1C"], [1, "#161311"]]} />
        <LinearGradient id={`${id}h`} stops={[[0, "#5A514C"], [1, "#1D1917"]]} />
        <RadialGradient id={`${id}o`} cx={0.4} cy={0.45} r={0.6} stops={[[0, "#F7D88A", 0.5], [1, "#C08A2E", 0]]} />
        <clipPath id={`${id}c`}>
          <path d={clip} />
        </clipPath>
      </defs>
      {shadow && <GroundShadow cx={cx + 14} cy={cy + depth + 16} rx={r * 1.05} ry={ry * 0.85} />}
      <path
        d={`M${cx + r - 26} ${cy - 12} L${cx + r + 110} ${cy - 50} Q${cx + r + 134} ${cy - 54} ${cx + r + 130} ${cy - 34} L${cx + r - 2} ${cy + 16} Z`}
        fill={`url(#${id}h)`}
        {...outline}
      />
      <ellipse cx={cx + r + 110} cy={cy - 40} rx={7} ry={4} fill="#0F0C0B" stroke={INK} strokeWidth={1.2} />
      <path d={`M${cx + r + 10} ${cy - 18} L${cx + r + 100} ${cy - 44}`} stroke="#FFFFFF" strokeOpacity={0.22} strokeWidth={2.5} strokeLinecap="round" />
      <path d={wall} fill={`url(#${id}b)`} {...outline} />
      <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={`url(#${id}r)`} {...outline} />
      <ellipse cx={cx} cy={cy + 2} rx={ir} ry={iry} fill={`url(#${id}i)`} stroke={INK} strokeWidth={1.4} />
      <ellipse cx={cx - r * 0.18} cy={cy + iry * 0.3} rx={r * 0.42} ry={iry * 0.38} fill="#FFFFFF" opacity={0.05} />
      {oil && <ellipse cx={cx - 10} cy={cy + 8} rx={ir * 0.72} ry={iry * 0.62} fill={`url(#${id}o)`} />}
      <g clipPath={`url(#${id}c)`}>{children}</g>
      <path
        d={`M${cx - r + 14} ${cy - 7} A${r} ${ry} 0 0 1 ${cx - r * 0.25} ${cy - ry + 1.5}`}
        stroke="#FFFFFF"
        strokeOpacity={0.35}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <path d={`M${cx - rb + 18} ${cy + depth - 2} Q${cx - rb * 0.6} ${cy + depth + ryb * 0.8} ${cx - rb * 0.1} ${cy + depth + ryb * 0.95}`} stroke="#FFFFFF" strokeOpacity={0.12} strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Koperen steelpan met vloeistof                                      */
/* ------------------------------------------------------------------ */
export function Saucepan({
  cx = 250,
  cy = 170,
  r = 100,
  h = 92,
  tone = "cream",
  bubbles = true,
  shadow = true,
  children,
}: {
  cx?: number;
  cy?: number;
  r?: number;
  h?: number;
  tone?: LiquidTone;
  bubbles?: boolean;
  shadow?: boolean;
  children?: ReactNode;
}) {
  const id = useUid();
  const ry = r * 0.32;
  const br = r * 0.96;
  const body = `M${cx - r} ${cy} L${cx - br} ${cy + h} A${br} ${ry * 0.96} 0 0 0 ${cx + br} ${cy + h} L${cx + r} ${cy} A${r} ${ry} 0 0 1 ${cx - r} ${cy} Z`;
  const [light, mid, dark] = LIQUID[tone];
  const lx = cx;
  const ly = cy + 8;
  const lr = r - 11;
  const lry = ry - 8;
  return (
    <g>
      <defs>
        <LinearGradient
          id={`${id}c`}
          x2={1}
          y2={0}
          stops={[[0, "#6A2F14"], [0.18, "#B8652F"], [0.34, "#F3B47D"], [0.46, "#C97538"], [0.75, "#8A4119"], [1, "#55240D"]]}
        />
        <LinearGradient id={`${id}r`} stops={[[0, "#F6C08D"], [1, "#A9582A"]]} />
        <LinearGradient id={`${id}s`} stops={[[0, "#C7CDD0"], [1, "#7C8488"]]} />
        <LinearGradient id={`${id}h`} stops={[[0, "#D8B77A"], [0.5, "#B18D52"], [1, "#6F5226"]]} />
        <RadialGradient id={`${id}l`} cx={0.4} cy={0.35} r={0.8} stops={[[0, light], [0.55, mid], [1, dark]]} />
      </defs>
      {shadow && <GroundShadow cx={cx + 12} cy={cy + h + 12} rx={r * 1.2} ry={ry * 0.9} />}
      <path
        d={`M${cx - r + 8} ${cy + 10} L${cx - r - 112} ${cy - 10} Q${cx - r - 134} ${cy - 8} ${cx - r - 128} ${cy + 10} L${cx - r + 6} ${cy + 32} Z`}
        fill={`url(#${id}h)`}
        {...outline}
      />
      <path d={`M${cx - r - 20} ${cy - 2} L${cx - r - 112} ${cy - 4}`} stroke="#FFF6DD" strokeOpacity={0.5} strokeWidth={2.4} strokeLinecap="round" />
      <path d={body} fill={`url(#${id}c)`} {...outline} />
      <path d={`M${cx - r + 1} ${cy + 16} A${r} ${ry} 0 0 0 ${cx + r - 1} ${cy + 16}`} stroke="#4A1F0A" strokeOpacity={0.45} strokeWidth={2} fill="none" />
      <path
        d={`M${cx - r * 0.62} ${cy + ry * 0.8} L${cx - r * 0.6} ${cy + h + ry * 0.7} L${cx - r * 0.5} ${cy + h + ry * 0.82} L${cx - r * 0.52} ${cy + ry * 0.9} Z`}
        fill="#FFFFFF"
        opacity={0.28}
      />
      <circle cx={cx - r + 12} cy={cy + 22} r={3.2} fill="#E9C9A0" stroke={INK} strokeWidth={1.1} />
      <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={`url(#${id}r)`} {...outline} />
      <ellipse cx={cx} cy={cy + 1} rx={r - 6} ry={ry - 3} fill={`url(#${id}s)`} stroke={INK} strokeWidth={1.3} />
      <ellipse cx={lx} cy={ly} rx={lr} ry={lry} fill={`url(#${id}l)`} stroke={dark} strokeWidth={1.2} />
      <ellipse cx={lx - lr * 0.35} cy={ly - lry * 0.25} rx={lr * 0.28} ry={lry * 0.22} fill="#FFFFFF" opacity={0.35} />
      {bubbles &&
        Array.from({ length: 7 }).map((_, i) => {
          const bx = lx + (((i * 47) % 100) / 100 - 0.5) * lr * 1.4;
          const by = ly + (((i * 31) % 100) / 100 - 0.5) * lry * 1.1;
          return (
            <circle
              key={i}
              cx={bx}
              cy={by}
              r={3 + ((i * 3) % 4)}
              fill={light}
              stroke={dark}
              strokeWidth={1}
              className="a-bubble"
              style={{ animationDelay: `${(i * 0.37) % 2.2}s` }}
            />
          );
        })}
      {children}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Kookpot (roestvrij staal)                                          */
/* ------------------------------------------------------------------ */
export function StockPot({
  cx = 240,
  cy = 150,
  r = 118,
  h = 128,
  water = "#CFE0E3",
  children,
}: {
  cx?: number;
  cy?: number;
  r?: number;
  h?: number;
  water?: string;
  children?: ReactNode;
}) {
  const id = useUid();
  const ry = r * 0.3;
  const body = `M${cx - r} ${cy} L${cx - r} ${cy + h} A${r} ${ry} 0 0 0 ${cx + r} ${cy + h} L${cx + r} ${cy} A${r} ${ry} 0 0 1 ${cx - r} ${cy} Z`;
  const lr = r - 12;
  const lry = ry - 8;
  return (
    <g>
      <defs>
        <LinearGradient id={`${id}b`} x2={1} y2={0} stops={[[0, "#7F878B"], [0.2, "#D9DEE0"], [0.32, "#F7F9FA"], [0.5, "#B4BBBF"], [0.8, "#8A9296"], [1, "#5F676B"]]} />
        <LinearGradient id={`${id}r`} stops={[[0, "#F2F4F5"], [1, "#9DA5A9"]]} />
        <RadialGradient id={`${id}w`} cx={0.45} cy={0.4} r={0.8} stops={[[0, "#F4FAFB"], [0.6, water], [1, "#93AEB4"]]} />
        <clipPath id={`${id}clip`}>
          <ellipse cx={cx} cy={cy + 10} rx={lr} ry={lry} />
        </clipPath>
      </defs>
      <GroundShadow cx={cx + 12} cy={cy + h + 12} rx={r * 1.25} ry={ry * 0.95} />
      {[-1, 1].map((s) => (
        <path
          key={s}
          d={`M${cx + s * r} ${cy + 20} C ${cx + s * (r + 34)} ${cy + 12} ${cx + s * (r + 38)} ${cy + 46} ${cx + s * r} ${cy + 44}`}
          fill="none"
          stroke={INK}
          strokeWidth={9}
          strokeLinecap="round"
        />
      ))}
      {[-1, 1].map((s) => (
        <path
          key={`i${s}`}
          d={`M${cx + s * r} ${cy + 20} C ${cx + s * (r + 34)} ${cy + 12} ${cx + s * (r + 38)} ${cy + 46} ${cx + s * r} ${cy + 44}`}
          fill="none"
          stroke="#C9CFD2"
          strokeWidth={4.5}
          strokeLinecap="round"
        />
      ))}
      <path d={body} fill={`url(#${id}b)`} {...outline} />
      <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={`url(#${id}r)`} {...outline} />
      <ellipse cx={cx} cy={cy + 1} rx={r - 6} ry={ry - 3} fill="#8C9498" stroke={INK} strokeWidth={1.3} />
      <ellipse cx={cx} cy={cy + 10} rx={lr} ry={lry} fill={`url(#${id}w)`} stroke="#6E8A90" strokeWidth={1.2} />
      <g clipPath={`url(#${id}clip)`}>{children}</g>
      {Array.from({ length: 9 }).map((_, i) => (
        <circle
          key={i}
          cx={cx + (((i * 53) % 100) / 100 - 0.5) * lr * 1.5}
          cy={cy + 10 + (((i * 29) % 100) / 100 - 0.5) * lry * 1.2}
          r={2.5 + ((i * 5) % 4)}
          fill="#FFFFFF"
          stroke="#7C979D"
          strokeWidth={1}
          className="a-bubble"
          style={{ animationDelay: `${(i * 0.29) % 2.2}s` }}
        />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Mengkom                                                             */
/* ------------------------------------------------------------------ */
export function Bowl({
  cx = 240,
  cy = 190,
  r = 120,
  material = "ceramic",
  tone,
  contentLevel = 0.35,
  shadow = true,
  children,
}: {
  cx?: number;
  cy?: number;
  r?: number;
  material?: "ceramic" | "steel" | "glass";
  tone?: LiquidTone;
  contentLevel?: number;
  shadow?: boolean;
  children?: ReactNode;
}) {
  const id = useUid();
  const ry = r * 0.3;
  const depth = r * 0.78;
  const body = `M${cx - r} ${cy} A${r} ${depth} 0 0 0 ${cx + r} ${cy} A${r} ${ry} 0 0 1 ${cx - r} ${cy} Z`;
  const bodyStops: [number, string, number?][] =
    material === "steel"
      ? [[0, "#8B9397"], [0.25, "#E4E8EA"], [0.4, "#FFFFFF"], [0.65, "#AAB2B6"], [1, "#6C7478"]]
      : material === "glass"
        ? [[0, "#DDE9EA", 0.55], [0.35, "#FFFFFF", 0.35], [1, "#C4D6D8", 0.6]]
        : [[0, "#E9E1D4"], [0.3, "#FFFDF8"], [0.6, "#F4EEE4"], [1, "#CFC5B5"]];
  const [light, mid, dark] = tone ? LIQUID[tone] : ["#fff", "#fff", "#fff"];
  const cr = (r - 12) * (1 - contentLevel * 0.25);
  const cry = cr * 0.3;
  return (
    <g>
      <defs>
        <LinearGradient id={`${id}b`} x2={1} y2={0} stops={bodyStops} />
        <LinearGradient id={`${id}i`} stops={[[0, material === "steel" ? "#7B8387" : "#E2D9CB"], [1, material === "steel" ? "#D5DADC" : "#FFFDF9"]]} />
        <RadialGradient id={`${id}l`} cx={0.4} cy={0.35} r={0.85} stops={[[0, light], [0.6, mid], [1, dark]]} />
      </defs>
      {shadow && <GroundShadow cx={cx + 12} cy={cy + depth - 2} rx={r * 0.95} ry={r * 0.16} />}
      <ellipse cx={cx} cy={cy + depth - 6} rx={r * 0.36} ry={r * 0.08} fill="#CFC5B5" {...outline} strokeWidth={1.6} />
      <path d={body} fill={`url(#${id}b)`} {...outline} />
      {material === "ceramic" && (
        <path d={`M${cx - r + 4} ${cy + 16} A${r} ${depth * 0.9} 0 0 0 ${cx + r - 4} ${cy + 16}`} fill="none" stroke="#66745A" strokeWidth={2.2} opacity={0.55} />
      )}
      <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={`url(#${id}i)`} {...outline} />
      {tone && <ellipse cx={cx} cy={cy + ry * contentLevel * 0.9} rx={cr} ry={cry} fill={`url(#${id}l)`} stroke={dark} strokeWidth={1.2} />}
      {tone && <ellipse cx={cx - cr * 0.35} cy={cy + ry * contentLevel * 0.9 - cry * 0.3} rx={cr * 0.25} ry={cry * 0.2} fill="#FFFFFF" opacity={0.4} />}
      {children}
      <path d={`M${cx - r * 0.82} ${cy + ry * 1.6} Q${cx - r * 0.7} ${cy + depth * 0.7} ${cx - r * 0.3} ${cy + depth * 0.86}`} stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={3.5} fill="none" strokeLinecap="round" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Koksmes (punt links, heft rechts)                                   */
/* ------------------------------------------------------------------ */
export function Knife({ x, y, rotate = 0, scale = 1, className }: { x: number; y: number; rotate?: number; scale?: number; className?: string }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <defs>
        <LinearGradient id={`${id}b`} stops={[[0, "#FBFCFC"], [0.45, "#DCE1E4"], [0.8, "#A9B1B6"], [1, "#7D868C"]]} />
        <LinearGradient id={`${id}h`} stops={[[0, "#4A3428"], [0.5, "#2C1E17"], [1, "#150E0B"]]} />
      </defs>
      <g className={className}>
        <path d="M0 6 C 18 24 52 32 92 32 L 174 32 L 174 -4 L 52 -4 C 30 -3 12 0 0 6 Z" fill={`url(#${id}b)`} {...outline} />
        <path d="M10 13 C 30 24 58 26 92 26 L 172 26" stroke="#FFFFFF" strokeWidth={1.8} fill="none" opacity={0.85} />
        <path d="M60 2 L 168 1" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
        <path d="M174 -6 L 188 -6 L 188 33 L 174 33 Z" fill="#9EA7AC" {...outline} />
        <path d="M188 -3 L 262 -1 C 273 0 278 7 278 14 C 278 23 271 29 261 29 L 188 31 Z" fill={`url(#${id}h)`} {...outline} />
        {[212, 238].map((cx) => (
          <circle key={cx} cx={cx} cy={14} r={3.4} fill="#D9DEE1" stroke={INK} strokeWidth={1.1} />
        ))}
        <path d="M196 4 L 258 5" stroke="#FFFFFF" strokeOpacity={0.25} strokeWidth={2} strokeLinecap="round" />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Garde                                                               */
/* ------------------------------------------------------------------ */
export function Whisk({ x, y, rotate = 0, scale = 1, className }: { x: number; y: number; rotate?: number; scale?: number; className?: string }) {
  const id = useUid();
  const widths = [34, 24, 13, 4];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <defs>
        <LinearGradient id={`${id}h`} x2={1} y2={0} stops={[[0, "#8C9498"], [0.4, "#F4F6F7"], [1, "#7A8286"]]} />
      </defs>
      <g className={className ? `${className} o-top` : undefined}>
        {widths.map((w) => (
          <path key={`o${w}`} d={`M-4 64 C ${-w} 92 ${-w} 142 0 152 C ${w} 142 ${w} 92 4 64`} fill="none" stroke={INK} strokeWidth={3.6} />
        ))}
        {widths.map((w) => (
          <path key={`s${w}`} d={`M-4 64 C ${-w} 92 ${-w} 142 0 152 C ${w} 142 ${w} 92 4 64`} fill="none" stroke="#D6DBDE" strokeWidth={1.8} />
        ))}
        <rect x={-8} y={0} width={16} height={68} rx={7} fill={`url(#${id}h)`} {...outline} />
        <circle cx={0} cy={8} r={3} fill="none" stroke={INK} strokeWidth={1.3} />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Houten lepel / sauslepel / pollepel                                 */
/* ------------------------------------------------------------------ */
export function WoodenSpoon({ x, y, rotate = 0, scale = 1, className }: { x: number; y: number; rotate?: number; scale?: number; className?: string }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <defs>
        <LinearGradient id={`${id}w`} x2={1} y2={0} stops={[[0, "#B98652"], [0.45, "#E8C293"], [1, "#9E6C3C"]]} />
      </defs>
      <g className={className}>
        <path d="M-5 0 L 5 0 L 6 138 C 20 146 24 170 18 186 C 12 204 -12 204 -18 186 C -24 170 -20 146 -6 138 Z" fill={`url(#${id}w)`} {...outline} />
        <path d="M-10 160 C -12 172 -10 186 -4 192" stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

export function BastingSpoon({ x, y, rotate = 0, scale = 1, className, fill = "#F2D98A" }: { x: number; y: number; rotate?: number; scale?: number; className?: string; fill?: string }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <defs>
        <LinearGradient id={`${id}s`} x2={1} y2={1} stops={[[0, "#F4F6F7"], [0.5, "#B7BFC3"], [1, "#7D868B"]]} />
      </defs>
      <g className={className}>
        <path d="M-4 0 L 4 0 L 5 120 L -5 120 Z" fill={`url(#${id}s)`} {...outline} />
        <ellipse cx={0} cy={146} rx={26} ry={32} fill={`url(#${id}s)`} {...outline} />
        <ellipse cx={0} cy={148} rx={19} ry={24} fill={fill} stroke={INK} strokeWidth={1.2} />
        <ellipse cx={-6} cy={140} rx={6} ry={8} fill="#FFFFFF" opacity={0.55} />
      </g>
    </g>
  );
}

export function Ladle({ x, y, rotate = 0, scale = 1, className, fill = "#EBC685" }: { x: number; y: number; rotate?: number; scale?: number; className?: string; fill?: string }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <defs>
        <LinearGradient id={`${id}s`} x2={1} y2={1} stops={[[0, "#F7F9FA"], [0.5, "#B9C1C5"], [1, "#7B848A"]]} />
      </defs>
      <g className={className}>
        <path d="M-4 0 C -6 60 -8 110 -2 150 L 6 150 C 2 110 4 60 4 0 Z" fill={`url(#${id}s)`} {...outline} />
        <path d="M-40 150 A 40 30 0 0 0 40 150 Z" fill={`url(#${id}s)`} {...outline} />
        <ellipse cx={0} cy={150} rx={40} ry={11} fill={fill} {...outline} strokeWidth={1.6} />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Bakplaat (perspectief)                                              */
/* ------------------------------------------------------------------ */
export function Tray({ cx = 240, cy = 230, w = 380, d = 130, children }: { cx?: number; cy?: number; w?: number; d?: number; children?: ReactNode }) {
  const id = useUid();
  const x = cx - w / 2;
  const y = cy - d / 2;
  return (
    <g>
      <defs>
        <LinearGradient id={`${id}t`} stops={[[0, "#5B5552"], [1, "#2B2725"]]} />
        <LinearGradient id={`${id}p`} x2={1} y2={1} stops={[[0, "#FBF5EA"], [1, "#E6D8C0"]]} />
      </defs>
      <GroundShadow cx={cx + 12} cy={cy + d / 2 + 14} rx={w * 0.58} ry={d * 0.3} />
      <path d={roundRect(x, y + 12, w, d, 18, 9)} fill="#1E1A18" {...outline} />
      <path d={roundRect(x, y, w, d, 18, 9)} fill={`url(#${id}t)`} {...outline} />
      <path d={roundRect(x + 14, y + 8, w - 28, d - 16, 10, 6)} fill={`url(#${id}p)`} stroke={INK} strokeWidth={1.2} />
      <g {...hairline} opacity={0.18}>
        <path d={`M${x + 60} ${y + 14} l 20 ${d - 30}`} />
        <path d={`M${x + w - 90} ${y + 20} l -26 ${d - 40}`} />
      </g>
      {children}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Blender                                                             */
/* ------------------------------------------------------------------ */
export function Blender({ cx = 240, top = 40, tone = "herb" }: { cx?: number; top?: number; tone?: LiquidTone }) {
  const id = useUid();
  const [light, mid, dark] = LIQUID[tone];
  const jug = `M${cx - 78} ${top + 22} L${cx + 78} ${top + 22} L${cx + 56} ${top + 222} L${cx - 56} ${top + 222} Z`;
  return (
    <g>
      <defs>
        <LinearGradient id={`${id}g`} x2={1} y2={0} stops={[[0, "#DCEAEC", 0.7], [0.3, "#FFFFFF", 0.35], [1, "#BFD3D6", 0.75]]} />
        <LinearGradient id={`${id}c`} stops={[[0, light], [0.5, mid], [1, dark]]} />
        <LinearGradient id={`${id}b`} x2={1} y2={0} stops={[[0, "#1C1917"], [0.35, "#4E4642"], [1, "#161311"]]} />
        <clipPath id={`${id}clip`}>
          <path d={jug} />
        </clipPath>
      </defs>
      <GroundShadow cx={cx + 12} cy={top + 316} rx={120} ry={20} />
      <path d={`M${cx + 70} ${top + 60} C ${cx + 120} ${top + 64} ${cx + 118} ${top + 170} ${cx + 60} ${top + 176}`} fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" />
      <path d={`M${cx + 70} ${top + 60} C ${cx + 120} ${top + 64} ${cx + 118} ${top + 170} ${cx + 60} ${top + 176}`} fill="none" stroke="#3C3532" strokeWidth={9} strokeLinecap="round" />
      <path d={`M${cx - 70} ${top + 222} L${cx + 70} ${top + 222} L${cx + 82} ${top + 300} Q${cx} ${top + 314} ${cx - 82} ${top + 300} Z`} fill={`url(#${id}b)`} {...outline} />
      <circle cx={cx} cy={top + 266} r={13} fill="#A07A44" {...outline} />
      <path d={`M${cx} ${top + 256} L${cx} ${top + 264}`} stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <g clipPath={`url(#${id}clip)`}>
        <rect x={cx - 90} y={top + 110} width={180} height={120} fill={`url(#${id}c)`} />
        <path d={`M${cx - 90} ${top + 112} Q ${cx - 45} ${top + 98} ${cx} ${top + 112} T ${cx + 90} ${top + 112}`} fill={light} stroke={dark} strokeWidth={1.2} />
        <g transform={`translate(${cx} ${top + 170})`}>
          <path
            className="a-swirl"
            d="M0 0 C 18 -4 26 12 14 24 C 0 38 -30 30 -34 8 C -38 -18 -10 -40 16 -38 C 44 -36 58 -10 52 16"
            fill="none"
            stroke={light}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.8}
          />
        </g>
        <g transform={`translate(${cx} ${top + 214}) scale(1 0.35)`}>
          <path className="a-spin" d="M-30 0 L 30 0 M 0 -30 L 0 30" stroke="#E5E9EB" strokeWidth={8} strokeLinecap="round" />
        </g>
      </g>
      <path d={jug} fill={`url(#${id}g)`} {...outline} />
      <path d={`M${cx - 60} ${top + 40} L${cx - 44} ${top + 204}`} stroke="#FFFFFF" strokeOpacity={0.75} strokeWidth={5} strokeLinecap="round" />
      <path d={`M${cx - 44} ${top + 40} L${cx - 34} ${top + 140}`} stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={2.5} strokeLinecap="round" />
      <path d={`M${cx - 84} ${top + 8} L${cx + 84} ${top + 8} L${cx + 80} ${top + 26} L${cx - 80} ${top + 26} Z`} fill="#2B2522" {...outline} />
      <rect x={cx - 18} y={top - 8} width={36} height={16} rx={4} fill="#3F3834" {...outline} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Microplane-rasp                                                     */
/* ------------------------------------------------------------------ */
export function Grater({ x, y, rotate = 0, scale = 1, className }: { x: number; y: number; rotate?: number; scale?: number; className?: string }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <defs>
        <LinearGradient id={`${id}s`} stops={[[0, "#FAFBFB"], [0.5, "#C2C9CD"], [1, "#858E93"]]} />
      </defs>
      <g className={className}>
        <rect x={0} y={-12} width={220} height={24} rx={5} fill={`url(#${id}s)`} {...outline} />
        {Array.from({ length: 16 }).map((_, i) =>
          [-5, 4].map((row) => (
            <path key={`${i}-${row}`} d={`M${12 + i * 12.5 + (row > 0 ? 6 : 0)} ${row} q 3 -2.5 6 0`} stroke={INK} strokeWidth={1.1} fill="none" opacity={0.6} />
          )),
        )}
        <path d="M220 -9 L 306 -7 C 316 -6 318 8 306 9 L 220 9 Z" fill="#1F1B19" {...outline} />
        <path d="M232 -3 L 300 -2" stroke="#FFFFFF" strokeOpacity={0.25} strokeWidth={2} strokeLinecap="round" />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Spuitzak                                                            */
/* ------------------------------------------------------------------ */
export function PipingBag({ x, y, rotate = 0, className, fill = "#FFFDF6" }: { x: number; y: number; rotate?: number; className?: string; fill?: string }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <defs>
        <LinearGradient id={`${id}b`} x2={1} y2={0} stops={[[0, "#E8E1D3"], [0.35, "#FFFFFF"], [1, "#D5CCBB"]]} />
        <LinearGradient id={`${id}n`} x2={1} y2={0} stops={[[0, "#8E979C"], [0.5, "#F2F4F5"], [1, "#7A8388"]]} />
      </defs>
      <g className={className}>
        <path d="M-10 -26 L -64 -176 Q 0 -196 64 -176 L 10 -26 Z" fill={`url(#${id}b)`} {...outline} />
        <path d="M-22 -60 L -52 -150 Q 0 -160 50 -150 L 22 -60 Z" fill={fill} opacity={0.75} />
        <path d="M-64 -176 Q 0 -196 64 -176 L 14 -196 L -14 -196 Z" fill="#EFE8DA" {...outline} />
        <path d="M-14 -196 C -18 -210 -8 -222 0 -214 C 8 -222 18 -210 14 -196 Z" fill="#E4DCCB" {...outline} strokeWidth={1.8} />
        <path d="M-40 -150 L -20 -70" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
        <path d="M-11 -28 L 11 -28 L 5 0 L -5 0 Z" fill={`url(#${id}n)`} {...outline} />
        <path d="M-6 -24 L -3 -2 M 0 -26 L 0 -2 M 6 -24 L 3 -2" stroke={INK} strokeWidth={0.9} opacity={0.5} />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Brander (gasbrander voor meringue)                                  */
/* ------------------------------------------------------------------ */
export function Torch({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <defs>
        <LinearGradient id={`${id}c`} x2={1} y2={0} stops={[[0, "#1B1816"], [0.35, "#4C4541"], [1, "#141110"]]} />
        <LinearGradient id={`${id}b`} x2={1} y2={0} stops={[[0, "#8A6A36"], [0.45, "#E4C88F"], [1, "#7A5B2C"]]} />
        <LinearGradient id={`${id}f`} x2={1} y2={0} stops={[[0, "#FFFFFF"], [0.3, "#9CC8FF"], [1, "#2F6BD8", 0.2]]} />
      </defs>
      <g transform="translate(-92 6) rotate(180)">
        <path className="a-flame o-left" d="M0 0 C 20 -12 52 -8 76 0 C 52 8 20 12 0 0 Z" fill={`url(#${id}f)`} stroke="#2F5FB8" strokeWidth={1} />
      </g>
      <path d="M-92 0 L -40 -4 L -40 16 L -92 12 Z" fill={`url(#${id}b)`} {...outline} />
      <path d="M-40 -18 L 20 -18 L 26 30 L -40 30 Z" fill={`url(#${id}b)`} {...outline} />
      <path d="M-10 30 Q -4 58 -24 64 L -30 56 Q -18 50 -22 30 Z" fill="#2B2522" {...outline} />
      <rect x={-8} y={-20} width={64} height={150} rx={20} fill={`url(#${id}c)`} {...outline} transform="translate(0 20)" />
      <path d="M6 50 L 6 150" stroke="#FFFFFF" strokeOpacity={0.25} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Pepermolen                                                          */
/* ------------------------------------------------------------------ */
export function PepperMill({ x, y, rotate = 0, className }: { x: number; y: number; rotate?: number; className?: string }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <defs>
        <LinearGradient id={`${id}w`} x2={1} y2={0} stops={[[0, "#3A2317"], [0.35, "#8A5733"], [0.5, "#B77C4E"], [1, "#2E1B11"]]} />
      </defs>
      <g className={className ? `${className} o-bottom` : undefined}>
        <path d="M-10 -150 L 10 -150 L 12 -138 L -12 -138 Z" fill="#C2C9CD" {...outline} />
        <circle cx={0} cy={-156} r={9} fill={`url(#${id}w)`} {...outline} />
        <path d="M-22 -136 C -24 -120 -30 -100 -22 -78 C -32 -58 -34 -30 -26 0 L 26 0 C 34 -30 32 -58 22 -78 C 30 -100 24 -120 22 -136 Z" fill={`url(#${id}w)`} {...outline} />
        <path d="M-24 -78 L 24 -78" stroke={INK} strokeWidth={1.6} />
        <path d="M-14 -126 C -16 -110 -18 -96 -12 -84 M -16 -66 C -22 -46 -22 -24 -18 -6" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Kookwekker                                                          */
/* ------------------------------------------------------------------ */
export function KitchenTimer({ x, y, r = 30 }: { x: number; y: number; r?: number }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <LinearGradient id={`${id}r`} x2={1} y2={1} stops={[[0, "#E7CF9F"], [1, "#8F6B35"]]} />
      </defs>
      <GroundShadow cx={6} cy={r + 4} rx={r * 1.1} ry={r * 0.25} />
      <rect x={-5} y={-r - 9} width={10} height={8} rx={2} fill="#8F6B35" {...outline} strokeWidth={1.6} />
      <circle r={r} fill={`url(#${id}r)`} {...outline} />
      <circle r={r - 6} fill="#FFFBF2" stroke={INK} strokeWidth={1.3} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r1 = r - 9;
        const r2 = i % 3 === 0 ? r - 14 : r - 11.5;
        return <line key={i} x1={cos(a) * r1} y1={sin(a) * r1} x2={cos(a) * r2} y2={sin(a) * r2} stroke={INK} strokeWidth={i % 3 === 0 ? 1.6 : 1} />;
      })}
      <g className="a-tick">
        <line x1={0} y1={0} x2={0} y2={-(r - 12)} stroke="#6A1E2A" strokeWidth={2.4} strokeLinecap="round" />
        <line x1={0} y1={0} x2={0} y2={r - 12} stroke="transparent" strokeWidth={2.4} />
      </g>
      <circle r={2.8} fill={INK} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Verrine-glas                                                        */
/* ------------------------------------------------------------------ */
export function Verrine({ cx, cy, w = 84, h = 110, layers }: { cx: number; cy: number; w?: number; h?: number; layers: string[] }) {
  const id = useUid();
  const x = cx - w / 2;
  const glass = `M${x} ${cy - h} L${x + w} ${cy - h} L${x + w - 6} ${cy} Q${cx} ${cy + 10} ${x + 6} ${cy} Z`;
  const layerH = (h * 0.7) / layers.length;
  return (
    <g>
      <defs>
        <clipPath id={`${id}c`}>
          <path d={glass} />
        </clipPath>
        <LinearGradient id={`${id}g`} x2={1} y2={0} stops={[[0, "#E6F0F1", 0.6], [0.3, "#FFFFFF", 0.2], [1, "#CFE0E2", 0.6]]} />
      </defs>
      <GroundShadow cx={cx + 8} cy={cy + 6} rx={w * 0.7} ry={12} />
      <g clipPath={`url(#${id}c)`}>
        {layers.map((c, i) => (
          <rect key={i} x={x - 4} y={cy + 6 - layerH * (i + 1)} width={w + 8} height={layerH + 1} fill={c} />
        ))}
        {layers.map((_, i) => (
          <path key={`l${i}`} d={`M${x} ${cy + 6 - layerH * (i + 1)} q ${w / 4} 4 ${w / 2} 0 t ${w / 2} 0`} stroke={INK} strokeWidth={1} fill="none" opacity={0.35} />
        ))}
      </g>
      <path d={glass} fill={`url(#${id}g)`} {...outline} />
      <ellipse cx={cx} cy={cy - h} rx={w / 2} ry={7} fill="#FFFFFF" fillOpacity={0.35} {...outline} strokeWidth={1.6} />
      <path d={`M${x + 10} ${cy - h + 14} L${x + 14} ${cy - 12}`} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
    </g>
  );
}

export { SW };
