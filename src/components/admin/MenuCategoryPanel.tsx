import { deleteCategoryAction, saveCategoryAction } from "@/app/admin/actions";
import {
  AdminCheckbox,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  DeleteButton,
  HiddenField,
  SaveButton,
} from "@/components/admin/FormPrimitives";
import type { MenuCategory } from "@/types/menu";

const serviceWindowOptions = [
  { value: "all-day", label: "All day" },
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
];

export function MenuCategoryPanel({
  category,
  selectedItemId,
}: {
  category: MenuCategory | null;
  selectedItemId: string | null;
}) {
  if (!category) {
    return (
      <section className="rounded-3xl border border-[var(--color-border)] bg-white/86 p-5 shadow-panel">
        <p className="text-sm text-[var(--color-foreground)]/68">
          Start by adding a menu section on the left.
        </p>
      </section>
    );
  }

  const redirectPath = `/admin/menu?category=${category.id}${selectedItemId ? `&item=${selectedItemId}` : ""}`;

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-white/86 shadow-panel">
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
          Selected Section
        </p>
        <h2 className="mt-1 font-heading text-2xl text-[var(--color-foreground)]">
          {category.name}
        </h2>
      </div>

      <div className="space-y-4 p-5">
        <form action={saveCategoryAction} className="space-y-4">
          <HiddenField name="redirect_to" value={redirectPath} />
          <HiddenField name="category_id" value={category.id} />

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.9fr]">
            <AdminInput
              label="Section Name"
              name="name"
              defaultValue={category.name}
              required
            />
            <AdminSelect
              label="Menu Timing"
              name="service_window"
              defaultValue={category.serviceWindow ?? "all-day"}
              options={serviceWindowOptions}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_120px]">
            <AdminInput
              label="Section Slug"
              name="slug"
              defaultValue={category.slug}
              required
            />
            <AdminInput
              label="Order"
              name="sort_order"
              type="number"
              defaultValue={category.sortOrder}
            />
          </div>

          <AdminTextarea
            label="Short Description"
            name="description"
            defaultValue={category.description ?? ""}
            rows={3}
          />

          <div className="flex flex-wrap items-center gap-3">
            <AdminCheckbox
              label="Show this section on the site"
              name="is_active"
              defaultChecked={category.isActive}
            />
            <SaveButton label="Save Section" />
          </div>
        </form>

        <form action={deleteCategoryAction}>
          <HiddenField name="redirect_to" value="/admin/menu" />
          <HiddenField name="category_id" value={category.id} />
          <DeleteButton label="Delete Section" />
        </form>
      </div>
    </section>
  );
}
