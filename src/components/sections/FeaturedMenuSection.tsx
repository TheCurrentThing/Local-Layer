import { Card, CardContent } from "@/components/ui/card";
import type { MenuCategory } from "@/types/menu";

export function FeaturedMenuSection({
  categories,
  title,
  intro,
}: {
  categories: MenuCategory[];
  title: string;
  intro: string;
}) {
  const featuredItems = categories
    .flatMap((category) => category.items)
    .filter((item) => item.isFeatured && item.isActive && !item.isSoldOut)
    .slice(0, 3);

  if (featuredItems.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
            Featured Menu
          </p>
          <h2 className="mt-2 font-heading text-4xl text-[var(--color-foreground)]">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-base text-[var(--color-foreground)]/70">
            {intro}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredItems.map((item) => (
            <Card key={item.id} className="bg-[var(--color-card)]">
              <CardContent className="p-6">
                <div className="flex items-baseline gap-3">
                  <h3 className="font-heading text-2xl text-[var(--color-foreground)]">
                    {item.name}
                  </h3>
                  <span className="flex-1 border-b border-dotted border-[var(--color-border)]" />
                  <span className="text-xl font-bold text-[var(--brand-primary)]">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-foreground)]/70">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
