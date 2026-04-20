// Reviews / testimonials for food-service contracts.
// Functionally identical to TestimonialsSection; distinct section type
// so food_service and services contracts can use different slot names.

import type { SitePayload } from "@/types/site";

export function ReviewsSection({ payload }: { payload: SitePayload }) {
  const reviews = payload.testimonials?.filter((t) => t.isActive) ?? [];
  if (reviews.length === 0) return null;

  return (
    <section
      data-section="reviews"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
          Reviews
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          What guests are saying
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <blockquote
            key={r.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
          >
            <p className="text-sm leading-relaxed text-zinc-300">&ldquo;{r.quote}&rdquo;</p>
            <footer className="mt-4 text-xs text-zinc-500">— {r.author}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
