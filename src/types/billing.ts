// ─── PLAN ──────────────────────────────────────────────────────────────────────
//
// Plans are code-defined in plan-config.ts. The DB stores which plan a business
// is on. Never check plan slugs directly — use hasEntitlement() from entitlements.ts.

export type PlanSlug = "trial" | "starter" | "core" | "pro" | "enterprise";

export type BillingInterval = "monthly" | "yearly";

export type BillingProvider = "none" | "stripe";

// ─── SUBSCRIPTION ──────────────────────────────────────────────────────────────

export type SubscriptionStatus =
  | "active"
  | "trialing"   // Stripe trial period (distinct from the `trial` plan slug)
  | "past_due"
  | "canceled"
  | "incomplete"
  | "paused";

export interface SubscriptionRecord {
  id: string;
  businessId: string;
  planSlug: PlanSlug;
  status: SubscriptionStatus;
  billingInterval: BillingInterval | null;
  provider: BillingProvider;
  providerCustomerId: string | null;
  providerSubscriptionId: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  trialEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── ENTITLEMENTS ─────────────────────────────────────────────────────────────
//
// EntitlementKey is the single canonical list of gated capabilities.
// Entitlements are DERIVED from plan config — never stored in the DB.
// Check via hasEntitlement(entitlements, key) — never scatter plan checks in UI.

export type EntitlementKey =
  | "site_live"           // public site is accessible (all active plans)
  | "custom_domain"       // connect an externally-owned domain (core+)
  | "domain_purchase"     // purchase a domain via LocalLayer (pro+)
  | "signature_renderer"  // premium visual rendering engine (trial, pro+)
  | "google_sync"         // Google Business Profile sync (core+)
  | "extended_storage";   // 25 GB media storage (pro+)

export type EntitlementSet = Set<EntitlementKey>;

// ─── PLAN CONFIG ──────────────────────────────────────────────────────────────

export interface PlanConfig {
  slug: PlanSlug;
  name: string;
  monthlyPrice: number | null; // null = custom / contact us
  yearlyPrice: number | null;
  description: string;
  retentionNote?: string;      // shown in downgrade / cancel flow
  entitlements: EntitlementKey[];
  highlight?: boolean;         // marks the recommended plan in pricing UI
}

// ─── BILLING PROVIDER ─────────────────────────────────────────────────────────

export interface StripeWebhookPayload {
  type: string;
  data: {
    object: {
      id: string;
      customer: string;
      status: string;
      current_period_start: number;
      current_period_end: number;
      cancel_at_period_end: boolean;
      trial_end: number | null;
    };
  };
}

// ─── DERIVED DISPLAY ─────────────────────────────────────────────────────────

export interface SubscriptionDisplayState {
  planName: string;
  planSlug: PlanSlug;
  status: SubscriptionStatus;
  isActive: boolean;
  isOnTrial: boolean;         // on the `trial` plan slug (distinct from trialing status)
  isTrialing: boolean;        // Stripe trialing status
  isPastDue: boolean;
  isCanceled: boolean;
  isOnStarter: boolean;       // on starter plan (retention tier)
  trialDaysRemaining: number | null;
  trialEnd: Date | null;
  renewalDate: Date | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  hasProvider: boolean;
}

// ─── DOWNGRADE INTENT ─────────────────────────────────────────────────────────

export type DowngradeIntent = "starter" | "cancel";
