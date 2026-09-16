"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Users } from "lucide-react";
import Link from "next/link";
import type { RecipeDetail } from "@/lib/types";
import { CATEGORY_LABEL, COURSE_LABEL, DIFFICULTY_LABEL } from "@/lib/constants";
import { useKitchen } from "@/lib/store/kitchen";
import { cn, formatMinutes, isToday } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { Chip, DifficultyMeter } from "@/components/ui/Meta";
import { FavoriteButton } from "./FavoriteButton";
import { RecipeVisual } from "./RecipeVisual";

function CookedBadge({ recipeId }: { recipeId: string }) {
  const { ready, cookedFor } = useKitchen();
  if (!ready) return null;
  const entries = cookedFor(recipeId);
  if (!entries.length) return null;
  const today = isToday(entries[0].cookedAt);
  return (
    <span className={cn("eyebrow inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9.5px] backdrop-blur", today ? "bg-ink text-ivory" : "bg-cream/85 text-ink")}>
      <span className={cn("size-1.5 rounded-full", today ? "bg-brass-soft" : "bg-sage")} />
      {today ? "Vandaag gemaakt" : `${entries.length}× gemaakt`}
    </span>
  );
}

export function RecipeCard({ recipe, index, variant = "default", className }: { recipe: RecipeDetail; index?: number; variant?: "default" | "featured"; className?: string }) {
  const href = `/recepten/${recipe.slug}`;
  const photo = Boolean(recipe.coverUrl);
  const eyebrow = [COURSE_LABEL[recipe.course], ...recipe.categories.map((c) => CATEGORY_LABEL[c])].slice(0, 2).join(" · ");

  if (variant === "featured") {
    return (
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className={cn("group relative grid overflow-hidden rounded-[32px] bg-cream shadow-card transition-shadow duration-500 hover:shadow-lift md:grid-cols-[1.1fr_1fr]", className)}
      >
        {/* De illustratie is één kolom; badges en hartje zweven erboven, buiten de grid-flow. */}
        <div className="relative">
          <Link href={href} className="relative block aspect-square overflow-hidden md:aspect-auto md:h-full md:min-h-[540px]" style={{ background: recipe.tone }} aria-label={recipe.title}>
            <div className="paper-grain absolute inset-0" />
            <div className={cn("absolute transition-transform duration-[1400ms] ease-chef group-hover:scale-[1.03]", photo ? "inset-0" : "inset-[7%] group-hover:rotate-[10deg]")}>
              <RecipeVisual recipe={recipe} />
            </div>
          </Link>
          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            <span className="eyebrow rounded-full bg-ink px-3 py-1.5 text-[9.5px] text-ivory">Chef&apos;s keuze</span>
            <CookedBadge recipeId={recipe.id} />
          </div>
          <div className="absolute right-5 top-5">
            <FavoriteButton recipeId={recipe.id} />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6 p-7 sm:p-10 lg:p-14">
          <div>
            <p className="eyebrow text-brass">{eyebrow}</p>
            <h3 className="mt-3 font-serif text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.98]">
              <Link href={href} className="transition-colors hover:text-brass">
                {recipe.title}
              </Link>
            </h3>
            {recipe.subtitle && <p className="mt-3 font-serif text-xl italic text-muted">{recipe.subtitle}</p>}
          </div>
          <p className="max-w-lg text-[16px] leading-relaxed text-ink-soft">{recipe.description}</p>
          <dl className="grid grid-cols-3 gap-2 border-y border-line py-5 sm:gap-4">
            <div>
              <dt className="eyebrow text-[9.5px] text-muted">Tijd</dt>
              <dd className="mt-1.5 hyphens-auto break-words font-serif text-[1.25rem] sm:text-2xl" lang="nl">{formatMinutes(recipe.totalMinutes)}</dd>
            </div>
            <div>
              <dt className="eyebrow text-[9.5px] text-muted">Niveau</dt>
              <dd className="mt-1.5 hyphens-auto break-words font-serif text-[1.25rem] sm:text-2xl" lang="nl">{DIFFICULTY_LABEL[recipe.difficulty]}</dd>
            </div>
            <div>
              <dt className="eyebrow text-[9.5px] text-muted">Personen</dt>
              <dd className="mt-1.5 font-serif text-[1.25rem] sm:text-2xl">{recipe.servings}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-2">
            {recipe.keyIngredients.map((i) => (
              <Chip key={i}>{i}</Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={href} size="lg">
              Bekijk recept <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink href={`/kookmodus/${recipe.slug}`} variant="secondary" size="lg">
              Start kookmodus
            </ButtonLink>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn("group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-cream shadow-card transition-shadow duration-500 hover:shadow-lift", className)}
    >
      <div className="relative aspect-[1/0.92] overflow-hidden" style={{ background: recipe.tone }}>
        <div className="paper-grain absolute inset-0" />
        <div className={cn("absolute transition-transform duration-[1200ms] ease-chef group-hover:scale-[1.04]", photo ? "inset-0" : "inset-[8%] group-hover:rotate-[9deg]")}>
          <RecipeVisual recipe={recipe} />
        </div>
        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
          {index !== undefined && <span className="grid size-9 place-items-center rounded-full bg-cream/85 font-serif text-lg italic backdrop-blur">{String(index + 1).padStart(2, "0")}</span>}
          <CookedBadge recipeId={recipe.id} />
        </div>
        <FavoriteButton recipeId={recipe.id} className="absolute right-4 top-4" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow text-[10px] text-brass">{recipe.source === "user" ? `Eigen recept${recipe.author ? ` · ${recipe.author.name.split(" ")[0]}` : ""}` : eyebrow}</p>
        <h3 className="mt-2 font-serif text-[1.9rem] leading-[1.02]">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {recipe.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-2 text-[14.5px] leading-relaxed text-muted">{recipe.description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 text-muted" strokeWidth={1.8} />
            {formatMinutes(recipe.totalMinutes)}
          </span>
          <DifficultyMeter difficulty={recipe.difficulty} />
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4 text-muted" strokeWidth={1.8} />
            {recipe.servings} pers.
          </span>
        </div>
        {recipe.keyIngredients.length > 0 && <p className="mt-4 text-[13px] leading-relaxed text-muted">{recipe.keyIngredients.join(" · ")}</p>}
        <div className="mt-auto pt-6">
          <span aria-hidden className="inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-sm font-semibold transition-colors group-hover:border-brass group-hover:text-brass">
            Bekijk recept <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
