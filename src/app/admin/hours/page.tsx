import { AdminShell } from "@/components/admin/AdminShell";
import { HoursEditorClient } from "@/components/admin/HoursEditorClient";
import { getAdminSitePayload } from "@/lib/queries";

export default async function AdminHoursPage() {
  const payload = await getAdminSitePayload();

  const hours = payload.hours.map((e) => ({
    id: e.id,
    dayLabel: e.dayLabel,
    openText: e.openText,
    isActive: e.isActive,
    sortOrder: e.sortOrder,
  }));

  return (
    <AdminShell
      activeKey="hours"
      brandName={payload.brand.businessName}
      eyebrow="Hours"
      title="Hours Manager"
      previewHref="/preview"
      liveHref={payload.businessSlug ? `/${payload.businessSlug}` : undefined}
      contentClassName="min-h-0 flex flex-1 flex-col overflow-hidden"
    >
      <HoursEditorClient
        hours={hours}
        quickHoursLabel={payload.settings.quickInfoHoursLabel ?? ""}
      />
    </AdminShell>
  );
}
