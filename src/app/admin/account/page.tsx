import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentAdminBusinessId } from "@/lib/business";
import { getAdminSitePayload } from "@/lib/queries";
import { getAdminUser } from "@/lib/admin-auth";
import { getBusinessSubscription } from "@/lib/billing-queries";
import { getPlanConfig } from "@/lib/plan-config";
import { getKitLabel } from "@/lib/kit-config";

export const dynamic = "force-dynamic";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 12,
        padding: "9px 12px",
        borderRadius: 8,
        border: "1px solid var(--admin-border)",
        background: "rgba(0,0,0,0.12)",
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "var(--admin-text-muted)",
          minWidth: 100,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--admin-text)" }}>
        {value}
      </span>
    </div>
  );
}

function SectionPanel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
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
        <span
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 9,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#d97706",
          }}
        >
          {eyebrow}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>
          {title}
        </span>
      </div>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        {children}
      </div>
    </div>
  );
}

export default async function AdminAccountPage() {
  const payload = await getAdminSitePayload();
  const businessId = await getCurrentAdminBusinessId();
  const user = await getAdminUser().catch(() => null);
  const subscription = await getBusinessSubscription(businessId);
  const plan = getPlanConfig(subscription?.planSlug ?? "starter");

  const { brand, kitType, rendererType, businessSlug } = payload;
  const subdomainUrl = `${businessSlug}.locallayer.com`;

  const rendererLabel =
    rendererType === "signature" ? "Signature" : "Standard";
  const rendererNote =
    rendererType === "signature"
      ? "Premium full-section layout — active on your plan."
      : "Kit-driven layout, showing sections defined for your kit type.";

  return (
    <AdminShell
      activeKey="account"
      brandName={brand.businessName}
      eyebrow="Platform"
      title="Account"
      description="Your identity, business configuration, and platform relationship."
      liveHref={businessSlug ? `/${businessSlug}` : undefined}
    >
      <div
        className="admin-scrollbar"
        style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}
      >
        {/* ── User identity ── */}
        <SectionPanel eyebrow="Identity" title="Your Account">
          <InfoRow label="Email" value={user?.email ?? <span style={{ color: "var(--admin-text-muted)" }}>Not signed in</span>} />
          <InfoRow label="User ID" value={
            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11 }}>
              {user?.id ? user.id.slice(0, 8) + "…" : "—"}
            </span>
          } />
          <InfoRow label="Plan" value={
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>{plan.name}</span>
              <Link
                href="/admin/billing"
                style={{
                  fontSize: 10,
                  color: "#d97706",
                  textDecoration: "none",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                Manage →
              </Link>
            </span>
          } />
        </SectionPanel>

        {/* ── Business identity ── */}
        <SectionPanel eyebrow="Business" title="Business Identity">
          <InfoRow label="Name" value={brand.businessName} />
          <InfoRow label="Slug" value={
            <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12 }}>
              {businessSlug || "—"}
            </span>
          } />
          <InfoRow label="Kit type" value={getKitLabel(kitType)} />
          <InfoRow label="Subdomain" value={
            <a
              href={`https://${subdomainUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#d97706", textDecoration: "none", fontFamily: "ui-monospace, monospace", fontSize: 12 }}
            >
              {subdomainUrl} ↗
            </a>
          } />
        </SectionPanel>

        {/* ── Site configuration ── */}
        <SectionPanel eyebrow="Configuration" title="Site Configuration">
          <InfoRow label="Renderer" value={
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontWeight: 600 }}>{rendererLabel}</span>
              <span style={{ fontSize: 10.5, color: "var(--admin-text-muted)", fontWeight: 400 }}>
                {rendererNote}
              </span>
            </span>
          } />
          <InfoRow label="Site status" value={
            <span style={{
              padding: "2px 8px",
              borderRadius: 5,
              fontSize: 9,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#4ade80",
              background: "rgba(74,222,128,0.1)",
            }}>
              Live
            </span>
          } />
        </SectionPanel>

        {/* ── Support ── */}
        <SectionPanel eyebrow="Support" title="Help & Support">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-muted)", lineHeight: 1.6 }}>
              Need help with your account, billing, or site configuration?
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <a
                href="mailto:hello@locallayer.com"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "7px 14px",
                  borderRadius: 7,
                  background: "rgba(217,119,6,0.1)",
                  border: "1px solid rgba(217,119,6,0.25)",
                  color: "#d97706",
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Email support
              </a>
              <Link
                href="/admin/billing"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "7px 14px",
                  borderRadius: 7,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--admin-border)",
                  color: "var(--admin-text-muted)",
                  fontSize: 12,
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                View billing
              </Link>
            </div>
          </div>
        </SectionPanel>
      </div>
    </AdminShell>
  );
}
