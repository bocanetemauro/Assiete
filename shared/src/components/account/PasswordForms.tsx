"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useKitchen } from "@/lib/store/kitchen";
import { DishIllustration } from "@/components/illustrations/dishes";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FieldError, Input, Label } from "@/components/ui/Field";
import { EASE_CHEF } from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";

function Shell({ dish, children }: { dish: "lemon-tart" | "burrata"; children: React.ReactNode }) {
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
          <DishIllustration dish={dish} mode="loop" className="h-full w-full" />
        </motion.div>
        <blockquote className="absolute inset-x-12 bottom-12 text-ivory">
          <p className="font-serif text-[2.2rem] italic leading-tight">“Mise en place begint bij de sleutel van je eigen keuken.”</p>
          <footer className="eyebrow mt-4 text-ivory/45">Assiette · culinaire academie</footer>
        </blockquote>
      </div>
      <div className="flex items-center justify-center px-5 pb-32 pt-12 sm:px-10 lg:pb-16">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE_CHEF }}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

/** Stap 1: e-mailadres invullen, resetlink aanvragen. */
export function ForgotPasswordForm() {
  const { ready, requestPasswordReset } = useKitchen();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await requestPasswordReset(email);
    setBusy(false);
    if (result.ok) setSent(true);
    else setError(result.error);
  };

  return (
    <Shell dish="lemon-tart">
      {sent ? (
        <div className="rounded-[32px] bg-cream p-8 text-center shadow-card">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-ink text-ivory">
            <MailCheck className="size-6" />
          </span>
          <p className="eyebrow mt-6 text-brass">Check je mail</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight">De link is onderweg</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Bestaat er een account voor <strong className="text-ink">{email}</strong>, dan ligt er nu een e-mail met een link om een nieuw wachtwoord te kiezen.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <ButtonLink href="/inloggen" size="lg">
              Terug naar inloggen
            </ButtonLink>
            <Button variant="ghost" onClick={() => setSent(false)}>
              Ander e-mailadres proberen
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="eyebrow flex items-center gap-3 text-brass">
            <span className="h-px w-8 bg-brass/70" />
            Wachtwoord vergeten
          </p>
          <h1 className="mt-4 font-serif text-[clamp(2.8rem,6vw,4.4rem)] leading-[0.95]">
            Even een <em className="text-brass">nieuwe</em> sleutel
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">Vul je e-mailadres in. Je krijgt een link waarmee je een nieuw wachtwoord kiest.</p>
          <form onSubmit={submit} className="mt-10 space-y-5" noValidate>
            <div>
              <Label htmlFor="email">E-mailadres</Label>
              <Input id="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jij@voorbeeld.nl" required />
            </div>
            <FieldError>{error}</FieldError>
            <Button type="submit" size="lg" className="w-full" disabled={busy || !ready}>
              {busy ? "Versturen…" : "Stuur me een link"}
            </Button>
          </form>
          <p className="mt-8 text-center text-[14px] text-muted">
            Weet je het weer?{" "}
            <Link href="/inloggen" className="-my-1.5 inline-flex min-h-11 items-center py-1.5 sm:my-0 sm:min-h-0 sm:py-0 font-semibold text-ink underline-offset-4 hover:underline">
              Inloggen
            </Link>
          </p>
        </>
      )}
    </Shell>
  );
}

/** Stap 2: na het klikken op de link uit de e-mail een nieuw wachtwoord kiezen. */
export function ResetPasswordForm() {
  const { ready, user, updatePassword } = useKitchen();
  const router = useRouter();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeat) {
      setError("De twee wachtwoorden zijn niet hetzelfde.");
      return;
    }
    setBusy(true);
    setError(null);
    const result = await updatePassword(password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast({ title: "Je wachtwoord is gewijzigd", description: "Je bent meteen ingelogd.", tone: "success" });
    router.push("/profiel");
  };

  if (ready && !user) {
    return (
      <Shell dish="burrata">
        <div className="rounded-[32px] bg-cream p-8 text-center shadow-card">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-ink text-ivory">
            <KeyRound className="size-6" />
          </span>
          <p className="eyebrow mt-6 text-brass">Link verlopen</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight">Deze link werkt niet meer</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">Resetlinks zijn maar kort geldig en kunnen één keer gebruikt worden. Vraag een nieuwe aan.</p>
          <div className="mt-8 flex flex-col gap-3">
            <ButtonLink href="/wachtwoord-vergeten" size="lg">
              Nieuwe link aanvragen
            </ButtonLink>
            <ButtonLink href="/recepten" variant="ghost">
              Verder kijken zonder in te loggen
            </ButtonLink>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell dish="burrata">
      <p className="eyebrow flex items-center gap-3 text-brass">
        <span className="h-px w-8 bg-brass/70" />
        Nieuw wachtwoord
      </p>
      <h1 className="mt-4 font-serif text-[clamp(2.8rem,6vw,4.4rem)] leading-[0.95]">
        Kies je <em className="text-brass">nieuwe</em> wachtwoord
      </h1>
      <p className="mt-4 text-[16px] leading-relaxed text-muted">Minstens 8 tekens. Daarna ben je meteen ingelogd.</p>
      <form onSubmit={submit} className="mt-10 space-y-5" noValidate>
        <div>
          <Label htmlFor="password" hint="Minstens 8 tekens">
            Nieuw wachtwoord
          </Label>
          <div className="relative">
            <Input id="password" type={show ? "text" : "password"} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-14" required />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-ink/5"
              aria-label={show ? "Verberg wachtwoord" : "Toon wachtwoord"}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        <div>
          <Label htmlFor="repeat">Herhaal je wachtwoord</Label>
          <Input id="repeat" type={show ? "text" : "password"} autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} required />
        </div>
        <FieldError>{error}</FieldError>
        <Button type="submit" size="lg" className="w-full" disabled={busy || !ready}>
          {busy ? "Opslaan…" : "Wachtwoord opslaan"}
        </Button>
      </form>
    </Shell>
  );
}
