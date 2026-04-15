import Link from "next/link";
import { saveCategoryAction } from "@/app/admin/actions";
import {
  AdminCheckbox,
  AdminInput,
  AdminSelect,
  AdminTextarea,
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

function getServiceWindowLabel(value?: MenuCategory["serviceWindow"]) {
  switch (value) {
    case "breakfast":
      return "Breakfast";
    case "lunch":
      return "Lunch";
    case "dinner":
      return "Dinner";
    default:
      return "All day";
  }
}

export function MenuSectionList({
  categories,
  selectedCategoryId,
}: {
  categories: MenuCategory[];
  selectedCategoryId: string | null;
}) {
  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-white/86 shadow-panel">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
            Menu Sections
          </p>
          <p className="mt-1 text-sm text-[var(--color-foreground)]/62">
            Pick a section first.
          </p>
        </div>
        <details className="relative">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full bg-[var(--brand-primary)] text-xl font-semibold text-white shadow-sm">
            +
          </summary>
          <div className="absolute right-0 top-12 z-20 w-[320px] rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-xl">
            <form action={saveCategoryAction} className="space-y-4">
              <HiddenField name="redirect_to" value="/admin/menu" />
              <AdminInput label="Section Name" name="name" required />
              <AdminInput label="Section Slug" name="slug" placeholder="optional" />
              <AdminSelect
                label="Menu Timing"
                name="service_window"
                defaultValue="all-day"
                options={serviceWindowOptions}
              />
              <AdminTextarea
                label="Short Description"
                name="description"
                rows={3}
              />
              <div className="grid gap-3 sm:grid-cols-[110px_1fr]">
                <AdminInput label="Order" name="sort_order" type="number" />
                <AdminCheckbox
                  label="Show this section on the site"
                  name="is_active"
                  defaultChecked
                />
              </div>
              <SaveButton label="Add Section" />
            </form>
          </div>
        </details>
      </div>

      <div className="space-y-2 p-3">
        {categories.length > 0 ? (
          categories.map((category) => {
            const isSelected = category.id === selectedCategoryId;

            return (
              <Link
                key={category.id}
                href={`/admin/menu?category=${category.id}`}
                className={[
                  "block rounded-2xl border px-4 py-3 transition",
                  isSelected
                    ? "border-[var(--brand-primary)] bg-[color:rgba(165,60,47,0.08)]"
                    : "border-[var(--color-border)] bg-[var(--color-muted)]/20 hover:bg-[var(--color-muted)]/42",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--color-foreground)]">
                      {category.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
                      {category.items.length} items - {getServiceWindowLabel(category.serviceWindow)}
                    </p>
                  </div>
                  <span
                    className={[
                      "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                      category.isActive
                        ? "bg-[color:rgba(33,115,70,0.12)] text-[color:#1f6b42]"
                        : "bg-[var(--color-muted)] text-[var(--color-foreground)]/68",
                    ].join(" ")}
                  >
                    {category.isActive ? "Live" : "Hidden"}
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/20 px-4 py-5 text-sm text-[var(--color-foreground)]/68">
            No menu sections yet. Use the + button here to add the first one.
          </div>
        )}
      </div>
    </section>
  );
}
