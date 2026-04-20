// Address and map link section.

import type { SitePayload } from "@/types/site";
import { getBusinessAddress } from "@/lib/brand";

export function LocationSection({ payload }: { payload: SitePayload }) {
  const address = getBusinessAddress(payload.brand);
  if (!address) return null;

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  return (
    <section
      data-section="location"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
          Location
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          Where to find us
        </h2>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <p className="text-lg text-zinc-300">{address}</p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-500"
        >
          Get directions →
        </a>
      </div>
    </section>
  );
}
