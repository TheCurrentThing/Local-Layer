// ─── CENTRAL ENTITLEMENT RESOLVER ─────────────────────────────────────────────
//
// This is the ONLY place that answers "can this business do X?".
// Never check plan_slug directly in UI components, renderers, or page logic.
// Always use hasEntitlement(entitlements, key) from this module.
//
// Degradation rules:
//   canceled    → empty set (site goes offline)
//   past_due / incomplete / paused → starter entitlements (site stays live, premiums paused)
//   active / trialing → full plan entitlements
//   no subscription record → starter entitlements (graceful fallback)
//
// Usage:
//   const entitlements = await getBusinessEntitlements(businessId);
//   if (hasEntitlement(entitlements, "custom_domain")) { ... }

import "server-only";
import { cache } from "react";
import { getBusinessSubscription } from "@/lib/billing-queries";
import { getPlanEntitlements } from "@/lib/plan-config";
import type { EntitlementKey, EntitlementSet } from "@/types/billing";
import type { RendererType } from "@/types/renderer";

// Returns the full entitlement set for a business.
// Cached per request — safe to call in loadPayload, billing page, and sidebar.
// Gracefully returns starter-tier entitlements if billing is not configured.
export const getBusinessEntitlements = cache(
  async (businessId: string): Promise<EntitlementSet> => {
    try {
      const subscription = await getBusinessSubscription(businessId);

      // No subscription record → treat as starter (site stays live, no premiums).
      if (!subscription) {
        return getPlanEntitlements("starter");
      }

      // Fully canceled → empty entitlements (site goes offline, data preserved).
      if (subscription.status === "canceled") {
        return new Set<EntitlementKey>();
      }

      // Degraded states → starter entitlements (site stays live, premiums paused).
      // This prevents site takedowns for temporary payment issues.
      if (
        subscription.status === "past_due" ||
        subscription.status === "incomplete" ||
        subscription.status === "paused"
      ) {
        return getPlanEntitlements("starter");
      }

      // Active or trialing → full plan entitlements.
      return getPlanEntitlements(subscription.planSlug);
    } catch {
      // Billing system not available — fail open to starter entitlements.
      return getPlanEntitlements("starter");
    }
  },
);

// Single entitlement check. Use this in all conditional logic.
export function hasEntitlement(
  entitlements: EntitlementSet,
  key: EntitlementKey,
): boolean {
  return entitlements.has(key);
}

// Resolve the effective renderer type, downgrading if the business does not
// have the signature_renderer entitlement. Called inside loadPayload so the
// SitePayload always carries the correct effective type.
export function resolveRendererType(
  requested: RendererType,
  entitlements: EntitlementSet,
): RendererType {
  if (requested === "signature" && !entitlements.has("signature_renderer")) {
    return "standard";
  }
  return requested;
}
