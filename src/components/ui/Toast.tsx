"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type Tone = "default" | "success";
interface ToastItem {
  id: number;
  title: string;
  description?: string;
  tone: Tone;
}

const ToastContext = createContext<(t: { title: string; description?: string; tone?: Tone }) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), []);

  const toast = useCallback(
    ({ title, description, tone = "default" }: { title: string; description?: string; tone?: Tone }) => {
      const id = ++counter.current;
      setItems((list) => [...list.slice(-2), { id, title, description, tone }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4 md:bottom-8" aria-live="polite">
        <AnimatePresence initial={false}>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-ink px-4 py-3.5 text-ivory shadow-float"
            >
              <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${t.tone === "success" ? "bg-brass" : "bg-ivory/15"}`}>
                {t.tone === "success" ? <Check className="size-3.5" /> : <Info className="size-3.5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{t.title}</p>
                {t.description && <p className="mt-0.5 text-[13px] leading-snug text-ivory/70">{t.description}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} className="grid size-7 place-items-center rounded-full text-ivory/60 hover:bg-ivory/10 hover:text-ivory" aria-label="Sluiten">
                <X className="size-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
