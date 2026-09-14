"use client";

import { ChefHat } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useKitchen } from "@/lib/store/kitchen";
import { DishIllustration } from "@/components/illustrations/dishes";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";

export function RequireAuth({ children, title, description, eyebrow = "Jouw keuken" }: { children: ReactNode; title: ReactNode; description: string; eyebrow?: string }) {
  const { ready, user, signInDemo } = useKitchen();
  const pathname = usePathname();
  const toast = useToast();

  if (!ready) {
    return (
      <div className="grid min-h-[80vh] place-items-center pt-[72px]">
        <div className="size-14 animate-pulse rounded-full bg-brass/25" aria-label="Laden" />
      </div>
    );
  }
  if (user) return <>{children}</>;

  const next = encodeURIComponent(pathname);
  return (
    <section className="paper-grain relative overflow-hidden bg-paper pt-[72px]">
      <div className="container-page grid min-h-[calc(100svh-72px)] items-center gap-14 py-16 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <p className="eyebrow flex items-center gap-3 text-brass">
            <span className="h-px w-8 bg-brass/70" />
            {eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-[clamp(3rem,6.5vw,5.6rem)] leading-[0.93]">{title}</h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted">{description}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={`/inloggen?volgende=${next}`} size="lg">
              Inloggen
            </ButtonLink>
            <ButtonLink href={`/registreren?volgende=${next}`} variant="secondary" size="lg">
              Account aanmaken
            </ButtonLink>
          </div>
          <div className="mt-8 flex max-w-md items-start gap-4 rounded-3xl border border-line bg-cream p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-ivory">
              <ChefHat className="size-5" />
            </span>
            <div>
              <p className="font-semibold">Eerst even rondkijken?</p>
              <p className="mt-1 text-[14px] leading-relaxed text-muted">Het demo-account is gevuld met gekookte gerechten, favorieten, statistieken en twee eigen recepten.</p>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 mt-2 underline decoration-brass underline-offset-4"
                onClick={() => {
                  signInDemo();
                  toast({ title: "Welkom, Noor", description: "Je verkent Assiette met het demo-account.", tone: "success" });
                }}
              >
                Verken met demo-account
              </Button>
            </div>
          </div>
        </Reveal>
        <div className="relative mx-auto hidden aspect-square w-full max-w-[560px] md:block" aria-hidden>
          {(
            [
              ["pasta", "left-[4%] top-[6%] w-[52%] -rotate-6"],
              ["risotto", "right-[2%] top-[20%] w-[46%] rotate-6"],
              ["burrata", "bottom-[2%] left-[22%] w-[48%] rotate-2"],
            ] as const
          ).map(([dish, pos], i) => (
            <Reveal key={dish} delay={0.15 + i * 0.12} className={`absolute ${pos}`}>
              <div className="rounded-md bg-white p-3 pb-10 shadow-lift">
                <div className="aspect-square bg-paper">
                  <DishIllustration dish={dish} className="h-full w-full" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
