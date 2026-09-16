import type { Metadata } from "next";
import { TodayMenu } from "@/components/today/TodayMenu";

export const metadata: Metadata = {
  title: "Vandaag op het menu",
  description: "Vijf dagelijkse aanbevolen gerechten, gekozen door onze chefs.",
};

export default function TodayPage() {
  return <TodayMenu />;
}
