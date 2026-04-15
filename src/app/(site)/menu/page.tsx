import { getMenuCategories } from "@/lib/queries";

export default async function MenuPage() {
  const categories = await getMenuCategories();

  return (
    <section className="bg-[var(--color-background)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-heading text-5xl text-[var(--color-foreground)]">
          Full Menu
        </h1>
        <div className="mt-10 space-y-10">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm"
            >
              <h2 className="font-heading text-3xl text-[var(--color-foreground)]">
                {category.name}
              </h2>
              <div className="mt-5 space-y-4">
                {category.items
                  .filter((item) => item.isActive)
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-[var(--color-border)] pb-4 last:border-0"
                    >
                      <div className="flex items-baseline gap-3">
                        <h3 className="text-xl font-bold text-[var(--color-foreground)]">
                          {item.name}
                        </h3>
                        <span className="hidden flex-1 border-b border-dotted border-[var(--color-border)] md:block" />
                        <span className="text-xl font-bold text-[var(--brand-primary)]">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[var(--color-foreground)]/72">
                        {item.description}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
