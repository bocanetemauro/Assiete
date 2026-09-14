"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Ingredient, RecipeDetail } from "@/lib/types";
import { readPreference, writePreference } from "@/lib/services/storage";
import { cn, formatQuantity } from "@/lib/utils";

export function ServingsStepper({ value, onChange, className, dark = false }: { value: number; onChange: (n: number) => void; className?: string; dark?: boolean }) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-full border p-1", dark ? "border-ivory/15" : "border-line bg-cream", className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className={cn("grid size-10 place-items-center rounded-full transition disabled:opacity-30", dark ? "hover:bg-ivory/10" : "hover:bg-ink/5")}
        aria-label="Minder personen"
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-[5.5rem] text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value} {value === 1 ? "persoon" : "personen"}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(24, value + 1))}
        disabled={value >= 24}
        className={cn("grid size-10 place-items-center rounded-full transition disabled:opacity-30", dark ? "hover:bg-ivory/10" : "hover:bg-ink/5")}
        aria-label="Meer personen"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

export function formatAmount(ingredient: Pick<Ingredient, "quantity" | "unit">, factor = 1): { amount: string; unit: string } {
  if (ingredient.quantity === null) return { amount: "", unit: ingredient.unit };
  const amount = formatQuantity(ingredient.quantity * factor);
  const unit = ingredient.unit === "stuks" ? "" : ingredient.unit;
  return { amount, unit };
}

export function groupIngredients(ingredients: Ingredient[]) {
  const groups: { name: string | null; items: Ingredient[] }[] = [];
  ingredients.forEach((ing) => {
    const last = groups[groups.length - 1];
    if (last && last.name === ing.group) last.items.push(ing);
    else groups.push({ name: ing.group, items: [ing] });
  });
  return groups;
}

export function IngredientList({ recipe, className }: { recipe: RecipeDetail; className?: string }) {
  const [servings, setServings] = useState(recipe.servings);
  const [checked, setChecked] = useState<string[]>([]);
  const key = `checked.${recipe.id}`;

  useEffect(() => {
    setChecked(readPreference<string[]>(key, []));
  }, [key]);

  const update = (next: string[]) => {
    setChecked(next);
    writePreference(key, next);
  };

  const factor = servings / recipe.servings;
  const groups = useMemo(() => groupIngredients(recipe.ingredients), [recipe.ingredients]);
  const done = checked.filter((id) => recipe.ingredients.some((i) => i.id === id)).length;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ServingsStepper value={servings} onChange={setServings} />
        <div className="flex items-center gap-3 text-[13px] text-muted">
          <span className="tabular-nums">
            {done} van {recipe.ingredients.length} klaargezet
          </span>
          <AnimatePresence>
            {done > 0 && (
              <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => update([])} className="font-semibold text-ink underline-offset-4 hover:underline">
                Wissen
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-2 h-px w-full overflow-hidden bg-line">
        <motion.div className="h-full bg-brass" animate={{ width: `${recipe.ingredients.length ? (done / recipe.ingredients.length) * 100 : 0}%` }} transition={{ type: "spring", stiffness: 200, damping: 30 }} />
      </div>

      <div className="mt-8 space-y-10">
        {groups.map((group, gi) => (
          <div key={`${group.name}-${gi}`}>
            {group.name && <h4 className="eyebrow mb-2 text-brass">{group.name}</h4>}
            <ul>
              {group.items.map((ing) => {
                const isChecked = checked.includes(ing.id);
                const { amount, unit } = formatAmount(ing, factor);
                return (
                  <li key={ing.id}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      onClick={() => update(isChecked ? checked.filter((id) => id !== ing.id) : [...checked, ing.id])}
                      className="group grid w-full grid-cols-[2.25rem_minmax(4.5rem,6.5rem)_1fr] items-center gap-3 border-b border-line py-3.5 text-left sm:gap-4"
                    >
                      <span className={cn("grid size-7 place-items-center rounded-full border transition-all duration-300", isChecked ? "border-sage bg-sage text-white" : "border-ink/20 group-hover:border-ink/50")}>
                        <motion.span initial={false} animate={{ scale: isChecked ? 1 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                          <Check className="size-3.5" strokeWidth={3} />
                        </motion.span>
                      </span>
                      <span className={cn("text-right text-[15px] font-semibold tabular-nums transition-opacity", isChecked && "opacity-40")}>
                        {amount ? (
                          <>
                            {amount} <span className="font-medium text-muted">{unit}</span>
                          </>
                        ) : (
                          <span className="text-[13px] font-medium italic text-muted">{unit}</span>
                        )}
                      </span>
                      <span className={cn("text-[15.5px] transition-all duration-300", isChecked && "text-muted line-through decoration-ink/30")}>
                        {ing.name}
                        {ing.note && <span className="text-muted"> — {ing.note}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
