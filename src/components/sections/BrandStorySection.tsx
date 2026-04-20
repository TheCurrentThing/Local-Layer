// Brand narrative section. Pulls from aboutPage content.

import type { SitePayload } from "@/types/site";

export function BrandStorySection({ payload }: { payload: SitePayload }) {
  const { title, body } = payload.aboutPage;
  if (!title && (!body || body.length === 0)) return null;

  return (
    <section
      data-section="brand_story"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
          The story
        </p>
        {title && (
          <h2 className="mt-2 font-serif text-3xl font-medium text-white md:text-4xl">
            {title}
          </h2>
        )}
        {body?.map((para, i) => (
          <p key={i} className="mt-4 text-base leading-relaxed text-zinc-400">
            {para}
          </p>
        ))}
      </div>
    </section>
  );
}
