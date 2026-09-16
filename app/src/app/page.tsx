import { Hero, TechniqueMarquee } from "@/components/home/Hero";
import { DailyRecipes } from "@/components/home/DailyRecipes";
import { Journey } from "@/components/home/Journey";
import { Features, PlatingShowcase, SearchCta } from "@/components/home/Features";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechniqueMarquee />
      <DailyRecipes />
      <Journey />
      <PlatingShowcase />
      <Features />
      <SearchCta />
    </>
  );
}
