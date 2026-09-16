"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { KitchenProvider } from "@/lib/store/kitchen";
import { SocialProvider } from "@/lib/store/social";
import { ToastProvider } from "@/components/ui/Toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <KitchenProvider>
          <SocialProvider>
            {children}
          </SocialProvider>
        </KitchenProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
