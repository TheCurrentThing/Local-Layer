import Link from "next/link";
import { TrashSimple } from "@phosphor-icons/react/dist/ssr";
import { deleteMenuItemAction } from "@/app/admin/actions";
import { HiddenField } from "@/components/admin/FormPrimitives";
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
      <section className="admin-panel rounded-[1.5rem] p-5">
        <p className="text-sm text-white/50">
          Create a category first, then the item registry will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="admin-panel min-h-0 overflow-hidden rounded-[1.5rem]">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
            Item Registry
          </p>
          <p className="mt-2 text-sm text-white/45">
            Terminal view for {category.name} items.
          </p>
        </div>
        <Link
          href={`/admin/menu?category=${category.id}&item=new`}
          className="rounded-[0.95rem] border border-[var(--color-primary)] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(181,84,61,0.18)] transition hover:opacity-95"
        >
          Add Item
        </Link>
      </div>

      <div className="grid grid-cols-[minmax(0,1.5fr)_110px_110px_90px_44px] gap-3 border-b border-white/[0.08] px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/36">
        <span>Name</span>
        <span className="text-right">Price</span>
        <span className="text-right">Status</span>
        <span className="text-right">Focus</span>
        <span></span>
      </div>

      <div className="admin-scrollbar min-h-0 overflow-y-auto">
        {category.items.length > 0 ? (
          category.items.map((item) => {
            const isSelected = item.id === selectedItemId;

            return (
              <div
                key={item.id}
                className={[
                  "flex items-stretch border-b border-white/[0.06] transition",
                  isSelected
                    ? "bg-[linear-gradient(90deg,rgba(181,84,61,0.18),rgba(181,84,61,0.04))]"
                    : "hover:bg-white/[0.03]",
                ].join(" ")}
              >
                <Link
                  href={`/admin/menu?category=${category.id}&item=${item.id}`}
                  className="grid flex-1 grid-cols-[minmax(0,1.5fr)_110px_110px_90px] gap-3 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{item.name}</p>
                    <p className="mt-1 truncate text-xs text-white/48">{item.description}</p>
                  </div>

                  <div className="text-right text-sm font-semibold text-white">
                    ${item.price.toFixed(2)}
                  </div>

                  <div className="text-right">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]",
                        item.isActive
                          ? "bg-emerald-400/15 text-emerald-200"
                          : "bg-white/[0.06] text-white/45",
                      ].join(" ")}
                    >
                      {item.isSoldOut ? "Sold Out" : item.isActive ? "Live" : "Hidden"}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]",
                        item.isFeatured
                          ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                          : "bg-white/[0.05] text-white/38",
                      ].join(" ")}
                    >
                      {item.isFeatured ? "Primary" : "--"}
                    </span>
                  </div>
                </Link>

                <div className="flex w-[44px] items-center justify-center">
                  <form action={deleteMenuItemAction}>
                    <HiddenField name="redirect_to" value={`/admin/menu?category=${category.id}`} />
                    <HiddenField name="category_id" value={category.id} />
                    <HiddenField name="menu_item_id" value={item.id} />
                    <button
                      type="submit"
                      title="Delete item"
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
          <div className="px-5 py-6 text-sm text-white/50">No items yet. Add your first item.</div>
        )}
      </div>
    </section>
  );
}
