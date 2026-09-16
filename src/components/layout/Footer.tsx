"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/constants";
import { Logo } from "./Navbar";

const COLUMNS = [
  {
    title: "Ontdek",
    links: [
      { href: "/recepten", label: "Alle recepten" },
      { href: "/vandaag", label: "Vandaag op het menu" },
      { href: "/plating", label: "De kunst van plating" },
    ],
  },
  {
    title: "Jouw keuken",
    links: [
      { href: "/mijn-keuken", label: "Mijn keuken" },
      { href: "/eigen-recept", label: "Maak je eigen recept" },
      { href: "/profiel", label: "Profiel & statistieken" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/inloggen", label: "Inloggen" },
      { href: "/registreren", label: "Account aanmaken" },
      { href: "/kookmodus/steak-met-blauwe-bessensaus", label: "Probeer de kookmodus" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/kookmodus")) return null;
  return (
    <footer className="relative overflow-hidden bg-charcoal pb-32 pt-24 text-ivory lg:pb-12">
      <div className="container-page">
        <div className="grid gap-16 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo light />
            <p className="mt-10 max-w-md font-serif text-[clamp(2rem,3.4vw,3rem)] leading-[1.02] text-ivory/95">
              Koken is de kunst van <em className="text-brass-soft">aandacht</em>.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="eyebrow text-ivory/45">{col.title}</p>
                <ul className="mt-5 space-y-3.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-[15px] text-ivory/80 transition-colors hover:text-brass-soft">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 flex flex-col gap-3 border-t border-ivory/10 pt-8 text-[13px] text-ivory/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. Alle recepten zijn origineel en vrij te lezen.
          </p>
          <p className="font-serif text-base italic text-ivory/55">Van het eerste ingrediënt tot de laatste penseelstreek.</p>
        </div>
      </div>
      <span aria-hidden className="pointer-events-none absolute -bottom-16 right-[-2%] select-none font-serif text-[22vw] italic leading-none text-ivory/[0.03]">
        {BRAND.name}
      </span>
    </footer>
  );
}
