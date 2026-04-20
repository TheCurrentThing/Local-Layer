// Build the SitePayload the renderer consumes on the Branding preview stage.
//
// Layering (highest wins):
//   1. Branding draft — businessName, tagline, logoUrl, theme selection
//      (the fields the user is actively editing on the Branding page)
//   2. Real published payload — everything else the business has saved
//      (menu, products, services, gallery, testimonials, events, hours, socials)
//   3. Category seed — fills ONLY arrays the target family/category needs when
//      the real payload left them empty, so a brand-new draft isn't hollow
//
// Seeds never merge into non-empty real arrays. A business with three saved
// products shows their three products — not a seeded fourth.

import type { SitePayload, BrandConfig } from "@/types/site";
import type { KitCategory, KitFamily } from "@/types/kit";
import type { ThemeTokens } from "@/lib/theme";
import { getCategorySeed } from "./preview-seeds";

export type BrandingDraft = {
  businessName?: string;
  tagline?: string;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  heroEyebrow?: string | null;
  // Theme selection from the left-rail preset picker
  themeMode?: "preset" | "custom";
  themePresetId?: string;
  themeTokens?: ThemeTokens;
};

export type BuildPreviewPayloadArgs = {
  realPayload: SitePayload;
  brandingDraft?: BrandingDraft;
  family: KitFamily;
  category: KitCategory;
};

const isNonEmpty = <T>(arr: T[] | undefined | null): arr is T[] =>
  Array.isArray(arr) && arr.length > 0;

export function buildPreviewPayload(
  args: BuildPreviewPayloadArgs,
): SitePayload {
  const { realPayload, brandingDraft, family, category } = args;
  const seed = getCategorySeed(family, category);

  // Start from the real payload so theme, settings, hours, socials, SEO, etc.
  // all flow through untouched.
  const out: SitePayload = { ...realPayload };

  // Layer branding draft fields onto brand and content sub-objects.
  // Only overwrite when the draft provides a defined value; undefined = leave alone.
  if (brandingDraft) {
    const brandPatch: Partial<BrandConfig> = {};
    if (brandingDraft.businessName !== undefined) {
      brandPatch.businessName = brandingDraft.businessName;
      brandPatch.logoText = brandingDraft.businessName;
    }
    if (brandingDraft.tagline !== undefined) {
      brandPatch.tagline = brandingDraft.tagline;
    }
    if (brandingDraft.logoUrl !== undefined) {
      brandPatch.logoUrl = brandingDraft.logoUrl ?? undefined;
    }
    // Apply theme selection so the in-panel preview reflects the current preset/color choice.
    if (brandingDraft.themeMode !== undefined) {
      brandPatch.themeMode = brandingDraft.themeMode;
    }
    if (brandingDraft.themePresetId !== undefined) {
      brandPatch.themePresetId = brandingDraft.themePresetId;
    }
    if (brandingDraft.themeTokens !== undefined) {
      brandPatch.themeTokens = brandingDraft.themeTokens;
    }
    if (Object.keys(brandPatch).length > 0) {
      out.brand = { ...out.brand, ...brandPatch };
    }

    if (brandingDraft.heroImageUrl !== undefined) {
      out.homePage = {
        ...out.homePage,
        heroImageUrl: brandingDraft.heroImageUrl ?? undefined,
      };
    }
    if (brandingDraft.heroEyebrow != null) {
      out.settings = {
        ...out.settings,
        heroEyebrow: brandingDraft.heroEyebrow,
      };
    }
  }

  // Seed only the arrays the category needs AND the real payload left empty.
  if (seed.serviceOfferings && !isNonEmpty(out.serviceOfferings))
    out.serviceOfferings = seed.serviceOfferings;
  if (seed.serviceAreas && !isNonEmpty(out.serviceAreas))
    out.serviceAreas = seed.serviceAreas;
  if (seed.products && !isNonEmpty(out.products))
    out.products = seed.products;
  if (seed.collections && !isNonEmpty(out.collections))
    out.collections = seed.collections;
  if (seed.galleryImages && !isNonEmpty(out.galleryImages))
    out.galleryImages = seed.galleryImages;
  if (seed.events && !isNonEmpty(out.events))
    out.events = seed.events;
  if (seed.testimonials && !isNonEmpty(out.testimonials))
    out.testimonials = seed.testimonials;
  if (seed.menuCategories && !isNonEmpty(out.menuCategories))
    out.menuCategories = seed.menuCategories;
  if (seed.specials && !isNonEmpty(out.specials))
    out.specials = seed.specials;

  return out;
}
