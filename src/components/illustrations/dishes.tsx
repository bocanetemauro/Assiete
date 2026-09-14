"use client";

/**
 * Gastronomische borden in bovenaanzicht, opgebouwd uit lagen:
 *   0 leeg bord → 1 saus → 2 hoofdonderdeel → 3 garnituur → 4 kruiden → 5 rand schoon
 * Dezelfde lagen voeden de kaart-illustraties, de plating-gids en de dresseer-animatie.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { DishKey } from "@/lib/types";
import { GroundShadow, INK, RadialGradient, LinearGradient, Sparkle, cos, outline, rand, sin, useUid } from "./kit";

type Tri = [string, string, string];
type PlateVariant = "porcelain" | "slate" | "stoneware" | "bowl" | "bowl-stone";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* Animatie-infrastructuur                                             */
/* ------------------------------------------------------------------ */
const LayerCtx = createContext<{ show: boolean; animated: boolean; base: number }>({ show: true, animated: false, base: 0 });

const centerBox = { transformBox: "fill-box", transformOrigin: "center" } as const;

function Pop({ i = 0, children, drop = false }: { i?: number; children: ReactNode; drop?: boolean }) {
  const { show, animated, base } = useContext(LayerCtx);
  if (!animated) return <g>{children}</g>;
  const hidden = drop ? { opacity: 0, y: -22, rotate: -30, scale: 0.9 } : { opacity: 0, y: 0, rotate: 0, scale: 0.2 };
  return (
    <motion.g
      style={centerBox}
      initial={hidden}
      animate={show ? { opacity: 1, y: 0, rotate: 0, scale: 1 } : hidden}
      transition={show ? { delay: base + i * 0.06, type: "spring", stiffness: 280, damping: 19 } : { duration: 0.2 }}
    >
      {children}
    </motion.g>
  );
}

type LayerKind = "sauce" | "main" | "garnish" | "herbs" | "smudge";

function Layer({ show, kind, animated, children }: { show: boolean; kind: LayerKind; animated: boolean; children: ReactNode }) {
  const id = useUid();
  if (!animated) return show ? <g>{children}</g> : null;
  const ctx = { show, animated, base: 0.05 };
  if (kind === "sauce") {
    return (
      <g>
        <defs>
          <clipPath id={id}>
            <motion.rect
              x={0}
              y={0}
              height={400}
              initial={{ width: 0 }}
              animate={{ width: show ? 400 : 0 }}
              transition={{ duration: show ? 1.1 : 0.25, ease: EASE }}
            />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id})`}>{children}</g>
      </g>
    );
  }
  if (kind === "main") {
    const hidden = { opacity: 0, y: -40, scale: 1.12 };
    return (
      <motion.g style={centerBox} initial={hidden} animate={show ? { opacity: 1, y: 0, scale: 1 } : hidden} transition={{ duration: show ? 0.75 : 0.25, ease: EASE }}>
        {children}
      </motion.g>
    );
  }
  if (kind === "smudge") {
    return (
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: show ? 0.3 : 0.7, delay: show ? 0.6 : 0 }}>
        {children}
      </motion.g>
    );
  }
  return <LayerCtx.Provider value={ctx}>{children}</LayerCtx.Provider>;
}

/* ------------------------------------------------------------------ */
/* Borden                                                              */
/* ------------------------------------------------------------------ */
function Plate({ variant }: { variant: PlateVariant }) {
  const id = useUid();
  const c = 200;
  if (variant === "slate") {
    return (
      <g>
        <GroundShadow cx={216} cy={224} rx={198} ry={194} opacity={0.34} />
        <defs>
          <RadialGradient id={`${id}r`} cx={0.38} cy={0.32} r={0.8} stops={[[0, "#55504D"], [0.75, "#302C2A"], [1, "#1C1918"]]} />
          <RadialGradient id={`${id}w`} cx={0.46} cy={0.42} r={0.7} stops={[[0, "#3D3937"], [1, "#272422"]]} />
          <LinearGradient id={`${id}e`} x2={1} y2={1} stops={[[0, "#111010"], [1, "#6A6461"]]} />
        </defs>
        <circle cx={c} cy={c} r={178} fill={`url(#${id}r)`} {...outline} />
        <circle cx={c} cy={c} r={136} fill={`url(#${id}w)`} stroke={`url(#${id}e)`} strokeWidth={4} />
        {Array.from({ length: 70 }).map((_, i) => {
          const a = rand(i, 3) * Math.PI * 2;
          const rr = Math.sqrt(rand(i, 4)) * 170;
          return <circle key={i} cx={c + cos(a) * rr} cy={c + sin(a) * rr} r={0.6 + rand(i, 5) * 1.1} fill="#FFFFFF" opacity={0.07} />;
        })}
        <path d="M52 150 A 156 156 0 0 1 150 48" stroke="#FFFFFF" strokeOpacity={0.22} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
    );
  }
  if (variant === "stoneware" || variant === "bowl-stone") {
    const bowl = variant === "bowl-stone";
    return (
      <g>
        <GroundShadow cx={216} cy={224} rx={196} ry={192} opacity={0.3} />
        <defs>
          <RadialGradient id={`${id}r`} cx={0.4} cy={0.35} r={0.78} stops={[[0, "#F4ECDD"], [0.7, "#E4D6BF"], [1, "#C2AF91"]]} />
          <RadialGradient
            id={`${id}w`}
            cx={bowl ? 0.58 : 0.46}
            cy={bowl ? 0.6 : 0.42}
            r={0.72}
            stops={bowl ? [[0, "#F6EFE3"], [0.7, "#E6D9C4"], [1, "#BFAB8C"]] : [[0, "#F6EFE2"], [1, "#E8DCC8"]]}
          />
          <LinearGradient id={`${id}e`} x2={1} y2={1} stops={[[0, "#B7A383"], [1, "#FFF9EE"]]} />
        </defs>
        <circle cx={c} cy={c} r={176} fill={`url(#${id}r)`} {...outline} />
        <circle cx={c} cy={c} r={174} fill="none" stroke="#A8957A" strokeWidth={2.5} opacity={0.6} />
        <circle cx={c} cy={c} r={bowl ? 132 : 124} fill={`url(#${id}w)`} stroke={`url(#${id}e)`} strokeWidth={bowl ? 7 : 5} />
        {Array.from({ length: 90 }).map((_, i) => {
          const a = rand(i, 7) * Math.PI * 2;
          const rr = Math.sqrt(rand(i, 8)) * 168;
          return <circle key={i} cx={c + cos(a) * rr} cy={c + sin(a) * rr} r={0.6 + rand(i, 9) * 1.2} fill="#6A5440" opacity={0.28} />;
        })}
        <path d="M54 150 A 154 154 0 0 1 150 50" stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    );
  }
  const bowl = variant === "bowl";
  return (
    <g>
      <GroundShadow cx={216} cy={224} rx={196} ry={192} opacity={0.26} />
      <defs>
        <RadialGradient id={`${id}r`} cx={0.42} cy={0.38} r={0.72} stops={[[0, "#FFFFFF"], [0.8, "#F7F4EE"], [1, "#DCD4C7"]]} />
        <RadialGradient
          id={`${id}w`}
          cx={bowl ? 0.6 : 0.46}
          cy={bowl ? 0.62 : 0.42}
          r={0.72}
          stops={bowl ? [[0, "#FFFFFF"], [0.65, "#F1ECE4"], [1, "#CFC6B8"]] : [[0, "#FFFFFF"], [1, "#F4F0EA"]]}
        />
        <LinearGradient id={`${id}e`} x2={1} y2={1} stops={[[0, "#CBC2B4"], [1, "#FFFFFF"]]} />
        <LinearGradient id={`${id}s`} x2={1} y2={1} stops={[[0, "#FFFFFF", 0], [1, INK, 0.07]]} />
      </defs>
      <circle cx={c} cy={c} r={178} fill={`url(#${id}r)`} {...outline} />
      <circle cx={c} cy={c} r={178} fill={`url(#${id}s)`} />
      <circle cx={c} cy={c} r={bowl ? 130 : 122} fill={`url(#${id}w)`} stroke={`url(#${id}e)`} strokeWidth={bowl ? 8 : 6} />
      <circle cx={c} cy={c} r={bowl ? 134 : 125.5} fill="none" stroke={INK} strokeOpacity={0.14} strokeWidth={1.2} />
      <path d="M50 152 A 156 156 0 0 1 152 46" stroke="#FFFFFF" strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M334 268 A 150 150 0 0 1 280 330" stroke="#FFFFFF" strokeOpacity={0.8} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Kleine bovenaanzicht-elementen                                      */
/* ------------------------------------------------------------------ */
function Swoosh({ d, w, c }: { d: string; w: number; c: Tri }) {
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={w + 3.4} strokeLinecap="round" fill="none" />
      <path d={d} stroke={c[1]} strokeWidth={w} strokeLinecap="round" fill="none" />
      <path d={d} stroke={c[2]} strokeWidth={w * 0.42} strokeLinecap="round" fill="none" opacity={0.35} transform="translate(2 3.5)" />
      <path d={d} stroke={c[0]} strokeWidth={Math.max(2, w * 0.2)} strokeLinecap="round" fill="none" opacity={0.75} transform="translate(-2 -4)" />
    </g>
  );
}

function Dot({ x, y, r, c }: { x: number; y: number; r: number; c: Tri }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={c[1]} stroke={INK} strokeWidth={1.4} />
      <circle cx={x + r * 0.18} cy={y + r * 0.2} r={r * 0.6} fill={c[2]} opacity={0.35} />
      <circle cx={x - r * 0.32} cy={y - r * 0.34} r={Math.max(1, r * 0.3)} fill={c[0]} opacity={0.85} />
    </g>
  );
}

function Leaf({ x, y, rot = 0, len = 24, wid = 11, c = "#5E9A3E", dark = "#2F5A1C" }: { x: number; y: number; rot?: number; len?: number; wid?: number; c?: string; dark?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 C ${len * 0.3} ${-wid} ${len * 0.8} ${-wid * 0.8} ${len} 0 C ${len * 0.8} ${wid * 0.8} ${len * 0.3} ${wid} 0 0 Z`} fill={c} stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
      <path d={`M1 0 L ${len * 0.9} 0`} stroke={dark} strokeWidth={0.9} opacity={0.8} />
      <path d={`M${len * 0.2} ${-wid * 0.35} C ${len * 0.4} ${-wid * 0.55} ${len * 0.6} ${-wid * 0.5} ${len * 0.75} ${-wid * 0.3}`} stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={1.3} fill="none" strokeLinecap="round" />
    </g>
  );
}

function Micro({ x, y, rot = 0, c = "#7DB352" }: { x: number; y: number; rot?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M0 0 L 0 -10" stroke="#C9D8A8" strokeWidth={1.6} strokeLinecap="round" />
      <ellipse cx={-5} cy={-12} rx={5.5} ry={3.4} fill={c} stroke={INK} strokeWidth={1} transform="rotate(-25 -5 -12)" />
      <ellipse cx={5} cy={-12} rx={5.5} ry={3.4} fill={c} stroke={INK} strokeWidth={1} transform="rotate(25 5 -12)" />
    </g>
  );
}

function Flakes({ pts }: { pts: [number, number][] }) {
  return (
    <g>
      {pts.map(([x, y], i) => (
        <path key={i} d={`M${x} ${y - 2.6} l 2.8 1.6 l -0.6 3 l -3.2 0.4 l -1.4 -2.6 Z`} fill="#FFFFFF" stroke={INK} strokeWidth={0.6} strokeLinejoin="round" />
      ))}
    </g>
  );
}

function Pepper({ pts, color = "#1E1814" }: { pts: [number, number][]; color?: string }) {
  return (
    <g>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.1 + (i % 3) * 0.35} fill={color} />
      ))}
    </g>
  );
}

function scatter(n: number, cx: number, cy: number, rx: number, ry: number, seed: number): [number, number][] {
  return Array.from({ length: n }).map((_, i) => {
    const a = rand(i, seed) * Math.PI * 2;
    const rr = Math.sqrt(rand(i, seed + 1));
    return [cx + cos(a) * rr * rx, cy + sin(a) * rr * ry];
  });
}

function Berry({ x, y, r = 8, kind = "blueberry" }: { x: number; y: number; r?: number; kind?: "blueberry" | "raspberry" | "cherry" }) {
  const id = useUid();
  const stops: [number, string][] =
    kind === "blueberry" ? [[0, "#9AA0CC"], [0.45, "#474A7E"], [1, "#1F1F42"]] : kind === "cherry" ? [[0, "#F37A86"], [0.45, "#A51C2E"], [1, "#4E0A14"]] : [[0, "#FF9AAA"], [0.5, "#DA3A55"], [1, "#8A1028"]];
  return (
    <g>
      <defs>
        <RadialGradient id={id} cx={0.35} cy={0.3} r={0.8} stops={stops} />
      </defs>
      {kind === "cherry" && <path d={`M${x} ${y - r + 2} C ${x + 4} ${y - r - 12} ${x + 14} ${y - r - 18} ${x + 22} ${y - r - 20}`} stroke="#6A7A2E" strokeWidth={2} fill="none" strokeLinecap="round" />}
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} stroke={INK} strokeWidth={1.4} />
      {kind === "blueberry" && <path d={`M${x - 2.5} ${y - 1} l 2.5 -2 l 2.5 2 l -2.5 2 Z`} fill="#23234A" stroke="#15152E" strokeWidth={0.6} />}
      {kind === "raspberry" &&
        Array.from({ length: 7 }).map((_, i) => {
          const a = (i / 7) * Math.PI * 2;
          return <circle key={i} cx={x + cos(a) * r * 0.55} cy={y + sin(a) * r * 0.55} r={r * 0.28} fill="none" stroke="#8A1028" strokeWidth={0.8} />;
        })}
      {kind === "raspberry" && <circle cx={x} cy={y} r={r * 0.25} fill="#7A0E22" />}
      <ellipse cx={x - r * 0.35} cy={y - r * 0.4} rx={r * 0.3} ry={r * 0.2} fill="#FFFFFF" opacity={0.7} />
    </g>
  );
}

function Quenelle({ x, y, rot = 0, s = 1, c, seeds = false, ridge = "#FFFFFF" }: { x: number; y: number; rot?: number; s?: number; c: Tri; seeds?: boolean; ridge?: string }) {
  const id = useUid();
  const d = "M-58 0 C -44 -26 34 -30 58 -6 C 64 0 60 8 50 12 C 20 26 -44 22 -58 0 Z";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <RadialGradient id={id} cx={0.4} cy={0.35} r={0.75} stops={[[0, c[0]], [0.55, c[1]], [1, c[2]]]} />
      </defs>
      <path d={d} transform="translate(3 6)" fill={INK} opacity={0.18} />
      <path d={d} fill={`url(#${id})`} {...outline} />
      <path d="M-50 1 C -20 -8 20 -10 54 -3" stroke={ridge} strokeOpacity={0.35} strokeWidth={2} fill="none" />
      <path d="M-40 -8 C -20 -18 10 -20 32 -16" stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {seeds &&
        Array.from({ length: 18 }).map((_, i) => <circle key={i} cx={-40 + rand(i, 21) * 86} cy={-8 + rand(i, 22) * 16} r={0.9} fill="#2A1A10" />)}
    </g>
  );
}

function Smudges({ c, pts }: { c: string; pts: [number, number, number][] }) {
  return (
    <g>
      {pts.map(([x, y, r], i) => (
        <path key={i} d={`M${x - r} ${y} C ${x - r} ${y - r * 0.9} ${x + r * 1.4} ${y - r} ${x + r * 1.6} ${y + r * 0.2} C ${x + r} ${y + r * 0.9} ${x - r * 0.6} ${y + r * 0.8} ${x - r} ${y} Z`} fill={c} stroke={INK} strokeWidth={1} opacity={0.9} />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Kleurpaletten                                                       */
/* ------------------------------------------------------------------ */
const BERRY: Tri = ["#9C84C4", "#4A2C6A", "#24133A"];
const CREAM: Tri = ["#FFFFFF", "#F4E9D2", "#D8C49E"];
const BUTTER: Tri = ["#FFFBEA", "#F4E4B0", "#D9BE7C"];
const HERB_OIL: Tri = ["#B9DC8A", "#4F8A2E", "#29501A"];
const LABNEH: Tri = ["#FFFFFF", "#F8F3EA", "#D6CCBC"];
const COULIS: Tri = ["#FF8C9C", "#C8344A", "#7A1022"];
const CHOC: Tri = ["#8A5A42", "#4A2A1A", "#1E0F08"];
const VANILLA: Tri = ["#FFFFFF", "#FBF1DA", "#DCC79E"];
const PARSNIP: Tri = ["#FFFFFF", "#F3E7CC", "#D2BE96"];
const JUS: Tri = ["#D65A6A", "#7A1628", "#3E0812"];
const CAULI: Tri = ["#FFFFFF", "#F6EEDC", "#D6C7A6"];
const BROWN_BUTTER: Tri = ["#F4CD85", "#C98A3E", "#7A4A18"];
const LEMON: Tri = ["#FFF7A8", "#F6D445", "#C99E12"];
const SOY: Tri = ["#B87A50", "#5E3319", "#2A1508"];
const BALSAMIC: Tri = ["#8A5A4A", "#3A1A14", "#140806"];

/* ------------------------------------------------------------------ */
/* 1. Steak met blauwe bessensaus                                      */
/* ------------------------------------------------------------------ */
const SLICE = "M-15 -36 Q -20 0 -15 36 Q 0 42 15 36 Q 20 0 15 -36 Q 0 -42 -15 -36 Z";

function MeatSlices({ x0, y0, dx, dy, count, rot, fat = false }: { x0: number; y0: number; dx: number; dy: number; count: number; rot: number; fat?: boolean }) {
  const id = useUid();
  return (
    <g>
      <defs>
        <RadialGradient id={`${id}m`} cx={0.5} cy={0.5} r={0.6} stops={[[0, "#F29696"], [0.5, "#D9636D"], [0.8, "#A96A5E"], [1, "#7A4636"]]} />
        <LinearGradient id={`${id}f`} stops={[[0, "#F7D08A"], [1, "#B8702F"]]} />
      </defs>
      <ellipse cx={x0 + (dx * (count - 1)) / 2 + 6} cy={y0 + (dy * (count - 1)) / 2 + 10} rx={dx * count * 0.75 + 20} ry={34} fill={INK} opacity={0.12} transform={`rotate(${Math.round(Math.atan2(dy, dx) * (180 / Math.PI))} ${x0 + (dx * (count - 1)) / 2} ${y0 + (dy * (count - 1)) / 2})`} />
      {Array.from({ length: count }).map((_, i) => (
        <g key={i} transform={`translate(${x0 + i * dx} ${y0 + i * dy}) rotate(${rot})`}>
          <path d={SLICE} fill="none" stroke={INK} strokeWidth={9.5} strokeLinejoin="round" />
          <path d={SLICE} fill={`url(#${id}m)`} stroke={fat ? "#C4823C" : "#4A1F10"} strokeWidth={6} strokeLinejoin="round" />
          {fat && (
            <g>
              <path d="M-16 -36 Q 0 -44 16 -36 L 15 -20 Q 0 -26 -15 -20 Z" fill={`url(#${id}f)`} stroke={INK} strokeWidth={1.2} />
              <path d="M-8 -38 L -2 -24 M 4 -40 L 10 -24 M -12 -26 L 8 -38" stroke="#8A4E1A" strokeWidth={0.9} opacity={0.7} />
            </g>
          )}
          <path d="M-6 -16 Q -8 4 -5 22" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" fill="none" />
        </g>
      ))}
    </g>
  );
}

function FondantPotato({ x, y }: { x: number; y: number }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <RadialGradient id={id} cx={0.4} cy={0.35} r={0.7} stops={[[0, "#FADB94"], [0.6, "#E2A24C"], [1, "#9A5A1E"]]} />
      </defs>
      <circle r={27} fill={INK} opacity={0.15} transform="translate(3 5)" />
      <circle r={26} fill={`url(#${id})`} {...outline} />
      <circle r={17} fill="none" stroke="#B8742E" strokeWidth={1.5} opacity={0.5} />
      <ellipse cx={-8} cy={-9} rx={8} ry={4} fill="#FFFFFF" opacity={0.5} />
    </g>
  );
}

function RoastedShallot({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M0 -18 C 14 -14 16 12 0 18 C -16 12 -14 -14 0 -18 Z" fill="#9A4A62" {...outline} strokeWidth={1.8} />
      <path d="M0 -12 C 9 -9 10 8 0 12 C -10 8 -9 -9 0 -12 Z" fill="#E2B2C2" stroke="#7A3A52" strokeWidth={1} />
      <path d="M0 -6 C 4 -4 5 4 0 6 C -5 4 -4 -4 0 -6 Z" fill="none" stroke="#9A4A62" strokeWidth={1} />
    </g>
  );
}

function Rosemary({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0 L 44 0" stroke="#6A5A3A" strokeWidth={1.8} strokeLinecap="round" />
      {Array.from({ length: 9 }).map((_, i) => (
        <g key={i}>
          <path d={`M${4 + i * 4.8} 0 l 5 -9`} stroke={INK} strokeWidth={3.6} strokeLinecap="round" />
          <path d={`M${4 + i * 4.8} 0 l 5 -9`} stroke="#5B7A42" strokeWidth={2} strokeLinecap="round" />
          <path d={`M${6 + i * 4.8} 0 l 5 9`} stroke={INK} strokeWidth={3.6} strokeLinecap="round" />
          <path d={`M${6 + i * 4.8} 0 l 5 9`} stroke="#6F8E52" strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

function Cress({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[
        [0, 0, 7],
        [10, -6, 6],
        [-9, -7, 5.5],
        [4, -14, 5],
        [14, 5, 5],
      ].map(([cx, cy, r], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill={i % 2 ? "#5E9A3E" : "#78B04E"} stroke={INK} strokeWidth={1.1} />
          <path d={`M${cx - r * 0.4} ${cy - r * 0.2} q ${r * 0.4} ${-r * 0.4} ${r * 0.8} 0`} stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={1} fill="none" />
        </g>
      ))}
    </g>
  );
}

const Steak = {
  plate: "porcelain" as PlateVariant,
  Sauce: () => (
    <g>
      <Swoosh d="M116 266 C 150 206 222 170 302 176" w={25} c={BERRY} />
      <Dot x={320} y={185} r={8} c={BERRY} />
      <Dot x={336} y={200} r={5.5} c={BERRY} />
      <Dot x={345} y={215} r={3.4} c={BERRY} />
    </g>
  ),
  Main: () => <MeatSlices x0={150} y0={246} dx={25} dy={-14} count={5} rot={-30} />,
  Garnish: () => (
    <g>
      <Pop i={0}>
        <FondantPotato x={276} y={262} />
      </Pop>
      <Pop i={1}>
        <RoastedShallot x={118} y={214} rot={-20} />
      </Pop>
      <Pop i={2}>
        <RoastedShallot x={228} y={296} rot={40} />
      </Pop>
      {[
        [134, 184, 8],
        [150, 170, 7],
        [304, 230, 7.5],
        [318, 244, 6],
        [242, 138, 7],
      ].map(([x, y, r], i) => (
        <Pop key={i} i={3 + i}>
          <Berry x={x} y={y} r={r} />
        </Pop>
      ))}
    </g>
  ),
  Herbs: () => (
    <g>
      <Pop i={0} drop>
        <Rosemary x={196} y={148} rot={-24} s={0.8} />
      </Pop>
      <Pop i={1} drop>
        <Cress x={300} y={290} />
      </Pop>
      <Pop i={2} drop>
        <Cress x={134} y={262} s={0.8} />
      </Pop>
      <Pop i={3} drop>
        <Flakes pts={[[170, 232], [196, 220], [222, 206], [244, 192], [208, 236]]} />
      </Pop>
      <Pop i={4} drop>
        <Pepper pts={scatter(10, 205, 215, 60, 34, 11)} />
      </Pop>
    </g>
  ),
  Smudge: () => <Smudges c={BERRY[1]} pts={[[338, 104, 6], [70, 286, 5]]} />,
};

/* ------------------------------------------------------------------ */
/* 2. Romige truffelpasta                                              */
/* ------------------------------------------------------------------ */
function spiralPath(cx: number, cy: number, turns: number, r0: number, r1: number, squash = 0.92) {
  const n = Math.round(turns * 48);
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = t * turns * Math.PI * 2;
    const r = r0 + (r1 - r0) * t;
    pts.push(`${(cx + cos(a) * r).toFixed(1)} ${(cy + sin(a) * r * squash).toFixed(1)}`);
  }
  return `M${pts[0]} L${pts.slice(1).join(" L")}`;
}

/** Flinterdun truffelschaafsel: licht grijsbruin, gemarmerd, met gegolfde rand. */
function TruffleShaving({ x, y, r, rot = 0 }: { x: number; y: number; r: number; rot?: number }) {
  const id = useUid();
  const edge = Array.from({ length: 14 })
    .map((_, i) => {
      const a = (i / 14) * Math.PI * 2;
      const rr = r * (i % 2 ? 0.94 : 1.04);
      return `${i === 0 ? "M" : "L"}${(cos(a) * rr * 1.25).toFixed(1)} ${(sin(a) * rr * 0.9).toFixed(1)}`;
    })
    .join(" ");
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <defs>
        <RadialGradient id={id} cx={0.45} cy={0.4} r={0.75} stops={[[0, "#B7A493"], [0.7, "#8C7867"], [1, "#5E4D40"]]} />
      </defs>
      <path d={`${edge} Z`} fill={INK} opacity={0.12} transform="translate(2 3)" />
      <path d={`${edge} Z`} fill={`url(#${id})`} fillOpacity={0.94} stroke={INK} strokeWidth={1.1} strokeLinejoin="round" />
      <path d={`M${-r} ${-r * 0.1} C ${-r * 0.5} ${-r * 0.55} ${-r * 0.1} ${r * 0.15} ${r * 0.35} ${-r * 0.25} C ${r * 0.6} ${-r * 0.45} ${r * 0.85} ${-r * 0.1} ${r * 1.05} ${-r * 0.05}`} stroke="#F4ECE0" strokeWidth={1.1} fill="none" />
      <path d={`M${-r * 0.8} ${r * 0.35} C ${-r * 0.35} ${r * 0.1} ${r * 0.05} ${r * 0.6} ${r * 0.7} ${r * 0.3}`} stroke="#F4ECE0" strokeWidth={0.9} fill="none" />
      <path d={`M${-r * 0.25} ${-r * 0.7} C ${-r * 0.05} ${-r * 0.35} ${-r * 0.45} ${-r * 0.05} ${-r * 0.2} ${r * 0.25}`} stroke="#F4ECE0" strokeWidth={0.8} fill="none" opacity={0.85} />
      <path d={`M${-r * 0.7} ${-r * 0.45} q ${r * 0.4} ${-r * 0.3} ${r * 0.9} ${-r * 0.2}`} stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={1.6} fill="none" strokeLinecap="round" />
    </g>
  );
}

function ParmesanShaving({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M-16 -8 L 12 -12 L 18 2 L 4 12 L -14 8 Z" fill="#FBEFC4" stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M-10 -4 L 10 -7" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
      <circle cx={2} cy={3} r={1} fill="#D9BE72" />
    </g>
  );
}

function Chives({ pts }: { pts: [number, number][] }) {
  return (
    <g>
      {pts.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rand(i, 31) * 180})`}>
          <rect x={-4} y={-1.8} width={8} height={3.6} rx={1.8} fill="#4E9A3A" stroke={INK} strokeWidth={0.7} />
        </g>
      ))}
    </g>
  );
}

const Pasta = {
  plate: "porcelain" as PlateVariant,
  Sauce: () => {
    const id = useUid();
    return (
      <g>
        <defs>
          <RadialGradient id={id} cx={0.4} cy={0.35} r={0.8} stops={[[0, "#FFFFFF"], [0.55, "#F5E8CC"], [1, "#DCC69C"]]} />
        </defs>
        <path d="M122 214 C 118 156 196 128 262 146 C 318 162 310 246 262 270 C 216 292 126 274 122 214 Z" fill={`url(#${id})`} stroke={INK} strokeWidth={1.6} strokeOpacity={0.6} />
        <ellipse cx={176} cy={168} rx={38} ry={11} fill="#FFFFFF" opacity={0.6} transform="rotate(-18 176 168)" />
      </g>
    );
  },
  Main: () => {
    const spiral = spiralPath(206, 206, 4.3, 4, 74);
    return (
      <g>
        <ellipse cx={212} cy={216} rx={80} ry={72} fill={INK} opacity={0.12} />
        <path d={spiral} stroke={INK} strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={spiral} stroke="#E4B456" strokeWidth={11.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={spiral} stroke="#F7D98C" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(-1.2 -1.6)" />
        <path d={spiral} stroke="#FFF3CC" strokeWidth={1.6} fill="none" strokeLinecap="round" transform="translate(-2.4 -3)" opacity={0.8} />
        <path d="M150 236 C 180 250 230 250 268 222" stroke={INK} strokeWidth={14} fill="none" strokeLinecap="round" />
        <path d="M150 236 C 180 250 230 250 268 222" stroke="#EDC46A" strokeWidth={10.5} fill="none" strokeLinecap="round" />
        <path d="M150 236 C 180 250 230 250 268 222" stroke="#FFF0C0" strokeWidth={2} fill="none" strokeLinecap="round" transform="translate(-1 -3)" />
      </g>
    );
  },
  Garnish: () => (
    <g>
      {[
        [196, 190, 17, -20],
        [228, 204, 18, 25],
        [206, 228, 15, 60],
        [238, 172, 14, -45],
      ].map(([x, y, r, rot], i) => (
        <Pop key={i} i={i}>
          <TruffleShaving x={x} y={y} r={r} rot={rot} />
        </Pop>
      ))}
      <Pop i={5}>
        <ParmesanShaving x={250} y={228} rot={20} />
      </Pop>
      <Pop i={6}>
        <ParmesanShaving x={160} y={180} rot={-30} s={0.8} />
      </Pop>
    </g>
  ),
  Herbs: () => (
    <g>
      <Pop i={0} drop>
        <Chives pts={scatter(14, 208, 206, 70, 62, 41)} />
      </Pop>
      <Pop i={1} drop>
        <Leaf x={262} y={160} rot={-40} len={20} wid={9} />
      </Pop>
      <Pop i={2} drop>
        <Leaf x={146} y={240} rot={160} len={18} wid={8} />
      </Pop>
      <Pop i={3} drop>
        <Pepper pts={scatter(18, 206, 206, 70, 64, 42)} />
      </Pop>
    </g>
  ),
  Smudge: () => <Smudges c="#EEDDB8" pts={[[330, 110, 6], [80, 250, 5]]} />,
};

/* ------------------------------------------------------------------ */
/* 3. Zeebaars met beurre blanc                                        */
/* ------------------------------------------------------------------ */
function Spear({ x, y, rot = 0, len = 120 }: { x: number; y: number; rot?: number; len?: number }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <defs>
        <LinearGradient id={id} stops={[[0, "#A8D374"], [1, "#4E8434"]]} />
      </defs>
      <path d={`M0 -5 L ${len} -5 C ${len + 10} -8 ${len + 22} -3 ${len + 24} 0 C ${len + 22} 3 ${len + 10} 8 ${len} 5 L 0 5 Z`} fill={`url(#${id})`} {...outline} strokeWidth={1.8} />
      {[0.3, 0.55, 0.8].map((t) => (
        <path key={t} d={`M${len * t} -5 l 7 5 l -7 1`} stroke={INK} strokeWidth={0.9} fill="#6E9A4A" />
      ))}
      <path d={`M${len} -2 l 16 1`} stroke={INK} strokeWidth={0.8} opacity={0.5} />
      <path d={`M6 -2 L ${len - 10} -2`} stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
}

function Samphire({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {[
        "M0 0 L 0 -20 M 0 -10 L 8 -18 M 0 -14 L -7 -22",
        "M0 0 L 10 -14 M 6 -8 L 14 -8",
      ].map((d, i) => (
        <g key={i}>
          <path d={d} stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
          <path d={d} stroke="#6FA048" strokeWidth={3} strokeLinecap="round" fill="none" />
        </g>
      ))}
    </g>
  );
}

const Seabass = {
  plate: "porcelain" as PlateVariant,
  Sauce: () => {
    const id = useUid();
    return (
      <g>
        <defs>
          <RadialGradient id={id} cx={0.42} cy={0.38} r={0.75} stops={[[0, BUTTER[0]], [0.6, BUTTER[1]], [1, BUTTER[2]]]} />
        </defs>
        <path d="M116 196 C 118 144 190 122 252 136 C 320 152 322 238 264 264 C 206 290 114 254 116 196 Z" fill={`url(#${id})`} stroke={INK} strokeWidth={1.6} strokeOpacity={0.6} />
        <ellipse cx={168} cy={160} rx={34} ry={9} fill="#FFFFFF" opacity={0.6} transform="rotate(-20 168 160)" />
        {[
          [138, 214, 5],
          [156, 246, 3.5],
          [292, 228, 5.5],
          [278, 150, 4],
          [236, 270, 3.4],
          [300, 196, 3],
        ].map(([x, y, r], i) => (
          <Dot key={i} x={x} y={y} r={r} c={HERB_OIL} />
        ))}
      </g>
    );
  },
  Main: () => {
    const id = useUid();
    const fillet = "M108 222 C 136 170 250 148 306 166 C 326 172 328 192 310 200 C 256 232 148 250 108 222 Z";
    return (
      <g>
        <defs>
          <LinearGradient id={id} x2={0.3} y2={1} stops={[[0, "#F8D08C"], [0.45, "#D8984E"], [1, "#9A5A22"]]} />
        </defs>
        <path d={fillet} transform="translate(5 9)" fill={INK} opacity={0.16} />
        <path d={fillet} transform="translate(2 5)" fill="#FBF1EA" {...outline} />
        <path d={fillet} fill={`url(#${id})`} {...outline} />
        {[
          "M160 210 C 172 196 186 188 200 184",
          "M204 206 C 216 192 232 184 246 180",
          "M246 198 C 258 186 272 180 286 178",
        ].map((d, i) => (
          <path key={i} d={d} stroke="#7A3E12" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.75} />
        ))}
        {scatter(16, 214, 196, 80, 22, 51).map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={3} ry={1.6} fill="#8A4A1A" opacity={0.4} />
        ))}
        <path d="M130 212 C 170 180 250 164 300 172" stroke="#FFF1CC" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.85} />
      </g>
    );
  },
  Garnish: () => (
    <g>
      <Pop i={0}>
        <Spear x={150} y={262} rot={-12} len={120} />
      </Pop>
      <Pop i={1}>
        <Spear x={162} y={278} rot={-8} len={104} />
      </Pop>
      <Pop i={2}>
        <Samphire x={296} y={252} rot={10} />
      </Pop>
      <Pop i={3}>
        <Samphire x={128} y={172} rot={-30} />
      </Pop>
      <Pop i={4}>
        <Samphire x={274} y={132} rot={40} />
      </Pop>
    </g>
  ),
  Herbs: () => (
    <g>
      <Pop i={0} drop>
        <g stroke="#4F8A3A" strokeWidth={1.4} fill="none" strokeLinecap="round">
          <path d="M212 190 C 222 176 236 170 250 168" />
          <path d="M220 184 l -2 -8 M 228 178 l 0 -8 M 236 174 l 2 -8 M 222 182 l 7 3 M 232 176 l 7 3 M 242 171 l 7 3" />
        </g>
      </Pop>
      <Pop i={1} drop>
        <g stroke="#E8C22C" strokeWidth={2} fill="none" strokeLinecap="round">
          <path d="M184 196 q 4 -5 8 0" />
          <path d="M268 184 q 4 -5 8 0" />
          <path d="M150 208 q 3 -4 7 0" />
        </g>
      </Pop>
      <Pop i={2} drop>
        <Pepper pts={[[196, 180], [244, 172], [170, 202], [282, 176], [226, 190]]} color="#C9403A" />
      </Pop>
      <Pop i={3} drop>
        <Chives pts={[[140, 232], [250, 262], [296, 214]]} />
      </Pop>
    </g>
  ),
  Smudge: () => <Smudges c={BUTTER[2]} pts={[[330, 290, 6], [82, 140, 5]]} />,
};

/* ------------------------------------------------------------------ */
/* 4. Geroosterde groenten met kruidenolie                             */
/* ------------------------------------------------------------------ */
function RoastCarrot({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <LinearGradient id={id} x2={0} y2={1} stops={[[0, "#FFB462"], [0.5, "#EE7E22"], [1, "#B8520E"]]} />
      </defs>
      <path d="M-54 -2 C -56 -10 -48 -12 -40 -10" stroke="#5E8A3E" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d="M-50 -8 C -20 -10 30 -6 60 -1 C 62 0 62 1 60 1 C 30 6 -20 10 -50 8 C -55 4 -55 -4 -50 -8 Z" fill={`url(#${id})`} {...outline} />
      {[-30, -6, 20, 40].map((cx) => (
        <path key={cx} d={`M${cx} -7 l 8 12`} stroke="#5A2A0A" strokeWidth={2.4} strokeLinecap="round" opacity={0.6} />
      ))}
      <path d="M-44 -4 L 44 -2" stroke="#FFE2B8" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
    </g>
  );
}

function BeetWedge({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <defs>
        <RadialGradient id={id} cx={0.5} cy={0.1} r={1} stops={[[0, "#E0628E"], [0.6, "#A42A5C"], [1, "#5E0E34"]]} />
      </defs>
      <path d="M0 -24 L 22 14 Q 0 26 -22 14 Z" fill={`url(#${id})`} {...outline} strokeLinejoin="round" />
      <path d="M-14 10 Q 0 18 14 10 M -8 2 Q 0 7 8 2" stroke="#F2A6C2" strokeWidth={1.4} fill="none" opacity={0.8} />
    </g>
  );
}

function OnionPetal({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M-18 0 C -18 -16 18 -16 18 0 C 18 10 -18 10 -18 0 Z" fill="#9A3E6A" {...outline} strokeWidth={1.8} />
      <path d="M-13 0 C -13 -10 13 -10 13 0 C 13 6 -13 6 -13 0 Z" fill="#F4DCE8" stroke="#9A3E6A" strokeWidth={1} />
      <path d="M-8 -2 L 6 -4" stroke="#B8628A" strokeWidth={1} />
    </g>
  );
}

const Vegetables = {
  plate: "stoneware" as PlateVariant,
  Sauce: () => (
    <g>
      <Swoosh d="M112 254 C 136 172 236 128 306 176" w={48} c={LABNEH} />
      <path d="M130 244 C 156 180 232 146 290 180" stroke="#E2D8C8" strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M124 262 C 150 196 236 156 300 196" stroke="#E2D8C8" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    </g>
  ),
  Main: () => (
    <g>
      <RoastCarrot x={178} y={214} rot={-42} />
      <RoastCarrot x={222} y={190} rot={-24} s={0.95} />
      <RoastCarrot x={250} y={226} rot={-58} s={0.85} />
      <BeetWedge x={146} y={250} rot={-20} />
      <BeetWedge x={272} y={168} rot={30} />
      <BeetWedge x={300} y={220} rot={70} />
      <OnionPetal x={204} y={262} rot={10} />
      <OnionPetal x={232} y={150} rot={-30} />
    </g>
  ),
  Garnish: () => (
    <g>
      {[
        [118, 182, 5],
        [300, 280, 6],
        [322, 150, 4],
        [140, 292, 4],
        [188, 132, 3.5],
        [334, 200, 3],
      ].map(([x, y, r], i) => (
        <Pop key={i} i={i}>
          <Dot x={x} y={y} r={r} c={HERB_OIL} />
        </Pop>
      ))}
      <Pop i={6}>
        <g>
          {scatter(12, 214, 212, 60, 44, 61).map(([x, y], i) => (
            <path key={i} d={`M${x - 3} ${y - 2} L ${x + 3} ${y - 3} L ${x + 2} ${y + 3} Z`} fill="#9CC36B" stroke={INK} strokeWidth={0.7} />
          ))}
        </g>
      </Pop>
    </g>
  ),
  Herbs: () => (
    <g>
      {[
        [196, 176, -20],
        [240, 208, 30],
        [168, 238, -60],
        [262, 244, 50],
        [292, 192, 10],
        [210, 232, -10],
      ].map(([x, y, r], i) => (
        <Pop key={i} i={i} drop>
          <Micro x={x} y={y} rot={r} />
        </Pop>
      ))}
      <Pop i={6} drop>
        <Flakes pts={[[186, 200], [230, 180], [260, 214], [150, 226]]} />
      </Pop>
    </g>
  ),
  Smudge: () => <Smudges c={HERB_OIL[1]} pts={[[334, 300, 5], [66, 196, 5]]} />,
};

/* ------------------------------------------------------------------ */
/* 5. Chocolade-crémeux met vanille                                    */
/* ------------------------------------------------------------------ */
const Chocolate = {
  plate: "porcelain" as PlateVariant,
  Sauce: () => (
    <g>
      {Array.from({ length: 46 }).map((_, i) => {
        const t = i / 45;
        const x = 116 + t * 190 + (rand(i, 71) - 0.5) * 16;
        const y = 272 - t * 130 + (rand(i, 72) - 0.5) * 16 - sin(t * Math.PI) * 26;
        const s = 2.5 + rand(i, 73) * 4.5;
        return (
          <path
            key={i}
            d={`M${x - s} ${y} L ${x - s * 0.2} ${y - s} L ${x + s} ${y - s * 0.3} L ${x + s * 0.4} ${y + s * 0.8} Z`}
            fill={i % 3 === 0 ? "#6A4430" : "#3E2416"}
            stroke={INK}
            strokeWidth={0.8}
            strokeLinejoin="round"
          />
        );
      })}
      <Dot x={296} y={260} r={9} c={COULIS} />
      <Dot x={314} y={242} r={6} c={COULIS} />
      <Dot x={324} y={224} r={3.6} c={COULIS} />
    </g>
  ),
  Main: () => (
    <g>
      <Quenelle x={196} y={214} rot={-32} s={1.05} c={CHOC} ridge="#C99A7A" />
      <g transform="translate(222 184) rotate(-8)">
        <path d="M0 0 L 30 -52 L 44 -46 L 14 8 Z" fill="#2E1A10" {...outline} />
        <path d="M4 -4 L 32 -48" stroke="#A87A5A" strokeWidth={2} strokeLinecap="round" />
      </g>
    </g>
  ),
  Garnish: () => (
    <g>
      <Pop i={0}>
        <Quenelle x={264} y={250} rot={-30} s={0.55} c={VANILLA} seeds />
      </Pop>
      <Pop i={1}>
        <Berry x={144} y={176} r={11} kind="raspberry" />
      </Pop>
      <Pop i={2}>
        <Berry x={164} y={160} r={9} kind="raspberry" />
      </Pop>
      <Pop i={3}>
        <Berry x={138} y={252} r={10} kind="raspberry" />
      </Pop>
    </g>
  ),
  Herbs: () => (
    <g>
      <Pop i={0} drop>
        <Leaf x={250} y={232} rot={-60} len={18} wid={9} c="#5FA048" />
      </Pop>
      <Pop i={1} drop>
        <Leaf x={156} y={186} rot={30} len={16} wid={8} c="#5FA048" />
      </Pop>
      {[
        [194, 198],
        [212, 214],
        [178, 222],
      ].map(([x, y], i) => (
        <Pop key={i} i={2 + i} drop>
          <path d={`M${x - 5} ${y - 3} L ${x + 2} ${y - 6} L ${x + 6} ${y + 1} L ${x - 1} ${y + 5} Z`} fill="#E9C45A" stroke="#9A7420" strokeWidth={0.8} />
        </Pop>
      ))}
      <Pop i={5} drop>
        <path d="M110 214 C 116 190 130 172 150 162" stroke="#2A1A10" strokeWidth={4} fill="none" strokeLinecap="round" />
      </Pop>
      <Pop i={6} drop>
        <Pepper pts={scatter(16, 290, 170, 30, 24, 81)} color="#5A3522" />
      </Pop>
    </g>
  ),
  Smudge: () => <Smudges c={CHOC[1]} pts={[[334, 136, 5], [92, 300, 6]]} />,
};

/* ------------------------------------------------------------------ */
/* 6. Risotto met bospaddenstoelen                                     */
/* ------------------------------------------------------------------ */
function MushroomHalf({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) {
  const d = "M0 -22 C 18 -22 27 -9 25 2 C 23 9 14 9 9 9 L 7 22 C 7 26 -7 26 -7 22 L -9 9 C -14 9 -23 9 -25 2 C -27 -9 -18 -22 0 -22 Z";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d={d} fill="#F2E2C6" stroke={INK} strokeWidth={6.5} strokeLinejoin="round" />
      <path d={d} fill="#F2E2C6" stroke="#8A5A38" strokeWidth={4} strokeLinejoin="round" />
      <path d="M-18 4 C -10 -2 10 -2 18 4" stroke="#B89A72" strokeWidth={1.4} fill="none" />
      <path d="M-12 -8 C -4 -14 6 -14 12 -8" stroke="#C98A4E" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.55} />
      <path d="M-3 10 L -2 20" stroke="#D9C4A2" strokeWidth={1.4} />
    </g>
  );
}

const Risotto = {
  plate: "bowl-stone" as PlateVariant,
  Sauce: () => {
    const id = useUid();
    return (
      <g>
        <defs>
          <RadialGradient id={id} cx={0.42} cy={0.38} r={0.75} stops={[[0, "#FFF8E4"], [0.6, "#F0DEAE"], [1, "#D2B77C"]]} />
        </defs>
        <path d="M104 214 C 98 146 168 110 230 118 C 302 126 324 196 304 244 C 284 296 204 310 152 290 C 118 276 106 248 104 214 Z" fill={`url(#${id})`} stroke={INK} strokeWidth={1.8} strokeOpacity={0.7} />
        {scatter(110, 206, 210, 88, 80, 91).map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={4.4} ry={2.4} fill="#FFFAEB" stroke="#C4A870" strokeWidth={0.7} transform={`rotate(${rand(i, 92) * 180} ${x} ${y})`} />
        ))}
      </g>
    );
  },
  Main: () => (
    <g>
      <MushroomHalf x={186} y={196} rot={-20} />
      <MushroomHalf x={228} y={184} rot={25} s={0.9} />
      <MushroomHalf x={214} y={226} rot={160} s={0.95} />
      <MushroomHalf x={170} y={236} rot={-110} s={0.8} />
      <MushroomHalf x={252} y={216} rot={70} s={0.8} />
    </g>
  ),
  Garnish: () => (
    <g>
      <Pop i={0}>
        <ParmesanShaving x={150} y={180} rot={-10} s={1.1} />
      </Pop>
      <Pop i={1}>
        <ParmesanShaving x={276} y={250} rot={40} />
      </Pop>
      <Pop i={2}>
        <ParmesanShaving x={226} y={266} rot={-50} s={0.9} />
      </Pop>
      {[
        [140, 220, 4],
        [270, 180, 3.5],
        [196, 164, 3],
        [292, 226, 3],
      ].map(([x, y, r], i) => (
        <Pop key={i} i={3 + i}>
          <Dot x={x} y={y} r={r} c={BROWN_BUTTER} />
        </Pop>
      ))}
    </g>
  ),
  Herbs: () => (
    <g>
      <Pop i={0} drop>
        <g>
          {scatter(22, 206, 208, 80, 70, 101).map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx={3} ry={1.8} fill="#6E8F4A" stroke={INK} strokeWidth={0.6} transform={`rotate(${rand(i, 102) * 180} ${x} ${y})`} />
          ))}
        </g>
      </Pop>
      <Pop i={1} drop>
        <Pepper pts={scatter(20, 206, 208, 80, 70, 103)} />
      </Pop>
    </g>
  ),
  Smudge: () => <Smudges c="#E7D2A0" pts={[[332, 118, 6], [74, 262, 5]]} />,
};

/* ------------------------------------------------------------------ */
/* 7. Eendenborst met kersen                                           */
/* ------------------------------------------------------------------ */
function CherryHalf({ x, y, r = 10, rot = 0 }: { x: number; y: number; r?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <circle r={r} fill="#7A1628" stroke={INK} strokeWidth={1.4} />
      <circle r={r * 0.78} fill="#C2344A" />
      <ellipse cx={0} cy={0} rx={r * 0.32} ry={r * 0.42} fill="#E88A96" stroke="#7A1628" strokeWidth={0.8} />
      <path d={`M${-r * 0.6} ${-r * 0.3} q ${r * 0.3} ${-r * 0.4} ${r * 0.6} ${-r * 0.4}`} stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={1.2} fill="none" />
    </g>
  );
}

function ParsnipCrisp({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M-18 6 C -14 -12 4 -16 10 -6 C 16 4 2 12 -4 4 C -8 -2 0 -8 4 -4" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M-18 6 C -14 -12 4 -16 10 -6 C 16 4 2 12 -4 4 C -8 -2 0 -8 4 -4" stroke="#EBD3A0" strokeWidth={4.5} fill="none" strokeLinecap="round" />
      <path d="M-16 2 C -12 -10 2 -12 8 -6" stroke="#C49A5A" strokeWidth={1.2} fill="none" />
    </g>
  );
}

function Chervil({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0 L 0 -18 M 0 -8 L -9 -16 M 0 -8 L 9 -16" stroke="#5E9A3E" strokeWidth={1.2} fill="none" />
      {[
        [0, -22],
        [-11, -19],
        [11, -19],
      ].map(([cx, cy], i) => (
        <path key={i} d={`M${cx} ${cy + 3} c -6 -1 -7 -7 -3 -9 c 0 -4 5 -5 6 -1 c 5 -1 6 5 2 7 c 1 3 -3 4 -5 3 Z`} fill="#78B04E" stroke={INK} strokeWidth={0.9} />
      ))}
    </g>
  );
}

const Duck = {
  plate: "slate" as PlateVariant,
  Sauce: () => (
    <g>
      <Swoosh d="M112 252 C 148 180 240 150 302 168" w={36} c={PARSNIP} />
      <Dot x={140} y={288} r={9} c={JUS} />
      <Dot x={170} y={302} r={6} c={JUS} />
      <Dot x={196} y={309} r={3.8} c={JUS} />
      <Dot x={318} y={200} r={5} c={JUS} />
    </g>
  ),
  Main: () => <MeatSlices x0={152} y0={232} dx={25} dy={-14} count={5} rot={-30} fat />,
  Garnish: () => (
    <g>
      <Pop i={0}>
        <Berry x={290} y={250} r={12} kind="cherry" />
      </Pop>
      <Pop i={1}>
        <Berry x={118} y={200} r={11} kind="cherry" />
      </Pop>
      <Pop i={2}>
        <CherryHalf x={306} y={226} r={10} />
      </Pop>
      <Pop i={3}>
        <CherryHalf x={250} y={272} r={9} rot={40} />
      </Pop>
      <Pop i={4}>
        <CherryHalf x={144} y={236} r={9} rot={-20} />
      </Pop>
      <Pop i={5}>
        <ParsnipCrisp x={236} y={156} rot={10} />
      </Pop>
      <Pop i={6}>
        <ParsnipCrisp x={206} y={168} rot={-40} />
      </Pop>
    </g>
  ),
  Herbs: () => (
    <g>
      <Pop i={0} drop>
        <Chervil x={276} y={206} rot={20} />
      </Pop>
      <Pop i={1} drop>
        <Chervil x={176} y={272} rot={-30} s={0.9} />
      </Pop>
      <Pop i={2} drop>
        <Chervil x={132} y={170} rot={-10} s={0.8} />
      </Pop>
      <Pop i={3} drop>
        <Flakes pts={[[172, 220], [198, 206], [224, 192], [248, 180]]} />
      </Pop>
    </g>
  ),
  Smudge: () => <Smudges c={JUS[1]} pts={[[336, 116, 5], [78, 288, 6]]} />,
};

/* ------------------------------------------------------------------ */
/* 8. Coquilles met bloemkoolcrème                                     */
/* ------------------------------------------------------------------ */
function ScallopTop({ x, y, r = 27 }: { x: number; y: number; r?: number }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <RadialGradient id={id} cx={0.45} cy={0.42} r={0.62} stops={[[0, "#F7CF86"], [0.55, "#D8964A"], [1, "#94561E"]]} />
      </defs>
      <circle r={r + 1} fill={INK} opacity={0.25} transform="translate(3 5)" />
      <circle r={r} fill="#F6ECDD" {...outline} />
      <circle r={r * 0.8} fill={`url(#${id})`} stroke="#7A4418" strokeWidth={1.2} />
      <circle r={r * 0.5} fill="none" stroke="#B8702F" strokeWidth={1} opacity={0.5} />
      <ellipse cx={-r * 0.3} cy={-r * 0.32} rx={r * 0.26} ry={r * 0.14} fill="#FFFFFF" opacity={0.55} />
    </g>
  );
}

function Hazelnut({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M-7 3 C -8 -6 0 -9 7 -5 C 9 2 4 7 -1 7 Z" fill="#A8703C" stroke={INK} strokeWidth={1} />
      <path d="M-4 2 C -4 -3 1 -5 4 -3 C 5 1 2 4 -1 4 Z" fill="#E9C99A" />
    </g>
  );
}

const ScallopsDish = {
  plate: "slate" as PlateVariant,
  Sauce: () => (
    <g>
      <Swoosh d="M128 232 C 170 218 232 216 290 192" w={32} c={CAULI} />
      <Dot x={146} y={166} r={9} c={CAULI} />
      <Dot x={128} y={186} r={6} c={CAULI} />
      <Dot x={120} y={206} r={3.8} c={CAULI} />
    </g>
  ),
  Main: () => (
    <g>
      <ScallopTop x={160} y={226} />
      <ScallopTop x={214} y={214} />
      <ScallopTop x={268} y={196} />
    </g>
  ),
  Garnish: () => (
    <g>
      {[
        [188, 250, 5],
        [242, 238, 4.4],
        [292, 222, 3.8],
        [134, 254, 3.4],
        [306, 176, 3],
      ].map(([x, y, r], i) => (
        <Pop key={i} i={i}>
          <Dot x={x} y={y} r={r} c={BROWN_BUTTER} />
        </Pop>
      ))}
      {[
        [178, 196, 10],
        [240, 186, -40],
        [140, 214, 60],
        [290, 244, 20],
        [226, 250, 80],
      ].map(([x, y, r], i) => (
        <Pop key={`h${i}`} i={5 + i}>
          <Hazelnut x={x} y={y} rot={r} />
        </Pop>
      ))}
      <Pop i={10}>
        <g>
          {scatter(9, 250, 262, 30, 12, 111).map(([x, y], i) => (
            <rect key={i} x={x - 3} y={y - 3} width={6} height={6} rx={1} fill="#D9EBA8" stroke={INK} strokeWidth={0.7} />
          ))}
        </g>
      </Pop>
    </g>
  ),
  Herbs: () => (
    <g>
      {[
        [164, 212, 0, "#8A5A8A"],
        [214, 200, 40, "#6FA048"],
        [268, 182, -30, "#8A5A8A"],
        [300, 206, 60, "#6FA048"],
      ].map(([x, y, r, c], i) => (
        <Pop key={i} i={i} drop>
          <Micro x={x as number} y={y as number} rot={r as number} c={c as string} />
        </Pop>
      ))}
      <Pop i={4} drop>
        <g stroke="#E8C22C" strokeWidth={1.8} fill="none" strokeLinecap="round">
          <path d="M196 236 q 3 -4 7 0" />
          <path d="M250 224 q 3 -4 7 0" />
        </g>
      </Pop>
    </g>
  ),
  Smudge: () => <Smudges c={CAULI[1]} pts={[[330, 290, 6], [84, 128, 5]]} />,
};

/* ------------------------------------------------------------------ */
/* 9. Burrata met tomaat                                               */
/* ------------------------------------------------------------------ */
function TomatoHalf({ x, y, r = 16, yellow = false, rot = 0 }: { x: number; y: number; r?: number; yellow?: boolean; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <circle r={r} fill={yellow ? "#E9A81C" : "#C82A1E"} stroke={INK} strokeWidth={1.4} />
      <circle r={r * 0.82} fill={yellow ? "#FFD25A" : "#F2604A"} />
      {[0, 120, 240].map((a) => (
        <ellipse key={a} cx={cos((a * Math.PI) / 180) * r * 0.42} cy={sin((a * Math.PI) / 180) * r * 0.42} rx={r * 0.26} ry={r * 0.18} fill={yellow ? "#FFF0A8" : "#F9C66A"} stroke={yellow ? "#C9901A" : "#B83A22"} strokeWidth={0.7} transform={`rotate(${a} ${cos((a * Math.PI) / 180) * r * 0.42} ${sin((a * Math.PI) / 180) * r * 0.42})`} />
      ))}
      <circle r={r * 0.14} fill={yellow ? "#F7C23A" : "#E24A34"} />
      <path d={`M${-r * 0.7} ${-r * 0.35} q ${r * 0.3} ${-r * 0.45} ${r * 0.7} ${-r * 0.5}`} stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={1.4} fill="none" />
    </g>
  );
}

const BurrataDish = {
  plate: "stoneware" as PlateVariant,
  Sauce: () => (
    <g>
      {[
        [140, 210, 16, 10, -20],
        [260, 150, 14, 8, 30],
        [284, 262, 18, 10, 20],
        [168, 290, 12, 7, -10],
        [312, 206, 9, 6, 60],
      ].map(([x, y, rx, ry, rot], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
          <ellipse rx={rx} ry={ry} fill="#6FA848" fillOpacity={0.85} stroke="#2F5A1C" strokeWidth={1.2} />
          <ellipse cx={-rx * 0.3} cy={-ry * 0.3} rx={rx * 0.35} ry={ry * 0.25} fill="#D6F0A8" opacity={0.7} />
        </g>
      ))}
      <Dot x={236} y={300} r={4.5} c={BALSAMIC} />
      <Dot x={118} y={250} r={3.5} c={BALSAMIC} />
      <Dot x={300} y={120} r={3} c={BALSAMIC} />
    </g>
  ),
  Main: () => {
    const id = useUid();
    return (
      <g>
        <defs>
          <RadialGradient id={`${id}b`} cx={0.38} cy={0.32} r={0.8} stops={[[0, "#FFFFFF"], [0.7, "#F4EEE3"], [1, "#D5C9B4"]]} />
          <RadialGradient id={`${id}s`} cx={0.5} cy={0.5} r={0.6} stops={[[0, "#FFF6DC"], [1, "#EAD6A8"]]} />
        </defs>
        <circle cx={206} cy={210} r={62} fill={INK} opacity={0.14} transform="translate(4 7)" />
        <circle cx={206} cy={206} r={62} fill={`url(#${id}b)`} {...outline} />
        <path d="M178 196 C 184 172 214 166 230 180 C 244 192 240 222 222 232 C 202 244 172 228 178 196 Z" fill={`url(#${id}s)`} stroke={INK} strokeWidth={1.6} />
        {scatter(14, 208, 204, 22, 22, 121).map(([x, y], i) => (
          <path key={i} d={`M${x - 5} ${y} q 5 -4 10 0`} stroke="#D8C08C" strokeWidth={1.1} fill="none" />
        ))}
        <path d="M160 176 C 170 156 196 148 214 150" stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M178 196 C 170 190 164 194 160 202 M 230 180 C 240 174 248 178 252 186" stroke={INK} strokeWidth={1} opacity={0.4} fill="none" />
      </g>
    );
  },
  Garnish: () => (
    <g>
      {[
        [124, 172, 16, false, 0],
        [148, 150, 13, true, 40],
        [284, 170, 16, false, -20],
        [296, 236, 14, true, 70],
        [262, 280, 16, false, 10],
        [150, 266, 15, true, -40],
        [120, 230, 12, false, 90],
        [212, 296, 12, false, 30],
      ].map(([x, y, r, yellow, rot], i) => (
        <Pop key={i} i={i}>
          <TomatoHalf x={x as number} y={y as number} r={r as number} yellow={yellow as boolean} rot={rot as number} />
        </Pop>
      ))}
    </g>
  ),
  Herbs: () => (
    <g>
      {[
        [238, 158, -30, 26],
        [168, 240, 150, 22],
        [252, 238, 40, 20],
        [150, 184, -120, 18],
      ].map(([x, y, rot, len], i) => (
        <Pop key={i} i={i} drop>
          <Leaf x={x} y={y} rot={rot} len={len} wid={len * 0.5} c="#4F9336" />
        </Pop>
      ))}
      <Pop i={4} drop>
        <Flakes pts={[[196, 190], [214, 208], [206, 222], [226, 196]]} />
      </Pop>
      <Pop i={5} drop>
        <Pepper pts={scatter(14, 206, 206, 30, 30, 131)} />
      </Pop>
    </g>
  ),
  Smudge: () => <Smudges c="#6FA848" pts={[[340, 180, 5], [86, 300, 5]]} />,
};

/* ------------------------------------------------------------------ */
/* 10. Citroentarte met meringue                                       */
/* ------------------------------------------------------------------ */
function MeringueKiss({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <RadialGradient id={id} cx={0.5} cy={0.5} r={0.6} stops={[[0, "#9A5A22"], [0.35, "#D9A05A"], [0.7, "#FFF6E6"], [1, "#FFFFFF"]]} />
      </defs>
      <circle r={r + 1} fill={INK} opacity={0.15} transform="translate(2 4)" />
      <circle r={r} fill={`url(#${id})`} stroke={INK} strokeWidth={1.3} />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <path key={i} d={`M${cos(a) * r * 0.25} ${sin(a) * r * 0.25} L ${cos(a + 0.4) * r * 0.9} ${sin(a + 0.4) * r * 0.9}`} stroke={INK} strokeWidth={0.8} opacity={0.4} />;
      })}
    </g>
  );
}

const LemonTart = {
  plate: "porcelain" as PlateVariant,
  Sauce: () => (
    <g>
      <Swoosh d="M116 282 C 170 250 250 262 304 232" w={13} c={LEMON} />
      <Dot x={318} y={222} r={5} c={LEMON} />
      <Dot x={328} y={210} r={3.2} c={LEMON} />
    </g>
  ),
  Main: () => {
    const id = useUid();
    const scallop = Array.from({ length: 28 })
      .map((_, i) => {
        const a = (i / 28) * Math.PI * 2;
        const a2 = ((i + 0.5) / 28) * Math.PI * 2;
        return `${i === 0 ? "M" : "L"}${190 + cos(a) * 78} ${200 + sin(a) * 78} Q ${190 + cos(a2) * 84} ${200 + sin(a2) * 84} ${190 + cos(((i + 1) / 28) * Math.PI * 2) * 78} ${200 + sin(((i + 1) / 28) * Math.PI * 2) * 78}`;
      })
      .join(" ");
    return (
      <g>
        <defs>
          <RadialGradient id={`${id}p`} cx={0.4} cy={0.35} r={0.75} stops={[[0, "#F2C27A"], [0.7, "#D9954A"], [1, "#A2621E"]]} />
          <RadialGradient id={`${id}c`} cx={0.4} cy={0.35} r={0.75} stops={[[0, "#FFF6A0"], [0.6, "#F7D445"], [1, "#DAAA16"]]} />
        </defs>
        <circle cx={196} cy={208} r={84} fill={INK} opacity={0.15} />
        <path d={`${scallop} Z`} fill={`url(#${id}p)`} {...outline} />
        <circle cx={190} cy={200} r={64} fill={`url(#${id}c)`} stroke={INK} strokeWidth={1.6} />
        <ellipse cx={170} cy={176} rx={26} ry={10} fill="#FFFFFF" opacity={0.55} transform="rotate(-30 170 176)" />
      </g>
    );
  },
  Garnish: () => (
    <g>
      {[
        [212, 218, 13],
        [236, 200, 11],
        [226, 240, 10],
        [196, 238, 9],
        [248, 226, 8],
      ].map(([x, y, r], i) => (
        <Pop key={i} i={i}>
          <MeringueKiss x={x} y={y} r={r} />
        </Pop>
      ))}
      <Pop i={5}>
        <Berry x={292} y={262} r={11} kind="raspberry" />
      </Pop>
      <Pop i={6}>
        <Berry x={278} y={284} r={9} kind="raspberry" />
      </Pop>
    </g>
  ),
  Herbs: () => (
    <g>
      <Pop i={0} drop>
        <g stroke="#E8C22C" strokeWidth={2.2} fill="none" strokeLinecap="round">
          <path d="M150 172 q 5 -6 10 0" />
          <path d="M168 150 q 5 -6 10 0" />
          <path d="M140 196 q 4 -5 9 0" />
        </g>
      </Pop>
      <Pop i={1} drop>
        <Leaf x={238} y={184} rot={-50} len={14} wid={7} c="#6FB04E" />
      </Pop>
      <Pop i={2} drop>
        <Leaf x={206} y={252} rot={120} len={12} wid={6} c="#6FB04E" />
      </Pop>
      {[
        [270, 172],
        [148, 250],
      ].map(([x, y], i) => (
        <Pop key={i} i={3 + i} drop>
          <g transform={`translate(${x} ${y})`}>
            {Array.from({ length: 5 }).map((_, k) => (
              <ellipse key={k} cx={cos((k / 5) * Math.PI * 2) * 4} cy={sin((k / 5) * Math.PI * 2) * 4} rx={4} ry={2.6} fill="#A78BD0" stroke={INK} strokeWidth={0.7} transform={`rotate(${(k / 5) * 360} ${cos((k / 5) * Math.PI * 2) * 4} ${sin((k / 5) * Math.PI * 2) * 4})`} />
            ))}
            <circle r={1.8} fill="#F7D445" />
          </g>
        </Pop>
      ))}
    </g>
  ),
  Smudge: () => <Smudges c={LEMON[1]} pts={[[334, 128, 5], [70, 230, 5]]} />,
};

/* ------------------------------------------------------------------ */
/* 11. Pompoensoep met salie                                           */
/* ------------------------------------------------------------------ */
function SageLeaf({ x, y, rot = 0, s = 1 }: { x: number; y: number; rot?: number; s?: number }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <LinearGradient id={id} x2={1} y2={1} stops={[[0, "#8FA27A"], [1, "#4E6040"]]} />
      </defs>
      <path d="M0 0 C 8 -12 34 -14 46 0 C 34 12 8 12 0 0 Z" fill={`url(#${id})`} {...outline} strokeWidth={1.6} />
      <path d="M0 0 L -10 1" stroke="#6A5A3A" strokeWidth={1.6} strokeLinecap="round" />
      <path d="M2 0 L 42 0 M 12 0 l 6 -6 M 22 0 l 6 -6 M 32 0 l 5 -4 M 12 0 l 6 6 M 22 0 l 6 6 M 32 0 l 5 4" stroke="#3A4A2E" strokeWidth={0.8} fill="none" opacity={0.7} />
      {scatter(10, 22, 0, 18, 6, 141).map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={0.8} fill="#DDE6CF" opacity={0.7} />
      ))}
    </g>
  );
}

const Soup = {
  plate: "bowl" as PlateVariant,
  Sauce: () => {
    const id = useUid();
    return (
      <g>
        <defs>
          <RadialGradient id={id} cx={0.42} cy={0.38} r={0.72} stops={[[0, "#FFC474"], [0.6, "#EE8A32"], [1, "#B8561A"]]} />
        </defs>
        <circle cx={200} cy={200} r={122} fill={`url(#${id})`} stroke={INK} strokeWidth={1.4} strokeOpacity={0.6} />
        <path d="M110 160 A 100 100 0 0 1 172 100" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={8} fill="none" strokeLinecap="round" />
      </g>
    );
  },
  Main: () => {
    const sp = spiralPath(222, 190, 2.6, 4, 40, 0.9);
    return (
      <g>
        <path d={sp} stroke="#C9661E" strokeWidth={11} fill="none" strokeLinecap="round" opacity={0.5} transform="translate(2 3)" />
        <path d={sp} stroke="#FFF8EA" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M262 190 C 270 214 262 240 236 256" stroke="#FFF8EA" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d={sp} stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" transform="translate(-1 -2)" />
      </g>
    );
  },
  Garnish: () => (
    <g>
      {Array.from({ length: 8 }).map((_, i) => {
        const x = 150 + rand(i, 151) * 40;
        const y = 220 + rand(i, 152) * 40;
        return (
          <Pop key={i} i={i}>
            <g transform={`translate(${x} ${y}) rotate(${rand(i, 153) * 180})`}>
              <path d="M0 -8 C 6 -6 7 4 0 8 C -7 4 -6 -6 0 -8 Z" fill="#8FA05A" stroke={INK} strokeWidth={1} />
              <path d="M0 -5 C 3 -3 3 3 0 5" stroke="#C8D49A" strokeWidth={1} fill="none" />
            </g>
          </Pop>
        );
      })}
      {[
        [196, 160, 4],
        [270, 238, 5],
        [140, 190, 3.4],
        [246, 140, 3],
      ].map(([x, y, r], i) => (
        <Pop key={`o${i}`} i={8 + i}>
          <Dot x={x} y={y} r={r} c={["#6E8A3A", "#2F4A1C", "#16240C"]} />
        </Pop>
      ))}
    </g>
  ),
  Herbs: () => (
    <g>
      <Pop i={0} drop>
        <SageLeaf x={200} y={170} rot={-20} />
      </Pop>
      <Pop i={1} drop>
        <SageLeaf x={236} y={214} rot={40} s={0.85} />
      </Pop>
      <Pop i={2} drop>
        <SageLeaf x={196} y={218} rot={170} s={0.75} />
      </Pop>
      <Pop i={3} drop>
        <Pepper pts={scatter(16, 214, 200, 60, 50, 161)} />
      </Pop>
    </g>
  ),
  Smudge: () => <Smudges c="#EE8A32" pts={[[340, 150, 5], [80, 270, 6]]} />,
};

/* ------------------------------------------------------------------ */
/* 12. Zalm tataki                                                     */
/* ------------------------------------------------------------------ */
function SalmonSlice({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  const id = useUid();
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <defs>
        <LinearGradient id={id} x2={1} y2={1} stops={[[0, "#FFB088"], [0.5, "#F57A4A"], [1, "#D9582E"]]} />
      </defs>
      <rect x={-17} y={-32} width={34} height={64} rx={7} fill={INK} opacity={0.2} transform="translate(3 5)" />
      <rect x={-17} y={-32} width={34} height={64} rx={7} fill="#A8683E" {...outline} />
      <rect x={-12} y={-27} width={24} height={54} rx={4} fill={`url(#${id})`} />
      {[-16, -2, 12].map((sy) => (
        <path key={sy} d={`M-12 ${sy} C -4 ${sy - 6} 4 ${sy + 4} 12 ${sy - 4}`} stroke="#FFE3D2" strokeWidth={2} fill="none" />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <ellipse key={i} cx={i % 2 ? 14 : -14} cy={-26 + i * 5.6} rx={2} ry={1} fill={i % 3 === 0 ? "#1F1B19" : "#FFF6E2"} stroke={INK} strokeWidth={0.4} />
      ))}
    </g>
  );
}

const SalmonDish = {
  plate: "slate" as PlateVariant,
  Sauce: () => (
    <g>
      <Swoosh d="M122 272 C 170 262 240 250 300 214" w={9} c={SOY} />
      {[
        [312, 204, 6],
        [322, 190, 4],
        [140, 180, 5],
        [128, 196, 3.4],
      ].map(([x, y, r], i) => (
        <Dot key={i} x={x} y={y} r={r} c={SOY} />
      ))}
    </g>
  ),
  Main: () => (
    <g>
      {[0, 1, 2, 3, 4].map((i) => (
        <SalmonSlice key={i} x={146 + i * 28} y={236 - i * 14} rot={24} />
      ))}
    </g>
  ),
  Garnish: () => (
    <g>
      {[
        [284, 250],
        [306, 222],
      ].map(([x, y], i) => (
        <Pop key={i} i={i}>
          <g transform={`translate(${x} ${y})`}>
            <path d="M-14 0 C -14 -14 14 -14 14 0 C 14 10 -6 12 -6 2 C -6 -6 6 -6 6 0" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />
            <path d="M-14 0 C -14 -14 14 -14 14 0 C 14 10 -6 12 -6 2 C -6 -6 6 -6 6 0" stroke="#D9EBB8" strokeWidth={5.5} fill="none" strokeLinecap="round" />
            <path d="M-14 0 C -14 -14 14 -14 14 0" stroke="#4E7A30" strokeWidth={1.4} fill="none" transform="translate(0 -3)" />
          </g>
        </Pop>
      ))}
      {[
        [134, 206, 11],
        [118, 230, 9],
        [250, 158, 10],
      ].map(([x, y, r], i) => (
        <Pop key={`r${i}`} i={2 + i}>
          <g>
            <circle cx={x} cy={y} r={r} fill="#FFFFFF" stroke="#D83A6A" strokeWidth={2.4} />
            <circle cx={x} cy={y} r={r} fill="none" stroke={INK} strokeWidth={0.8} />
            <path d={`M${x - r * 0.5} ${y} q ${r * 0.5} ${-r * 0.4} ${r} 0`} stroke="#F3C6D6" strokeWidth={1} fill="none" />
          </g>
        </Pop>
      ))}
    </g>
  ),
  Herbs: () => (
    <g>
      <Pop i={0} drop>
        <g>
          {scatter(8, 206, 214, 70, 40, 171).map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={3.6} fill="#8AC05A" stroke={INK} strokeWidth={0.8} />
              <circle cx={x} cy={y} r={1.6} fill="#E4F2C8" />
            </g>
          ))}
        </g>
      </Pop>
      <Pop i={1} drop>
        <g>
          {scatter(18, 206, 214, 76, 44, 172).map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx={1.8} ry={1} fill={i % 3 ? "#FFF6E2" : "#1F1B19"} stroke={INK} strokeWidth={0.3} transform={`rotate(${rand(i, 173) * 180} ${x} ${y})`} />
          ))}
        </g>
      </Pop>
      <Pop i={2} drop>
        <g stroke="#D8322A" strokeWidth={1.1} fill="none" strokeLinecap="round">
          <path d="M196 190 q 6 -4 12 2 t 12 0" />
          <path d="M232 220 q 6 -4 12 2 t 10 -2" />
        </g>
      </Pop>
      <Pop i={3} drop>
        <Leaf x={270} y={190} rot={-20} len={16} wid={10} c="#4F9336" />
      </Pop>
    </g>
  ),
  Smudge: () => <Smudges c={SOY[1]} pts={[[332, 116, 4], [84, 272, 5]]} />,
};

/* ------------------------------------------------------------------ */
/* Register                                                            */
/* ------------------------------------------------------------------ */
type DishArt = { plate: PlateVariant; Sauce: () => ReactNode; Main: () => ReactNode; Garnish: () => ReactNode; Herbs: () => ReactNode; Smudge: () => ReactNode };

const DISHES: Record<DishKey, DishArt> = {
  steak: Steak,
  pasta: Pasta,
  seabass: Seabass,
  vegetables: Vegetables,
  chocolate: Chocolate,
  risotto: Risotto,
  duck: Duck,
  scallops: ScallopsDish,
  burrata: BurrataDish,
  "lemon-tart": LemonTart,
  soup: Soup,
  salmon: SalmonDish,
};

function RimShine() {
  return (
    <g>
      <Sparkle x={66} y={126} size={9} />
      <Sparkle x={338} y={112} size={7} delay={0.5} />
      <Sparkle x={330} y={300} size={8} delay={1} />
      <Sparkle x={78} y={292} size={6} delay={1.5} />
    </g>
  );
}

function Cloth() {
  return (
    <motion.g initial={{ opacity: 0, rotate: -60 }} animate={{ opacity: [0, 1, 1, 0], rotate: [-60, 0, 60, 90] }} transition={{ duration: 1.4, ease: "easeInOut" }} style={{ transformOrigin: "200px 200px" }}>
      <path d="M358 150 C 376 160 384 184 380 204 L 352 196 C 354 182 350 168 342 160 Z" fill="#FFFFFF" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M350 170 L 370 176 M 352 184 L 374 190" stroke={INK} strokeWidth={0.8} opacity={0.4} />
    </motion.g>
  );
}

export type DishMode = "static" | "assemble" | "loop";

export function DishIllustration({
  dish,
  stage: stageProp,
  mode = "static",
  animated: animatedProp,
  active = true,
  showSmudges = true,
  className,
  title,
}: {
  dish: DishKey;
  stage?: number;
  mode?: DishMode;
  animated?: boolean;
  active?: boolean;
  showSmudges?: boolean;
  className?: string;
  title?: string;
}) {
  const art = DISHES[dish] ?? Steak;
  const [auto, setAuto] = useState(mode === "static" ? 5 : 0);

  useEffect(() => {
    if (mode === "static") return;
    if (!active) {
      if (mode === "loop") setAuto(5);
      return;
    }
    let tick = 0;
    setAuto(0);
    const timer = window.setInterval(() => {
      tick += 1;
      if (tick <= 5) setAuto(tick);
      else if (mode === "loop" && tick >= 9) {
        tick = 0;
        setAuto(0);
      } else if (mode === "assemble") window.clearInterval(timer);
    }, 900);
    return () => window.clearInterval(timer);
  }, [mode, active]);

  const stage = stageProp ?? auto;
  const animated = animatedProp ?? (mode !== "static" || stageProp !== undefined);
  const { Sauce, Main, Garnish, Herbs, Smudge } = art;

  return (
    <svg viewBox="0 0 400 400" className={`ill ${className ?? ""}`} data-active={active ? "true" : "false"} role="img" aria-label={title ?? "Opgemaakt bord"} xmlns="http://www.w3.org/2000/svg">
      <Plate variant={art.plate} />
      <Layer show={stage >= 1} kind="sauce" animated={animated}>
        <Sauce />
      </Layer>
      <Layer show={stage >= 2} kind="main" animated={animated}>
        <Main />
      </Layer>
      <Layer show={stage >= 3} kind="garnish" animated={animated}>
        <Garnish />
      </Layer>
      <Layer show={stage >= 4} kind="herbs" animated={animated}>
        <Herbs />
      </Layer>
      {showSmudges && (
        <Layer show={stage >= 1 && stage < 5} kind="smudge" animated={animated}>
          <Smudge />
        </Layer>
      )}
      {animated && stage >= 5 && (
        <g key="shine">
          <Cloth />
          <RimShine />
        </g>
      )}
    </svg>
  );
}
