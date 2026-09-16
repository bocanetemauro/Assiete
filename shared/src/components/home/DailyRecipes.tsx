"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { RecipeDetail } from "@/lib/types";
import { getDailyRecipes } from "@/lib/data";
import { formatWeekday } from "@/lib/utils";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function TodayLabel() {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => setLabel(formatWeekday(new Date())), []);
  return <span>{label ?? "Vandaag"}</span>;
}

export function DailyRecipeGrid({ recipes }: { recipes: RecipeDetail[] }) {
  const [first, ...rest] = recipes;
  return (
    <div className="space-y-6 lg:space-y-8">
      {first && (
        <Reveal>
          <RecipeCard recipe={first} variant="featured" />
        </Reveal>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-4">
        {rest.map((recipe, i) => (
          <Reveal key={recipe.id} delay={i * 0.08} className="h-full">
            <RecipeCard recipe={recipe} index={i + 1} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function DailyRecipes() {
  const recipes = getDailyRecipes();
  return (
    <section id="vandaag" className="py-24 lg:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow={
            <>
              Vandaag op het menu · <TodayLabel />
            </>
          }
          title={
            <>
              Vijf gerechten om <em className="text-brass">vandaag</em> te koken
            </>
          }
          description="Elke dag kiezen onze chefs vijf recepten: één signatuurgerecht en vier lessen in smaak, techniek en presentatie."
        >
          <ButtonLink href="/vandaag" variant="secondary" className="shrink-0 self-start md:self-end">
            Volledig menu <ArrowRight className="size-4" />
          </ButtonLink>
        </SectionHeading>
        <div className="mt-14 lg:mt-20">
          <DailyRecipeGrid recipes={recipes} />
        </div>
      </div>
    </section>
  );
}
