"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useKitchen } from "@/lib/store/kitchen";
import { DishIllustration } from "@/components/illustrations/dishes";
import { Avatar } from "@/components/ui/Avatar";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FieldError, Input, Label } from "@/components/ui/Field";
import { EASE_CHEF } from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";

function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/profiel";
  return value;
}

/** Scherm na registratie: de bevestigingsmail is onderweg. */
function ConfirmationSent({ email, onResend }: { email: string; onResend: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <div className="rounded-[32px] bg-cream p-8 text-center shadow-card">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-ink text-ivory">
        <MailCheck className="size-6" />
      </span>
      <p className="eyebrow mt-6 text-brass">Nog één stap</p>
      <h1 className="mt-2 font-serif text-4xl leading-tight">Bevestig je e-mailadres</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        We hebben een link gestuurd naar <strong className="text-ink">{email}</strong>. Klik erop en je account is meteen actief.
      </p>
      <p className="mt-3 text-[13px] leading-relaxed text-muted/80">Niets ontvangen? Kijk ook even in je map met ongewenste e-mail.</p>
      <div className="mt-8 flex flex-col gap-3">
        <Button
          variant="secondary"
          disabled={busy || sent}
          onClick={async () => {
            setBusy(true);
            await onResend();
            setBusy(false);
            setSent(true);
          }}
        >
          {sent ? "Opnieuw verstuurd" : busy ? "Versturen…" : "Stuur de e-mail opnieuw"}
        </Button>
        <ButtonLink href="/recepten" variant="ghost">
          Verder kijken zonder in te loggen
        </ButtonLink>
      </div>
    </div>
  );
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { ready, user, signIn, signUp, signOut, resendConfirmation } = useKitchen();
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const next = safeNext(params.get("volgende"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [awaitingEmail, setAwaitingEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const login = mode === "login";

  const resend = async () => {
    const result = await resendConfirmation(email);
    toast(
      result.ok
        ? { title: "E-mail opnieuw verstuurd", description: "Kijk in je mailbox voor de bevestigingslink.", tone: "success" }
        : { title: "Versturen mislukt", description: result.error },
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNeedsConfirmation(false);

    if (login) {
      const result = await signIn(email, password);
      setBusy(false);
      if (!result.ok) {
        setError(result.error);
        setNeedsConfirmation(Boolean(result.needsConfirmation));
        return;
      }
      toast({ title: "Welkom terug", tone: "success" });
      router.push(next);
      return;
    }

    const result = await signUp({ name, email, password });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (result.needsConfirmation) {
      setAwaitingEmail(email.trim());
      return;
    }
    toast({ title: "Je account is klaar", description: "Tijd om je eerste gerecht te koken.", tone: "success" });
    router.push(next);
  };

  const switchHref = `${login ? "/registreren" : "/inloggen"}${params.get("volgende") ? `?volgende=${encodeURIComponent(next)}` : ""}`;

  return (
    <section className="min-h-screen pt-[72px] lg:grid lg:grid-cols-[1fr_1fr]">
      <div className="relative hidden overflow-hidden bg-charcoal lg:block">
        <div aria-hidden className="absolute left-1/2 top-[44%] size-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(220,198,160,0.2),transparent_65%)]" />
        <motion.div
          className="absolute left-1/2 top-[44%] aspect-square w-[min(72%,560px)] -translate-x-1/2 -translate-y-1/2"
          initial={{ rotate: -30, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE_CHEF }}
        >
          <DishIllustration dish={login ? "chocolate" : "scallops"} mode="loop" className="h-full w-full" />
        </motion.div>
        <blockquote className="absolute inset-x-12 bottom-12 text-ivory">
          <p className="font-serif text-[2.2rem] italic leading-tight">“Een recept is een verhaal dat eindigt met een goed bord.”</p>
          <footer className="eyebrow mt-4 text-ivory/45">Assiette · culinaire academie</footer>
        </blockquote>
      </div>

      <div className="flex items-center justify-center px-5 pb-32 pt-12 sm:px-10 lg:pb-16">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE_CHEF }}>
          {awaitingEmail ? (
            <ConfirmationSent email={awaitingEmail} onResend={resend} />
          ) : ready && user ? (
            <div className="rounded-[32px] bg-cream p-8 text-center shadow-card">
              <Avatar user={user} size="lg" className="mx-auto" />
              <p className="eyebrow mt-6 text-brass">Je bent ingelogd</p>
              <h1 className="mt-2 font-serif text-4xl">Hallo, {user.name.split(" ")[0]}</h1>
              <p className="mt-2 text-muted">{user.email}</p>
              <div className="mt-8 flex flex-col gap-3">
                <ButtonLink href={next} size="lg">
                  Verder naar {next === "/profiel" ? "je profiel" : "waar je was"}
                </ButtonLink>
                <Button variant="ghost" onClick={() => void signOut()}>
                  Uitloggen
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="eyebrow flex items-center gap-3 text-brass">
                <span className="h-px w-8 bg-brass/70" />
                {login ? "Inloggen" : "Account aanmaken"}
              </p>
              <h1 className="mt-4 font-serif text-[clamp(2.8rem,6vw,4.4rem)] leading-[0.95]">
                {login ? (
                  <>
                    Welkom <em className="text-brass">terug</em>
                  </>
                ) : (
                  <>
                    Jouw <em className="text-brass">keuken</em> begint hier
                  </>
                )}
              </h1>
              <p className="mt-4 text-[16px] leading-relaxed text-muted">
                {login ? "Log in om je favorieten, gekookte gerechten en eigen recepten terug te vinden." : "Bewaar favorieten, laat je borden zien en schrijf je eigen recepten."}
              </p>

              <form onSubmit={submit} className="mt-10 space-y-5" noValidate>
                {!login && (
                  <div>
                    <Label htmlFor="name">Naam</Label>
                    <Input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Voornaam en achternaam" required />
                  </div>
                )}
                <div>
                  <Label htmlFor="email">E-mailadres</Label>
                  <Input id="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jij@voorbeeld.nl" required />
                </div>
                <div>
                  <Label htmlFor="password" hint={login ? undefined : "Minstens 8 tekens"}>
                    Wachtwoord
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={login ? "current-password" : "new-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-14"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-ink/5"
                      aria-label={showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <FieldError>{error}</FieldError>
                {needsConfirmation && (
                  <button type="button" onClick={() => void resend()} className="text-[14px] font-semibold text-ink underline decoration-brass underline-offset-4">
                    Stuur de bevestigingsmail opnieuw
                  </button>
                )}
                <Button type="submit" size="lg" className="w-full" disabled={busy || !ready}>
                  {busy ? "Even geduld…" : login ? "Inloggen" : "Account aanmaken"}
                </Button>
              </form>

              {login && (
                <p className="mt-5 text-center text-[14px]">
                  <Link href="/wachtwoord-vergeten" className="font-semibold text-ink underline-offset-4 hover:underline">
                    Wachtwoord vergeten?
                  </Link>
                </p>
              )}

              <p className="mt-8 text-center text-[14px] text-muted">
                {login ? "Nog geen account?" : "Al een account?"}{" "}
                <Link href={switchHref} className="font-semibold text-ink underline-offset-4 hover:underline">
                  {login ? "Maak er een aan" : "Log in"}
                </Link>
              </p>
              <p className="mt-6 text-center text-[12px] leading-relaxed text-muted/80">
                Een account is optioneel:{" "}
                <Link href="/recepten" className="underline underline-offset-2">
                  alle recepten
                </Link>{" "}
                zijn ook zonder in te loggen te lezen.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
