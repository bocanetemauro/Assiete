"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { CookedEntry, RecipeDetail } from "@/lib/types";
import { useKitchen } from "@/lib/store/kitchen";
import { formatDate, relativeDay } from "@/lib/utils";
import { Polaroid } from "@/components/kitchen/Polaroid";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { EASE_CHEF } from "@/components/ui/Reveal";

const darkInput =
  "w-full rounded-2xl border border-ivory/15 bg-ivory/[0.05] px-4 py-3.5 text-[15px] text-ivory placeholder:text-ivory/35 transition focus:border-brass-soft/60 focus:bg-ivory/[0.08] focus:outline-none";

export function ShowYourPlate({ recipe }: { recipe: RecipeDetail }) {
  const { user, ready, logCooked, cookedFor, signInDemo } = useKitchen();
  const toast = useToast();
  const [photo, setPhoto] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [minutes, setMinutes] = useState(String(recipe.totalMinutes));
  const [saved, setSaved] = useState<CookedEntry | null>(null);
  const history = ready ? cookedFor(recipe.id) : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const entry = logCooked({
      recipeId: recipe.id,
      title: title.trim() || null,
      note,
      photoUrl: photo,
      durationMinutes: Math.max(1, Math.round(Number(minutes.replace(",", ".")) || recipe.totalMinutes)),
    });
    if (entry) {
      setSaved(entry);
      toast({ title: "Bewaard in Mijn keuken", description: `${recipe.title} · ${formatDate(entry.cookedAt)}`, tone: "success" });
    }
  };

  const reset = () => {
    setSaved(null);
    setPhoto(null);
    setTitle("");
    setNote("");
  };

  return (
    <section id="laat-je-bord-zien" className="scroll-mt-20 bg-charcoal py-24 text-ivory lg:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <p className="eyebrow flex items-center gap-3 text-brass-soft">
            <span className="h-px w-8 bg-brass-soft/60" />
            Eindresultaat
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.95]">
            Laat je <em className="text-brass-soft">bord</em> zien.
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ivory/60">
            Upload een foto van jouw versie. We bewaren hem in Mijn keuken, met de datum, je notities en een link naar dit recept.
          </p>

          {history.length > 0 && (
            <div className="mt-10">
              <p className="eyebrow text-[10px] text-ivory/45">Eerder gemaakt · {history.length}×</p>
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {history.slice(0, 5).map((h) => (
                  <Link key={h.id} href="/mijn-keuken" className="w-28 shrink-0 rounded-md bg-white p-1.5 pb-2 text-ink transition hover:-translate-y-1">
                    <div className="aspect-square overflow-hidden rounded-sm" style={{ background: recipe.tone }}>
                      {h.photoUrl ? <img src={h.photoUrl} alt="" className="h-full w-full object-cover" /> : null}
                    </div>
                    <p className="mt-1.5 truncate px-0.5 text-[11px] font-semibold">{relativeDay(h.cookedAt)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.div key="saved" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE_CHEF }} className="flex flex-col items-center">
                <motion.div initial={{ rotate: 8, scale: 0.9 }} animate={{ rotate: -2, scale: 1 }} transition={{ type: "spring", stiffness: 120, damping: 14 }} className="w-full max-w-md">
                  <Polaroid entry={saved} tilt={0} />
                </motion.div>
                <p className="mt-8 flex items-center gap-2 text-[15px] text-ivory/70">
                  <span className="grid size-6 place-items-center rounded-full bg-sage">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  Opgeslagen in je persoonlijke bibliotheek
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <ButtonLink href="/mijn-keuken" variant="light">
                    Bekijk in Mijn keuken <ArrowRight className="size-4" />
                  </ButtonLink>
                  <Button variant="outline-light" onClick={reset}>
                    <Plus className="size-4" /> Nog een keer
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="space-y-5 rounded-[32px] border border-ivory/10 bg-ivory/[0.03] p-5 sm:p-7">
                <ImageUpload value={photo} onChange={setPhoto} dark label="Upload je gerecht" hint="Een foto van bovenaf bij daglicht werkt het mooist." aspect="aspect-[4/3]" />
                <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
                  <label className="block">
                    <span className="mb-2 block text-[13px] font-semibold text-ivory/70">Naam van jouw gerecht</span>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={recipe.title} className={darkInput} maxLength={80} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[13px] font-semibold text-ivory/70">Tijd (min)</span>
                    <input value={minutes} onChange={(e) => setMinutes(e.target.value)} inputMode="numeric" className={darkInput} aria-label="Bereidingstijd in minuten" />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold text-ivory/70">Korte beschrijving (optioneel)</span>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Wat ging goed? Wat doe je volgende keer anders?" className={`${darkInput} resize-none`} maxLength={280} />
                </label>
                {ready && !user ? (
                  <div className="rounded-2xl bg-ivory/[0.06] p-5">
                    <p className="font-serif text-xl">Log in om je gerecht te bewaren</p>
                    <p className="mt-1 text-[14px] text-ivory/55">Je foto blijft staan terwijl je inlogt met het demo-account.</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="brass" onClick={signInDemo}>
                        Ga verder met demo-account
                      </Button>
                      <ButtonLink href={`/inloggen?volgende=${encodeURIComponent(`/recepten/${recipe.slug}#laat-je-bord-zien`)}`} variant="outline-light">
                        Inloggen
                      </ButtonLink>
                    </div>
                  </div>
                ) : (
                  <Button type="submit" variant="brass" size="lg" className="w-full" disabled={!ready}>
                    Bewaar in Mijn keuken
                  </Button>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
