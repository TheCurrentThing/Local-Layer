import "server-only";
import { cache } from "react";
import { createSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import { toKitType } from "@/lib/kit-config";
import { toRendererType } from "@/lib/renderer-config";
import type { KitType } from "@/types/kit";
import type { RendererType } from "@/types/renderer";

export type SiteStatus = "draft" | "ready" | "live" | "paused";

export type BusinessRow = {
  id: string;
  slug: string;
  name: string;
  is_active: boolean;
  site_status: SiteStatus;
  kit_type: KitType;
  renderer_type: RendererType;
};

/**
 * Resolve a business by its public slug.
 * For public access, only returns businesses that are 'live'.
 * Pass allowNonLive=true to resolve draft/ready businesses (admin preview).
 * Cached per request so layout + page share one DB round trip.
 */
export const getBusinessBySlug = cache(
  async (
    slug: string,
    { allowNonLive = false }: { allowNonLive?: boolean } = {},
  ): Promise<BusinessRow | null> => {
    if (!isSupabaseConfigured()) return null;
    const client = createSupabaseAdminClient();
    if (!client) return null;

    type RawBusiness = Omit<BusinessRow, "kit_type" | "renderer_type"> & { kit_type: string; renderer_type: string };

    let query = client
      .from("businesses")
      .select("id, slug, name, is_active, site_status, kit_type, renderer_type")
      .eq("slug", slug)
      .eq("is_active", true);

    if (!allowNonLive) {
      query = query.eq("site_status", "live");
    }

    const { data } = await query.maybeSingle<RawBusiness>();
    if (!data) return null;
    return { ...data, kit_type: toKitType(data.kit_type), renderer_type: toRendererType(data.renderer_type) };
  },
);

/**
 * Resolve a business by its custom domain.
 * Only resolves domains with status='active' belonging to a 'live' business.
 * Used by middleware for custom-domain routing.
 */
export const getBusinessByDomain = cache(
  async (domain: string): Promise<BusinessRow | null> => {
    if (!isSupabaseConfigured()) return null;
    const client = createSupabaseAdminClient();
    if (!client) return null;

    type RawBusiness = Omit<BusinessRow, "kit_type" | "renderer_type"> & { kit_type: string; renderer_type: string };

    const { data } = await client
      .from("business_domains")
      .select("businesses!inner(id, slug, name, is_active, site_status, kit_type, renderer_type)")
      .eq("domain", domain)
      .eq("status", "active")
      .maybeSingle<{ businesses: RawBusiness }>();

    const raw = data?.businesses ?? null;
    if (!raw || !raw.is_active || raw.site_status !== "live") {
      return null;
    }
    return { ...raw, kit_type: toKitType(raw.kit_type), renderer_type: toRendererType(raw.renderer_type) };
  },
);

/**
 * Resolve which business should handle a given public request.
 *
 * Resolution order:
 *   1. Custom domain (host header) — if host matches an active domain record
 *   2. Slug path segment — standard /[slug]/ routing
 */
export async function resolveBusinessFromRequest(
  host: string,
  slug: string,
): Promise<{ business: BusinessRow; resolvedBy: "domain" | "slug" } | null> {
  const byDomain = await getBusinessByDomain(host);
  if (byDomain) return { business: byDomain, resolvedBy: "domain" };

  const bySlug = await getBusinessBySlug(slug);
  if (bySlug) return { business: bySlug, resolvedBy: "slug" };

  return null;
}

/**
 * Get the business_id for the current admin context.
 *
 * Resolution order:
 *   1. LOCALLAYER_BUSINESS_ID env var (fastest — set this in .env.local)
 *   2. First active business in the database (automatic fallback)
 *
 * Cached per request. Throws if Supabase is not configured or no business exists.
 */
export const getCurrentAdminBusinessId = cache(async (): Promise<string> => {
  const envId = process.env.LOCALLAYER_BUSINESS_ID;
  if (envId) return envId;

  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const client = createSupabaseAdminClient();
  if (!client) {
    throw new Error("Supabase client could not be created.");
  }

  const { data, error } = await client
    .from("businesses")
    .select("id")
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (error) throw new Error(error.message);
  if (!data) {
    throw new Error(
      "No business found. Run the onboarding setup (/api/onboard) to create a business first.",
    );
  }

  return data.id;
});

/**
 * Get the kit_type for the current admin business.
 * Cached per request. Returns 'restaurant' as a safe fallback.
 */
export const getCurrentAdminKitType = cache(async (): Promise<KitType> => {
  if (!isSupabaseConfigured()) return "restaurant";

  const client = createSupabaseAdminClient();
  if (!client) return "restaurant";

  const businessId = await getCurrentAdminBusinessId();

  const { data } = await client
    .from("businesses")
    .select("kit_type")
    .eq("id", businessId)
    .maybeSingle<{ kit_type: string }>();

  return toKitType(data?.kit_type);
});

/**
 * Get the renderer_type for the current admin business.
 * Cached per request. Returns 'standard' as a safe fallback.
 */
export const getCurrentAdminRendererType = cache(async (): Promise<RendererType> => {
  if (!isSupabaseConfigured()) return "standard";

  const client = createSupabaseAdminClient();
  if (!client) return "standard";

  const businessId = await getCurrentAdminBusinessId();

  const { data } = await client
    .from("businesses")
    .select("renderer_type")
    .eq("id", businessId)
    .maybeSingle<{ renderer_type: string }>();

  return toRendererType(data?.renderer_type);
});

/**
 * Create a new business and return its id and slug.
 * Used by the onboarding API. New businesses start in 'draft' status.
 */
export async function createBusiness({
  name,
  slug,
  kitType = "restaurant",
  rendererType = "standard",
}: {
  name: string;
  slug: string;
  kitType?: KitType;
  rendererType?: RendererType;
}): Promise<BusinessRow> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }
  const client = createSupabaseAdminClient();
  if (!client) throw new Error("Supabase client could not be created.");

  type RawBusiness = Omit<BusinessRow, "kit_type" | "renderer_type"> & { kit_type: string; renderer_type: string };

  const { data, error } = await client
    .from("businesses")
    .insert({ name, slug, is_active: true, site_status: "draft", kit_type: kitType, renderer_type: rendererType })
    .select("id, slug, name, is_active, site_status, kit_type, renderer_type")
    .single<RawBusiness>();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Business could not be created.");
  return { ...data, kit_type: toKitType(data.kit_type), renderer_type: toRendererType(data.renderer_type) };
}
