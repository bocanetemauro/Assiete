"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import type { DishArt, RecipeDetail } from "@/lib/types";
import { PLATING_STAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { DishIllustration } from "@/components/illustrations/dishes";
import { EASE_CHEF } from "@/components/ui/Reveal";

/**
 * Scroll-gestuurde "mini-film": terwijl je scrolt verschijnt achtereenvolgens
 * het lege bord, de saus, het hoofdonderdeel, garnituur, kruiden en de schone rand.
 */
export function PlatingFilm({ recipe, dish }: { recipe: RecipeDetail; dish: DishArt }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [stage, setStage] = useState(0);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const plateRotate = useTransform(scrollYProgress, [0, 1], [-18, 12]);

  useMotionValueEvent(scrollYProgress, "change", (v) => setStage(Math.min(5, Math.max(0, Math.floor(v * 6.4)))));

  const captions = PLATING_STAGES.map((s) => ({ ...s, body: recipe.platingSteps.find((p) => p.stage === s.stage)?.body }));
  const current = captions[stage];

  return (
    <section ref={ref} id="dresseren" className="relative bg-charcoal text-ivory" style={{ height: "340vh" }} aria-label="Dresseren, stap voor stap">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-[72px]">
        <div aria-hidden className="absolute left-1/2 top-1/2 size-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(220,198,160,0.16),transparent_60%)] lg:left-[68%]" />
        <div className="container-page relative flex flex-1 flex-col justify-center gap-6 py-6 lg:grid lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-12">
          <div className="order-2 lg:order-1">
            <p className="eyebrow flex items-center gap-3 text-brass-soft">
              <span className="h-px w-8 bg-brass-soft/60" />
              Dresseren · een mini-film
            </p>
            <div className="relative mt-5 min-h-[190px] sm:min-h-[210px] lg:min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div key={stage} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5, ease: EASE_CHEF }}>
                  <span className="font-serif text-[3.2rem] italic leading-none text-brass-soft lg:text-[4.5rem]">0{stage + 1}</span>
                  <h2 className="mt-3 font-serif text-[clamp(2rem,4.2vw,3.8rem)] leading-[1]">{current.title}</h2>
                  {current.body && <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ivory/65 lg:text-[17px]">{current.body}</p>}
                  {stage === 5 && <p className="mt-5 font-serif text-2xl italic text-brass-soft">Eindresultaat — bon appétit.</p>}
                </motion.div>
              </AnimatePresence>
            </div>
            <ol className="mt-6 hidden gap-2 lg:flex">
              {captions.map((c) => (
                <li key={c.stage} className="flex-1">
                  <span className={cn("block h-[3px] rounded-full transition-colors duration-500", c.stage <= stage ? "bg-brass-soft" : "bg-ivory/15")} />
                  <span className={cn("mt-2 block text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors", c.stage === stage ? "text-ivory" : "text-ivory/35")}>{c.short}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="order-1 mx-auto aspect-square w-[min(78vw,44vh)] lg:order-2 lg:w-[min(44vw,68vh)]">
            <motion.div style={{ rotate: plateRotate }} className="h-full w-full">
              <DishIllustration dish={dish} stage={stage} animated className="h-full w-full" title={`${recipe.title}: ${current.title}`} />
            </motion.div>
          </div>
        </div>
        <div className="container-page relative pb-6">
          <div className="h-px w-full bg-ivory/10">
            <motion.div style={{ width: bar }} className="h-full bg-brass-soft" />
          </div>
        </div>
      </div>
    </section>
  );
}
