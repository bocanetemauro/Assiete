import type { Metadata } from "next";
import { PlatingAcademy } from "@/components/plating/PlatingAcademy";

export const metadata: Metadata = {
  title: "De kunst van plating",
  description: "Leer een bord opmaken als een chef: zes stappen, vier principes en het juiste gereedschap.",
};

export default function PlatingPage() {
  return <PlatingAcademy />;
}
