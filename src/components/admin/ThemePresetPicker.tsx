"use client";

import { cn } from "@/lib/utils";
import { THEME_PRESETS, type ThemePreset } from "@/lib/theme";

type ThemePresetPickerProps = {
  selectedPresetId?: string | null;
  onSelect: (preset: ThemePreset) => void;
  className?: string;
};

function ThemeSwatchStrip({ preset }: { preset: ThemePreset }) {
  const swatches = [
    preset.colors.background,
    preset.colors.surface,
    preset.colors.primary,
    preset.colors.accent,
    preset.colors.text,
  ];

  return (
    <div className="flex overflow-hidden rounded-full border border-[var(--color-border)]">
      {swatches.map((color, index) => (
        <div
          key={`${preset.id}-${index}`}
          className="h-3 flex-1"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

function ThemePresetCard({
  preset,
  selected,
  onClick,
}: {
  preset: ThemePreset;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition-all",
        "hover:-translate-y-0.5 hover:shadow-md",
        selected
          ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]"
          : "border-stone-200 hover:border-stone-300",
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-stone-900">
              {preset.name}
            </span>
            {selected ? (
              <span className="inline-flex rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-primary-text)]">
                Current
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            {preset.shortDescription}
          </p>
        </div>

        <div className="rounded-full bg-stone-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500 transition-colors group-hover:bg-stone-200">
          Style
        </div>
      </div>

      <div className="mb-4">
        <ThemeSwatchStrip preset={preset} />
      </div>

      <div
        className="mb-4 rounded-xl border p-3"
        style={{
          backgroundColor: preset.colors.surface,
          borderColor: preset.colors.border,
          color: preset.colors.text,
        }}
      >
        <div
          className="text-lg leading-tight"
          style={{
            fontFamily: `'${preset.fonts.heading}', ${preset.fonts.headingFallback}`,
          }}
        >
          Hometown Cooking
        </div>
        <div
          className="mt-1 text-sm"
          style={{
            color: preset.colors.mutedText,
            fontFamily: `'${preset.fonts.body}', ${preset.fonts.bodyFallback}`,
          }}
        >
          Fresh meals, clear prices, easy updates.
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span
            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: preset.colors.primary,
              color: preset.colors.primaryText,
            }}
          >
            View Menu
          </span>
          <span
            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: preset.colors.buttonSecondaryBg,
              color: preset.colors.buttonSecondaryText,
              border: `1px solid ${preset.colors.border}`,
            }}
          >
            Call Now
          </span>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
          Font Pairing
        </p>
        <p className="mt-1 text-xs text-stone-600">{preset.fonts.label}</p>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
          Best For
        </p>
        <div className="flex flex-wrap gap-2">
          {preset.recommendedFor.map((item) => (
            <span
              key={`${preset.id}-${item}`}
              className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] text-stone-600"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

export function ThemePresetPicker({
  selectedPresetId,
  onSelect,
  className,
}: ThemePresetPickerProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div>
        <h2 className="text-lg font-semibold text-stone-900">
          Choose a color style
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Pick a look that fits your restaurant. You can fine-tune colors after
          you choose a style.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {THEME_PRESETS.map((preset) => (
          <ThemePresetCard
            key={preset.id}
            preset={preset}
            selected={preset.id === selectedPresetId}
            onClick={() => onSelect(preset)}
          />
        ))}
      </div>
    </section>
  );
}

export default ThemePresetPicker;
