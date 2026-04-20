// Featured products / items spotlight. Stub — products table not yet wired.

import type { SitePayload } from "@/types/site";

export function FeaturedItemsSection({ payload }: { payload: SitePayload }) {
  const featured = (payload.products ?? []).filter((p) => p.isActive);
  if (featured.length === 0) return null;

  return (
    <section
      data-section="featured_items"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
          Featured
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          Selected works
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.slice(0, 6).map((p) => (
          <article key={p.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.name}
                className="mb-4 aspect-square w-full rounded-xl object-cover"
              />
            )}
            <h3 className="text-sm font-medium text-white">{p.name}</h3>
            {p.price != null && (
              <p className="mt-1 text-sm font-semibold text-amber-400">
                ${p.price.toFixed(2)}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
