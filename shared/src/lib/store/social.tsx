"use client";

/**
 * Houdt het aantal inkomende vriendschapsverzoeken bij, voor het bolletje in de
 * navigatie en een melding als er een nieuw verzoek binnenkomt. Ververst bij het
 * openen, als je terugkeert naar de pagina/app en elke minuut.
 */

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { countIncomingRequests } from "@/lib/social";
import { useKitchen } from "@/lib/store/kitchen";
import { useToast } from "@/components/ui/Toast";

interface SocialContextValue {
  incoming: number;
  refreshIncoming: () => Promise<void>;
}

const SocialContext = createContext<SocialContextValue>({ incoming: 0, refreshIncoming: async () => {} });

export function SocialProvider({ children }: { children: ReactNode }) {
  const { user } = useKitchen();
  const toast = useToast();
  const [incoming, setIncoming] = useState(0);
  const previous = useRef<number | null>(null);
  const userId = user?.id ?? null;

  const refreshIncoming = useCallback(async () => {
    if (!userId) return;
    try {
      const count = await countIncomingRequests(userId);
      if (previous.current !== null && count > previous.current) {
        toast({
          title: count - previous.current === 1 ? "Nieuw vriendschapsverzoek" : `${count - previous.current} nieuwe vriendschapsverzoeken`,
          action: { label: "Bekijken", href: "/vrienden?tab=verzoeken" },
        });
      }
      previous.current = count;
      setIncoming(count);
    } catch {
      /* geen verbinding: volgende poging */
    }
  }, [userId, toast]);

  useEffect(() => {
    previous.current = null;
    setIncoming(0);
    if (!userId) return;
    void refreshIncoming();
    const onVisible = () => document.visibilityState === "visible" && void refreshIncoming();
    const timer = window.setInterval(onVisible, 60_000);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [userId, refreshIncoming]);

  return <SocialContext.Provider value={{ incoming, refreshIncoming }}>{children}</SocialContext.Provider>;
}

export function useSocial() {
  return useContext(SocialContext);
}
