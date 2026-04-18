import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentAdminBusinessId } from "@/lib/business";
import { getAdminSitePayload } from "@/lib/queries";
import { getBusinessEntitlements, hasEntitlement } from "@/lib/entitlements";
import { minimumPlanForEntitlement, PLAN_CONFIGS } from "@/lib/plan-config";

export const dynamic = "force-dynamic";

function DomainRow({
  type,
  value,
  status,
  note,
}: {
  type: string;
  value: string;
  status: "active" | "inactive" | "locked";
  note?: string;
}) {
  const statusConfig = {
    active: { color: "#4ade80", label: "Active" },
    inactive: { color: "var(--admin-text-muted)", label: "Not configured" },
    locked: { color: "#6b7280", label: "Locked" },
  };
  const s = statusConfig[status];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 8,
        border: "1px solid var(--admin-border)",
        background: status === "active" ? "rgba(74,222,128,0.03)" : "rgba(0,0,0,0.12)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--admin-text-muted)", marginBottom: 4 }}>
          {type}
        </p>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: status === "locked" ? "var(--admin-text-muted)" : "var(--admin-text)", fontFamily: "ui-monospace, monospace" }}>
          {value}
        </p>
        {note && (
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--admin-text-muted)", lineHeight: 1.5 }}>
            {note}
          </p>
        )}
      </div>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "3px 8px",
          borderRadius: 5,
          fontSize: 9,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: s.color,
          background: `${s.color}18`,
          border: `1px solid ${s.color}30`,
          flexShrink: 0,
        }}
      >
        {s.label}
      </span>
    </div>
  );
}

function UpgradePrompt({ featureLabel, minPlan }: { featureLabel: string; minPlan: string }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: 8,
        background: "rgba(217,119,6,0.05)",
        border: "1px solid rgba(217,119,6,0.15)",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "var(--admin-text)" }}>
          {featureLabel}
        </p>
        <p style={{ margin: "3px 0 0", fontSize: 11, color: "var(--admin-text-muted)" }}>
          Available on {minPlan} and above.
        </p>
      </div>
      <Link
        href="/admin/billing"
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "7px 13px",
          borderRadius: 7,
          background: "rgba(217,119,6,0.12)",
          border: "1px solid rgba(217,119,6,0.3)",
          color: "#d97706",
          fontSize: 11,
          fontWeight: 700,
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
      >
        Upgrade →
      </Link>
    </div>
  );
}

export default async function AdminDomainsPage() {
  const payload = await getAdminSitePayload();
  const businessId = await getCurrentAdminBusinessId();
  const entitlements = await getBusinessEntitlements(businessId);

  const canConnectCustom = hasEntitlement(entitlements, "custom_domain");
  const canPurchase = hasEntitlement(entitlements, "domain_purchase");

  const customDomainMinPlan = PLAN_CONFIGS[minimumPlanForEntitlement("custom_domain")].name;
  const purchasedDomainMinPlan = PLAN_CONFIGS[minimumPlanForEntitlement("domain_purchase")].name;

  const { brand, businessSlug } = payload;
  const subdomainUrl = `${businessSlug}.locallayer.com`;

  return (
    <AdminShell
      activeKey="domains"
      brandName={brand.businessName}
      eyebrow="Platform"
      title="Domains"
      description="Where your LocalLayer site is accessible."
      liveHref={businessSlug ? `/${businessSlug}` : undefined}
    >
      <div
        className="admin-scrollbar"
        style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}
      >
        {/* ── Subdomain (always active) ── */}
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
              Included
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>
              LocalLayer Subdomain
            </span>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
            <DomainRow
              type="Subdomain"
              value={subdomainUrl}
              status="active"
              note="Always active. No configuration required."
            />
            <a
              href={`https://${subdomainUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "7px 14px",
                borderRadius: 7,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--admin-border)",
                color: "var(--admin-text-muted)",
                fontSize: 11.5,
                fontWeight: 500,
                textDecoration: "none",
                width: "fit-content",
              }}
            >
              View site ↗
            </a>
          </div>
        </div>

        {/* ── Custom domain ── */}
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
              Core+
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>
              Custom Domain
            </span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--admin-text-muted)" }}>
              Connect a domain you already own
            </span>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {canConnectCustom ? (
              <>
                <DomainRow
                  type="Custom domain"
                  value="Not configured"
                  status="inactive"
                  note="Add your domain below and follow the DNS verification steps."
                />
                <p style={{ margin: 0, fontSize: 11, color: "var(--admin-text-muted)", lineHeight: 1.6 }}>
                  Custom domain connection is coming soon. Contact{" "}
                  <a href="mailto:hello@locallayer.com" style={{ color: "#d97706" }}>
                    hello@locallayer.com
                  </a>{" "}
                  to configure your domain manually in the meantime.
                </p>
              </>
            ) : (
              <UpgradePrompt
                featureLabel="Connect a domain you already own to your LocalLayer site."
                minPlan={customDomainMinPlan}
              />
            )}
          </div>
        </div>

        {/* ── Domain purchase ── */}
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
              Pro+
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>
              Domain Purchase
            </span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--admin-text-muted)" }}>
              Buy a domain through LocalLayer
            </span>
          </div>
          <div style={{ padding: 16 }}>
            {canPurchase ? (
              <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-muted)", lineHeight: 1.6 }}>
                Domain purchasing via LocalLayer is coming soon. Contact{" "}
                <a href="mailto:hello@locallayer.com" style={{ color: "#d97706" }}>
                  hello@locallayer.com
                </a>{" "}
                to purchase a domain for your account.
              </p>
            ) : (
              <UpgradePrompt
                featureLabel="Purchase and manage a domain directly through LocalLayer."
                minPlan={purchasedDomainMinPlan}
              />
            )}
          </div>
        </div>
        {/* Help link */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link
            href="/admin/help/domains"
            style={{ fontSize: 11, color: "var(--admin-text-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            Questions about domains? View domain help →
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
