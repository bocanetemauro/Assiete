"use client";

import { Check, LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { isUsernameAvailable } from "@/lib/social";
import { USERNAME_MAX, normalizeUsername, usernameProblem } from "@/lib/username";
import { cn } from "@/lib/utils";
import { Label, inputClass } from "@/components/ui/Field";

export type UsernameStatus = "idle" | "invalid" | "checking" | "available" | "taken" | "unchanged" | "error";

/**
 * Username-invoer met live controle: regels meteen, beschikbaarheid na een korte
 * pauze in het typen. De database controleert bij opslaan nog een keer.
 */
export function UsernameField({
  id = "username",
  value,
  onChange,
  current = null,
  onStatus,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  /** Eigen, al opgeslagen username: die telt als "geen wijziging". */
  current?: string | null;
  onStatus?: (status: UsernameStatus) => void;
}) {
  const [status, setStatus] = useState<UsernameStatus>("idle");
  const username = normalizeUsername(value);
  const problem = value ? usernameProblem(value) : null;

  useEffect(() => {
    let cancelled = false;
    const set = (next: UsernameStatus) => {
      if (cancelled) return;
      setStatus(next);
      onStatus?.(next);
    };
    if (!value) return set("idle");
    if (problem) return set("invalid");
    if (current && username === current) return set("unchanged");
    set("checking");
    const timer = window.setTimeout(() => {
      isUsernameAvailable(username)
        .then((free) => set(free ? "available" : "taken"))
        .catch(() => set("error"));
    }, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // onStatus bewust niet als afhankelijkheid: het is een terugmelding, geen invoer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, problem, username, current]);

  const hint =
    status === "invalid" ? problem
    : status === "taken" ? "Deze username is al bezet."
    : status === "available" ? "Beschikbaar"
    : status === "error" ? "Controleren lukte niet; we proberen het bij opslaan opnieuw."
    : "3–20 tekens: letters, cijfers en _";

  return (
    <div>
      <Label htmlFor={id} hint={`${username.length}/${USERNAME_MAX}`}>
        Username
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-semibold text-muted" aria-hidden>
          @
        </span>
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\s/g, "").toLowerCase())}
          className={cn(inputClass, "pl-9 pr-12", (status === "invalid" || status === "taken") && "border-bordeaux/60 focus:border-bordeaux/70")}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          inputMode="text"
          maxLength={USERNAME_MAX + 1}
          placeholder="bijv. mauro2009"
          aria-describedby={`${id}-hint`}
          aria-invalid={status === "invalid" || status === "taken"}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2" aria-hidden>
          {status === "checking" && <LoaderCircle className="size-4 animate-spin text-muted" />}
          {(status === "available" || status === "unchanged") && <Check className="size-4 text-sage" strokeWidth={2.6} />}
          {(status === "invalid" || status === "taken") && <X className="size-4 text-bordeaux" strokeWidth={2.6} />}
        </span>
      </div>
      <p
        id={`${id}-hint`}
        aria-live="polite"
        className={cn("mt-2 text-[13px]", status === "invalid" || status === "taken" ? "text-bordeaux" : status === "available" ? "text-sage" : "text-muted")}
      >
        {hint}
      </p>
    </div>
  );
}
