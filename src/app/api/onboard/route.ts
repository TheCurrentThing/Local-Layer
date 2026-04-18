import { NextRequest, NextResponse } from "next/server";
import { createBusiness } from "@/lib/business";
import { isSupabaseConfigured, getSupabaseAdminClientOrThrow } from "@/lib/supabase";
import { seedSitePayload } from "@/lib/seed";
import { toKitType } from "@/lib/kit-config";
import { KITS } from "@/app/onboarding/kits";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * POST /api/onboard
 *
 * Creates a new business and seeds it with default content so it is
 * immediately ready for admin editing.
 *
 * Body (JSON):
 *   { name: string, slug?: string }
 *
 * Returns:
 *   { businessId, slug, publicUrl }
 *
 * Security note: Protect this endpoint with an internal secret before
 * exposing it to production traffic (check X-LocalLayer-Secret header
 * against LOCALLAYER_ONBOARD_SECRET env var).
 */
export async function POST(req: NextRequest) {
  // Internal secret guard — set LOCALLAYER_ONBOARD_SECRET in .env.local
  const secret = process.env.LOCALLAYER_ONBOARD_SECRET;
  if (secret) {
    const provided = req.headers.get("x-locallayer-secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  let body: { name?: string; slug?: string; kit_type?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "name is required." }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? slugify(body.slug) : slugify(name);
  if (!slug) {
    return NextResponse.json(
      { error: "slug could not be generated from the provided name." },
      { status: 400 },
    );
  }

  const kitType = toKitType(body.kit_type);
  const kitDef = KITS[kitType];

  try {
    const business = await createBusiness({ name, slug, kitType });
    const client = getSupabaseAdminClientOrThrow();

    // Seed from both the global seed defaults and the kit-specific defaults.
    // Kit features override seed defaults so the initial site reflects the chosen kit.
    const seed = seedSitePayload;
    const kitFeatures = kitDef.features;
    const kitDefaults = kitDef.defaults;

    const seedOps: Promise<unknown>[] = [
      client.from("business_settings").insert({
        business_id: business.id,
        business_name: name,
        tagline: seed.brand.tagline,
        phone: seed.brand.phone,
        email: seed.brand.email || null,
        address_line_1: seed.brand.addressLine1,
        city: seed.brand.city,
        state: seed.brand.state,
        zip: seed.brand.zip,
        theme_mode: "preset",
        theme_preset_id: seed.brand.themePresetId,
        theme_tokens: seed.brand.themeTokens ?? {},
        primary_color: seed.brand.primaryColor,
        secondary_color: seed.brand.secondaryColor,
        accent_color: seed.brand.accentColor,
        heading_font: seed.brand.headingFont,
        body_font: seed.brand.bodyFont,
        // Feature flags come from the kit definition, not the generic seed.
        show_breakfast_menu: kitFeatures.showBreakfastMenu,
        show_lunch_menu: kitFeatures.showLunchMenu,
        show_dinner_menu: kitFeatures.showDinnerMenu,
        show_specials: kitFeatures.showSpecials,
        show_gallery: kitFeatures.showGallery,
        show_testimonials: kitFeatures.showTestimonials,
        show_map: kitFeatures.showMap,
        show_online_ordering: kitFeatures.showOnlineOrdering,
        show_sticky_mobile_bar: kitFeatures.showStickyMobileBar,
      }),
      client.from("homepage_content").insert({
        business_id: business.id,
        hero_eyebrow: kitDefaults.heroEyebrow,
        hero_headline: kitDefaults.heroHeadline,
        hero_subheadline: kitDefaults.heroSubheadline,
        hero_primary_cta_label: kitDefaults.heroPrimaryCtaLabel,
        hero_primary_cta_href: seed.settings.heroPrimaryCtaHref,
        hero_secondary_cta_label: seed.settings.heroSecondaryCtaLabel,
        hero_secondary_cta_href: seed.settings.heroSecondaryCtaHref,
        quick_info_hours_label: seed.settings.quickInfoHoursLabel,
        about_title: kitDefaults.aboutTitle,
        about_body: kitDefaults.aboutBody,
        gallery_title: kitDefaults.galleryTitle,
        menu_preview_title: kitDefaults.menuPreviewTitle,
        contact_title: kitDefaults.contactTitle,
      }),
    ];

    // Seed hours for kits that use them
    if (kitDef.features.showLunchMenu || kitDef.features.showDinnerMenu) {
      seedOps.push(
        client.from("business_hours").insert(
          seed.hours.map((hour) => ({
            business_id: business.id,
            day_label: hour.dayLabel,
            open_text: hour.openText,
            sort_order: hour.sortOrder,
            is_active: hour.isActive,
          })),
        ),
      );
    }

    // Seed menu categories + items for kits that have them
    if (kitDef.categories.length > 0) {
      for (const cat of kitDef.categories) {
        const catResult = await client
          .from("menu_categories")
          .insert({
            business_id: business.id,
            name: cat.name,
            slug: cat.slug,
            service_window: cat.serviceWindow,
            sort_order: cat.sortOrder,
            is_active: true,
          })
          .select("id")
          .single<{ id: string }>();

        if (catResult.data && cat.items.length > 0) {
          seedOps.push(
            client.from("menu_items").insert(
              cat.items.map((item) => ({
                business_id: business.id,
                category_id: catResult.data.id,
                name: item.name,
                description: item.description,
                price: item.price,
                tags: item.tags,
                is_active: true,
                is_sold_out: false,
                is_featured: item.isFeatured,
                sort_order: item.sortOrder,
              })),
            ),
          );
        }
      }
    }

    // Seed specials for kits that have them
    if (kitDef.specials.length > 0) {
      seedOps.push(
        client.from("specials").insert(
          kitDef.specials.map((s) => ({
            business_id: business.id,
            title: s.title,
            description: s.description,
            price: s.price,
            label: s.label,
            is_active: true,
            is_featured: s.isFeatured,
            sort_order: s.sortOrder,
          })),
        ),
      );
    }

    await Promise.all(seedOps);

    const origin = req.nextUrl.origin;

    return NextResponse.json({
      businessId: business.id,
      slug: business.slug,
      kitType,
      publicUrl: `${origin}/${business.slug}`,
      adminNote:
        "Set LOCALLAYER_BUSINESS_ID=" +
        business.id +
        " in your .env.local to use this business in the admin panel.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
