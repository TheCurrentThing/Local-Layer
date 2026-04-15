import Link from "next/link";
import { deleteCategoryAction } from "@/app/admin/actions";
import { DeleteButton, HiddenField } from "@/components/admin/FormPrimitives";
import type { MenuCategory } from "@/types/menu";

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

export function MenuSectionCard({ category }: { category: MenuCategory }) {
  const previewItems = category.items.slice(0, 3);

  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-white/88 p-4 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-2xl text-[var(--color-foreground)]">
            {category.name}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-foreground)]/62">
            {category.items.length} items • {getServiceWindowLabel(category.serviceWindow)}
          </p>
        </div>
        <div
          className={[
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
            category.isActive
              ? "bg-[color:rgba(33,115,70,0.12)] text-[color:#1f6b42]"
              : "bg-[var(--color-muted)] text-[var(--color-foreground)]/70",
          ].join(" ")}
        >
          {category.isActive ? "Live" : "Hidden"}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
        <span className="rounded-full bg-[var(--color-muted)] px-3 py-1 text-[var(--color-foreground)]/72">
          Order {category.sortOrder}
        </span>
        {category.description?.trim() ? (
          <span className="rounded-full bg-[color:rgba(165,60,47,0.08)] px-3 py-1 text-[var(--brand-primary)]">
            Has description
          </span>
        ) : null}
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/18 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
          Items Preview
        </p>
        {previewItems.length > 0 ? (
          <div className="mt-2 space-y-1.5 text-sm text-[var(--color-foreground)]/72">
            {previewItems.map((item) => (
              <p key={item.id}>
                {item.name} • ${item.price.toFixed(2)}
              </p>
            ))}
            {category.items.length > previewItems.length ? (
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-foreground)]/55">
                +{category.items.length - previewItems.length} more
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-2 text-sm text-[var(--color-foreground)]/62">
            No items yet.
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/admin/menu/${category.id}`}
          className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
        >
          Edit
        </Link>
        <Link
          href={`/admin/menu/${category.id}?item=new`}
          className="inline-flex items-center justify-center rounded-xl border border-[var(--brand-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--brand-primary)] transition hover:bg-[color:rgba(165,60,47,0.08)]"
        >
          Add Item
        </Link>
        <form action={deleteCategoryAction}>
          <HiddenField name="redirect_to" value="/admin/menu" />
          <HiddenField name="category_id" value={category.id} />
          <DeleteButton label="Delete" />
        </form>
      </div>
    </div>
  );
}
