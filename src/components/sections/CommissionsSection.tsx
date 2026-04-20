// Commission request for artists / makers. Contact-driven CTA stub.

import type { SitePayload } from "@/types/site";

export function CommissionsSection({ payload }: { payload: SitePayload }) {
  const email = payload.brand.email;
  const phone = payload.brand.phone;

  return (
    <section
      id="commissions"
      data-section="commissions"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-amber-500/10 via-zinc-950 to-zinc-950 p-8 md:p-12">
        <p className="font-serif text-xs italic text-amber-400">
          Open for commissions
        </p>
        <h2 className="mt-2 font-serif text-3xl font-medium text-white md:text-4xl">
          Commission a piece
        </h2>
        <p className="mt-3 max-w-xl text-zinc-400">
          Every commission is a collaboration. Reach out to discuss your vision, timeline, and pricing.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          {email && (
            <a
              href={`mailto:${email}`}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-100"
            >
              Get in touch
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone.replace(/\D/g, "")}`}
              className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 hover:border-zinc-500"
            >
              {phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
