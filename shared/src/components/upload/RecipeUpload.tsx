"use client";

import { AnimatePresence, Reorder, motion, useDragControls } from "framer-motion";
import { Check, ChevronDown, GripVertical, Plus, Trash, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { RecipeDetail, RecipeDraft, SceneKey } from "@/lib/types";
import { CATEGORIES, CATEGORY_LABEL, COURSES, COURSE_LABEL, DIFFICULTIES, DIFFICULTY_LABEL, PLATING_PRINCIPLES, SCENE_LABEL, TONE_BY_CATEGORY, UNITS } from "@/lib/constants";
import { useKitchen } from "@/lib/store/kitchen";
import { readPreference, writePreference } from "@/lib/services/storage";
import { cn, createId, formatMinutes } from "@/lib/utils";
import { ClocheIllustration } from "@/components/illustrations/Cloche";
import { TechniqueScene } from "@/components/illustrations/scenes";
import { ServingsStepper } from "@/components/recipe/IngredientList";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input, Label, Select, Textarea, inputClass } from "@/components/ui/Field";
import { DifficultyMeter } from "@/components/ui/Meta";
import { EASE_CHEF } from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";
import { ImageUpload, MultiImageUpload } from "./ImageUpload";

type IngredientDraft = RecipeDraft["ingredients"][number];
type StepDraft = RecipeDraft["steps"][number];
type ErrorKey = "title" | "description" | "ingredients" | "steps";
type Errors = Partial<Record<ErrorKey, string>>;

const SCENE_OPTIONS = (Object.keys(SCENE_LABEL) as SceneKey[]).filter((k) => k !== "plate");
const DRAFT_KEY = "recipe-draft";

const SECTIONS = [
  { id: "algemeen", label: "Algemeen" },
  { id: "ingredienten", label: "Ingrediënten" },
  { id: "bereiding", label: "Bereiding" },
  { id: "fotos", label: "Foto's" },
  { id: "plating", label: "Plating" },
  { id: "publiceren", label: "Publiceren" },
] as const;

const newIngredient = (): IngredientDraft => ({ key: createId("ing"), quantity: "", unit: "g", name: "" });
const newStep = (): StepDraft => ({ key: createId("stp"), title: "", body: "", imageUrl: null, timerMinutes: "", scene: "" });

function emptyDraft(): RecipeDraft {
  return {
    title: "",
    description: "",
    servings: 4,
    prepMinutes: 15,
    cookMinutes: 30,
    difficulty: "gemiddeld",
    course: "hoofdgerecht",
    categories: [],
    ingredients: [newIngredient(), newIngredient(), newIngredient()],
    steps: [newStep(), newStep()],
    photos: [],
    platingNotes: "",
    chefTip: "",
    equipment: "",
    isPublic: true,
  };
}

function draftFromRecipe(r: RecipeDetail): RecipeDraft {
  return {
    title: r.title,
    description: r.description,
    servings: r.servings,
    prepMinutes: r.prepMinutes,
    cookMinutes: r.cookMinutes,
    difficulty: r.difficulty,
    course: r.course,
    categories: r.categories,
    ingredients: r.ingredients.length
      ? r.ingredients.map((i) => ({ key: createId("ing"), quantity: i.quantity === null ? "" : String(i.quantity).replace(".", ","), unit: i.unit, name: i.name }))
      : [newIngredient()],
    steps: r.steps.length
      ? r.steps.map((s) => ({
          key: createId("stp"),
          title: s.title,
          body: s.body,
          imageUrl: s.imageUrl,
          timerMinutes: s.timerSeconds ? String(Math.round(s.timerSeconds / 6) / 10).replace(".", ",") : "",
          scene: s.scene && s.scene.key !== "plate" ? s.scene.key : "",
        }))
      : [newStep()],
    photos: r.gallery,
    platingNotes: r.platingNotes ?? "",
    chefTip: r.chefTip ?? "",
    equipment: r.equipment.join(", "),
    isPublic: r.isPublic,
  };
}

function validate(d: RecipeDraft): Errors {
  const errors: Errors = {};
  if (d.title.trim().length < 3) errors.title = "Geef je recept een naam van minstens drie tekens.";
  if (d.description.trim().length < 10) errors.description = "Beschrijf je gerecht in een of twee zinnen.";
  if (!d.ingredients.some((i) => i.name.trim())) errors.ingredients = "Voeg minstens één ingrediënt toe.";
  if (!d.steps.some((s) => s.body.trim() || s.title.trim())) errors.steps = "Beschrijf minstens één bereidingsstap.";
  return errors;
}

/* ------------------------------------------------------------------ */
/* Bouwstenen                                                          */
/* ------------------------------------------------------------------ */
function Section({ id, number, title, description, error, children }: { id: string; number: string; title: string; description?: string; error?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 rounded-[32px] border border-line bg-cream p-5 sm:p-8 lg:p-10">
      <div className="flex items-start gap-4 sm:gap-6">
        <span className="font-serif text-[2.8rem] italic leading-[0.8] text-brass/70">{number}</span>
        <div>
          <h2 className="font-serif text-[2.1rem] leading-none sm:text-[2.4rem]">{title}</h2>
          {description && <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">{description}</p>}
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-5 overflow-hidden rounded-2xl bg-bordeaux/[0.06] px-4 py-3 text-[14px] font-medium text-bordeaux" role="alert">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Choice<T extends string>({ value, options, onChange, label, render }: { value: T; options: readonly T[]; onChange: (v: T) => void; label: string; render: (v: T) => ReactNode }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn("inline-flex h-12 items-center gap-2 rounded-full border px-5 text-[14px] font-semibold transition-all duration-300", value === o ? "border-ink bg-ink text-ivory" : "border-line bg-ivory text-ink-soft hover:border-ink/30")}
        >
          {render(o)}
        </button>
      ))}
    </div>
  );
}

function IngredientRow({
  item,
  index,
  canRemove,
  onChange,
  onRemove,
  onEnter,
  registerInput,
}: {
  item: IngredientDraft;
  index: number;
  canRemove: boolean;
  onChange: (patch: Partial<IngredientDraft>) => void;
  onRemove: () => void;
  onEnter: () => void;
  registerInput: (el: HTMLInputElement | null) => void;
}) {
  const controls = useDragControls();
  const units = UNITS.includes(item.unit) ? UNITS : [item.unit, ...UNITS];
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      whileDrag={{ scale: 1.015, boxShadow: "0 18px 40px -20px rgba(31,26,23,.35)" }}
      className="relative rounded-2xl bg-cream"
    >
      <div className="grid grid-cols-[2rem_1fr_1fr_2.75rem] gap-2 py-1.5 sm:grid-cols-[2rem_5.5rem_7.5rem_1fr_2.75rem] sm:items-center">
        <button
          type="button"
          onPointerDown={(e) => controls.start(e)}
          className="grid h-12 cursor-grab touch-none place-items-center rounded-lg text-muted hover:text-ink active:cursor-grabbing"
          aria-label={`Versleep ingrediënt ${index + 1}`}
        >
          <GripVertical className="size-4" />
        </button>
        <input
          aria-label={`Hoeveelheid van ingrediënt ${index + 1}`}
          inputMode="decimal"
          placeholder="200"
          value={item.quantity}
          onChange={(e) => onChange({ quantity: e.target.value })}
          className={cn(inputClass, "h-12 px-3 py-0 text-center font-semibold")}
        />
        <select aria-label={`Eenheid van ingrediënt ${index + 1}`} value={item.unit} onChange={(e) => onChange({ unit: e.target.value })} className={cn(inputClass, "h-12 px-3 py-0")}>
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <input
          ref={registerInput}
          aria-label={`Naam van ingrediënt ${index + 1}`}
          placeholder={index === 0 ? "bloem" : "ingrediënt"}
          value={item.name}
          onChange={(e) => onChange({ name: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onEnter();
            }
          }}
          className={cn(inputClass, "col-span-3 col-start-2 h-12 py-0 sm:col-span-1 sm:col-start-auto")}
        />
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="col-start-4 row-start-1 grid size-12 place-items-center rounded-full text-muted transition hover:bg-bordeaux/10 hover:text-bordeaux disabled:pointer-events-none disabled:opacity-25 sm:col-start-auto sm:row-start-auto"
          aria-label={`Verwijder ingrediënt ${index + 1}`}
        >
          <Trash className="size-4" />
        </button>
      </div>
    </Reorder.Item>
  );
}

function StepCard({
  step,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  step: StepDraft;
  index: number;
  total: number;
  onChange: (patch: Partial<StepDraft>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  return (
    <motion.li layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.4, ease: EASE_CHEF }} className="rounded-[26px] border border-line bg-ivory p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink font-serif text-xl italic text-ivory">{index + 1}</span>
        <input
          value={step.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder={index === 0 ? "Bijvoorbeeld: Verhit de pan" : `Titel van stap ${index + 1}`}
          aria-label={`Titel van stap ${index + 1}`}
          className="min-w-0 flex-1 rounded-xl bg-transparent px-2 py-2 font-serif text-[1.55rem] leading-tight placeholder:text-muted/40 focus:bg-cream focus:outline-none"
        />
        <div className="flex shrink-0 items-center">
          <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className="grid size-10 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink disabled:opacity-25" aria-label="Stap omhoog">
            <ChevronDown className="size-4 rotate-180" />
          </button>
          <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} className="grid size-10 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink disabled:opacity-25" aria-label="Stap omlaag">
            <ChevronDown className="size-4" />
          </button>
          <button type="button" onClick={onRemove} disabled={total === 1} className="grid size-10 place-items-center rounded-full text-muted hover:bg-bordeaux/10 hover:text-bordeaux disabled:opacity-25" aria-label={`Verwijder stap ${index + 1}`}>
            <Trash className="size-4" />
          </button>
        </div>
      </div>
      <Textarea
        className="mt-4"
        rows={3}
        value={step.body}
        onChange={(e) => onChange({ body: e.target.value })}
        placeholder="Leg uit wat je doet, waar je op let en hoe het eruit moet zien."
        aria-label={`Uitleg van stap ${index + 1}`}
      />
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor={`scene-${step.key}`} hint="Geanimeerd">
              Techniek-illustratie
            </Label>
            <Select id={`scene-${step.key}`} value={step.scene} onChange={(e) => onChange({ scene: e.target.value as StepDraft["scene"] })}>
              <option value="">Geen illustratie</option>
              {SCENE_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {SCENE_LABEL[k]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor={`timer-${step.key}`} hint="optioneel">
              Kooktijd voor timer
            </Label>
            <div className="relative">
              <Input id={`timer-${step.key}`} inputMode="decimal" placeholder="0" value={step.timerMinutes} onChange={(e) => onChange({ timerMinutes: e.target.value })} className="pr-14" />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">min</span>
            </div>
          </div>
          <AnimatePresence>
            {step.scene && !step.imageUrl && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="aspect-[4/3] rounded-2xl bg-paper p-2">
                  <TechniqueScene spec={{ key: step.scene }} className="h-full w-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div>
          <Label hint="vervangt de illustratie">Foto van deze stap</Label>
          <ImageUpload value={step.imageUrl} onChange={(url) => onChange({ imageUrl: url })} label="Foto toevoegen" hint="Tik om een foto te kiezen" aspect="aspect-[4/3]" />
        </div>
      </div>
    </motion.li>
  );
}

function PreviewCard({ draft }: { draft: RecipeDraft }) {
  const category = draft.categories[0];
  const tone = category ? TONE_BY_CATEGORY[category] : "#EFE8DD";
  const ingredients = draft.ingredients.filter((i) => i.name.trim()).length;
  const steps = draft.steps.filter((s) => s.title.trim() || s.body.trim()).length;
  return (
    <div className="overflow-hidden rounded-[28px] bg-cream shadow-card">
      <div className="relative aspect-square transition-colors duration-500" style={{ background: tone }}>
        {draft.photos[0] ? (
          <img src={draft.photos[0]} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-[10%]">
            <ClocheIllustration label={draft.title || "?"} />
          </div>
        )}
        <span className="eyebrow absolute left-4 top-4 rounded-full bg-cream/85 px-3 py-1.5 text-[9px] backdrop-blur">Live voorbeeld</span>
      </div>
      <div className="p-5">
        <p className="eyebrow text-[10px] text-brass">
          {COURSE_LABEL[draft.course]}
          {category ? ` · ${CATEGORY_LABEL[category]}` : ""}
        </p>
        <h3 className={cn("mt-2 font-serif text-[1.8rem] leading-[1.05]", !draft.title && "text-muted/50")}>{draft.title || "Naam van je recept"}</h3>
        <p className={cn("mt-2 line-clamp-3 text-[14px] leading-relaxed", draft.description ? "text-muted" : "text-muted/50")}>{draft.description || "Een korte, smakelijke omschrijving van je gerecht."}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-medium text-ink-soft">
          <span>{formatMinutes(draft.prepMinutes + draft.cookMinutes)}</span>
          <DifficultyMeter difficulty={draft.difficulty} />
          <span>{draft.servings} pers.</span>
        </div>
        <p className="mt-3 border-t border-line pt-3 text-[13px] text-muted">
          {ingredients} {ingredients === 1 ? "ingrediënt" : "ingrediënten"} · {steps} {steps === 1 ? "stap" : "stappen"} · {draft.photos.length} foto&apos;s
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Formulier                                                           */
/* ------------------------------------------------------------------ */
export function RecipeUpload() {
  const { myRecipes, saveRecipe, deleteRecipe } = useKitchen();
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const editId = params.get("bewerk");
  const editing = editId ? myRecipes.find((r) => r.id === editId) : undefined;

  const [draft, setDraft] = useState<RecipeDraft>(() => (editing ? draftFromRecipe(editing) : emptyDraft()));
  const [restored, setRestored] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const ingredientInputs = useRef(new Map<string, HTMLInputElement>());

  useEffect(() => {
    if (editId) return;
    const saved = readPreference<RecipeDraft | null>(DRAFT_KEY, null);
    if (saved && (saved.title?.trim() || saved.ingredients?.some((i) => i.name.trim()))) {
      const base = emptyDraft();
      setDraft({
        ...base,
        ...saved,
        photos: [],
        ingredients: saved.ingredients?.length ? saved.ingredients : base.ingredients,
        steps: saved.steps?.length ? saved.steps.map((s) => ({ ...s, imageUrl: null })) : base.steps,
      });
      setRestored(true);
    }
  }, [editId]);

  useEffect(() => {
    if (editId) return;
    const timer = window.setTimeout(() => writePreference(DRAFT_KEY, { ...draft, photos: [], steps: draft.steps.map((s) => ({ ...s, imageUrl: null })) }), 500);
    return () => window.clearTimeout(timer);
  }, [draft, editId]);

  const update = (patch: Partial<RecipeDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      if (patch.title !== undefined) delete next.title;
      if (patch.description !== undefined) delete next.description;
      if (patch.ingredients) delete next.ingredients;
      if (patch.steps) delete next.steps;
      return next;
    });
  };

  const setIngredient = (key: string, patch: Partial<IngredientDraft>) => update({ ingredients: draft.ingredients.map((i) => (i.key === key ? { ...i, ...patch } : i)) });
  const addIngredient = (afterKey?: string) => {
    const item = newIngredient();
    const idx = afterKey ? draft.ingredients.findIndex((i) => i.key === afterKey) : draft.ingredients.length - 1;
    const next = [...draft.ingredients];
    next.splice(idx + 1, 0, item);
    update({ ingredients: next });
    window.setTimeout(() => ingredientInputs.current.get(item.key)?.focus(), 40);
  };

  const setStep = (key: string, patch: Partial<StepDraft>) => update({ steps: draft.steps.map((s) => (s.key === key ? { ...s, ...patch } : s)) });
  const moveStep = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= draft.steps.length) return;
    const next = [...draft.steps];
    [next[index], next[target]] = [next[target], next[index]];
    update({ steps: next });
  };

  const filledIngredients = draft.ingredients.filter((i) => i.name.trim()).length;
  const filledSteps = draft.steps.filter((s) => s.title.trim() || s.body.trim()).length;
  const complete: Record<(typeof SECTIONS)[number]["id"], boolean> = {
    algemeen: draft.title.trim().length >= 3 && draft.description.trim().length >= 10,
    ingredienten: filledIngredients > 0,
    bereiding: filledSteps > 0,
    fotos: draft.photos.length > 0,
    plating: Boolean(draft.platingNotes.trim()),
    publiceren: false,
  };

  const publish = async () => {
    const found = validate(draft);
    setErrors(found);
    const firstSection = found.title || found.description ? "algemeen" : found.ingredients ? "ingredienten" : found.steps ? "bereiding" : null;
    if (firstSection) {
      toast({ title: "Nog even aanvullen", description: Object.values(found)[0] });
      document.getElementById(firstSection)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setBusy(true);
    const saved = await saveRecipe(draft, editing?.id);
    if (!saved) {
      setBusy(false);
      toast({ title: "Opslaan is mislukt", description: "Probeer het nog eens." });
      return;
    }
    if (!editing) writePreference(DRAFT_KEY, null);
    toast({ title: editing ? "Wijzigingen opgeslagen" : "Recept gepubliceerd", description: saved.title, tone: "success" });
    router.push(`/recepten/${saved.slug}`);
  };

  const resetDraft = () => {
    writePreference(DRAFT_KEY, null);
    setDraft(emptyDraft());
    setErrors({});
    setRestored(false);
  };

  if (editId && !editing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pb-24 pt-[120px] text-center">
        <h1 className="font-serif text-5xl">Dit recept kun je niet bewerken</h1>
        <p className="mt-4 max-w-md text-muted">Alleen de auteur kan een recept aanpassen. Begin gerust aan een eigen versie.</p>
        <div className="mt-8 flex gap-3">
          <ButtonLink href="/eigen-recept">Nieuw recept</ButtonLink>
          <ButtonLink href="/mijn-keuken?filter=eigen" variant="secondary">
            Mijn recepten
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[72px]">
      <section className="paper-grain border-b border-line bg-paper">
        <div className="container-page pb-12 pt-14 lg:pb-16 lg:pt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE_CHEF }} className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow flex items-center gap-3 text-brass">
                <span className="h-px w-8 bg-brass/70" />
                {editing ? "Recept bewerken" : "Eigen recept"}
              </p>
              <h1 className="mt-4 font-serif text-[clamp(3rem,7.5vw,6.2rem)] leading-[0.9]">
                {editing ? (
                  <>
                    Verfijn je <em className="text-brass">recept</em>
                  </>
                ) : (
                  <>
                    Maak je eigen <em className="text-brass">recept</em>
                  </>
                )}
              </h1>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
                Leg je signatuurgerecht vast zoals een chef dat doet: een heldere mise en place, precieze stappen en aandacht voor het bord.
              </p>
            </div>
            <AnimatePresence>
              {restored && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 self-start rounded-full border border-line bg-cream py-2 pl-4 pr-2 text-[13.5px] lg:self-end">
                  <span className="size-2 rounded-full bg-sage" />
                  Je concept is hersteld
                  <button type="button" onClick={resetDraft} className="rounded-full px-3 py-1.5 font-semibold hover:bg-ink/5">
                    Opnieuw beginnen
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12 lg:py-14 xl:grid-cols-[200px_minmax(0,1fr)_320px]">
        <aside className="hidden lg:block">
          <nav className="sticky top-[104px] space-y-1" aria-label="Onderdelen van het formulier">
            {SECTIONS.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[14px] font-semibold text-ink-soft transition hover:bg-cream">
                <span className={cn("grid size-7 place-items-center rounded-full border text-[11px] transition-colors", complete[s.id] ? "border-sage bg-sage text-white" : "border-line text-muted group-hover:border-ink/30")}>
                  {complete[s.id] ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                </span>
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        <form
          className="min-w-0 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            publish();
          }}
          noValidate
        >
          <Section id="algemeen" number="01" title="Algemene informatie" description="De eerste indruk: hoe heet je gerecht en waarom wil iemand het maken?" error={errors.title ?? errors.description}>
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Receptnaam</Label>
                <input
                  id="title"
                  value={draft.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="Bijvoorbeeld: Oma's stoofvlees met donker bier"
                  maxLength={90}
                  className="w-full border-b-2 border-line bg-transparent pb-3 font-serif text-[clamp(1.9rem,4vw,2.8rem)] leading-tight placeholder:text-muted/35 focus:border-brass focus:outline-none"
                />
              </div>
              <div>
                <Label htmlFor="description" hint={`${draft.description.length}/280`}>
                  Korte uitleg
                </Label>
                <Textarea id="description" value={draft.description} onChange={(e) => update({ description: e.target.value })} maxLength={280} rows={3} placeholder="Wat maakt dit gerecht bijzonder? Welke smaken en texturen mag je verwachten?" />
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <Label>Aantal personen</Label>
                  <ServingsStepper value={draft.servings} onChange={(n) => update({ servings: n })} />
                </div>
                <div>
                  <Label htmlFor="prep">Voorbereidingstijd</Label>
                  <div className="relative">
                    <Input id="prep" type="number" min={0} max={1440} inputMode="numeric" value={draft.prepMinutes} onChange={(e) => update({ prepMinutes: Number(e.target.value) })} className="pr-14" />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">min</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="cook">Bereidingstijd</Label>
                  <div className="relative">
                    <Input id="cook" type="number" min={0} max={1440} inputMode="numeric" value={draft.cookMinutes} onChange={(e) => update({ cookMinutes: Number(e.target.value) })} className="pr-14" />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">min</span>
                  </div>
                </div>
              </div>
              <div>
                <Label>Moeilijkheid</Label>
                <Choice
                  label="Moeilijkheid"
                  value={draft.difficulty}
                  options={DIFFICULTIES}
                  onChange={(v) => update({ difficulty: v })}
                  render={(v) => (
                    <>
                      <DifficultyMeter difficulty={v} showLabel={false} /> {DIFFICULTY_LABEL[v]}
                    </>
                  )}
                />
              </div>
              <div>
                <Label>Type gerecht</Label>
                <Choice label="Type gerecht" value={draft.course} options={COURSES} onChange={(v) => update({ course: v })} render={(v) => COURSE_LABEL[v]} />
              </div>
              <div>
                <Label hint="meerdere mogelijk">Categorie</Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => {
                    const active = draft.categories.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        aria-pressed={active}
                        onClick={() => update({ categories: active ? draft.categories.filter((x) => x !== c) : [...draft.categories, c] })}
                        className={cn("inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[14px] font-semibold transition-all", active ? "border-brass bg-brass text-white" : "border-line bg-ivory text-ink-soft hover:border-ink/30")}
                      >
                        {active && <Check className="size-3.5" strokeWidth={3} />}
                        {CATEGORY_LABEL[c]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Section>

          <Section id="ingredienten" number="02" title="Ingrediënten" description="Hoeveelheid, eenheid en naam — bijvoorbeeld 200 | g | bloem. Druk op Enter voor een nieuwe regel en versleep om te ordenen." error={errors.ingredients}>
            <div className="hidden grid-cols-[2rem_5.5rem_7.5rem_1fr_2.75rem] gap-2 px-0 pb-2 sm:grid">
              <span />
              <span className="eyebrow text-center text-[9.5px] text-muted">Hoeveel</span>
              <span className="eyebrow text-[9.5px] text-muted">Eenheid</span>
              <span className="eyebrow text-[9.5px] text-muted">Ingrediënt</span>
            </div>
            <Reorder.Group axis="y" values={draft.ingredients} onReorder={(items) => update({ ingredients: items })} className="space-y-1 sm:space-y-0">
              <AnimatePresence initial={false}>
                {draft.ingredients.map((item, i) => (
                  <IngredientRow
                    key={item.key}
                    item={item}
                    index={i}
                    canRemove={draft.ingredients.length > 1}
                    onChange={(patch) => setIngredient(item.key, patch)}
                    onRemove={() => update({ ingredients: draft.ingredients.filter((x) => x.key !== item.key) })}
                    onEnter={() => addIngredient(item.key)}
                    registerInput={(el) => {
                      if (el) ingredientInputs.current.set(item.key, el);
                      else ingredientInputs.current.delete(item.key);
                    }}
                  />
                ))}
              </AnimatePresence>
            </Reorder.Group>
            <button type="button" onClick={() => addIngredient()} className="mt-4 inline-flex h-12 items-center gap-2 rounded-full border-2 border-dashed border-brass/50 px-5 text-[14px] font-semibold text-brass transition hover:border-brass hover:bg-brass/5">
              <Plus className="size-4" /> Ingrediënt toevoegen
            </button>
          </Section>

          <Section id="bereiding" number="03" title="Bereiding" description="Schrijf elke stap zoals je hem aan een vriend in je keuken zou uitleggen. Kies een illustratie of voeg een eigen foto toe." error={errors.steps}>
            <ol className="space-y-4">
              <AnimatePresence initial={false}>
                {draft.steps.map((step, i) => (
                  <StepCard
                    key={step.key}
                    step={step}
                    index={i}
                    total={draft.steps.length}
                    onChange={(patch) => setStep(step.key, patch)}
                    onRemove={() => update({ steps: draft.steps.filter((s) => s.key !== step.key) })}
                    onMove={(dir) => moveStep(i, dir)}
                  />
                ))}
              </AnimatePresence>
            </ol>
            <button type="button" onClick={() => update({ steps: [...draft.steps, newStep()] })} className="mt-4 inline-flex h-12 items-center gap-2 rounded-full border-2 border-dashed border-brass/50 px-5 text-[14px] font-semibold text-brass transition hover:border-brass hover:bg-brass/5">
              <Plus className="size-4" /> Stap toevoegen
            </button>
          </Section>

          <Section id="fotos" number="04" title="Foto's" description="Laat zien hoe je gerecht eruitziet. De eerste foto wordt de omslag van je recept.">
            <MultiImageUpload values={draft.photos} onChange={(photos) => update({ photos })} />
          </Section>

          <Section id="plating" number="05" title="Plating" description="Een recept eindigt niet in de pan, maar op het bord.">
            <Label htmlFor="plating">Hoe heb je het gerecht opgemaakt?</Label>
            <Textarea id="plating" rows={4} value={draft.platingNotes} onChange={(e) => update({ platingNotes: e.target.value })} placeholder="Bijvoorbeeld: diep bord, stoofvlees iets uit het midden, een lepel saus erover en verse peterselie als groen accent." />
            <div className="mt-5 flex flex-wrap gap-2">
              {PLATING_PRINCIPLES.map((p) => (
                <span key={p.key} className="rounded-full bg-paper px-3 py-1.5 text-[12.5px] text-ink-soft">
                  {p.title}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <Label htmlFor="chef-tip" hint="Optioneel">
                Jouw cheftip
              </Label>
              <Textarea id="chef-tip" rows={2} value={draft.chefTip} onChange={(e) => update({ chefTip: e.target.value })} placeholder="Het ene detail dat het verschil maakt — een temperatuur, een timing, een truc." maxLength={800} />
            </div>
            <div className="mt-6">
              <Label htmlFor="equipment" hint="Optioneel · scheid met komma's">
                Benodigd materiaal
              </Label>
              <Input id="equipment" value={draft.equipment} onChange={(e) => update({ equipment: e.target.value })} placeholder="Gietijzeren pan, kernthermometer, zeef" />
            </div>
          </Section>

          <Section id="publiceren" number="06" title={editing ? "Opslaan" : "Publiceren"} description={editing ? "Je wijzigingen zijn direct zichtbaar in je keuken en op de receptpagina." : "Je recept verschijnt in Mijn keuken en in de receptenbibliotheek."}>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                ["Naam en uitleg", complete.algemeen],
                [`${filledIngredients} ${filledIngredients === 1 ? "ingrediënt" : "ingrediënten"}`, complete.ingredienten],
                [`${filledSteps} ${filledSteps === 1 ? "bereidingsstap" : "bereidingsstappen"}`, complete.bereiding],
                [draft.photos.length ? `${draft.photos.length} foto's` : "Foto's (optioneel)", complete.fotos],
                ["Plating-notities (optioneel)", complete.plating],
              ].map(([label, ok]) => (
                <li key={String(label)} className="flex items-center gap-3 rounded-2xl bg-ivory px-4 py-3 text-[14px]">
                  <span className={cn("grid size-6 place-items-center rounded-full", ok ? "bg-sage text-white" : "border border-line text-muted")}>{ok ? <Check className="size-3.5" strokeWidth={3} /> : <X className="size-3" />}</span>
                  {label}
                </li>
              ))}
            </ul>
            <fieldset className="mt-8">
              <legend className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">Zichtbaarheid</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {(
                  [
                    [true, "Openbaar", "Andere leden vinden je recept in de bibliotheek."],
                    [false, "Alleen voor mij", "Je recept staat alleen in Mijn keuken."],
                  ] as const
                ).map(([value, label, hint]) => (
                  <label
                    key={String(value)}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition",
                      draft.isPublic === value ? "border-brass bg-brass/5" : "border-line bg-ivory hover:border-ink/25",
                    )}
                  >
                    <input type="radio" name="zichtbaarheid" className="mt-1 accent-[#8C6A3F]" checked={draft.isPublic === value} onChange={() => update({ isPublic: value })} />
                    <span>
                      <span className="block text-[14px] font-semibold">{label}</span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-muted">{hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button type="submit" size="lg" disabled={busy} className="min-w-56">
                {busy ? "Bezig…" : editing ? "Wijzigingen opslaan" : "Recept publiceren"}
              </Button>
              {editing ? (
                <>
                  <ButtonLink href={`/recepten/${editing.slug}`} variant="ghost" size="lg">
                    Annuleren
                  </ButtonLink>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-bordeaux hover:bg-bordeaux/5"
                    onClick={() => {
                      if (!window.confirm(`“${editing.title}” definitief verwijderen?`)) return;
                      deleteRecipe(editing.id);
                      toast({ title: "Recept verwijderd" });
                      router.push("/mijn-keuken?filter=eigen");
                    }}
                  >
                    <Trash className="size-4" /> Verwijderen
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="lg" onClick={resetDraft}>
                  Concept wissen
                </Button>
              )}
            </div>
            {!editing && <p className="mt-4 text-[13px] text-muted">Je tekst wordt automatisch als concept bewaard in deze browser.</p>}
          </Section>
        </form>

        <aside className="hidden xl:block">
          <div className="sticky top-[104px] space-y-4">
            <p className="eyebrow text-muted">Zo ziet je recept eruit</p>
            <PreviewCard draft={draft} />
            <Link href="/plating" className="block rounded-[24px] border border-line p-5 text-[14px] leading-relaxed text-muted transition hover:bg-cream">
              <span className="font-semibold text-ink">Tip:</span> bekijk de plating-academie voor inspiratie om je bord op te maken.
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
