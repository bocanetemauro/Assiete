"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useKitchen } from "@/lib/store/kitchen";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export function FavoriteButton({ recipeId, className, withLabel = false }: { recipeId: string; className?: string; withLabel?: boolean }) {
  const { user, ready, isFavorite, toggleFavorite } = useKitchen();
  const toast = useToast();
  const pathname = usePathname();
  const [burst, setBurst] = useState(0);
  const active = ready && isFavorite(recipeId);

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Geen gedwongen login: je blijft gewoon op het recept staan.
    if (!user) {
      toast({
        title: "Bewaar je favorieten",
        description: "Met een gratis account blijven je favorieten bewaard op al je apparaten.",
        action: { label: "Account maken", href: `/registreren?volgende=${encodeURIComponent(pathname)}` },
      });
      return;
    }
    if (await toggleFavorite(recipeId)) setBurst((b) => b + 1);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Verwijder uit favorieten" : "Bewaar als favoriet"}
      className={cn(
        "relative z-10 inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-cream/90 text-ink shadow-[0_4px_14px_-6px_rgba(31,26,23,.35)] backdrop-blur transition duration-300 hover:scale-105 hover:bg-white",
        withLabel && "px-5",
        className,
      )}
    >
      <span className="relative grid place-items-center">
        <motion.span key={burst} initial={burst ? { scale: 0.5 } : false} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 520, damping: 13 }} className="grid place-items-center">
          <Heart className={cn("size-[18px] transition-colors duration-300", active && "fill-bordeaux text-bordeaux")} strokeWidth={1.8} />
        </motion.span>
        <AnimatePresence>
          {burst > 0 && (
            <motion.span key={`burst-${burst}`} className="pointer-events-none absolute inset-0" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              {Array.from({ length: 6 }).map((_, i) => {
                const a = (i / 6) * Math.PI * 2;
                return (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/2 size-1 rounded-full bg-bordeaux"
                    initial={{ x: -2, y: -2, scale: 1 }}
                    animate={{ x: Math.cos(a) * 16 - 2, y: Math.sin(a) * 16 - 2, scale: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                );
              })}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {withLabel && <span className="text-sm font-semibold">{active ? "Bewaard" : "Bewaar"}</span>}
    </button>
  );
}
