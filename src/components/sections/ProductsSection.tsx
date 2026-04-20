// ProductsSection — single entry point for all retail_products rendering.
// Dispatches to an internal layout variant based on category.
// DO NOT add per-kit logic outside this file.

import type { SitePayload } from "@/types/site";
import type { Product, Collection } from "@/types/site";
import type { ProductVariant } from "@/lib/rendering/resolve-product-variant";
import { resolveProductVariant } from "@/lib/rendering/resolve-product-variant";

// ─── Entry point ──────────────────────────────────────────────────────────────

export function ProductsSection({ payload }: { payload: SitePayload }) {
  const products = (payload.products ?? []).filter((p) => p.isActive !== false);
  if (products.length === 0) return null;

  const variant: ProductVariant = resolveProductVariant(payload.kitCategory);
  const collections = payload.collections ?? [];
  const sectionTitle = payload.homePage.menuPreviewTitle ?? "Products";

  const props: ProductsProps = { products, collections, sectionTitle };

  if (variant === "gallery")   return <GalleryProducts   {...props} />;
  if (variant === "editorial") return <EditorialProducts {...props} />;
  if (variant === "dense")     return <DenseProducts     {...props} />;
  return <BalancedProducts {...props} />;
}

// ─── Shared props type ────────────────────────────────────────────────────────

type ProductsProps = {
  products: Product[];
  collections: Collection[];
  sectionTitle: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT: GALLERY — artist, maker
//
// Structure: large image-first layout. Images carry the narrative. Price is
// secondary. Scan pattern: vertical gallery scroll, eye follows images.
// Feels like a portfolio exhibition, not a storefront.
// ─────────────────────────────────────────────────────────────────────────────

function GalleryProducts({ products, sectionTitle }: ProductsProps) {
  const featured = products.filter((p) => (p as Product & { isFeatured?: boolean }).isFeatured);
  const rest = products.filter((p) => !(p as Product & { isFeatured?: boolean }).isFeatured);

  return (
    <section
      data-section="products"
      data-product-variant="gallery"
      className="bg-[var(--color-surface)] py-24"
    >
      <div className="mx-auto max-w-5xl px-6">

        {/* Section label — restrained, lets work speak */}
        <div className="mb-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
            {sectionTitle}
          </p>
          <h2 className="mt-3 font-heading text-4xl text-[var(--color-foreground)] md:text-5xl">
            The work
          </h2>
        </div>

        {/* Featured items — full width or paired */}
        {featured.length > 0 && (
          <div className="mb-10 grid gap-3 sm:grid-cols-2">
            {featured.map((p) => (
              <GalleryCard key={p.id} product={p} size="large" />
            ))}
          </div>
        )}

        {/* Remaining works — 2-col, portrait-oriented */}
        {rest.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <GalleryCard key={p.id} product={p} size="standard" />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

function GalleryCard({ product, size }: { product: Product; size: "large" | "standard" }) {
  const aspectClass = size === "large" ? "aspect-[4/5]" : "aspect-[3/4]";

  return (
    <article className="group">
      {/* Image — primary element */}
      <div className={`relative ${aspectClass} w-full overflow-hidden bg-[var(--color-muted,#1a1a1a)]`}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground,#555)]">
              No image
            </span>
          </div>
        )}
      </div>

      {/* Minimal caption — name first, price secondary */}
      <div className="mt-3 flex items-start justify-between gap-4">
        <p className="text-sm leading-snug text-[var(--color-foreground)]">{product.name}</p>
        {product.price != null && (
          <p className="shrink-0 text-xs text-[var(--color-muted-foreground,#888)]">
            ${product.price.toFixed(2)}
          </p>
        )}
      </div>
      {product.description && (
        <p className="mt-1 line-clamp-1 text-xs text-[var(--color-muted-foreground,#888)]">
          {product.description}
        </p>
      )}
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT: EDITORIAL — brand
//
// Structure: grouped into collections. Each group has a named header and
// room for context. Product copy is prominent. Scan pattern: read section
// heading → trust → browse items → decide. Feels like a brand lookbook.
// ─────────────────────────────────────────────────────────────────────────────

function EditorialProducts({ products, collections, sectionTitle }: ProductsProps) {
  // Group products by collection when collections exist. Ungrouped products
  // fall into a default group rendered last.
  const grouped = buildCollectionGroups(products, collections);

  return (
    <section
      data-section="products"
      data-product-variant="editorial"
      className="bg-[var(--color-section-dark,#0f0f0f)] py-24"
    >
      <div className="mx-auto max-w-5xl px-6">

        {/* Section header with brand editorial framing */}
        <div className="mb-20 max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent,var(--color-primary))]">
            {sectionTitle}
          </p>
          <h2 className="mt-3 font-heading text-4xl text-[var(--color-foreground)] md:text-5xl">
            The collection
          </h2>
          <div className="mt-4 h-px w-12 bg-[var(--color-border,#2a2a2a)]" />
        </div>

        {/* Per-collection blocks */}
        <div className="space-y-20">
          {grouped.map(({ label, items }) => (
            <div key={label}>
              {/* Collection header */}
              {label && (
                <div className="mb-10 flex items-center gap-5">
                  <span className="font-heading text-lg text-[var(--color-foreground)]">{label}</span>
                  <div className="h-px flex-1 bg-[var(--color-border,#2a2a2a)]" />
                </div>
              )}

              {/* 2-col product grid — room for copy */}
              <div className="grid gap-8 sm:grid-cols-2">
                {items.map((p) => (
                  <EditorialCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function EditorialCard({ product }: { product: Product }) {
  return (
    <article className="group">
      {/* Image — square, generous */}
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-muted,#1a1a1a)]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground,#555)]">
              No image
            </span>
          </div>
        )}
      </div>

      {/* Copy block — name and description share weight, price is present but not dominant */}
      <div className="mt-5 space-y-1.5">
        <h3 className="font-heading text-base text-[var(--color-foreground)]">{product.name}</h3>
        {product.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-muted-foreground,#888)]">
            {product.description}
          </p>
        )}
        {product.price != null && (
          <p className="pt-1 text-sm text-[var(--color-foreground,#fff)] opacity-70">
            ${product.price.toFixed(2)}
          </p>
        )}
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT: DENSE — vintage, collector
//
// Structure: tight grid, maximum item density. Price is the hero element.
// Description hidden. Name truncated to one line. Scan pattern: horizontal
// sweep, compare price and image quickly. Feels like an inventory browser.
// ─────────────────────────────────────────────────────────────────────────────

function DenseProducts({ products, sectionTitle }: ProductsProps) {
  return (
    <section
      data-section="products"
      data-product-variant="dense"
      className="bg-[var(--color-section-dark-alt,#0a0a0a)] py-20"
    >
      <div className="mx-auto max-w-6xl px-6">

        {/* Compact header */}
        <div className="mb-10 flex items-end justify-between border-b border-[var(--color-border,#2a2a2a)] pb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
              {sectionTitle}
            </p>
            <h2 className="mt-1 font-heading text-2xl text-[var(--color-foreground)]">
              In stock
            </h2>
          </div>
          <span className="font-mono text-[11px] text-[var(--color-muted-foreground,#666)]">
            {products.length} {products.length === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Dense 4-col grid — 2 on mobile, 3 on sm, 4 on lg */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <DenseCard key={p.id} product={p} />
          ))}
        </div>

      </div>
    </section>
  );
}

function DenseCard({ product }: { product: Product }) {
  const isFeatured = (product as Product & { isFeatured?: boolean }).isFeatured;

  return (
    <article className="group relative border border-[var(--color-border,#2a2a2a)] bg-[var(--color-surface,#111)] transition-colors duration-150 hover:border-[var(--color-primary)] hover:bg-[var(--color-surface,#111)]">
      {/* Image — square, compact */}
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-muted,#1a1a1a)]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-opacity duration-150 group-hover:opacity-90"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground,#555)]">—</span>
          </div>
        )}
        {isFeatured && (
          <div className="absolute left-1.5 top-1.5 bg-[var(--color-primary)] px-1.5 py-0.5">
            <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-white">Pick</span>
          </div>
        )}
      </div>

      {/* Compact info — name 1 line, price prominent */}
      <div className="p-2.5">
        <p className="truncate text-[11px] text-[var(--color-foreground)]">{product.name}</p>
        {product.price != null ? (
          <p className="mt-0.5 text-sm font-semibold text-[var(--color-primary)]">
            ${product.price.toFixed(2)}
          </p>
        ) : (
          <p className="mt-0.5 text-[11px] text-[var(--color-muted-foreground,#666)]">Inquire</p>
        )}
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT: BALANCED — retail
//
// Structure: standard 3-col product grid. Image, name, brief description,
// price at equal weight. Scan pattern: casual row-by-row browse.
// Feels like a familiar retail storefront.
// ─────────────────────────────────────────────────────────────────────────────

function BalancedProducts({ products, sectionTitle }: ProductsProps) {
  return (
    <section
      data-section="products"
      data-product-variant="balanced"
      className="bg-[var(--color-surface)] py-20"
    >
      <div className="mx-auto max-w-6xl px-6">

        {/* Standard header */}
        <div className="mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
            {sectionTitle}
          </p>
          <h2 className="mt-2 font-heading text-3xl text-[var(--color-foreground)] md:text-4xl">
            Available now
          </h2>
        </div>

        {/* 3-col grid — balanced spacing, moderate card weight */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <BalancedCard key={p.id} product={p} />
          ))}
        </div>

      </div>
    </section>
  );
}

function BalancedCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-[var(--color-border,#2a2a2a)] bg-[var(--color-card,#0f0f0f)] transition-colors duration-150 hover:border-[var(--color-primary,#d97706)]/40">
      {/* Image — 4:3 ratio, moderate */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-muted,#1a1a1a)]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground,#555)]">
              No image
            </span>
          </div>
        )}
      </div>

      {/* Info block — all fields at equal weight */}
      <div className="p-5">
        <h3 className="text-sm font-medium leading-snug text-[var(--color-foreground)]">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--color-muted-foreground,#888)]">
            {product.description}
          </p>
        )}
        {product.price != null ? (
          <p className="mt-3 text-sm font-semibold text-[var(--color-primary)]">
            ${product.price.toFixed(2)}
          </p>
        ) : (
          <p className="mt-3 text-xs text-[var(--color-muted-foreground,#888)]">Price on request</p>
        )}
      </div>
    </article>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type CollectionGroup = { label: string | null; items: Product[] };

// Build collection groups for the editorial variant. Products with no
// matching collection land in an ungrouped block (label: null).
function buildCollectionGroups(
  products: Product[],
  collections: Collection[],
): CollectionGroup[] {
  if (collections.length === 0) {
    return [{ label: null, items: products }];
  }

  // Each collection gets its own group.
  const groups: CollectionGroup[] = collections
    .filter((c) => c.isActive !== false)
    .map((c) => ({
      label: c.name,
      // Without a collection_id field on Product, we can't map precisely —
      // distribute products evenly as a graceful fallback.
      items: [],
    }));

  // Distribute: products are assigned round-robin until the DB provides IDs.
  products.forEach((p, i) => {
    groups[i % groups.length]?.items.push(p);
  });

  // Add ungrouped block only if some groups are empty after distribution.
  const ungrouped = groups.filter((g) => g.items.length === 0);
  if (ungrouped.length === groups.length) {
    return [{ label: null, items: products }];
  }

  return groups.filter((g) => g.items.length > 0);
}
