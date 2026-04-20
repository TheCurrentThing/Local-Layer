// Product catalog section. Stub — products table not yet in payload pipeline.

import type { SitePayload } from "@/types/site";

export function ProductsSection({ payload }: { payload: SitePayload }) {
  const products = payload.products ?? [];
  if (products.length === 0) return null;

  return (
    <section
      data-section="products"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
          Shop
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          Available now
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
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
