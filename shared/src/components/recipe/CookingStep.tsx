"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, Check, Lightbulb, PartyPopper } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Phase, RecipeDetail, RecipeStep } from "@/lib/types";
import { PHASE_LABEL, PHASE_ORDER } from "@/lib/constants";
import { useMediaQuery } from "@/lib/hooks";
import { readPreference, writePreference } from "@/lib/services/storage";
import { cn } from "@/lib/utils";
import { TechniqueScene } from "@/components/illustrations/scenes";
import { InlineTimer } from "@/components/cooking/Timer";
import { EASE_CHEF } from "@/components/ui/Reveal";

export function StepVisual({ step, recipe, active = true }: { step: RecipeStep; recipe: RecipeDetail; active?: boolean }) {
  if (step.imageUrl) return <img src={step.imageUrl} alt={step.title} className="h-full w-full rounded-[inherit] object-cover" />;
  if (step.scene) {
    const spec = step.scene.key === "plate" ? { ...step.scene, dish: step.scene.dish ?? recipe.dish ?? "steak" } : step.scene;
    if (spec.key === "plate" && !recipe.dish && !step.scene.dish) return <NumberCard step={step} />;
    return <TechniqueScene spec={spec} active={active} className="h-full w-full" />;
  }
  return <NumberCard step={step} />;
}

function NumberCard({ step }: { step: RecipeStep }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <span className="font-serif text-[8rem] italic leading-none text-ink/15">{String(step.position).padStart(2, "0")}</span>
      <span className="eyebrow mt-2 text-muted">{PHASE_LABEL[step.phase]}</span>
    </div>
  );
}

export function PhaseRail({ phases, current, className }: { phases: Phase[]; current: Phase; className?: string }) {
  const currentIndex = phases.indexOf(current);
  return (
    <ol className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-2", className)} aria-label="Fasen van het recept">
      {phases.map((phase, i) => (
        <li key={phase} className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold transition-all duration-500",
              i === currentIndex ? "bg-ink text-ivory" : i < currentIndex ? "bg-sage/15 text-sage" : "bg-transparent text-muted",
            )}
          >
            {i < currentIndex && <Check className="size-3" strokeWidth={3} />}
            {PHASE_LABEL[phase]}
          </span>
          {i < phases.length - 1 && <span className={cn("h-px w-3 transition-colors duration-500", i < currentIndex ? "bg-sage/50" : "bg-line")} />}
        </li>
      ))}
    </ol>
  );
}

function CookingStep({
  step,
  index,
  total,
  recipe,
  onActive,
  done,
  onToggleDone,
  desktop,
}: {
  step: RecipeStep;
  index: number;
  total: number;
  recipe: RecipeDetail;
  onActive: (i: number) => void;
  done: boolean;
  onToggleDone: (id: string) => void;
  desktop: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const centered = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const visible = useInView(ref, { amount: 0.15 });

  useEffect(() => {
    if (centered) onActive(index);
  }, [centered, index, onActive]);

  return (
    <li ref={ref} id={`stap-${step.position}`} className="scroll-mt-40 border-t border-line py-12 first:border-t-0 lg:flex lg:min-h-[82vh] lg:items-center lg:py-16">
      <motion.div className="w-full" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.8, ease: EASE_CHEF }}>
        {!desktop && (
          <div className="paper-grain mb-8 aspect-[4/3] overflow-hidden rounded-[28px]" style={{ background: recipe.tone }}>
            <div className={cn("h-full w-full", step.imageUrl ? "" : "p-[4%]")}>
              <StepVisual step={step} recipe={recipe} active={visible} />
            </div>
          </div>
        )}
        <div className="flex items-end gap-4">
          <span className={cn("font-serif text-[4.2rem] italic leading-[0.8] transition-colors duration-500", done ? "text-sage" : "text-brass/80")}>{String(index + 1).padStart(2, "0")}</span>
          <span className="eyebrow pb-1 text-muted">
            {PHASE_LABEL[step.phase]} · stap {index + 1} van {total}
          </span>
        </div>
        <h3 className="mt-5 font-serif text-[clamp(2rem,3.3vw,3rem)] leading-[1.03]">{step.title}</h3>
        <p className="mt-5 max-w-xl text-[17px] leading-[1.75] text-ink-soft">{step.body}</p>
        {step.tip && (
          <aside className="mt-6 flex max-w-xl gap-3 rounded-2xl border border-brass/20 bg-brass/[0.06] p-4">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-brass" strokeWidth={1.8} />
            <p className="text-[15px] leading-relaxed text-ink-soft">
              <span className="eyebrow mr-2 text-[9.5px] text-brass">Tip van de chef</span>
              {step.tip}
            </p>
          </aside>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {step.timerSeconds ? <InlineTimer seconds={step.timerSeconds} label={step.title} /> : null}
          <button
            type="button"
            role="checkbox"
            aria-checked={done}
            onClick={() => onToggleDone(step.id)}
            className={cn(
              "inline-flex h-14 items-center gap-2.5 rounded-full border px-5 text-sm font-semibold transition-all duration-300",
              done ? "border-sage bg-sage text-white" : "border-ink/15 bg-cream hover:border-ink/35",
            )}
          >
            <span className={cn("grid size-6 place-items-center rounded-full border transition", done ? "border-white/40 bg-white/20" : "border-ink/25")}>
              <motion.span initial={false} animate={{ scale: done ? 1 : 0 }}>
                <Check className="size-3.5" strokeWidth={3} />
              </motion.span>
            </span>
            {done ? "Gedaan" : "Markeer als gedaan"}
          </button>
        </div>
      </motion.div>
    </li>
  );
}

export function CookingJourney({ recipe }: { recipe: RecipeDetail }) {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const [active, setActive] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const prefKey = `steps.${recipe.id}`;

  useEffect(() => {
    setDone(readPreference<string[]>(prefKey, []));
  }, [prefKey]);

  const toggleDone = useCallback(
    (id: string) => {
      setDone((prev) => {
        const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
        writePreference(prefKey, next);
        return next;
      });
    },
    [prefKey],
  );

  const onActive = useCallback((i: number) => setActive(i), []);
  const phases = useMemo(() => PHASE_ORDER.filter((p) => recipe.steps.some((s) => s.phase === p)), [recipe.steps]);
  const step = recipe.steps[active] ?? recipe.steps[0];
  const completed = recipe.steps.filter((s) => done.includes(s.id)).length;
  const allDone = recipe.steps.length > 0 && completed === recipe.steps.length;

  if (!step) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-line bg-cream px-5 py-3">
        <span className="text-[14px] text-muted">
          <span className="font-semibold text-ink">{completed}</span> van {recipe.steps.length} stappen gedaan
        </span>
        <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-line sm:w-60">
          <motion.div className="h-full rounded-full bg-sage" animate={{ width: `${(completed / recipe.steps.length) * 100}%` }} transition={{ type: "spring", stiffness: 160, damping: 26 }} />
        </div>
        {completed > 0 && (
          <button type="button" onClick={() => (writePreference(prefKey, []), setDone([]))} className="text-[13px] font-semibold underline-offset-4 hover:underline">
            Opnieuw beginnen
          </button>
        )}
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-4 flex flex-col gap-4 rounded-[28px] bg-ink p-6 text-ivory sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-full bg-brass">
                  <PartyPopper className="size-5" />
                </span>
                <div>
                  <p className="font-serif text-2xl">Recept voltooid</p>
                  <p className="text-[14px] text-ivory/60">Tijd om te dresseren en je bord te laten zien.</p>
                </div>
              </div>
              <Link href="#laat-je-bord-zien" className="inline-flex h-12 items-center gap-2 self-start rounded-full bg-ivory px-5 text-sm font-semibold text-ink sm:self-auto">
                Laat je bord zien <ArrowRight className="size-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 lg:grid lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {desktop && (
          <div className="relative">
            <div className="sticky top-[132px] flex h-[calc(100vh-160px)] flex-col gap-5 pb-4">
              <PhaseRail phases={phases} current={step.phase} />
              <div className="paper-grain relative flex-1 overflow-hidden rounded-[36px]" style={{ background: recipe.tone }}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={step.id}
                    className={cn("absolute", step.imageUrl ? "inset-0" : "inset-[5%] bottom-[14%]")}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.02, y: -20 }}
                    transition={{ duration: 0.65, ease: EASE_CHEF }}
                  >
                    <StepVisual step={step} recipe={recipe} />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-2xl bg-cream/85 px-5 py-3.5 backdrop-blur">
                  <span className="font-serif text-xl">
                    Stap {String(active + 1).padStart(2, "0")} <span className="text-muted">/ {String(recipe.steps.length).padStart(2, "0")}</span>
                  </span>
                  <span className="eyebrow text-[10px] text-brass">{PHASE_LABEL[step.phase]}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <ol>
          {recipe.steps.map((s, i) => (
            <CookingStep key={s.id} step={s} index={i} total={recipe.steps.length} recipe={recipe} onActive={onActive} done={done.includes(s.id)} onToggleDone={toggleDone} desktop={desktop} />
          ))}
        </ol>
      </div>
    </div>
  );
}
