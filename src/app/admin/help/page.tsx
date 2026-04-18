import { AdminShell } from "@/components/admin/AdminShell";
import { HelpCategoryGrid } from "@/components/admin/HelpCategoryGrid";
import { getCurrentAdminBusinessId } from "@/lib/business";
import { getAdminSitePayload } from "@/lib/queries";
import { HELP_CATEGORIES } from "@/content/help";

export const dynamic = "force-dynamic";

export default async function AdminHelpPage() {
  const payload = await getAdminSitePayload();
  const _businessId = await getCurrentAdminBusinessId();

  const { brand, businessSlug } = payload;

  return (
    <AdminShell
      activeKey="help"
      brandName={brand.businessName}
      eyebrow="Platform"
      title="Help"
      description="Guides, tips, and answers for getting the most out of LocalLayer."
      liveHref={businessSlug ? `/${businessSlug}` : undefined}
    >
      <div
        className="admin-scrollbar"
        style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}
      >
        {/* ── Intro ── */}
        <div
          style={{
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
            borderRadius: 12,
            padding: "16px 18px",
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: "var(--admin-text)", lineHeight: 1.7 }}>
            Welcome to LocalLayer Help. Browse the topics below or email{" "}
            <a href="mailto:hello@locallayer.com" style={{ color: "#d97706", textDecoration: "none", fontWeight: 500 }}>
              hello@locallayer.com
            </a>{" "}
            if you can't find what you're looking for.
          </p>
        </div>

        {/* ── Category grid ── */}
        <HelpCategoryGrid categories={HELP_CATEGORIES} />

        {/* ── Direct contact ── */}
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
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "var(--admin-text)" }}>
              Still need help?
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "var(--admin-text-muted)", lineHeight: 1.5 }}>
              We're a small team and we reply to every email. You'll hear from a real person.
            </p>
          </div>
          <a
            href="mailto:hello@locallayer.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 14px",
              borderRadius: 8,
              background: "rgba(217,119,6,0.1)",
              border: "1px solid rgba(217,119,6,0.25)",
              color: "#d97706",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Email support →
          </a>
        </div>
      </div>
    </AdminShell>
  );
}
