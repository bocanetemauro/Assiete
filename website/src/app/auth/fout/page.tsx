import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthErrorScreen } from "@/components/account/AuthErrorScreen";

export const metadata: Metadata = { title: "Link werkt niet", robots: { index: false } };

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-[72px]" />}>
      <AuthErrorScreen />
    </Suspense>
  );
}
