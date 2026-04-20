// food_service/food_truck — dynamic, location-aware, fast CTA.
// The location tile is the emotional center: "we're at X today."

import type { SitePayload } from "@/types/site";
import { getBusinessAddress } from "@/lib/brand";

export function HeroFoodTruck({ payload }: { payload: SitePayload }) {
  const today = payload.events?.[0] ?? null;
  const whereLabel = today?.location ?? getBusinessAddress(payload.brand) ?? "Check back soon";
  const whenLabel = today?.startsAt ? new Date(today.startsAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "Today";
  const phone = payload.brand.phone;

  return (
    <section
      data-section="hero"
      data-hero-variant="food_truck"
      className="relative overflow-hidden border-b border-zinc-800 bg-zinc-950"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-24 h-[360px] w-[360px] rounded-full bg-amber-500/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-[-140px] h-[380px] w-[380px] rounded-full bg-rose-500/20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-[1.1fr_1fr] md:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300 ring-1 ring-amber-400/30">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
            On the road
          </p>
          <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl">
            {payload.brand.businessName}
          </h1>
          {payload.brand.tagline && (
            <p className="mt-4 max-w-lg text-lg text-zinc-300">
              {payload.brand.tagline}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#menu"
              className="rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-zinc-950"
            >
              See the menu
            </a>
            <a
              href="#events"
              className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-200 hover:border-zinc-500"
            >
              Full schedule
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/15 via-zinc-950 to-rose-500/10 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-300">
            {whenLabel}
          </p>
          <p className="mt-2 text-2xl font-semibold leading-tight text-white md:text-3xl">
            {whereLabel}
          </p>
          {today?.title && (
            <p className="mt-2 text-sm text-zinc-300">{today.title}</p>
          )}
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-zinc-400">
            <span>Next stops below ↓</span>
            {phone && <span className="tabular-nums">{phone}</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
