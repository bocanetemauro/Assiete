"use client";

import type { ReactNode } from "react";
import type { SceneItem, SceneSpec } from "@/lib/types";
import { SCENE_LABEL } from "@/lib/constants";
import {
  Blender,
  Board,
  Bowl,
  BastingSpoon,
  Burner,
  Grater,
  KitchenTimer,
  LIQUID,
  Knife,
  Pan,
  PepperMill,
  PipingBag,
  Saucepan,
  StockPot,
  Torch,
  Tray,
  Verrine,
  Whisk,
  WoodenSpoon,
} from "./cookware";
import {
  Apples,
  ChickenBreast,
  Eggs,
  Mussels,
  Prawns,
  Asparagus,
  Berries,
  Bread,
  Burrata,
  ButterBlock,
  Carrots,
  Cauliflower,
  ChocolateBar,
  Cucumber,
  Dough,
  DuckBreast,
  FishFillet,
  Garlic,
  Herbs,
  Lemon,
  Mushrooms,
  Onion,
  Parmesan,
  Pile,
  Pumpkin,
  RiceGrains,
  Salmon,
  Scallops,
  Slices,
  Steak,
  Tomatoes,
  Truffle,
} from "./ingredients";
import { Falling, GroundShadow, INK, IllustrationFrame, LinearGradient, Sizzle, Sparkle, Steam, cos, outline, sin, useUid } from "./kit";
import { DishIllustration } from "./dishes";

type Pos = { x: number; y: number; s?: number };

/* ------------------------------------------------------------------ */
/* Kleine hulpstukken                                                  */
/* ------------------------------------------------------------------ */
function PastaRibbons({ x, y, s = 1 }: Pos) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[46, 36, 26, 16].map((r, i) => (
        <g key={r}>
          <ellipse cx={(i % 2 ? 4 : -4)} cy={-10 - i * 3} rx={r + 10} ry={(r + 10) * 0.42} fill="none" stroke={INK} strokeWidth={9.5} />
          <ellipse cx={(i % 2 ? 4 : -4)} cy={-10 - i * 3} rx={r + 10} ry={(r + 10) * 0.42} fill="none" stroke="#EFC874" strokeWidth={7} />
          <ellipse cx={(i % 2 ? 4 : -4)} cy={-10 - i * 3} rx={r + 10} ry={(r + 10) * 0.42} fill="none" stroke="#FFF0BE" strokeWidth={2} strokeDasharray="30 18" />
        </g>
      ))}
    </g>
  );
}

function PastaStrands({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      {Array.from({ length: 9 }).map((_, i) => {
        const ox = (i - 4) * 18;
        return (
          <g key={i}>
            <path d={`M${cx + ox - 30} ${cy + 4 + (i % 3) * 5} q 15 -12 30 0 t 30 0 t 30 0`} fill="none" stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
            <path d={`M${cx + ox - 30} ${cy + 4 + (i % 3) * 5} q 15 -12 30 0 t 30 0 t 30 0`} fill="none" stroke="#F2D38A" strokeWidth={3.2} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

function Tart({ cx, cy, meringue = false, toasted = false, filled = true }: { cx: number; cy: number; meringue?: boolean; toasted?: boolean; filled?: boolean }) {
  const id = useUid();
  const rx = 150;
  const ry = 50;
  return (
    <g>
      <defs>
        <LinearGradient id={`${id}p`} x2={1} y2={0} stops={[[0, "#B4773A"], [0.4, "#E8B36E"], [1, "#9A6128"]]} />
        <LinearGradient
          id={`${id}c`}
          x2={1}
          y2={1}
          stops={filled ? [[0, "#FFF09A"], [0.6, "#F7D445"], [1, "#DDAE1A"]] : [[0, "#F4D3A0"], [0.6, "#E3AE6C"], [1, "#C18644"]]}
        />
      </defs>
      <GroundShadow cx={cx + 12} cy={cy + 34} rx={rx * 1.1} ry={ry * 0.9} />
      <path d={`M${cx - rx} ${cy} L${cx - rx} ${cy + 26} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy + 26} L${cx + rx} ${cy} Z`} fill={`url(#${id}p)`} {...outline} />
      {Array.from({ length: 16 }).map((_, i) => {
        const t = i / 15;
        const px = cx - rx + t * rx * 2;
        const u = (px - cx) / rx;
        const py = cy + 26 + Math.sqrt(Math.max(0, 1 - u * u)) * ry;
        return <line key={i} x1={px} y1={py - 26} x2={px} y2={py} stroke="#7A4A1C" strokeWidth={1.3} opacity={0.55} />;
      })}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#D9A15C" {...outline} />
      <ellipse cx={cx} cy={cy + 2} rx={rx - 14} ry={ry - 8} fill={`url(#${id}c)`} stroke={INK} strokeWidth={1.4} />
      <ellipse cx={cx - 50} cy={cy - 10} rx={40} ry={9} fill="#FFFFFF" opacity={0.45} />
      {meringue &&
        Array.from({ length: 11 }).map((_, i) => {
          const a = (i / 11) * Math.PI * 2;
          const mx = cx + cos(a) * 88;
          const my = cy + sin(a) * 26;
          return <MeringuePeak key={i} x={mx} y={my} toasted={toasted} delay={i * 0.2} />;
        })}
      {meringue && <MeringuePeak x={cx} y={cy} toasted={toasted} delay={1} />}
    </g>
  );
}

function MeringuePeak({ x, y, toasted, delay = 0, grow = false }: { x: number; y: number; toasted?: boolean; delay?: number; grow?: boolean }) {
  const body = (
    <g>
      <path d="M-18 4 C -20 -10 -10 -16 -6 -22 C -2 -30 0 -38 2 -44 C 4 -36 8 -28 10 -22 C 16 -14 22 -8 18 4 Q 0 12 -18 4 Z" fill="#FFFDF8" {...outline} strokeWidth={1.8} />
      <path d="M-12 -2 C -4 -8 6 -8 12 -2 M -6 -18 C 0 -22 4 -22 8 -18" stroke={INK} strokeWidth={1} fill="none" opacity={0.35} />
      {toasted && (
        <path
          className="a-toast"
          style={{ animationDelay: `${delay}s` }}
          d="M-6 -22 C -2 -30 0 -38 2 -44 C 4 -36 8 -28 10 -22 C 4 -18 -2 -18 -6 -22 Z"
          fill="#B8742E"
          opacity={0.85}
        />
      )}
      {toasted && <path d="M-6 -22 C -2 -30 0 -38 2 -44 C 3 -40 4 -36 5 -34 C 2 -32 -2 -28 -6 -22 Z" fill="#8A4E1A" opacity={0.7} />}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y})`}>
      {grow ? (
        <g className="a-grow o-bottom" style={{ animationDelay: `${delay}s` }}>
          {body}
        </g>
      ) : (
        body
      )}
    </g>
  );
}

function Badge({ x, y, label }: { x: number; y: number; label: string }) {
  const w = label.length * 8.4 + 26;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-16} width={w} height={32} rx={16} fill="#1F1A17" />
      <text x={0} y={5.5} textAnchor="middle" fontFamily="var(--font-manrope), sans-serif" fontSize={14} fontWeight={700} fill="#F3E6CC" letterSpacing={0.5}>
        {label}
      </text>
    </g>
  );
}

function IceCubes({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      {[
        [-50, -6, 10],
        [40, -10, -14],
        [-6, 4, 24],
        [70, 4, 6],
        [-80, 4, -20],
      ].map(([dx, dy, rot], i) => (
        <g key={i} transform={`translate(${cx + dx} ${cy + dy}) rotate(${rot})`}>
          <rect x={-14} y={-12} width={28} height={24} rx={6} fill="#EAF6FA" fillOpacity={0.85} stroke="#7FA7B5" strokeWidth={1.5} />
          <path d="M-8 -6 L 2 -7" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

function Snowflake({ x, y, size = 14, delay = 0 }: { x: number; y: number; size?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="a-frost" style={{ animationDelay: `${delay}s` }}>
        {[0, 60, 120].map((rot) => (
          <g key={rot} transform={`rotate(${rot})`}>
            <line x1={0} y1={-size} x2={0} y2={size} stroke="#6FA3C0" strokeWidth={2} strokeLinecap="round" />
            <path d={`M-4 ${-size + 5} L 0 ${-size + 9} L 4 ${-size + 5} M -4 ${size - 5} L 0 ${size - 9} L 4 ${size - 5}`} stroke="#6FA3C0" strokeWidth={1.6} fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Item-mapping                                                        */
/* ------------------------------------------------------------------ */
function Whole({ item, x, y, s = 1 }: Pos & { item?: SceneItem }) {
  switch (item) {
    case "steak":
      return <Steak x={x} y={y} s={s} />;
    case "fish":
      return <FishFillet x={x} y={y} s={s} />;
    case "salmon":
      return <Salmon x={x} y={y} s={s} />;
    case "scallops":
      return <Scallops x={x} y={y} s={s} />;
    case "duck":
      return <DuckBreast x={x} y={y} s={s} />;
    case "mushrooms":
      return <Mushrooms x={x} y={y} s={s} />;
    case "carrot":
      return <Carrots x={x} y={y} s={s} />;
    case "pumpkin":
      return <Pumpkin x={x} y={y} s={s} />;
    case "pasta":
      return <PastaRibbons x={x} y={y} s={s} />;
    case "rice":
      return <RiceGrains x={x} y={y} s={s} />;
    case "onion":
      return <Onion x={x} y={y} s={s} />;
    case "shallot":
      return <Onion variant="shallot" x={x} y={y} s={s} />;
    case "garlic":
      return <Garlic x={x} y={y} s={s} />;
    case "herbs":
      return <Herbs kind="rosemary" x={x} y={y} s={s} />;
    case "sage":
      return <Herbs kind="sage" x={x} y={y} s={s} />;
    case "tomato":
      return <Tomatoes x={x} y={y} s={s} />;
    case "cucumber":
      return <Cucumber x={x} y={y} s={s} />;
    case "cauliflower":
      return <Cauliflower x={x} y={y} s={s} />;
    case "lemon":
      return <Lemon x={x} y={y} s={s} />;
    case "chocolate":
      return <ChocolateBar x={x} y={y} s={s} />;
    case "burrata":
      return <Burrata x={x} y={y} s={s} />;
    case "bread":
      return <Bread x={x} y={y} s={s} />;
    case "dough":
      return <Dough x={x} y={y} s={s} />;
    case "parmesan":
      return <Parmesan x={x} y={y} s={s} />;
    case "truffle":
      return <Truffle x={x} y={y} s={s} />;
    case "vegetables":
      return (
        <g>
          <Carrots x={x - 30} y={y} s={s * 0.8} />
          <Onion variant="shallot" x={x + 70} y={y + 6} s={s * 0.7} />
          <Herbs kind="thyme" x={x + 110} y={y + 10} s={s * 0.6} />
        </g>
      );
    case "prawns":
      return <Prawns x={x} y={y} s={s} />;
    case "chicken":
      return <ChickenBreast x={x} y={y} s={s} />;
    case "egg":
      return <Eggs x={x} y={y} s={s} />;
    case "apple":
      return <Apples x={x} y={y} s={s} />;
    case "mussels":
      return <Mussels x={x} y={y} s={s} />;
    default:
      return <Garlic x={x} y={y} s={s} />;
  }
}

function Cut({ item, x, y, s = 1 }: Pos & { item?: SceneItem }) {
  switch (item) {
    case "onion":
      return <Onion state="half" x={x} y={y} s={s} />;
    case "shallot":
      return <Onion variant="shallot" state="half" x={x} y={y} s={s} />;
    case "tomato":
      return <Tomatoes state="half" x={x} y={y} s={s * 0.8} />;
    case "lemon":
      return <Lemon state="half" x={x} y={y} s={s} />;
    case "pumpkin":
      return <Pumpkin state="half" x={x} y={y} s={s * 0.8} />;
    case "herbs":
    case "sage":
      return <Herbs kind="parsley" x={x} y={y} s={s * 0.9} />;
    default:
      return <Whole item={item} x={x} y={y} s={s * 0.8} />;
  }
}

type PileKind = Parameters<typeof Pile>[0]["kind"];
const PILE_FOR: Partial<Record<SceneItem, PileKind>> = {
  onion: "onion",
  shallot: "shallot",
  garlic: "garlic",
  herbs: "herbs",
  sage: "herbs",
  tomato: "tomato",
  cucumber: "cucumber",
  cauliflower: "cauliflower",
  chocolate: "chocolate",
  pumpkin: "pumpkin",
  carrot: "carrot",
  mushrooms: "mushrooms",
  lemon: "lemon",
  parmesan: "parmesan",
  truffle: "truffle",
  vegetables: "vegetables",
};

function InPan({ item, x, y, s = 1 }: Pos & { item?: SceneItem }) {
  switch (item) {
    case "fish":
      return <FishFillet state="seared" x={x} y={y} s={s * 0.95} />;
    case "salmon":
      return <Salmon state="seared" x={x} y={y} s={s * 0.9} />;
    case "scallops":
      return <Scallops state="seared" x={x} y={y} s={s * 1.1} />;
    case "duck":
      return <DuckBreast state="seared" x={x} y={y} s={s * 0.95} />;
    case "mushrooms":
      return <Mushrooms state="seared" x={x} y={y} s={s * 0.95} />;
    case "rice":
      return <RiceGrains x={x} y={y} s={s * 1.4} />;
    case "potato":
      return <Scallops state="seared" count={3} x={x} y={y} s={s * 1.35} />;
    case "prawns":
      return <Prawns state="cooked" x={x} y={y} s={s * 0.95} />;
    case "chicken":
      return <ChickenBreast state="seared" x={x} y={y + 10} s={s * 0.95} />;
    case "apple":
      return <Apples state="sliced" x={x} y={y} s={s} />;
    case "mussels":
      return <Mussels open x={x} y={y} s={s} />;
    case "egg":
      return <Eggs x={x} y={y} s={s} />;
    case "bread":
      return <Bread state="toasted" x={x} y={y} s={s} />;
    case "pasta":
      return <PastaRibbons x={x} y={y} s={s} />;
    case "sage":
    case "herbs":
      return (
        <g>
          <Herbs kind="sage" x={x - 20} y={y - 6} s={s * 0.9} />
          <Pile kind="pumpkin" x={x + 50} y={y + 4} count={10} spread={24} />
        </g>
      );
    case "vegetables":
    case "pumpkin":
      return <Pile kind={item === "pumpkin" ? "pumpkin" : "vegetables"} x={x} y={y} count={30} spread={70} />;
    default:
      return <Steak state="seared" x={x} y={y + 10} s={s * 0.95} />;
  }
}

/* ------------------------------------------------------------------ */
/* Scènes                                                              */
/* ------------------------------------------------------------------ */
function PrepScene({ item }: { item?: SceneItem }) {
  const timed = item === "steak" || item === "duck" || item === "burrata" || item === "fish" || item === "salmon" || item === "scallops";
  return (
    <g>
      <Bowl cx={86} cy={176} r={34} tone="egg-white" contentLevel={0.8} />
      <Bowl cx={398} cy={170} r={30} tone="soy" contentLevel={0.8} />
      <Board cx={240} cy={268} w={410} d={100} />
      <Whole item={item} x={222} y={276} s={1.12} />
      <Herbs kind="thyme" x={400} y={296} s={0.55} r={70} />
      {timed ? <KitchenTimer x={84} y={282} r={26} /> : <Garlic x={80} y={292} s={0.55} />}
      <Sparkle x={300} y={196} size={7} delay={0.4} />
      <Sparkle x={150} y={214} size={5} delay={1.2} />
    </g>
  );
}

function ChopScene({ item }: { item?: SceneItem }) {
  const kind = (item && PILE_FOR[item]) ?? "onion";
  return (
    <g>
      <Board cx={240} cy={268} w={420} d={104} />
      <Pile kind={kind} x={170} y={276} spread={62} count={30} />
      <Cut item={item} x={338} y={276} s={0.95} />
      <g transform="translate(104 212) rotate(10)">
        <Knife x={0} y={0} className="a-chop o-left" scale={0.92} />
      </g>
    </g>
  );
}

function SeasonScene({ item }: { item?: SceneItem }) {
  return (
    <g>
      <Board cx={240} cy={272} w={410} d={100} />
      <Whole item={item} x={218} y={280} s={1.1} />
      <PepperMill x={336} y={132} rotate={28} className="a-tilt" />
      <Falling x={318} y={148} w={26} count={9} fall={90} color="#2A211C" shape="dot" />
      <Falling x={170} y={96} w={70} count={12} fall={130} color="#FFFFFF" shape="flake" />
      <Bowl cx={120} cy={96} r={40} tone="egg-white" contentLevel={0.9} />
      <Sparkle x={150} y={70} size={6} delay={0.6} />
    </g>
  );
}

function HeatScene({ oil = true, children }: { oil?: boolean; children?: ReactNode }) {
  return (
    <g>
      <Burner cx={200} cy={262} w={112} />
      <Pan cx={200} cy={196} r={132} oil={oil}>
        {children}
      </Pan>
    </g>
  );
}

function HeatOnly() {
  return (
    <g>
      <HeatScene oil />
      {[150, 200, 250].map((hx, i) => (
        <g key={hx} transform={`translate(${hx} 150)`}>
          <path
            className="a-shimmer"
            style={{ animationDelay: `${i * 0.5}s` }}
            d="M0 0 C -10 -12 10 -24 0 -36 C -10 -48 10 -60 0 -72"
            stroke="#C9A06A"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
      <Sparkle x={170} y={200} size={6} />
      <Sparkle x={236} y={210} size={4.5} delay={0.8} />
      <Badge x={380} y={70} label="200°C" />
    </g>
  );
}

function SearScene({ item }: { item?: SceneItem }) {
  return (
    <g>
      <HeatScene oil>
        <InPan item={item} x={200} y={214} />
      </HeatScene>
      <Sizzle x={200} y={176} w={200} count={11} />
      <Steam x={200} y={150} count={3} spread={40} scale={1.1} />
    </g>
  );
}

function BasteScene({ item }: { item?: SceneItem }) {
  return (
    <g>
      <HeatScene oil>
        <InPan item={item} x={196} y={214} />
        <g>
          {Array.from({ length: 14 }).map((_, i) => (
            <ellipse
              key={i}
              cx={110 + ((i * 47) % 180)}
              cy={214 + ((i * 13) % 20)}
              rx={6}
              ry={3}
              fill="#F7E3A6"
              stroke="#B89040"
              strokeWidth={0.8}
              className="a-bubble"
              style={{ animationDelay: `${(i * 0.21) % 2}s` }}
            />
          ))}
        </g>
        <Herbs kind="rosemary" x={286} y={214} s={0.5} r={-10} />
        <Garlic x={110} y={218} s={0.5} />
      </HeatScene>
      <g transform="translate(250 30)">
        <BastingSpoon x={0} y={0} rotate={18} className="a-baste" />
      </g>
      <Sizzle x={200} y={180} w={180} count={8} />
      <Steam x={180} y={140} count={2} spread={50} />
    </g>
  );
}

function RestScene({ item }: { item?: SceneItem }) {
  return (
    <g>
      <Board cx={230} cy={270} w={400} d={100} />
      {item === "duck" ? <DuckBreast state="seared" x={220} y={282} s={1.05} /> : item === "salmon" ? <Salmon state="seared" x={220} y={280} /> : <Steak state="seared" x={220} y={290} s={1.1} />}
      <Herbs kind="rosemary" x={120} y={300} s={0.5} r={-20} />
      <Steam x={220} y={200} count={3} spread={34} />
      <KitchenTimer x={400} y={170} r={34} />
    </g>
  );
}

function SliceScene({ item }: { item?: SceneItem }) {
  if (item === "salmon") {
    return (
      <g>
        <Board cx={240} cy={270} w={420} d={104} />
        <g transform="translate(160 280)">
          {Array.from({ length: 5 }).map((_, i) => (
            <g key={i} transform={`translate(${(i - 2) * 28} 0) rotate(-8)`}>
              <rect x={-12} y={-34} width={22} height={40} rx={4} fill="#9A5A30" {...outline} />
              <rect x={-8} y={-30} width={14} height={32} rx={3} fill="#F57A4A" />
              <path d="M-6 -26 L 4 -4" stroke="#FFE7D9" strokeWidth={2} />
            </g>
          ))}
        </g>
        <Salmon state="seared" x={346} y={286} s={0.62} />
        <g transform="translate(196 196) rotate(4)">
          <Knife x={0} y={0} className="a-slide" scale={0.9} />
        </g>
      </g>
    );
  }
  return (
    <g>
      <Board cx={240} cy={270} w={420} d={104} />
      <Slices kind={item === "duck" ? "duck" : "steak"} x={180} y={282} />
      {item === "duck" ? <DuckBreast state="seared" x={346} y={286} s={0.55} /> : <Steak state="seared" x={350} y={292} s={0.6} />}
      <g transform="translate(210 188) rotate(6)">
        <Knife x={0} y={0} className="a-slide" scale={0.9} />
      </g>
    </g>
  );
}

function SimmerScene({ tone = "cream", item }: { tone?: SceneSpec["tone"]; item?: SceneItem }) {
  return (
    <g>
      <Burner cx={260} cy={286} w={108} />
      <Saucepan cx={260} cy={158} r={104} h={92} tone={tone}>
        {item === "rice" && <RiceGrains x={260} y={170} s={1.2} />}
        {item === "pasta" && <PastaRibbons x={256} y={178} s={0.85} />}
      </Saucepan>
      {item === "cauliflower" && <Pile kind="cauliflower" x={250} y={170} count={14} spread={50} />}
      <g transform="translate(318 -2)">
        <WoodenSpoon x={0} y={0} rotate={30} className="a-stir" />
      </g>
      <Steam x={240} y={118} count={3} spread={34} />
      {tone === "berry" && <Berries kind="blueberry" x={74} y={318} count={6} />}
      {tone === "cherry" && <Berries kind="cherry" x={74} y={318} count={5} />}
      {(tone === "butter" || tone === "brown-butter") && <ButterBlock x={80} y={318} s={0.8} />}
    </g>
  );
}

function BoilScene({ item }: { item?: SceneItem }) {
  let content: ReactNode = null;
  if (item === "pasta") content = <PastaStrands cx={240} cy={146} />;
  else if (item === "vegetables" || item === "carrot") content = <Asparagus x={240} y={152} s={0.9} />;
  else if (item === "pumpkin" || item === "cauliflower") content = <Pile kind={item} x={240} y={156} count={18} spread={70} />;
  else if (item === "rice") content = <RiceGrains x={240} y={156} s={1.4} />;
  else if (item) content = <Pile kind="vegetables" x={240} y={156} count={16} spread={70} />;
  return (
    <g>
      <Burner cx={240} cy={300} w={120} />
      <StockPot cx={240} cy={140} r={120} h={126}>
        {content}
      </StockPot>
      <Steam x={240} y={116} count={4} spread={40} scale={1.3} />
      <g transform="translate(410 330)">
        <path d="M-26 -6 L 26 -6 L 20 6 L -20 6 Z" fill="#FFFFFF" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        <text x={0} y={-12} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK} fontFamily="var(--font-manrope), sans-serif">
          ZOUT
        </text>
      </g>
    </g>
  );
}

function WhiskScene({ tone = "cream" }: { tone?: SceneSpec["tone"] }) {
  const [light, , dark] = LIQUID[tone ?? "cream"];
  return (
    <g>
      <Bowl cx={240} cy={196} r={138} material="steel" tone={tone} contentLevel={0.5} />
      <g transform="translate(262 34) rotate(14)">
        <Whisk x={0} y={0} className="a-whisk" />
      </g>
      {[
        [170, 170],
        [320, 176],
        [210, 158],
      ].map(([sx, sy], i) => (
        <circle key={i} cx={sx} cy={sy} r={4} fill={light} stroke={dark} strokeWidth={1} className="a-sizzle" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
    </g>
  );
}

function RoastScene({ item }: { item?: SceneItem }) {
  return (
    <g>
      <Tray cx={240} cy={246} w={410} d={140}>
        {item === "pumpkin" || item === "chocolate" ? (
          <Pile kind={item} x={240} y={254} count={item === "chocolate" ? 60 : 40} spread={150} />
        ) : item === "dough" ? (
          <Tart cx={240} cy={236} filled={false} />
        ) : (
          <g>
            <Carrots x={160} y={250} s={0.85} />
            <Pile kind="vegetables" x={300} y={254} count={22} spread={80} />
            <Herbs kind="thyme" x={96} y={262} s={0.5} r={60} />
          </g>
        )}
      </Tray>
      {[160, 240, 320].map((hx, i) => (
        <g key={hx} transform={`translate(${hx} 172)`}>
          <path
            className="a-shimmer"
            style={{ animationDelay: `${i * 0.6}s` }}
            d="M0 0 C -10 -12 10 -24 0 -36 C -10 -48 10 -60 0 -72"
            stroke="#D29A5A"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
      <Badge x={392} y={70} label="200°C" />
    </g>
  );
}

function BlendScene({ tone = "herb", item }: { tone?: SceneSpec["tone"]; item?: SceneItem }) {
  return (
    <g>
      <Blender cx={220} top={26} tone={tone} />
      {tone === "herb" && <Herbs kind="basil" x={392} y={318} s={0.9} />}
      {tone === "pumpkin" && <Pile kind="pumpkin" x={392} y={318} count={14} spread={40} />}
      {tone === "cream" && (item === "cauliflower" ? <Cauliflower x={392} y={324} s={0.7} /> : <Pile kind="cauliflower" x={392} y={318} count={12} spread={40} />)}
      {tone === "risotto" && <Pile kind="cauliflower" x={392} y={318} count={12} spread={40} />}
    </g>
  );
}

function MeltScene() {
  return (
    <g>
      <Burner cx={240} cy={302} w={110} />
      <Saucepan cx={240} cy={212} r={100} h={70} tone="broth" bubbles={false} />
      <Bowl cx={240} cy={150} r={128} material="glass" tone="chocolate" contentLevel={0.4} shadow={false}>
        <Pile kind="chocolate" x={250} y={158} count={16} spread={60} />
      </Bowl>
      <Steam x={100} y={206} count={2} spread={20} />
      <Steam x={382} y={206} count={2} spread={20} delay={0.8} />
      <g transform="translate(300 -6)">
        <WoodenSpoon x={0} y={0} rotate={24} className="a-stir" />
      </g>
    </g>
  );
}

function ChillScene({ item }: { item?: SceneItem }) {
  const id = useUid();
  return (
    <g>
      <defs>
        <radialGradient id={`${id}c`}>
          <stop offset="0%" stopColor="#E3F1F7" />
          <stop offset="100%" stopColor="#E3F1F7" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={240} cy={200} r={180} fill={`url(#${id}c)`} />
      {item === "salmon" ? (
        <g>
          <Bowl cx={240} cy={190} r={140} material="glass" tone="egg-white" contentLevel={0.4}>
            <Salmon state="seared" x={240} y={214} s={0.85} />
            <IceCubes cx={240} cy={206} />
          </Bowl>
        </g>
      ) : item === "dough" ? (
        <g>
          <Dough x={240} y={290} s={1.4} />
          <path d="M130 240 C 170 200 320 200 350 246" stroke="#BFD6DF" strokeWidth={3} fill="none" opacity={0.8} />
        </g>
      ) : item === "lemon" ? (
        <Tart cx={240} cy={250} />
      ) : (
        <g>
          <Verrine cx={170} cy={300} layers={["#3A2016", "#6A4030", "#FFF4DC"]} />
          <Verrine cx={290} cy={300} w={94} h={128} layers={["#4A2A1C", "#6A4030", "#8A5A40"]} />
        </g>
      )}
      <Snowflake x={90} y={90} size={16} />
      <Snowflake x={390} y={110} size={12} delay={1} />
      <Snowflake x={400} y={250} size={10} delay={1.8} />
      <Badge x={96} y={318} label="4°C" />
    </g>
  );
}

function GrateScene({ item }: { item?: SceneItem }) {
  const kind = item === "lemon" ? "lemon" : item === "truffle" ? "truffle" : "parmesan";
  const color = kind === "lemon" ? "#F5D63D" : kind === "truffle" ? "#5A4A40" : "#F3DE9E";
  return (
    <g>
      <Board cx={240} cy={290} w={340} d={80} />
      <Pile kind={kind} x={226} y={292} count={36} spread={56} />
      <Falling x={226} y={186} w={60} count={12} fall={80} color={color} shape={kind === "truffle" ? "flake" : "shred"} />
      <g transform="translate(96 222) rotate(-30)">
        <Grater x={0} y={0} />
        <g className="a-slide">
          {kind === "lemon" ? <Lemon x={120} y={-8} s={0.62} /> : kind === "truffle" ? <Truffle x={118} y={-8} s={0.7} /> : <Parmesan x={118} y={-6} s={0.66} />}
        </g>
      </g>
    </g>
  );
}

function PipeScene() {
  return (
    <g>
      <Tart cx={240} cy={262} />
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return <MeringuePeak key={i} x={240 + cos(a) * 84} y={262 + sin(a) * 24} grow delay={i * 0.3} />;
      })}
      <g transform="translate(240 206)">
        <PipingBag x={0} y={0} className="a-pipe" />
      </g>
    </g>
  );
}

function TorchScene() {
  return (
    <g>
      <Tart cx={220} cy={262} meringue toasted />
      <Torch x={420} y={146} rotate={-24} />
      <Sparkle x={140} y={200} size={6} delay={0.4} />
    </g>
  );
}

export function TechniqueScene({
  spec,
  active = true,
  className,
  title,
}: {
  spec: SceneSpec;
  active?: boolean;
  className?: string;
  title?: string;
}) {
  if (spec.key === "plate") {
    return <DishIllustration dish={spec.dish ?? "steak"} mode="loop" active={active} className={className} title={title ?? SCENE_LABEL.plate} />;
  }
  let body: ReactNode;
  switch (spec.key) {
    case "prep":
      body = <PrepScene item={spec.item} />;
      break;
    case "chop":
      body = <ChopScene item={spec.item} />;
      break;
    case "season":
      body = <SeasonScene item={spec.item} />;
      break;
    case "heat":
      body = <HeatOnly />;
      break;
    case "sear":
      body = <SearScene item={spec.item} />;
      break;
    case "baste":
      body = <BasteScene item={spec.item} />;
      break;
    case "rest":
      body = <RestScene item={spec.item} />;
      break;
    case "slice":
      body = <SliceScene item={spec.item} />;
      break;
    case "simmer":
      body = <SimmerScene tone={spec.tone} item={spec.item} />;
      break;
    case "boil":
      body = <BoilScene item={spec.item} />;
      break;
    case "whisk":
      body = <WhiskScene tone={spec.tone} />;
      break;
    case "roast":
      body = <RoastScene item={spec.item} />;
      break;
    case "blend":
      body = <BlendScene tone={spec.tone} item={spec.item} />;
      break;
    case "melt":
      body = <MeltScene />;
      break;
    case "chill":
      body = <ChillScene item={spec.item} />;
      break;
    case "grate":
      body = <GrateScene item={spec.item} />;
      break;
    case "pipe":
      body = <PipeScene />;
      break;
    case "torch":
      body = <TorchScene />;
      break;
    default:
      body = <PrepScene item={spec.item} />;
  }
  return (
    <IllustrationFrame viewBox="0 0 480 360" active={active} className={className} title={title ?? SCENE_LABEL[spec.key]}>
      {body}
    </IllustrationFrame>
  );
}
