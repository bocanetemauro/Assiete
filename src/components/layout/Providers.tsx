"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { KitchenProvider } from "@/lib/store/kitchen";
import { ToastProvider } from "@/components/ui/Toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <KitchenProvider>{children}</KitchenProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
