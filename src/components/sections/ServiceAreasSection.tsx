// Geographic coverage for services-family tenants. Chip cloud.

import type { SitePayload } from "@/types/site";

export function ServiceAreasSection({ payload }: { payload: SitePayload }) {
  const areas = (payload.serviceAreas ?? []).filter((a) => a.isActive !== false);
  if (areas.length === 0) return null;

  return (
    <section
      data-section="service_areas"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
          Service Areas
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          Where we work
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {areas.map((area) => (
          <span
            key={area.id}
            className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200"
          >
            {area.name}
          </span>
        ))}
      </div>
    </section>
  );
}
