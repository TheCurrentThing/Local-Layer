"use client";

import type { ThemeTokens } from "@/lib/theme";

const editableFields: Array<{
  key: keyof ThemeTokens;
  label: string;
}> = [
  { key: "primary", label: "Primary Button" },
  { key: "accent", label: "Accent Color" },
  { key: "background", label: "Page Background" },
  { key: "surface", label: "Card / Box Color" },
  { key: "text", label: "Main Text" },
];

export function ThemeCustomizer({
  tokens,
  onChange,
}: {
  tokens: ThemeTokens;
  onChange: (key: keyof ThemeTokens, value: string) => void;
}) {
  return (
    <details className="rounded-[1rem] border border-white/[0.07] bg-white/[0.015]">
      <summary className="cursor-pointer list-none px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
              Fine Tune
            </p>
            <p className="mt-1 text-sm font-semibold text-white/70">Customize colors</p>
          </div>
          <span className="shrink-0 rounded-full border border-white/[0.07] px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
            Advanced
          </span>
        </div>
      </summary>

      <div className="grid gap-3 border-t border-white/[0.06] px-4 py-4 md:grid-cols-2">
        {editableFields.map((field) => (
          <label key={field.key} className="block space-y-1.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
              {field.label}
            </span>
            <div className="flex items-center gap-3 rounded-[0.85rem] border border-white/[0.08] bg-black/20 px-3 py-2.5">
              <input
                type="color"
                value={tokens[field.key]}
                onChange={(event) => onChange(field.key, event.target.value)}
                className="h-8 w-10 shrink-0 rounded-lg border-0 bg-transparent p-0"
              />
              <div className="min-w-0">
                <p className="truncate font-mono text-xs font-semibold text-white/75">
                  {tokens[field.key]}
                </p>
                <p className="text-[10px] text-white/35">Override</p>
              </div>
            </div>
          </label>
        ))}
      </div>
    </details>
  );
}
