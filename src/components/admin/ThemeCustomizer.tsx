"use client";

import type { ThemeTokens } from "@/lib/theme";

const editableFields: Array<{
  key: keyof ThemeTokens;
  label: string;
}> = [
  { key: "primary", label: "Primary Button Color" },
  { key: "accent", label: "Accent Color" },
  { key: "background", label: "Page Background" },
  { key: "surface", label: "Box / Card Color" },
  { key: "text", label: "Main Text Color" },
];

export function ThemeCustomizer({
  tokens,
  onChange,
}: {
  tokens: ThemeTokens;
  onChange: (key: keyof ThemeTokens, value: string) => void;
}) {
  return (
    <details className="rounded-2xl border border-[var(--color-border)] bg-white">
      <summary className="cursor-pointer list-none px-4 py-4">
        <p className="text-base font-semibold text-stone-900">Customize colors</p>
        <p className="mt-1 text-sm text-stone-600">
          Fine-tune a few key colors if you want something closer to your brand.
        </p>
      </summary>

      <div className="grid gap-4 border-t border-[var(--color-border)] px-4 py-4 md:grid-cols-2 xl:grid-cols-3">
        {editableFields.map((field) => (
          <label key={field.key} className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
              {field.label}
            </span>
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3">
              <input
                type="color"
                value={tokens[field.key]}
                onChange={(event) => onChange(field.key, event.target.value)}
                className="h-10 w-14 rounded-xl border-0 bg-transparent p-0"
              />
              <div>
                <p className="text-sm font-semibold text-stone-900">
                  {tokens[field.key]}
                </p>
                <p className="text-xs text-stone-500">Custom override</p>
              </div>
            </div>
          </label>
        ))}
      </div>
    </details>
  );
}
