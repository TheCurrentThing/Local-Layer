import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { DashboardStatCard, QuickActionCard } from "@/components/admin/DashboardCards";
import { AdminCard, PreviewLink } from "@/components/admin/FormPrimitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminSitePayload } from "@/lib/queries";

export default async function AdminDashboardPage() {
  const payload = await getAdminSitePayload();
  const featuredItems = payload.menuCategories.flatMap((category) =>
    category.items.filter((item) => item.isFeatured),
  );
  const totalItems = payload.menuCategories.reduce(
    (count, category) => count + category.items.length,
    0,
  );
  const featuredSpecial =
    payload.specials.find((special) => special.isFeatured && special.isActive) ??
    payload.specials.find((special) => special.isActive) ??
    null;
  const visibleSections = [
    payload.meta.announcementIsActive && payload.meta.announcementBody.trim()
      ? "Announcement Bar"
      : null,
    "Hero",
    payload.features.showSpecials ? "Daily Specials" : null,
    "Featured Menu",
    "About",
    payload.features.showGallery ? "Photo Gallery" : null,
    payload.features.showTestimonials ? "Testimonials" : null,
    "Contact",
    payload.features.showMap ? "Map" : null,
  ].filter(Boolean) as string[];

  return (
    <AdminShell
      activeKey="overview"
      brandName={payload.brand.businessName}
      title={`Welcome back to ${payload.brand.businessName}`}
      description="This dashboard is the quickest way to see what your website is showing today and jump straight into the updates most owners make most often."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Menu Items"
          value={totalItems}
          helper={`${payload.menuCategories.length} menu sections ready to browse`}
        />
        <DashboardStatCard
          label="Featured Items"
          value={featuredItems.length}
          helper="Items marked as featured on the menu"
        />
        <DashboardStatCard
          label="Photos"
          value={payload.galleryImages.length}
          helper="Images currently available for the gallery"
        />
        <DashboardStatCard
          label="Visible Sections"
          value={visibleSections.length}
          helper="Homepage sections currently turned on"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <QuickActionCard
          title="Update Today's Special"
          description="Change the featured special customers see right now."
          href="/admin/specials"
          cta="Edit Specials"
        />
        <QuickActionCard
          title="Change Hours"
          description="Update open hours and the quick-hours line."
          href="/admin/hours"
          cta="Edit Hours"
        />
        <QuickActionCard
          title="Edit Menu Prices"
          description="Jump straight into sections, items, and pricing."
          href="/admin/menu"
          cta="Open Menu Manager"
        />
        <QuickActionCard
          title="Post Announcement"
          description="Update the top banner for closures, promos, or reminders."
          href="/admin/homepage"
          cta="Edit Homepage"
        />
        <QuickActionCard
          title="Preview Website"
          description="Open the live site in a new tab."
          href="/"
          cta="Open Site"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
        <AdminCard
          title="What is live right now"
          description="This is the current snapshot of the most visible parts of the site."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
                Announcement Bar
              </p>
              <p className="mt-3 text-sm text-[var(--color-foreground)]/72">
                {payload.meta.announcementIsActive && payload.meta.announcementBody
                  ? payload.meta.announcementBody
                  : "No announcement is showing."}
              </p>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/homepage">Edit Announcement</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
                Today's Special
              </p>
              {featuredSpecial ? (
                <>
                  <p className="mt-3 font-semibold text-[var(--color-foreground)]">
                    {featuredSpecial.title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-foreground)]/72">
                    {featuredSpecial.description}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-[var(--brand-primary)]">
                    {featuredSpecial.price === null
                      ? featuredSpecial.label
                      : `${featuredSpecial.label} • $${featuredSpecial.price.toFixed(2)}`}
                  </p>
                </>
              ) : (
                <p className="mt-3 text-sm text-[var(--color-foreground)]/72">
                  No special is currently featured.
                </p>
              )}
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/specials">Edit Specials</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
                Hours Summary
              </p>
              <p className="mt-3 text-sm text-[var(--color-foreground)]/72">
                {payload.settings.quickInfoHoursLabel}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--color-foreground)]/68">
                {payload.hours.map((row) => (
                  <li key={row.id}>
                    {row.dayLabel}: {row.openText}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
                Homepage Visibility
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {visibleSections.map((section) => (
                  <Badge key={section} variant="secondary">
                    {section}
                  </Badge>
                ))}
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/homepage">Manage Homepage</Link>
                </Button>
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard
          title="Helpful shortcuts"
          description="Use these when you just want to get in, update something, and move on."
        >
          <div className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/setup">Run Setup Wizard</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/branding">Change Branding</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/contact">Edit Contact Info</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/photos">Manage Photos</Link>
            </Button>
            <PreviewLink href="/" label="Preview Live Website" />
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
