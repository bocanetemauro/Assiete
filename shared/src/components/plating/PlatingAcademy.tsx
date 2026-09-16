"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import type { DishKey } from "@/lib/types";
import { PLATFORM_RECIPES } from "@/lib/data";
import { cn } from "@/lib/utils";
import { DishIllustration } from "@/components/illustrations/dishes";
import { PlatingPrinciples, PlatingStepper } from "@/components/recipe/PlatingGuide";
import { EASE_CHEF, Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const SHOWCASE: { dish: DishKey; label: string }[] = [
  { dish: "steak", label: "Steak" },
  { dish: "seabass", label: "Zeebaars" },
  { dish: "scallops", label: "Coquilles" },
  { dish: "chocolate", label: "Chocolade" },
];

const TOOLS = [
  { name: "Sauslepel", body: "Met de bolle kant trek je in één beweging een swoosh. Ook onmisbaar voor quenelles." },
  { name: "Pincet", body: "Voor microgroen, bloemen en schaafsel dat precies op zijn plek moet vallen." },
  { name: "Knijpfles", body: "Voor stippen saus in aflopende grootte en strakke lijnen olie." },
  { name: "Ring", body: "Voor torens, tartaar en strakke vormen. Druk aan en trek recht omhoog." },
  { name: "Penseel", body: "Voor een dunne veeg saus of glaze — de meest schilderachtige techniek." },
  { name: "Vochtige doek", body: "De laatste stap van elk bord: een schone rand is het kader van je gerecht." },
];

export function PlatingAcademy() {
  const [dish, setDish] = useState<DishKey>("steak");
  const recipe = PLATFORM_RECIPES.find((r) => r.dish === dish);

  return (
    <div className="pt-[72px]">
      <section className="relative overflow-hidden bg-charcoal text-ivory">
        <div aria-hidden className="absolute right-[-10%] top-1/2 size-[70vw] max-w-[900px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(220,198,160,0.18),transparent_62%)]" />
        <div className="container-page relative grid items-center gap-10 py-16 lg:grid-cols-[1fr_1fr] lg:py-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE_CHEF }}>
            <p className="eyebrow flex items-center gap-3 text-brass-soft">
              <span className="h-px w-8 bg-brass-soft/60" />
              Plating-academie
            </p>
            <h1 className="mt-5 font-serif text-[clamp(3.2rem,8vw,7rem)] leading-[0.9]">
              De kunst van <em className="text-brass-soft">het bord</em>
            </h1>
            <p className="mt-7 max-w-md text-[18px] leading-relaxed text-ivory/65">
              Mensen eten eerst met hun ogen. Leer hoe chefs een bord opbouwen: met ritme, contrast, hoogte en vooral met lege ruimte.
            </p>
          </motion.div>
          <motion.div className="mx-auto aspect-square w-full max-w-[580px]" initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} transition={{ duration: 1.5, ease: EASE_CHEF }}>
            <DishIllustration dish="duck" mode="loop" className="h-full w-full" />
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="container-page">
          <SectionHeading eyebrow="Zes bewegingen" title={<>Van leeg bord tot <em className="text-brass">eindresultaat</em></>} description="Elk gastronomisch bord volgt dezelfde volgorde. Kies een gerecht en klik door de stappen." />
          <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Kies een gerecht">
            {SHOWCASE.map((s) => (
              <button
                key={s.dish}
                type="button"
                role="tab"
                aria-selected={dish === s.dish}
                onClick={() => setDish(s.dish)}
                className={cn("relative h-11 rounded-full px-5 text-sm font-semibold transition-colors", dish === s.dish ? "text-ivory" : "text-ink-soft hover:text-ink")}
              >
                {dish === s.dish && <motion.span layoutId="plating-dish" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span className="relative">{s.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-10">
            <PlatingStepper key={dish} dish={dish} steps={recipe?.platingSteps} tone={recipe?.tone} />
          </div>
          {recipe && (
            <p className="mt-8 text-[15px] text-muted">
              Uit het recept{" "}
              <Link href={`/recepten/${recipe.slug}#plating`} className="font-semibold text-ink underline underline-offset-4 hover:text-brass">
                {recipe.title}
              </Link>
            </p>
          )}
        </div>
      </section>

      <section className="border-y border-line bg-paper py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Principes" title="Vier regels die elk bord mooier maken" />
          <PlatingPrinciples className="mt-12" />
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Gereedschap" title={<>De gereedschapskist van een <em className="text-brass">chef</em></>} description="Je hebt geen professionele keuken nodig. Met deze zes eenvoudige hulpmiddelen maak je elk bord preciezer." className="self-start" />
          <div className="grid gap-4 sm:grid-cols-2">
            {TOOLS.map((tool, i) => (
              <Reveal key={tool.name} delay={i * 0.05}>
                <div className="flex h-full gap-5 rounded-[24px] border border-line bg-cream p-6">
                  <span className="font-serif text-4xl italic leading-none text-brass/70">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-serif text-[1.7rem] leading-tight">{tool.name}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{tool.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Inspiratie" title="Twaalf borden om van te leren" />
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {PLATFORM_RECIPES.map((r, i) => (
              <Reveal key={r.id} delay={(i % 4) * 0.05} className="min-w-0">
                <Link href={`/recepten/${r.slug}#plating`} className="group block rounded-[28px] p-3 transition-colors hover:bg-cream sm:p-4">
                  <div className="aspect-square rounded-[22px] p-[6%]" style={{ background: r.tone }}>
                    <DishIllustration dish={r.dish!} className="h-full w-full transition-transform duration-[1200ms] ease-chef group-hover:rotate-[14deg] group-hover:scale-105" />
                  </div>
                  {/* break-words: lange gerechtnamen passen anders niet in een smalle kolom op de telefoon. */}
                  <p className="mt-3 break-words font-serif text-[1.15rem] leading-tight sm:mt-4 sm:text-[1.35rem]">{r.title}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
