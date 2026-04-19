import { getCurrentAdminKitIdentity } from "@/lib/business";
import { getCategoryConfig } from "@/lib/kit-config";

export const dynamic = "force-dynamic";

export default async function OfferingsPage() {
  const identity = await getCurrentAdminKitIdentity();
  const config   = getCategoryConfig(identity.category);

  return (
    <div style={{ padding: "32px 28px", maxWidth: 720 }}>
      <div style={{ marginBottom: 28 }}>
        <p
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#d97706",
            margin: "0 0 6px",
          }}
        >
          {config.label}
        </p>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--admin-text)",
            margin: "0 0 6px",
            letterSpacing: "-0.02em",
          }}
        >
          Offerings
        </h1>
        <p style={{ fontSize: 13, color: "var(--admin-text-muted)", margin: 0, lineHeight: 1.5 }}>
          Add and manage the services you offer. Offerings appear on your public site and help
          potential customers understand what you do and what it costs.
        </p>
      </div>

      <div
        style={{
          padding: "40px 28px",
          borderRadius: 10,
          border: "1px dashed var(--admin-panel-border)",
          textAlign: "center",
          color: "var(--admin-text-muted)",
        }}
      >
        <p style={{ fontSize: 13, margin: "0 0 6px" }}>Offerings management coming soon.</p>
        <p style={{ fontSize: 12, margin: 0, opacity: 0.6 }}>
          You&apos;ll be able to add, edit, and reorder your service offerings here.
        </p>
      </div>
    </div>
  );
}
