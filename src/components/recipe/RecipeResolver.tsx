"use client";

import { ClocheIllustration } from "@/components/illustrations/Cloche";
import { CookingMode } from "@/components/cooking/CookingMode";
import { ButtonLink } from "@/components/ui/Button";
import { useKitchen } from "@/lib/store/kitchen";
import { RecipePage } from "./RecipePage";

/** Recepten van leden worden client-side opgehaald; platformrecepten zijn statisch. */
export function RecipeResolver({ slug, view }: { slug: string; view: "page" | "cooking" }) {
  const { ready, getRecipe } = useKitchen();
  const recipe = ready ? getRecipe(slug) : undefined;

  if (!ready) {
    return (
      <div className={view === "cooking" ? "fixed inset-0 z-[80] grid place-items-center bg-charcoal" : "grid min-h-screen place-items-center pt-[72px]"}>
        <div className="size-16 animate-pulse rounded-full bg-brass/30" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pb-24 pt-[120px] text-center">
        <div className="size-52">
          <ClocheIllustration label="?" />
        </div>
        <h1 className="mt-8 font-serif text-5xl">Dit recept vonden we niet</h1>
        <p className="mt-4 max-w-md text-muted">Misschien is het verwijderd, of staat het in de keuken van iemand anders. Ontdek intussen onze recepten.</p>
        <div className="mt-8 flex gap-3">
          <ButtonLink href="/recepten">Naar alle recepten</ButtonLink>
          <ButtonLink href="/mijn-keuken" variant="secondary">
            Mijn keuken
          </ButtonLink>
        </div>
      </div>
    );
  }

  return view === "cooking" ? <CookingMode recipe={recipe} /> : <RecipePage recipe={recipe} />;
}
