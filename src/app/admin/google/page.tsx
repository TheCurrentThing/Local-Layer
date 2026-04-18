import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSitePayload } from "@/lib/queries";
import { getGooglePresenceState } from "@/lib/google-queries";
import { getCurrentAdminBusinessId } from "@/lib/business";
import { isGoogleConfigured } from "@/lib/google-client";
import { isSupabaseConfigured } from "@/lib/supabase";
import { GooglePresenceClient } from "./GooglePresenceClient";

export const dynamic = "force-dynamic";

export default async function AdminGooglePage({
  searchParams,
}: {
  searchParams?: Record<string, string>;
}) {
  const payload = await getAdminSitePayload();

  let presenceState = null;
  let googleConfigured = false;

  try {
    googleConfigured = isGoogleConfigured();

    if (isSupabaseConfigured()) {
      const businessId = await getCurrentAdminBusinessId();
      presenceState = await getGooglePresenceState(businessId);
    }
  } catch {
    // Non-fatal — page renders with empty state
  }

  const statusMsg = searchParams?.status ?? null;
  const errorMsg = searchParams?.error ?? null;

  return (
    <AdminShell
      activeKey="google"
      brandName={payload.brand.businessName}
      eyebrow="Google"
      title="Google Presence"
      previewHref="/preview"
      liveHref={payload.businessSlug ? `/${payload.businessSlug}` : undefined}
    >
      <GooglePresenceClient
        presenceState={presenceState}
        googleConfigured={googleConfigured}
        statusMsg={statusMsg}
        errorMsg={errorMsg}
      />
    </AdminShell>
  );
}
