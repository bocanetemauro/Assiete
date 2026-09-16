import type { Metadata } from "next";
import { Suspense } from "react";
import { RecipeLibrary } from "@/components/library/RecipeLibrary";

export const metadata: Metadata = {
  title: "Recepten",
  description: "Doorzoek alle recepten op gerecht, ingrediënt, moeilijkheid, bereidingstijd en type gerecht.",
};

export default function RecipesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-[72px]" />}>
      <RecipeLibrary />
    </Suspense>
  );
}
