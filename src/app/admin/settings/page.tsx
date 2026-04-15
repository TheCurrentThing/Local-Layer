import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionVisibilityEditor } from "@/components/admin/SectionVisibilityEditor";
import { AdminCard, PageLink } from "@/components/admin/FormPrimitives";
import { getAdminSitePayload } from "@/lib/queries";

type AdminPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function AdminSettingsPage({ searchParams }: AdminPageProps) {
  const payload = await getAdminSitePayload();

  return (
    <AdminShell
      activeKey="settings"
      brandName={payload.brand.businessName}
      title="Settings"
      description="Use this page for the site-wide switches that control what customers can see across the public website."
    >
      <AdminFeedback searchParams={searchParams} />

      <SectionVisibilityEditor
        title="Site-wide display settings"
        description="These options affect navigation, menu timing, maps, and mobile action buttons."
        features={payload.features}
        redirectPath="/admin/settings"
      />

      <AdminCard
        title="Helpful notes"
        description="A few settings are still intentionally simple."
      >
        <ul className="space-y-3 text-sm text-[var(--color-foreground)]/70">
          <li>
            The admin currently edits the live website directly. There is no separate draft mode yet.
          </li>
          <li>
            The Photos page now accepts either image uploads or direct image URLs.
          </li>
          <li>
            Admin login protection is still a placeholder and should be completed before exposing the admin publicly.
          </li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <PageLink href="/admin/setup" label="Open Setup Wizard" />
          <PageLink href="/admin/homepage" label="Manage Homepage" />
        </div>
      </AdminCard>
    </AdminShell>
  );
}
