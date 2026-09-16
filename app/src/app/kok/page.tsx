import type { Metadata } from "next";
import { Suspense } from "react";
import { RequireAuth } from "@/components/account/RequireAuth";
import { MemberProfile } from "@/components/social/MemberProfile";

export const metadata: Metadata = { title: "Kok" };

export default function MemberPage() {
  return (
    <RequireAuth
      eyebrow="Profiel"
      title={
        <>
          Een kok uit de <em className="text-brass">kring</em>
        </>
      }
      description="Log in om profielen van andere koks te bekijken en vrienden te worden."
    >
      <Suspense fallback={<div className="min-h-screen pt-[72px]" />}>
        <MemberProfile />
      </Suspense>
    </RequireAuth>
  );
}
