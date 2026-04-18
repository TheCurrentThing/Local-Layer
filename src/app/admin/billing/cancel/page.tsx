import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentAdminBusinessId } from "@/lib/business";
import { getAdminSitePayload } from "@/lib/queries";
import { getBusinessSubscription, deriveDisplayState } from "@/lib/billing-queries";
import { CancelFlow } from "@/components/admin/CancelFlow";

export const dynamic = "force-dynamic";

export default async function AdminBillingCancelPage() {
  const payload = await getAdminSitePayload();
  const businessId = await getCurrentAdminBusinessId();
  const subscription = await getBusinessSubscription(businessId);
  const display = deriveDisplayState(subscription);

  const { brand, businessSlug } = payload;
  const subdomainUrl = businessSlug ? `${businessSlug}.locallayer.com` : "your site";

  return (
    <AdminShell
      activeKey="billing"
      brandName={brand.businessName}
      eyebrow="Billing"
      title="Manage Subscription"
      description="Review your options before making any changes."
      liveHref={businessSlug ? `/${businessSlug}` : undefined}
    >
      <CancelFlow
        currentPlanName={display.planName}
        currentPlanSlug={display.planSlug}
        subdomainUrl={subdomainUrl}
      />
    </AdminShell>
  );
}
