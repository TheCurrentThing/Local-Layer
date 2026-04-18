import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getCurrentAdminKitType, getCurrentAdminBusinessId } from "@/lib/business";
import { getAdminUser } from "@/lib/admin-auth";
import { getBusinessSubscription } from "@/lib/billing-queries";
import type { AdminSectionKey } from "@/types/admin";
import type { KitType } from "@/types/kit";
import type { PlanSlug, SubscriptionStatus } from "@/types/billing";

export async function AdminShell({
  title,
  description,
  children,
  brandName,
  activeKey: _activeKey,
  eyebrow,
  mainClassName: _mainClassName,
  contentClassName,
  previewHref,
  liveHref,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  brandName: string;
  activeKey: AdminSectionKey;
  eyebrow?: string;
  mainClassName?: string;
  contentClassName?: string;
  previewHref?: string;
  liveHref?: string;
}) {
  let kitType: KitType = "restaurant";
  let userEmail: string | null = null;
  let planSlug: PlanSlug = "starter";
  let planStatus: SubscriptionStatus = "active";

  try {
    kitType = await getCurrentAdminKitType();
  } catch {
    // Supabase not configured — full sidebar is safe fallback
  }

  try {
    const user = await getAdminUser();
    userEmail = user?.email ?? null;
  } catch {
    // Auth not configured — sidebar renders without user info
  }

  try {
    const businessId = await getCurrentAdminBusinessId();
    const subscription = await getBusinessSubscription(businessId);
    if (subscription) {
      planSlug = subscription.planSlug;
      planStatus = subscription.status;
    }
  } catch {
    // Billing not configured — free tier is correct default
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        overflow: "hidden",
        background: "var(--admin-bg)",
        color: "var(--admin-text)",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <AdminSidebar
        brandName={brandName}
        kitType={kitType}
        userEmail={userEmail}
        planSlug={planSlug}
        planStatus={planStatus}
        persistenceEnabled={isSupabaseConfigured()}
      />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <AdminHeader
          eyebrow={eyebrow ?? title}
          title={title}
          description={description}
          previewHref={previewHref ?? "/preview"}
          liveHref={liveHref}
        />

        <main
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            padding: "12px",
          }}
          className={["admin-main", contentClassName].filter(Boolean).join(" ")}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
