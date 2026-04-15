import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBusinessAddress } from "@/lib/brand";
import type { BrandConfig, HomePageContent, SiteSettings } from "@/types/site";

export function HeroSection({
  brand,
  settings,
  homePage,
}: {
  brand: BrandConfig;
  settings: SiteSettings;
  homePage: HomePageContent;
}) {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)] md:items-center md:py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--brand-primary)]">
            {settings.heroEyebrow}
          </p>
          <h1 className="mt-4 font-heading text-4xl leading-none text-[var(--color-foreground)] sm:text-5xl lg:text-6xl">
            {settings.heroHeadline}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--color-foreground)]/74">
            {settings.heroSubheadline}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={settings.heroPrimaryCtaHref}>{settings.heroPrimaryCtaLabel}</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={settings.heroSecondaryCtaHref}>{settings.heroSecondaryCtaLabel}</a>
            </Button>
          </div>
          <p className="mt-6 text-sm font-medium text-[var(--color-foreground)]/66">
            {getBusinessAddress(brand)}
          </p>
        </div>
        <Card className="overflow-hidden bg-[var(--color-card)]">
          <CardContent className="p-0">
            <img
              src={homePage.heroImageUrl}
              alt={`${brand.businessName} hero`}
              className="h-full min-h-[20rem] w-full object-cover"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
