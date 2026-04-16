import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FeaturedMenuSection } from "@/components/sections/FeaturedMenuSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { MenuPreviewSection } from "@/components/sections/MenuPreviewSection";
import { QuickInfoBar } from "@/components/sections/QuickInfoBar";
import { SpecialsSection } from "@/components/sections/SpecialsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { LocalBusinessJsonLd } from "@/components/layout/LocalBusinessJsonLd";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { StickyMobileBar } from "@/components/layout/StickyMobileBar";
import { buildBrandCssVariables } from "@/lib/brand";
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
      headingFont: `'${presetFonts.heading}', ${presetFonts.headingFallback}`,
      bodyFont: `'${presetFonts.body}', ${presetFonts.bodyFallback}`,
    };
  } catch {
    return payload.brand;
  }
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const payload = await getSitePayload();
  const previewBrand = applyBrandPreview(payload, getPreviewParam(searchParams));

  return (
    <div className="min-h-screen pb-24 md:pb-0" style={buildBrandCssVariables(previewBrand)}>
      <LocalBusinessJsonLd brand={previewBrand} hours={payload.hours} />
      <div className="sticky top-0 z-50">
        <AnnouncementBar settings={payload.settings} />
        <SiteHeader brand={previewBrand} />
      </div>
      <main>
        <HeroSection
          brand={previewBrand}
          settings={payload.settings}
          homePage={payload.homePage}
        />
        <QuickInfoBar
          brand={previewBrand}
          settings={payload.settings}
          hours={payload.hours}
        />
        {payload.features.showSpecials ? (
          <SpecialsSection
            specials={payload.specials}
            intro={payload.homePage.specialsIntro}
          />
        ) : null}
        <FeaturedMenuSection
          categories={payload.menuCategories}
          title={payload.homePage.featuredMenuTitle}
          intro={payload.homePage.featuredMenuIntro}
        />
        <MenuPreviewSection categories={payload.menuCategories} />
        <AboutSection about={payload.aboutPage} />
        {payload.features.showGallery ? (
          <GallerySection images={payload.galleryImages} />
        ) : null}
        {payload.features.showTestimonials ? (
          <TestimonialsSection testimonials={payload.testimonials} />
        ) : null}
        <ContactSection
          brand={previewBrand}
          hours={payload.hours}
          features={payload.features}
        />
      </main>
      <SiteFooter brand={previewBrand} hours={payload.hours} />
      <StickyMobileBar brand={previewBrand} features={payload.features} />
    </div>
  );
}
