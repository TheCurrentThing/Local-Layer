import { Button } from "@/components/ui/button";
import type { MenuCategory } from "@/types/menu";

export function MenuPreviewSection({
  categories,
  title,
  subtitle,
}: {
  categories: MenuCategory[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Menu Preview
            </p>
            {title ? (
              <h2 className="mt-2 font-heading text-4xl text-[var(--color-foreground)]">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-3 max-w-2xl text-base text-[var(--color-foreground)]/70">
                {subtitle}
              </p>
            ) : null}
          </div>
          <Button asChild>
            <a href="/menu">Open Full Menu</a>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              Categories
            </p>
            <div className="mt-3 space-y-2">
              {categories.filter((c) => c.items.length > 0).map((category) => (
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
            {(() => {
              const preview = categories.filter((c) => c.items.length > 0).slice(0, 2);
              if (preview.length === 0) {
                return (
                  <p className="text-sm text-[var(--color-foreground)]/50">
                    Menu items coming soon.
                  </p>
                );
              }
              return (
                <div className="space-y-8">
                  {preview.map((category) => (
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
                              <span className="text-xl font-bold text-[var(--color-primary)]">
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
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}

