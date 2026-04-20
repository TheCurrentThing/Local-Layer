// Operating hours section. Only renders when hours data exists.

import type { SitePayload } from "@/types/site";

export function HoursSection({ payload }: { payload: SitePayload }) {
  const hours = payload.hours.filter((h) => h.isActive);
  if (hours.length === 0) return null;

  return (
    <section
      data-section="hours"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
          Hours
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          When we&apos;re open
        </h2>
      </div>

      <dl className="max-w-sm divide-y divide-zinc-800">
        {hours.map((entry) => (
          <div key={entry.id} className="flex justify-between py-3 text-sm">
            <dt className="text-zinc-300">{entry.dayLabel}</dt>
            <dd className="text-zinc-400">{entry.openText}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
