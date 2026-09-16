import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "light" | "brass" | "outline-light";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group relative inline-flex max-w-full items-center justify-center gap-2 whitespace-normal rounded-full text-center font-semibold tracking-[0.01em] transition-all duration-300 ease-chef disabled:pointer-events-none disabled:opacity-45 select-none sm:whitespace-nowrap";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-ivory shadow-[0_14px_30px_-14px_rgba(31,26,23,.6)] hover:-translate-y-0.5 hover:bg-ink-soft active:translate-y-0",
  secondary: "border border-ink/15 bg-cream/40 text-ink hover:border-ink/35 hover:bg-cream",
  ghost: "text-ink hover:bg-ink/[0.05]",
  light: "bg-ivory text-ink hover:bg-white hover:-translate-y-0.5",
  brass: "bg-brass text-white shadow-[0_14px_30px_-14px_rgba(160,122,68,.8)] hover:-translate-y-0.5 hover:bg-[#8e6b3a]",
  "outline-light": "border border-ivory/30 text-ivory hover:border-ivory/70 hover:bg-ivory/5",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-[13px]",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-[15px]",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; className?: string; children: ReactNode };

export function Button({ variant, size, className, children, type = "button", ...props }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({ href, variant, size, className, children, ...props }: Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
