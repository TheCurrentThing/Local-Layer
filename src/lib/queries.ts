import { unstable_noStore as noStore } from "next/cache";
import { seedSitePayload } from "@/lib/seed";
import { getThemePresetById } from "@/lib/theme";
import { isDeletedMenuSectionDescription } from "@/lib/menu-tombstones";
import {
  parseThemeTokens,
  resolveTheme,
  themeTokensFromLegacyFields,
  themeTokensToLegacyFields,
} from "@/lib/theme-utils";
import { createSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import type {
  AboutPageContent,
  BrandConfig,
  BusinessHour,
  FeatureFlags,
  GalleryImage,
  HomePageContent,
  LogoAlignment,
  SitePayload,
  SiteSettings,
} from "@/types/site";
import type { BusinessSpecial, MenuCategory } from "@/types/menu";

type BusinessSettingsRow = {
  id: string;
  business_name: string;
  tagline: string;
  logo_url: string | null;
  header_logo_alignment?: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  google_business_url: string | null;
  phone: string;
  email: string | null;
  address_line_1: string;
  city: string;
  state: string;
  zip: string;
  theme_mode?: string | null;
  theme_preset_id?: string | null;
  theme_tokens?: unknown;
  background_color?: string | null;
  foreground_color?: string | null;
  card_color?: string | null;
  muted_section_color?: string | null;
  highlight_section_color?: string | null;
  header_background_color?: string | null;
  announcement_background_color?: string | null;
  announcement_text_color?: string | null;
  border_color?: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  heading_font: string;
  body_font: string;
  show_breakfast_menu: boolean;
  show_lunch_menu: boolean;
  show_dinner_menu: boolean;
  show_specials: boolean;
  show_gallery: boolean;
  show_testimonials: boolean;
  show_map: boolean;
  show_online_ordering: boolean;
  show_sticky_mobile_bar: boolean;
};

type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  is_active: boolean;
  sort_order: number;
};

type HomepageContentRow = {
  id: string;
  hero_eyebrow: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_primary_cta_label: string;
  hero_primary_cta_href: string;
  hero_secondary_cta_label: string;
  hero_secondary_cta_href: string;
  hero_image_url: string | null;
  quick_info_hours_label: string;
  ordering_notice: string | null;
  about_title: string | null;
  about_body: string[] | null;
};

type BusinessHoursRow = {
  id: string;
  day_label: string;
  open_text: string;
  sort_order: number;
  is_active: boolean;
};

type SpecialsRow = {
  id: string;
  title: string;
  description: string;
  price: number | null;
  label: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
};

type MenuCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  service_window: "breakfast" | "lunch" | "dinner" | "all-day" | null;
  is_active: boolean;
  sort_order: number;
};

type MenuItemRow = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  tags: string[] | null;
  is_active: boolean;
  is_sold_out: boolean;
  is_featured: boolean;
  sort_order: number;
};

type GalleryImageRow = {
  id: string;
  src: string;
  alt: string;
  sort_order: number;
  is_active: boolean;
};

type SiteRows = {
  settingsRow: BusinessSettingsRow | null;
  announcementsRows: AnnouncementRow[];
  homepageRow: HomepageContentRow | null;
  hoursRows: BusinessHoursRow[];
  specialsRows: SpecialsRow[];
  categoriesRows: MenuCategoryRow[];
  itemsRows: MenuItemRow[];
  galleryRows: GalleryImageRow[];
};

export interface AdminSitePayload extends SitePayload {
  meta: {
    businessSettingsId: string | null;
    homepageContentId: string | null;
    announcementId: string | null;
    announcementTitle: string;
    announcementBody: string;
    announcementSortOrder: number;
    announcementIsActive: boolean;
  };
}

function normalizeLogoAlignment(value: string | null | undefined): LogoAlignment {
  return value === "left" ? "left" : "center";
}

function mapBrand(settingsRow: BusinessSettingsRow | null): BrandConfig {
  if (!settingsRow) {
    return seedSitePayload.brand;
  }

  const themeMode = settingsRow.theme_mode === "custom" ? "custom" : "preset";
  const themePresetId =
    settingsRow.theme_preset_id ?? seedSitePayload.brand.themePresetId;
  const parsedThemeTokens = parseThemeTokens(settingsRow.theme_tokens);
  const resolvedTheme = resolveTheme({
    themeMode,
    themePresetId,
    themeTokens:
      parsedThemeTokens ??
      themeTokensFromLegacyFields(
        {
          backgroundColor: settingsRow.background_color,
          foregroundColor: settingsRow.foreground_color,
          cardColor: settingsRow.card_color,
          mutedSectionColor: settingsRow.muted_section_color,
          highlightSectionColor: settingsRow.highlight_section_color,
          announcementBackgroundColor: settingsRow.announcement_background_color,
          announcementTextColor: settingsRow.announcement_text_color,
          borderColor: settingsRow.border_color,
          primaryColor: settingsRow.primary_color,
          accentColor: settingsRow.accent_color,
        },
        themePresetId,
      ),
  });
  const legacyColors = themeTokensToLegacyFields(resolvedTheme.resolvedColors);
  const presetFonts = getThemePresetById(themePresetId).fonts;

  return {
    businessName: settingsRow.business_name,
    tagline: settingsRow.tagline,
    logoText: settingsRow.business_name,
    logoUrl: settingsRow.logo_url ?? undefined,
    logoAlignment: normalizeLogoAlignment(settingsRow.header_logo_alignment),
    email: settingsRow.email ?? "",
    phone: settingsRow.phone,
    addressLine1: settingsRow.address_line_1,
    city: settingsRow.city,
    state: settingsRow.state,
    zip: settingsRow.zip,
    socialLinks: {
      facebook: settingsRow.facebook_url ?? undefined,
      instagram: settingsRow.instagram_url ?? undefined,
      tiktok: settingsRow.tiktok_url ?? undefined,
      googleBusiness: settingsRow.google_business_url ?? undefined,
    },
    themeMode,
    themePresetId,
    themeTokens: resolvedTheme.resolvedColors,
    backgroundColor: settingsRow.background_color ?? legacyColors.backgroundColor,
    foregroundColor: settingsRow.foreground_color ?? legacyColors.foregroundColor,
    cardColor: settingsRow.card_color ?? legacyColors.cardColor,
    mutedSectionColor:
      settingsRow.muted_section_color ?? legacyColors.mutedSectionColor,
    highlightSectionColor:
      settingsRow.highlight_section_color ?? legacyColors.highlightSectionColor,
    headerBackgroundColor:
      settingsRow.header_background_color ?? legacyColors.headerBackgroundColor,
    announcementBackgroundColor:
      settingsRow.announcement_background_color ??
      legacyColors.announcementBackgroundColor,
    announcementTextColor:
      settingsRow.announcement_text_color ?? legacyColors.announcementTextColor,
    borderColor: settingsRow.border_color ?? legacyColors.borderColor,
    primaryColor: settingsRow.primary_color ?? legacyColors.primaryColor,
    secondaryColor: settingsRow.secondary_color ?? legacyColors.secondaryColor,
    accentColor: settingsRow.accent_color ?? legacyColors.accentColor,
    headingFont:
      settingsRow.heading_font ??
      `'${presetFonts.heading}', ${presetFonts.headingFallback}`,
    bodyFont:
      settingsRow.body_font ?? `'${presetFonts.body}', ${presetFonts.bodyFallback}`,
  };
}

function mapFeatures(settingsRow: BusinessSettingsRow | null): FeatureFlags {
  if (!settingsRow) {
    return seedSitePayload.features;
  }

  return {
    showBreakfastMenu: settingsRow.show_breakfast_menu,
    showLunchMenu: settingsRow.show_lunch_menu,
    showDinnerMenu: settingsRow.show_dinner_menu,
    showSpecials: settingsRow.show_specials,
    showGallery: settingsRow.show_gallery,
    showTestimonials: settingsRow.show_testimonials,
    showMap: settingsRow.show_map,
    showOnlineOrdering: settingsRow.show_online_ordering,
    showStickyMobileBar: settingsRow.show_sticky_mobile_bar,
  };
}

function mapSettings(
  homepageRow: HomepageContentRow | null,
  announcementRow: AnnouncementRow | null,
  hasAnnouncementRows: boolean,
): SiteSettings {
  return {
    announcementText:
      announcementRow?.body ??
      (hasAnnouncementRows ? "" : seedSitePayload.settings.announcementText),
    heroEyebrow:
      homepageRow?.hero_eyebrow ?? seedSitePayload.settings.heroEyebrow,
    heroHeadline:
      homepageRow?.hero_headline ?? seedSitePayload.settings.heroHeadline,
    heroSubheadline:
      homepageRow?.hero_subheadline ?? seedSitePayload.settings.heroSubheadline,
    heroPrimaryCtaLabel:
      homepageRow?.hero_primary_cta_label ??
      seedSitePayload.settings.heroPrimaryCtaLabel,
    heroPrimaryCtaHref:
      homepageRow?.hero_primary_cta_href ??
      seedSitePayload.settings.heroPrimaryCtaHref,
    heroSecondaryCtaLabel:
      homepageRow?.hero_secondary_cta_label ??
      seedSitePayload.settings.heroSecondaryCtaLabel,
    heroSecondaryCtaHref:
      homepageRow?.hero_secondary_cta_href ??
      seedSitePayload.settings.heroSecondaryCtaHref,
    quickInfoHoursLabel:
      homepageRow?.quick_info_hours_label ??
      seedSitePayload.settings.quickInfoHoursLabel,
    orderingNotice:
      homepageRow?.ordering_notice ?? seedSitePayload.settings.orderingNotice,
  };
}

function mapHomepage(homepageRow: HomepageContentRow | null): HomePageContent {
  return {
    heroImageUrl:
      homepageRow?.hero_image_url ?? seedSitePayload.homePage.heroImageUrl,
    specialsIntro: seedSitePayload.homePage.specialsIntro,
    featuredMenuTitle: seedSitePayload.homePage.featuredMenuTitle,
    featuredMenuIntro: seedSitePayload.homePage.featuredMenuIntro,
  };
}

function mapAbout(homepageRow: HomepageContentRow | null): AboutPageContent {
  return {
    title: homepageRow?.about_title ?? seedSitePayload.aboutPage.title,
    body:
      Array.isArray(homepageRow?.about_body) && homepageRow.about_body.length > 0
        ? homepageRow.about_body
        : seedSitePayload.aboutPage.body,
  };
}

function mapHours(hoursRows: BusinessHoursRow[] | null): BusinessHour[] {
  if (!hoursRows || hoursRows.length === 0) {
    return seedSitePayload.hours;
  }

  return hoursRows.map((row) => ({
    id: row.id,
    dayLabel: row.day_label,
    openText: row.open_text,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  }));
}

function mapSpecials(rows: SpecialsRow[] | null): BusinessSpecial[] {
  if (!rows || rows.length === 0) {
    return seedSitePayload.specials;
  }

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    label: row.label,
    isActive: row.is_active,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
  }));
}

function mapMenu(
  categoryRows: MenuCategoryRow[] | null,
  itemRows: MenuItemRow[] | null,
): MenuCategory[] {
  if (!categoryRows || categoryRows.length === 0) {
    return seedSitePayload.menuCategories;
  }

  const deletedSeedSlugs = new Set(
    categoryRows
      .filter((category) => isDeletedMenuSectionDescription(category.description))
      .map((category) => category.slug),
  );

  const itemsByCategory = new Map<string, MenuItemRow[]>();
  for (const item of itemRows ?? []) {
    const existing = itemsByCategory.get(item.category_id) ?? [];
    existing.push(item);
    itemsByCategory.set(item.category_id, existing);
  }

  const liveCategories = categoryRows
    .filter((category) => !isDeletedMenuSectionDescription(category.description))
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? undefined,
      serviceWindow: category.service_window ?? "all-day",
      isActive: category.is_active,
      sortOrder: category.sort_order,
      items: (itemsByCategory.get(category.id) ?? [])
        .sort((left, right) => left.sort_order - right.sort_order)
        .map((item) => ({
          id: item.id,
          categoryId: item.category_id,
          name: item.name,
          description: item.description,
          price: item.price,
          tags: item.tags ?? [],
          isActive: item.is_active,
          isSoldOut: item.is_sold_out,
          isFeatured: item.is_featured,
          sortOrder: item.sort_order,
          optionGroups: [],
        })),
    }));

  const liveSlugs = new Set(liveCategories.map((category) => category.slug));
  const fallbackCategories = seedSitePayload.menuCategories.filter(
    (category) =>
      !liveSlugs.has(category.slug) && !deletedSeedSlugs.has(category.slug),
  );

  return [...liveCategories, ...fallbackCategories].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );
}

function mapGallery(rows: GalleryImageRow[] | null): GalleryImage[] {
  if (!rows || rows.length === 0) {
    return seedSitePayload.galleryImages;
  }

  const liveImages = rows.map((row) => ({
    id: row.id,
    src: row.src,
    alt: row.alt,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  }));

  const liveSortOrders = new Set(liveImages.map((image) => image.sortOrder));
  const fallbackImages = seedSitePayload.galleryImages.filter(
    (image) => !liveSortOrders.has(image.sortOrder),
  );

  return [...liveImages, ...fallbackImages].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );
}

function pickPublicAnnouncement(rows: AnnouncementRow[]) {
  return rows.find((row) => row.is_active) ?? null;
}

function pickAdminAnnouncement(rows: AnnouncementRow[]) {
  return rows.find((row) => row.is_active) ?? rows[0] ?? null;
}

function filterPayloadForPublic(payload: SitePayload): SitePayload {
  const serviceWindowAllowed = (serviceWindow?: MenuCategory["serviceWindow"]) => {
    if (serviceWindow === "breakfast" && !payload.features.showBreakfastMenu) {
      return false;
    }
    if (serviceWindow === "lunch" && !payload.features.showLunchMenu) {
      return false;
    }
    if (serviceWindow === "dinner" && !payload.features.showDinnerMenu) {
      return false;
    }

    return true;
  };

  return {
    ...payload,
    hours: payload.hours.filter((entry) => entry.isActive),
    menuCategories: payload.menuCategories
      .filter((category) => category.isActive)
      .filter((category) => serviceWindowAllowed(category.serviceWindow))
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => item.isActive),
      })),
    specials: payload.features.showSpecials
      ? payload.specials.filter((entry) => entry.isActive)
      : [],
    galleryImages: payload.features.showGallery
      ? payload.galleryImages.filter((entry) => entry.isActive)
      : [],
    testimonials: payload.features.showTestimonials ? payload.testimonials : [],
  };
}

async function fetchSiteRows(): Promise<SiteRows | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const client = createSupabaseAdminClient();
  if (!client) {
    return null;
  }

  const [
    settingsResult,
    announcementsResult,
    homepageResult,
    hoursResult,
    specialsResult,
    categoriesResult,
    itemsResult,
    galleryResult,
  ] = await Promise.all([
    client
      .from("business_settings")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle<BusinessSettingsRow>(),
    client
      .from("announcements")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .returns<AnnouncementRow[]>(),
    client
      .from("homepage_content")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle<HomepageContentRow>(),
    client
      .from("business_hours")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<BusinessHoursRow[]>(),
    client
      .from("specials")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<SpecialsRow[]>(),
    client
      .from("menu_categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<MenuCategoryRow[]>(),
    client
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<MenuItemRow[]>(),
    client
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .returns<GalleryImageRow[]>(),
  ]);

  return {
    settingsRow: settingsResult.data ?? null,
    announcementsRows: announcementsResult.data ?? [],
    homepageRow: homepageResult.data ?? null,
    hoursRows: hoursResult.data ?? [],
    specialsRows: specialsResult.data ?? [],
    categoriesRows: categoriesResult.data ?? [],
    itemsRows: itemsResult.data ?? [],
    galleryRows: galleryResult.data ?? [],
  };
}

async function loadPayload(): Promise<AdminSitePayload> {
  noStore();

  const rows = await fetchSiteRows();
  const adminAnnouncement = rows
    ? pickAdminAnnouncement(rows.announcementsRows)
    : null;
  const publicAnnouncement = rows
    ? pickPublicAnnouncement(rows.announcementsRows)
    : null;

  const payload: AdminSitePayload = {
    brand: mapBrand(rows?.settingsRow ?? null),
    features: mapFeatures(rows?.settingsRow ?? null),
    settings: mapSettings(
      rows?.homepageRow ?? null,
      publicAnnouncement,
      Boolean(rows && rows.announcementsRows.length > 0),
    ),
    hours: mapHours(rows?.hoursRows ?? null),
    homePage: mapHomepage(rows?.homepageRow ?? null),
    aboutPage: mapAbout(rows?.homepageRow ?? null),
    specials: mapSpecials(rows?.specialsRows ?? null),
    menuCategories: mapMenu(rows?.categoriesRows ?? null, rows?.itemsRows ?? null),
    galleryImages: mapGallery(rows?.galleryRows ?? null),
    testimonials: seedSitePayload.testimonials,
    meta: {
      businessSettingsId: rows?.settingsRow?.id ?? null,
      homepageContentId: rows?.homepageRow?.id ?? null,
      announcementId: adminAnnouncement?.id ?? null,
      announcementTitle: adminAnnouncement?.title ?? "Site announcement",
      announcementBody:
        adminAnnouncement?.body ??
        (rows?.announcementsRows.length ? "" : seedSitePayload.settings.announcementText),
      announcementSortOrder: adminAnnouncement?.sort_order ?? 0,
      announcementIsActive: adminAnnouncement?.is_active ?? true,
    },
  };

  return payload;
}

export async function getAdminSitePayload(): Promise<AdminSitePayload> {
  return loadPayload();
}

export async function getSitePayload(): Promise<SitePayload> {
  const payload = await loadPayload();
  return filterPayloadForPublic(payload);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const payload = await getSitePayload();
  return payload.settings;
}

export async function getBusinessHours(): Promise<BusinessHour[]> {
  const payload = await getSitePayload();
  return payload.hours.sort((left, right) => left.sortOrder - right.sortOrder);
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const payload = await getSitePayload();
  return payload.homePage;
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  const payload = await getSitePayload();
  return payload.aboutPage;
}

export async function getSpecials(): Promise<BusinessSpecial[]> {
  const payload = await getSitePayload();
  return payload.specials.sort((left, right) => left.sortOrder - right.sortOrder);
}

export async function getMenuCategories(): Promise<MenuCategory[]> {
  const payload = await getSitePayload();
  return payload.menuCategories.sort((left, right) => left.sortOrder - right.sortOrder);
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const payload = await getSitePayload();
  return payload.galleryImages.sort((left, right) => left.sortOrder - right.sortOrder);
}
