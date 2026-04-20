// Appointment booking CTA. Stub — booking flow not yet wired.

import type { SitePayload } from "@/types/site";

export function BookingSection({ payload }: { payload: SitePayload }) {
  const phone = payload.brand.phone;

  return (
    <section
      id="booking"
      data-section="booking"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
          Book now
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          Schedule an appointment
        </h2>
        <p className="mt-3 max-w-xl text-zinc-400">
          Reserve your spot — online booking coming soon. Call or email us to schedule today.
        </p>
        {phone && (
          <a
            href={`tel:${phone.replace(/\D/g, "")}`}
            className="mt-6 inline-block rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-400"
          >
            Call to book — {phone}
          </a>
        )}
      </div>
    </section>
  );
}
