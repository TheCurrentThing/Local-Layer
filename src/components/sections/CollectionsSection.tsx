// Product collections / series. Stub — collections table not yet wired.

import type { SitePayload } from "@/types/site";

export function CollectionsSection({ payload }: { payload: SitePayload }) {
  const collections = (payload.collections ?? []).filter((c) => c.isActive !== false);
  if (collections.length === 0) return null;

  return (
    <section
      data-section="collections"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
          Collections
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          Browse by series
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <div key={c.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            {c.coverImageUrl && (
              <img
                src={c.coverImageUrl}
                alt={c.name}
                className="mb-4 aspect-video w-full rounded-xl object-cover"
              />
            )}
            <h3 className="text-sm font-semibold text-white">{c.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
