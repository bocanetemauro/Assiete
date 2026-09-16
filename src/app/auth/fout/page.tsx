import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { DishIllustration } from "@/components/illustrations/dishes";

export const metadata: Metadata = { title: "Link werkt niet", robots: { index: false } };

/** Foutcodes van Supabase vertaald naar iets begrijpelijks. */
const REASONS: Record<string, { title: string; body: string }> = {
  otp_expired: { title: "Deze link is verlopen", body: "Links uit onze e-mails zijn maar kort geldig en werken één keer. Vraag een nieuwe aan." },
  access_denied: { title: "Deze link is al gebruikt", body: "Waarschijnlijk is je account al bevestigd. Probeer gewoon in te loggen." },
  verify_failed: { title: "We konden deze link niet controleren", body: "De link is verlopen of al gebruikt. Vraag een nieuwe aan en probeer het opnieuw." },
  exchange_failed: { title: "We konden je niet inloggen", body: "De link hoort bij een andere browser of is verlopen. Vraag een nieuwe link aan." },
  missing_token: { title: "Er ontbreekt iets in deze link", body: "Open de link rechtstreeks uit de e-mail, zonder hem aan te passen." },
  not_configured: { title: "De server is nog niet ingesteld", body: "Inloggen kan nog niet. Alle recepten zijn wel gewoon te lezen." },
};

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<{ reden?: string; flow?: string }> }) {
  const { reden, flow } = await searchParams;
  const recovery = flow === "recovery";
  const info = REASONS[reden ?? ""] ?? {
    title: "Deze link werkt niet meer",
    body: "De link is verlopen of al gebruikt. Vraag een nieuwe aan en probeer het opnieuw.",
  };

  return (
    <section className="paper-grain relative overflow-hidden bg-paper pt-[72px]">
      <div className="container-page grid min-h-[calc(100svh-72px)] items-center gap-14 py-16 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="eyebrow flex items-center gap-3 text-brass">
            <span className="h-px w-8 bg-brass/70" />
            Inloggen
          </p>
          <h1 className="mt-4 font-serif text-[clamp(2.8rem,6vw,4.8rem)] leading-[0.95]">{info.title}</h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted">{info.body}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            {recovery ? (
              <ButtonLink href="/wachtwoord-vergeten" size="lg">
                Nieuwe resetlink aanvragen
              </ButtonLink>
            ) : (
              <ButtonLink href="/registreren" size="lg">
                Opnieuw registreren
              </ButtonLink>
            )}
            <ButtonLink href="/inloggen" variant="secondary" size="lg">
              Naar inloggen
            </ButtonLink>
          </div>
          <div className="mt-8 flex max-w-md items-start gap-4 rounded-3xl border border-line bg-cream p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-ivory">
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <p className="font-semibold">Je hoeft niet in te loggen om te koken</p>
              <p className="mt-1 text-[14px] leading-relaxed text-muted">Alle 52 recepten, de kookmodus en de plating-academie zijn vrij toegankelijk.</p>
              <ButtonLink href="/recepten" variant="ghost" size="sm" className="-ml-3 mt-2 underline decoration-brass underline-offset-4">
                Bekijk de recepten
              </ButtonLink>
            </div>
          </div>
        </div>
        <div className="mx-auto hidden aspect-square w-full max-w-[420px] md:block" aria-hidden>
          <DishIllustration dish="lemon-tart" className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}
