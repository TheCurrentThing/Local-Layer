// Neutral fallback hero. Kept minimal so categories without a tailored
// variant still render cleanly.

import type { SitePayload } from "@/types/site";

export function HeroDefault({ payload }: { payload: SitePayload }) {
  return (
    <section
      data-section="hero"
      data-hero-variant="default"
      className="mx-auto max-w-6xl px-6 py-20"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
        {payload.kitCategory.replace(/_/g, " ")}
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">
        {payload.brand.businessName}
      </h1>
      {payload.brand.tagline && (
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          {payload.brand.tagline}
        </p>
      )}
    </section>
  );
}
