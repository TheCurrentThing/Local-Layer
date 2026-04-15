import { Card, CardContent } from "@/components/ui/card";
import type { Testimonial } from "@/types/site";

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
          Testimonials
        </p>
        <h2 className="mt-2 font-heading text-4xl text-[var(--color-foreground)]">
          Social proof when a client actually needs it
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-[var(--color-card)]">
              <CardContent className="p-6">
                <p className="text-base leading-relaxed text-[var(--color-foreground)]/78">
                  "{testimonial.quote}"
                </p>
                <p className="mt-4 text-sm font-semibold text-[var(--brand-primary)]">
                  {testimonial.author}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
