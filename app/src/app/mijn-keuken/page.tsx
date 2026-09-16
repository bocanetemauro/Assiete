import type { Metadata } from "next";
import { Suspense } from "react";
import { RequireAuth } from "@/components/account/RequireAuth";
import { KitchenLibrary } from "@/components/kitchen/KitchenLibrary";

export const metadata: Metadata = { title: "Mijn keuken" };

export default function KitchenPage() {
  return (
    <RequireAuth
      title={
        <>
          Jouw keuken <em className="text-brass">wacht</em> op je
        </>
      }
      description="Log in om je gekookte gerechten, foto's, favorieten en recepten om opnieuw te maken op één plek te bewaren."
    >
      <Suspense fallback={<div className="min-h-screen pt-[72px]" />}>
        <KitchenLibrary />
      </Suspense>
    </RequireAuth>
  );
}
