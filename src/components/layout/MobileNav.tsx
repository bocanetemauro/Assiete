"use client";

import { motion } from "framer-motion";
import { BookOpen, CalendarDays, CookingPot, House, Plus, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isActivePath } from "./Navbar";

const TABS = [
  { href: "/", label: "Home", icon: House },
  { href: "/recepten", label: "Recepten", icon: BookOpen },
  { href: "/vandaag", label: "Vandaag", icon: CalendarDays },
  { href: "/eigen-recept", label: "Eigen", icon: Plus, accent: true },
  { href: "/mijn-keuken", label: "Keuken", icon: CookingPot },
  { href: "/profiel", label: "Profiel", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/kookmodus")) return null;
  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-50 rounded-[26px] border border-line/80 bg-ivory/90 px-1.5 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 shadow-float backdrop-blur-xl lg:hidden"
      aria-label="Snelle navigatie"
    >
      <ul className="grid grid-cols-6">
        {TABS.map(({ href, label, icon: Icon, accent }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined} className="relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10.5px] font-semibold">
                {active && !accent && <motion.span layoutId="tab-active" className="absolute inset-1 rounded-2xl bg-ink/[0.06]" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className={cn("relative grid place-items-center", accent && "size-9 rounded-full bg-ink text-ivory shadow-[0_8px_18px_-8px_rgba(31,26,23,.7)]", accent && active && "bg-brass")}>
                  <Icon className={cn("size-[19px]", !accent && (active ? "text-ink" : "text-muted"))} strokeWidth={active ? 2.2 : 1.8} />
                </span>
                {!accent && <span className={cn("relative", active ? "text-ink" : "text-muted")}>{label}</span>}
                {accent && <span className="sr-only">{label} recept</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
