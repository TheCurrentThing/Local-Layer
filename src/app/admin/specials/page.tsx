import { AdminShell } from "@/components/admin/AdminShell";
import { SpecialsEditorClient } from "@/components/admin/SpecialsEditorClient";
import { getAdminSitePayload } from "@/lib/queries";

export default async function AdminSpecialsPage() {
  const payload = await getAdminSitePayload();

  return (
    <AdminShell
      activeKey="specials"
      brandName={payload.brand.businessName}
      eyebrow="Specials"
      title="Specials"
      previewHref="/preview"
      liveHref={payload.businessSlug ? `/${payload.businessSlug}` : undefined}
      contentClassName="min-h-0 flex flex-1 flex-col overflow-hidden"
    >
      <SpecialsEditorClient
        specials={payload.specials.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          price: s.price,
          label: s.label,
          isActive: s.isActive,
          isFeatured: s.isFeatured,
          sortOrder: s.sortOrder,
        }))}
        announcement={{
          title: payload.meta.announcementTitle ?? "",
          body: payload.meta.announcementBody ?? "",
          isActive: payload.meta.announcementIsActive,
          sortOrder: payload.meta.announcementSortOrder ?? 0,
        }}
      />
    </AdminShell>
  );
}
