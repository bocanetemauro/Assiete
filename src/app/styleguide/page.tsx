"use client";

import { use } from "react";
import { TechniqueScene } from "@/components/illustrations/scenes";
import { DishIllustration } from "@/components/illustrations/dishes";
import type { DishKey, SceneSpec } from "@/lib/types";

const SCENES: SceneSpec[] = [
  { key: "prep", item: "steak" },
  { key: "chop", item: "shallot" },
  { key: "season", item: "steak" },
  { key: "heat" },
  { key: "sear", item: "steak" },
  { key: "baste", item: "steak" },
  { key: "rest", item: "steak" },
  { key: "slice", item: "steak" },
  { key: "simmer", tone: "berry" },
  { key: "boil", item: "pasta" },
  { key: "whisk", tone: "butter" },
  { key: "roast", item: "vegetables" },
  { key: "blend", tone: "herb" },
  { key: "melt" },
  { key: "chill", item: "chocolate" },
  { key: "grate", item: "parmesan" },
  { key: "pipe" },
  { key: "torch" },
  { key: "sear", item: "fish" },
  { key: "sear", item: "scallops" },
  { key: "chop", item: "tomato" },
  { key: "chop", item: "pumpkin" },
  { key: "sear", item: "mushrooms" },
  { key: "slice", item: "duck" },
];

const DISHES: DishKey[] = ["steak", "pasta", "seabass", "vegetables", "chocolate", "risotto", "duck", "scallops", "burrata", "lemon-tart", "soup", "salmon"];

export default function Styleguide({ searchParams }: { searchParams: Promise<{ view?: string; page?: string }> }) {
  const { view = "dishes", page = "0" } = use(searchParams);
  const p = Number(page);
  if (view === "scenes") {
    const items = SCENES.slice(p * 12, p * 12 + 12);
    return (
      <main style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, padding: 4 }}>
        {items.map((s, i) => (
          <div key={i} style={{ background: "#F1EBE1", position: "relative" }}>
            <TechniqueScene spec={s} />
            <span style={{ position: "absolute", left: 4, top: 2, fontSize: 10 }}>
              {s.key} {s.item ?? s.tone}
            </span>
          </div>
        ))}
      </main>
    );
  }
  const items = DISHES.slice(p * 8, p * 8 + 8);
  return (
    <main style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, padding: 4 }}>
      {items.map((d) => (
        <div key={d} style={{ background: "#ECE4D8", position: "relative" }}>
          <DishIllustration dish={d} />
          <span style={{ position: "absolute", left: 4, top: 2, fontSize: 10 }}>{d}</span>
        </div>
      ))}
    </main>
  );
}
