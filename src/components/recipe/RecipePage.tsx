"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ChefHat, Pencil, Play, UtensilsCrossed, Wine, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { RecipeDetail } from "@/lib/types";
import { CATEGORY_LABEL, COURSE_LABEL } from "@/lib/constants";
import { PLATFORM_RECIPES } from "@/lib/data";
import { useKitchen } from "@/lib/store/kitchen";
import { cn, formatDate, formatMinutes } from "@/lib/utils";
import { TechniqueScene } from "@/components/illustrations/scenes";
import { ButtonLink } from "@/components/ui/Button";
import { DifficultyMeter } from "@/components/ui/Meta";
import { EASE_CHEF, Reveal } from "@/components/ui/Reveal";
import { CookingJourney } from "./CookingStep";
import { FavoriteButton } from "./FavoriteButton";
import { IngredientList } from "./IngredientList";
import { PlatingFilm } from "./PlatingFilm";
import { PlatingGuide } from "./PlatingGuide";
import { CookAgainButton, ShareButton } from "./RecipeActions";
import { RecipeCard } from "./RecipeCard";
import { RecipeVisual } from "./RecipeVisual";
import { ScrollProgress } from "./ScrollProgress";
import { ShowYourPlate } from "./ShowYourPlate";

const SECTIONS = [
  { id: "ingredienten", label: "Ingrediënten" },
  { id: "bereiding", label: "Bereiding" },
  { id: "plating", label: "Plating" },
  { id: "laat-je-bord-zien", label: "Laat je bord zien" },
];

function RecipeHero({ recipe }: { recipe: RecipeDetail }) {
  const ref = useRef<HTMLElement>(null);
  const { user } = useKitchen();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const [activePhoto, setActivePhoto] = useState(0);
  const photos = recipe.gallery;
  const own = recipe.source === "user" && user?.id === recipe.author?.id;
  const primaryCategory = recipe.categories[0];

  return (
    <section ref={ref} className="relative overflow-hidden pt-[72px]" style={{ background: `linear-gradient(180deg, ${recipe.tone} 0%, #faf7f2 92%)` }}>
      <div className="paper-grain absolute inset-0" />
      <div className="container-page relative grid gap-10 pb-14 pt-8 lg:grid-cols-[1fr_1.02fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE_CHEF }}>
          <nav className="flex items-center gap-2 text-[13px] text-muted" aria-label="Kruimelpad">
            <Link href="/recepten" className="inline-flex items-center gap-1.5 font-semibold text-ink hover:text-brass">
              <ArrowLeft className="size-3.5" /> Recepten
            </Link>
            {primaryCategory && (
              <>
                <span>/</span>
                <Link href={`/recepten?categorie=${primaryCategory}`} className="hover:text-ink">
                  {CATEGORY_LABEL[primaryCategory]}
                </Link>
              </>
            )}
          </nav>
          <p className="eyebrow mt-8 text-brass">
            {COURSE_LABEL[recipe.course]}
            {recipe.source === "user" && recipe.author ? ` · Eigen recept van ${recipe.author.name}` : ""}
          </p>
          <h1 className="mt-3 font-serif text-[clamp(2.9rem,6.4vw,5.8rem)] font-medium leading-[0.93] tracking-[-0.015em]">{recipe.title}</h1>
          {recipe.subtitle && <p className="mt-4 font-serif text-[1.6rem] italic text-muted">{recipe.subtitle}</p>}
          <p className="mt-6 max-w-xl text-[17.5px] leading-relaxed text-ink-soft">{recipe.description}</p>

          <dl className="mt-9 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-y border-ink/10 py-6 sm:grid-cols-4">
            <div>
              <dt className="eyebrow text-[9.5px] text-muted">Voorbereiding</dt>
              <dd className="mt-1.5 font-serif text-[1.7rem] leading-none">{formatMinutes(recipe.prepMinutes)}</dd>
            </div>
            <div>
              <dt className="eyebrow text-[9.5px] text-muted">Bereiding</dt>
              <dd className="mt-1.5 font-serif text-[1.7rem] leading-none">{formatMinutes(recipe.cookMinutes)}</dd>
            </div>
            <div>
              <dt className="eyebrow text-[9.5px] text-muted">Moeilijkheid</dt>
              <dd className="mt-2 text-[15px] font-semibold">
                <DifficultyMeter difficulty={recipe.difficulty} />
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-[9.5px] text-muted">Personen</dt>
              <dd className="mt-1.5 font-serif text-[1.7rem] leading-none">{recipe.servings}</dd>
            </div>
          </dl>
          {recipe.restMinutes > 0 && <p className="mt-3 text-[13px] text-muted">+ {formatMinutes(recipe.restMinutes)} rust- of koeltijd</p>}

          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <ButtonLink href={`/kookmodus/${recipe.slug}`} size="lg">
              <ChefHat className="size-[18px]" /> Start kookmodus
            </ButtonLink>
            <FavoriteButton recipeId={recipe.id} withLabel className="h-14 border border-ink/15 bg-cream/70 shadow-none" />
            <CookAgainButton recipeId={recipe.id} className="h-14" />
            <ShareButton title={recipe.title} className="size-14" />
            {own && (
              <Link href={`/eigen-recept?bewerk=${recipe.id}`} className="inline-flex h-14 items-center gap-2 rounded-full px-4 text-sm font-semibold hover:bg-ink/5">
                <Pencil className="size-4" /> Bewerken
              </Link>
            )}
          </div>
        </motion.div>

        <div className="relative mx-auto w-full max-w-[640px]">
          {recipe.coverUrl ? (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: EASE_CHEF }}>
              <div className="aspect-[4/5] overflow-hidden rounded-[36px] shadow-lift">
                <img src={photos[activePhoto] ?? recipe.coverUrl} alt={recipe.title} className="h-full w-full object-cover" />
              </div>
              {photos.length > 1 && (
                <div className="mt-4 flex gap-2">
                  {photos.map((p, i) => (
                    <button key={i} type="button" onClick={() => setActivePhoto(i)} className={cn("size-16 overflow-hidden rounded-xl border-2 transition", i === activePhoto ? "border-ink" : "border-transparent opacity-60 hover:opacity-100")} aria-label={`Foto ${i + 1}`}>
                      <img src={p} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div style={{ rotate, y }} className="aspect-square">
              <motion.div className="h-full w-full" initial={{ opacity: 0, rotate: -30, scale: 0.9 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ duration: 1.4, ease: EASE_CHEF }}>
                <RecipeVisual recipe={recipe} mode="assemble" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function SectionNav({ recipe }: { recipe: RecipeDetail }) {
  const [active, setActive] = useState(SECTIONS[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-[71px] z-30 border-y border-line/80 bg-ivory/85 backdrop-blur-xl">
      <div className="container-page flex h-[60px] items-center justify-between gap-6">
        <nav className="no-scrollbar -mx-2 flex gap-1 overflow-x-auto" aria-label="Secties van het recept">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={cn("relative shrink-0 rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-colors", active === s.id ? "text-ink" : "text-muted hover:text-ink")}>
              {active === s.id && <motion.span layoutId="recipe-section" className="absolute inset-0 rounded-full bg-ink/[0.06]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="relative">{s.label}</span>
            </a>
          ))}
        </nav>
        <Link href={`/kookmodus/${recipe.slug}`} className="hidden h-10 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-[13px] font-semibold text-ivory transition hover:bg-ink-soft md:inline-flex">
          <Play className="size-3.5" /> Kookmodus
        </Link>
      </div>
    </div>
  );
}

function CookAgainBanner({ recipe }: { recipe: RecipeDetail }) {
  const params = useSearchParams();
  const { cookedFor, ready } = useKitchen();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (params.get("opnieuw") === "1") {
      setOpen(true);
      window.setTimeout(() => document.getElementById("bereiding")?.scrollIntoView({ behavior: "smooth" }), 900);
    }
  }, [params]);
  const last = ready ? cookedFor(recipe.id)[0] : undefined;

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }} transition={{ duration: 0.6, ease: EASE_CHEF }} className="fixed inset-x-3 top-[84px] z-40 mx-auto max-w-2xl">
          <div className="flex flex-col gap-3 rounded-3xl bg-ink p-4 pl-5 text-ivory shadow-float sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="font-serif text-xl leading-tight">Welkom terug in de keuken</p>
              <p className="text-[13.5px] text-ivory/60">{last ? `Je maakte dit gerecht op ${formatDate(last.cookedAt)}. Klaar voor ronde twee?` : "Tijd om dit gerecht opnieuw te maken."}</p>
            </div>
            <div className="flex items-center gap-2">
              <ButtonLink href={`/kookmodus/${recipe.slug}`} variant="brass" size="sm">
                Start kookmodus
              </ButtonLink>
              <button type="button" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full hover:bg-ivory/10" aria-label="Sluiten">
                <X className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FloatingCookButton({ slug }: { slug: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-[92px] right-4 z-40 lg:hidden">
          <Link href={`/kookmodus/${slug}`} className="flex h-14 items-center gap-2 rounded-full bg-brass px-5 text-sm font-semibold text-white shadow-float">
            <ChefHat className="size-5" /> Kookmodus
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function RecipePage({ recipe }: { recipe: RecipeDetail }) {
  const { recipes } = useKitchen();
  const related = useMemo(() => {
    const pool = recipes.length ? recipes : PLATFORM_RECIPES;
    const same = pool.filter((r) => r.id !== recipe.id && r.categories.some((c) => recipe.categories.includes(c)));
    const rest = pool.filter((r) => r.id !== recipe.id && !same.includes(r) && r.source === "platform");
    return [...same, ...rest].slice(0, 3);
  }, [recipes, recipe]);
  const prepScene = recipe.steps.find((s) => s.scene?.key === "prep")?.scene ?? recipe.steps.find((s) => s.scene && s.scene.key !== "plate")?.scene ?? null;

  return (
    <article>
      <ScrollProgress />
      <Suspense fallback={null}>
        <CookAgainBanner recipe={recipe} />
      </Suspense>
      <RecipeHero recipe={recipe} />
      <SectionNav recipe={recipe} />

      <section id="ingredienten" className="scroll-mt-32 py-20 lg:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow text-brass">Mise en place</p>
              <h2 className="mt-3 font-serif text-[clamp(2.4rem,4.6vw,3.8rem)] leading-none">Ingrediënten</h2>
            </Reveal>
            <IngredientList recipe={recipe} className="mt-10" />

            {recipe.equipment.length > 0 && (
              <Reveal delay={0.1}>
                <div className="mt-12 rounded-[26px] border border-line bg-cream p-6">
                  <p className="eyebrow flex items-center gap-2 text-[10px] text-muted">
                    <UtensilsCrossed className="size-4 text-brass" strokeWidth={1.8} />
                    Wat je nodig hebt
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {recipe.equipment.map((item) => (
                      <li key={item} className="rounded-full bg-paper px-4 py-2 text-[14px] text-ink-soft">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {recipe.tags.length > 0 && (
              <Reveal delay={0.15}>
                <div className="mt-6">
                  <p className="eyebrow text-[10px] text-muted">Technieken in dit recept</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {recipe.tags.map((tag) => (
                      <li key={tag}>
                        <Link
                          href={`/recepten?q=${encodeURIComponent(tag)}`}
                          className="inline-flex h-9 items-center rounded-full border border-line px-4 text-[13.5px] text-ink-soft transition hover:border-brass hover:text-ink"
                        >
                          {tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>
          <aside className="space-y-6 lg:sticky lg:top-[152px] lg:self-start">
            {prepScene && (
              <Reveal>
                <div className="paper-grain aspect-[4/3] overflow-hidden rounded-[32px] p-[3%]" style={{ background: recipe.tone }}>
                  <TechniqueScene spec={prepScene} className="h-full w-full" />
                </div>
              </Reveal>
            )}
            {recipe.story && (
              <Reveal delay={0.05}>
                <p className="font-serif text-[1.75rem] leading-snug text-ink-soft">“{recipe.story}”</p>
              </Reveal>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {recipe.chefTip && (
                <Reveal delay={0.1}>
                  <div className="h-full rounded-[26px] bg-ink p-6 text-ivory">
                    <ChefHat className="size-6 text-brass-soft" strokeWidth={1.6} />
                    <p className="eyebrow mt-4 text-[10px] text-ivory/50">Geheim van de chef</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-ivory/85">{recipe.chefTip}</p>
                  </div>
                </Reveal>
              )}
              {recipe.pairing && (
                <Reveal delay={0.15}>
                  <div className="h-full rounded-[26px] border border-line bg-cream p-6">
                    <Wine className="size-6 text-bordeaux" strokeWidth={1.6} />
                    <p className="eyebrow mt-4 text-[10px] text-muted">Wijnsuggestie</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{recipe.pairing}</p>
                  </div>
                </Reveal>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section id="bereiding" className="scroll-mt-32 border-t border-line bg-paper/60 py-20 lg:py-28">
        <div className="container-page">
          <Reveal className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-brass">Stap voor stap</p>
              <h2 className="mt-3 font-serif text-[clamp(2.4rem,4.6vw,3.8rem)] leading-none">Bereiding</h2>
            </div>
            <p className="max-w-sm text-[15.5px] leading-relaxed text-muted">Scroll door de stappen: de illustratie volgt je mee, van ingrediënt tot bord. Timers starten met één tik.</p>
          </Reveal>
          <CookingJourney recipe={recipe} />
        </div>
      </section>

      {recipe.dish && recipe.platingSteps.length > 0 && <PlatingFilm recipe={recipe} dish={recipe.dish} />}

      <section id="plating" className="scroll-mt-32 py-20 lg:py-28">
        <div className="container-page">
          <Reveal className="mb-12 max-w-3xl">
            <p className="eyebrow text-brass">Plating</p>
            <h2 className="mt-3 font-serif text-[clamp(2.4rem,4.6vw,3.8rem)] leading-none">Zo presenteer je dit gerecht</h2>
            {recipe.platingIntro && <p className="mt-5 text-[17px] leading-relaxed text-muted">{recipe.platingIntro}</p>}
          </Reveal>
          <PlatingGuide recipe={recipe} />
        </div>
      </section>

      <ShowYourPlate recipe={recipe} />

      {related.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container-page">
            <Reveal className="mb-10 flex items-end justify-between gap-6">
              <h2 className="font-serif text-[clamp(2.2rem,4vw,3.4rem)] leading-none">Kook ook eens</h2>
              <Link href="/recepten" className="text-sm font-semibold underline-offset-4 hover:underline">
                Alle recepten
              </Link>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {related.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.07} className="h-full">
                  <RecipeCard recipe={r} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
      <FloatingCookButton slug={recipe.slug} />
    </article>
  );
}
