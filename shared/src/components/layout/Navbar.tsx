"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LogOut, Menu, Search, X, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND, NAV_ITEMS } from "@/lib/constants";
import { useKitchen } from "@/lib/store/kitchen";
import { useSocial } from "@/lib/store/social";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/Button";

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`) || (href === "/recepten" && pathname.startsWith("/recepten"));
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex min-w-0 items-center gap-2 sm:gap-3" aria-label={`${BRAND.name} — home`}>
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-full font-serif text-[22px] italic transition-transform duration-500 group-hover:rotate-[-12deg]", light ? "bg-ivory text-ink" : "bg-ink text-ivory")}>
        A
      </span>
      <span className="min-w-0 leading-none">
        <span className={cn("block truncate font-serif text-[22px] font-medium tracking-tight sm:text-[26px]", light ? "text-ivory" : "text-ink")}>{BRAND.name}</span>
        <span className={cn("eyebrow mt-0.5 hidden text-[8.5px] sm:block", light ? "text-ivory/60" : "text-muted")}>{BRAND.tagline}</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { user, ready, signOut } = useKitchen();
  const { incoming } = useSocial();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname.startsWith("/kookmodus")) return null;
  const transparent = pathname === "/" && !scrolled && !open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          transparent ? "border-transparent bg-transparent" : "border-line/70 bg-ivory/85 backdrop-blur-xl",
        )}
      >
        <div className="container-page flex h-[72px] items-center justify-between gap-2 sm:gap-6">
          <Logo />
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Hoofdnavigatie">
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn("relative whitespace-nowrap rounded-full px-2.5 py-2.5 text-[13.5px] font-medium transition-colors duration-300 xl:px-4 xl:text-[14px]", active ? "text-ink" : "text-muted hover:text-ink")}
                >
                  {item.label}
                  {item.href === "/vrienden" && incoming > 0 && (
                    <span className="ml-1 inline-grid min-w-4 place-items-center rounded-full bg-brass px-1 align-[1px] text-[10px] font-bold leading-4 text-white" aria-label={`${incoming} nieuwe verzoeken`}>
                      {incoming}
                    </span>
                  )}
                  {active && <motion.span layoutId="nav-active" className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-brass" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                </Link>
              );
            })}
          </nav>
          <div className="flex shrink-0 items-center gap-1.5">
            <Link href="/recepten#zoeken" aria-label="Zoek recepten" className="grid size-11 place-items-center rounded-full text-ink transition hover:bg-ink/5">
              <Search className="size-[18px]" strokeWidth={1.9} />
            </Link>
            {ready && user && (
              <Link
                href={incoming > 0 ? "/vrienden?tab=verzoeken" : "/vrienden"}
                aria-label={incoming > 0 ? `Vrienden, ${incoming} nieuwe verzoeken` : "Vrienden"}
                className="relative grid size-11 place-items-center rounded-full text-ink transition hover:bg-ink/5 lg:hidden"
              >
                <Users className="size-[19px]" strokeWidth={1.9} />
                {incoming > 0 && (
                  <span className="absolute right-1 top-1 grid min-w-[18px] place-items-center rounded-full bg-brass px-1 text-[10.5px] font-bold leading-[18px] text-white">{incoming}</span>
                )}
              </Link>
            )}
            {ready && user ? (
              <Link href="/profiel" className="hidden items-center gap-2.5 rounded-full border border-line bg-cream/70 py-1 pl-1 pr-4 transition hover:border-ink/25 sm:flex">
                <Avatar user={user} size="sm" />
                <span className="max-w-24 truncate text-[13.5px] font-semibold">{user.name.split(" ")[0]}</span>
              </Link>
            ) : (
              // Verbergen via een wrapper: `hidden` op de knop zelf verliest van de
              // `inline-flex` in de Button-basisklasse, waardoor hij op telefoon bleef staan.
              <span className="hidden sm:inline-flex">
                <ButtonLink href="/inloggen" size="sm">
                  Inloggen
                </ButtonLink>
              </span>
            )}
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full transition hover:bg-ink/5 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Menu sluiten" : "Menu openen"}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ivory px-6 pb-32 pt-28 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <nav className="flex flex-col" aria-label="Mobiele navigatie">
              {NAV_ITEMS.map((item, i) => (
                <motion.div key={item.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                  <Link
                    href={item.href}
                    className={cn("flex items-center justify-between border-b border-line py-4 font-serif text-[2.4rem] leading-none", isActivePath(pathname, item.href) ? "text-brass" : "text-ink")}
                  >
                    {item.label}
                    <ArrowRight className="size-5 text-muted" strokeWidth={1.5} />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div className="mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {ready && user ? (
                <div className="flex items-center justify-between rounded-3xl bg-cream p-4 shadow-card">
                  <Link href="/profiel" className="flex items-center gap-3">
                    <Avatar user={user} />
                    <span>
                      <span className="block font-semibold">{user.name}</span>
                      <span className="text-sm text-muted">Bekijk je profiel</span>
                    </span>
                  </Link>
                  <button onClick={signOut} className="grid size-11 place-items-center rounded-full hover:bg-ink/5" aria-label="Uitloggen">
                    <LogOut className="size-5" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <ButtonLink href="/inloggen" variant="secondary" size="lg">
                    Inloggen
                  </ButtonLink>
                  <ButtonLink href="/registreren" size="lg">
                    Account maken
                  </ButtonLink>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
