// High-contrast conversion band. Required for on_demand; optional elsewhere.

import type { SitePayload } from "@/types/site";

export function PrimaryCtaSection({ payload }: { payload: SitePayload }) {
  const phone = payload.brand.phone;
  const tel = phone?.replace(/\D/g, "");

  return (
    <section
      data-section="primary_cta"
      className="mx-auto max-w-6xl px-6 py-10"
    >
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-amber-500 p-8 text-zinc-950 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">
            Need help now?
          </p>
          <p className="mt-1 text-2xl font-semibold">
            Call dispatch — we pick up 24/7.
          </p>
        </div>
        {phone && (
          <a
            href={tel ? `tel:${tel}` : "#"}
            className="rounded-full bg-zinc-950 px-5 py-3 text-base font-semibold text-amber-400"
          >
            {phone}
          </a>
        )}
      </div>
    </section>
  );
}
