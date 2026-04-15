import { deleteHourAction, saveHourAction, saveQuickHoursAction } from "@/app/admin/actions";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AdminCard,
  AdminCheckbox,
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

export default async function AdminHoursPage({ searchParams }: AdminPageProps) {
  const payload = await getAdminSitePayload();

  return (
    <AdminShell
      activeKey="hours"
      brandName={payload.brand.businessName}
      title="Hours"
      description="Hours should be one of the easiest updates in the system. Change the quick summary first, then adjust the weekly schedule below."
    >
      <AdminFeedback searchParams={searchParams} />

      <AdminCard
        title="Quick hours summary"
        description="This short summary is used in high-visibility spots across the site."
      >
        <form action={saveQuickHoursAction} className="space-y-4">
          <HiddenField name="redirect_to" value="/admin/hours" />
          <AdminInput
            label="Quick Hours Summary"
            name="quick_info_hours_label"
            defaultValue={payload.settings.quickInfoHoursLabel}
            required
          />
          <div className="flex flex-wrap gap-3">
            <SaveButton label="Save Quick Summary" />
            <PreviewLink href="/" label="Preview Homepage" />
          </div>
        </form>
      </AdminCard>

      <AdminCard
        title="Weekly schedule"
        description="Use one row per day or grouped day range. Mark a row hidden if you do not want it to appear on the site."
      >
        <div className="space-y-4">
          {payload.hours.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/35 p-4"
            >
              <form action={saveHourAction} className="space-y-4">
                <HiddenField name="redirect_to" value="/admin/hours" />
                <HiddenField name="hour_id" value={entry.id} />
                <div className="grid gap-4 md:grid-cols-[1fr_1fr_120px]">
                  <AdminInput
                    label="Day or Day Range"
                    name="day_label"
                    defaultValue={entry.dayLabel}
                    required
                  />
                  <AdminInput
                    label="Open Hours"
                    name="open_text"
                    defaultValue={entry.openText}
                    required
                  />
                  <AdminInput
                    label="Order"
                    name="sort_order"
                    type="number"
                    defaultValue={entry.sortOrder}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <AdminCheckbox
                    label="Show this row on the site"
                    name="is_active"
                    defaultChecked={entry.isActive}
                  />
                  <SaveButton label="Save Hours Row" />
                </div>
              </form>
              <form action={deleteHourAction} className="mt-3">
                <HiddenField name="redirect_to" value="/admin/hours" />
                <HiddenField name="hour_id" value={entry.id} />
                <DeleteButton label="Delete Row" />
              </form>
            </div>
          ))}
        </div>

        <form
          action={saveHourAction}
          className="mt-6 space-y-4 rounded-2xl border border-dashed border-[var(--color-border)] bg-white/60 p-4"
        >
          <HiddenField name="redirect_to" value="/admin/hours" />
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_120px]">
            <AdminInput label="Day or Day Range" name="day_label" required />
            <AdminInput label="Open Hours" name="open_text" required />
            <AdminInput label="Order" name="sort_order" type="number" />
          </div>
          <div className="flex flex-wrap gap-3">
            <AdminCheckbox label="Show this row on the site" name="is_active" defaultChecked />
            <SaveButton label="Add Hours Row" />
          </div>
        </form>
      </AdminCard>
    </AdminShell>
  );
}
