import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentAdminBusinessId } from "@/lib/business";
import { getAdminSitePayload } from "@/lib/queries";
import { getBusinessSubscription, deriveDisplayState } from "@/lib/billing-queries";
import { getBusinessEntitlements, hasEntitlement } from "@/lib/entitlements";
import { getPlanConfig, ENTITLEMENT_DISPLAY, minimumPlanForEntitlement, PLAN_CONFIGS, ALL_ENTITLEMENT_KEYS } from "@/lib/plan-config";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    active:     { label: "Active",      color: "#4ade80", bg: "rgba(74,222,128,0.1)" },
    trialing:   { label: "Trialing",    color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
    past_due:   { label: "Past due",    color: "#f87171", bg: "rgba(248,113,113,0.1)" },
    canceled:   { label: "Canceled",    color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
    incomplete: { label: "Incomplete",  color: "#fb923c", bg: "rgba(251,146,60,0.1)"  },
    paused:     { label: "Paused",      color: "#fbbf24", bg: "rgba(251,191,36,0.1)"  },
  };
  const s = map[status] ?? map.active;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 8px",
        borderRadius: 6,
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.color}22`,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, display: "inline-block" }} />
      {s.label}
    </span>
  );
}

function PlanBadge({ slug }: { slug: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    trial:      { color: "#34d399",                 bg: "rgba(52,211,153,0.1)"   },
    starter:    { color: "var(--admin-text-muted)", bg: "rgba(255,255,255,0.05)" },
    core:       { color: "#60a5fa",                 bg: "rgba(96,165,250,0.1)"   },
    pro:        { color: "#d97706",                 bg: "rgba(217,119,6,0.1)"    },
    enterprise: { color: "#a78bfa",                 bg: "rgba(167,139,250,0.1)"  },
  };
  const s = map[slug] ?? map.starter;
  const label = slug.charAt(0).toUpperCase() + slug.slice(1);
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 5,
        fontSize: 9,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        color: s.color,
        background: s.bg,
      }}
    >
      {label}
    </span>
  );
}

export default async function AdminBillingPage() {
  const payload = await getAdminSitePayload();
  const businessId = await getCurrentAdminBusinessId();
  const subscription = await getBusinessSubscription(businessId);
  const entitlements = await getBusinessEntitlements(businessId);
  const display = deriveDisplayState(subscription);
  const plan = getPlanConfig(display.planSlug);

  const { businessSlug } = payload;

  // Warning states
  const trialEndingSoon = display.isOnTrial && display.trialDaysRemaining !== null && display.trialDaysRemaining <= 5;
  const trialEnding7 = display.isOnTrial && display.trialDaysRemaining !== null && display.trialDaysRemaining <= 7;
  const showPastDueWarning = display.isPastDue;
  const showCancelWarning = display.cancelAtPeriodEnd && !display.isCanceled;
  const showCanceledState = display.isCanceled;
  const showStarterState = display.isOnStarter && !display.isCanceled;
  const hasWarning = trialEndingSoon || showPastDueWarning || showCancelWarning || showCanceledState;

  // Can trigger downgrade/cancel flow only if on a paid plan or trial
  const canManagePlan = display.planSlug !== "starter" && !display.isCanceled;

  return (
    <AdminShell
      activeKey="billing"
      brandName={payload.brand.businessName}
      eyebrow="Platform"
      title="Plan & Billing"
      description="Your current plan, entitlements, and billing relationship."
      liveHref={businessSlug ? `/${businessSlug}` : undefined}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px minmax(0, 1fr)",
          gap: 12,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* ── LEFT: Plan identity ── */}
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            overflowY: "auto",
          }}
          className="admin-scrollbar"
        >
          {/* Plan identity card */}
          <div
            style={{
              background: "var(--admin-surface)",
              border: "1px solid var(--admin-border)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--admin-border)" }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "#d97706",
                }}
              >
                Current Plan
              </p>
            </div>
            <div style={{ padding: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--admin-text)" }}>
                  {plan.name}
                </p>
                <PlanBadge slug={display.planSlug} />
              </div>
              <StatusPill status={display.status} />
              {plan.monthlyPrice !== null && plan.monthlyPrice > 0 && (
                <p style={{ margin: "8px 0 0", fontSize: 11, color: "var(--admin-text-muted)" }}>
                  {display.billingInterval === "yearly" && plan.yearlyPricePerMonth !== null
                    ? `$${plan.yearlyPricePerMonth.toFixed(2)}/mo (billed annually)`
                    : `$${plan.monthlyPrice.toFixed(2)}/mo`}
                </p>
              )}
              {plan.monthlyPrice === 0 && (
                <p style={{ margin: "8px 0 0", fontSize: 11, color: "#34d399" }}>
                  Free during trial
                </p>
              )}
            </div>
          </div>

          {/* Trial countdown */}
          {display.isOnTrial && display.trialEnd && (
            <div
              style={{
                background: "var(--admin-surface)",
                border: `1px solid ${trialEnding7 ? "rgba(248,113,113,0.25)" : "rgba(52,211,153,0.2)"}`,
                borderRadius: 12,
                padding: "12px 14px",
              }}
            >
              <p style={{
                margin: "0 0 4px",
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: trialEnding7 ? "#f87171" : "#34d399",
              }}>
                Trial ends
              </p>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "var(--admin-text)" }}>
                {formatDate(display.trialEnd)}
              </p>
              {display.trialDaysRemaining !== null && (
                <p style={{ margin: "3px 0 0", fontSize: 11, color: trialEnding7 ? "#f87171" : "var(--admin-text-muted)" }}>
                  {display.trialDaysRemaining === 0
                    ? "Ends today"
                    : `${display.trialDaysRemaining} day${display.trialDaysRemaining === 1 ? "" : "s"} remaining`}
                </p>
              )}
            </div>
          )}

          {/* Renewal / period card */}
          {display.renewalDate && !display.isCanceled && !display.isOnTrial && (
            <div
              style={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border)",
                borderRadius: 12,
                padding: "12px 14px",
              }}
            >
              <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--admin-text-muted)" }}>
                {display.cancelAtPeriodEnd ? "Access ends" : "Renews"}
              </p>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "var(--admin-text)" }}>
                {formatDate(display.renewalDate)}
              </p>
            </div>
          )}

          {/* Canceled date */}
          {display.isCanceled && display.canceledAt && (
            <div
              style={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border)",
                borderRadius: 12,
                padding: "12px 14px",
              }}
            >
              <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--admin-text-muted)" }}>
                Canceled on
              </p>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "var(--admin-text)" }}>
                {formatDate(display.canceledAt)}
              </p>
            </div>
          )}

          {/* Provider status */}
          <div
            style={{
              background: "var(--admin-surface)",
              border: "1px solid var(--admin-border)",
              borderRadius: 12,
              padding: "12px 14px",
            }}
          >
            <p style={{ margin: "0 0 6px", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--admin-text-muted)" }}>
              Billing
            </p>
            {display.hasProvider ? (
              <p style={{ margin: 0, fontSize: 11, color: "var(--admin-text-muted)" }}>
                Managed via {subscription?.provider ?? "provider"}.
              </p>
            ) : (
              <p style={{ margin: 0, fontSize: 11, color: "var(--admin-text-muted)", lineHeight: 1.5 }}>
                {display.isCanceled
                  ? "Subscription canceled."
                  : display.planSlug === "trial" || display.planSlug === "starter"
                    ? "No payment required right now."
                    : "Managed externally. Contact support to update billing."}
              </p>
            )}
          </div>
        </aside>

        {/* ── RIGHT: Entitlements + actions ── */}
        <div
          className="admin-scrollbar"
          style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}
        >
          {/* ── Warning / state panel ── */}
          {hasWarning && (
            <div
              style={{
                background: showCanceledState
                  ? "rgba(107,114,128,0.06)"
                  : trialEnding7 || showPastDueWarning
                    ? "rgba(248,113,113,0.06)"
                    : "rgba(251,191,36,0.06)",
                border: `1px solid ${showCanceledState ? "rgba(107,114,128,0.2)" : trialEnding7 || showPastDueWarning ? "rgba(248,113,113,0.2)" : "rgba(251,191,36,0.2)"}`,
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {showCanceledState && (
                <>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--admin-text)" }}>
                    Your site is offline.
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-muted)", lineHeight: 1.6 }}>
                    Your subscription was canceled. Your content is preserved — reactivate anytime to bring your site back online.
                  </p>
                  <a
                    href="mailto:hello@locallayer.com?subject=Reactivate%20my%20LocalLayer%20subscription"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "8px 14px",
                      borderRadius: 7,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid var(--admin-border)",
                      color: "var(--admin-text)",
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: "none",
                      width: "fit-content",
                    }}
                  >
                    Email us to reactivate →
                  </a>
                </>
              )}
              {showPastDueWarning && (
                <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#f87171" }}>
                  Payment past due — your site remains live, but premium features are paused. Update your payment method to restore full access.
                </p>
              )}
              {trialEndingSoon && !showCanceledState && (
                <>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: trialEnding7 ? "#f87171" : "#fbbf24" }}>
                    {trialEnding7
                      ? `Your trial ends in ${display.trialDaysRemaining} day${display.trialDaysRemaining === 1 ? "" : "s"}.`
                      : `Your trial ends in ${display.trialDaysRemaining} days.`}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-muted)", lineHeight: 1.6 }}>
                    Choose a plan to keep your site live. Starter keeps your business online for just $19.99/mo. Core and Pro unlock premium features.
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <a
                      href="mailto:hello@locallayer.com?subject=Choose%20a%20LocalLayer%20plan"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "8px 14px",
                        borderRadius: 7,
                        background: "rgba(217,119,6,0.12)",
                        border: "1px solid rgba(217,119,6,0.3)",
                        color: "#d97706",
                        fontSize: 12,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Choose a plan →
                    </a>
                  </div>
                </>
              )}
              {showCancelWarning && (
                <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#fbbf24" }}>
                  Cancellation scheduled — your access ends {formatDate(display.renewalDate)}. Your site will go offline at that point.
                </p>
              )}
            </div>
          )}

          {/* ── Starter state info (not a warning, just context) ── */}
          {showStarterState && !hasWarning && (
            <div
              style={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border)",
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 180 }}>
                <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "var(--admin-text)" }}>
                  Your site is live.
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "var(--admin-text-muted)", lineHeight: 1.5 }}>
                  You&apos;re on the Starter plan. Upgrade to Core or Pro to unlock custom domains, Google sync, and more.
                </p>
              </div>
              <a
                href="mailto:hello@locallayer.com?subject=Upgrade%20my%20LocalLayer%20plan"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "8px 14px",
                  borderRadius: 7,
                  background: "rgba(217,119,6,0.1)",
                  border: "1px solid rgba(217,119,6,0.25)",
                  color: "#d97706",
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Upgrade →
              </a>
            </div>
          )}

          {/* ── Feature entitlements ── */}
          <div
            style={{
              background: "var(--admin-surface)",
              border: "1px solid var(--admin-border)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                padding: "11px 16px",
                borderBottom: "1px solid var(--admin-border)",
              }}
            >
              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#d97706" }}>
                Access
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>
                Feature Entitlements
              </span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--admin-text-muted)" }}>
                What your plan includes
              </span>
            </div>
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
              {ALL_ENTITLEMENT_KEYS.map((key) => {
                const included = hasEntitlement(entitlements, key);
                const meta = ENTITLEMENT_DISPLAY[key];
                const minPlan = minimumPlanForEntitlement(key);
                const minPlanName = PLAN_CONFIGS[minPlan]?.name ?? minPlan;

                return (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1px solid var(--admin-border)",
                      background: included ? "rgba(74,222,128,0.03)" : "rgba(0,0,0,0.12)",
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: included ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.06)",
                        border: `1px solid ${included ? "#4ade80" : "var(--admin-border)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 9,
                        color: included ? "#4ade80" : "var(--admin-text-muted)",
                        fontWeight: 700,
                      }}
                    >
                      {included ? "✓" : "—"}
                    </span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: included ? "var(--admin-text)" : "var(--admin-text-muted)", lineHeight: 1.3 }}>
                        {meta.label}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--admin-text-muted)", lineHeight: 1.4 }}>
                        {meta.description}
                      </p>
                    </div>

                    {!included && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--admin-text-muted)",
                          whiteSpace: "nowrap",
                          padding: "2px 6px",
                          borderRadius: 4,
                          border: "1px solid var(--admin-border)",
                        }}
                      >
                        {minPlanName}+
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Plan management / upgrade section ── */}
          <div
            style={{
              background: "var(--admin-surface)",
              border: "1px solid var(--admin-border)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                padding: "11px 16px",
                borderBottom: "1px solid var(--admin-border)",
              }}
            >
              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#d97706" }}>
                Actions
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>
                Plan Management
              </span>
            </div>
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {display.isCanceled ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-muted)", lineHeight: 1.6 }}>
                    Your subscription is canceled. Your content is preserved and you can reactivate at any time.
                  </p>
                  <a
                    href="mailto:hello@locallayer.com?subject=Reactivate%20my%20LocalLayer%20subscription"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "9px 16px",
                      borderRadius: 8,
                      background: "rgba(217,119,6,0.12)",
                      border: "1px solid rgba(217,119,6,0.3)",
                      color: "#d97706",
                      fontSize: 12.5,
                      fontWeight: 600,
                      textDecoration: "none",
                      width: "fit-content",
                    }}
                  >
                    Reactivate subscription →
                  </a>
                </div>
              ) : display.planSlug === "trial" || display.planSlug === "starter" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-muted)", lineHeight: 1.6 }}>
                    {display.isOnTrial
                      ? "Your trial includes premium features. Choose Core or Pro to keep them — or Starter to stay live for just $19.99/mo."
                      : "Upgrade to Core ($39.99/mo) to unlock custom domain and Google sync, or Pro ($79.99/mo) for the full platform."}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <a
                      href="mailto:hello@locallayer.com?subject=Upgrade%20to%20Core%20plan"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "9px 16px",
                        borderRadius: 8,
                        background: "rgba(96,165,250,0.1)",
                        border: "1px solid rgba(96,165,250,0.3)",
                        color: "#60a5fa",
                        fontSize: 12.5,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Upgrade to Core →
                    </a>
                    <a
                      href="mailto:hello@locallayer.com?subject=Upgrade%20to%20Pro%20plan"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "9px 16px",
                        borderRadius: 8,
                        background: "rgba(217,119,6,0.1)",
                        border: "1px solid rgba(217,119,6,0.25)",
                        color: "#d97706",
                        fontSize: 12.5,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Upgrade to Pro →
                    </a>
                  </div>
                </div>
              ) : display.hasProvider ? (
                <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-muted)", lineHeight: 1.6 }}>
                  Your billing is managed via {subscription?.provider ?? "your provider"}. Contact support to change your plan or payment method.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-muted)", lineHeight: 1.6 }}>
                    Your subscription is managed externally. Contact{" "}
                    <a href="mailto:hello@locallayer.com" style={{ color: "#d97706" }}>
                      hello@locallayer.com
                    </a>{" "}
                    to make changes.
                  </p>
                </div>
              )}

              {/* Downgrade / cancel action — shown for active non-starter plans */}
              {canManagePlan && (
                <div
                  style={{
                    marginTop: 4,
                    paddingTop: 12,
                    borderTop: "1px solid var(--admin-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <p style={{ margin: 0, fontSize: 11, color: "var(--admin-text-muted)" }}>
                    Need to step down or cancel?
                  </p>
                  <Link
                    href="/admin/billing/cancel"
                    style={{
                      fontSize: 11,
                      color: "var(--admin-text-muted)",
                      textDecoration: "none",
                      padding: "5px 10px",
                      borderRadius: 6,
                      border: "1px solid var(--admin-border)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    Manage subscription →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Help link */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link
              href="/admin/help/billing"
              style={{ fontSize: 11, color: "var(--admin-text-muted)", textDecoration: "none" }}
            >
              Questions about billing? View billing help →
            </Link>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
