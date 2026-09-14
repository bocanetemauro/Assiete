import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", align === "center" && "items-center text-center md:flex-col md:items-center", className)}>
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className={cn("eyebrow flex items-center gap-3 text-brass", align === "center" && "justify-center")}>
            <span className="h-px w-8 bg-brass/70" />
            {eyebrow}
          </p>
        )}
        <h2 className="mt-4 font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.98] text-ink">{title}</h2>
        {description && <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">{description}</p>}
      </div>
      {children}
    </Reveal>
  );
}
