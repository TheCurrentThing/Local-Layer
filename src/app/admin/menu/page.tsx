import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { MenuCategoryPanel } from "@/components/admin/MenuCategoryPanel";
import { MenuItemEditorPanel } from "@/components/admin/MenuItemEditorPanel";
import { MenuItemListPanel } from "@/components/admin/MenuItemListPanel";
import { MenuSectionList } from "@/components/admin/MenuSectionList";
import { AdminShell } from "@/components/admin/AdminShell";
import { PreviewLink } from "@/components/admin/FormPrimitives";
import { getAdminSitePayload } from "@/lib/queries";

type AdminPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function readParam(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  key: string,
) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function AdminMenuPage({ searchParams }: AdminPageProps) {
  const payload = await getAdminSitePayload();
  const itemCount = payload.menuCategories.reduce(
    (total, category) => total + category.items.length,
    0,
  );

  const requestedCategoryId = readParam(searchParams, "category");
  const selectedCategory =
    payload.menuCategories.find((category) => category.id === requestedCategoryId) ??
    payload.menuCategories[0] ??
    null;

  const requestedItemId = readParam(searchParams, "item");
  const isCreatingItem = requestedItemId === "new" && Boolean(selectedCategory);
  const selectedItem =
    selectedCategory?.items.find((item) => item.id === requestedItemId) ??
    (isCreatingItem ? null : selectedCategory?.items[0] ?? null);

  return (
    <AdminShell
      activeKey="menu"
      brandName={payload.brand.businessName}
      title="Menu"
      description="Pick a section, then an item, then edit that one item."
    >
      <AdminFeedback searchParams={searchParams} />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[var(--color-border)] bg-white/86 px-5 py-4 shadow-panel">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
            Menu Control Panel
          </p>
          <p className="mt-1 text-sm text-[var(--color-foreground)]/68">
            {payload.menuCategories.length} sections - {itemCount} total items
          </p>
        </div>
        <PreviewLink href="/menu" label="Preview Menu" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[260px_360px_minmax(0,1fr)]">
        <MenuSectionList
          categories={payload.menuCategories}
          selectedCategoryId={selectedCategory?.id ?? null}
        />

        <div className="space-y-4">
          <MenuCategoryPanel
            category={selectedCategory}
            selectedItemId={selectedItem?.id ?? null}
          />
          <MenuItemListPanel
            category={selectedCategory}
            selectedItemId={selectedItem?.id ?? (isCreatingItem ? "new" : null)}
          />
        </div>

        <MenuItemEditorPanel
          category={selectedCategory}
          item={selectedItem}
          isCreating={isCreatingItem}
        />
      </div>
    </AdminShell>
  );
}
