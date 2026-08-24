import { Badge } from "@/components/ui/badge";

type LegalDocumentProps = {
  badge: string;
  contentsLabel: string;
  intro: string;
  lastUpdated: string;
  sections: readonly (readonly string[])[];
  title: string;
};

export function LegalDocument({
  badge,
  contentsLabel,
  intro,
  lastUpdated,
  sections,
  title,
}: LegalDocumentProps) {
  return (
    <section className="section-shell">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-white/10 pb-8 sm:pb-10">
          <Badge>{badge}</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
            {intro}
          </p>
          <p className="mt-4 text-xs font-medium uppercase text-gold-100">
            {lastUpdated}
          </p>
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          <nav
            aria-label={contentsLabel}
            className="hidden self-start lg:sticky lg:top-32 lg:grid lg:gap-1"
          >
            <p className="mb-2 text-xs font-semibold uppercase text-gold-100">
              {contentsLabel}
            </p>
            {sections.map(([sectionTitle], index) => (
              <a
                key={`${sectionTitle}-${index}`}
                href={`#section-${index + 1}`}
                className="flex min-h-10 items-center rounded-sm border-l border-white/10 px-3 text-sm leading-5 text-muted-foreground transition hover:border-gold-300/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {sectionTitle ?? ""}
              </a>
            ))}
          </nav>

          <article className="min-w-0 divide-y divide-white/10">
            {sections.map(([sectionTitle, body], index) => (
              <section
                id={`section-${index + 1}`}
                key={`${sectionTitle}-${index}`}
                className="scroll-mt-32 py-7 first:pt-0 sm:py-8"
              >
                <h2 className="text-xl font-semibold text-white">
                  {sectionTitle ?? ""}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  {body ?? ""}
                </p>
              </section>
            ))}
          </article>
        </div>
      </div>
    </section>
  );
}
