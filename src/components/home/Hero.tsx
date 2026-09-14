"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PLATING_STAGES } from "@/lib/constants";
import { PLATFORM_RECIPES, getDailyRecipes } from "@/lib/data";
import { ButtonLink } from "@/components/ui/Button";
import { EASE_CHEF, RevealText } from "@/components/ui/Reveal";
import { DishIllustration } from "@/components/illustrations/dishes";
import { Berries, Garlic, Herbs, Onion } from "@/components/illustrations/ingredients";

const featured = getDailyRecipes()[0];
const stepCount = PLATFORM_RECIPES.reduce((sum, r) => sum + r.steps.length, 0);

function Floating({ children, className, style, delay = 0, viewBox = "-90 -90 180 180" }: { children: React.ReactNode; className: string; style?: React.ComponentProps<typeof motion.div>["style"]; delay?: number; viewBox?: string }) {
  return (
    <motion.div style={style} className={`pointer-events-none absolute ${className}`} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + delay, duration: 1.2, ease: EASE_CHEF }}>
      <svg viewBox={viewBox} className="ill h-full w-full overflow-visible drop-shadow-[0_18px_22px_rgba(31,26,23,0.18)]" aria-hidden>
        <g className="a-float" style={{ animationDelay: `${delay * 2}s` }}>
          {children}
        </g>
      </svg>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const plateRotate = useTransform(scrollYProgress, [0, 1], [0, 32]);
  const plateY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const up = useTransform(scrollYProgress, [0, 1], [0, -260]);
  const upSlow = useTransform(scrollYProgress, [0, 1], [0, -130]);
  const down = useTransform(scrollYProgress, [0, 1], [0, 220]);

  const [stage, setStage] = useState(0);
  useEffect(() => {
    let tick = -1;
    const timer = window.setInterval(() => {
      tick = tick >= 11 ? 0 : tick + 1;
      setStage(Math.min(tick, 5));
    }, 1150);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className="paper-grain relative isolate overflow-hidden bg-ivory pt-[72px]">
      <div aria-hidden className="absolute -right-[20%] -top-[30%] -z-10 size-[80vw] rounded-full bg-[radial-gradient(circle,rgba(220,198,160,0.38),transparent_62%)]" />
      <div aria-hidden className="absolute -bottom-[40%] -left-[25%] -z-10 size-[70vw] rounded-full bg-[radial-gradient(circle,rgba(102,116,90,0.10),transparent_60%)]" />

      <div className="container-page grid min-h-[calc(100svh-72px)] items-center gap-6 pb-16 pt-8 lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:pb-10 lg:pt-0">
        <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 max-w-2xl">
          <motion.p initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: EASE_CHEF }} className="eyebrow flex items-center gap-3 text-brass">
            <span className="h-px w-10 bg-brass" />
            Interactieve culinaire academie
          </motion.p>
          <h1 className="mt-6 font-serif text-[clamp(3.4rem,8.4vw,7.6rem)] font-medium leading-[0.9] tracking-[-0.025em]">
            <RevealText text="Leer koken" />
            <br />
            <RevealText text="als een" delay={0.18} />{" "}
            <em className="text-brass">
              <RevealText text="chef." delay={0.32} />
            </em>
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1, ease: EASE_CHEF }} className="mt-7 max-w-md text-[19px] leading-relaxed text-ink-soft">
            Van het eerste ingrediënt tot de laatste penseelstreek op je bord.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 1, ease: EASE_CHEF }} className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/recepten" size="lg">
              Ontdek recepten <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink href={`/recepten/${featured.slug}#bereiding`} variant="secondary" size="lg">
              Start met koken
            </ButtonLink>
          </motion.div>
          <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }} className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
            {[
              [String(PLATFORM_RECIPES.length), "masterclass-recepten"],
              [String(stepCount), "geïllustreerde stappen"],
              ["6", "fasen van plating"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-serif text-[2.6rem] leading-none">{value}</dd>
                <p className="mt-2 text-[13px] leading-snug text-muted">{label}</p>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <div className="relative mx-auto aspect-square w-full max-w-[680px] lg:-mr-10">
          <Floating className="left-[-4%] top-[6%] size-[24%]" style={{ y: up }} delay={0.1}>
            <Herbs kind="rosemary" x={0} y={20} s={1.1} r={-35} />
          </Floating>
          <Floating className="right-[2%] top-[2%] size-[18%]" style={{ y: upSlow }} delay={0.3}>
            <Berries kind="blueberry" count={6} x={0} y={0} s={1.5} />
          </Floating>
          <Floating className="bottom-[4%] right-[-2%] size-[20%]" style={{ y: down }} delay={0.5}>
            <Garlic x={-10} y={30} s={1.1} />
          </Floating>
          <Floating className="bottom-[10%] left-[-6%] size-[17%]" style={{ y: upSlow }} delay={0.7}>
            <Onion variant="shallot" x={0} y={40} s={1.1} />
          </Floating>

          <motion.div style={{ rotate: plateRotate, y: plateY, scale: plateScale }} className="absolute inset-[6%]">
            <motion.div className="h-full w-full" initial={{ opacity: 0, scale: 0.85, rotate: -40 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.6, ease: EASE_CHEF }}>
              <DishIllustration dish="steak" stage={stage} animated className="h-full w-full" title="Een gastronomisch opgemaakt bord met steak en blauwe bessensaus" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1, ease: EASE_CHEF }}
            className="absolute bottom-[2%] left-[4%] w-[min(290px,70%)] rounded-3xl border border-white/60 bg-cream/80 p-4 shadow-float backdrop-blur-xl sm:left-[8%]"
          >
            <p className="eyebrow text-[9px] text-brass">Nu op het bord</p>
            <p className="mt-1 font-serif text-xl leading-tight">{featured.title}</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex gap-1" aria-hidden>
                {PLATING_STAGES.map((s) => (
                  <span key={s.stage} className={`h-1 w-4 rounded-full transition-colors duration-500 ${s.stage <= stage ? "bg-brass" : "bg-line"}`} />
                ))}
              </div>
              <div className="relative h-5 flex-1 overflow-hidden text-[12.5px] font-medium text-ink-soft">
                <AnimatePresence mode="wait">
                  <motion.span key={stage} className="absolute inset-0 truncate" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.35 }}>
                    {PLATING_STAGES[stage].short}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#vandaag"
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted lg:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <motion.span className="absolute inset-x-0 top-0 h-4 bg-ink" animate={{ y: [-16, 40] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
        </span>
      </motion.a>
    </section>
  );
}

export function TechniqueMarquee() {
  const words = ["Mise en place", "Snijden", "Kruiden", "Aanbraden", "Arroseren", "Reduceren", "Monteren", "Dresseren"];
  const row = [...words, ...words];
  return (
    <div className="overflow-hidden border-y border-line bg-paper py-6" aria-hidden>
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10 font-serif text-[2rem] italic text-ink/70">
            {w}
            <span className="size-1.5 rounded-full bg-brass" />
          </span>
        ))}
      </div>
    </div>
  );
}
