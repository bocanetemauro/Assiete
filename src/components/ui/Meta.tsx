import type { ReactNode } from "react";
import type { Difficulty } from "@/lib/types";
import { DIFFICULTY_LABEL, DIFFICULTY_LEVEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function DifficultyMeter({ difficulty, showLabel = true, className }: { difficulty: Difficulty; showLabel?: boolean; className?: string }) {
  const level = DIFFICULTY_LEVEL[difficulty];
  return (
    <span className={cn("inline-flex items-center gap-2", className)} title={`Moeilijkheid: ${DIFFICULTY_LABEL[difficulty]}`}>
      <span className="flex items-end gap-[3px]" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span key={i} className={cn("w-[4px] rounded-full bg-current", i > level && "opacity-20")} style={{ height: 5 + i * 3 }} />
        ))}
      </span>
      {showLabel && <span>{DIFFICULTY_LABEL[difficulty]}</span>}
    </span>
  );
}

export function MetaStat({ label, value, icon, className }: { label: string; value: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="eyebrow flex items-center gap-1.5 text-muted">
        {icon}
        {label}
      </dt>
      <dd className="mt-1.5 font-serif text-[1.65rem] leading-none text-ink">{value}</dd>
    </div>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border border-line bg-cream/70 px-3 py-1 text-[12.5px] font-medium text-ink-soft", className)}>{children}</span>;
}
