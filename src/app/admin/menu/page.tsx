import { AdminShell } from "@/components/admin/AdminShell";
import { MenuEditorClient } from "@/components/admin/MenuEditorClient";
import { getAdminSitePayload } from "@/lib/queries";

export default async function AdminMenuPage() {
  const payload = await getAdminSitePayload();

  return (
    <AdminShell
      activeKey="menu"
      brandName={payload.brand.businessName}
      eyebrow="Menu"
      title="Menu System"
      previewHref="/menu"
      contentClassName="min-h-0 flex flex-1 flex-col overflow-hidden"
    >
      <MenuEditorClient categories={payload.menuCategories} />
    </AdminShell>
  );
}
