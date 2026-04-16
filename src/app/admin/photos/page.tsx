import { deleteGalleryImageAction, saveGalleryImageAction } from "@/app/admin/actions";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminShell } from "@/components/admin/AdminShell";
import {
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
  const livePhotoCount = payload.galleryImages.filter((image) => image.isActive).length;
  const leadImage = payload.galleryImages[0] ?? null;

  return (
    <AdminShell
      activeKey="photos"
      brandName={payload.brand.businessName}
      eyebrow="Photo Library"
      title="Gallery Control"
      description="Manage gallery assets like a media library: current images on one side, add or replace actions on the other."
      previewHref="/"
      contentClassName="min-h-0 flex flex-1 flex-col overflow-hidden"
    >
      <AdminFeedback searchParams={searchParams} />

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        <aside className="admin-panel min-h-0 overflow-hidden rounded-[1.5rem]">
          <div className="border-b border-white/[0.07] px-4 py-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
              Live Output
            </p>
            <h2 className="mt-1 text-[13px] font-medium text-white/80">Gallery snapshot</h2>
          </div>

          <div className="space-y-4 p-4 text-sm text-white/62">
            <div className="rounded-[1rem] border border-white/[0.08] bg-black/25 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/36">Status</p>
              <p className="mt-3 text-base font-semibold text-white">{livePhotoCount} photos live</p>
              <p className="mt-2 text-sm text-white/55">
                The gallery feed is pulling from the active media registry.
              </p>
            </div>

            <div className="rounded-[1rem] border border-white/[0.08] bg-black/25 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/36">Lead Asset</p>
              {leadImage ? (
                <>
                  <div className="mt-3 overflow-hidden rounded-[0.95rem] border border-white/[0.08] bg-black/30">
                    <img
                      src={leadImage.src}
                      alt={leadImage.alt}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white">{leadImage.alt}</p>
                </>
              ) : (
                <p className="mt-3 text-sm text-white/55">
                  No lead asset yet. Add a photo from the right control lane.
                </p>
              )}
            </div>

            <div className="rounded-[1rem] border border-white/[0.08] bg-black/25 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/36">Actions</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <PreviewLink href="/" label="Preview Homepage" />
              </div>
            </div>
          </div>
        </aside>

        <section className="admin-panel admin-scrollbar min-h-0 overflow-y-auto rounded-[1.5rem]">
          <div className="border-b border-white/[0.07] px-4 py-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
              Gallery Library
            </p>
            <h2 className="mt-1 text-[13px] font-medium text-white/80">Current gallery photos</h2>
            <p className="mt-1 max-w-3xl text-xs text-white/38">
              Keep the gallery clean and descriptive. Each record supports either a direct image URL or an uploaded replacement file.
            </p>
          </div>

          <div className="space-y-4 p-5">
            {payload.galleryImages.length === 0 ? (
              <div className="rounded-[1rem] border border-dashed border-white/[0.1] bg-black/20 p-5 text-sm text-white/60">
                No photos have been added yet. Use the add panel to load the first gallery image.
              </div>
            ) : null}

            {payload.galleryImages.map((image) => (
              <div
                key={image.id}
                className="rounded-[1.1rem] border border-white/[0.08] bg-black/20 p-4"
              >
                <div className="mb-4 overflow-hidden rounded-[1rem] border border-white/[0.08] bg-black/25">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-44 w-full object-cover"
                  />
                </div>

                <form action={saveGalleryImageAction} className="space-y-4">
                  <HiddenField name="redirect_to" value="/admin/photos" />
                  <HiddenField name="gallery_image_id" value={image.id} />
                  <HiddenField name="business_name" value={payload.brand.businessName} />
                  <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_120px]">
                    <AdminInput label="Photo URL" name="src" defaultValue={image.src} required />
                    <AdminInput label="Photo Description" name="alt" defaultValue={image.alt} required />
                    <AdminInput label="Order" name="sort_order" type="number" defaultValue={image.sortOrder} />
                  </div>
                  <AdminFileInput
                    label="Upload New Photo File"
                    name="photo_file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    helperText="Optional. Uploading a new file replaces the current photo URL."
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
        </section>

        <aside className="admin-panel rounded-[1.5rem]">
          <div className="border-b border-white/[0.07] px-4 py-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
              Control Stack
            </p>
            <h2 className="mt-1 text-[13px] font-medium text-white/80">Add or preview assets</h2>
          </div>

          <div className="admin-scrollbar space-y-4 overflow-y-auto p-4">
            <div className="rounded-[1rem] border border-white/[0.08] bg-black/25 p-4 text-sm text-white/62">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/36">Status</p>
              <p className="mt-3">
                {payload.galleryImages.length} photo records loaded.
              </p>
              <p className="mt-2 text-white/52">
                New uploads appear in the center registry immediately after save.
              </p>
            </div>

            <form action={saveGalleryImageAction} className="space-y-4 rounded-[1rem] border border-white/[0.08] bg-black/25 p-4">
              <HiddenField name="redirect_to" value="/admin/photos" />
              <HiddenField name="business_name" value={payload.brand.businessName} />
              <AdminInput label="Photo URL" name="src" placeholder="https://..." />
              <AdminInput label="Photo Description" name="alt" required />
              <AdminInput label="Order" name="sort_order" type="number" />
              <AdminFileInput
                label="Upload Photo File"
                name="photo_file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                helperText="Optional. If you upload a file, the photo URL can stay blank."
              />
              <AdminCheckbox label="Show this photo on the site" name="is_active" defaultChecked />
              <div className="flex flex-wrap gap-3">
                <SaveButton label="Add Photo" />
                <PreviewLink href="/" label="Preview Homepage" />
              </div>
            </form>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
