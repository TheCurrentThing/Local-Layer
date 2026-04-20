// Consolidated menu section for the contract system.
// Renders all active menu categories and their items.

import type { SitePayload } from "@/types/site";

export function MenuSection({ payload }: { payload: SitePayload }) {
  const categories = payload.menuCategories?.filter((c) => c.isActive) ?? [];
  if (categories.length === 0) return null;

  return (
    <section
      data-section="menu"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
          Menu
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          What&apos;s cooking
        </h2>
      </div>

      <div className="space-y-12">
        {categories.map((cat) => (
          <div key={cat.id}>
            <h3 className="mb-4 text-lg font-semibold text-white">{cat.name}</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {cat.items
                .filter((item) => item.isActive)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      {item.description && (
                        <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.price > 0 && (
                      <p className="shrink-0 text-sm font-semibold text-amber-400">
                        ${item.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
