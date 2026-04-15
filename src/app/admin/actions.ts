"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  parseThemeTokens,
  resolveTheme,
  themeTokensFromLegacyFields,
  themeTokensToLegacyFields,
} from "@/lib/theme-utils";
import { getAdminSitePayload } from "@/lib/queries";
import { requireAdminAccess } from "@/lib/admin-auth";
import { getSupabaseAdminClientOrThrow, isSupabaseConfigured } from "@/lib/supabase";

const PUBLIC_PATHS = ["/", "/menu", "/about", "/contact"];
const BRAND_ASSET_BUCKET = "restaurant-assets";
const BRAND_LOGO_FOLDER = "branding-logos";
const GALLERY_IMAGE_FOLDER = "gallery-images";
const ADMIN_INDEX_PATHS = [
  "/admin",
  "/admin/setup",
  "/admin/branding",
  "/admin/homepage",
  "/admin/menu",
  "/admin/specials",
  "/admin/hours",
  "/admin/photos",
  "/admin/contact",
  "/admin/settings",
];

function timestamp() {
  return new Date().toISOString();
}

function revalidateRestaurantPaths() {
  for (const path of [...PUBLIC_PATHS, ...ADMIN_INDEX_PATHS]) {
    revalidatePath(path);
  }
}

function redirectWithState(
  path: string,
  state: { status?: string; error?: string },
): never {
  const params = new URLSearchParams();

  if (state.status) {
    params.set("status", state.status);
  }

  if (state.error) {
    params.set("error", state.error);
  }

  redirect(params.size > 0 ? `${path}${path.includes("?") ? "&" : "?"}${params.toString()}` : path);
}

function isRedirectSignal(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const maybeDigest = "digest" in error ? error.digest : null;
  return typeof maybeDigest === "string" && maybeDigest.startsWith("NEXT_REDIRECT");
}

function rethrowIfRedirectSignal(error: unknown) {
  if (isRedirectSignal(error)) {
    throw error;
  }
}

function resolveRedirectPath(formData: FormData, defaultPath: string) {
  const value = formData.get("redirect_to");
  const path = typeof value === "string" ? value.trim() : "";

  if (path.startsWith("/admin") && !path.includes("://")) {
    return path;
  }

  return defaultPath;
}

function ensureConfigured(path: string) {
  if (!isSupabaseConfigured()) {
    redirectWithState(path, {
      error:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.",
    });
  }
}

async function getAdminClient(path: string) {
  await requireAdminAccess();
  ensureConfigured(path);
  return getSupabaseAdminClientOrThrow();
}

function readRequiredString(formData: FormData, key: string, label: string) {
  const value = formData.get(key);
  const normalized = typeof value === "string" ? value.trim() : "";

  if (!normalized) {
    throw new Error(`${label} is required.`);
  }

  return normalized;
}

function readOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  const normalized = typeof value === "string" ? value.trim() : "";

  return normalized || null;
}

function readCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function readOptionalFile(formData: FormData, key: string) {
  const value = formData.get(key);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function readSortOrder(formData: FormData, key = "sort_order") {
  const rawValue = formData.get(key);
  const parsed = Number.parseInt(typeof rawValue === "string" ? rawValue : "", 10);

  return Number.isFinite(parsed) ? parsed : 0;
}

function readOptionalPrice(formData: FormData, key: string) {
  const rawValue = formData.get(key);
  const value = typeof rawValue === "string" ? rawValue.trim() : "";

  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error("Price must be a valid positive number.");
  }

  return Number(parsed.toFixed(2));
}

function readRequiredPrice(formData: FormData, key: string) {
  const price = readOptionalPrice(formData, key);

  if (price === null) {
    throw new Error("Price is required.");
  }

  return price;
}

function readTags(formData: FormData, key: string) {
  const value = readOptionalString(formData, key);

  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function readParagraphs(formData: FormData, key: string) {
  const value = readRequiredString(formData, key, "About text");

  return value
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
}

function isUuid(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function sanitizeFileName(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `logo-${Date.now()}`;
}

async function ensureBrandAssetBucket() {
  const client = getSupabaseAdminClientOrThrow();
  const { data: buckets, error: listError } = await client.storage.listBuckets();

  if (listError) {
    throw new Error(listError.message);
  }

  const existingBucket = buckets?.find((bucket) => bucket.name === BRAND_ASSET_BUCKET);

  if (existingBucket) {
    return;
  }

  const { error: createError } = await client.storage.createBucket(BRAND_ASSET_BUCKET, {
    public: true,
    fileSizeLimit: "5MB",
    allowedMimeTypes: [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/svg+xml",
    ],
  });

  if (createError && !createError.message.toLowerCase().includes("already exists")) {
    throw new Error(createError.message);
  }
}

async function uploadLogoFile(file: File, businessName: string) {
  const client = getSupabaseAdminClientOrThrow();

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Logo file must be 5MB or smaller.");
  }

  await ensureBrandAssetBucket();

  const safeBusinessName = slugify(businessName) || "restaurant";
  const safeFileName = sanitizeFileName(file.name);
  const storagePath = `${BRAND_LOGO_FOLDER}/${safeBusinessName}-${Date.now()}-${safeFileName}`;

  const { error: uploadError } = await client.storage
    .from(BRAND_ASSET_BUCKET)
    .upload(storagePath, file, {
      upsert: true,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = client.storage.from(BRAND_ASSET_BUCKET).getPublicUrl(storagePath);

  if (!data?.publicUrl) {
    throw new Error("Logo upload finished, but the public URL could not be created.");
  }

  return data.publicUrl;
}

async function uploadGalleryImageFile(file: File, businessName: string) {
  const client = getSupabaseAdminClientOrThrow();

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Gallery image must be 5MB or smaller.");
  }

  await ensureBrandAssetBucket();

  const safeBusinessName = slugify(businessName) || "restaurant";
  const safeFileName = sanitizeFileName(file.name);
  const storagePath = `${GALLERY_IMAGE_FOLDER}/${safeBusinessName}-${Date.now()}-${safeFileName}`;

  const { error: uploadError } = await client.storage
    .from(BRAND_ASSET_BUCKET)
    .upload(storagePath, file, {
      upsert: true,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = client.storage.from(BRAND_ASSET_BUCKET).getPublicUrl(storagePath);

  if (!data?.publicUrl) {
    throw new Error("Photo upload finished, but the public URL could not be created.");
  }

  return data.publicUrl;
}

function readServiceWindow(formData: FormData) {
  const value = readOptionalString(formData, "service_window");

  if (!value) {
    return "all-day";
  }

  if (
    value === "breakfast" ||
    value === "lunch" ||
    value === "dinner" ||
    value === "all-day"
  ) {
    return value;
  }

  throw new Error("Menu timing must be breakfast, lunch, dinner, or all day.");
}

async function saveRecord({
  table,
  id,
  values,
}: {
  table: string;
  id: string | null;
  values: Record<string, unknown>;
}) {
  const client = getSupabaseAdminClientOrThrow();
  const result = id
    ? await client
        .from(table)
        .update({
          ...values,
          updated_at: timestamp(),
        })
        .eq("id", id)
    : await client.from(table).insert(values);

  if (result.error) {
    throw new Error(result.error.message);
  }
}

async function saveRecordAndReturnId({
  table,
  id,
  values,
}: {
  table: string;
  id: string | null;
  values: Record<string, unknown>;
}) {
  const client = getSupabaseAdminClientOrThrow();

  if (id) {
    const result = await client
      .from(table)
      .update({
        ...values,
        updated_at: timestamp(),
      })
      .eq("id", id)
      .select("id")
      .single();

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data?.id ?? id;
  }

  const result = await client.from(table).insert(values).select("id").single();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data?.id ?? null;
}

async function bootstrapMenuCategory(reference: string) {
  const client = getSupabaseAdminClientOrThrow();
  const payload = await getAdminSitePayload();
  const sourceCategory = payload.menuCategories.find(
    (category) => category.id === reference || category.slug === reference,
  );

  if (!sourceCategory) {
    throw new Error("The selected menu section could not be found.");
  }

  const existingCategoryResult = await client
    .from("menu_categories")
    .select("id, slug")
    .eq("slug", sourceCategory.slug)
    .maybeSingle();

  if (existingCategoryResult.error) {
    throw new Error(existingCategoryResult.error.message);
  }

  let categoryId = existingCategoryResult.data?.id ?? null;

  if (!categoryId) {
    const insertedCategoryResult = await client
      .from("menu_categories")
      .insert({
        name: sourceCategory.name,
        slug: sourceCategory.slug,
        description: sourceCategory.description ?? null,
        service_window: sourceCategory.serviceWindow ?? "all-day",
        is_active: sourceCategory.isActive,
        sort_order: sourceCategory.sortOrder,
      })
      .select("id")
      .single();

    if (insertedCategoryResult.error || !insertedCategoryResult.data) {
      throw new Error(
        insertedCategoryResult.error?.message ??
          "Unable to create the live menu section.",
      );
    }

    categoryId = insertedCategoryResult.data.id;
  }

  const existingItemsResult = await client
    .from("menu_items")
    .select("id, name, sort_order")
    .eq("category_id", categoryId);

  if (existingItemsResult.error) {
    throw new Error(existingItemsResult.error.message);
  }

  const itemIdBySourceId = new Map<string, string>();
  const existingItems = existingItemsResult.data ?? [];

  for (const sourceItem of sourceCategory.items) {
    const existingItem = existingItems.find(
      (item) =>
        item.name === sourceItem.name && item.sort_order === sourceItem.sortOrder,
    );

    if (existingItem) {
      itemIdBySourceId.set(sourceItem.id, existingItem.id);
      continue;
    }

    const insertedItemResult = await client
      .from("menu_items")
      .insert({
        category_id: categoryId,
        name: sourceItem.name,
        description: sourceItem.description,
        price: sourceItem.price,
        tags: sourceItem.tags,
        is_active: sourceItem.isActive,
        is_sold_out: sourceItem.isSoldOut,
        is_featured: sourceItem.isFeatured,
        sort_order: sourceItem.sortOrder,
      })
      .select("id")
      .single();

    if (insertedItemResult.error || !insertedItemResult.data) {
      throw new Error(
        insertedItemResult.error?.message ??
          "Unable to copy the starter menu items into the live menu.",
      );
    }

    itemIdBySourceId.set(sourceItem.id, insertedItemResult.data.id);
  }

  return {
    categoryId,
    itemIdBySourceId,
  };
}

async function resolveMenuCategoryId(reference: string) {
  if (isUuid(reference)) {
    return {
      categoryId: reference,
      itemIdBySourceId: new Map<string, string>(),
    };
  }

  return bootstrapMenuCategory(reference);
}

async function bootstrapGalleryImage(reference: string) {
  const client = getSupabaseAdminClientOrThrow();
  const payload = await getAdminSitePayload();
  const sourceImage = payload.galleryImages.find((image) => image.id === reference);

  if (!sourceImage) {
    throw new Error("The selected photo could not be found.");
  }

  const existingImageResult = await client
    .from("gallery_images")
    .select("id, sort_order, src")
    .eq("sort_order", sourceImage.sortOrder)
    .maybeSingle();

  if (existingImageResult.error) {
    throw new Error(existingImageResult.error.message);
  }

  if (existingImageResult.data?.id) {
    return existingImageResult.data.id;
  }

  const insertedImageResult = await client
    .from("gallery_images")
    .insert({
      src: sourceImage.src,
      alt: sourceImage.alt,
      sort_order: sourceImage.sortOrder,
      is_active: sourceImage.isActive,
    })
    .select("id")
    .single();

  if (insertedImageResult.error || !insertedImageResult.data) {
    throw new Error(
      insertedImageResult.error?.message ??
        "Unable to create the live gallery photo.",
    );
  }

  return insertedImageResult.data.id;
}

async function resolveGalleryImageId(reference: string | null) {
  if (!reference) {
    return null;
  }

  if (isUuid(reference)) {
    return reference;
  }

  return bootstrapGalleryImage(reference);
}

async function deleteRecord({
  table,
  id,
}: {
  table: string;
  id: string;
}) {
  const client = getSupabaseAdminClientOrThrow();
  const result = await client.from(table).delete().eq("id", id);

  if (result.error) {
    throw new Error(result.error.message);
  }
}

async function getBusinessSettingsBase() {
  const payload = await getAdminSitePayload();

  return {
    id: payload.meta.businessSettingsId,
    values: {
      business_name: payload.brand.businessName,
      tagline: payload.brand.tagline,
      logo_url: payload.brand.logoUrl ?? null,
      facebook_url: payload.brand.socialLinks.facebook ?? null,
      instagram_url: payload.brand.socialLinks.instagram ?? null,
      tiktok_url: payload.brand.socialLinks.tiktok ?? null,
      google_business_url: payload.brand.socialLinks.googleBusiness ?? null,
      phone: payload.brand.phone,
      email: payload.brand.email || null,
      address_line_1: payload.brand.addressLine1,
      city: payload.brand.city,
      state: payload.brand.state,
      zip: payload.brand.zip,
      theme_mode: payload.brand.themeMode,
      theme_preset_id: payload.brand.themePresetId,
      theme_tokens: payload.brand.themeTokens,
      background_color: payload.brand.backgroundColor,
      foreground_color: payload.brand.foregroundColor,
      card_color: payload.brand.cardColor,
      muted_section_color: payload.brand.mutedSectionColor,
      highlight_section_color: payload.brand.highlightSectionColor,
      header_background_color: payload.brand.headerBackgroundColor,
      announcement_background_color: payload.brand.announcementBackgroundColor,
      announcement_text_color: payload.brand.announcementTextColor,
      border_color: payload.brand.borderColor,
      primary_color: payload.brand.primaryColor,
      secondary_color: payload.brand.secondaryColor,
      accent_color: payload.brand.accentColor,
      heading_font: payload.brand.headingFont,
      body_font: payload.brand.bodyFont,
      show_breakfast_menu: payload.features.showBreakfastMenu,
      show_lunch_menu: payload.features.showLunchMenu,
      show_dinner_menu: payload.features.showDinnerMenu,
      show_specials: payload.features.showSpecials,
      show_gallery: payload.features.showGallery,
      show_testimonials: payload.features.showTestimonials,
      show_map: payload.features.showMap,
      show_online_ordering: payload.features.showOnlineOrdering,
      show_sticky_mobile_bar: payload.features.showStickyMobileBar,
    },
  };
}

async function getHomepageContentBase() {
  const payload = await getAdminSitePayload();

  return {
    id: payload.meta.homepageContentId,
    values: {
      hero_eyebrow: payload.settings.heroEyebrow,
      hero_headline: payload.settings.heroHeadline,
      hero_subheadline: payload.settings.heroSubheadline,
      hero_primary_cta_label: payload.settings.heroPrimaryCtaLabel,
      hero_primary_cta_href: payload.settings.heroPrimaryCtaHref,
      hero_secondary_cta_label: payload.settings.heroSecondaryCtaLabel,
      hero_secondary_cta_href: payload.settings.heroSecondaryCtaHref,
      hero_image_url: payload.homePage.heroImageUrl ?? null,
      quick_info_hours_label: payload.settings.quickInfoHoursLabel,
      ordering_notice: payload.settings.orderingNotice || null,
      about_title: payload.aboutPage.title,
      about_body: payload.aboutPage.body,
    },
  };
}

async function getAnnouncementBase() {
  const payload = await getAdminSitePayload();

  return {
    id: payload.meta.announcementId,
    values: {
      title: payload.meta.announcementTitle,
      body: payload.settings.announcementText,
      is_active: payload.meta.announcementIsActive,
      sort_order: payload.meta.announcementSortOrder,
    },
  };
}

async function upsertBusinessSettingsPatch(
  patch: Record<string, unknown>,
  path: string,
  successMessage: string,
) {
  try {
    await getAdminClient(path);
    const base = await getBusinessSettingsBase();
    const mergedValues = {
      ...base.values,
      ...patch,
    };
    const optionalLegacyColumns = [
      "header_logo_alignment",
      "theme_mode",
      "theme_preset_id",
      "theme_tokens",
      "background_color",
      "foreground_color",
      "card_color",
      "muted_section_color",
      "highlight_section_color",
      "header_background_color",
      "announcement_background_color",
      "announcement_text_color",
      "border_color",
    ] as const;

    try {
      await saveRecord({
        table: "business_settings",
        id: base.id,
        values: mergedValues,
      });
    } catch (error) {
      let retryError = error;
      const legacyValues: Record<string, unknown> = {
        ...mergedValues,
      };
      let removedAnyLegacyColumns = false;

      while (retryError instanceof Error) {
        const message = retryError.message.toLowerCase();
        const missingLegacyColumns = optionalLegacyColumns.filter(
          (column) =>
            Object.prototype.hasOwnProperty.call(legacyValues, column) &&
            message.includes(column) &&
            message.includes("column"),
        );

        if (missingLegacyColumns.length === 0) {
          break;
        }

        removedAnyLegacyColumns = true;
        for (const column of missingLegacyColumns) {
          delete legacyValues[column];
        }

        try {
          await saveRecord({
            table: "business_settings",
            id: base.id,
            values: legacyValues,
          });

          revalidateRestaurantPaths();
          redirectWithState(path, {
            status:
              "Branding saved. Run the latest schema update to persist the new branding fields on the current Supabase table.",
          });
        } catch (nestedError) {
          retryError = nestedError;
        }
      }

      if (removedAnyLegacyColumns) {
        throw retryError;
      }

      throw error;
    }
    revalidateRestaurantPaths();
    redirectWithState(path, { status: successMessage });
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error: error instanceof Error ? error.message : "Unable to save business details.",
    });
  }
}

async function upsertHomepageContentPatch(
  patch: Record<string, unknown>,
  path: string,
  successMessage: string,
) {
  try {
    await getAdminClient(path);
    const base = await getHomepageContentBase();
    await saveRecord({
      table: "homepage_content",
      id: base.id,
      values: {
        ...base.values,
        ...patch,
      },
    });
    revalidateRestaurantPaths();
    redirectWithState(path, { status: successMessage });
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error:
        error instanceof Error ? error.message : "Unable to save homepage details.",
    });
  }
}

export async function saveSettingsAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/settings");

  return upsertBusinessSettingsPatch(
    {
      business_name: readRequiredString(formData, "business_name", "Business name"),
      tagline: readRequiredString(formData, "tagline", "Tagline"),
      logo_url: readOptionalString(formData, "logo_url"),
      facebook_url: readOptionalString(formData, "facebook_url"),
      instagram_url: readOptionalString(formData, "instagram_url"),
      tiktok_url: readOptionalString(formData, "tiktok_url"),
      google_business_url: readOptionalString(formData, "google_business_url"),
      phone: readRequiredString(formData, "phone", "Phone"),
      email: readOptionalString(formData, "email"),
      address_line_1: readRequiredString(formData, "address_line_1", "Address"),
      city: readRequiredString(formData, "city", "City"),
      state: readRequiredString(formData, "state", "State"),
      zip: readRequiredString(formData, "zip", "ZIP"),
      background_color: readRequiredString(
        formData,
        "background_color",
        "Background color",
      ),
      foreground_color: readRequiredString(
        formData,
        "foreground_color",
        "Text color",
      ),
      card_color: readRequiredString(formData, "card_color", "Box color"),
      muted_section_color: readRequiredString(
        formData,
        "muted_section_color",
        "Alternate section color",
      ),
      highlight_section_color: readRequiredString(
        formData,
        "highlight_section_color",
        "Feature section color",
      ),
      header_background_color: readRequiredString(
        formData,
        "header_background_color",
        "Header bar color",
      ),
      announcement_background_color: readRequiredString(
        formData,
        "announcement_background_color",
        "Announcement bar color",
      ),
      announcement_text_color: readRequiredString(
        formData,
        "announcement_text_color",
        "Announcement text color",
      ),
      border_color: readRequiredString(formData, "border_color", "Border color"),
      primary_color: readRequiredString(formData, "primary_color", "Primary color"),
      secondary_color: readRequiredString(formData, "secondary_color", "Secondary color"),
      accent_color: readRequiredString(formData, "accent_color", "Accent color"),
      heading_font: readRequiredString(formData, "heading_font", "Heading font"),
      body_font: readRequiredString(formData, "body_font", "Body font"),
      show_breakfast_menu: readCheckbox(formData, "show_breakfast_menu"),
      show_lunch_menu: readCheckbox(formData, "show_lunch_menu"),
      show_dinner_menu: readCheckbox(formData, "show_dinner_menu"),
      show_specials: readCheckbox(formData, "show_specials"),
      show_gallery: readCheckbox(formData, "show_gallery"),
      show_testimonials: readCheckbox(formData, "show_testimonials"),
      show_map: readCheckbox(formData, "show_map"),
      show_online_ordering: readCheckbox(formData, "show_online_ordering"),
      show_sticky_mobile_bar: readCheckbox(formData, "show_sticky_mobile_bar"),
    },
    path,
    "Site settings saved.",
  );
}

export async function saveBusinessInfoAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/contact");

  return upsertBusinessSettingsPatch(
    {
      business_name: readRequiredString(formData, "business_name", "Business name"),
      tagline: readRequiredString(formData, "tagline", "Tagline"),
      phone: readRequiredString(formData, "phone", "Phone"),
      email: readOptionalString(formData, "email"),
      address_line_1: readRequiredString(formData, "address_line_1", "Address"),
      city: readRequiredString(formData, "city", "City"),
      state: readRequiredString(formData, "state", "State"),
      zip: readRequiredString(formData, "zip", "ZIP"),
    },
    path,
    "Business details saved.",
  );
}

export async function saveBrandingAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/branding");
  const businessName = readRequiredString(formData, "business_name", "Business name");
  const logoFile = readOptionalFile(formData, "logo_file");
  const themeModeRaw = readOptionalString(formData, "theme_mode");
  const themeMode = themeModeRaw === "custom" ? "custom" : "preset";
  const themePresetId = readOptionalString(formData, "theme_preset_id");
  const parsedThemeTokens = parseThemeTokens(readOptionalString(formData, "theme_tokens"));
  const hasThemeSubmission =
    themeModeRaw !== null || themePresetId !== null || parsedThemeTokens !== null;
  const resolvedTheme = hasThemeSubmission
    ? resolveTheme({
        themeMode,
        themePresetId,
        themeTokens: parsedThemeTokens,
      })
    : resolveTheme({
        themeMode: "custom",
        themePresetId,
        themeTokens: themeTokensFromLegacyFields(
          {
            backgroundColor: readOptionalString(formData, "background_color"),
            foregroundColor: readOptionalString(formData, "foreground_color"),
            cardColor: readOptionalString(formData, "card_color"),
            mutedSectionColor: readOptionalString(formData, "muted_section_color"),
            highlightSectionColor: readOptionalString(
              formData,
              "highlight_section_color",
            ),
            announcementBackgroundColor: readOptionalString(
              formData,
              "announcement_background_color",
            ),
            announcementTextColor: readOptionalString(
              formData,
              "announcement_text_color",
            ),
            borderColor: readOptionalString(formData, "border_color"),
            primaryColor: readOptionalString(formData, "primary_color"),
            accentColor: readOptionalString(formData, "accent_color"),
          },
          themePresetId,
        ),
      });
  const legacyTheme = themeTokensToLegacyFields(resolvedTheme.resolvedColors);
  const savedThemeMode = hasThemeSubmission ? themeMode : "custom";
  const headingFontValue = hasThemeSubmission
    ? `'${resolvedTheme.fonts.heading}', ${resolvedTheme.fonts.headingFallback}`
    : readRequiredString(formData, "heading_font", "Heading font");
  const bodyFontValue = hasThemeSubmission
    ? `'${resolvedTheme.fonts.body}', ${resolvedTheme.fonts.bodyFallback}`
    : readRequiredString(formData, "body_font", "Body font");

  let uploadedLogoUrl: string | null = null;

  if (logoFile) {
    try {
      uploadedLogoUrl = await uploadLogoFile(logoFile, businessName);
    } catch (error) {
      rethrowIfRedirectSignal(error);
      redirectWithState(path, {
        error: error instanceof Error ? error.message : "Unable to upload the logo.",
      });
    }
  }

  return upsertBusinessSettingsPatch(
    {
      business_name: businessName,
      tagline: readRequiredString(formData, "tagline", "Tagline"),
      logo_url: uploadedLogoUrl ?? readOptionalString(formData, "logo_url"),
      header_logo_alignment: "left",
      theme_mode: savedThemeMode,
      theme_preset_id: resolvedTheme.id,
      theme_tokens: resolvedTheme.resolvedColors,
      background_color:
        readOptionalString(formData, "background_color") ??
        legacyTheme.backgroundColor,
      foreground_color:
        readOptionalString(formData, "foreground_color") ??
        legacyTheme.foregroundColor,
      card_color:
        readOptionalString(formData, "card_color") ?? legacyTheme.cardColor,
      muted_section_color:
        readOptionalString(formData, "muted_section_color") ??
        legacyTheme.mutedSectionColor,
      highlight_section_color:
        readOptionalString(formData, "highlight_section_color") ??
        legacyTheme.highlightSectionColor,
      header_background_color:
        readOptionalString(formData, "header_background_color") ??
        legacyTheme.headerBackgroundColor,
      announcement_background_color:
        readOptionalString(formData, "announcement_background_color") ??
        legacyTheme.announcementBackgroundColor,
      announcement_text_color:
        readOptionalString(formData, "announcement_text_color") ??
        legacyTheme.announcementTextColor,
      border_color:
        readOptionalString(formData, "border_color") ?? legacyTheme.borderColor,
      primary_color:
        readOptionalString(formData, "primary_color") ?? legacyTheme.primaryColor,
      secondary_color:
        readOptionalString(formData, "secondary_color") ??
        legacyTheme.secondaryColor,
      accent_color:
        readOptionalString(formData, "accent_color") ?? legacyTheme.accentColor,
      heading_font: headingFontValue,
      body_font: bodyFontValue,
    },
    path,
    uploadedLogoUrl ? "Branding and logo saved." : "Branding saved.",
  );
}

export async function saveContactInfoAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/contact");

  return upsertBusinessSettingsPatch(
    {
      phone: readRequiredString(formData, "phone", "Phone"),
      email: readOptionalString(formData, "email"),
      address_line_1: readRequiredString(formData, "address_line_1", "Address"),
      city: readRequiredString(formData, "city", "City"),
      state: readRequiredString(formData, "state", "State"),
      zip: readRequiredString(formData, "zip", "ZIP"),
      facebook_url: readOptionalString(formData, "facebook_url"),
      instagram_url: readOptionalString(formData, "instagram_url"),
      tiktok_url: readOptionalString(formData, "tiktok_url"),
      google_business_url: readOptionalString(formData, "google_business_url"),
    },
    path,
    "Contact details saved.",
  );
}

export async function saveFeatureSettingsAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/settings");

  return upsertBusinessSettingsPatch(
    {
      show_breakfast_menu: readCheckbox(formData, "show_breakfast_menu"),
      show_lunch_menu: readCheckbox(formData, "show_lunch_menu"),
      show_dinner_menu: readCheckbox(formData, "show_dinner_menu"),
      show_specials: readCheckbox(formData, "show_specials"),
      show_gallery: readCheckbox(formData, "show_gallery"),
      show_testimonials: readCheckbox(formData, "show_testimonials"),
      show_map: readCheckbox(formData, "show_map"),
      show_online_ordering: readCheckbox(formData, "show_online_ordering"),
      show_sticky_mobile_bar: readCheckbox(formData, "show_sticky_mobile_bar"),
    },
    path,
    "Section visibility saved.",
  );
}

export async function saveHomepageContentAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/homepage");

  return upsertHomepageContentPatch(
    {
      hero_eyebrow: readRequiredString(formData, "hero_eyebrow", "Small headline"),
      hero_headline: readRequiredString(formData, "hero_headline", "Main headline"),
      hero_subheadline: readRequiredString(formData, "hero_subheadline", "Hero text"),
      hero_primary_cta_label: readRequiredString(
        formData,
        "hero_primary_cta_label",
        "Main button text",
      ),
      hero_primary_cta_href: readRequiredString(
        formData,
        "hero_primary_cta_href",
        "Main button link",
      ),
      hero_secondary_cta_label: readRequiredString(
        formData,
        "hero_secondary_cta_label",
        "Second button text",
      ),
      hero_secondary_cta_href: readRequiredString(
        formData,
        "hero_secondary_cta_href",
        "Second button link",
      ),
      hero_image_url: readOptionalString(formData, "hero_image_url"),
      quick_info_hours_label: readRequiredString(
        formData,
        "quick_info_hours_label",
        "Quick hours summary",
      ),
      ordering_notice: readOptionalString(formData, "ordering_notice"),
      about_title: readRequiredString(formData, "about_title", "About title"),
      about_body: readParagraphs(formData, "about_body"),
    },
    path,
    "Homepage content saved.",
  );
}

export async function saveQuickHoursAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/hours");

  return upsertHomepageContentPatch(
    {
      quick_info_hours_label: readRequiredString(
        formData,
        "quick_info_hours_label",
        "Quick hours summary",
      ),
    },
    path,
    "Quick hours summary saved.",
  );
}

export async function saveAnnouncementAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/homepage");

  try {
    await getAdminClient(path);
    const base = await getAnnouncementBase();

    await saveRecord({
      table: "announcements",
      id: base.id,
      values: {
        ...base.values,
        title: readRequiredString(formData, "announcement_title", "Announcement title"),
        body: readRequiredString(formData, "announcement_body", "Announcement text"),
        is_active: readCheckbox(formData, "announcement_is_active"),
        sort_order: readSortOrder(formData),
      },
    });

    revalidateRestaurantPaths();
    redirectWithState(path, { status: "Announcement saved." });
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error:
        error instanceof Error ? error.message : "Unable to save announcement.",
    });
  }
}

export async function saveGalleryImageAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/photos");

  try {
    await getAdminClient(path);

    const id = readOptionalString(formData, "gallery_image_id");
    const resolvedImageId = await resolveGalleryImageId(id);
    const photoFile = readOptionalFile(formData, "photo_file");
    const businessName = readRequiredString(
      formData,
      "business_name",
      "Business name",
    );
    let uploadedPhotoUrl: string | null = null;

    if (photoFile) {
      uploadedPhotoUrl = await uploadGalleryImageFile(photoFile, businessName);
    }

    const providedSrc = readOptionalString(formData, "src");
    const finalSrc = uploadedPhotoUrl ?? providedSrc;

    if (!finalSrc) {
      throw new Error("Add a photo URL or upload a photo file.");
    }

    await saveRecord({
      table: "gallery_images",
      id: resolvedImageId,
      values: {
        src: finalSrc,
        alt: readRequiredString(formData, "alt", "Photo description"),
        sort_order: readSortOrder(formData),
        is_active: readCheckbox(formData, "is_active"),
      },
    });

    revalidateRestaurantPaths();
    redirectWithState(path, {
      status: uploadedPhotoUrl ? "Photo uploaded and saved." : "Photo saved.",
    });
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error: error instanceof Error ? error.message : "Unable to save photo.",
    });
  }
}

export async function deleteGalleryImageAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/photos");

  try {
    await getAdminClient(path);

    const id = readRequiredString(formData, "gallery_image_id", "Photo");
    const resolvedImageId = await resolveGalleryImageId(id);

    if (!resolvedImageId) {
      throw new Error("The selected photo could not be found.");
    }

    await deleteRecord({ table: "gallery_images", id: resolvedImageId });

    revalidateRestaurantPaths();
    redirectWithState(path, { status: "Photo deleted." });
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error: error instanceof Error ? error.message : "Unable to delete photo.",
    });
  }
}

export async function saveSpecialAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/specials");

  try {
    await getAdminClient(path);

    const id = readOptionalString(formData, "special_id");

    await saveRecord({
      table: "specials",
      id,
      values: {
        title: readRequiredString(formData, "title", "Special name"),
        description: readRequiredString(formData, "description", "Description"),
        price: readOptionalPrice(formData, "price"),
        label: readRequiredString(formData, "label", "Special label"),
        is_active: readCheckbox(formData, "is_active"),
        is_featured: readCheckbox(formData, "is_featured"),
        sort_order: readSortOrder(formData),
      },
    });

    revalidateRestaurantPaths();
    redirectWithState(path, { status: "Special saved." });
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error: error instanceof Error ? error.message : "Unable to save special.",
    });
  }
}

export async function deleteSpecialAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/specials");

  try {
    await getAdminClient(path);

    const id = readRequiredString(formData, "special_id", "Special");
    await deleteRecord({ table: "specials", id });

    revalidateRestaurantPaths();
    redirectWithState(path, { status: "Special deleted." });
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error: error instanceof Error ? error.message : "Unable to delete special.",
    });
  }
}

export async function saveCategoryAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/menu");

  try {
    await getAdminClient(path);

    const id = readOptionalString(formData, "category_id");
    const name = readRequiredString(formData, "name", "Menu section name");
    const providedSlug = readOptionalString(formData, "slug");
    const slug = slugify(providedSlug ?? name);

    if (!slug) {
      throw new Error("Menu section slug is required.");
    }

    const resolvedCategoryId = id
      ? (await resolveMenuCategoryId(id)).categoryId
      : null;

    const savedCategoryId = await saveRecordAndReturnId({
      table: "menu_categories",
      id: resolvedCategoryId,
      values: {
        name,
        slug,
        description: readOptionalString(formData, "description"),
        service_window: readServiceWindow(formData),
        is_active: readCheckbox(formData, "is_active"),
        sort_order: readSortOrder(formData),
      },
    });

    revalidateRestaurantPaths();
    redirectWithState(
      savedCategoryId ? `/admin/menu?category=${savedCategoryId}` : path,
      { status: "Menu section saved." },
    );
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error:
        error instanceof Error ? error.message : "Unable to save menu section.",
    });
  }
}

export async function deleteCategoryAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/menu");

  try {
    await getAdminClient(path);

    const id = readRequiredString(formData, "category_id", "Menu section");

    if (!isUuid(id)) {
      throw new Error(
        "This section is still using starter data. Save it live before deleting it.",
      );
    }

    await deleteRecord({ table: "menu_categories", id });

    revalidateRestaurantPaths();
    redirectWithState(path, { status: "Menu section deleted." });
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error:
        error instanceof Error ? error.message : "Unable to delete menu section.",
    });
  }
}

export async function saveMenuItemAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/menu");

  try {
    await getAdminClient(path);

    const id = readOptionalString(formData, "menu_item_id");
    const categoryReference = readRequiredString(
      formData,
      "category_id",
      "Menu section",
    );
    const { categoryId, itemIdBySourceId } = await resolveMenuCategoryId(
      categoryReference,
    );
    const resolvedItemId =
      id && !isUuid(id) ? itemIdBySourceId.get(id) ?? null : id;

    const savedItemId = await saveRecordAndReturnId({
      table: "menu_items",
      id: resolvedItemId,
      values: {
        category_id: categoryId,
        name: readRequiredString(formData, "name", "Item name"),
        description: readRequiredString(formData, "description", "Item description"),
        price: readRequiredPrice(formData, "price"),
        tags: readTags(formData, "tags"),
        is_active: readCheckbox(formData, "is_active"),
        is_sold_out: readCheckbox(formData, "is_sold_out"),
        is_featured: readCheckbox(formData, "is_featured"),
        sort_order: readSortOrder(formData),
      },
    });

    revalidateRestaurantPaths();
    redirectWithState(
      savedItemId
        ? `/admin/menu?category=${categoryId}&item=${savedItemId}`
        : path,
      { status: "Menu item saved." },
    );
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error: error instanceof Error ? error.message : "Unable to save menu item.",
    });
  }
}

export async function deleteMenuItemAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/menu");

  try {
    await getAdminClient(path);

    const itemId = readRequiredString(formData, "menu_item_id", "Menu item");
    const categoryReference = readRequiredString(
      formData,
      "category_id",
      "Menu section",
    );
    const { itemIdBySourceId } = await resolveMenuCategoryId(categoryReference);
    const resolvedItemId =
      isUuid(itemId) ? itemId : itemIdBySourceId.get(itemId) ?? null;

    if (!resolvedItemId) {
      throw new Error("The selected menu item could not be found.");
    }

    await deleteRecord({ table: "menu_items", id: resolvedItemId });

    revalidateRestaurantPaths();
    redirectWithState(path, { status: "Menu item deleted." });
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error: error instanceof Error ? error.message : "Unable to delete menu item.",
    });
  }
}

export async function saveHourAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/hours");

  try {
    await getAdminClient(path);

    const id = readOptionalString(formData, "hour_id");

    await saveRecord({
      table: "business_hours",
      id,
      values: {
        day_label: readRequiredString(formData, "day_label", "Day"),
        open_text: readRequiredString(formData, "open_text", "Open hours"),
        sort_order: readSortOrder(formData),
        is_active: readCheckbox(formData, "is_active"),
      },
    });

    revalidateRestaurantPaths();
    redirectWithState(path, { status: "Hours saved." });
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error: error instanceof Error ? error.message : "Unable to save hours.",
    });
  }
}

export async function deleteHourAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/hours");

  try {
    await getAdminClient(path);

    const id = readRequiredString(formData, "hour_id", "Hours row");
    await deleteRecord({ table: "business_hours", id });

    revalidateRestaurantPaths();
    redirectWithState(path, { status: "Hours row deleted." });
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error: error instanceof Error ? error.message : "Unable to delete hours row.",
    });
  }
}

export async function saveSetupHoursAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/setup?step=3");

  try {
    await getAdminClient(path);

    const client = getSupabaseAdminClientOrThrow();
    const days = formData.getAll("day_label");
    const hours = formData.getAll("open_text");

    const rows = days.map((dayValue, index) => {
      const dayLabel =
        typeof dayValue === "string" && dayValue.trim()
          ? dayValue.trim()
          : `Day ${index + 1}`;
      const openTextRaw = hours[index];
      const openText =
        typeof openTextRaw === "string" && openTextRaw.trim()
          ? openTextRaw.trim()
          : "Closed";

      return {
        day_label: dayLabel,
        open_text: openText,
        sort_order: index + 1,
        is_active: true,
      };
    });

    const deleteResult = await client.from("business_hours").delete().neq("id", "");

    if (deleteResult.error) {
      throw new Error(deleteResult.error.message);
    }

    if (rows.length > 0) {
      const insertResult = await client.from("business_hours").insert(rows);

      if (insertResult.error) {
        throw new Error(insertResult.error.message);
      }
    }

    const quickSummary = readRequiredString(
      formData,
      "quick_info_hours_label",
      "Quick hours summary",
    );

    const homepageBase = await getHomepageContentBase();
    await saveRecord({
      table: "homepage_content",
      id: homepageBase.id,
      values: {
        ...homepageBase.values,
        quick_info_hours_label: quickSummary,
      },
    });

    revalidateRestaurantPaths();
    redirectWithState(path, { status: "Hours saved. Continue when you're ready." });
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error: error instanceof Error ? error.message : "Unable to save setup hours.",
    });
  }
}

export async function saveSetupMenuAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/setup?step=4");

  try {
    await getAdminClient(path);

    const categoryName = readRequiredString(formData, "name", "Menu section name");
    const categorySlug = slugify(readOptionalString(formData, "slug") ?? categoryName);

    const client = getSupabaseAdminClientOrThrow();
    const insertCategoryResult = await client
      .from("menu_categories")
      .insert({
        name: categoryName,
        slug: categorySlug,
        description: readOptionalString(formData, "description"),
        service_window: readServiceWindow(formData),
        is_active: true,
        sort_order: readSortOrder(formData),
      })
      .select("id")
      .single();

    if (insertCategoryResult.error || !insertCategoryResult.data) {
      throw new Error(insertCategoryResult.error?.message ?? "Unable to create menu section.");
    }

    const itemName = readOptionalString(formData, "item_name");
    const itemPrice = readOptionalPrice(formData, "item_price");

    if (itemName && itemPrice !== null) {
      const insertItemResult = await client.from("menu_items").insert({
        category_id: insertCategoryResult.data.id,
        name: itemName,
        description: readOptionalString(formData, "item_description") ?? "",
        price: itemPrice,
        tags: readTags(formData, "item_tags"),
        is_active: true,
        is_sold_out: false,
        is_featured: readCheckbox(formData, "item_is_featured"),
        sort_order: 1,
      });

      if (insertItemResult.error) {
        throw new Error(insertItemResult.error.message);
      }
    }

    revalidateRestaurantPaths();
    redirectWithState(path, { status: "Starter menu section saved." });
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error:
        error instanceof Error ? error.message : "Unable to save starter menu section.",
    });
  }
}

export async function saveSetupSpecialsAction(formData: FormData) {
  const path = resolveRedirectPath(formData, "/admin/setup?step=5");

  try {
    await getAdminClient(path);

    const announcementBase = await getAnnouncementBase();
    await saveRecord({
      table: "announcements",
      id: announcementBase.id,
      values: {
        ...announcementBase.values,
        title: readRequiredString(formData, "announcement_title", "Announcement title"),
        body: readRequiredString(formData, "announcement_body", "Announcement text"),
        is_active: readCheckbox(formData, "announcement_is_active"),
        sort_order: 0,
      },
    });

    await saveRecord({
      table: "specials",
      id: null,
      values: {
        title: readRequiredString(formData, "title", "Special name"),
        description: readRequiredString(formData, "description", "Description"),
        price: readOptionalPrice(formData, "price"),
        label: readRequiredString(formData, "label", "Special label"),
        is_active: true,
        is_featured: true,
        sort_order: 1,
      },
    });

    revalidateRestaurantPaths();
    redirectWithState(path, { status: "Announcement and featured special saved." });
  } catch (error) {
    rethrowIfRedirectSignal(error);
    redirectWithState(path, {
      error:
        error instanceof Error
          ? error.message
          : "Unable to save setup special and announcement.",
    });
  }
}
