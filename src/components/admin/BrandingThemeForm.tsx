"use client";

import { useMemo, useState } from "react";
import { SaveButton } from "@/components/admin/FormPrimitives";
import { ThemeCustomizer } from "@/components/admin/ThemeCustomizer";
import { ThemePresetPicker } from "@/components/admin/ThemePresetPicker";
import { ThemePreviewCard } from "@/components/admin/ThemePreviewCard";
import { getThemePresetById, type ThemePreset, type ThemeTokens } from "@/lib/theme";
import { resolveTheme } from "@/lib/theme-utils";

export function BrandingThemeForm({
  initialBrand,
}: {
  initialBrand: {
    businessName: string;
    tagline: string;
    logoUrl?: string;
    themeMode: "preset" | "custom";
    themePresetId: string | null;
    themeTokens: ThemeTokens;
  };
}) {
  const initialPreset = getThemePresetById(initialBrand.themePresetId);
  const [businessName, setBusinessName] = useState(initialBrand.businessName);
  const [tagline, setTagline] = useState(initialBrand.tagline);
  const [selectedPreset, setSelectedPreset] = useState<ThemePreset>(initialPreset);
  const [themeMode, setThemeMode] = useState<"preset" | "custom">(
    initialBrand.themeMode,
  );
  const [themeTokens, setThemeTokens] = useState<ThemeTokens>(initialBrand.themeTokens);

  const resolvedTheme = useMemo(
    () =>
      resolveTheme({
        themeMode,
        themePresetId: selectedPreset.id,
        themeTokens,
      }),
    [selectedPreset.id, themeMode, themeTokens],
  );

  function handlePresetSelect(preset: ThemePreset) {
    setSelectedPreset(preset);
    setThemeMode("preset");
    setThemeTokens(preset.colors);
  }

  function handleCustomColorChange(key: keyof ThemeTokens, value: string) {
    setThemeMode("custom");
    setThemeTokens((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetToPreset() {
    setThemeMode("preset");
    setThemeTokens(selectedPreset.colors);
  }

  function resetToSaved() {
    setSelectedPreset(getThemePresetById(initialBrand.themePresetId));
    setBusinessName(initialBrand.businessName);
    setTagline(initialBrand.tagline);
    setThemeMode(initialBrand.themeMode);
    setThemeTokens(initialBrand.themeTokens);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Business Name
          </span>
          <input
            name="business_name"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            required
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[var(--brand-primary)]"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Tagline
          </span>
          <input
            name="tagline"
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
            required
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[var(--brand-primary)]"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Logo Image URL
          </span>
          <input
            name="logo_url"
            defaultValue={initialBrand.logoUrl ?? ""}
            placeholder="https://..."
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[var(--brand-primary)]"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Upload Logo
          </span>
          <input
            name="logo_file"
            type="file"
            accept=".png,.jpg,.jpeg,.webp,.svg"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-stone-700 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-[var(--brand-primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
        </label>
      </div>

      <input type="hidden" name="theme_mode" value={themeMode} />
      <input type="hidden" name="theme_preset_id" value={selectedPreset.id} />
      <input
        type="hidden"
        name="theme_tokens"
        value={JSON.stringify(resolvedTheme.resolvedColors)}
      />

      <ThemePresetPicker
        selectedPresetId={selectedPreset.id}
        onSelect={handlePresetSelect}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ThemePreviewCard
          businessName={businessName}
          tagline={tagline}
          preset={selectedPreset}
          tokens={resolvedTheme.resolvedColors}
        />
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-stone-900">
                  Current selection
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  {selectedPreset.name} {themeMode === "custom" ? "with custom edits" : ""}
                </p>
              </div>
              <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary-text)]">
                {themeMode === "custom" ? "Custom" : "Preset"}
              </span>
            </div>
            <p className="mt-3 text-sm text-stone-600">
              {selectedPreset.shortDescription}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedPreset.recommendedFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] text-stone-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <ThemeCustomizer
            tokens={resolvedTheme.resolvedColors}
            onChange={handleCustomColorChange}
          />

          <div className="flex flex-wrap gap-3">
            <SaveButton label="Save Theme" />
            <button
              type="button"
              onClick={resetToPreset}
              className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-button-secondary-bg)] px-5 py-3 text-sm font-semibold text-[var(--color-button-secondary-text)] transition hover:opacity-95"
            >
              Reset to Preset
            </button>
            <button
              type="button"
              onClick={resetToSaved}
              className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Cancel Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
