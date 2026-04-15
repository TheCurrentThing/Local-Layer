import { Card, CardContent } from "@/components/ui/card";
import type { AboutPageContent } from "@/types/site";

export function AboutSection({ about }: { about: AboutPageContent }) {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Card className="bg-[var(--color-card)]">
          <CardContent className="grid gap-6 p-8 md:grid-cols-[0.9fr_1.1fr] md:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                About
              </p>
              <h2 className="mt-2 font-heading text-4xl text-[var(--color-foreground)]">
                {about.title}
              </h2>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-[var(--color-foreground)]/74">
              {about.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
