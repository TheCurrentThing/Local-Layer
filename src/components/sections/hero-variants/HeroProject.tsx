// services/project — confidence + visual proof + quote-first CTA.

import type { SitePayload } from "@/types/site";

export function HeroProject({ payload }: { payload: SitePayload }) {
  const first = payload.galleryImages?.[0] ?? null;

  return (
    <section
      data-section="hero"
      data-hero-variant="project"
      className="border-b border-zinc-800"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
            {payload.kitCategory.replace(/_/g, " ")}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.1] text-white md:text-5xl">
            {payload.brand.tagline ||
              `Considered work, delivered by ${payload.brand.businessName}.`}
          </h1>
          <p className="mt-5 max-w-lg text-base text-zinc-400">
            Every engagement starts with a scoped proposal and a fixed timeline.
            Review a fit in minutes, not weeks.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#quote_request"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950"
            >
              Request a quote
            </a>
            <a
              href="#gallery"
              className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:border-zinc-500"
            >
              See completed work
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            {first?.src ? (
              <img
                src={first.src}
                alt={first.alt ?? ""}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-zinc-600">
                Project imagery
              </div>
            )}
          </div>
          <div className="absolute -bottom-4 left-4 right-4 flex flex-wrap gap-2">
            {["Licensed", "Fixed-bid", "2-week start"].map((c) => (
              <span
                key={c}
                className="rounded-full bg-zinc-950/90 px-3 py-1 text-xs font-medium text-zinc-200 ring-1 ring-zinc-700 backdrop-blur"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
