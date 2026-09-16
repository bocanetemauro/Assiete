"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { DishArt, PlatingStep, RecipeDetail } from "@/lib/types";
import { PLATING_PRINCIPLES, PLATING_STAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { DishIllustration } from "@/components/illustrations/dishes";
import { Reveal } from "@/components/ui/Reveal";

const INK = "#2A211C";

/* ------------------------------------------------------------------ */
/* Mini-diagrammen bij de principes                                    */
/* ------------------------------------------------------------------ */
function PrincipleDiagram({ kind }: { kind: (typeof PLATING_PRINCIPLES)[number]["key"] }) {
  const plate = (
    <>
      <circle cx={60} cy={60} r={50} fill="#FFFDF9" stroke={INK} strokeWidth={1.6} />
      <circle cx={60} cy={60} r={35} fill="none" stroke={INK} strokeOpacity={0.15} strokeWidth={1.2} />
    </>
  );
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      {kind === "space" && (
        <g>
          {plate}
          <path d="M60 25 A 35 35 0 0 0 25 60" fill="none" stroke="#A07A44" strokeWidth={1.4} strokeDasharray="3 4" />
          <ellipse cx={74} cy={72} rx={16} ry={10} fill="#6A1E2A" stroke={INK} strokeWidth={1.2} transform="rotate(-30 74 72)" />
          <circle cx={58} cy={82} r={4} fill="#66745A" stroke={INK} strokeWidth={1} />
          <circle cx={88} cy={60} r={3} fill="#A07A44" stroke={INK} strokeWidth={1} />
        </g>
      )}
      {kind === "offcenter" && (
        <g>
          {plate}
          {[43.3, 76.6].map((v) => (
            <g key={v} stroke="#A07A44" strokeOpacity={0.7} strokeWidth={1} strokeDasharray="2 3">
              <line x1={v} y1={18} x2={v} y2={102} />
              <line x1={18} y1={v} x2={102} y2={v} />
            </g>
          ))}
          <circle cx={76.6} cy={43.3} r={11} fill="#6A1E2A" stroke={INK} strokeWidth={1.2} />
          <path d="M40 80 C 52 70 64 58 72 52" stroke="#4A2C6A" strokeWidth={5} strokeLinecap="round" fill="none" />
        </g>
      )}
      {kind === "colors" && (
        <g>
          {plate}
          <path d="M36 74 C 50 54 70 46 88 50" stroke="#6A1E2A" strokeWidth={7} strokeLinecap="round" fill="none" />
          <circle cx={62} cy={62} r={9} fill="#E2A24C" stroke={INK} strokeWidth={1.2} />
          <circle cx={48} cy={48} r={4} fill="#66745A" stroke={INK} strokeWidth={1} />
          <circle cx={80} cy={72} r={4} fill="#66745A" stroke={INK} strokeWidth={1} />
          {["#6A1E2A", "#E2A24C", "#66745A"].map((c, i) => (
            <rect key={c} x={39 + i * 15} y={113} width={12} height={5} rx={2.5} fill={c} />
          ))}
        </g>
      )}
      {kind === "height" && (
        <g>
          <ellipse cx={60} cy={92} rx={50} ry={11} fill="#FFFDF9" stroke={INK} strokeWidth={1.6} />
          <rect x={44} y={70} width={30} height={16} rx={4} fill="#E2A24C" stroke={INK} strokeWidth={1.2} />
          <rect x={40} y={56} width={36} height={14} rx={6} fill="#B8604A" stroke={INK} strokeWidth={1.2} />
          <path d="M60 56 C 56 44 64 36 60 26" stroke="#66745A" strokeWidth={3} strokeLinecap="round" fill="none" />
          <path d="M60 36 l -8 -6 M 60 42 l 8 -5" stroke="#66745A" strokeWidth={2} strokeLinecap="round" />
          <path d="M96 84 L 96 30 M 90 38 L 96 30 L 102 38" stroke="#A07A44" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export function PlatingPrinciples({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {PLATING_PRINCIPLES.map((p, i) => (
        <Reveal key={p.key} delay={i * 0.07} className="h-full">
          <article className="group flex h-full flex-col rounded-[26px] border border-line bg-cream p-6 transition duration-500 hover:-translate-y-1 hover:shadow-card">
            <div className="size-24 transition-transform duration-700 ease-chef group-hover:rotate-[-8deg]">
              <PrincipleDiagram kind={p.key} />
            </div>
            <h4 className="mt-5 font-serif text-[1.65rem] leading-tight">{p.title}</h4>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{p.body}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Interactieve stapper                                                */
/* ------------------------------------------------------------------ */
export function PlatingStepper({ dish, steps, tone = "#EEE7DC", className }: { dish: DishArt; steps?: PlatingStep[]; tone?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [stage, setStage] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!inView || !auto) return;
    const timer = window.setInterval(() => setStage((s) => (s >= 5 ? 0 : s + 1)), 2300);
    return () => window.clearInterval(timer);
  }, [inView, auto]);

  const list = PLATING_STAGES.map((s) => ({ ...s, body: steps?.find((p) => p.stage === s.stage)?.body }));

  return (
    <div ref={ref} className={cn("grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14", className)}>
      <ol className="order-2 space-y-2 lg:order-1">
        {list.map((s) => {
          const active = s.stage === stage;
          return (
            <li key={s.stage}>
              <button
                type="button"
                onClick={() => {
                  setAuto(false);
                  setStage(s.stage);
                }}
                className={cn("group flex w-full gap-5 rounded-3xl p-4 text-left transition-colors duration-500 md:p-5", active ? "bg-cream shadow-card" : "hover:bg-cream/60")}
                aria-current={active ? "step" : undefined}
              >
                <span className={cn("grid size-11 shrink-0 place-items-center rounded-full border font-serif text-lg italic transition-colors duration-500", active ? "border-ink bg-ink text-ivory" : "border-line text-muted")}>
                  {s.stage + 1}
                </span>
                <span className="min-w-0 pt-1.5">
                  <span className={cn("block font-serif text-[1.45rem] leading-tight transition-colors", active ? "text-ink" : "text-ink/60")}>{s.title}</span>
                  <AnimatePresence initial={false}>
                    {active && s.body && (
                      <motion.span className="block overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                        <span className="block pt-2 text-[15px] leading-relaxed text-muted">{s.body}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="order-1 lg:order-2">
        <div className="paper-grain relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-[40px]" style={{ background: tone }}>
          <div className="absolute inset-[7%]">
            <DishIllustration dish={dish} stage={stage} animated className="h-full w-full" />
          </div>
          <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-2xl bg-cream/80 px-4 py-3 backdrop-blur">
            <span className="eyebrow text-[9.5px] text-muted">Stap {stage + 1} / 6</span>
            <span className="font-serif text-lg">{PLATING_STAGES[stage].short}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Volledige plating-sectie op de receptpagina                         */
/* ------------------------------------------------------------------ */
export function PlatingGuide({ recipe }: { recipe: RecipeDetail }) {
  return (
    <div className="space-y-16">
      {recipe.dish && recipe.platingSteps.length > 0 ? (
        <>
          <PlatingStepper dish={recipe.dish} steps={recipe.platingSteps} tone={recipe.tone} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {recipe.platingSteps.map((step) => (
              <Reveal key={step.id} delay={step.stage * 0.06}>
                <figure className="rounded-3xl border border-line bg-cream p-3">
                  <div className="aspect-square rounded-2xl" style={{ background: recipe.tone }}>
                    <DishIllustration dish={recipe.dish!} stage={step.stage} showSmudges={step.stage === 4} className="h-full w-full p-2" />
                  </div>
                  <figcaption className="px-1 pb-1 pt-3">
                    <span className="eyebrow text-[9px] text-brass">Stap {step.stage + 1}</span>
                    <span className="mt-1 block text-[13.5px] font-semibold leading-snug">{step.title}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </>
      ) : (
        <div className="grid gap-8 rounded-[32px] border border-line bg-cream p-8 md:grid-cols-[auto_1fr] md:p-10">
          <span className="grid size-14 place-items-center rounded-full bg-paper text-brass">
            <Lightbulb className="size-6" />
          </span>
          <div>
            <p className="eyebrow text-brass">Zo werd dit gerecht opgemaakt</p>
            <p className="mt-3 font-serif text-[1.8rem] leading-snug">{recipe.platingNotes ?? "De auteur heeft nog geen plating-notities toegevoegd. Gebruik de principes hieronder als leidraad."}</p>
          </div>
        </div>
      )}
      <div>
        <p className="eyebrow mb-6 text-muted">Principes van een chef</p>
        <PlatingPrinciples />
      </div>
    </div>
  );
}
