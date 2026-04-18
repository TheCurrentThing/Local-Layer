export const dynamic = "force-dynamic";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { StickyMobileBar } from "@/components/layout/StickyMobileBar";
import { SiteRenderer } from "@/renderers/SiteRenderer";
import { buildBrandCssVariables } from "@/lib/brand";
import {
  fontPackToFontStacks,
  getBrandFontVariableClassNames,
} from "@/lib/font-registry";
import { getSitePayload } from "@/lib/queries";
import { getThemePresetById, type ThemeTokens } from "@/lib/theme";
import { parseThemeTokens, resolveTheme, themeTokensToLegacyFields } from "@/lib/theme-utils";
import type { BrandConfig, SitePayload } from "@/types/site";

type PreviewPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getPreviewParam(
  searchParams?: Record<string, string | string[] | undefined>,
) {
  const raw = searchParams?.brand_preview;
  return Array.isArray(raw) ? raw[0] : raw;
}

function applyBrandPreview(
  payload: SitePayload,
  encodedPreview?: string,
): BrandConfig {
  if (!encodedPreview) {
    return payload.brand;
  }

  try {
    const preview = JSON.parse(
      decodeURIComponent(encodedPreview),
    ) as Partial<{
      businessName: string;
      tagline: string;
      themeMode: "preset" | "custom";
      themePresetId: string;
      themeTokens: ThemeTokens | string;
    }>;

    const parsedThemeTokens = parseThemeTokens(preview.themeTokens);
    const resolvedTheme = resolveTheme({
      themeMode: preview.themeMode,
      themePresetId: preview.themePresetId ?? payload.brand.themePresetId,
      themeTokens: parsedThemeTokens ?? payload.brand.themeTokens,
    });
    const presetFonts = getThemePresetById(resolvedTheme.id).fonts;
    const fontStacks = fontPackToFontStacks(presetFonts);
    const legacyColors = themeTokensToLegacyFields(resolvedTheme.resolvedColors);

    return {
      ...payload.brand,
      businessName: preview.businessName?.trim() || payload.brand.businessName,
      tagline: preview.tagline?.trim() || payload.brand.tagline,
      logoText: preview.businessName?.trim() || payload.brand.logoText,
      themeMode: preview.themeMode ?? payload.brand.themeMode,
      themePresetId: resolvedTheme.id,
      themeTokens: resolvedTheme.resolvedColors,
      backgroundColor: legacyColors.backgroundColor,
      foregroundColor: legacyColors.foregroundColor,
      cardColor: legacyColors.cardColor,
      mutedSectionColor: legacyColors.mutedSectionColor,
      highlightSectionColor: legacyColors.highlightSectionColor,
      headerBackgroundColor: legacyColors.headerBackgroundColor,
      announcementBackgroundColor: legacyColors.announcementBackgroundColor,
      announcementTextColor: legacyColors.announcementTextColor,
      borderColor: legacyColors.borderColor,
      primaryColor: legacyColors.primaryColor,
      secondaryColor: legacyColors.secondaryColor,
      accentColor: legacyColors.accentColor,
      headingFont: fontStacks.heading,
      bodyFont: fontStacks.body,
    };
  } catch {
    return payload.brand;
  }
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const payload = await getSitePayload();
  const previewBrand = applyBrandPreview(payload, getPreviewParam(searchParams));
  const previewFontClassNames = getBrandFontVariableClassNames(
    previewBrand,
    getThemePresetById(previewBrand.themePresetId).fonts,
  );

  // Merge the brand override into a preview-only payload so the renderer
  // sees the correct brand without needing a separate prop.
  const previewPayload: SitePayload = { ...payload, brand: previewBrand };

  return (
    <div
      className={`${previewFontClassNames} min-h-screen pb-24 md:pb-0`}
      style={buildBrandCssVariables(previewBrand)}
    >
      <div className="sticky top-0 z-50">
        <AnnouncementBar settings={payload.settings} />
        <SiteHeader brand={previewBrand} basePath="/preview" />
      </div>
      <main>
        <SiteRenderer payload={previewPayload} basePath="/preview" />
      </main>
      <SiteFooter brand={previewBrand} hours={payload.hours} />
      <StickyMobileBar brand={previewBrand} features={payload.features} basePath="/preview" />
    </div>
  );
}
