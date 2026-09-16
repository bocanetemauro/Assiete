"use client";

/**
 * Gedeelde bouwstenen voor de "premium culinary comic"-illustratiestijl:
 * warme inktlijnen, zachte verlopen, lichtval van linksboven en subtiele schaduwen.
 *
 * Belangrijk: elementen met een CSS-animatie (`a-*`) mogen zelf geen SVG
 * `transform`-attribuut hebben (CSS overschrijft dat). Positioneer ze daarom
 * altijd via een omhullende <g transform>.
 */

import { useId, type CSSProperties, type ReactNode } from "react";

export const INK = "#2A211C";
export const SW = 2.2;

/**
 * Server (Node) en browser kunnen in de laatste bits van Math.sin/cos verschillen,
 * wat hydratiefouten in SVG-attributen geeft. Daarom afgeronde varianten en een
 * integer-hash als deterministische "random".
 */
export const sin = (a: number) => Math.round(Math.sin(a) * 1e6) / 1e6;
export const cos = (a: number) => Math.round(Math.cos(a) * 1e6) / 1e6;

export function rand(i: number, seed = 1): number {
  let h = Math.imul(i + 1, 0x9e3779b1) ^ Math.imul(seed + 7, 0x85ebca77);
  h ^= h >>> 15;
  h = Math.imul(h, 0x2c1b3c6d);
  h ^= h >>> 12;
  h = Math.imul(h, 0x297a2d39);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

export function useUid(): string {
  return useId().replace(/[^a-zA-Z0-9]/g, "");
}

export const outline = {
  stroke: INK,
  strokeWidth: SW,
  strokeLinejoin: "round",
  strokeLinecap: "round",
} as const;

export const hairline = {
  stroke: INK,
  strokeWidth: 1.3,
  strokeLinejoin: "round",
  strokeLinecap: "round",
  fill: "none",
  opacity: 0.5,
} as const;

export function vars(style: Record<string, string | number>): CSSProperties {
  return style as CSSProperties;
}

/** Zachte slagschaduw zonder filters (goedkoop, ook bij veel instanties). */
export function GroundShadow({
  cx,
  cy,
  rx,
  ry,
  opacity = 0.22,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  opacity?: number;
}) {
  const id = useUid();
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={INK} stopOpacity={opacity} />
          <stop offset="65%" stopColor={INK} stopOpacity={opacity * 0.5} />
          <stop offset="100%" stopColor={INK} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id})`} />
    </g>
  );
}

export function Steam({
  x,
  y,
  scale = 1,
  color = "#B9AEA2",
  count = 3,
  spread = 24,
  delay = 0,
  width = 4,
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  count?: number;
  spread?: number;
  delay?: number;
  width?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => {
        const dx = (i - (count - 1) / 2) * spread;
        return (
          <path
            key={i}
            className="a-steam o-bottom"
            style={{ animationDelay: `${delay + i * 1.1}s` }}
            d={`M${dx} 0 c -8 -9 8 -17 0 -26 c -8 -9 8 -17 0 -26`}
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

/** Spetters/bubbeltjes die van een hete pan opspringen. */
export function Sizzle({
  x,
  y,
  w,
  count = 9,
  color = "#F3D9A4",
}: {
  x: number;
  y: number;
  w: number;
  count?: number;
  color?: string;
}) {
  return (
    <g pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => {
        const px = x - w / 2 + (w / (count - 1)) * i;
        const dx = ((i * 37) % 21) - 10;
        const dy = -18 - ((i * 53) % 22);
        return (
          <circle
            key={i}
            cx={px}
            cy={y - ((i * 29) % 10)}
            r={i % 3 === 0 ? 2.6 : 1.8}
            fill={color}
            stroke={INK}
            strokeWidth={0.8}
            className="a-sizzle"
            style={vars({ "--dx": `${dx}px`, "--dy": `${dy}px`, animationDelay: `${(i * 0.17) % 1.4}s` })}
          />
        );
      })}
    </g>
  );
}

export function Sparkle({ x, y, size = 10, delay = 0, color = "#FFFFFF" }: { x: number; y: number; size?: number; delay?: number; color?: string }) {
  const s = size;
  return (
    <g transform={`translate(${x} ${y})`} pointerEvents="none">
      <path
        className="a-glow"
        style={{ animationDelay: `${delay}s` }}
        d={`M0 ${-s} C ${s * 0.15} ${-s * 0.15} ${s * 0.15} ${-s * 0.15} ${s} 0 C ${s * 0.15} ${s * 0.15} ${s * 0.15} ${s * 0.15} 0 ${s} C ${-s * 0.15} ${s * 0.15} ${-s * 0.15} ${s * 0.15} ${-s} 0 C ${-s * 0.15} ${-s * 0.15} ${-s * 0.15} ${-s * 0.15} 0 ${-s} Z`}
        fill={color}
        stroke={INK}
        strokeWidth={0.9}
        strokeLinejoin="round"
      />
    </g>
  );
}

/** Vallende vlokken (zout, peper, rasp, cacao). */
export function Falling({
  x,
  y,
  w,
  count = 8,
  fall = 70,
  color = "#FFFFFF",
  shape = "flake",
}: {
  x: number;
  y: number;
  w: number;
  count?: number;
  fall?: number;
  color?: string;
  shape?: "flake" | "dot" | "shred";
}) {
  return (
    <g pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => {
        const px = x - w / 2 + ((i * 41) % Math.max(1, Math.round(w)));
        const py = y + ((i * 17) % 14);
        const style = vars({ "--fall": `${fall + ((i * 13) % 20)}px`, animationDelay: `${(i * 0.23) % 1.8}s` });
        if (shape === "dot") {
          return <circle key={i} cx={px} cy={py} r={1.8} fill={color} className="a-fall" style={style} />;
        }
        if (shape === "shred") {
          return (
            <path
              key={i}
              d={`M${px} ${py} q 3 4 0 9`}
              stroke={color}
              strokeWidth={2.2}
              fill="none"
              strokeLinecap="round"
              className="a-fall"
              style={style}
            />
          );
        }
        return (
          <path
            key={i}
            d={`M${px} ${py - 3} l 3 3 l -3 3 l -3 -3 z`}
            fill={color}
            stroke={INK}
            strokeWidth={0.7}
            className="a-fall"
            style={style}
          />
        );
      })}
    </g>
  );
}

/** Wrapper voor een geïllustreerde scène: pauzeert loops buiten beeld. */
export function IllustrationFrame({
  viewBox,
  active = true,
  className,
  title,
  children,
}: {
  viewBox: string;
  active?: boolean;
  className?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      className={`ill ${className ?? ""}`}
      data-active={active ? "true" : "false"}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

/** Lineaire verloop-helper. */
export function LinearGradient({
  id,
  stops,
  x1 = 0,
  y1 = 0,
  x2 = 0,
  y2 = 1,
}: {
  id: string;
  stops: [number, string, number?][];
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}) {
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
      {stops.map(([o, c, op], i) => (
        <stop key={i} offset={o} stopColor={c} stopOpacity={op ?? 1} />
      ))}
    </linearGradient>
  );
}

export function RadialGradient({
  id,
  stops,
  cx = 0.4,
  cy = 0.35,
  r = 0.75,
}: {
  id: string;
  stops: [number, string, number?][];
  cx?: number;
  cy?: number;
  r?: number;
}) {
  return (
    <radialGradient id={id} cx={cx} cy={cy} r={r}>
      {stops.map(([o, c, op], i) => (
        <stop key={i} offset={o} stopColor={c} stopOpacity={op ?? 1} />
      ))}
    </radialGradient>
  );
}
