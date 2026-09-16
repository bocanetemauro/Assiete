"use client";

import { motion } from "framer-motion";
import { ArrowRight, Camera, ChefHat, ListChecks } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { COURSE_LABEL } from "@/lib/constants";
import { getDailyRecipes } from "@/lib/data";
import { formatMinutes } from "@/lib/utils";
import { DailyRecipeGrid } from "@/components/home/DailyRecipes";
import { DishIllustration } from "@/components/illustrations/dishes";
import { ButtonLink } from "@/components/ui/Button";
import { EASE_CHEF, Reveal } from "@/components/ui/Reveal";

const ROMAN = ["I", "II", "III", "IV", "V"];

export function TodayMenu() {
  const recipes = getDailyRecipes();
  const [date, setDate] = useState<Date | null>(null);
  useEffect(() => setDate(new Date()), []);
  const weekday = date ? new Intl.DateTimeFormat("nl-NL", { weekday: "long" }).format(date) : "Vandaag";
  const dayMonth = date ? new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long" }).format(date) : "";

  return (
    <div className="pt-[72px]">
      <section className="paper-grain relative overflow-hidden bg-paper">
        <div className="container-page grid gap-14 py-14 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-20 lg:py-24">
          <motion.div className="min-w-0" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE_CHEF }}>
            <p className="eyebrow flex items-center gap-3 text-brass">
              <span className="h-px w-8 bg-brass/70" />
              Vandaag op het menu
            </p>
            <h1 className="mt-5 font-serif text-[clamp(3.6rem,9vw,8rem)] capitalize leading-[0.86]">{weekday}</h1>
            <p className="mt-2 min-h-[1.2em] font-serif text-[clamp(2rem,4vw,3.4rem)] italic leading-none text-brass">{dayMonth}</p>
            <p className="mt-8 max-w-md text-[17px] leading-relaxed text-ink-soft">
              Vijf gerechten, gekozen door onze chefs. Kook er één voor een doordeweekse avond, of combineer ze tot een menu voor gasten.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={`/recepten/${recipes[0].slug}`} size="lg">
                Start met het signatuurgerecht <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/recepten" variant="secondary" size="lg">
                Alle recepten
              </ButtonLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE_CHEF }}
            className="relative mx-auto w-full min-w-0 max-w-lg rounded-[6px] bg-cream p-2 shadow-lift sm:p-3"
          >
            <div className="rounded-[3px] border border-ink/15 p-1.5 sm:p-2">
              <div className="border border-ink/10 px-4 py-8 text-center sm:px-10 sm:py-10">
                <p className="eyebrow text-[10px] text-muted">Assiette</p>
                <p className="mt-2 font-serif text-4xl italic">Menu du jour</p>
                <div className="mx-auto mt-4 flex w-24 items-center gap-2">
                  <span className="h-px flex-1 bg-brass/60" />
                  <span className="size-1.5 rotate-45 bg-brass" />
                  <span className="h-px flex-1 bg-brass/60" />
                </div>
                <ol className="mt-8 space-y-6">
                  {recipes.map((r, i) => (
                    <li key={r.id}>
                      <Link href={`/recepten/${r.slug}`} className="group block">
                        <span className="eyebrow text-[9.5px] text-brass">
                          {ROMAN[i]} · {COURSE_LABEL[r.course]}
                        </span>
                        <span className="mt-1 block font-serif text-[1.55rem] leading-tight transition-colors group-hover:text-brass">{r.title}</span>
                        <span className="mt-1 flex items-center gap-2 text-[12.5px] text-muted">
                          {/* min-w-0: zonder dit dwingt `truncate` (nowrap) de hele menukaart breder dan een telefoonscherm. */}
                          <span className="min-w-0 flex-1 truncate text-right italic">{r.subtitle}</span>
                          <span className="h-px w-6 border-t border-dotted border-muted/60" />
                          <span className="min-w-0 flex-1 text-left tabular-nums">{formatMinutes(r.totalMinutes)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-10 -top-12 hidden size-36 rotate-12 sm:block">
              <DishIllustration dish="lemon-tart" className="h-full w-full drop-shadow-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container-page py-20 lg:py-28">
        <DailyRecipeGrid recipes={recipes} />
      </section>

      <section className="border-t border-line bg-ivory py-20 lg:py-28">
        <div className="container-page">
          <Reveal>
            <h2 className="max-w-2xl font-serif text-[clamp(2.4rem,4.6vw,3.8rem)] leading-[1]">
              Zo haal je het meeste uit <em className="text-brass">vandaag</em>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: ListChecks, title: "Zet je mise en place klaar", body: "Vink ingrediënten af terwijl je ze afweegt en pas het aantal personen aan — hoeveelheden rekenen mee." },
              { icon: ChefHat, title: "Kook in de kookmodus", body: "Eén stap tegelijk, groot op je scherm, met timers en een scherm dat niet op zwart gaat." },
              { icon: Camera, title: "Laat je bord zien", body: "Fotografeer je gerecht en bewaar het in Mijn keuken. Zo zie je je vooruitgang groeien." },
            ].map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.08} className="h-full">
                <div className="h-full rounded-[28px] border border-line bg-cream p-7">
                  <span className="grid size-12 place-items-center rounded-full bg-ink text-ivory">
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-6 font-serif text-[1.8rem] leading-tight">{title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
