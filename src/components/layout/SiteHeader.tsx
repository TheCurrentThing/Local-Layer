import { Button } from "@/components/ui/button";
import type { BrandConfig } from "@/types/site";

export function SiteHeader({ brand }: { brand: BrandConfig }) {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-header-background)] backdrop-blur">
      <div className="relative mx-auto hidden max-w-7xl px-4 sm:px-6 md:block lg:px-8">
        <div className="pointer-events-none absolute left-8 top-1/2 z-20 -translate-y-1/2 xl:left-10">
          <a href="/" className="pointer-events-auto block">
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={`${brand.businessName} logo`}
                className="h-20 w-auto object-contain sm:h-24 lg:h-[7.9rem]"
              />
            ) : (
              <p className="font-heading text-3xl text-[var(--brand-primary)]">
                {brand.logoText}
              </p>
            )}
          </a>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="relative flex min-h-[92px] items-center justify-between border-b border-t border-[var(--color-border)]">
            <div className="w-[124px] shrink-0 lg:w-[136px]" />

            <nav className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-7">
              <a href="/" className="text-sm font-medium text-[var(--color-foreground)]">
                Home
              </a>
              <a href="/menu" className="text-sm font-medium text-[var(--color-foreground)]">
                Menu
              </a>
              <a href="/about" className="text-sm font-medium text-[var(--color-foreground)]">
                About
              </a>
              <a href="/contact" className="text-sm font-medium text-[var(--color-foreground)]">
                Contact
              </a>
            </nav>

            <div className="ml-auto flex w-[124px] shrink-0 items-center justify-end gap-2 lg:w-[136px]">
              <Button asChild variant="outline" size="sm">
                <a href={`tel:${brand.phone.replace(/[^\d]/g, "")}`}>Call</a>
              </Button>
              <Button asChild size="sm">
                <a href="/menu">View Menu</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-b border-[var(--color-border)] px-4 py-4 md:hidden sm:px-6 lg:px-8">
        <div className="flex justify-start">
          <a href="/" className="block">
            <div className="px-2 py-1 text-center">
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={`${brand.businessName} logo`}
                  className="h-20 w-auto object-contain"
                />
              ) : (
                <p className="font-heading text-2xl text-[var(--brand-primary)]">
                  {brand.logoText}
                </p>
              )}
            </div>
          </a>
        </div>

        <div className="space-y-4">
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a href="/" className="text-sm font-medium text-[var(--color-foreground)]">
              Home
            </a>
            <a href="/menu" className="text-sm font-medium text-[var(--color-foreground)]">
              Menu
            </a>
            <a href="/about" className="text-sm font-medium text-[var(--color-foreground)]">
              About
            </a>
            <a href="/contact" className="text-sm font-medium text-[var(--color-foreground)]">
              Contact
            </a>
          </nav>

          <div className="flex items-center justify-center gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={`tel:${brand.phone.replace(/[^\d]/g, "")}`}>Call</a>
            </Button>
            <Button asChild size="sm">
              <a href="/menu">View Menu</a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
