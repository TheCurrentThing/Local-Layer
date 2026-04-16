import { saveBrandingAction } from "@/app/admin/actions";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { BrandingThemeForm } from "@/components/admin/BrandingThemeForm";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AdminCard,
  HiddenField,
} from "@/components/admin/FormPrimitives";
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
      title="Branding"
      description="Update how the restaurant looks and feels. This is the place for the business name, logo, colors, and typography."
    >
      <AdminFeedback searchParams={searchParams} />

      <AdminCard
        title="Business look and feel"
        description="Choose a style that fits the restaurant, preview it instantly, and save it when you're ready."
      >
        <form action={saveBrandingAction} className="space-y-4">
          <HiddenField name="redirect_to" value="/admin/branding" />
          {payload.brand.logoUrl ? (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
                Current Logo
              </p>
              <img
                src={payload.brand.logoUrl}
                alt={`${payload.brand.businessName} logo`}
                className="mt-3 max-h-20 w-auto rounded-xl bg-white p-2"
              />
            </div>
          ) : null}
          <BrandingThemeForm
            initialBrand={{
              businessName: payload.brand.businessName,
              tagline: payload.brand.tagline,
              logoUrl: payload.brand.logoUrl,
              themeMode: payload.brand.themeMode,
              themePresetId: payload.brand.themePresetId,
              themeTokens: payload.brand.themeTokens,
            }}
          />
        </form>
      </AdminCard>
    </AdminShell>
  );
}
