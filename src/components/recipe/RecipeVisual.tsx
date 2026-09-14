"use client";

import type { RecipeDetail } from "@/lib/types";
import { DishIllustration, type DishMode } from "@/components/illustrations/dishes";
import { ClocheIllustration } from "@/components/illustrations/Cloche";
import { cn } from "@/lib/utils";

/** Toont de eigen foto van een recept, anders de illustratie, anders een cloche. */
export function RecipeVisual({
  recipe,
  className,
  mode = "static",
  stage,
  animated,
  active,
}: {
  recipe: Pick<RecipeDetail, "coverUrl" | "dish" | "title">;
  className?: string;
  mode?: DishMode;
  stage?: number;
  animated?: boolean;
  active?: boolean;
}) {
  if (recipe.coverUrl) {
    return <img src={recipe.coverUrl} alt={recipe.title} className={cn("h-full w-full object-cover", className)} />;
  }
  if (recipe.dish) {
    return <DishIllustration dish={recipe.dish} mode={mode} stage={stage} animated={animated} active={active} title={recipe.title} className={cn("h-full w-full", className)} />;
  }
  return <ClocheIllustration label={recipe.title} className={cn("h-full w-full", className)} />;
}
