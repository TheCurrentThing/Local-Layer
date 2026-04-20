// services/on_demand — urgency + trust + a giant phone CTA.
// Short copy, no visual flourish: the phone number IS the hero.

import type { SitePayload } from "@/types/site";

export function HeroOnDemand({ payload }: { payload: SitePayload }) {
  const phone = payload.brand.phone;
  const tel = phone?.replace(/\D/g, "");

  return (
    <section
      data-section="hero"
      data-hero-variant="on_demand"
      className="relative border-b border-zinc-800 bg-zinc-950"
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Dispatch open · 24/7
            </p>
          </div>
          <h1 className="mt-3 text-4xl font-bold leading-[1.05] text-white md:text-6xl">
            {payload.brand.tagline || `${payload.brand.businessName} is on call.`}
          </h1>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
            <li>• Licensed &amp; insured</li>
            <li>• Arrival in 60 min</li>
            <li>• Upfront pricing</li>
          </ul>
        </div>

        {phone && (
          <a
            href={tel ? `tel:${tel}` : "#"}
            className="group flex flex-col items-start justify-center rounded-2xl bg-amber-500 p-6 text-zinc-950 transition-transform hover:-translate-y-0.5"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
              Call now
            </span>
            <span className="mt-2 text-3xl font-bold leading-none tabular-nums md:text-4xl">
              {phone}
            </span>
            <span className="mt-3 text-sm font-medium opacity-80 group-hover:opacity-100">
              Tap to connect dispatch →
            </span>
          </a>
        )}
      </div>
    </section>
  );
}
