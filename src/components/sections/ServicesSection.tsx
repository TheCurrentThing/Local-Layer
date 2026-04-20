// Services offered. Used by any services-family contract.
// Payload-driven — no category branching here.

import type { SitePayload } from "@/types/site";

export function ServicesSection({ payload }: { payload: SitePayload }) {
  const offerings = payload.serviceOfferings ?? [];

  if (offerings.length === 0) return null;

  return (
    <section
      data-section="services"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
          Services
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          What we offer
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offerings.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
          >
            <h3 className="text-lg font-medium text-white">{item.title}</h3>
            {item.shortDescription && (
              <p className="mt-2 text-sm text-zinc-400">
                {item.shortDescription}
              </p>
            )}
            {item.startingPrice && (
              <p className="mt-4 text-sm font-medium text-amber-400">
                {item.startingPrice}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
