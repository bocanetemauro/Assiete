import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/account/AuthForm";

export const metadata: Metadata = { title: "Account aanmaken" };

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-[72px]" />}>
      <AuthForm mode="register" />
    </Suspense>
  );
}
