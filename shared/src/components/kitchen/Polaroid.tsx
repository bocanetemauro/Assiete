"use client";

import type { CookedEntry } from "@/lib/types";
import { DIFFICULTY_LABEL } from "@/lib/constants";
import { cn, formatDate, formatMinutes, isToday } from "@/lib/utils";
import { RecipeVisual } from "@/components/recipe/RecipeVisual";

/** Foto van een gekookt gerecht als polaroid, met de gevraagde metadata. */
export function Polaroid({ entry, className, tilt = -2, details = true }: { entry: CookedEntry; className?: string; tilt?: number; details?: boolean }) {
  const today = isToday(entry.cookedAt);
  return (
    <figure className={cn("relative rounded-[6px] bg-white p-3 pb-5 shadow-lift", className)} style={{ transform: `rotate(${tilt}deg)` }}>
      <div className="relative aspect-square overflow-hidden rounded-[3px]" style={{ background: entry.recipe.tone }}>
        {entry.photoUrl ? (
          <img src={entry.photoUrl} alt={entry.title ?? entry.recipe.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full p-[8%]">
            <RecipeVisual recipe={{ ...entry.recipe, coverUrl: null }} />
          </div>
        )}
        {today && <span className="eyebrow absolute left-3 top-3 rounded-full bg-ink px-3 py-1.5 text-[9px] text-ivory">Vandaag gemaakt</span>}
        {!entry.photoUrl && <span className="absolute bottom-2 right-3 text-[10px] font-medium text-ink/40">illustratie</span>}
      </div>
      <figcaption className="px-1.5 pt-4 text-ink">
        <p className="font-serif text-[1.55rem] leading-tight">{entry.title ?? entry.recipe.title}</p>
        {entry.note && <p className="mt-1.5 font-serif text-[1.05rem] italic leading-snug text-muted">“{entry.note}”</p>}
        {details && (
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3 text-[12.5px]">
            <div className="col-span-2">
              <dt className="sr-only">Datum</dt>
              <dd>
                Gemaakt op <span className="font-semibold">{formatDate(entry.cookedAt)}</span>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Bereidingstijd</dt>
              <dd className="font-semibold">{formatMinutes(entry.durationMinutes)}</dd>
            </div>
            <div>
              <dt className="text-muted">Moeilijkheid</dt>
              <dd className="font-semibold">{DIFFICULTY_LABEL[entry.recipe.difficulty]}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted">Recept</dt>
              <dd className="font-semibold">{entry.recipe.title}</dd>
            </div>
          </dl>
        )}
      </figcaption>
    </figure>
  );
}
