import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { BusinessSpecial } from "@/types/menu";

export function SpecialsSection({
  specials,
  intro,
}: {
  specials: BusinessSpecial[];
  intro: string;
}) {
  const [featured, ...rest] = specials;

  if (!featured) {
    return null;
  }

  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-highlight)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="bg-[var(--color-card)]">
          <CardContent className="p-8 md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--brand-primary)]">
              Today&apos;s Special
            </p>
            <h2 className="mt-5 font-heading text-4xl text-[var(--color-foreground)] md:text-5xl">
              {featured.title}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--color-foreground)]/72">
              {featured.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {featured.price !== null && (
                <span className="rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-2xl font-bold text-[var(--color-primary-text)]">
                  ${featured.price.toFixed(2)}
                </span>
              )}
              <Badge variant="accent">Available Until Sold Out</Badge>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card className="bg-[var(--color-card)]">
            <CardContent className="p-6">
              <p className="text-sm leading-relaxed text-[var(--color-foreground)]/70">
                {intro}
              </p>
            </CardContent>
          </Card>
          {rest.map((special) => (
            <Card key={special.id} className="bg-[var(--color-card)]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                      {special.label}
                    </p>
                    <h3 className="mt-2 font-heading text-2xl text-[var(--color-foreground)]">
                      {special.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--color-foreground)]/70">
                      {special.description}
                    </p>
                  </div>
                  {special.price !== null && (
                    <span className="text-xl font-bold text-[var(--brand-primary)]">
                      ${special.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
