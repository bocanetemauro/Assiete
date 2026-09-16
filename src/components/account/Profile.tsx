"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Camera, Check, Flame, LogOut, Plus, Repeat } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { KitchenStats } from "@/lib/types";
import { CATEGORY_LABEL, DIFFICULTY_LABEL } from "@/lib/constants";
import { useKitchen } from "@/lib/store/kitchen";
import { fileToDataUrl } from "@/lib/services/images";
import { cn, formatMinutes, plural } from "@/lib/utils";
import { CookedCard, KitchenRecipeCard } from "@/components/kitchen/KitchenLibrary";
import { Polaroid } from "@/components/kitchen/Polaroid";
import { RecipeVisual } from "@/components/recipe/RecipeVisual";
import { ClocheIllustration } from "@/components/illustrations/Cloche";
import { Avatar } from "@/components/ui/Avatar";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Field";
import { EASE_CHEF, Reveal } from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";

type Tab = "overzicht" | "recepten" | "gemaakt" | "favorieten" | "fotos" | "instellingen";

const TABS: { id: Tab; label: string }[] = [
  { id: "overzicht", label: "Overzicht" },
  { id: "recepten", label: "Mijn recepten" },
  { id: "gemaakt", label: "Mijn gemaakte recepten" },
  { id: "favorieten", label: "Favorieten" },
  { id: "fotos", label: "Foto's" },
  { id: "instellingen", label: "Instellingen" },
];

function Num({ children }: { children: ReactNode }) {
  return <strong className="font-serif text-[1.35em] font-medium italic text-brass">{children}</strong>;
}

function StatTile({ eyebrow, children, delay = 0 }: { eyebrow: string; children: ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="flex h-full flex-col justify-between gap-6 rounded-[28px] border border-line bg-cream p-6">
        <p className="eyebrow text-[10px] text-muted">{eyebrow}</p>
        <p className="font-serif text-[1.7rem] leading-[1.15] text-ink">{children}</p>
      </div>
    </Reveal>
  );
}

/** Eén reeks (gekookte gerechten per maand): staafdiagram met tooltip per staaf en een tabel voor schermlezers. */
function MonthlyChart({ data }: { data: KitchenStats["monthly"] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.count));
  const ticks = [max, Math.round(max / 2), 0].filter((v, i, arr) => arr.indexOf(v) === i);

  return (
    <figure className="flex h-full flex-col rounded-[28px] border border-line bg-cream p-6 sm:p-8">
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="font-serif text-[1.8rem] leading-none">Gekookte gerechten per maand</span>
        <span className="text-[13px] text-muted">Laatste 6 maanden</span>
      </figcaption>
      <div className="relative mt-8 flex flex-1 gap-3">
        <div className="relative w-6 shrink-0 text-right text-[11px] tabular-nums text-muted" aria-hidden>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${100 - (t / max) * 100}%` }}>
              {t}
            </span>
          ))}
        </div>
        <div className="relative min-h-44 flex-1">
          {ticks.map((t) => (
            <span key={t} aria-hidden className={cn("absolute inset-x-0 h-px", t === 0 ? "bg-ink/20" : "bg-line/70")} style={{ top: `${100 - (t / max) * 100}%` }} />
          ))}
          <div className="absolute inset-0 flex items-end gap-2 sm:gap-4">
            {data.map((d, i) => {
              const current = i === data.length - 1;
              const height = (d.count / max) * 100;
              return (
                <div
                  key={d.key}
                  tabIndex={0}
                  role="img"
                  aria-label={`${d.label}: ${plural(d.count, "gerecht", "gerechten")}`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="relative flex h-full flex-1 cursor-default flex-col items-center justify-end rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/50"
                >
                  <AnimatePresence>
                    {hover === i && (
                      <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-[12px] font-semibold text-ivory shadow-float"
                        style={{ bottom: `calc(${height}% + 10px)` }}
                      >
                        {plural(d.count, "gerecht", "gerechten")} in {d.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {current && d.count > 0 && hover !== i && (
                    <span className="absolute text-[12px] font-semibold tabular-nums text-ink" style={{ bottom: `calc(${height}% + 6px)` }}>
                      {d.count}
                    </span>
                  )}
                  <motion.span
                    className={cn("block w-full max-w-9 rounded-t-[4px]", d.count === 0 ? "bg-line" : current ? "bg-ink" : "bg-brass", hover === i && "opacity-85")}
                    initial={{ height: 0 }}
                    animate={{ height: d.count === 0 ? 2 : `${height}%` }}
                    transition={{ duration: 0.9, delay: i * 0.06, ease: EASE_CHEF }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-3 pl-9" aria-hidden>
        <div className="flex flex-1 gap-2 sm:gap-4">
          {data.map((d, i) => (
            <span key={d.key} className={cn("flex-1 text-center text-[12px] capitalize", i === data.length - 1 ? "font-semibold text-ink" : "text-muted")}>
              {d.label}
            </span>
          ))}
        </div>
      </div>
      <table className="sr-only">
        <caption>Gekookte gerechten per maand</caption>
        <thead>
          <tr>
            <th scope="col">Maand</th>
            <th scope="col">Aantal</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.key}>
              <td>{d.label}</td>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function EmptyTab({ title, body, action }: { title: string; body: string; action: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-14 text-center">
      <div className="size-36">
        <ClocheIllustration label="+" />
      </div>
      <h3 className="mt-6 font-serif text-4xl leading-tight">{title}</h3>
      <p className="mt-3 text-muted">{body}</p>
      <div className="mt-7">{action}</div>
    </div>
  );
}

function SettingsForm() {
  const { user, updateProfile } = useKitchen();
  const toast = useToast();
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  if (!user) return null;
  return (
    <form
      className="max-w-2xl space-y-6 rounded-[32px] border border-line bg-cream p-6 sm:p-10"
      onSubmit={async (e) => {
        e.preventDefault();
        const result = await updateProfile({ name, bio: bio.trim() || null });
        toast(result.ok ? { title: "Profiel bijgewerkt", tone: "success" } : { title: "Opslaan mislukt", description: result.error });
      }}
    >
      <div>
        <Label htmlFor="profile-name">Naam</Label>
        <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="name" />
      </div>
      <div>
        <Label htmlFor="profile-email" hint="kan niet gewijzigd worden">
          E-mailadres
        </Label>
        <Input id="profile-email" value={user.email} readOnly disabled />
      </div>
      <div>
        <Label htmlFor="profile-bio" hint={`${bio.length}/200`}>
          Over jou
        </Label>
        <Textarea id="profile-bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={200} rows={3} placeholder="Wat kook je het liefst? Waar wil je beter in worden?" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg">
          Opslaan
        </Button>
        {user.avatarUrl && (
          <Button variant="ghost" onClick={() => void updateProfile({ avatarUrl: null })}>
            Profielfoto verwijderen
          </Button>
        )}
      </div>
      <p className="border-t border-line pt-5 text-[13px] leading-relaxed text-muted">Je profiel, recepten en foto&apos;s staan veilig in je eigen account. Alleen jij kunt ze aanpassen.</p>
    </form>
  );
}

export function Profile() {
  const { user, stats, cooked, favorites, cookAgain, myRecipes, signOut, updateProfile } = useKitchen();
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const avatarInput = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<Tab>(() => (TABS.find((t) => t.id === params.get("tab"))?.id ?? "overzicht") as Tab);

  useEffect(() => {
    const url = `${window.location.pathname}${tab === "overzicht" ? "" : `?tab=${tab}`}`;
    window.history.replaceState(window.history.state, "", url);
  }, [tab]);

  if (!user) return null;

  const memberSince = new Intl.DateTimeFormat("nl-NL", { month: "long", year: "numeric" }).format(new Date(user.createdAt));
  const photos = [
    ...cooked.filter((c) => c.photoUrl).map((c) => ({ key: c.id, url: c.photoUrl as string, title: c.title ?? c.recipe.title, href: `/recepten/${c.recipe.slug}` })),
    ...myRecipes.flatMap((r) => r.gallery.map((url, i) => ({ key: `${r.id}-${i}`, url, title: r.title, href: `/recepten/${r.slug}` }))),
  ];

  return (
    <div className="pt-[72px]">
      {params.get("welkom") === "1" && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE_CHEF }} className="border-b border-sage/30 bg-sage/12">
          <div className="container-page flex items-center gap-3 py-3.5 text-[14.5px]">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sage text-white">
              <Check className="size-4" strokeWidth={3} />
            </span>
            <p>
              <strong className="font-semibold">Je e-mailadres is bevestigd.</strong> Je account is nu actief — favorieten, foto&apos;s en eigen recepten worden vanaf nu bewaard.
            </p>
          </div>
        </motion.div>
      )}
      <section className="paper-grain border-b border-line bg-paper">
        <div className="container-page flex flex-col gap-8 pb-10 pt-12 md:flex-row md:items-center md:justify-between lg:pb-14 lg:pt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE_CHEF }} className="flex items-center gap-5 sm:gap-8">
            <div className="relative">
              <Avatar user={user} size="xl" className="size-24 text-3xl ring-4 ring-cream sm:size-28 sm:text-4xl" />
              <button type="button" onClick={() => avatarInput.current?.click()} className="absolute -bottom-1 -right-1 grid size-10 place-items-center rounded-full bg-ink text-ivory shadow-float transition hover:bg-ink-soft" aria-label="Profielfoto wijzigen">
                <Camera className="size-4" />
              </button>
              <input
                ref={avatarInput}
                type="file"
                accept="image/*"
                className="sr-only"
                tabIndex={-1}
                aria-hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const result = await updateProfile({ avatarUrl: await fileToDataUrl(file, 480, 0.85) });
                    toast(result.ok ? { title: "Profielfoto bijgewerkt", tone: "success" } : { title: "Uploaden mislukt", description: result.error });
                  } catch (err) {
                    toast({ title: "Uploaden mislukt", description: err instanceof Error ? err.message : undefined });
                  }
                  e.target.value = "";
                }}
              />
            </div>
            <div className="min-w-0">
              <p className="eyebrow text-brass">Lid sinds {memberSince}</p>
              <h1 className="mt-2 font-serif text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.95]">{user.name}</h1>
              {user.bio && <p className="mt-3 max-w-lg font-serif text-[1.25rem] italic leading-snug text-muted">{user.bio}</p>}
            </div>
          </motion.div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/eigen-recept">
              <Plus className="size-4" /> Nieuw recept
            </ButtonLink>
            <Button variant="secondary" onClick={() => setTab("instellingen")}>
              Profiel bewerken
            </Button>
            <Button
              variant="ghost"
              onClick={async () => {
                await signOut();
                toast({ title: "Je bent uitgelogd" });
                router.push("/");
              }}
            >
              <LogOut className="size-4" /> Uitloggen
            </Button>
          </div>
        </div>
      </section>

      <section className="container-page py-10 lg:py-14">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile eyebrow="Deze maand">
            Je hebt deze maand <Num>{stats.cookedThisMonth}</Num> {stats.cookedThisMonth === 1 ? "gerecht" : "gerechten"} gemaakt.
          </StatTile>
          <StatTile eyebrow="Smaakprofiel" delay={0.05}>
            {stats.favoriteCategory ? (
              <>
                Je favoriete categorie: <Num>{CATEGORY_LABEL[stats.favoriteCategory]}</Num>.
              </>
            ) : (
              <>Kook of bewaar recepten om je favoriete categorie te ontdekken.</>
            )}
          </StatTile>
          <StatTile eyebrow="Bewaard" delay={0.1}>
            Je hebt <Num>{stats.savedCount}</Num> {stats.savedCount === 1 ? "recept" : "recepten"} opgeslagen.
          </StatTile>
          <StatTile eyebrow="Tijd in de keuken" delay={0.15}>
            Deze maand stond je <Num>{formatMinutes(stats.minutesThisMonth)}</Num> aan het fornuis.
          </StatTile>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <Reveal className="h-full">
            <MonthlyChart data={stats.monthly} />
          </Reveal>
          <Reveal delay={0.08} className="h-full">
            <div className="flex h-full flex-col justify-between gap-8 rounded-[28px] bg-ink p-7 text-ivory sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-brass">
                  <Flame className="size-5" />
                </span>
                <p className="eyebrow text-ivory/55">Kookreeks</p>
              </div>
              <p className="font-serif text-[2.2rem] leading-[1.05]">
                {stats.streakDays > 0 ? (
                  <>
                    {plural(stats.streakDays, "dag", "dagen")} op rij <em className="text-brass-soft">gekookt</em>.
                  </>
                ) : (
                  <>Kook vandaag iets en start een nieuwe reeks.</>
                )}
              </p>
              <div className="grid grid-cols-3 gap-4 border-t border-ivory/10 pt-5 text-[13px] text-ivory/60">
                <div>
                  <p className="font-serif text-3xl text-ivory">{cooked.length}</p>
                  keer gekookt
                </div>
                <div>
                  <p className="font-serif text-3xl text-ivory">{stats.ownRecipeCount}</p>
                  eigen recepten
                </div>
                <div>
                  <p className="font-serif text-3xl text-ivory">{stats.cookAgainCount}</p>
                  opnieuw maken
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="sticky top-[71px] z-30 border-y border-line/80 bg-ivory/85 backdrop-blur-xl">
        <div className="container-page">
          <div className="no-scrollbar -mx-2 flex gap-1 overflow-x-auto py-3" role="tablist" aria-label="Profielonderdelen">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn("relative h-11 shrink-0 rounded-full px-4 text-[14px] font-semibold transition-colors", tab === t.id ? "text-ivory" : "text-ink-soft hover:text-ink")}
              >
                {tab === t.id && <motion.span layoutId="profile-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="container-page py-12 lg:py-16">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {tab === "overzicht" && (
              <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <div className="mb-8 flex items-end justify-between">
                    <h2 className="font-serif text-[2.4rem] leading-none">Laatst gekookt</h2>
                    <button type="button" onClick={() => setTab("gemaakt")} className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-brass">
                      Alles <ArrowRight className="size-4" />
                    </button>
                  </div>
                  {cooked.length ? (
                    <div className="grid grid-cols-2 gap-6 pt-2 sm:grid-cols-3">
                      {cooked.slice(0, 3).map((entry, i) => (
                        <Link key={entry.id} href={`/recepten/${entry.recipe.slug}`} className={cn("transition-transform duration-500 hover:-translate-y-1", i === 2 && "hidden sm:block")}>
                          <Polaroid entry={entry} tilt={[-3, 2, -1][i]} details={false} />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <EmptyTab title="Nog niets gekookt" body="Kook een recept en bewaar je bord — hier verschijnt je culinaire dagboek." action={<ButtonLink href="/vandaag">Menu van vandaag</ButtonLink>} />
                  )}
                </div>
                <div>
                  <h2 className="mb-6 font-serif text-[2.4rem] leading-none">Opnieuw maken</h2>
                  {cookAgain.length ? (
                    <ul className="space-y-1">
                      {cookAgain.map((r) => (
                        <li key={r.id}>
                          <Link href={`/recepten/${r.slug}?opnieuw=1`} className="group flex items-center gap-4 rounded-2xl p-2 transition hover:bg-cream">
                            <span className="size-16 shrink-0 overflow-hidden rounded-xl p-1" style={{ background: r.tone }}>
                              <RecipeVisual recipe={r} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-serif text-[1.35rem] leading-tight">{r.title}</span>
                              <span className="text-[13px] text-muted">
                                {formatMinutes(r.totalMinutes)} · {DIFFICULTY_LABEL[r.difficulty]}
                              </span>
                            </span>
                            <Repeat className="size-4 text-muted transition group-hover:rotate-180 group-hover:text-brass" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="rounded-2xl border border-dashed border-line p-6 text-[15px] text-muted">Markeer recepten met ‘Opnieuw maken’ om ze hier te verzamelen.</p>
                  )}
                </div>
              </div>
            )}

            {tab === "recepten" && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {myRecipes.map((r) => (
                  <KitchenRecipeCard key={r.id} recipe={r} tags={["Eigen recept"]} />
                ))}
                <Link href="/eigen-recept" className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-[28px] border-2 border-dashed border-line p-8 text-center transition hover:border-brass hover:bg-cream">
                  <span className="grid size-14 place-items-center rounded-full bg-ink text-ivory">
                    <Plus className="size-6" />
                  </span>
                  <span className="font-serif text-3xl">Nieuw recept</span>
                  <span className="text-[14px] text-muted">Schrijf je volgende signatuurgerecht</span>
                </Link>
              </div>
            )}

            {tab === "gemaakt" &&
              (cooked.length ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:grid-cols-4">
                  {cooked.map((entry) => (
                    <CookedCard key={entry.id} entry={entry} />
                  ))}
                </div>
              ) : (
                <EmptyTab title="Nog geen gemaakte recepten" body="Recepten van het platform die je kookt en bewaart, verschijnen hier." action={<ButtonLink href="/recepten">Kies een recept</ButtonLink>} />
              ))}

            {tab === "favorieten" &&
              (favorites.length ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:grid-cols-4">
                  {favorites.map((r) => (
                    <KitchenRecipeCard key={r.id} recipe={r} tags={[]} />
                  ))}
                </div>
              ) : (
                <EmptyTab title="Nog geen favorieten" body="Tik op het hartje bij een recept om het te bewaren." action={<ButtonLink href="/recepten">Ontdek recepten</ButtonLink>} />
              ))}

            {tab === "fotos" &&
              (photos.length ? (
                <div className="columns-2 gap-4 md:columns-3 xl:columns-4 [&>*]:mb-4">
                  {photos.map((p) => (
                    <Link key={p.key} href={p.href} className="group relative block break-inside-avoid overflow-hidden rounded-2xl">
                      <img src={p.url} alt={p.title} className="w-full transition duration-700 group-hover:scale-105" />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-3 pt-10 font-serif text-lg text-ivory">{p.title}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyTab title="Nog geen foto's" body="Upload een foto via ‘Laat je bord zien’ onderaan een recept, of voeg foto's toe aan je eigen recepten." action={<ButtonLink href="/vandaag">Kies iets om te koken</ButtonLink>} />
              ))}

            {tab === "instellingen" && <SettingsForm />}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
