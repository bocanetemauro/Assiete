"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Pencil, Plus, Repeat, Trash } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { CookedEntry, RecipeDetail } from "@/lib/types";
import { useKitchen } from "@/lib/store/kitchen";
import { cn, formatDate, formatMinutes, isToday, relativeDay } from "@/lib/utils";
import { ClocheIllustration } from "@/components/illustrations/Cloche";
import { FavoriteButton } from "@/components/recipe/FavoriteButton";
import { CookAgainButton } from "@/components/recipe/RecipeActions";
import { RecipeVisual } from "@/components/recipe/RecipeVisual";
import { ButtonLink } from "@/components/ui/Button";
import { Chip, DifficultyMeter } from "@/components/ui/Meta";
import { EASE_CHEF } from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";

export type KitchenTab = "alles" | "favorieten" | "gemaakt" | "opnieuw" | "eigen";

const TABS: { id: KitchenTab; label: string }[] = [
  { id: "alles", label: "Alles" },
  { id: "favorieten", label: "Favorieten" },
  { id: "gemaakt", label: "Zelf gemaakt" },
  { id: "opnieuw", label: "Opnieuw maken" },
  { id: "eigen", label: "Mijn recepten" },
];

export function ConfirmDelete({ onConfirm, label }: { onConfirm: () => void; label: string }) {
  const [ask, setAsk] = useState(false);
  return (
    <AnimatePresence mode="wait" initial={false}>
      {ask ? (
        <motion.span key="ask" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
          <button type="button" onClick={onConfirm} className="h-10 rounded-full bg-bordeaux px-3.5 text-[12.5px] font-semibold text-white">
            Verwijder
          </button>
          <button type="button" onClick={() => setAsk(false)} className="h-10 rounded-full px-3 text-[12.5px] font-semibold text-muted hover:text-ink">
            Annuleer
          </button>
        </motion.span>
      ) : (
        <motion.button key="icon" type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAsk(true)} className="grid size-10 place-items-center rounded-full text-muted transition hover:bg-bordeaux/10 hover:text-bordeaux" aria-label={label}>
          <Trash className="size-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function CookedCard({ entry }: { entry: CookedEntry }) {
  const { deleteCooked } = useKitchen();
  const toast = useToast();
  const today = isToday(entry.cookedAt);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-cream shadow-card transition-shadow duration-500 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden" style={{ background: entry.recipe.tone }}>
        {entry.photoUrl ? (
          <img src={entry.photoUrl} alt={entry.title ?? entry.recipe.title} className="h-full w-full object-cover transition duration-[1200ms] ease-chef group-hover:scale-105" />
        ) : (
          <div className="h-full w-full p-[9%] transition duration-[1200ms] ease-chef group-hover:rotate-6">
            <RecipeVisual recipe={{ ...entry.recipe, coverUrl: null }} />
          </div>
        )}
        <span className={cn("eyebrow absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9.5px] backdrop-blur", today ? "bg-ink text-ivory" : "bg-cream/85 text-ink")}>{today ? "Vandaag gemaakt" : relativeDay(entry.cookedAt)}</span>
        {!entry.photoUrl && <span className="absolute bottom-3 right-4 text-[11px] font-medium text-ink/45">Nog geen foto</span>}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="eyebrow text-[10px] text-brass">Gemaakt op {formatDate(entry.cookedAt)}</p>
        <h3 className="mt-2 font-serif text-[1.75rem] leading-[1.05]">{entry.title ?? entry.recipe.title}</h3>
        <p className="mt-1.5 text-[13px] text-muted">
          Origineel recept:{" "}
          <Link href={`/recepten/${entry.recipe.slug}`} className="font-semibold text-ink hover:text-brass">
            {entry.recipe.title}
          </Link>
        </p>
        {entry.note && <p className="mt-3 font-serif text-[1.12rem] italic leading-snug text-ink-soft">“{entry.note}”</p>}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-medium text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 text-muted" strokeWidth={1.8} />
            {formatMinutes(entry.durationMinutes)}
          </span>
          <DifficultyMeter difficulty={entry.recipe.difficulty} />
        </div>
        <div className="mt-auto flex items-center gap-2 pt-5">
          <ButtonLink href={`/recepten/${entry.recipe.slug}?opnieuw=1`} size="sm">
            <Repeat className="size-3.5" /> Opnieuw maken
          </ButtonLink>
          <CookAgainButton recipeId={entry.recipe.id} compact className="size-10 h-10" />
          <span className="ml-auto">
            <ConfirmDelete
              label="Verwijder uit Mijn keuken"
              onConfirm={() => {
                deleteCooked(entry.id);
                toast({ title: "Verwijderd uit Mijn keuken" });
              }}
            />
          </span>
        </div>
      </div>
    </article>
  );
}

export function KitchenRecipeCard({ recipe, tags }: { recipe: RecipeDetail; tags: string[] }) {
  const { cookedFor, deleteRecipe, user } = useKitchen();
  const toast = useToast();
  const history = cookedFor(recipe.id);
  const own = recipe.source === "user" && recipe.author?.id === user?.id;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-ivory transition-all duration-500 hover:-translate-y-1 hover:bg-cream hover:shadow-card">
      <Link href={`/recepten/${recipe.slug}`} className="relative block aspect-[5/4] overflow-hidden" style={{ background: recipe.tone }} aria-label={recipe.title}>
        <div className={cn("absolute transition-transform duration-[1200ms] ease-chef", recipe.coverUrl ? "inset-0 group-hover:scale-105" : "inset-[8%] group-hover:rotate-[10deg]")}>
          <RecipeVisual recipe={recipe} />
        </div>
      </Link>
      <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="eyebrow rounded-full bg-cream/90 px-2.5 py-1.5 text-[9px] text-ink backdrop-blur">
            {t}
          </span>
        ))}
      </div>
      <FavoriteButton recipeId={recipe.id} className="absolute right-4 top-4" />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-serif text-[1.7rem] leading-[1.05]">
          <Link href={`/recepten/${recipe.slug}`} className="hover:text-brass">
            {recipe.title}
          </Link>
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-medium text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 text-muted" strokeWidth={1.8} />
            {formatMinutes(recipe.totalMinutes)}
          </span>
          <DifficultyMeter difficulty={recipe.difficulty} />
        </div>
        <p className="mt-3 text-[13px] text-muted">{history.length ? `${history.length}× gemaakt · laatst ${relativeDay(history[0].cookedAt).toLowerCase()}` : "Nog niet gemaakt"}</p>
        <div className="mt-auto flex items-center gap-2 pt-5">
          <ButtonLink href={`/recepten/${recipe.slug}?opnieuw=1`} size="sm" variant={history.length ? "primary" : "secondary"}>
            <Repeat className="size-3.5" /> {history.length ? "Opnieuw maken" : "Nu maken"}
          </ButtonLink>
          <CookAgainButton recipeId={recipe.id} compact className="size-10 h-10" />
          {own && (
            <span className="ml-auto flex items-center">
              <Link href={`/eigen-recept?bewerk=${recipe.id}`} className="grid size-10 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink" aria-label="Recept bewerken">
                <Pencil className="size-4" />
              </Link>
              <ConfirmDelete
                label="Recept verwijderen"
                onConfirm={() => {
                  deleteRecipe(recipe.id);
                  toast({ title: "Recept verwijderd" });
                }}
              />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function Empty({ title, body, action }: { title: string; body: string; action: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="col-span-full mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <div className="size-40">
        <ClocheIllustration label="+" />
      </div>
      <h3 className="mt-6 font-serif text-4xl leading-tight">{title}</h3>
      <p className="mt-3 text-muted">{body}</p>
      <div className="mt-7">{action}</div>
    </motion.div>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:grid-cols-4">{children}</div>;
}

function Item({ id, children }: { id: string; children: ReactNode }) {
  return (
    <motion.div key={id} layout initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.45, ease: EASE_CHEF }} className="h-full">
      {children}
    </motion.div>
  );
}

export function KitchenLibrary() {
  const { user, cooked, favorites, cookAgain, myRecipes, stats } = useKitchen();
  const params = useSearchParams();
  const initial = (TABS.find((t) => t.id === params.get("filter"))?.id ?? "alles") as KitchenTab;
  const [tab, setTab] = useState<KitchenTab>(initial);

  useEffect(() => {
    const url = `${window.location.pathname}${tab === "alles" ? "" : `?filter=${tab}`}`;
    window.history.replaceState(window.history.state, "", url);
  }, [tab]);

  const saved = useMemo(() => {
    const map = new Map<string, { recipe: RecipeDetail; tags: string[] }>();
    const add = (r: RecipeDetail, tag: string) => {
      const item = map.get(r.id) ?? { recipe: r, tags: [] };
      item.tags.push(tag);
      map.set(r.id, item);
    };
    myRecipes.forEach((r) => add(r, "Eigen recept"));
    favorites.forEach((r) => add(r, "Favoriet"));
    cookAgain.forEach((r) => add(r, "Opnieuw maken"));
    return [...map.values()];
  }, [myRecipes, favorites, cookAgain]);

  const counts: Record<KitchenTab, number> = {
    alles: cooked.length + saved.length,
    favorieten: favorites.length,
    gemaakt: cooked.length,
    opnieuw: cookAgain.length,
    eigen: myRecipes.length,
  };

  const tagsFor = (id: string) => saved.find((s) => s.recipe.id === id)?.tags ?? [];
  const firstName = user?.name.split(" ")[0] ?? "chef";

  return (
    <div className="pt-[72px]">
      <section className="paper-grain border-b border-line bg-paper">
        <div className="container-page pb-10 pt-14 lg:pb-14 lg:pt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE_CHEF }} className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow flex items-center gap-3 text-brass">
                <span className="h-px w-8 bg-brass/70" />
                Persoonlijke bibliotheek
              </p>
              <h1 className="mt-4 font-serif text-[clamp(3.2rem,8vw,6.5rem)] leading-[0.9]">
                Mijn <em className="text-brass">keuken</em>
              </h1>
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted">
                Welkom terug, {firstName}. Hier bewaar je alles wat je kookt, wat je wilt onthouden en wat je zelf schrijft.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/eigen-recept" size="lg">
                <Plus className="size-4" /> Eigen recept
              </ButtonLink>
              <ButtonLink href="/recepten" variant="secondary" size="lg">
                <BookOpen className="size-4" /> Ontdek recepten
              </ButtonLink>
            </div>
          </motion.div>
          <div className="mt-10 flex flex-wrap gap-2">
            <Chip className="h-9 bg-cream px-4 text-[13px]">{stats.cookedThisMonth} gerechten deze maand</Chip>
            <Chip className="h-9 bg-cream px-4 text-[13px]">{cooked.length} keer gekookt in totaal</Chip>
            <Chip className="h-9 bg-cream px-4 text-[13px]">{favorites.length} favorieten</Chip>
            <Chip className="h-9 bg-cream px-4 text-[13px]">{myRecipes.length} eigen recepten</Chip>
          </div>
        </div>
      </section>

      <div className="sticky top-[71px] z-30 border-b border-line/80 bg-ivory/85 backdrop-blur-xl">
        <div className="container-page">
          <div className="no-scrollbar -mx-2 flex gap-1 overflow-x-auto py-3" role="tablist" aria-label="Filter je keuken">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn("relative flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] font-semibold transition-colors", tab === t.id ? "text-ivory" : "text-ink-soft hover:text-ink")}
              >
                {tab === t.id && <motion.span layoutId="kitchen-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative">{t.label}</span>
                <span className={cn("relative text-[11.5px] tabular-nums", tab === t.id ? "text-ivory/60" : "text-muted")}>{counts[t.id]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="container-page py-12 lg:py-16">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {tab === "alles" && (
              <div className="space-y-16">
                <div>
                  <div className="mb-8 flex items-end justify-between gap-4">
                    <h2 className="font-serif text-[2.6rem] leading-none">Recent gekookt</h2>
                    {cooked.length > 4 && (
                      <button type="button" onClick={() => setTab("gemaakt")} className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-brass">
                        Alles bekijken <ArrowRight className="size-4" />
                      </button>
                    )}
                  </div>
                  <Grid>
                    {cooked.length ? (
                      cooked.slice(0, 4).map((entry) => (
                        <Item key={entry.id} id={entry.id}>
                          <CookedCard entry={entry} />
                        </Item>
                      ))
                    ) : (
                      <Empty title="Je keuken is nog leeg" body="Kook een recept en laat je bord zien: je gerecht verschijnt hier met foto, datum en notities." action={<ButtonLink href="/vandaag">Bekijk het menu van vandaag</ButtonLink>} />
                    )}
                  </Grid>
                </div>
                {saved.length > 0 && (
                  <div>
                    <h2 className="mb-8 font-serif text-[2.6rem] leading-none">Bewaarde recepten</h2>
                    <Grid>
                      {saved.map(({ recipe, tags }) => (
                        <Item key={recipe.id} id={recipe.id}>
                          <KitchenRecipeCard recipe={recipe} tags={tags} />
                        </Item>
                      ))}
                    </Grid>
                  </div>
                )}
              </div>
            )}

            {tab === "gemaakt" && (
              <Grid>
                <AnimatePresence>
                  {cooked.map((entry) => (
                    <Item key={entry.id} id={entry.id}>
                      <CookedCard entry={entry} />
                    </Item>
                  ))}
                </AnimatePresence>
                {!cooked.length && <Empty title="Nog niets gekookt" body="Zodra je een gerecht bewaart via ‘Laat je bord zien’, verschijnt het hier." action={<ButtonLink href="/recepten">Kies een recept</ButtonLink>} />}
              </Grid>
            )}

            {tab === "favorieten" && (
              <Grid>
                <AnimatePresence>
                  {favorites.map((r) => (
                    <Item key={r.id} id={r.id}>
                      <KitchenRecipeCard recipe={r} tags={tagsFor(r.id).filter((t) => t !== "Favoriet")} />
                    </Item>
                  ))}
                </AnimatePresence>
                {!favorites.length && <Empty title="Nog geen favorieten" body="Tik op het hartje bij een recept om het hier te bewaren." action={<ButtonLink href="/recepten">Ontdek recepten</ButtonLink>} />}
              </Grid>
            )}

            {tab === "opnieuw" && (
              <Grid>
                <AnimatePresence>
                  {cookAgain.map((r) => (
                    <Item key={r.id} id={r.id}>
                      <KitchenRecipeCard recipe={r} tags={tagsFor(r.id).filter((t) => t !== "Opnieuw maken")} />
                    </Item>
                  ))}
                </AnimatePresence>
                {!cookAgain.length && <Empty title="Je lijst is leeg" body="Markeer recepten met ‘Opnieuw maken’ en vind ze hier terug wanneer je inspiratie zoekt." action={<ButtonLink href="/recepten">Ontdek recepten</ButtonLink>} />}
              </Grid>
            )}

            {tab === "eigen" && (
              <Grid>
                <AnimatePresence>
                  {myRecipes.map((r) => (
                    <Item key={r.id} id={r.id}>
                      <KitchenRecipeCard recipe={r} tags={tagsFor(r.id).filter((t) => t !== "Eigen recept")} />
                    </Item>
                  ))}
                </AnimatePresence>
                {!myRecipes.length && <Empty title="Schrijf je eerste recept" body="Leg je signatuurgerecht vast met ingrediënten, stappen, foto's en plating." action={<ButtonLink href="/eigen-recept">Maak je eigen recept</ButtonLink>} />}
              </Grid>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
