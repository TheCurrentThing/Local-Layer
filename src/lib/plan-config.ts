// ─── PLAN CONFIGURATION ───────────────────────────────────────────────────────
//
// Plans are code-defined. The DB (subscriptions table) stores which plan a
// business is on — the capabilities of that plan live here.
//
// Plan hierarchy:
//   trial    → 10-day onboarding. Broad access to evaluate the platform.
//   starter  → $19.99/mo retention plan. "Keep your business live." No premium features.
//   core     → $39.99/mo. Real operating tier. Custom domain + Google sync.
//   pro      → $79.99/mo. Premium tier. Signature renderer, domain purchase, storage.
//   enterprise → Custom. Multi-location / agency.
//
// Yearly prices: monthly * 12 * 0.8 (20% discount), precomputed to avoid runtime drift.
//   starter: $191.90/yr ($15.99/mo equivalent)
//   core:    $383.90/yr ($31.99/mo equivalent)
//   pro:     $767.90/yr ($63.99/mo equivalent)
//
// Rule: entitlement checks MUST go through hasEntitlement() in entitlements.ts.
// Never read plan_slug and manually check capabilities elsewhere.

import type { PlanSlug, PlanConfig, EntitlementKey, EntitlementSet } from "@/types/billing";

export const PLAN_CONFIGS: Record<PlanSlug, PlanConfig> = {
  trial: {
    slug: "trial",
    name: "Trial",
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyPricePerMonth: null,
    description: "10-day free trial. Full access to evaluate LocalLayer for your business.",
    retentionNote: "Your trial gives you access to premium features — choose a plan to keep them.",
    entitlements: [
      "site_live",
      "custom_domain",
      "google_sync",
      "signature_renderer",
    ],
  },

  starter: {
    slug: "starter",
    name: "Starter",
    monthlyPrice: 19.99,
    yearlyPrice: 191.90,
    yearlyPricePerMonth: 15.99,
    description: "Keep your business live online. Your site, your content, your subdomain.",
    retentionNote: "Your site stays live, your content is preserved, and you can upgrade anytime.",
    entitlements: [
      "site_live",
    ],
  },

  core: {
    slug: "core",
    name: "Core",
    monthlyPrice: 39.99,
    yearlyPrice: 383.90,
    yearlyPricePerMonth: 31.99,
    description: "The full operating tier. Custom domain, Google sync, and everything you need to run your business online.",
    entitlements: [
      "site_live",
      "custom_domain",
      "google_sync",
    ],
    highlight: true,
  },

  pro: {
    slug: "pro",
    name: "Pro",
    monthlyPrice: 79.99,
    yearlyPrice: 767.90,
    yearlyPricePerMonth: 63.99,
    description: "Premium presentation, advanced capabilities, and the full LocalLayer platform.",
    entitlements: [
      "site_live",
      "custom_domain",
      "google_sync",
      "signature_renderer",
      "domain_purchase",
      "extended_storage",
    ],
  },

  enterprise: {
    slug: "enterprise",
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    yearlyPricePerMonth: null,
    description: "Custom capabilities for multi-location and agency accounts.",
    entitlements: [
      "site_live",
      "custom_domain",
      "google_sync",
      "signature_renderer",
      "domain_purchase",
      "extended_storage",
    ],
  },
};

// Returns the config for a given plan slug.
export function getPlanConfig(planSlug: PlanSlug): PlanConfig {
  return PLAN_CONFIGS[planSlug];
}

// Returns the full entitlement set for a plan as a Set for O(1) lookup.
export function getPlanEntitlements(planSlug: PlanSlug): EntitlementSet {
  return new Set<EntitlementKey>(PLAN_CONFIGS[planSlug].entitlements);
}

// Returns the minimum plan that includes a given entitlement, for upgrade hints.
// Order reflects the upgrade ladder from cheapest to most capable.
export function minimumPlanForEntitlement(key: EntitlementKey): PlanSlug {
  const order: PlanSlug[] = ["starter", "core", "pro", "enterprise"];
  for (const slug of order) {
    if (PLAN_CONFIGS[slug].entitlements.includes(key)) return slug;
  }
  return "enterprise";
}

// Human-readable display metadata for each entitlement key.
// Used in billing and account UI to explain what each entitlement means.
export const ENTITLEMENT_DISPLAY: Record<
  EntitlementKey,
  { label: string; description: string }
> = {
  site_live: {
    label: "Site live",
    description: "Your LocalLayer site is publicly accessible at your subdomain.",
  },
  custom_domain: {
    label: "Custom domain",
    description: "Connect a domain you already own to your LocalLayer site.",
  },
  domain_purchase: {
    label: "Domain purchase",
    description: "Buy and manage a domain directly through LocalLayer.",
  },
  signature_renderer: {
    label: "Signature renderer",
    description: "Premium full-section visual layout for maximum impact.",
  },
  google_sync: {
    label: "Google Business sync",
    description: "Keep hours, posts, and business info in sync automatically.",
  },
  extended_storage: {
    label: "Extended storage",
    description: "25 GB media storage for photos, logos, and menu images.",
  },
};

// Ordered list for display in billing UI.
export const ALL_ENTITLEMENT_KEYS: EntitlementKey[] = [
  "site_live",
  "custom_domain",
  "google_sync",
  "signature_renderer",
  "domain_purchase",
  "extended_storage",
];
