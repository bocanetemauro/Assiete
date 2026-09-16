"use client";

import { ArrowRight, Pause } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getDailyRecipes } from "@/lib/data";
import { TechniqueScene } from "@/components/illustrations/scenes";
import { DishIllustration } from "@/components/illustrations/dishes";
import { PlatingPrinciples, PlatingStepper } from "@/components/recipe/PlatingGuide";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PlatingShowcase() {
  return (
    <section className="py-24 lg:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="Plating"
          title={
            <>
              De kunst van <em className="text-brass">het bord</em>
            </>
          }
          description="Een bord opmaken is componeren. In zes stappen van een leeg bord naar een gerecht dat je gasten eerst met hun ogen proeven."
        >
          <ButtonLink href="/plating" variant="secondary" className="shrink-0 self-start md:self-end">
            Plating-academie <ArrowRight className="size-4" />
          </ButtonLink>
        </SectionHeading>
        <div className="mt-14">
          <PlatingStepper dish="duck" tone="#E4DDD6" />
        </div>
        <div className="mt-20">
          <PlatingPrinciples />
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const featured = getDailyRecipes()[0];
  return (
    <section className="bg-paper py-24 lg:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="Jouw keuken"
          title={
            <>
              Meer dan recepten. <br className="hidden md:block" />
              <em className="text-brass">Een persoonlijke leeromgeving.</em>
            </>
          }
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Link href={`/kookmodus/${featured.slug}`} className="group relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-[32px] bg-charcoal p-8 text-ivory md:p-10">
              <div className="relative z-10 max-w-sm">
                <p className="eyebrow text-brass-soft">Kookmodus</p>
                <h3 className="mt-3 font-serif text-[2.6rem] leading-[1]">Eén stap tegelijk, groot op je scherm.</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ivory/65">Met timers per stap, grote knoppen voor natte handen en een scherm dat niet op zwart gaat.</p>
              </div>
              <div className="relative z-10 mt-auto flex items-center gap-2 pt-8 text-sm font-semibold text-brass-soft">
                Probeer het met {featured.title.toLowerCase()} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="absolute -bottom-10 -right-6 w-[min(420px,70%)] rotate-[-6deg] rounded-[34px] border border-ivory/10 bg-ink p-4 shadow-2xl transition-transform duration-700 ease-chef group-hover:rotate-[-2deg] group-hover:-translate-y-3 max-md:hidden">
                <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory/50">
                  <span>Stap 6 / 11</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-brass px-2.5 py-1 text-[11px] tracking-normal text-white">
                    <Pause className="size-3" /> 01:42
                  </span>
                </div>
                <div className="mt-3 aspect-[4/3] rounded-2xl bg-[#2A2320]">
                  <TechniqueScene spec={{ key: "sear", item: "steak" }} className="h-full w-full" />
                </div>
                <p className="px-2 pb-2 pt-4 font-serif text-2xl leading-tight">Bak de steak 2 minuten aan één kant.</p>
              </div>
            </Link>
          </Reveal>
          <div className="grid gap-6 lg:col-span-5">
            <Reveal delay={0.08}>
              <Link href="/mijn-keuken" className="group flex h-full flex-col overflow-hidden rounded-[32px] bg-cream p-8 shadow-card">
                <div className="flex justify-center gap-[-1rem] py-2">
                  {(["pasta", "risotto", "burrata"] as const).map((dish, i) => (
                    <div
                      key={dish}
                      className="w-[34%] rounded-lg bg-white p-2 pb-6 shadow-card transition-transform duration-700 ease-chef group-hover:rotate-0"
                      style={{ transform: `rotate(${(i - 1) * 7}deg) translateY(${i === 1 ? -6 : 4}px)`, marginInline: "-4%" }}
                    >
                      <div className="aspect-square bg-paper">
                        <DishIllustration dish={dish} className="h-full w-full" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="eyebrow mt-6 text-brass">Mijn keuken</p>
                <h3 className="mt-2 font-serif text-[2rem] leading-tight">Elk gerecht dat je maakt, bewaard met foto en notities.</h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                  Open je keuken <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
            <Reveal delay={0.16}>
              <Link href="/eigen-recept" className="group flex h-full flex-col rounded-[32px] border border-line bg-ivory p-8">
                <div className="space-y-2">
                  {[
                    ["200", "g", "bloem"],
                    ["2", "st", "eieren"],
                  ].map(([q, u, n]) => (
                    <div key={n} className="grid grid-cols-[60px_50px_1fr] gap-2 text-sm">
                      <span className="rounded-xl border border-line bg-cream px-3 py-2 font-semibold">{q}</span>
                      <span className="rounded-xl border border-line bg-cream px-3 py-2 text-muted">{u}</span>
                      <span className="rounded-xl border border-line bg-cream px-3 py-2">{n}</span>
                    </div>
                  ))}
                  <span className="inline-flex rounded-xl border border-dashed border-brass/60 px-3 py-2 text-sm font-semibold text-brass">+ Ingrediënt toevoegen</span>
                </div>
                <p className="eyebrow mt-7 text-brass">Eigen recept</p>
                <h3 className="mt-2 font-serif text-[2rem] leading-tight">Schrijf je signatuurgerecht als een chef.</h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                  Begin met schrijven <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SearchCta() {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <section className="py-24 lg:py-36">
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-[40px] bg-ink px-6 py-20 text-center text-ivory md:px-16 md:py-28">
          <div aria-hidden className="absolute -left-24 -top-24 size-80 opacity-[0.15]">
            <DishIllustration dish="lemon-tart" className="h-full w-full" />
          </div>
          <div aria-hidden className="absolute -bottom-28 -right-20 size-96 opacity-[0.15]">
            <DishIllustration dish="scallops" className="h-full w-full" />
          </div>
          <p className="eyebrow relative text-brass-soft">Vanavond</p>
          <h2 className="relative mx-auto mt-4 max-w-3xl font-serif text-[clamp(2.6rem,6vw,5rem)] leading-[0.95]">
            Wat kook <em className="text-brass-soft">jij</em> vanavond?
          </h2>
          <form
            className="relative mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-full bg-ivory p-2 text-ink"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(q.trim() ? `/recepten?q=${encodeURIComponent(q.trim())}` : "/recepten");
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Zoek op gerecht of ingrediënt…"
              aria-label="Zoek recepten"
              className="h-12 min-w-0 flex-1 bg-transparent pl-5 text-[15px] placeholder:text-muted/70 focus:outline-none"
            />
            <button type="submit" className="h-12 shrink-0 rounded-full bg-ink px-6 text-sm font-semibold text-ivory transition hover:bg-ink-soft">
              Zoeken
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
