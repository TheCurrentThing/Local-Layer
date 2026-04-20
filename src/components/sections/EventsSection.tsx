// Upcoming events listing. Returns null when no events data.

import type { SitePayload } from "@/types/site";

export function EventsSection({ payload }: { payload: SitePayload }) {
  const events = (payload.events ?? []).filter((e) => e.isActive !== false);
  if (events.length === 0) return null;

  return (
    <section
      data-section="events"
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
          Events
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          Coming up
        </h2>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <article
            key={event.id}
            className="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
          >
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white">{event.title}</h3>
              {event.location && (
                <p className="mt-1 text-sm text-zinc-400">{event.location}</p>
              )}
              {event.description && (
                <p className="mt-2 text-sm text-zinc-500">{event.description}</p>
              )}
            </div>
            {event.startsAt && (
              <time
                dateTime={event.startsAt}
                className="shrink-0 text-xs text-zinc-500"
              >
                {new Date(event.startsAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </time>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
