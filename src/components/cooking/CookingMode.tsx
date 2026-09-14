"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Lightbulb, ListChecks, Plus, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { RecipeDetail, RecipeStep } from "@/lib/types";
import { PHASE_LABEL } from "@/lib/constants";
import { useWakeLock } from "@/lib/hooks";
import { useKitchen } from "@/lib/store/kitchen";
import { clamp, cn, formatTimer } from "@/lib/utils";
import { StepVisual } from "@/components/recipe/CookingStep";
import { RecipeVisual } from "@/components/recipe/RecipeVisual";
import { ServingsStepper, formatAmount, groupIngredients } from "@/components/recipe/IngredientList";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { EASE_CHEF } from "@/components/ui/Reveal";
import { TimerRing, playChime, useCountdown } from "./Timer";

function BigTimer({ seconds, label }: { seconds: number; label: string }) {
  const toast = useToast();
  const timer = useCountdown(seconds, () => {
    playChime();
    toast({ title: "Timer klaar", description: label, tone: "success" });
  });
  return (
    <div className={cn("flex items-center gap-5 rounded-[28px] p-3 pr-5 transition-colors duration-500", timer.running ? "bg-brass/15" : "bg-ivory/[0.06]")}>
      <div className="relative grid size-[7.5rem] shrink-0 place-items-center">
        <TimerRing progress={timer.progress} size={120} stroke={5} className="absolute inset-0" trackClassName="text-ivory/10" barClassName="text-brass-soft" />
        <span className="font-serif text-[2.1rem] tabular-nums leading-none">{formatTimer(timer.remaining)}</span>
      </div>
      <div className="flex flex-col gap-2">
        <Button variant={timer.running ? "outline-light" : "brass"} onClick={timer.running ? timer.pause : timer.done ? timer.reset : timer.start} className="min-w-40">
          {timer.running ? "Pauzeer" : timer.done ? "Opnieuw instellen" : Math.ceil(timer.remaining) < seconds ? "Hervat timer" : "Start timer"}
        </Button>
        <div className="flex gap-2">
          <button type="button" onClick={() => timer.add(60)} className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-ivory/15 text-[13px] font-semibold hover:bg-ivory/10">
            <Plus className="size-4" /> 1 min
          </button>
          <button type="button" onClick={timer.reset} className="grid size-11 place-items-center rounded-full border border-ivory/15 hover:bg-ivory/10" aria-label="Timer resetten">
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepScreen({ step, index, total, recipe }: { step: RecipeStep; index: number; total: number; recipe: RecipeDetail }) {
  return (
    <div className="container-page grid min-h-full content-center gap-6 py-6 lg:grid-cols-[1.08fr_1fr] lg:items-center lg:gap-16 lg:py-10">
      <div className="paper-grain relative aspect-[4/3] w-full overflow-hidden rounded-[32px] bg-[#EFE8DE] lg:aspect-auto lg:h-[min(64vh,640px)]">
        <div className={cn("absolute", step.imageUrl ? "inset-0" : "inset-[5%]")}>
          <StepVisual step={step} recipe={recipe} />
        </div>
      </div>
      <div>
        <p className="eyebrow text-brass-soft">
          Stap {index + 1} / {total} · {PHASE_LABEL[step.phase]}
        </p>
        <h2 className="mt-4 font-serif text-[clamp(2.2rem,4.8vw,4.4rem)] leading-[1]">{step.title}</h2>
        <p className="mt-5 max-w-xl text-[18px] leading-relaxed text-ivory/75 lg:text-[20px]">{step.body}</p>
        {step.tip && (
          <p className="mt-6 flex max-w-xl gap-3 rounded-2xl bg-ivory/[0.06] p-4 text-[15px] leading-relaxed text-ivory/70">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-brass-soft" />
            {step.tip}
          </p>
        )}
        {step.timerSeconds ? (
          <div className="mt-8">
            <BigTimer key={step.id} seconds={step.timerSeconds} label={step.title} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FinishScreen({ recipe }: { recipe: RecipeDetail }) {
  const { user, logCooked } = useKitchen();
  const toast = useToast();
  const [logged, setLogged] = useState(false);
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-10 text-center">
      <div className="aspect-square w-[min(72vw,42vh)]">
        <RecipeVisual recipe={recipe} mode="assemble" />
      </div>
      <p className="eyebrow mt-6 text-brass-soft">Alle {recipe.steps.length} stappen voltooid</p>
      <h2 className="mt-3 font-serif text-[clamp(3rem,8vw,6rem)] italic leading-none">Bon appétit.</h2>
      <p className="mt-4 max-w-md text-[17px] text-ivory/65">Je {recipe.title.toLowerCase()} is klaar. Maak een foto voordat je aanvalt.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href={`/recepten/${recipe.slug}#laat-je-bord-zien`} variant="brass" size="lg">
          Laat je bord zien
        </ButtonLink>
        {user ? (
          <Button
            variant="outline-light"
            size="lg"
            disabled={logged}
            onClick={() => {
              if (logCooked({ recipeId: recipe.id, title: null, note: "", photoUrl: null })) {
                setLogged(true);
                toast({ title: "Gemarkeerd als gemaakt", description: "Je vindt het terug in Mijn keuken.", tone: "success" });
              }
            }}
          >
            {logged ? (
              <>
                <Check className="size-4" /> Bewaard in Mijn keuken
              </>
            ) : (
              "Markeer als gemaakt"
            )}
          </Button>
        ) : (
          <ButtonLink href={`/inloggen?volgende=${encodeURIComponent(`/recepten/${recipe.slug}#laat-je-bord-zien`)}`} variant="outline-light" size="lg">
            Log in om te bewaren
          </ButtonLink>
        )}
      </div>
    </div>
  );
}

function IngredientsDrawer({ recipe, open, onClose }: { recipe: RecipeDetail; open: boolean; onClose: () => void }) {
  const [servings, setServings] = useState(recipe.servings);
  const groups = useMemo(() => groupIngredients(recipe.ingredients), [recipe.ingredients]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button type="button" aria-label="Sluit ingrediënten" onClick={onClose} className="absolute inset-0 z-10 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            className="absolute inset-y-0 right-0 z-20 flex w-full max-w-md flex-col bg-[#211B18] shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            aria-label="Ingrediënten"
          >
            <div className="flex items-center justify-between border-b border-ivory/10 px-6 py-5">
              <p className="font-serif text-3xl">Ingrediënten</p>
              <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full hover:bg-ivory/10" aria-label="Sluiten">
                <X className="size-5" />
              </button>
            </div>
            <div className="px-6 pt-5">
              <ServingsStepper value={servings} onChange={setServings} dark />
            </div>
            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
              {groups.map((g, gi) => (
                <div key={gi}>
                  {g.name && <p className="eyebrow mb-2 text-brass-soft">{g.name}</p>}
                  <ul>
                    {g.items.map((ing) => {
                      const { amount, unit } = formatAmount(ing, servings / recipe.servings);
                      return (
                        <li key={ing.id} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-ivory/10 py-3 text-[15px]">
                          <span className="text-right font-semibold tabular-nums">{amount ? `${amount} ${unit}` : <span className="text-[13px] italic text-ivory/50">{unit}</span>}</span>
                          <span className="text-ivory/80">{ing.name}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function CookingMode({ recipe }: { recipe: RecipeDetail }) {
  const total = recipe.steps.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [drawer, setDrawer] = useState(false);
  useWakeLock(true);

  useEffect(() => {
    const stap = Number(new URLSearchParams(window.location.search).get("stap"));
    if (stap > 0) setIndex(clamp(stap - 1, 0, total));
  }, [total]);

  const go = useCallback(
    (next: number) => {
      setIndex((current) => {
        const target = clamp(next, 0, total);
        setDirection(target >= current ? 1 : -1);
        return target;
      });
    },
    [total],
  );

  useEffect(() => {
    const url = `${window.location.pathname}?stap=${Math.min(index + 1, total)}`;
    window.history.replaceState(window.history.state, "", url);
  }, [index, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "Escape") setDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const finished = index >= total;
  const step = recipe.steps[index];

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-charcoal text-ivory" role="dialog" aria-modal="true" aria-label={`Kookmodus: ${recipe.title}`}>
      <header className="flex items-center justify-between gap-3 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
        <Link href={`/recepten/${recipe.slug}`} className="grid size-12 place-items-center rounded-full bg-ivory/[0.06] transition hover:bg-ivory/15" aria-label="Kookmodus verlaten">
          <X className="size-5" />
        </Link>
        <div className="min-w-0 text-center">
          <p className="eyebrow text-[9.5px] text-ivory/45">Kookmodus</p>
          <p className="truncate font-serif text-lg sm:text-xl">{recipe.title}</p>
        </div>
        <button type="button" onClick={() => setDrawer(true)} className="inline-flex h-12 items-center gap-2 rounded-full bg-ivory/[0.06] px-4 text-[13px] font-semibold transition hover:bg-ivory/15" aria-label="Toon ingrediënten">
          <ListChecks className="size-5" />
          <span className="hidden sm:inline">Ingrediënten</span>
        </button>
      </header>

      <div className="flex gap-1 px-3 pt-4 sm:px-6" aria-hidden>
        {recipe.steps.map((s, i) => (
          <button key={s.id} type="button" tabIndex={-1} onClick={() => go(i)} className="group h-3 flex-1 py-1">
            <span className={cn("block h-1 rounded-full transition-colors duration-500", i < index ? "bg-brass-soft" : i === index ? "bg-ivory" : "bg-ivory/15 group-hover:bg-ivory/30")} />
          </button>
        ))}
      </div>

      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence custom={direction} mode="popLayout" initial={false}>
          <motion.div
            key={finished ? "klaar" : step.id}
            custom={direction}
            variants={{
              enter: (d: number) => ({ x: d * 80, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -80, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: EASE_CHEF }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            dragDirectionLock
            onDragEnd={(_, info) => {
              if (info.offset.x < -90) go(index + 1);
              else if (info.offset.x > 90) go(index - 1);
            }}
            className="absolute inset-0 overflow-y-auto overscroll-contain"
          >
            {finished ? <FinishScreen recipe={recipe} /> : <StepScreen step={step} index={index} total={total} recipe={recipe} />}
          </motion.div>
        </AnimatePresence>
        <IngredientsDrawer recipe={recipe} open={drawer} onClose={() => setDrawer(false)} />
      </div>

      <footer className="grid grid-cols-2 gap-3 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-6 lg:flex lg:justify-between">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="inline-flex h-16 items-center justify-center gap-3 rounded-full border border-ivory/15 px-8 text-[16px] font-semibold transition hover:bg-ivory/10 disabled:opacity-30 lg:min-w-52"
        >
          <ArrowLeft className="size-5" /> Vorige
        </button>
        {finished ? (
          <Link href={`/recepten/${recipe.slug}`} className="inline-flex h-16 items-center justify-center gap-3 rounded-full bg-ivory px-8 text-[16px] font-semibold text-ink transition hover:bg-white lg:min-w-52">
            Terug naar recept
          </Link>
        ) : (
          <button type="button" onClick={() => go(index + 1)} className="inline-flex h-16 items-center justify-center gap-3 rounded-full bg-ivory px-8 text-[16px] font-semibold text-ink transition hover:bg-white lg:min-w-52">
            {index === total - 1 ? "Afronden" : "Volgende"} <ArrowRight className="size-5" />
          </button>
        )}
      </footer>
    </div>
  );
}
