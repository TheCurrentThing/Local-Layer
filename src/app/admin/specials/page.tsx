import {
  deleteSpecialAction,
  saveAnnouncementAction,
  saveSpecialAction,
} from "@/app/admin/actions";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AdminCard,
  AdminCheckbox,
  AdminInput,
  AdminTextarea,
  DeleteButton,
  HiddenField,
  PreviewLink,
  SaveButton,
} from "@/components/admin/FormPrimitives";
import { getAdminSitePayload } from "@/lib/queries";

type AdminPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function AdminSpecialsPage({
  searchParams,
}: AdminPageProps) {
  const payload = await getAdminSitePayload();
  const featuredSpecial =
    payload.specials.find((special) => special.isFeatured && special.isActive) ??
    payload.specials.find((special) => special.isActive) ??
    null;

  return (
    <AdminShell
      activeKey="specials"
      brandName={payload.brand.businessName}
      title="Specials"
      description="This page is built for the updates owners make fastest: today's special first, banner second, then the rest of the specials list."
    >
      <AdminFeedback searchParams={searchParams} />

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <AdminCard
          title="Today's focus"
          description="Put the most important special here. Guests should be able to understand it at a glance."
        >
          {featuredSpecial ? (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[color:rgba(165,60,47,0.08)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
                Featured Right Now
              </p>
              <p className="mt-2 text-2xl font-heading text-[var(--color-foreground)]">
                {featuredSpecial.title}
              </p>
              <p className="mt-2 text-sm text-[var(--color-foreground)]/72">
                {featuredSpecial.description}
              </p>
              <p className="mt-3 text-sm font-semibold text-[var(--brand-primary)]">
                {featuredSpecial.price === null
                  ? featuredSpecial.label
                  : `${featuredSpecial.label} • $${featuredSpecial.price.toFixed(2)}`}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/25 p-4 text-sm text-[var(--color-foreground)]/68">
              No featured special is live right now. Add one below and check the "Feature this special" box.
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <PreviewLink href="/" label="Preview Homepage" />
          </div>
        </AdminCard>

        <AdminCard
          title="Top announcement bar"
          description="Use this for closures, promos, holiday notices, or reminders."
        >
          <form action={saveAnnouncementAction} className="space-y-4">
            <HiddenField name="redirect_to" value="/admin/specials" />
            <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr_120px]">
              <AdminInput
                label="Announcement Label"
                name="announcement_title"
                defaultValue={payload.meta.announcementTitle}
                required
              />
              <AdminInput
                label="Announcement Text"
                name="announcement_body"
                defaultValue={payload.meta.announcementBody}
                required
              />
              <AdminInput
                label="Order"
                name="sort_order"
                type="number"
                defaultValue={payload.meta.announcementSortOrder}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <AdminCheckbox
                label="Show the announcement bar"
                name="announcement_is_active"
                defaultChecked={payload.meta.announcementIsActive}
              />
              <SaveButton label="Save Announcement" />
            </div>
          </form>
        </AdminCard>
      </div>

      <AdminCard
        title="All specials"
        description="Keep this list short and useful. The featured special should be the clearest offer on the page."
      >
        <div className="space-y-4">
          {payload.specials.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/25 p-4 text-sm text-[var(--color-foreground)]/68">
              No specials have been added yet. Use the form below to create the first one.
            </div>
          ) : null}

          {payload.specials.map((special) => (
            <div
              key={special.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/35 p-4"
            >
              <form action={saveSpecialAction} className="space-y-4">
                <HiddenField name="redirect_to" value="/admin/specials" />
                <HiddenField name="special_id" value={special.id} />
                <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_120px]">
                  <AdminInput
                    label="Special Name"
                    name="title"
                    defaultValue={special.title}
                    required
                  />
                  <AdminInput
                    label="Special Label"
                    name="label"
                    defaultValue={special.label}
                    required
                  />
                  <AdminInput
                    label="Order"
                    name="sort_order"
                    type="number"
                    defaultValue={special.sortOrder}
                  />
                </div>
                <AdminTextarea
                  label="Description"
                  name="description"
                  defaultValue={special.description}
                  required
                />
                <div className="grid gap-4 md:grid-cols-[160px_1fr_1fr]">
                  <AdminInput
                    label="Price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={special.price === null ? "" : special.price.toFixed(2)}
                  />
                  <AdminCheckbox
                    label="Show this special"
                    name="is_active"
                    defaultChecked={special.isActive}
                  />
                  <AdminCheckbox
                    label="Feature this special"
                    name="is_featured"
                    defaultChecked={special.isFeatured}
                  />
                </div>
                <SaveButton label="Save Special" />
              </form>
              <form action={deleteSpecialAction} className="mt-3">
                <HiddenField name="redirect_to" value="/admin/specials" />
                <HiddenField name="special_id" value={special.id} />
                <DeleteButton label="Delete Special" />
              </form>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard
        title="Add a special"
        description="Use this for the next item you want to promote."
      >
        <form action={saveSpecialAction} className="space-y-4">
          <HiddenField name="redirect_to" value="/admin/specials" />
          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_120px]">
            <AdminInput label="Special Name" name="title" required />
            <AdminInput label="Special Label" name="label" required />
            <AdminInput label="Order" name="sort_order" type="number" />
          </div>
          <AdminTextarea label="Description" name="description" required />
          <div className="grid gap-4 md:grid-cols-[160px_1fr_1fr]">
            <AdminInput
              label="Price"
              name="price"
              type="number"
              step="0.01"
              min="0"
            />
            <AdminCheckbox label="Show this special" name="is_active" defaultChecked />
            <AdminCheckbox label="Feature this special" name="is_featured" />
          </div>
          <SaveButton label="Add Special" />
        </form>
      </AdminCard>
    </AdminShell>
  );
}
