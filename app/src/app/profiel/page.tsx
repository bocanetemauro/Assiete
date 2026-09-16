import type { Metadata } from "next";
import { Suspense } from "react";
import { RequireAuth } from "@/components/account/RequireAuth";
import { Profile } from "@/components/account/Profile";

export const metadata: Metadata = { title: "Profiel" };

export default function ProfilePage() {
  return (
    <RequireAuth
      eyebrow="Profiel"
      title={
        <>
          Jouw culinaire <em className="text-brass">dagboek</em>
        </>
      }
      description="Log in om je profiel, statistieken, eigen recepten, gemaakte gerechten en foto's te bekijken."
    >
      <Suspense fallback={<div className="min-h-screen pt-[72px]" />}>
        <Profile />
      </Suspense>
    </RequireAuth>
  );
}
