"use client";

import { motion } from "framer-motion";
import { Repeat, Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useKitchen } from "@/lib/store/kitchen";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

export function CookAgainButton({ recipeId, className, compact = false }: { recipeId: string; className?: string; compact?: boolean }) {
  const { user, ready, isCookAgain, toggleCookAgain } = useKitchen();
  const toast = useToast();
  const pathname = usePathname();
  const active = ready && isCookAgain(recipeId);

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Geen gedwongen login: het recept blijft gewoon open staan.
        if (!user) {
          toast({
            title: "Zet recepten op je lijst",
            description: "Met een gratis account houd je bij wat je opnieuw wilt maken.",
            action: { label: "Account maken", href: `/registreren?volgende=${encodeURIComponent(pathname)}` },
          });
          return;
        }
        const now = await toggleCookAgain(recipeId);
        toast({ title: now ? "Op je lijst ‘Opnieuw maken’" : "Van je lijst gehaald", tone: now ? "success" : "default" });
      }}
      className={cn(
        "relative z-10 inline-flex h-11 items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-all duration-300",
        compact ? "w-11" : "px-5",
        active ? "border-sage bg-sage text-white" : "border-ink/15 bg-cream/70 text-ink hover:border-ink/35",
        className,
      )}
      aria-label={compact ? (active ? "Verwijder van ‘opnieuw maken’" : "Markeer als ‘opnieuw maken’") : undefined}
      title={active ? "Staat op je lijst ‘Opnieuw maken’" : "Markeer als ‘opnieuw maken’"}
    >
      <motion.span animate={{ rotate: active ? 360 : 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="grid place-items-center">
        <Repeat className="size-4" />
      </motion.span>
      {!compact && (active ? "Op je lijst" : "Opnieuw maken")}
    </button>
  );
}

export function ShareButton({ title, className }: { title: string; className?: string }) {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={async () => {
        const url = window.location.href.split("#")[0];
        try {
          if (navigator.share) {
            await navigator.share({ title, url });
            return;
          }
          await navigator.clipboard.writeText(url);
          toast({ title: "Link gekopieerd", description: "Deel dit recept met wie je wilt.", tone: "success" });
        } catch {
          /* delen geannuleerd */
        }
      }}
      className={cn("inline-flex size-11 items-center justify-center rounded-full border border-ink/15 bg-cream/70 text-ink transition hover:border-ink/35", className)}
      aria-label="Deel recept"
    >
      <Share2 className="size-4" />
    </button>
  );
}
