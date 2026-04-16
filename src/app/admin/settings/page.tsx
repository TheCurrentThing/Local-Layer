import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionVisibilityEditor } from "@/components/admin/SectionVisibilityEditor";
import { PageLink } from "@/components/admin/FormPrimitives";
import { getAdminSitePayload } from "@/lib/queries";

type AdminPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function AdminSettingsPage({ searchParams }: AdminPageProps) {
  const payload = await getAdminSitePayload();
  const enabledCount = [
    payload.features.showSpecials,
    payload.features.showGallery,
    payload.features.showTestimonials,
    payload.features.showMap,
    payload.features.showOnlineOrdering,
    payload.features.showStickyMobileBar,
    payload.features.showBreakfastMenu,
    payload.features.showLunchMenu,
    payload.features.showDinnerMenu,
  ].filter(Boolean).length;

  return (
    <AdminShell
      activeKey="settings"
      brandName={payload.brand.businessName}
      eyebrow="System Settings"
      title="Visibility Control"
      description="Use this screen for site-wide switches that shape what guests can see across navigation, utility actions, and supporting sections."
      contentClassName="min-h-0 flex flex-1 flex-col overflow-hidden"
    >
      <AdminFeedback searchParams={searchParams} />

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)_340px]">
        <aside className="admin-panel rounded-[1.5rem]">
          <div className="border-b border-white/[0.07] px-4 py-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
              System State
            </p>
            <h2 className="mt-1 text-[13px] font-medium text-white/80">Visibility snapshot</h2>
          </div>

          <div className="space-y-4 p-4 text-sm text-white/62">
            <div className="rounded-[1rem] border border-white/[0.08] bg-black/25 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/36">Enabled</p>
              <p className="mt-3 text-base font-semibold text-white">{enabledCount} system switches live</p>
            </div>
            <div className="rounded-[1rem] border border-white/[0.08] bg-black/25 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/36">Homepage</p>
              <p className="mt-3">Specials: {payload.features.showSpecials ? "Visible" : "Hidden"}</p>
              <p className="mt-1">Gallery: {payload.features.showGallery ? "Visible" : "Hidden"}</p>
              <p className="mt-1">Map: {payload.features.showMap ? "Visible" : "Hidden"}</p>
            </div>
            <div className="rounded-[1rem] border border-white/[0.08] bg-black/25 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/36">Utility</p>
              <p className="mt-3">
                Ordering links: {payload.features.showOnlineOrdering ? "On" : "Off"}
              </p>
              <p className="mt-1">
                Mobile bar: {payload.features.showStickyMobileBar ? "On" : "Off"}
              </p>
            </div>
          </div>
        </aside>

        <div className="admin-scrollbar min-h-0 overflow-y-auto pr-1">
          <SectionVisibilityEditor
            title="Site-wide display settings"
            description="These options affect navigation, menu timing, maps, and mobile action buttons."
            features={payload.features}
            redirectPath="/admin/settings"
          />
        </div>

        <aside className="admin-panel rounded-[1.5rem]">
          <div className="border-b border-white/[0.07] px-4 py-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
              Operator Notes
            </p>
            <h2 className="mt-1 text-[13px] font-medium text-white/80">System guidance</h2>
          </div>

          <div className="space-y-4 p-4 text-sm text-white/62">
            <div className="rounded-[1rem] border border-white/[0.08] bg-black/25 p-4">
              The admin edits the live website directly. There is no separate draft layer yet.
            </div>
            <div className="rounded-[1rem] border border-white/[0.08] bg-black/25 p-4">
              Photos accept either direct image URLs or uploaded image files.
            </div>
            <div className="rounded-[1rem] border border-white/[0.08] bg-black/25 p-4">
              Admin login protection is still placeholder-level and should be hardened before public exposure.
            </div>
            <div className="flex flex-wrap gap-3">
              <PageLink href="/admin/setup" label="Open Setup Wizard" />
              <PageLink href="/admin/homepage" label="Manage Homepage" />
            </div>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
