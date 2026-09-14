"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Category, Course, Difficulty, RecipeDetail } from "@/lib/types";
import { CATEGORIES, CATEGORY_LABEL, COURSES, COURSE_LABEL, DIFFICULTIES, DIFFICULTY_LABEL, DIFFICULTY_LEVEL } from "@/lib/constants";
import { useKitchen } from "@/lib/store/kitchen";
import { cn } from "@/lib/utils";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { ClocheIllustration } from "@/components/illustrations/Cloche";
import { Button } from "@/components/ui/Button";
import { EASE_CHEF } from "@/components/ui/Reveal";

type TimeFilter = "alle" | "30" | "45" | "60" | "60+";
type Sort = "aanbevolen" | "snelst" | "makkelijkst" | "nieuwste";

interface Filters {
  q: string;
  cat: Category | "alle";
  course: Course | "alle";
  level: Difficulty | "alle";
  time: TimeFilter;
  sort: Sort;
}

const DEFAULTS: Filters = { q: "", cat: "alle", course: "alle", level: "alle", time: "alle", sort: "aanbevolen" };

const TIME_OPTIONS: { value: TimeFilter; label: string }[] = [
  { value: "alle", label: "Alle" },
  { value: "30", label: "≤ 30 min" },
  { value: "45", label: "≤ 45 min" },
  { value: "60", label: "≤ 1 uur" },
  { value: "60+", label: "> 1 uur" },
];

const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: "aanbevolen", label: "Aanbevolen" },
  { value: "snelst", label: "Snelst klaar" },
  { value: "makkelijkst", label: "Makkelijkst" },
  { value: "nieuwste", label: "Nieuwste" },
];

const normalize = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function pick<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function readFilters(params: URLSearchParams): Filters {
  return {
    q: params.get("q") ?? "",
    cat: pick(params.get("categorie"), ["alle", ...CATEGORIES] as const, "alle"),
    course: pick(params.get("type"), ["alle", ...COURSES] as const, "alle"),
    level: pick(params.get("niveau"), ["alle", ...DIFFICULTIES] as const, "alle"),
    time: pick(params.get("tijd"), ["alle", "30", "45", "60", "60+"] as const, "alle"),
    sort: pick(params.get("sorteer"), ["aanbevolen", "snelst", "makkelijkst", "nieuwste"] as const, "aanbevolen"),
  };
}

function writeFilters(f: Filters): string {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.cat !== "alle") p.set("categorie", f.cat);
  if (f.course !== "alle") p.set("type", f.course);
  if (f.level !== "alle") p.set("niveau", f.level);
  if (f.time !== "alle") p.set("tijd", f.time);
  if (f.sort !== "aanbevolen") p.set("sorteer", f.sort);
  return p.toString();
}

export function filterRecipes(recipes: RecipeDetail[], f: Filters): RecipeDetail[] {
  const words = normalize(f.q.trim()).split(/\s+/).filter(Boolean);
  const list = recipes.filter((r) => {
    if (f.cat !== "alle" && !r.categories.includes(f.cat)) return false;
    if (f.course !== "alle" && r.course !== f.course) return false;
    if (f.level !== "alle" && r.difficulty !== f.level) return false;
    const t = r.totalMinutes;
    if (f.time === "30" && t > 30) return false;
    if (f.time === "45" && t > 45) return false;
    if (f.time === "60" && t > 60) return false;
    if (f.time === "60+" && t <= 60) return false;
    if (words.length) {
      const haystack = normalize(
        [
          r.title,
          r.subtitle ?? "",
          r.description,
          COURSE_LABEL[r.course],
          ...r.categories.map((c) => CATEGORY_LABEL[c]),
          ...r.keyIngredients,
          ...r.ingredients.map((i) => i.name),
          ...r.steps.map((s) => s.title),
        ].join(" "),
      );
      return words.every((w) => haystack.includes(w));
    }
    return true;
  });
  const order = new Map(recipes.map((r, i) => [r.id, i]));
  switch (f.sort) {
    case "snelst":
      return list.sort((a, b) => a.totalMinutes - b.totalMinutes);
    case "makkelijkst":
      return list.sort((a, b) => DIFFICULTY_LEVEL[a.difficulty] - DIFFICULTY_LEVEL[b.difficulty] || a.totalMinutes - b.totalMinutes);
    case "nieuwste":
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    default:
      return list.sort((a, b) => Number(b.isDaily) - Number(a.isDaily) || (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  }
}

function Segmented<T extends string>({ name, label, options, value, onChange }: { name: string; label: string; options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap items-center gap-1">
      <span className="eyebrow mr-2 text-[9.5px] text-muted">{label}</span>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn("relative h-10 rounded-full px-4 text-[13px] font-semibold transition-colors", active ? "text-ivory" : "text-ink-soft hover:text-ink")}
          >
            {active && <motion.span layoutId={`seg-${name}`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function RecipeLibrary() {
  const { recipes } = useKitchen();
  const params = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => readFilters(new URLSearchParams(params.toString())));
  const [panelOpen, setPanelOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.location.hash === "#zoeken") inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const qs = writeFilters(filters);
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
    window.history.replaceState(window.history.state, "", url);
  }, [filters]);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((f) => ({ ...f, [key]: value }));
  const results = useMemo(() => filterRecipes(recipes, filters), [recipes, filters]);
  const activeCount = (["cat", "course", "level", "time"] as const).filter((k) => filters[k] !== "alle").length;
  const counts = useMemo(() => {
    const map = new Map<Category, number>();
    recipes.forEach((r) => r.categories.forEach((c) => map.set(c, (map.get(c) ?? 0) + 1)));
    return map;
  }, [recipes]);

  const filterControls = (
    <div className="flex flex-col gap-4 xl:flex-row xl:flex-wrap xl:items-center xl:gap-x-8">
      <Segmented name="course" label="Type" value={filters.course} onChange={(v) => set("course", v)} options={[{ value: "alle", label: "Alle" }, ...COURSES.map((c) => ({ value: c, label: COURSE_LABEL[c] }))]} />
      <Segmented name="level" label="Niveau" value={filters.level} onChange={(v) => set("level", v)} options={[{ value: "alle", label: "Alle" }, ...DIFFICULTIES.map((d) => ({ value: d, label: DIFFICULTY_LABEL[d] }))]} />
      <Segmented name="time" label="Tijd" value={filters.time} onChange={(v) => set("time", v)} options={TIME_OPTIONS} />
    </div>
  );

  return (
    <div className="pt-[72px]">
      <section className="paper-grain border-b border-line bg-paper">
        <div className="container-page pb-10 pt-14 lg:pb-14 lg:pt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE_CHEF }}>
            <p className="eyebrow flex items-center gap-3 text-brass">
              <span className="h-px w-8 bg-brass/70" />
              Receptenbibliotheek
            </p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h1 className="font-serif text-[clamp(3.2rem,8vw,6.5rem)] leading-[0.9]">
                Alle <em className="text-brass">recepten</em>
              </h1>
              <p className="max-w-sm text-[16px] leading-relaxed text-muted">
                {recipes.length} recepten, van snelle voorgerechten tot patisserie. Zoek op gerecht, ingrediënt of techniek.
              </p>
            </div>
          </motion.div>

          <div id="zoeken" className="relative mt-10 scroll-mt-28">
            <Search className="pointer-events-none absolute left-6 top-1/2 size-5 -translate-y-1/2 text-muted md:left-8 md:size-6" strokeWidth={1.8} />
            <input
              ref={inputRef}
              type="search"
              value={filters.q}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Zoek op gerecht, ingrediënt of techniek…"
              aria-label="Zoek recepten"
              className="h-16 w-full rounded-full border border-line bg-cream pl-14 pr-16 font-serif text-[1.35rem] shadow-card transition placeholder:text-muted/55 focus:border-brass/60 focus:bg-white focus:outline-none focus:ring-8 focus:ring-brass/10 md:h-20 md:pl-[4.5rem] md:text-[1.7rem] [&::-webkit-search-cancel-button]:hidden"
            />
            <AnimatePresence>
              {filters.q && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => {
                    set("q", "");
                    inputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink hover:bg-linen md:right-5"
                  aria-label="Zoekopdracht wissen"
                >
                  <X className="size-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="no-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
            {(["alle", ...CATEGORIES] as const).map((c) => {
              const active = filters.cat === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active}
                  onClick={() => set("cat", c)}
                  className={cn("flex h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-[14px] font-semibold transition-all duration-300", active ? "border-ink bg-ink text-ivory" : "border-line bg-cream text-ink-soft hover:border-ink/30")}
                >
                  {c === "alle" ? "Alles" : CATEGORY_LABEL[c]}
                  <span className={cn("text-[11px] tabular-nums", active ? "text-ivory/60" : "text-muted")}>{c === "alle" ? recipes.length : (counts.get(c) ?? 0)}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 hidden lg:block">{filterControls}</div>
          <div className="mt-5 lg:hidden">
            <Button variant="secondary" onClick={() => setPanelOpen((v) => !v)} aria-expanded={panelOpen}>
              <SlidersHorizontal className="size-4" /> Filters {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-brass text-[11px] text-white">{activeCount}</span>}
            </Button>
            <AnimatePresence initial={false}>
              {panelOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE_CHEF }} className="overflow-hidden">
                  <div className="pt-5">{filterControls}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="container-page py-10 lg:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[14px] text-muted">
            <span className="font-semibold text-ink">{results.length}</span> {results.length === 1 ? "recept" : "recepten"}
            {(activeCount > 0 || filters.q) && (
              <button type="button" onClick={() => setFilters({ ...DEFAULTS, sort: filters.sort })} className="ml-4 font-semibold text-ink underline underline-offset-4 hover:text-brass">
                Filters wissen
              </button>
            )}
          </p>
          <label className="flex items-center gap-3 text-[13px] text-muted">
            Sorteer
            <select value={filters.sort} onChange={(e) => set("sort", e.target.value as Sort)} className="h-10 rounded-full border border-line bg-cream px-4 text-[13px] font-semibold text-ink focus:border-brass focus:outline-none">
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {results.length > 0 ? (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {results.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: EASE_CHEF }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
            <div className="size-44">
              <ClocheIllustration label="?" />
            </div>
            <h2 className="mt-6 font-serif text-4xl">Niets onder deze cloche</h2>
            <p className="mt-3 text-muted">Geen recepten gevonden voor deze combinatie. Probeer een ander ingrediënt of wis de filters.</p>
            <Button className="mt-8" onClick={() => setFilters(DEFAULTS)}>
              Toon alle recepten
            </Button>
          </motion.div>
        )}
      </section>
    </div>
  );
}
