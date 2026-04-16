import Link from "next/link";
import { TrashSimple } from "@phosphor-icons/react/dist/ssr";
import { deleteCategoryAction, saveCategoryAction } from "@/app/admin/actions";
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
    <section className="admin-panel min-h-0 overflow-hidden rounded-[1.5rem]">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
            Categories
          </p>
          <p className="mt-2 text-sm text-white/45">Select the category lane first.</p>
        </div>
        <details className="relative">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-[0.95rem] border border-[var(--color-primary)] bg-[var(--color-primary)] text-xl font-semibold text-white shadow-[0_0_24px_rgba(181,84,61,0.18)] transition hover:opacity-95">
            +
          </summary>
          <div className="admin-panel absolute right-0 top-12 z-20 w-[320px] rounded-[1.2rem] p-4 shadow-xl">
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

      <div className="admin-scrollbar min-h-0 space-y-2 overflow-y-auto p-3">
        {categories.length > 0 ? (
          categories.map((category) => {
            const isSelected = category.id === selectedCategoryId;

            return (
              <div
                key={category.id}
                className={[
                  "admin-panel admin-panel-hover flex items-start rounded-[1rem]",
                  isSelected
                    ? "border-[var(--color-primary)] bg-[linear-gradient(180deg,rgba(181,84,61,0.16),rgba(181,84,61,0.05))]"
                    : "border-white/[0.08] bg-black/20",
                ].join(" ")}
              >
                <Link
                  href={`/admin/menu?category=${category.id}`}
                  className="flex-1 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/34">
                        {category.slug || "category"}
                      </p>
                      <p className="mt-1 truncate font-semibold text-white">{category.name}</p>
                      <p className="mt-1 text-xs text-white/55">
                        {category.items.length} items // {getServiceWindowLabel(category.serviceWindow)}
                      </p>
                    </div>
                    <span
                      className={[
                        "shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]",
                        category.isActive
                          ? "bg-[color:rgba(33,115,70,0.16)] text-emerald-300"
                          : "bg-white/[0.06] text-white/50",
                      ].join(" ")}
                    >
                      {category.isActive ? "Live" : "Hidden"}
                    </span>
                  </div>
                </Link>

                <div className="flex shrink-0 items-center px-3 py-3">
                  <form action={deleteCategoryAction}>
                    <HiddenField name="redirect_to" value="/admin/menu" />
                    <HiddenField name="category_id" value={category.id} />
                    <button
                      type="submit"
                      title="Delete category"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-400/25 bg-red-500/10 text-red-300/60 transition hover:border-red-400/45 hover:bg-red-500/18 hover:text-red-200"
                    >
                      <TrashSimple size={13} />
                    </button>
                  </form>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[1rem] border border-dashed border-white/[0.1] bg-black/20 px-4 py-5 text-sm text-white/50">
            No menu sections yet. Use the + button here to add the first one.
          </div>
        )}
      </div>
    </section>
  );
}

