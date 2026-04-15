import { getBusinessAddress } from "@/lib/brand";
import type { BrandConfig, BusinessHour } from "@/types/site";

export function SiteFooter({
  brand,
  hours,
}: {
  brand: BrandConfig;
  hours: BusinessHour[];
}) {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 sm:px-6 lg:px-8">
        <div>
          <h3 className="font-heading text-2xl text-[var(--color-foreground)]">
            {brand.businessName}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-foreground)]/72">
            Reusable local restaurant website system built for fast deployment,
            owner-edited content, and practical small-business maintenance.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            Hours
          </h4>
          <div className="mt-3 space-y-2 text-sm text-[var(--color-foreground)]/78">
            {hours.map((entry) => (
              <div key={entry.id} className="flex justify-between gap-4">
                <span>{entry.dayLabel}</span>
                <span>{entry.openText}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            Visit
          </h4>
          <p className="mt-3 text-sm text-[var(--color-foreground)]/78">
            {getBusinessAddress(brand)}
          </p>
          <a
            href={`tel:${brand.phone.replace(/[^\d]/g, "")}`}
            className="mt-2 block text-sm font-semibold text-[var(--brand-primary)]"
          >
            {brand.phone}
          </a>
        </div>
      </div>
    </footer>
  );
}
