import { AdminShell } from "@/components/admin/AdminShell";
import { PhotosEditorClient } from "@/components/admin/PhotosEditorClient";
import { getAdminSitePayload } from "@/lib/queries";

export default async function AdminPhotosPage() {
  const payload = await getAdminSitePayload();

  return (
    <AdminShell
      activeKey="photos"
      brandName={payload.brand.businessName}
      eyebrow="Photos"
      title="Photo Library"
      previewHref="/preview"
      liveHref={payload.businessSlug ? `/${payload.businessSlug}` : undefined}
      contentClassName="min-h-0 flex flex-1 flex-col overflow-hidden"
    >
      <PhotosEditorClient
        images={payload.galleryImages.map((img) => ({
          id: img.id,
          src: img.src,
          alt: img.alt,
          isActive: img.isActive,
          sortOrder: img.sortOrder,
        }))}
        businessName={payload.brand.businessName}
      />
    </AdminShell>
  );
}
