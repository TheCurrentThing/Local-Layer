// Quote / estimate request CTA. Stub — form submission not yet wired.

import type { SitePayload } from "@/types/site";

export function QuoteRequestSection({ payload }: { payload: SitePayload }) {
  const phone = payload.brand.phone;
  const email = payload.brand.email;

  return (
    <section
      id="quote_request"
      data-section="quote_request"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
          Get started
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          Request a free quote
        </h2>
        <p className="mt-3 max-w-xl text-zinc-400">
          Tell us about your project and we&apos;ll get back to you within one business day.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          {phone && (
            <a
              href={`tel:${phone.replace(/\D/g, "")}`}
              className="rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-400"
            >
              Call {phone}
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 hover:border-zinc-500"
            >
              Email us
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
