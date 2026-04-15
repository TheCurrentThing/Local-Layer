import { deleteGalleryImageAction, saveGalleryImageAction } from "@/app/admin/actions";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AdminCard,
  AdminCheckbox,
  AdminFileInput,
  AdminInput,
  DeleteButton,
  HiddenField,
  PreviewLink,
  SaveButton,
} from "@/components/admin/FormPrimitives";
import { getAdminSitePayload } from "@/lib/queries";

type AdminPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function AdminPhotosPage({ searchParams }: AdminPageProps) {
  const payload = await getAdminSitePayload();

  return (
    <AdminShell
      activeKey="photos"
      brandName={payload.brand.businessName}
      title="Photos"
      description="Manage gallery photos with either direct image URLs or uploaded image files."
    >
      <AdminFeedback searchParams={searchParams} />

      <AdminCard
        title="Current gallery photos"
        description="Keep the gallery clean. Use short, descriptive alt text for each photo."
      >
        <div className="space-y-4">
          {payload.galleryImages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/25 p-5 text-sm text-[var(--color-foreground)]/68">
              No photos have been added yet. Add the first gallery image below using a direct image URL.
            </div>
          ) : null}

          {payload.galleryImages.map((image) => (
            <div
              key={image.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/35 p-4"
            >
              <form action={saveGalleryImageAction} className="space-y-4">
                <HiddenField name="redirect_to" value="/admin/photos" />
                <HiddenField name="gallery_image_id" value={image.id} />
                <HiddenField
                  name="business_name"
                  value={payload.brand.businessName}
                />
                <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_120px]">
                  <AdminInput
                    label="Photo URL"
                    name="src"
                    defaultValue={image.src}
                    required
                  />
                  <AdminInput
                    label="Photo Description"
                    name="alt"
                    defaultValue={image.alt}
                    required
                  />
                  <AdminInput
                    label="Order"
                    name="sort_order"
                    type="number"
                    defaultValue={image.sortOrder}
                  />
                </div>
                <AdminFileInput
                  label="Upload New Photo File"
                  name="photo_file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  helperText="Optional. Uploading a new file will replace the current photo URL."
                />
                <div className="flex flex-wrap gap-3">
                  <AdminCheckbox
                    label="Show this photo on the site"
                    name="is_active"
                    defaultChecked={image.isActive}
                  />
                  <SaveButton label="Save Photo" />
                </div>
              </form>
              <form action={deleteGalleryImageAction} className="mt-3">
                <HiddenField name="redirect_to" value="/admin/photos" />
                <HiddenField name="gallery_image_id" value={image.id} />
                <DeleteButton label="Delete Photo" />
              </form>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard
        title="Add a new photo"
        description="Upload a photo file or paste a direct image URL."
      >
        <form action={saveGalleryImageAction} className="space-y-4">
          <HiddenField name="redirect_to" value="/admin/photos" />
          <HiddenField
            name="business_name"
            value={payload.brand.businessName}
          />
          <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_120px]">
            <AdminInput
              label="Photo URL"
              name="src"
              placeholder="https://..."
            />
            <AdminInput label="Photo Description" name="alt" required />
            <AdminInput label="Order" name="sort_order" type="number" />
          </div>
          <AdminFileInput
            label="Upload Photo File"
            name="photo_file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            helperText="Optional. If you upload a file, you can leave the photo URL blank."
          />
          <div className="flex flex-wrap gap-3">
            <AdminCheckbox
              label="Show this photo on the site"
              name="is_active"
              defaultChecked
            />
            <SaveButton label="Add Photo" />
            <PreviewLink href="/" label="Preview Homepage" />
          </div>
        </form>
      </AdminCard>
    </AdminShell>
  );
}
