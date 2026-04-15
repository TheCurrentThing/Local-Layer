import { Button } from "@/components/ui/button";
import type { MenuCategory } from "@/types/menu";

export function MenuPreviewSection({
  categories,
}: {
  categories: MenuCategory[];
}) {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              Menu Preview
            </p>
            <h2 className="mt-2 font-heading text-4xl text-[var(--color-foreground)]">
              Big item names. Clean prices. Fast scanning.
            </h2>
          </div>
          <Button asChild>
            <a href="/menu">Open Full Menu</a>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              Categories
            </p>
            <div className="mt-3 space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-[var(--color-foreground)]"
                >
                  {category.name}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
            <div className="space-y-8">
              {categories.slice(0, 2).map((category) => (
                <div key={category.id}>
                  <h3 className="font-heading text-2xl text-[var(--color-foreground)]">
                    {category.name}
                  </h3>
                  <div className="mt-4 space-y-4">
                    {category.items.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="border-b border-[var(--color-border)] pb-4 last:border-0"
                      >
                        <div className="flex items-baseline gap-3">
                          <h4 className="text-xl font-bold text-[var(--color-foreground)]">
                            {item.name}
                          </h4>
                          <span className="hidden flex-1 border-b border-dotted border-[var(--color-border)] md:block" />
                          <span className="text-xl font-bold text-[var(--brand-primary)]">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-[var(--color-foreground)]/70">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
