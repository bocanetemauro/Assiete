import type { Metadata } from "next";
import { Suspense } from "react";
import { RequireAuth } from "@/components/account/RequireAuth";
import { RecipeUpload } from "@/components/upload/RecipeUpload";

export const metadata: Metadata = { title: "Maak je eigen recept" };

export default function OwnRecipePage() {
  return (
    <RequireAuth
      eyebrow="Eigen recept"
      title={
        <>
          Schrijf je <em className="text-brass">signatuurgerecht</em>
        </>
      }
      description="Log in om je eigen recepten te schrijven, met ingrediënten, stappen, foto's en plating. Ze verschijnen in je persoonlijke keuken."
    >
      <Suspense fallback={<div className="min-h-screen pt-[72px]" />}>
        <RecipeUpload />
      </Suspense>
    </RequireAuth>
  );
}
