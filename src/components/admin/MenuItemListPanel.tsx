import Link from "next/link";
import type { MenuCategory } from "@/types/menu";

export function MenuItemListPanel({
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
          Create a section first, then the items for that section will show up here.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-white/86 shadow-panel">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
            Items
          </p>
          <p className="mt-1 text-sm text-[var(--color-foreground)]/62">
            One section at a time.
          </p>
        </div>
        <Link
          href={`/admin/menu?category=${category.id}&item=new`}
          className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
        >
          Add Item
        </Link>
      </div>

      <div className="space-y-2 p-3">
        {category.items.length > 0 ? (
          category.items.map((item) => {
            const isSelected = item.id === selectedItemId;

            return (
              <Link
                key={item.id}
                href={`/admin/menu?category=${category.id}&item=${item.id}`}
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
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
                      ${item.price.toFixed(2)}
                      {item.isFeatured ? " - Featured" : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap justify-end gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
                    <span
                      className={[
                        "rounded-full px-2.5 py-1",
                        item.isActive
                          ? "bg-[color:rgba(33,115,70,0.12)] text-[color:#1f6b42]"
                          : "bg-[var(--color-muted)] text-[var(--color-foreground)]/68",
                      ].join(" ")}
                    >
                      {item.isActive ? "Live" : "Hidden"}
                    </span>
                    {item.isSoldOut ? (
                      <span className="rounded-full bg-[color:rgba(128,58,34,0.14)] px-2.5 py-1 text-[color:#7c3a22]">
                        Sold Out
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/20 px-4 py-5 text-sm text-[var(--color-foreground)]/68">
            No items yet. Add your first item.
          </div>
        )}
      </div>
    </section>
  );
}
