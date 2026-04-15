import type { BrandConfig, BusinessHour, SiteSettings } from "@/types/site";

export function QuickInfoBar({
  brand,
  settings,
}: {
  brand: BrandConfig;
  settings: SiteSettings;
  hours: BusinessHour[];
}) {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-muted)]">
      <div className="mx-auto grid max-w-6xl gap-3 px-4 py-4 md:grid-cols-3 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-4 text-sm shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            Address
          </p>
          <p className="mt-1 font-medium text-[var(--color-foreground)]">
            {brand.addressLine1}, {brand.city}, {brand.state}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-4 text-sm shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            Phone
          </p>
          <p className="mt-1 font-medium text-[var(--color-foreground)]">
            {brand.phone}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-4 text-sm shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            Hours
          </p>
          <p className="mt-1 font-medium text-[var(--color-foreground)]">
            {settings.quickInfoHoursLabel}
          </p>
        </div>
      </div>
    </section>
  );
}
