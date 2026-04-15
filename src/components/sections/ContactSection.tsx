import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBusinessAddress } from "@/lib/brand";
import type { BrandConfig, BusinessHour, FeatureFlags } from "@/types/site";

export function ContactSection({
  brand,
  hours,
  features,
}: {
  brand: BrandConfig;
  hours: BusinessHour[];
  features: FeatureFlags;
}) {
  return (
    <section className="bg-[var(--color-background)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1fr_0.95fr]">
        <Card className="bg-[var(--color-card)]">
          <CardContent className="p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              Contact
            </p>
            <h2 className="mt-2 font-heading text-4xl text-[var(--color-foreground)]">
              Fast paths matter more than clever copy.
            </h2>
            <div className="mt-6 space-y-3 text-sm text-[var(--color-foreground)]/76">
              <p>{getBusinessAddress(brand)}</p>
              <p>{brand.phone}</p>
              {brand.email && <p>{brand.email}</p>}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href={`tel:${brand.phone.replace(/[^\d]/g, "")}`}>Call Now</a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(getBusinessAddress(brand))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--color-card)]">
          <CardContent className="p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              Hours
            </p>
            <div className="mt-5 space-y-3">
              {hours.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-3 last:border-0"
                >
                  <span className="font-medium text-[var(--color-foreground)]">
                    {entry.dayLabel}
                  </span>
                  <span className="text-sm font-semibold text-[var(--brand-primary)]">
                    {entry.openText}
                  </span>
                </div>
              ))}
            </div>
            {features.showMap ? (
              <p className="mt-6 text-sm text-[var(--color-foreground)]/66">
                Map embedding is toggleable at the template level, so cafes,
                food trucks, or pop-ups can hide it when needed.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
