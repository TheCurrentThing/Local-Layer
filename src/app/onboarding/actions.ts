"use server";

import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { seedSitePayload } from "@/lib/seed";
import { KITS, KitType } from "./kits";

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "my-business"
  );
}

function getAdminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function signUpOnboardingAction(
  email: string,
  password: string
): Promise<{ error?: string }> {
  const db = getAdminDb();
  if (!db) return { error: "Service not configured." };

  // Create user with email pre-confirmed — no verification flow needed
  const { error: createError } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createError) return { error: createError.message };

  // Sign in via SSR client so the session cookie is set for this request
  const ssrClient = createSupabaseServerClient();
  if (!ssrClient) return { error: "Session service not configured." };
  const { error: signInError } = await ssrClient.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) return { error: signInError.message };

  return {};
}

export async function createOnboardingBusiness(
  name: string,
  kitType: KitType,
  location: string
): Promise<{ error?: string; businessId?: string; slug?: string }> {
  const db = getAdminDb();
  if (!db) return { error: "Service not configured." };

  const kit = KITS[kitType];
  const seed = seedSitePayload;
  const baseSlug = slugify(name);

  // Create business — retry once on slug collision
  const tryInsert = (s: string) =>
    db
      .from("businesses")
      .insert({ name, slug: s, is_active: true, site_status: "ready" })
      .select("id, slug")
      .single();

  let { data: biz, error: bizErr } = await tryInsert(baseSlug);
  if (bizErr?.code === "23505") {
    const fallback = `${baseSlug}-${Math.random().toString(36).slice(2, 5)}`;
    const retry = await tryInsert(fallback);
    if (retry.error || !retry.data)
      return { error: retry.error?.message ?? "Failed to create business." };
    biz = retry.data;
  } else if (bizErr || !biz) {
    return { error: bizErr?.message ?? "Failed to create business." };
  }

  const businessId = biz.id;
  const finalSlug = biz.slug;
  const locationTag = location.trim() ? location.trim() : null;

  // Seed settings, homepage, hours in parallel
  await Promise.all([
    db.from("business_settings").insert({
      business_id: businessId,
      business_name: name,
      tagline: locationTag ? `${name} — ${locationTag}` : name,
      theme_mode: "preset",
      theme_preset_id: seed.brand.themePresetId,
      theme_tokens: seed.brand.themeTokens ?? {},
      primary_color: seed.brand.primaryColor,
      secondary_color: seed.brand.secondaryColor,
      accent_color: seed.brand.accentColor,
      heading_font: seed.brand.headingFont,
      body_font: seed.brand.bodyFont,
      show_breakfast_menu: kit.features.showBreakfastMenu,
      show_lunch_menu: kit.features.showLunchMenu,
      show_dinner_menu: kit.features.showDinnerMenu,
      show_specials: kit.features.showSpecials,
      show_gallery: kit.features.showGallery,
      show_testimonials: kit.features.showTestimonials,
      show_map: kit.features.showMap,
      show_online_ordering: kit.features.showOnlineOrdering,
      show_sticky_mobile_bar: kit.features.showStickyMobileBar,
    }),
    db.from("homepage_content").insert({
      business_id: businessId,
      hero_eyebrow: locationTag ?? kit.defaults.heroEyebrow,
      hero_headline: kit.defaults.heroHeadline,
      hero_subheadline: kit.defaults.heroSubheadline,
      hero_primary_cta_label: kit.defaults.heroPrimaryCtaLabel,
      hero_primary_cta_href: `/${finalSlug}/menu`,
      hero_secondary_cta_label: "Contact Us",
      hero_secondary_cta_href: `/${finalSlug}/contact`,
      about_title: kit.defaults.aboutTitle,
      about_body: kit.defaults.aboutBody,
      gallery_title: kit.defaults.galleryTitle,
      menu_preview_title: kit.defaults.menuPreviewTitle,
      contact_title: kit.defaults.contactTitle,
    }),
    db.from("business_hours").insert(
      seed.hours.map((h) => ({
        business_id: businessId,
        day_label: h.dayLabel,
        open_text: h.openText,
        sort_order: h.sortOrder,
        is_active: h.isActive,
      }))
    ),
  ]);

  // Seed specials if kit defines them
  if (kit.specials.length > 0) {
    await db.from("specials").insert(
      kit.specials.map((s) => ({
        business_id: businessId,
        title: s.title,
        description: s.description,
        price: s.price,
        label: s.label,
        is_featured: s.isFeatured,
        is_active: true,
        sort_order: s.sortOrder,
      }))
    );
  }

  // Seed menu categories → then items (items need category UUIDs)
  if (kit.categories.length > 0) {
    const { data: insertedCats } = await db
      .from("menu_categories")
      .insert(
        kit.categories.map((cat) => ({
          business_id: businessId,
          name: cat.name,
          slug: cat.slug,
          service_window: cat.serviceWindow,
          sort_order: cat.sortOrder,
          is_active: true,
        }))
      )
      .select("id, name");

    if (insertedCats && insertedCats.length > 0) {
      const catMap = new Map(insertedCats.map((c) => [c.name, c.id]));
      const allItems = kit.categories
        .flatMap((cat) =>
          cat.items.map((item) => ({
            business_id: businessId,
            category_id: catMap.get(cat.name),
            name: item.name,
            description: item.description,
            price: item.price,
            tags: item.tags,
            is_featured: item.isFeatured,
            is_sold_out: false,
            is_active: true,
            sort_order: item.sortOrder,
          }))
        )
        .filter((item) => item.category_id);

      if (allItems.length > 0) {
        await db.from("menu_items").insert(allItems);
      }
    }
  }

  return { businessId, slug: finalSlug };
}
