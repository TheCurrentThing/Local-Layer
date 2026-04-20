export const dynamic = "force-dynamic";

import { saveBrandingAction } from "@/app/admin/actions";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { BrandingThemeForm } from "@/components/admin/BrandingThemeForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { HiddenField } from "@/components/admin/FormPrimitives";
import { getAdminSitePayload } from "@/lib/queries";

type AdminPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function AdminBrandingPage({ searchParams }: AdminPageProps) {
  const payload = await getAdminSitePayload();

  return (
    <AdminShell
      activeKey="branding"
      brandName={payload.brand.businessName}
      eyebrow="Brand Identity System"
      title="Identity Terminal"
      description="Keep theme selection, live preview, and save controls visible at once. Choose a direction, inspect it in context, then commit only when the identity feels right."
      previewHref="/preview"
      liveHref={payload.businessSlug ? `/${payload.businessSlug}` : undefined}
      contentClassName="min-h-0 flex flex-1 flex-col overflow-hidden"
    >
      <AdminFeedback searchParams={searchParams} />

      <form action={saveBrandingAction} className="min-h-0 flex flex-1 flex-col overflow-hidden">
        <HiddenField name="redirect_to" value="/admin/branding" />
        <BrandingThemeForm
          key={payload.businessSlug}
          payload={payload}
          initialBrand={{
            businessName: payload.brand.businessName,
            tagline: payload.brand.tagline,
            logoUrl: payload.brand.logoUrl,
            themeMode: payload.brand.themeMode,
            themePresetId: payload.brand.themePresetId,
            themeTokens: payload.brand.themeTokens,
            heroEyebrow: payload.settings.heroEyebrow,
            heroHeadline: payload.settings.heroHeadline,
            heroSubheadline: payload.settings.heroSubheadline,
            heroImageUrl: payload.homePage.heroImageUrl ?? null,
            heroPrimaryCtaLabel: payload.settings.heroPrimaryCtaLabel,
            heroSecondaryCtaLabel: payload.settings.heroSecondaryCtaLabel,
          }}
        />
      </form>
    </AdminShell>
  );
}

