import { ClocheIllustration } from "@/components/illustrations/Cloche";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 pb-28 pt-[120px] text-center">
      <div className="size-56">
        <ClocheIllustration label="404" />
      </div>
      <p className="eyebrow mt-8 text-brass">404</p>
      <h1 className="mt-3 font-serif text-[clamp(2.8rem,6vw,4.6rem)] leading-none">Deze pagina staat niet op het menu</h1>
      <p className="mt-5 max-w-md text-[17px] text-muted">Misschien is ze verplaatst of heeft de chef haar geschrapt. Kies iets anders van de kaart.</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" size="lg">
          Naar de homepage
        </ButtonLink>
        <ButtonLink href="/recepten" variant="secondary" size="lg">
          Ontdek recepten
        </ButtonLink>
      </div>
    </section>
  );
}
