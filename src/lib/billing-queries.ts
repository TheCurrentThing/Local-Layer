import "server-only";
import { cache } from "react";
import { createSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import type {
  PlanSlug,
  SubscriptionStatus,
  BillingInterval,
  BillingProvider,
  SubscriptionRecord,
  SubscriptionDisplayState,
} from "@/types/billing";
import { getPlanConfig } from "@/lib/plan-config";

// ─── ROW TYPE ─────────────────────────────────────────────────────────────────

type SubscriptionRow = {
  id: string;
  business_id: string;
  plan_slug: string;
  status: string;
  billing_interval: string | null;
  provider: string;
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
};

// ─── NORMALIZERS ──────────────────────────────────────────────────────────────

function toPlanSlug(value: string | null | undefined): PlanSlug {
  if (
    value === "trial" ||
    value === "starter" ||
    value === "core" ||
    value === "pro" ||
    value === "enterprise"
  )
    return value;
  return "starter";
}

function toSubscriptionStatus(value: string | null | undefined): SubscriptionStatus {
  if (
    value === "trialing" ||
    value === "past_due" ||
    value === "canceled" ||
    value === "incomplete" ||
    value === "paused"
  )
    return value;
  return "active";
}

function toBillingInterval(value: string | null | undefined): BillingInterval | null {
  if (value === "yearly") return "yearly";
  if (value === "monthly") return "monthly";
  return null;
}

function toBillingProvider(value: string | null | undefined): BillingProvider {
  if (value === "stripe") return "stripe";
  return "none";
}

function mapSubscription(row: SubscriptionRow): SubscriptionRecord {
  return {
    id: row.id,
    businessId: row.business_id,
    planSlug: toPlanSlug(row.plan_slug),
    status: toSubscriptionStatus(row.status),
    billingInterval: toBillingInterval(row.billing_interval),
    provider: toBillingProvider(row.provider),
    providerCustomerId: row.provider_customer_id,
    providerSubscriptionId: row.provider_subscription_id,
    currentPeriodStart: row.current_period_start ? new Date(row.current_period_start) : null,
    currentPeriodEnd: row.current_period_end ? new Date(row.current_period_end) : null,
    cancelAtPeriodEnd: row.cancel_at_period_end,
    canceledAt: row.canceled_at ? new Date(row.canceled_at) : null,
    trialEnd: row.trial_end ? new Date(row.trial_end) : null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// ─── QUERIES ─────────────────────────────────────────────────────────────────

// Returns null when no subscription record exists — treated as starter tier.
// Cached per request so entitlement checks + billing page share one DB round trip.
export const getBusinessSubscription = cache(
  async (businessId: string): Promise<SubscriptionRecord | null> => {
    if (!isSupabaseConfigured()) return null;
    const client = createSupabaseAdminClient();
    if (!client) return null;

    const { data } = await client
      .from("subscriptions")
      .select("*")
      .eq("business_id", businessId)
      .maybeSingle<SubscriptionRow>();

    if (!data) return null;
    return mapSubscription(data);
  },
);

// ─── DERIVED DISPLAY STATE ────────────────────────────────────────────────────

// Builds a serializable display state for use in UI components.
// Handles the "no subscription = starter" implicit state cleanly.
export function deriveDisplayState(
  subscription: SubscriptionRecord | null,
): SubscriptionDisplayState {
  const planSlug = subscription?.planSlug ?? "starter";
  const status = subscription?.status ?? "active";
  const plan = getPlanConfig(planSlug);

  const now = new Date();

  // Trial countdown: for the `trial` plan slug or trialing status
  let trialDaysRemaining: number | null = null;
  const trialEnd = subscription?.trialEnd ?? null;
  if (trialEnd) {
    const days = Math.ceil(
      (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    trialDaysRemaining = Math.max(0, days);
  }

  return {
    planName: plan.name,
    planSlug,
    status,
    billingInterval: subscription?.billingInterval ?? null,
    isActive: status === "active" || status === "trialing",
    isOnTrial: planSlug === "trial",
    isTrialing: status === "trialing",
    isPastDue: status === "past_due",
    isCanceled: status === "canceled",
    isOnStarter: planSlug === "starter",
    trialDaysRemaining,
    trialEnd,
    renewalDate: subscription?.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
    canceledAt: subscription?.canceledAt ?? null,
    hasProvider: (subscription?.provider ?? "none") !== "none",
  };
}

// ─── WRITE OPERATIONS (FUTURE STRIPE WEBHOOK HANDLER) ────────────────────────

// Called by Stripe webhook to sync subscription state. Not yet wired.
// Exported so the webhook handler has a stable contract to call.
export async function upsertSubscriptionFromStripe(data: {
  businessId: string;
  planSlug: PlanSlug;
  status: SubscriptionStatus;
  billingInterval: BillingInterval | null;
  providerCustomerId: string;
  providerSubscriptionId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  trialEnd: Date | null;
}): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const client = createSupabaseAdminClient();
  if (!client) return;

  await client.from("subscriptions").upsert(
    {
      business_id: data.businessId,
      plan_slug: data.planSlug,
      status: data.status,
      billing_interval: data.billingInterval,
      provider: "stripe",
      provider_customer_id: data.providerCustomerId,
      provider_subscription_id: data.providerSubscriptionId,
      current_period_start: data.currentPeriodStart.toISOString(),
      current_period_end: data.currentPeriodEnd.toISOString(),
      cancel_at_period_end: data.cancelAtPeriodEnd,
      canceled_at: data.canceledAt?.toISOString() ?? null,
      trial_end: data.trialEnd?.toISOString() ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "business_id" },
  );
}
