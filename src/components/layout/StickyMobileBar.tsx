import type { BrandConfig, FeatureFlags } from "@/types/site";

export function StickyMobileBar({
  brand,
  features,
  basePath = "",
}: {
  brand: BrandConfig;
  features: FeatureFlags;
  basePath?: string;
}) {
  if (!features.showStickyMobileBar) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-header-background)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-2 px-3 py-3">
        <a
          href={`tel:${brand.phone.replace(/[^\d]/g, "")}`}
          className="flex min-h-[56px] items-center justify-center rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-[var(--color-primary-text)]"
        >
          Call
        </a>
        <a
          href={`${basePath}/menu`}
          className="flex min-h-[56px] items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-button-secondary-bg)] text-sm font-semibold text-[var(--color-button-secondary-text)]"
        >
          Menu
        </a>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(`${brand.addressLine1}, ${brand.city}, ${brand.state} ${brand.zip}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[56px] items-center justify-center rounded-xl border border-[var(--color-border)] bg-transparent text-sm font-semibold text-[var(--color-foreground)]"
        >
          Directions
        </a>
      </div>
    </div>
  );
}
