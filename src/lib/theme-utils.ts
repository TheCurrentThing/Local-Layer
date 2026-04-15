import type { CSSProperties } from "react";
import {
  DEFAULT_THEME_PRESET_ID,
  type FontPack,
  type ThemePreset,
  type ThemeTokens,
  getThemePresetById,
} from "@/lib/theme";

export type SavedThemeSettings = {
  themeMode?: "preset" | "custom";
  themePresetId?: string | null;
  themeTokens?: Partial<ThemeTokens> | null;
};

function isHexColor(value: string | null | undefined) {
  return Boolean(value && /^#([0-9a-f]{6}|[0-9a-f]{3})$/i.test(value));
}

function expandHex(value: string) {
  if (value.length === 4) {
    const [, r, g, b] = value;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return value.toLowerCase();
}

function hexToRgb(value: string) {
  const normalized = expandHex(value).replace("#", "");
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function getReadableTextColor(background: string, light = "#FFFFFF", dark = "#2F241F") {
  if (!isHexColor(background)) {
    return light;
  }

  const { r, g, b } = hexToRgb(background);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? dark : light;
}

function normalizeColor(value: string | null | undefined, fallback: string) {
  if (!value) {
    return fallback;
  }

  return isHexColor(value) ? expandHex(value) : value;
}

export function resolveTheme(
  settings?: SavedThemeSettings,
): ThemePreset & { resolvedColors: ThemeTokens } {
  const preset = getThemePresetById(
    settings?.themePresetId ?? DEFAULT_THEME_PRESET_ID,
  );

  const resolvedColors: ThemeTokens = {
    ...preset.colors,
    ...(settings?.themeTokens ?? {}),
  };

  return {
    ...preset,
    resolvedColors,
  };
}

export function fontPackToFontStacks(fonts: FontPack) {
  return {
    heading: `'${fonts.heading}', ${fonts.headingFallback}`,
    body: `'${fonts.body}', ${fonts.bodyFallback}`,
  };
}

export function buildThemeCssVars(
  tokens: ThemeTokens,
  fonts: FontPack,
): CSSProperties {
  return {
    "--color-background": tokens.background,
    "--color-surface": tokens.surface,
    "--color-surface-alt": tokens.surfaceAlt,
    "--color-text": tokens.text,
    "--color-muted-text": tokens.mutedText,
    "--color-primary": tokens.primary,
    "--color-primary-text": tokens.primaryText,
    "--color-accent": tokens.accent,
    "--color-accent-text": tokens.accentText,
    "--color-border": tokens.border,
    "--color-highlight": tokens.highlight,
    "--color-announcement-bg": tokens.announcementBg,
    "--color-announcement-text": tokens.announcementText,
    "--color-button-secondary-bg": tokens.buttonSecondaryBg,
    "--color-button-secondary-text": tokens.buttonSecondaryText,
    "--color-foreground": tokens.text,
    "--color-card": tokens.surface,
    "--color-muted": tokens.surfaceAlt,
    "--color-header-background": tokens.surfaceAlt,
    "--color-announcement-background": tokens.announcementBg,
    "--color-announcement-foreground": tokens.announcementText,
    "--brand-primary": tokens.primary,
    "--brand-secondary": tokens.primary,
    "--brand-accent": tokens.accent,
    "--font-heading": `'${fonts.heading}', ${fonts.headingFallback}`,
    "--font-body": `'${fonts.body}', ${fonts.bodyFallback}`,
  } as CSSProperties;
}

export function themeTokensToLegacyFields(tokens: ThemeTokens) {
  return {
    backgroundColor: tokens.background,
    foregroundColor: tokens.text,
    cardColor: tokens.surface,
    mutedSectionColor: tokens.surfaceAlt,
    highlightSectionColor: tokens.highlight,
    headerBackgroundColor: tokens.surfaceAlt,
    announcementBackgroundColor: tokens.announcementBg,
    announcementTextColor: tokens.announcementText,
    borderColor: tokens.border,
    primaryColor: tokens.primary,
    secondaryColor: tokens.primary,
    accentColor: tokens.accent,
  };
}

export function themeTokensFromLegacyFields(
  legacy: Partial<{
    backgroundColor: string | null;
    foregroundColor: string | null;
    cardColor: string | null;
    mutedSectionColor: string | null;
    highlightSectionColor: string | null;
    announcementBackgroundColor: string | null;
    announcementTextColor: string | null;
    borderColor: string | null;
    primaryColor: string | null;
    accentColor: string | null;
  }>,
  presetId?: string | null,
): ThemeTokens {
  const preset = getThemePresetById(presetId);

  return {
    background: normalizeColor(legacy.backgroundColor, preset.colors.background),
    surface: normalizeColor(legacy.cardColor, preset.colors.surface),
    surfaceAlt: normalizeColor(
      legacy.mutedSectionColor,
      preset.colors.surfaceAlt,
    ),
    text: normalizeColor(legacy.foregroundColor, preset.colors.text),
    mutedText: preset.colors.mutedText,
    primary: normalizeColor(legacy.primaryColor, preset.colors.primary),
    primaryText: preset.colors.primaryText,
    accent: normalizeColor(legacy.accentColor, preset.colors.accent),
    accentText: preset.colors.accentText,
    border: normalizeColor(legacy.borderColor, preset.colors.border),
    highlight: normalizeColor(
      legacy.highlightSectionColor,
      preset.colors.highlight,
    ),
    announcementBg: normalizeColor(
      legacy.announcementBackgroundColor,
      preset.colors.announcementBg,
    ),
    announcementText: normalizeColor(
      legacy.announcementTextColor,
      preset.colors.announcementText,
    ),
    buttonSecondaryBg: normalizeColor(
      legacy.mutedSectionColor,
      preset.colors.buttonSecondaryBg,
    ),
    buttonSecondaryText: normalizeColor(
      legacy.announcementTextColor,
      getReadableTextColor(
        normalizeColor(legacy.mutedSectionColor, preset.colors.buttonSecondaryBg),
      ),
    ),
  };
}

export function parseThemeTokens(value: unknown): Partial<ThemeTokens> | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    try {
      return parseThemeTokens(JSON.parse(value));
    } catch {
      return null;
    }
  }

  if (typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<Record<keyof ThemeTokens, unknown>>;

  const keys: Array<keyof ThemeTokens> = [
    "background",
    "surface",
    "surfaceAlt",
    "text",
    "mutedText",
    "primary",
    "primaryText",
    "accent",
    "accentText",
    "border",
    "highlight",
    "announcementBg",
    "announcementText",
    "buttonSecondaryBg",
    "buttonSecondaryText",
  ];

  const result: Partial<ThemeTokens> = {};

  for (const key of keys) {
    if (typeof candidate[key] === "string") {
      result[key] = candidate[key] as string;
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}
