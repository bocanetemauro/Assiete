"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { SceneSpec } from "@/lib/types";
import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { TechniqueScene } from "@/components/illustrations/scenes";
import { Reveal } from "@/components/ui/Reveal";

const JOURNEY: { phase: string; title: string; body: string; scene: SceneSpec; tone: string }[] = [
  { phase: "Ingrediënten", title: "Mise en place", body: "Alles afgewogen, alles binnen handbereik. Een rustige start is het halve werk.", scene: { key: "prep", item: "steak" }, tone: "#EFE8DD" },
  { phase: "Snijden", title: "Een scherp mes, een vaste hand", body: "Brunoise, julienne, chiffonade: elke snijtechniek geïllustreerd en uitgelegd.", scene: { key: "chop", item: "shallot" }, tone: "#EDE6DC" },
  { phase: "Kruiden", title: "Smaak begint vroeg", body: "Zout op het juiste moment trekt smaak naar voren in plaats van vocht naar buiten.", scene: { key: "season", item: "steak" }, tone: "#EFE8DD" },
  { phase: "Pan verhitten", title: "Luister naar je pan", body: "Een hete pan zingt. Leer het verschil tussen glinsteren, walmen en roken.", scene: { key: "heat" }, tone: "#EAE4DB" },
  { phase: "Bakken", title: "De korst van Maillard", body: "Niet verschuiven, niet prikken. Geduld geeft kleur, en kleur geeft smaak.", scene: { key: "sear", item: "steak" }, tone: "#EDE3D9" },
  { phase: "Saus maken", title: "Reduceren en monteren", body: "Een saus is geconcentreerde smaak: inkoken, zeven en afmaken met koude boter.", scene: { key: "simmer", tone: "berry" }, tone: "#E9E3E4" },
  { phase: "Dresseren", title: "De laatste penseelstreek", body: "Saus, hoofdonderdeel, garnituur, kruiden. Een bord is een compositie.", scene: { key: "plate", dish: "steak" }, tone: "#EFE8DD" },
];

function Panel({ item, index, active, className }: { item: (typeof JOURNEY)[number]; index: number; active: boolean; className?: string }) {
  return (
    <article className={cn("grid overflow-hidden rounded-[32px] bg-cream shadow-card md:grid-cols-[1.15fr_1fr]", className)}>
      <div className="paper-grain relative aspect-[4/3] md:aspect-auto" style={{ background: item.tone }}>
        <div className={cn("absolute", item.scene.key === "plate" ? "inset-[8%]" : "inset-[4%]")}>
          <TechniqueScene spec={item.scene} active={active} className="h-full w-full" />
        </div>
      </div>
      <div className="flex flex-col justify-between gap-8 p-7 md:p-10">
        <div>
          <span className="font-serif text-6xl italic leading-none text-brass/80">{String(index + 1).padStart(2, "0")}</span>
          <p className="eyebrow mt-6 text-muted">{item.phase}</p>
          <h3 className="mt-2 font-serif text-[2.3rem] leading-[1.02]">{item.title}</h3>
        </div>
        <p className="text-[16px] leading-relaxed text-ink-soft">{item.body}</p>
      </div>
    </article>
  );
}

export function Journey() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!desktop) return;
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [desktop]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const bar = useTransform(smooth, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveIndex(Math.min(JOURNEY.length - 1, Math.max(0, Math.round(v * (JOURNEY.length - 1)))));
  });

  const header = (
    <div className="container-page flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow flex items-center gap-3 text-brass">
          <span className="h-px w-8 bg-brass/70" />
          De methode
        </p>
        <h2 className="mt-4 font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.98]">
          Van ingrediënt <em className="text-brass">tot bord</em>
        </h2>
      </div>
      <p className="max-w-sm text-[16px] leading-relaxed text-muted">Elk recept volgt dezelfde zeven bewegingen. Zo leer je niet één gerecht, maar hoe koken werkt.</p>
    </div>
  );

  if (!desktop) {
    return (
      <section ref={section} className="bg-paper py-24">
        <Reveal>{header}</Reveal>
        <div className="container-page mt-12 space-y-6">
          {JOURNEY.map((item, i) => (
            <Reveal key={item.title}>
              <Panel item={item} index={i} active />
            </Reveal>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={section} className="relative bg-paper" style={{ height: `${JOURNEY.length * 62}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-12 overflow-hidden pt-[72px]">
        {header}
        <motion.div ref={track} style={{ x }} className="flex w-max gap-8 px-[max(4rem,calc((100vw-90rem)/2+4rem))] will-change-transform">
          {JOURNEY.map((item, i) => (
            <Panel key={item.title} item={item} index={i} active={Math.abs(i - activeIndex) <= 1} className="h-[min(62vh,540px)] w-[min(72vw,900px)] shrink-0" />
          ))}
        </motion.div>
        <div className="container-page">
          <div className="flex items-center gap-6">
            <div className="relative h-px flex-1 bg-line">
              <motion.span style={{ width: bar }} className="absolute inset-y-0 left-0 bg-ink" />
            </div>
            <ol className="hidden gap-5 xl:flex">
              {JOURNEY.map((item, i) => (
                <li key={item.phase} className={cn("text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors duration-500", i === activeIndex ? "text-ink" : "text-muted/50")}>
                  {item.phase}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
