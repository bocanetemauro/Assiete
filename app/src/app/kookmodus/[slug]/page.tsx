import type { Metadata } from "next";
import { PLATFORM_RECIPES, getPlatformRecipe } from "@/lib/data";
import { DYNAMIC_SLUG_PLACEHOLDER } from "@/lib/native";
import { CookingMode } from "@/components/cooking/CookingMode";
import { RecipeResolver } from "@/components/recipe/RecipeResolver";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  // Plus één placeholderpagina waar eigen recepten van leden (slugs die pas na het
  // bouwen bestaan) op terechtkomen. Zie shared/src/lib/native.ts.
  return [...PLATFORM_RECIPES.map((r) => ({ slug: r.slug })), { slug: DYNAMIC_SLUG_PLACEHOLDER }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getPlatformRecipe(slug);
  return { title: recipe ? `Kookmodus · ${recipe.title}` : "Kookmodus" };
}

export default async function CookingModeRoute({ params }: Params) {
  const { slug } = await params;
  const recipe = getPlatformRecipe(slug);
  return recipe ? <CookingMode recipe={recipe} /> : <RecipeResolver slug={slug} view="cooking" />;
}
