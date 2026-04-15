import {
  deleteMenuItemAction,
  saveMenuItemAction,
} from "@/app/admin/actions";
import {
  AdminCard,
  AdminInput,
  DeleteButton,
  HiddenField,
  SaveButton,
} from "@/components/admin/FormPrimitives";
import type { MenuCategory, MenuItem } from "@/types/menu";

type MenuItemEditorPanelProps = {
  category: MenuCategory | null;
  item: MenuItem | null;
  isCreating: boolean;
};

export function MenuItemEditorPanel({
  category,
  item,
  isCreating,
}: MenuItemEditorPanelProps) {
  if (!category) {
    return (
      <AdminCard
        title="Item editor"
        description="This panel stays focused on one item at a time."
      >
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/25 p-5 text-sm text-[var(--color-foreground)]/68">
          Create or select a menu section first.
        </div>
      </AdminCard>
    );
  }

  if (!item && !isCreating) {
    return (
      <AdminCard
        title="Pick an item"
        description="Edit one item at a time after you choose it from the list."
      >
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/25 p-5 text-sm text-[var(--color-foreground)]/68">
          {category.items.length > 0
            ? "Start by selecting a menu item from the middle list."
            : "No items yet. Add your first item from the item list."}
        </div>
      </AdminCard>
    );
  }

  const itemName = item?.name ?? "";
  const itemPrice = item ? item.price.toFixed(2) : "";
  const itemDescription = item?.description ?? "";
  const itemSortOrder = item?.sortOrder ?? category.items.length + 1;
  const itemTags = item?.tags.join(", ") ?? "";
  const itemIsActive = item?.isActive ?? true;
  const itemIsSoldOut = item?.isSoldOut ?? false;
  const itemIsFeatured = item?.isFeatured ?? false;
  const baseFieldClassName =
    "mt-1 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[var(--brand-primary)]";
  const compactFieldClassName =
    "mt-1 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-right text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-[var(--brand-primary)]";
  const toggleClassName =
    "flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-stone-900";

  return (
    <AdminCard
      title={isCreating ? "Add an item" : item?.name ?? "Edit item"}
      description={
        isCreating
          ? "Keep this simple: name, price, description, and whether the item is live."
          : "Fast edits first: name, price, description, and live status."
      }
    >
      <form action={saveMenuItemAction} className="space-y-4">
        <HiddenField
          name="redirect_to"
          value={`/admin/menu?category=${category.id}${item ? `&item=${item.id}` : ""}`}
        />
        <HiddenField name="category_id" value={category.id} />
        {item ? <HiddenField name="menu_item_id" value={item.id} /> : null}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
              Item Name
            </label>
            <input
              name="name"
              type="text"
              defaultValue={itemName}
              required
              className={baseFieldClassName}
              placeholder="Biscuits & Gravy"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={itemDescription}
              required
              rows={3}
              className={baseFieldClassName}
              placeholder="House-made sausage gravy over split biscuits."
            />
          </div>

          <div className="max-w-[120px]">
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
              Price
            </label>
            <input
              name="price"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              defaultValue={itemPrice}
              required
              className={compactFieldClassName}
              placeholder="6.99"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <label className={toggleClassName}>
              <input
                name="is_active"
                type="checkbox"
                defaultChecked={itemIsActive}
                className="h-4 w-4 accent-[var(--brand-primary)]"
              />
              Show on site
            </label>
            <label className={toggleClassName}>
              <input
                name="is_sold_out"
                type="checkbox"
                defaultChecked={itemIsSoldOut}
                className="h-4 w-4 accent-[var(--brand-primary)]"
              />
              Sold out
            </label>
            <label className={toggleClassName}>
              <input
                name="is_featured"
                type="checkbox"
                defaultChecked={itemIsFeatured}
                className="h-4 w-4 accent-[var(--brand-primary)]"
              />
              Featured
            </label>
          </div>
        </div>

        <details className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/25">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-[var(--color-foreground)]">
            Customize item
          </summary>
          <div className="space-y-4 border-t border-[var(--color-border)] px-4 py-4">
            <p className="text-sm text-[var(--color-foreground)]/68">
              Advanced options are only needed for items with add-ons or choices.
              Most restaurants can ignore this section most of the time.
            </p>
            <div className="grid gap-4 md:grid-cols-[160px_1fr]">
              <AdminInput
                label="Sort Order"
                name="sort_order"
                type="number"
                defaultValue={itemSortOrder}
              />
              <AdminInput
                label="Tags"
                name="tags"
                defaultValue={itemTags}
                placeholder="Popular, House Favorite"
              />
            </div>
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white/70 p-4 text-sm text-[var(--color-foreground)]/68">
              Add-ons, required choice groups, and multi-select options are part of
              the menu data model, but they are not edited here by default. This
              keeps everyday menu updates simpler for owners.
            </div>
          </div>
        </details>

        <div className="flex flex-wrap gap-3">
          <SaveButton label={isCreating ? "Add Item" : "Save Item"} />
          {item ? (
            <a
              href={`/admin/menu?category=${category.id}`}
              className="inline-flex items-center justify-center rounded-xl border border-[var(--brand-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--brand-primary)] transition hover:bg-[color:rgba(165,60,47,0.08)]"
            >
              Done Editing
            </a>
          ) : null}
        </div>
      </form>

      {item ? (
        <form action={deleteMenuItemAction}>
          <HiddenField
            name="redirect_to"
            value={`/admin/menu?category=${category.id}`}
          />
          <HiddenField name="category_id" value={category.id} />
          <HiddenField name="menu_item_id" value={item.id} />
          <DeleteButton label="Delete Item" />
        </form>
      ) : null}
    </AdminCard>
  );
}
