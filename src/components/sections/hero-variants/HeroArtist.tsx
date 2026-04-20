// retail_products/artist — visual-led, expressive.
// Full-bleed image plate with copy overlaid at the bottom.

import type { SitePayload } from "@/types/site";

export function HeroArtist({ payload }: { payload: SitePayload }) {
  const hero = payload.galleryImages?.[0] ?? null;

  return (
    <section
      data-section="hero"
      data-hero-variant="artist"
      className="relative isolate overflow-hidden"
    >
      <div className="relative mx-auto h-[78vh] min-h-[540px] max-w-[1600px]">
        {hero?.src ? (
          <>
            <img
              src={hero.src}
              alt={hero.alt ?? ""}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          </>
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#fde68a_0%,#b45309_35%,#111_75%)]"
          />
        )}

        <div className="absolute inset-x-0 bottom-0 px-6 pb-14 md:pb-20">
          <div className="mx-auto max-w-6xl">
            <p className="font-serif text-sm italic tracking-wide text-amber-200">
              Studio of {payload.brand.businessName}
            </p>
            <h1 className="mt-3 font-serif text-5xl font-medium leading-[1.02] text-white md:text-7xl">
              {payload.brand.tagline || "Work made slowly, by hand."}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              <a
                href="#gallery"
                className="rounded-full bg-white px-5 py-2.5 font-medium text-zinc-950"
              >
                Enter the gallery
              </a>
              <a
                href="#commissions"
                className="rounded-full border border-white/40 px-5 py-2.5 font-medium text-white hover:border-white"
              >
                Commission a piece
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
