// food_service/bar — mood-rich nightlife. Dark plate with glow accents,
// surfaces tonight's special or next event as the focal line under the wordmark.

import type { SitePayload } from "@/types/site";

export function HeroBar({ payload }: { payload: SitePayload }) {
  const special = payload.specials?.[0] ?? null;
  const event = payload.events?.[0] ?? null;
  const tonight = special?.title ?? event?.title;
  const tonightLabel =
    special?.label ??
    (event?.startsAt ? `Tonight · ${event.startsAt}` : "Tonight");

  return (
    <section
      data-section="hero"
      data-hero-variant="bar"
      className="relative isolate overflow-hidden border-b border-white/10 bg-[#0b0a10]"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 12%, rgba(244,114,182,0.28), transparent 60%), radial-gradient(ellipse 60% 40% at 85% 90%, rgba(250,204,21,0.18), transparent 65%), radial-gradient(ellipse 55% 40% at 10% 85%, rgba(129,140,248,0.22), transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(transparent_1px,rgba(0,0,0,0.55)_1px)] [background-size:3px_3px] mix-blend-multiply opacity-40"
      />

      <div className="relative mx-auto flex min-h-[620px] max-w-6xl flex-col justify-end px-6 pb-20 pt-28">
        <p className="font-serif text-sm italic tracking-[0.2em] text-amber-200/90">
          · {tonightLabel} ·
        </p>
        <h1 className="mt-4 font-serif text-6xl font-normal leading-[0.95] text-white md:text-8xl">
          {payload.brand.businessName}
        </h1>
        {tonight ? (
          <p className="mt-6 max-w-xl text-xl text-zinc-200 md:text-2xl">
            {tonight}
          </p>
        ) : (
          payload.brand.tagline && (
            <p className="mt-6 max-w-xl text-xl text-zinc-300">
              {payload.brand.tagline}
            </p>
          )
        )}
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
          <a
            href="#specials"
            className="rounded-full bg-white px-5 py-2.5 font-medium text-zinc-950"
          >
            Tonight&apos;s list
          </a>
          <a
            href="#events"
            className="rounded-full border border-white/30 px-5 py-2.5 font-medium text-white hover:border-white"
          >
            What&apos;s on this week
          </a>
          <span className="ml-auto hidden text-xs uppercase tracking-[0.25em] text-zinc-400 md:block">
            Open until late
          </span>
        </div>
      </div>
    </section>
  );
}
