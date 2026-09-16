import type { Metadata } from "next";
import { Suspense } from "react";
import { RequireAuth } from "@/components/account/RequireAuth";
import { SocialHub } from "@/components/social/SocialHub";

export const metadata: Metadata = { title: "Vrienden" };

export default function FriendsPage() {
  return (
    <RequireAuth
      eyebrow="Vrienden"
      title={
        <>
          Koken met <em className="text-brass">vrienden</em>
        </>
      }
      description="Log in om vrienden te zoeken op username, verzoeken te beantwoorden en posts te delen die alleen je vrienden zien."
    >
      <Suspense fallback={<div className="min-h-screen pt-[72px]" />}>
        <SocialHub />
      </Suspense>
    </RequireAuth>
  );
}
