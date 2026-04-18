import "server-only";
import { cache } from "react";
import { createSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import type { SiteStatus } from "@/lib/business";
import { randomBytes } from "crypto";

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type DomainStatus = "pending" | "verified" | "active" | "failed";

export interface BusinessDomainRecord {
  id: string;
  businessId: string;
  domain: string;
  isPrimary: boolean;
  status: DomainStatus;
  verificationToken: string | null;
  verifiedAt: string | null;
  lastCheckedAt: string | null;
  notes: string | null;
  createdAt: string;
}

export interface LaunchChecklistItem {
  key: string;
  label: string;
  description: string;
  passed: boolean;
  critical: boolean;
}

export interface LaunchChecklist {
  items: LaunchChecklistItem[];
  allPassed: boolean;
  criticalPassed: boolean;
  passedCount: number;
  totalCount: number;
  readyToPublish: boolean;
}

export interface LaunchAdminPayload {
  business: {
    id: string;
    slug: string;
    name: string;
    site_status: SiteStatus;
    is_active: boolean;
  };
  publicUrl: string;
  checklist: LaunchChecklist;
  domains: BusinessDomainRecord[];
  primaryDomain: BusinessDomainRecord | null;
}

// ─── PUBLIC URL ───────────────────────────────────────────────────────────────

/**
 * Returns the canonical public URL for a business slug.
 * Reads NEXT_PUBLIC_APP_URL as the base (e.g. https://branch-kit.vercel.app).
 * Falls back to a placeholder if env var is not set.
 */
export function getBusinessPublicUrl(slug: string): string {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
  if (!base) return `/${slug}`;
  return `${base}/${slug}`;
}

// ─── DOMAINS ─────────────────────────────────────────────────────────────────

/**
 * Get all domain records for a business, ordered by primary first then by created_at.
 * Cached per request.
 */
export const getBusinessDomains = cache(
  async (businessId: string): Promise<BusinessDomainRecord[]> => {
    if (!isSupabaseConfigured()) return [];
    const client = createSupabaseAdminClient();
    if (!client) return [];

    const { data } = await client
      .from("business_domains")
      .select("*")
      .eq("business_id", businessId)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    if (!data) return [];

    return data.map(mapDomainRow);
  },
);

function mapDomainRow(row: Record<string, unknown>): BusinessDomainRecord {
  return {
    id: row.id as string,
    businessId: row.business_id as string,
    domain: row.domain as string,
    isPrimary: row.is_primary as boolean,
    status: row.status as DomainStatus,
    verificationToken: (row.verification_token as string | null) ?? null,
    verifiedAt: (row.verified_at as string | null) ?? null,
    lastCheckedAt: (row.last_checked_at as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    createdAt: row.created_at as string,
  };
}

// ─── LAUNCH CHECKLIST ────────────────────────────────────────────────────────

type ChecklistRow = {
  name: string | null;
  slug: string | null;
  site_status: SiteStatus;
  settings: {
    business_name: string | null;
    tagline: string | null;
    phone: string | null;
    address_line_1: string | null;
    city: string | null;
    state: string | null;
    theme_preset_id: string | null;
    heading_font: string | null;
  } | null;
  hoursCount: number;
  categoryCount: number;
  itemCount: number;
  homepageContent: {
    hero_image_url: string | null;
    about_title: string | null;
  } | null;
};

/**
 * Compute the launch readiness checklist for a business.
 * Runs all checks in parallel for speed.
 */
export async function getLaunchChecklist(
  businessId: string,
): Promise<LaunchChecklist> {
  if (!isSupabaseConfigured()) return emptyChecklist();
  const client = createSupabaseAdminClient();
  if (!client) return emptyChecklist();

  const [businessResult, settingsResult, hoursResult, categoriesResult, itemsResult, homepageResult] =
    await Promise.all([
      client
        .from("businesses")
        .select("id, name, slug, site_status")
        .eq("id", businessId)
        .maybeSingle(),
      client
        .from("business_settings")
        .select("business_name, tagline, phone, address_line_1, city, state, theme_preset_id, heading_font")
        .eq("business_id", businessId)
        .maybeSingle(),
      client
        .from("business_hours")
        .select("id", { count: "exact", head: true })
        .eq("business_id", businessId)
        .eq("is_active", true),
      client
        .from("menu_categories")
        .select("id", { count: "exact", head: true })
        .eq("business_id", businessId),
      client
        .from("menu_items")
        .select("id", { count: "exact", head: true })
        .eq("business_id", businessId),
      client
        .from("homepage_content")
        .select("hero_image_url, about_title")
        .eq("business_id", businessId)
        .maybeSingle(),
    ]);

  const biz = businessResult.data;
  const settings = settingsResult.data;
  const hoursCount = hoursResult.count ?? 0;
  const catCount = categoriesResult.count ?? 0;
  const itemCount = itemsResult.count ?? 0;
  const homepage = homepageResult.data;

  const items: LaunchChecklistItem[] = [
    {
      key: "business_name",
      label: "Business name",
      description: "A name is set for this business.",
      passed: Boolean(settings?.business_name?.trim() || biz?.name?.trim()),
      critical: true,
    },
    {
      key: "slug",
      label: "Public slug / URL path",
      description: `Site is accessible at /${biz?.slug ?? "?"}`,
      passed: Boolean(biz?.slug?.trim()),
      critical: true,
    },
    {
      key: "contact",
      label: "Contact info",
      description: "Phone number and address are configured.",
      passed: Boolean(
        settings?.phone?.trim() &&
          settings?.address_line_1?.trim() &&
          settings?.city?.trim() &&
          settings?.state?.trim(),
      ),
      critical: true,
    },
    {
      key: "branding",
      label: "Theme & branding",
      description: "A theme preset is selected and fonts are applied.",
      passed: Boolean(settings?.theme_preset_id || settings?.heading_font),
      critical: false,
    },
    {
      key: "hours",
      label: "Business hours",
      description: "At least one active hours row is configured.",
      passed: hoursCount > 0,
      critical: false,
    },
    {
      key: "menu_category",
      label: "Menu section",
      description: "At least one menu category exists.",
      passed: catCount > 0,
      critical: false,
    },
    {
      key: "menu_item",
      label: "Menu item",
      description: "At least one menu item exists.",
      passed: itemCount > 0,
      critical: false,
    },
    {
      key: "homepage_content",
      label: "Homepage content",
      description: "Hero/about section content is configured.",
      passed: Boolean(homepage?.about_title?.trim()),
      critical: false,
    },
    {
      key: "hero_image",
      label: "Hero image",
      description: "A hero image has been uploaded.",
      passed: Boolean(homepage?.hero_image_url?.trim()),
      critical: false,
    },
  ];

  const passedCount = items.filter((i) => i.passed).length;
  const criticalPassed = items.filter((i) => i.critical).every((i) => i.passed);
  const allPassed = passedCount === items.length;

  return {
    items,
    allPassed,
    criticalPassed,
    passedCount,
    totalCount: items.length,
    readyToPublish: criticalPassed,
  };
}

function emptyChecklist(): LaunchChecklist {
  return {
    items: [],
    allPassed: false,
    criticalPassed: false,
    passedCount: 0,
    totalCount: 0,
    readyToPublish: false,
  };
}

// ─── LAUNCH ADMIN PAYLOAD ─────────────────────────────────────────────────────

/**
 * Full launch-page payload for a given businessId.
 * Runs checklist + domain queries in parallel.
 */
export async function getLaunchAdminPayload(
  businessId: string,
): Promise<LaunchAdminPayload | null> {
  if (!isSupabaseConfigured()) return null;
  const client = createSupabaseAdminClient();
  if (!client) return null;

  const [businessResult, checklist, domains] = await Promise.all([
    client
      .from("businesses")
      .select("id, slug, name, site_status, is_active")
      .eq("id", businessId)
      .maybeSingle<{
        id: string;
        slug: string;
        name: string;
        site_status: SiteStatus;
        is_active: boolean;
      }>(),
    getLaunchChecklist(businessId),
    getBusinessDomains(businessId),
  ]);

  if (!businessResult.data) return null;

  const biz = businessResult.data;
  const primaryDomain = domains.find((d) => d.isPrimary) ?? null;

  return {
    business: biz,
    publicUrl: getBusinessPublicUrl(biz.slug),
    checklist,
    domains,
    primaryDomain,
  };
}

// ─── TOKEN GENERATOR ─────────────────────────────────────────────────────────

/** Generate a unique DNS verification token. */
export function generateVerificationToken(): string {
  return `locallayer-verify-${randomBytes(16).toString("hex")}`;
}
