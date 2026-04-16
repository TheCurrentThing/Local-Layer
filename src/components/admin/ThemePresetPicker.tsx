"use client";

import {
  fontPackToFontStacks,
  getFontVariableClassNamesForPack,
} from "@/lib/font-registry";
import { cn } from "@/lib/utils";
import { THEME_PRESETS, type ThemePreset } from "@/lib/theme";

type ThemePresetPickerProps = {
  selectedPresetId?: string | null;
  onSelect: (preset: ThemePreset) => void;
  className?: string;
  mode?: "default" | "workspace";
};

function ThemeSwatchStrip({ preset }: { preset: ThemePreset }) {
  const swatches = [
    preset.colors.background,
    preset.colors.surface,
    preset.colors.highlight,
    preset.colors.primary,
    preset.colors.accent,
  ];
  return (
    <div className="flex overflow-hidden rounded-full border border-white/[0.06]">
      {swatches.map((color, i) => (
        <div key={i} className="h-2 flex-1" style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}

// ── Compact row used in workspace sidebar ──────────────────────────────────
function ThemeRow({
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
        "group flex w-full items-center gap-3 rounded-[8px] border-l-2 px-2.5 py-2.5 text-left transition",
        selected
          ? "border-[var(--color-primary)] bg-white/[0.045]"
          : "border-transparent hover:bg-white/[0.025]",
      )}
    >
      {/* Swatch */}
      <div
        className="h-8 w-8 shrink-0 overflow-hidden rounded-[6px]"
        style={{
          background: preset.colors.background,
          border: `1.5px solid ${preset.colors.primary}55`,
        }}
      >
        <div
          className="mt-auto h-2.5 w-full"
          style={{
            marginTop: "calc(100% - 10px)",
            background: `linear-gradient(to right, ${preset.colors.primary}cc, ${preset.colors.primary}55)`,
          }}
        />
      </div>

      {/* Label */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-[12.5px] leading-tight transition",
            selected ? "font-medium text-white/85" : "font-normal text-white/48 group-hover:text-white/65",
          )}
        >
          {preset.name}
        </p>
        <p className="mt-0.5 truncate text-[10px] text-white/28">{preset.fonts.label}</p>
      </div>

      {selected && (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="shrink-0 text-[var(--color-primary)]" aria-hidden="true">
          <path d="M2 5.5L4.5 8L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

// ── Full card used on the standalone theme selection page ──────────────────
function ThemePresetCard({
  preset,
  selected,
  onClick,
}: {
  preset: ThemePreset;
  selected: boolean;
  onClick: () => void;
}) {
  const fontClassNames = getFontVariableClassNamesForPack(preset.fonts);
  const fontStacks = fontPackToFontStacks(preset.fonts);

  return (
    <button
      type="button"
      onClick={onClick}
      data-font-preview={preset.id}
      className={cn(
        fontClassNames,
        "group relative w-full rounded-[10px] border p-4 text-left transition",
        selected
          ? "border-[var(--color-primary)] bg-white/[0.05] shadow-[0_0_0_1px_var(--color-primary)]"
          : "border-white/[0.07] bg-white/[0.015] hover:border-white/[0.11] hover:bg-white/[0.03]",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white/85">{preset.name}</span>
            {selected && (
              <span className="inline-flex rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[var(--color-primary-text)]">
                Active
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs leading-5 text-white/38">{preset.shortDescription}</p>
        </div>
      </div>

      <div className="mb-3">
        <ThemeSwatchStrip preset={preset} />
      </div>

      <div
        className="mb-3 rounded-[8px] border p-3"
        style={{
          backgroundColor: preset.colors.surface,
          borderColor: preset.colors.border,
          color: preset.colors.text,
        }}
      >
        <div className="text-base leading-tight" style={{ fontFamily: fontStacks.heading }}>
          Hometown Cooking
        </div>
        <div className="mt-1 text-xs" style={{ color: preset.colors.mutedText, fontFamily: fontStacks.body }}>
          Fresh meals, clear prices.
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <span
            className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: preset.colors.primary, color: preset.colors.primaryText }}
          >
            View Menu
          </span>
          <span
            className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
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

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/28">Font Pairing</p>
          <p className="mt-0.5 text-xs text-white/52">{preset.fonts.label}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          {preset.recommendedFor.slice(0, 2).map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2 py-0.5 text-[10px] text-white/40"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

function ThemePresetCompactCard({
  preset,
  onClick,
}: {
  preset: ThemePreset;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-[10px] border border-white/[0.06] bg-white/[0.015] p-3 text-left transition hover:border-white/[0.1] hover:bg-white/[0.03]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white/75">{preset.name}</p>
          <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-white/35">{preset.shortDescription}</p>
        </div>
        <span className="shrink-0 rounded-full border border-white/[0.07] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/30 transition group-hover:text-white/50">
          Try
        </span>
      </div>
      <div className="mt-2.5">
        <ThemeSwatchStrip preset={preset} />
      </div>
    </button>
  );
}

export function ThemePresetPicker({
  selectedPresetId,
  onSelect,
  className,
  mode = "default",
}: ThemePresetPickerProps) {
  const activePreset =
    THEME_PRESETS.find((p) => p.id === selectedPresetId) ?? THEME_PRESETS[0];

  // ── Workspace mode: compact Anima-style swatch list ───────────────────────
  if (mode === "workspace") {
    return (
      <div className={cn("flex flex-col gap-0.5", className)}>
        <p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-white/28">
          Select Theme
        </p>
        {THEME_PRESETS.map((preset) => (
          <ThemeRow
            key={preset.id}
            preset={preset}
            selected={preset.id === selectedPresetId}
            onClick={() => onSelect(preset)}
          />
        ))}
      </div>
    );
  }

  // ── Default mode: full card layout (used on setup / standalone pages) ─────
  const otherPresets = THEME_PRESETS.filter((p) => p.id !== activePreset.id);

  return (
    <section className={cn("space-y-6", className)}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          Style Library
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white">
          One direction leads. The rest stay in reserve.
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/52">
          The selected theme stays large and central. Alternatives are kept smaller
          so the page feels like choosing a brand direction, not browsing a marketplace.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div>
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
            Active Theme
          </p>
          <ThemePresetCard preset={activePreset} selected onClick={() => onSelect(activePreset)} />
        </div>
        <div>
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
            Other Directions
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {otherPresets.map((preset) => (
              <ThemePresetCompactCard key={preset.id} preset={preset} onClick={() => onSelect(preset)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ThemePresetPicker;
