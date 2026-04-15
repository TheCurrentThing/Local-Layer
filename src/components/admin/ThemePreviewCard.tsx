"use client";

import { buildThemeCssVars } from "@/lib/theme-utils";
import type { ThemePreset, ThemeTokens } from "@/lib/theme";

export function ThemePreviewCard({
  businessName,
  tagline,
  preset,
  tokens,
}: {
  businessName: string;
  tagline: string;
  preset: ThemePreset;
  tokens: ThemeTokens;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold text-stone-900">Live preview</h3>
        <p className="mt-1 text-sm text-stone-600">
          Preview before saving. This updates instantly as you switch styles.
        </p>
      </div>

      <div
        className="overflow-hidden rounded-[1.75rem] border shadow-sm"
        style={buildThemeCssVars(tokens, preset.fonts)}
      >
        <div className="border-b border-[var(--color-border)] bg-[var(--color-announcement-bg)] px-5 py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-announcement-text)]">
          Friday fish special all day
        </div>

        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p
                className="text-2xl leading-none text-[var(--color-text)]"
                style={{
                  fontFamily: `'${preset.fonts.heading}', ${preset.fonts.headingFallback}`,
                }}
              >
                {businessName}
              </p>
              <p
                className="mt-1 text-sm text-[var(--color-muted-text)]"
                style={{
                  fontFamily: `'${preset.fonts.body}', ${preset.fonts.bodyFallback}`,
                }}
              >
                {tagline}
              </p>
            </div>
            <div className="hidden gap-2 sm:flex">
              <span className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-text)]">
                View Menu
              </span>
              <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-button-secondary-bg)] px-4 py-2 text-sm font-semibold text-[var(--color-button-secondary-text)]">
                Call Now
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-background)] px-5 py-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                Hometown Dining
              </p>
              <h4
                className="mt-3 text-4xl leading-none text-[var(--color-text)]"
                style={{
                  fontFamily: `'${preset.fonts.heading}', ${preset.fonts.headingFallback}`,
                }}
              >
                Fresh meals that feel right for the neighborhood.
              </h4>
              <p
                className="mt-4 max-w-xl text-sm leading-6 text-[var(--color-muted-text)]"
                style={{
                  fontFamily: `'${preset.fonts.body}', ${preset.fonts.bodyFallback}`,
                }}
              >
                Quick specials, easy menu browsing, and simple owner updates.
              </p>
            </div>

            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                Today&apos;s Special
              </p>
              <p
                className="mt-2 text-2xl text-[var(--color-text)]"
                style={{
                  fontFamily: `'${preset.fonts.heading}', ${preset.fonts.headingFallback}`,
                }}
              >
                Country Fried Steak
              </p>
              <p className="mt-2 text-sm text-[var(--color-muted-text)]">
                Served with mashed potatoes and gravy.
              </p>
              <div className="mt-4 inline-flex rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-text)]">
                Available until sold out
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {["Address", "Phone", "Hours"].map((label, index) => (
              <div
                key={label}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                  {label}
                </p>
                <p className="mt-2 text-sm text-[var(--color-text)]">
                  {index === 0
                    ? "108 N Chestnut St"
                    : index === 1
                      ? "(618) 867-3175"
                      : "Tue-Sun 5:30 AM - 3:00 PM"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
