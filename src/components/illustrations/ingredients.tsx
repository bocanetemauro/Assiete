"use client";

/**
 * Ingrediënten in 3/4-aanzicht voor de techniek-scènes.
 * Oorsprong (0,0) = midden van het contactvlak met de ondergrond.
 */

import { INK, LinearGradient, RadialGradient, cos, hairline, outline, sin, useUid } from "./kit";

type Place = { x?: number; y?: number; s?: number; r?: number };
const place = ({ x = 0, y = 0, s = 1, r = 0 }: Place) => `translate(${x} ${y}) rotate(${r}) scale(${s})`;

/* ------------------------------------------------------------------ */
/* Vlees & vis                                                         */
/* ------------------------------------------------------------------ */
const STEAK = "M-74 -34 C -72 -64 -24 -74 22 -69 C 66 -64 86 -44 78 -22 C 72 -4 30 2 -12 0 C -52 -2 -76 -8 -74 -34 Z";

export function Steak({ state = "raw", ...p }: Place & { state?: "raw" | "seared" }) {
  const id = useUid();
  const seared = state === "seared";
  return (
    <g transform={place(p)}>
      <defs>
        <RadialGradient
          id={`${id}t`}
          cx={0.42}
          cy={0.4}
          r={0.72}
          stops={seared ? [[0, "#B36A3E"], [0.55, "#7C381D"], [1, "#4A1C0C"]] : [[0, "#EF8385"], [0.6, "#CC434D"], [1, "#9C2932"]]}
        />
        <LinearGradient id={`${id}s`} stops={seared ? [[0, "#7A3419"], [1, "#3C1609"]] : [[0, "#BD3A44"], [1, "#7B1E27"]]} />
      </defs>
      <path d={STEAK} transform="translate(0 16)" fill={`url(#${id}s)`} {...outline} />
      <path d={STEAK} fill={`url(#${id}t)`} {...outline} />
      {seared ? (
        <g>
          {[
            [-40, -44, 6],
            [-8, -56, 4],
            [30, -40, 7],
            [50, -28, 4],
            [-54, -24, 4],
            [6, -20, 5],
          ].map(([cx, cy, r], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.55} fill="#2E1006" opacity={0.45} />
          ))}
          <path d="M-52 -50 C -36 -60 -12 -64 8 -62" stroke="#F0B27A" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.75} />
          <path d="M22 -56 C 40 -52 54 -46 60 -40" stroke="#E8A56E" strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.6} />
          <path d="M-70 -18 C -40 -6 20 -4 70 -12" stroke="#A9502A" strokeWidth={2} fill="none" opacity={0.6} transform="translate(0 12)" />
        </g>
      ) : (
        <g stroke="#FBE7DF" strokeLinecap="round" fill="none" opacity={0.85}>
          <path d="M-50 -46 C -30 -54 -10 -42 10 -50 C 24 -56 40 -46 52 -52" strokeWidth={2.4} />
          <path d="M-44 -22 C -24 -28 -4 -16 16 -24 C 30 -28 46 -20 58 -28" strokeWidth={2} />
          <path d="M-24 -62 C -12 -56 2 -64 14 -60" strokeWidth={1.8} />
          <path d="M56 -60 C 76 -48 82 -34 76 -20" stroke="#F6E6D2" strokeWidth={8} />
          <path d="M-60 -38 C -52 -30 -48 -34 -40 -30" strokeWidth={1.5} />
        </g>
      )}
      <path d="M-58 -52 C -44 -62 -24 -66 -6 -66" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" fill="none" />
    </g>
  );
}

const SLICE = "M-15 -28 Q -22 -2 -15 24 Q 0 31 15 24 Q 22 -2 15 -28 Q 0 -35 -15 -28 Z";

/** Gesneden stukken (steak/eend) met rosé kern. */
export function Slices({ count = 5, kind = "steak", ...p }: Place & { count?: number; kind?: "steak" | "duck" }) {
  const id = useUid();
  const crust = kind === "duck" ? "#C98A45" : "#4E2213";
  return (
    <g transform={place(p)}>
      <defs>
        <RadialGradient id={`${id}m`} cx={0.5} cy={0.5} r={0.62} stops={[[0, "#EE8C8A"], [0.55, "#D2606A"], [0.85, "#A5645A"], [1, "#7A4636"]]} />
      </defs>
      {Array.from({ length: count }).map((_, i) => (
        <g key={i} transform={`translate(${(i - (count - 1) / 2) * 24} ${-Math.abs(i - (count - 1) / 2) * 2}) rotate(${-14 + i * 2})`}>
          <path d={SLICE} fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
          <path d={SLICE} fill={`url(#${id}m)`} stroke={crust} strokeWidth={5} strokeLinejoin="round" />
          {kind === "duck" && <path d="M-15 -28 Q 0 -35 15 -28" stroke="#F4E0B0" strokeWidth={4} fill="none" />}
          <path d="M-7 -14 Q -9 0 -6 10" stroke="#FFFFFF" strokeOpacity={0.4} strokeWidth={2.5} strokeLinecap="round" fill="none" />
        </g>
      ))}
    </g>
  );
}

const FILLET = "M-94 -12 C -76 -40 34 -48 86 -28 C 96 -24 100 -14 94 -8 C 52 10 -60 10 -94 -12 Z";

export function FishFillet({ state = "raw", ...p }: Place & { state?: "raw" | "seared" }) {
  const id = useUid();
  const seared = state === "seared";
  return (
    <g transform={place(p)}>
      <defs>
        <LinearGradient
          id={`${id}t`}
          x2={0.2}
          y2={1}
          stops={seared ? [[0, "#F4C27A"], [0.5, "#D08C45"], [1, "#9A5A22"]] : [[0, "#EEF1F3"], [0.45, "#AEB8BE"], [1, "#6E7A82"]]}
        />
        <LinearGradient id={`${id}s`} stops={[[0, "#FBF1EA"], [1, "#E3CFC3"]]} />
      </defs>
      <path d={FILLET} transform="translate(0 12)" fill={`url(#${id}s)`} {...outline} />
      <path d={FILLET} fill={`url(#${id}t)`} {...outline} />
      {seared ? (
        <g>
          {[
            [-40, -26],
            [-6, -32],
            [30, -30],
            [58, -22],
            [10, -18],
            [-62, -16],
          ].map(([cx, cy], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={5} ry={2.4} fill="#7A3E12" opacity={0.45} />
          ))}
          <path d="M-70 -24 C -30 -38 30 -40 76 -28" stroke="#FFE3AE" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.8} />
        </g>
      ) : (
        <g>
          {Array.from({ length: 7 }).map((_, i) => (
            <path key={i} d={`M${-60 + i * 22} -18 q 6 -6 12 0`} {...hairline} opacity={0.35} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <path key={`b${i}`} d={`M${-50 + i * 22} -30 q 6 -6 12 0`} {...hairline} opacity={0.35} />
          ))}
          <path d="M-80 -18 C -40 -30 40 -34 88 -22" stroke="#3E4A52" strokeWidth={1.4} fill="none" opacity={0.5} />
          <path d="M-60 -30 C -20 -40 30 -42 70 -34" stroke="#FFFFFF" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.7} />
        </g>
      )}
    </g>
  );
}

const LOIN = "M-72 -44 L 60 -50 Q 76 -50 76 -38 L 74 -6 Q 74 4 62 4 L -68 8 Q -80 8 -80 -4 L -80 -34 Q -80 -44 -72 -44 Z";

export function Salmon({ state = "raw", ...p }: Place & { state?: "raw" | "seared" }) {
  const id = useUid();
  const seared = state === "seared";
  return (
    <g transform={place(p)}>
      <defs>
        <LinearGradient id={`${id}t`} x2={1} y2={1} stops={[[0, "#FFAF82"], [0.5, "#F57A4A"], [1, "#DE5A30"]]} />
        <LinearGradient id={`${id}s`} stops={seared ? [[0, "#C8773F"], [1, "#8C4A1F"]] : [[0, "#E86A3C"], [1, "#B8461F"]]} />
      </defs>
      <path d={LOIN} transform="translate(0 20)" fill={`url(#${id}s)`} {...outline} />
      <path d={LOIN} fill={`url(#${id}t)`} {...outline} />
      <g stroke="#FFE7D9" strokeWidth={2.4} strokeLinecap="round" fill="none" opacity={0.9}>
        {[-54, -30, -6, 18, 42].map((sx) => (
          <path key={sx} d={`M${sx} -44 C ${sx + 12} -32 ${sx + 4} -14 ${sx + 16} 2`} />
        ))}
      </g>
      {seared && (
        <g>
          <path d={LOIN} fill="none" stroke="#9A5424" strokeWidth={6} opacity={0.6} />
          {Array.from({ length: 22 }).map((_, i) => (
            <ellipse
              key={i}
              cx={-74 + ((i * 37) % 150)}
              cy={-2 + ((i * 11) % 18)}
              rx={2.6}
              ry={1.3}
              fill={i % 3 === 0 ? "#1F1B19" : "#FFF6E2"}
              stroke={INK}
              strokeWidth={0.5}
              transform={`rotate(${(i * 47) % 180} ${-74 + ((i * 37) % 150)} ${-2 + ((i * 11) % 18)})`}
            />
          ))}
        </g>
      )}
    </g>
  );
}

export function Scallops({ state = "raw", count = 3, ...p }: Place & { state?: "raw" | "seared"; count?: number }) {
  const id = useUid();
  const seared = state === "seared";
  return (
    <g transform={place(p)}>
      <defs>
        <LinearGradient id={`${id}s`} x2={1} y2={0} stops={[[0, "#E8DACB"], [0.4, "#FFF8EF"], [1, "#D6C4B0"]]} />
        <RadialGradient
          id={`${id}t`}
          cx={0.45}
          cy={0.45}
          r={0.6}
          stops={seared ? [[0, "#F5C477"], [0.6, "#D18C3E"], [1, "#8F5220"]] : [[0, "#FFF9F1"], [1, "#EBD9C6"]]}
        />
      </defs>
      {Array.from({ length: count }).map((_, i) => {
        const cx = (i - (count - 1) / 2) * 50;
        const cy = i % 2 ? 6 : -4;
        return (
          <g key={i} transform={`translate(${cx} ${cy})`}>
            <path d="M-22 -20 L -22 -2 A 22 9 0 0 0 22 -2 L 22 -20 Z" fill={`url(#${id}s)`} {...outline} />
            <ellipse cx={0} cy={-20} rx={22} ry={9} fill={`url(#${id}t)`} {...outline} />
            <ellipse cx={-6} cy={-22} rx={7} ry={2.5} fill="#FFFFFF" opacity={0.5} />
          </g>
        );
      })}
    </g>
  );
}

const DUCK = "M-78 -30 C -74 -58 -20 -70 30 -64 C 70 -58 88 -40 80 -20 C 72 -2 28 4 -16 2 C -56 0 -80 -8 -78 -30 Z";

export function DuckBreast({ state = "raw", ...p }: Place & { state?: "raw" | "seared" }) {
  const id = useUid();
  const seared = state === "seared";
  return (
    <g transform={place(p)}>
      <defs>
        <RadialGradient
          id={`${id}t`}
          cx={0.42}
          cy={0.4}
          r={0.72}
          stops={seared ? [[0, "#E7A85C"], [0.6, "#B8702F"], [1, "#7A4216"]] : [[0, "#FBF0D4"], [0.6, "#EFDDB2"], [1, "#D9BE86"]]}
        />
      </defs>
      <path d={DUCK} transform="translate(0 20)" fill="#A8373F" {...outline} />
      <path d={DUCK} transform="translate(0 8)" fill={seared ? "#8C4A1C" : "#EAD8AE"} {...outline} strokeWidth={1.6} />
      <path d={DUCK} fill={`url(#${id}t)`} {...outline} />
      <g stroke={seared ? "#6A340F" : "#C7A870"} strokeWidth={1.6} opacity={0.75}>
        {[-50, -28, -6, 16, 38].map((sx) => (
          <line key={`a${sx}`} x1={sx - 10} y1={-60} x2={sx + 26} y2={-6} />
        ))}
        {[-40, -18, 4, 26, 48].map((sx) => (
          <line key={`b${sx}`} x1={sx + 22} y1={-62} x2={sx - 16} y2={-6} />
        ))}
      </g>
      <path d="M-56 -48 C -40 -58 -16 -62 6 -60" stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={3} strokeLinecap="round" fill="none" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Groenten                                                            */
/* ------------------------------------------------------------------ */
export function Mushrooms({ state = "whole", ...p }: Place & { state?: "whole" | "seared" }) {
  const id = useUid();
  const seared = state === "seared";
  const caps = [
    [-40, -6, 1],
    [6, -16, 1.15],
    [48, -2, 0.9],
    [-6, 12, 0.8],
  ];
  return (
    <g transform={place(p)}>
      <defs>
        <RadialGradient id={`${id}c`} cx={0.35} cy={0.3} r={0.8} stops={seared ? [[0, "#B98050"], [0.6, "#7A4A28"], [1, "#4A2A14"]] : [[0, "#D5A57A"], [0.6, "#9C6A42"], [1, "#6A4226"]]} />
        <LinearGradient id={`${id}s`} x2={1} y2={0} stops={[[0, "#E6D8C0"], [0.5, "#FFF9EE"], [1, "#D2C2A6"]]} />
      </defs>
      {caps.map(([cx, cy, sc], i) => (
        <g key={i} transform={`translate(${cx} ${cy}) scale(${sc})`}>
          <path d="M-8 -18 L -10 4 Q 0 10 10 4 L 8 -18 Z" fill={`url(#${id}s)`} {...outline} />
          <path d="M-28 -16 C -28 -44 28 -44 28 -16 Q 0 -8 -28 -16 Z" fill={`url(#${id}c)`} {...outline} />
          <path d="M-26 -16 Q 0 -10 26 -16" stroke="#EAD9BF" strokeWidth={2} fill="none" />
          <path d="M-16 -32 C -10 -38 0 -40 6 -39" stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={2.5} strokeLinecap="round" fill="none" />
        </g>
      ))}
    </g>
  );
}

export function Carrots({ ...p }: Place) {
  const id = useUid();
  return (
    <g transform={place(p)}>
      <defs>
        <LinearGradient id={`${id}c`} x2={0} y2={1} stops={[[0, "#FFB05A"], [0.5, "#F07F24"], [1, "#C95B10"]]} />
      </defs>
      {[
        [-22, 0, -8],
        [0, -8, 0],
        [24, 2, 8],
      ].map(([cx, cy, rot], i) => (
        <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot + 90})`}>
          <path d="M-14 -4 C 0 -4 -2 -6 -30 -20 M -14 4 C -4 8 -10 10 -34 18 M -14 0 L -40 -2" stroke="#5E9A3E" strokeWidth={3} strokeLinecap="round" fill="none" />
          <path d="M-14 -8 C 20 -8 70 -4 90 0 C 70 4 20 8 -14 8 Q -20 0 -14 -8 Z" fill={`url(#${id}c)`} {...outline} />
          {[10, 30, 50].map((rx) => (
            <path key={rx} d={`M${rx} -5 q 3 3 0 6`} {...hairline} opacity={0.4} />
          ))}
          <path d="M-6 -4 L 60 -2" stroke="#FFFFFF" strokeOpacity={0.4} strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

export function Pumpkin({ state = "whole", ...p }: Place & { state?: "whole" | "half" }) {
  const id = useUid();
  return (
    <g transform={place(p)}>
      <defs>
        <RadialGradient id={`${id}p`} cx={0.35} cy={0.35} r={0.8} stops={[[0, "#F9D29A"], [0.6, "#E9A85C"], [1, "#C07A32"]]} />
        <RadialGradient id={`${id}f`} cx={0.4} cy={0.4} r={0.7} stops={[[0, "#FFC061"], [1, "#EE8A22"]]} />
      </defs>
      {state === "whole" ? (
        <g>
          <path d="M-8 -118 C -6 -130 8 -132 10 -120 L 8 -106 L -6 -106 Z" fill="#8A6A3A" {...outline} />
          <path d="M0 -108 C 26 -108 30 -80 30 -64 C 30 -52 58 -40 58 -16 C 58 6 30 10 0 10 C -30 10 -58 6 -58 -16 C -58 -40 -30 -52 -30 -64 C -30 -80 -26 -108 0 -108 Z" fill={`url(#${id}p)`} {...outline} />
          <path d="M-14 -96 C -20 -80 -18 -66 -24 -54" stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={4} strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g>
          <path d="M-60 -10 C -60 -40 -30 -52 -30 -70 C -30 -96 30 -96 30 -70 C 30 -52 60 -40 60 -10 C 60 8 -60 8 -60 -10 Z" fill="#D9974E" {...outline} />
          <path d="M-52 -14 C -52 -38 -24 -50 -24 -68 C -24 -88 24 -88 24 -68 C 24 -50 52 -38 52 -14 C 52 0 -52 0 -52 -14 Z" fill={`url(#${id}f)`} stroke={INK} strokeWidth={1.4} />
          <ellipse cx={0} cy={-26} rx={24} ry={18} fill="#F7C57A" stroke="#C47A22" strokeWidth={1.6} />
          {Array.from({ length: 6 }).map((_, i) => (
            <ellipse key={i} cx={-12 + (i % 3) * 12} cy={-32 + Math.floor(i / 3) * 12} rx={3.4} ry={2} fill="#FFF3D6" stroke={INK} strokeWidth={0.7} />
          ))}
        </g>
      )}
    </g>
  );
}

export function Onion({ variant = "onion", state = "whole", ...p }: Place & { variant?: "onion" | "shallot"; state?: "whole" | "half" }) {
  const id = useUid();
  const shallot = variant === "shallot";
  const skin = shallot ? [[0, "#E7A58A"], [0.6, "#B8684F"], [1, "#84422F"]] : [[0, "#F1C27C"], [0.6, "#C98A3E"], [1, "#94581E"]];
  const w = shallot ? 30 : 46;
  const h = shallot ? 80 : 70;
  return (
    <g transform={place(p)}>
      <defs>
        <RadialGradient id={`${id}s`} cx={0.35} cy={0.35} r={0.8} stops={skin as [number, string][]} />
      </defs>
      {state === "whole" ? (
        <g>
          <path d={`M0 ${-h - 10} C 6 ${-h} ${w} ${-h * 0.62} ${w} ${-h * 0.28} C ${w} 0 ${w * 0.5} 4 0 4 C ${-w * 0.5} 4 ${-w} 0 ${-w} ${-h * 0.28} C ${-w} ${-h * 0.62} -6 ${-h} 0 ${-h - 10} Z`} fill={`url(#${id}s)`} {...outline} />
          {[-0.5, 0, 0.5].map((k) => (
            <path key={k} d={`M${k * w * 0.5} ${-h + 4} C ${k * w * 1.1} ${-h * 0.5} ${k * w * 1.1} ${-h * 0.2} ${k * w * 0.6} 0`} {...hairline} opacity={0.35} />
          ))}
          <path d="M-6 4 l -4 6 M 0 4 l 0 7 M 6 4 l 4 6" stroke={INK} strokeWidth={1.2} strokeLinecap="round" />
          <path d={`M${-w * 0.55} ${-h * 0.5} C ${-w * 0.6} ${-h * 0.3} ${-w * 0.5} ${-h * 0.15} ${-w * 0.35} ${-h * 0.05}`} stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={3} strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g>
          <path d={`M${-w} -2 C ${-w} ${-h * 0.8} ${w} ${-h * 0.8} ${w} -2 Z`} fill={`url(#${id}s)`} {...outline} />
          <path d={`M${-w + 4} -2 C ${-w + 4} ${-h * 0.7} ${w - 4} ${-h * 0.7} ${w - 4} -2 Z`} fill={shallot ? "#F1D2D4" : "#FBF3DD"} stroke={INK} strokeWidth={1.3} />
          {[0.72, 0.5, 0.28].map((k) => (
            <path key={k} d={`M${-w * k} -2 C ${-w * k} ${-h * 0.7 * k} ${w * k} ${-h * 0.7 * k} ${w * k} -2`} stroke={shallot ? "#B9818A" : "#D8C08E"} strokeWidth={1.6} fill="none" />
          ))}
        </g>
      )}
    </g>
  );
}

export function Garlic({ ...p }: Place) {
  const id = useUid();
  return (
    <g transform={place(p)}>
      <defs>
        <RadialGradient id={`${id}g`} cx={0.35} cy={0.35} r={0.8} stops={[[0, "#FFFDF7"], [0.7, "#EFE6D4"], [1, "#CFC1A8"]]} />
      </defs>
      <path d="M0 -62 C 4 -54 36 -40 36 -18 C 36 0 18 4 0 4 C -18 4 -36 0 -36 -18 C -36 -40 -4 -54 0 -62 Z" fill={`url(#${id}g)`} {...outline} />
      <path d="M-12 -44 C -20 -30 -18 -10 -10 2 M 12 -44 C 20 -30 18 -10 10 2 M 0 -52 L 0 3" {...hairline} opacity={0.4} />
      <path d="M-20 -30 C -24 -20 -22 -10 -16 -4" stroke="#B98AA8" strokeWidth={2} fill="none" opacity={0.6} strokeLinecap="round" />
      <g transform="translate(46 0) rotate(20)">
        <path d="M0 -30 C 14 -24 16 -6 10 0 L -8 0 C -12 -8 -8 -24 0 -30 Z" fill={`url(#${id}g)`} {...outline} />
      </g>
    </g>
  );
}

export function Herbs({ kind = "rosemary", ...p }: Place & { kind?: "rosemary" | "thyme" | "basil" | "sage" | "parsley" }) {
  const id = useUid();
  if (kind === "basil" || kind === "sage") {
    const basil = kind === "basil";
    const leaves = [
      [-30, -6, -40, 1],
      [4, -14, 10, 1.15],
      [36, -2, 50, 0.95],
      [-8, 8, -100, 0.85],
      [22, 12, 120, 0.8],
    ];
    return (
      <g transform={place(p)}>
        <defs>
          <LinearGradient id={`${id}l`} x2={1} y2={1} stops={basil ? [[0, "#8CC45A"], [0.5, "#4F8F32"], [1, "#2F5E1C"]] : [[0, "#B7C6A6"], [0.5, "#8FA27D"], [1, "#62755A"]]} />
        </defs>
        {leaves.map(([lx, ly, rot, sc], i) => (
          <g key={i} transform={`translate(${lx} ${ly}) rotate(${rot}) scale(${sc})`}>
            <path d="M0 0 C 10 -18 34 -20 44 0 C 34 20 10 18 0 0 Z" fill={`url(#${id}l)`} {...outline} strokeWidth={1.8} />
            <path d="M2 0 L 40 0" stroke={basil ? "#2A4F16" : "#556848"} strokeWidth={1.2} opacity={0.7} />
            <path d="M12 0 l 6 -6 M 22 0 l 6 -6 M 12 0 l 6 6 M 22 0 l 6 6" stroke={basil ? "#2A4F16" : "#556848"} strokeWidth={0.9} opacity={0.5} />
            <path d="M8 -6 C 16 -12 26 -12 34 -8" stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>
    );
  }
  if (kind === "thyme") {
    return (
      <g transform={place(p)}>
        {[-14, 0, 14].map((ox, j) => (
          <g key={j} transform={`translate(${ox} 0) rotate(${-20 + j * 20})`}>
            <path d="M0 0 C 2 -30 -2 -60 4 -90" stroke="#6B5A3A" strokeWidth={1.6} fill="none" />
            {Array.from({ length: 10 }).map((_, i) => (
              <ellipse key={i} cx={(i % 2 ? 5 : -5) + (i * 0.4)} cy={-8 - i * 8} rx={4} ry={2.4} fill="#6E8F4A" stroke={INK} strokeWidth={0.8} transform={`rotate(${i % 2 ? 30 : -30} ${(i % 2 ? 5 : -5) + i * 0.4} ${-8 - i * 8})`} />
            ))}
          </g>
        ))}
      </g>
    );
  }
  if (kind === "parsley") {
    return (
      <g transform={place(p)}>
        {[-24, 0, 24].map((ox, j) => (
          <g key={j} transform={`translate(${ox} 0) rotate(${-24 + j * 24})`}>
            <path d="M0 0 L 0 -50" stroke="#4E7F32" strokeWidth={2} />
            <path d="M0 -50 c -18 -4 -22 -22 -8 -30 c 2 -12 16 -12 18 0 c 14 8 10 26 -10 30 Z" fill="#4F9336" {...outline} strokeWidth={1.6} />
            <path d="M0 -50 L 0 -76 M 0 -60 l -8 -10 M 0 -60 l 8 -10" stroke="#2E5A1C" strokeWidth={1} opacity={0.6} />
          </g>
        ))}
      </g>
    );
  }
  return (
    <g transform={place(p)}>
      <path d="M-70 10 C -30 -4 20 -16 74 -40" stroke="#6A5A3A" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      {Array.from({ length: 22 }).map((_, i) => {
        const t = i / 21;
        const sx = -66 + t * 136;
        const sy = 8 - t * 44 - sin(t * 3) * 4;
        const up = i % 2 === 0;
        return (
          <path
            key={i}
            d={`M${sx} ${sy} q ${up ? -4 : 4} ${up ? -12 : 12} ${up ? 6 : 8} ${up ? -20 : 18}`}
            stroke={INK}
            strokeWidth={4.2}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
      {Array.from({ length: 22 }).map((_, i) => {
        const t = i / 21;
        const sx = -66 + t * 136;
        const sy = 8 - t * 44 - sin(t * 3) * 4;
        const up = i % 2 === 0;
        return (
          <path
            key={`n${i}`}
            d={`M${sx} ${sy} q ${up ? -4 : 4} ${up ? -12 : 12} ${up ? 6 : 8} ${up ? -20 : 18}`}
            stroke={i % 3 ? "#56733E" : "#6F8E52"}
            strokeWidth={2.2}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
    </g>
  );
}

export function Tomatoes({ state = "whole", ...p }: Place & { state?: "whole" | "half" }) {
  const id = useUid();
  const spots = [
    [-34, 0, 1],
    [0, -10, 1.1],
    [34, 2, 0.95],
    [14, 16, 0.85],
    [-16, 18, 0.8],
  ];
  return (
    <g transform={place(p)}>
      <defs>
        <RadialGradient id={`${id}t`} cx={0.35} cy={0.3} r={0.8} stops={[[0, "#FF8A6E"], [0.5, "#E23F2E"], [1, "#9A1C14"]]} />
      </defs>
      {spots.map(([tx, ty, sc], i) => (
        <g key={i} transform={`translate(${tx} ${ty}) scale(${sc})`}>
          {state === "whole" || i % 2 === 0 ? (
            <g>
              <circle cx={0} cy={-18} r={20} fill={`url(#${id}t)`} {...outline} />
              <path d="M0 -38 l -8 -2 l 6 -2 l -2 -7 l 5 5 l 5 -5 l -1 7 l 6 2 l -8 2 Z" fill="#4E8A34" stroke={INK} strokeWidth={1} strokeLinejoin="round" />
              <ellipse cx={-7} cy={-26} rx={5} ry={3} fill="#FFFFFF" opacity={0.6} />
            </g>
          ) : (
            <g>
              <ellipse cx={0} cy={-10} rx={20} ry={14} fill="#D8392A" {...outline} />
              <ellipse cx={0} cy={-11} rx={16} ry={10.5} fill="#F46A50" stroke="#B42A1C" strokeWidth={1.2} />
              {[-8, 0, 8].map((sx) => (
                <ellipse key={sx} cx={sx} cy={-11} rx={3.2} ry={4.5} fill="#F7D36A" stroke="#C49A2A" strokeWidth={0.8} />
              ))}
            </g>
          )}
        </g>
      ))}
    </g>
  );
}

export function Cucumber({ ...p }: Place) {
  const id = useUid();
  return (
    <g transform={place(p)}>
      <defs>
        <LinearGradient id={`${id}c`} stops={[[0, "#86B563"], [0.4, "#4C7E36"], [1, "#2B4E1E"]]} />
      </defs>
      <path d="M-90 -30 L 60 -30 A 16 16 0 0 1 60 2 L -90 2 A 16 16 0 0 1 -90 -30 Z" fill={`url(#${id}c)`} {...outline} />
      <ellipse cx={60} cy={-14} rx={9} ry={16} fill="#E1EFC4" {...outline} />
      <ellipse cx={60} cy={-14} rx={5} ry={10} fill="#C9E0A0" stroke="#7FA85A" strokeWidth={1} />
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx={-80 + i * 12} cy={-20 + (i % 3) * 6} r={1.3} fill="#D6E8B8" />
      ))}
      <path d="M-86 -24 L 50 -24" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

export function Cauliflower({ ...p }: Place) {
  const id = useUid();
  const florets = [
    [-30, -40, 20],
    [0, -52, 23],
    [30, -40, 20],
    [-16, -24, 19],
    [16, -24, 19],
    [-40, -18, 15],
    [40, -18, 15],
    [0, -30, 18],
  ];
  return (
    <g transform={place(p)}>
      <defs>
        <RadialGradient id={`${id}f`} cx={0.35} cy={0.3} r={0.8} stops={[[0, "#FFFDF4"], [0.65, "#F1E6C9"], [1, "#D2C198"]]} />
      </defs>
      <path d="M-62 -8 C -72 -40 -52 -30 -44 -10 Z M 62 -8 C 72 -40 52 -30 44 -10 Z" fill="#6F9A4A" {...outline} />
      <path d="M-56 0 C -50 -20 50 -20 56 0 C 30 8 -30 8 -56 0 Z" fill="#5E8A3E" {...outline} />
      {florets.map(([fx, fy, fr], i) => (
        <circle key={i} cx={fx} cy={fy} r={fr} fill={`url(#${id}f)`} {...outline} strokeWidth={1.8} />
      ))}
      {florets.map(([fx, fy], i) => (
        <path key={`d${i}`} d={`M${fx - 6} ${fy + 2} q 3 -4 6 0 q 3 -4 6 0`} {...hairline} opacity={0.3} />
      ))}
    </g>
  );
}

export function Lemon({ state = "whole", ...p }: Place & { state?: "whole" | "half" }) {
  const id = useUid();
  return (
    <g transform={place(p)}>
      <defs>
        <RadialGradient id={`${id}l`} cx={0.35} cy={0.3} r={0.8} stops={[[0, "#FFF6A6"], [0.55, "#FAD93A"], [1, "#D5A514"]]} />
      </defs>
      {state === "whole" ? (
        <g>
          <path d="M-50 -28 C -50 -56 50 -56 50 -28 C 50 -2 -50 -2 -50 -28 Z" fill={`url(#${id}l)`} {...outline} />
          <path d="M-50 -28 l -8 -1 l 8 -4 Z M 50 -28 l 8 -1 l -8 -4 Z" fill="#D5A514" {...outline} strokeWidth={1.4} />
          {Array.from({ length: 10 }).map((_, i) => (
            <circle key={i} cx={-30 + ((i * 23) % 60)} cy={-40 + ((i * 7) % 22)} r={1.2} fill="#C79A10" opacity={0.6} />
          ))}
          <ellipse cx={-18} cy={-42} rx={12} ry={5} fill="#FFFFFF" opacity={0.55} />
        </g>
      ) : (
        <g>
          <ellipse cx={0} cy={-16} rx={40} ry={18} fill="#F2C92A" {...outline} />
          <ellipse cx={0} cy={-18} rx={35} ry={14.5} fill="#FFFBEA" stroke={INK} strokeWidth={1.2} />
          <ellipse cx={0} cy={-18} rx={31} ry={12} fill="#FFE870" stroke="#E9C640" strokeWidth={1} />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <line key={i} x1={0} y1={-18} x2={cos(a) * 31} y2={-18 + sin(a) * 12} stroke="#FFFBEA" strokeWidth={1.6} />;
          })}
        </g>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Zuivel, chocolade, brood                                            */
/* ------------------------------------------------------------------ */
export function ChocolateBar({ ...p }: Place) {
  const id = useUid();
  const top = "M-70 -36 L 50 -44 L 76 -20 L -44 -12 Z";
  return (
    <g transform={place(p)}>
      <defs>
        <LinearGradient id={`${id}c`} x2={1} y2={1} stops={[[0, "#7A4B30"], [0.5, "#553220"], [1, "#351E12"]]} />
      </defs>
      <path d="M-70 -36 L -44 -12 L -44 0 L -70 -24 Z" fill="#2C170C" {...outline} />
      <path d="M-44 -12 L 76 -20 L 76 -8 L -44 0 Z" fill="#3E2314" {...outline} />
      <path d={top} fill={`url(#${id}c)`} {...outline} />
      {[1, 2, 3].map((i) => (
        <path key={i} d={`M${-70 + i * 30} ${-36 - i * 2} L ${-44 + i * 30} ${-12 - i * 2}`} stroke="#2A160B" strokeWidth={1.4} />
      ))}
      <path d="M-57 -24 L 63 -32" stroke="#2A160B" strokeWidth={1.4} />
      <path d="M-60 -34 L 40 -41" stroke="#B98462" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
      {[
        [96, -6, 20],
        [118, 4, -30],
        [86, 10, 60],
      ].map(([sx, sy, rot], i) => (
        <path key={i} d="M0 -8 L 14 -2 L 6 8 L -10 4 Z" transform={`translate(${sx} ${sy}) rotate(${rot})`} fill="#4A2A18" {...outline} strokeWidth={1.5} />
      ))}
    </g>
  );
}

export function Burrata({ ...p }: Place) {
  const id = useUid();
  return (
    <g transform={place(p)}>
      <defs>
        <RadialGradient id={`${id}b`} cx={0.35} cy={0.3} r={0.8} stops={[[0, "#FFFFFF"], [0.65, "#F5F0E6"], [1, "#D9CFBE"]]} />
      </defs>
      <path d="M0 -84 C -18 -84 -48 -60 -52 -34 C -56 -8 -34 4 0 4 C 34 4 56 -8 52 -34 C 48 -60 18 -84 0 -84 Z" fill={`url(#${id}b)`} {...outline} />
      <path d="M-10 -84 C -14 -96 -4 -104 0 -94 C 4 -104 16 -98 10 -84 Z" fill={`url(#${id}b)`} {...outline} strokeWidth={1.8} />
      <path d="M-12 -82 C -4 -78 6 -78 12 -82" stroke="#6E9A4A" strokeWidth={3.5} strokeLinecap="round" fill="none" />
      <path d="M-30 -56 C -36 -44 -36 -30 -30 -20" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" fill="none" />
      <path d="M-8 -80 C -4 -60 6 -40 4 -10" {...hairline} opacity={0.2} />
    </g>
  );
}

export function Bread({ state = "fresh", ...p }: Place & { state?: "fresh" | "toasted" }) {
  const id = useUid();
  const toasted = state === "toasted";
  const slice = "M-62 -20 C -64 -46 -34 -58 0 -58 C 38 -58 66 -46 62 -20 C 60 -4 40 0 0 0 C -40 0 -60 -4 -62 -20 Z";
  return (
    <g transform={place(p)}>
      <defs>
        <RadialGradient id={`${id}c`} cx={0.45} cy={0.45} r={0.7} stops={toasted ? [[0, "#F2CF8E"], [1, "#D39A52"]] : [[0, "#FBEBC6"], [1, "#EDD39C"]]} />
      </defs>
      <path d={slice} transform="translate(0 8)" fill="#8A5424" {...outline} />
      <path d={slice} fill="#A86A30" {...outline} />
      <path d="M-54 -22 C -56 -42 -30 -52 0 -52 C 32 -52 58 -42 54 -22 C 52 -10 34 -6 0 -6 C -34 -6 -52 -10 -54 -22 Z" fill={`url(#${id}c)`} stroke={INK} strokeWidth={1.2} />
      {[
        [-26, -32, 5],
        [8, -40, 4],
        [26, -22, 6],
        [-8, -18, 3],
        [36, -38, 3],
      ].map(([hx, hy, hr], i) => (
        <ellipse key={i} cx={hx} cy={hy} rx={hr} ry={hr * 0.6} fill={toasted ? "#B77A3A" : "#D8B474"} opacity={0.7} />
      ))}
      {toasted &&
        [-30, -6, 18, 42].map((gx) => <path key={gx} d={`M${gx} -50 L ${gx - 16} -8`} stroke="#5A3212" strokeWidth={3.4} strokeLinecap="round" opacity={0.7} />)}
    </g>
  );
}

export function Dough({ ...p }: Place) {
  const id = useUid();
  return (
    <g transform={place(p)}>
      <defs>
        <RadialGradient id={`${id}d`} cx={0.38} cy={0.3} r={0.8} stops={[[0, "#FFF8E8"], [0.7, "#F2DFB8"], [1, "#D9BE88"]]} />
      </defs>
      <path d="M-70 -14 C -70 -50 70 -50 70 -14 C 70 4 -70 4 -70 -14 Z" fill={`url(#${id}d)`} {...outline} />
      {Array.from({ length: 16 }).map((_, i) => (
        <circle key={i} cx={-60 + ((i * 29) % 120)} cy={-30 + ((i * 13) % 26)} r={1.4} fill="#FFFFFF" opacity={0.9} />
      ))}
      <path d="M-40 -34 C -20 -40 10 -40 30 -36" stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={3} strokeLinecap="round" fill="none" />
    </g>
  );
}

export function Parmesan({ ...p }: Place) {
  const id = useUid();
  return (
    <g transform={place(p)}>
      <defs>
        <LinearGradient id={`${id}p`} x2={1} y2={1} stops={[[0, "#FFF0B8"], [1, "#E8C66A"]]} />
      </defs>
      <path d="M-60 -6 L 50 -30 L 60 -6 L -50 14 Z" fill="#E1BC62" {...outline} />
      <path d="M-60 -6 L 50 -30 L 30 -62 Z" fill={`url(#${id}p)`} {...outline} />
      <path d="M50 -30 L 60 -6 L 38 -56 L 30 -62 Z" fill="#C9973E" {...outline} />
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={i} cx={-30 + ((i * 17) % 60)} cy={-26 + ((i * 7) % 20)} r={1.5} fill="#FFFFFF" opacity={0.85} />
      ))}
    </g>
  );
}

export function Truffle({ ...p }: Place) {
  const id = useUid();
  return (
    <g transform={place(p)}>
      <defs>
        <RadialGradient id={`${id}t`} cx={0.35} cy={0.3} r={0.8} stops={[[0, "#5A4A40"], [0.6, "#2E2420"], [1, "#171210"]]} />
      </defs>
      <path d="M-34 -28 C -40 -54 -14 -68 6 -64 C 34 -62 44 -40 38 -20 C 34 -2 12 4 -8 2 C -26 0 -30 -12 -34 -28 Z" fill={`url(#${id}t)`} {...outline} />
      {Array.from({ length: 18 }).map((_, i) => (
        <path key={i} d={`M${-26 + ((i * 19) % 56)} ${-52 + ((i * 11) % 48)} l 3 -4 l 3 4 Z`} fill="#6A5A50" opacity={0.7} />
      ))}
      <g transform="translate(58 -6)">
        <ellipse cx={0} cy={0} rx={20} ry={9} fill="#3A2C26" {...outline} strokeWidth={1.6} />
        <ellipse cx={0} cy={-1} rx={16} ry={6.5} fill="#8C7566" />
        <path d="M-12 -2 C -6 -6 0 2 6 -3 C 10 -6 12 -1 14 -2 M -10 2 C -2 0 4 4 12 1" stroke="#EFE4D6" strokeWidth={1} fill="none" />
      </g>
    </g>
  );
}

export function Asparagus({ ...p }: Place) {
  const id = useUid();
  return (
    <g transform={place(p)}>
      <defs>
        <LinearGradient id={`${id}a`} stops={[[0, "#9CCB6A"], [1, "#4E8434"]]} />
      </defs>
      {[-10, 0, 10].map((oy, i) => (
        <g key={i} transform={`translate(0 ${oy}) rotate(${-4 + i * 3})`}>
          <path d="M-80 -4 L 60 -5 L 60 5 L -80 4 Z" fill={`url(#${id}a)`} {...outline} strokeWidth={1.8} />
          <path d="M60 -6 C 76 -8 90 -2 92 0 C 90 2 76 8 60 6 Z" fill="#5E8A3E" {...outline} strokeWidth={1.8} />
          {[-40, 0, 36].map((nx) => (
            <path key={nx} d={`M${nx} -4 l 6 4 l -6 1`} stroke={INK} strokeWidth={0.9} fill="#6E9A4A" />
          ))}
        </g>
      ))}
    </g>
  );
}

export function RiceGrains({ ...p }: Place) {
  return (
    <g transform={place(p)}>
      {Array.from({ length: 46 }).map((_, i) => {
        const a = i * 2.4;
        const rr = Math.sqrt(i / 46) * 52;
        const gx = cos(a) * rr;
        const gy = sin(a) * rr * 0.45 - (1 - rr / 52) * 14;
        return (
          <ellipse key={i} cx={gx} cy={gy} rx={4.2} ry={2.2} fill="#FBF6E8" stroke={INK} strokeWidth={0.8} transform={`rotate(${(i * 57) % 180} ${gx} ${gy})`} />
        );
      })}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Gesneden hoopjes                                                    */
/* ------------------------------------------------------------------ */
type PileKind =
  | "onion"
  | "shallot"
  | "garlic"
  | "herbs"
  | "tomato"
  | "cucumber"
  | "cauliflower"
  | "chocolate"
  | "pumpkin"
  | "carrot"
  | "mushrooms"
  | "lemon"
  | "parmesan"
  | "truffle"
  | "vegetables";

const PILE: Record<PileKind, { fill: string; dark: string; shape: "cube" | "fleck" | "disc" | "floret" | "shard" | "slice" }> = {
  onion: { fill: "#F7EDD2", dark: "#CDB27C", shape: "cube" },
  shallot: { fill: "#EDC8CB", dark: "#B07C86", shape: "cube" },
  garlic: { fill: "#FAF5E9", dark: "#D1C3A8", shape: "cube" },
  herbs: { fill: "#5E9A3E", dark: "#2F5A1C", shape: "fleck" },
  tomato: { fill: "#E54A3C", dark: "#9A1E17", shape: "cube" },
  cucumber: { fill: "#E2EFC6", dark: "#3F6E30", shape: "disc" },
  cauliflower: { fill: "#F7F0DB", dark: "#C9B88E", shape: "floret" },
  chocolate: { fill: "#63402A", dark: "#2A170C", shape: "shard" },
  pumpkin: { fill: "#F6A64E", dark: "#BA661C", shape: "cube" },
  carrot: { fill: "#F48E32", dark: "#B05410", shape: "disc" },
  mushrooms: { fill: "#EFDFC6", dark: "#8A5A38", shape: "slice" },
  lemon: { fill: "#FFE55E", dark: "#B98E0E", shape: "fleck" },
  parmesan: { fill: "#F7E6AE", dark: "#C4A052", shape: "fleck" },
  truffle: { fill: "#3E322B", dark: "#161010", shape: "shard" },
  vegetables: { fill: "#F48E32", dark: "#8A2A52", shape: "cube" },
};

export function Pile({ kind, count = 26, spread = 56, ...p }: Place & { kind: PileKind; count?: number; spread?: number }) {
  const cfg = PILE[kind];
  const pieces = Array.from({ length: count }).map((_, i) => {
    const a = i * 2.39996;
    const rr = Math.sqrt((i + 0.5) / count) * spread;
    return { i, px: cos(a) * rr, py: sin(a) * rr * 0.42 - (1 - rr / spread) * 16, rot: (i * 67) % 180 };
  });
  pieces.sort((a, b) => a.py - b.py);
  return (
    <g transform={place(p)}>
      {pieces.map(({ i, px, py, rot }) => {
        const fill = kind === "vegetables" ? ["#F48E32", "#A3285A", "#8DB85A", "#F2D36A"][i % 4] : cfg.fill;
        const t = `translate(${px} ${py}) rotate(${rot})`;
        switch (cfg.shape) {
          case "fleck":
            return <ellipse key={i} transform={t} rx={4} ry={2} fill={fill} stroke={cfg.dark} strokeWidth={0.9} />;
          case "disc":
            return (
              <g key={i} transform={`translate(${px} ${py})`}>
                <ellipse rx={10} ry={5} fill={fill} stroke={INK} strokeWidth={1.1} />
                <ellipse rx={10} ry={5} fill="none" stroke={cfg.dark} strokeWidth={2} />
                <ellipse rx={4} ry={2} fill="none" stroke={cfg.dark} strokeWidth={0.8} opacity={0.6} />
              </g>
            );
          case "floret":
            return (
              <g key={i} transform={t}>
                <circle cx={-3} cy={0} r={4.5} fill={fill} stroke={INK} strokeWidth={0.9} />
                <circle cx={3} cy={-2} r={4.5} fill={fill} stroke={INK} strokeWidth={0.9} />
                <circle cx={0} cy={3} r={4} fill={fill} stroke={INK} strokeWidth={0.9} />
              </g>
            );
          case "shard":
            return <path key={i} transform={t} d="M-6 -4 L 6 -5 L 4 5 L -5 3 Z" fill={fill} stroke={INK} strokeWidth={0.9} strokeLinejoin="round" />;
          case "slice":
            return (
              <path key={i} transform={t} d="M-8 3 Q -9 -7 0 -8 Q 9 -7 8 3 Q 3 1 2 7 L -2 7 Q -3 1 -8 3 Z" fill={fill} stroke={cfg.dark} strokeWidth={1.4} strokeLinejoin="round" />
            );
          default:
            return (
              <g key={i} transform={t}>
                <rect x={-4.5} y={-4.5} width={9} height={9} rx={2} fill={fill} stroke={INK} strokeWidth={0.9} />
                <path d="M-3 -3 L 2 -3" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={1.2} strokeLinecap="round" />
              </g>
            );
        }
      })}
    </g>
  );
}

export function Berries({ kind = "blueberry", count = 7, ...p }: Place & { kind?: "blueberry" | "cherry" | "raspberry"; count?: number }) {
  const id = useUid();
  const stops: [number, string][] =
    kind === "blueberry"
      ? [[0, "#8E96C4"], [0.45, "#434678"], [1, "#1F1F42"]]
      : kind === "cherry"
        ? [[0, "#F0707C"], [0.45, "#A51C2E"], [1, "#4E0A14"]]
        : [[0, "#FF8FA0"], [0.5, "#D8344F"], [1, "#8A1028"]];
  return (
    <g transform={place(p)}>
      <defs>
        <RadialGradient id={`${id}b`} cx={0.35} cy={0.3} r={0.8} stops={stops} />
      </defs>
      {Array.from({ length: count }).map((_, i) => {
        const a = i * 2.39996;
        const rr = Math.sqrt((i + 0.5) / count) * 30;
        const bx = cos(a) * rr;
        const by = sin(a) * rr * 0.5;
        const r = kind === "cherry" ? 12 : 9;
        return (
          <g key={i} transform={`translate(${bx} ${by})`}>
            {kind === "cherry" && <path d="M0 -10 C 2 -24 10 -32 18 -36" stroke="#5A6A2A" strokeWidth={2} fill="none" strokeLinecap="round" />}
            <circle r={r} fill={`url(#${id}b)`} {...outline} strokeWidth={1.6} />
            {kind === "blueberry" && <path d="M-3 -6 l 3 2 l 3 -2 l -1 3 l 2 2 l -4 0 l -1 2 l -1 -2 l -4 0 l 2 -2 Z" fill="#2A2A4E" stroke="#1A1A33" strokeWidth={0.6} />}
            {kind === "raspberry" &&
              [-4, 0, 4].map((dx) => [-4, 0, 4].map((dy) => <circle key={`${dx}${dy}`} cx={dx} cy={dy} r={2.2} fill="none" stroke="#8A1028" strokeWidth={0.7} />))}
            <ellipse cx={-3.5} cy={-4} rx={3} ry={2} fill="#FFFFFF" opacity={0.65} />
          </g>
        );
      })}
    </g>
  );
}

export function ButterBlock({ ...p }: Place) {
  return (
    <g transform={place(p)}>
      <path d="M-40 -30 L 20 -36 L 44 -22 L -16 -16 Z" fill="#FFF0B4" {...outline} />
      <path d="M-40 -30 L -16 -16 L -16 4 L -40 -10 Z" fill="#EBCF7A" {...outline} />
      <path d="M-16 -16 L 44 -22 L 44 -2 L -16 4 Z" fill="#F4DC92" {...outline} />
      <path d="M-30 -29 L 14 -34" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
    </g>
  );
}
