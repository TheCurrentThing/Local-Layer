import {
  saveAnnouncementAction,
  saveHomepageContentAction,
} from "@/app/admin/actions";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionVisibilityEditor } from "@/components/admin/SectionVisibilityEditor";
import {
  AdminCard,
  AdminCheckbox,
  AdminInput,
  AdminTextarea,
  HiddenField,
  PageLink,
  PreviewLink,
  SaveButton,
} from "@/components/admin/FormPrimitives";
import { Badge } from "@/components/ui/badge";
import { getAdminSitePayload } from "@/lib/queries";

type AdminPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function AdminHomepagePage({ searchParams }: AdminPageProps) {
  const payload = await getAdminSitePayload();
  const orderedSections = [
    {
      name: "Announcement Bar",
      status: payload.meta.announcementIsActive ? "Showing" : "Hidden",
      editHref: "/admin/homepage",
    },
    { name: "Hero", status: "Always shown", editHref: "/admin/homepage" },
    {
      name: "Daily Specials",
      status: payload.features.showSpecials ? "Showing" : "Hidden",
      editHref: "/admin/specials",
    },
    { name: "Featured Menu", status: "Always shown", editHref: "/admin/menu" },
    { name: "About", status: "Always shown", editHref: "/admin/homepage" },
    {
      name: "Photo Gallery",
      status: payload.features.showGallery ? "Showing" : "Hidden",
      editHref: "/admin/photos",
    },
    {
      name: "Testimonials",
      status: payload.features.showTestimonials ? "Showing" : "Hidden",
      editHref: "/admin/settings",
    },
    {
      name: "Contact / Map",
      status: payload.features.showMap ? "Showing with map" : "Showing without map",
      editHref: "/admin/contact",
    },
  ];

  return (
    <AdminShell
      activeKey="homepage"
      brandName={payload.brand.businessName}
      title="Homepage"
      description="Manage the homepage in the same order guests experience it: banner first, hero second, then the sections that help them decide to visit."
    >
      <AdminFeedback searchParams={searchParams} />

      <AdminCard
        title="Homepage section order"
        description="Reordering is not wired yet, so this list shows the current display order and where to edit each section."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {orderedSections.map((section, index) => (
            <div
              key={section.name}
              className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/35 px-4 py-4"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
                  Step {index + 1}
                </p>
                <p className="mt-1 font-semibold text-[var(--color-foreground)]">
                  {section.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{section.status}</Badge>
                <PageLink href={section.editHref} label="Edit" />
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      <SectionVisibilityEditor
        title="Show or hide homepage sections"
        description="Turn major sections on or off using plain-English switches."
        features={payload.features}
        redirectPath="/admin/homepage"
        includeMenuTiming={false}
        includeUtilityOptions={false}
      />

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminCard
          title="Announcement bar"
          description="Use this for closures, promotions, and short updates guests should see immediately."
        >
          <form action={saveAnnouncementAction} className="space-y-4">
            <HiddenField name="redirect_to" value="/admin/homepage" />
            <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr_120px]">
              <AdminInput
                label="Announcement Label"
                name="announcement_title"
                defaultValue={payload.meta.announcementTitle}
                required
              />
              <AdminInput
                label="Announcement Text"
                name="announcement_body"
                defaultValue={payload.meta.announcementBody}
                required
              />
              <AdminInput
                label="Order"
                name="sort_order"
                type="number"
                defaultValue={payload.meta.announcementSortOrder}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <AdminCheckbox
                label="Show the announcement bar"
                name="announcement_is_active"
                defaultChecked={payload.meta.announcementIsActive}
              />
              <SaveButton label="Save Announcement" />
            </div>
          </form>
        </AdminCard>

        <AdminCard
          title="Hero and intro content"
          description="These are the biggest first-impression edits on the homepage."
        >
          <form action={saveHomepageContentAction} className="space-y-4">
            <HiddenField name="redirect_to" value="/admin/homepage" />
            <div className="grid gap-4 md:grid-cols-2">
              <AdminInput
                label="Small Headline"
                name="hero_eyebrow"
                defaultValue={payload.settings.heroEyebrow}
                required
              />
              <AdminInput
                label="Hero Image URL"
                name="hero_image_url"
                defaultValue={payload.homePage.heroImageUrl}
              />
              <AdminInput
                label="Main Headline"
                name="hero_headline"
                defaultValue={payload.settings.heroHeadline}
                required
              />
              <AdminInput
                label="Quick Hours Summary"
                name="quick_info_hours_label"
                defaultValue={payload.settings.quickInfoHoursLabel}
                required
              />
              <AdminInput
                label="Main Button Text"
                name="hero_primary_cta_label"
                defaultValue={payload.settings.heroPrimaryCtaLabel}
                required
              />
              <AdminInput
                label="Main Button Link"
                name="hero_primary_cta_href"
                defaultValue={payload.settings.heroPrimaryCtaHref}
                required
              />
              <AdminInput
                label="Second Button Text"
                name="hero_secondary_cta_label"
                defaultValue={payload.settings.heroSecondaryCtaLabel}
                required
              />
              <AdminInput
                label="Second Button Link"
                name="hero_secondary_cta_href"
                defaultValue={payload.settings.heroSecondaryCtaHref}
                required
              />
            </div>
            <AdminTextarea
              label="Hero Text"
              name="hero_subheadline"
              defaultValue={payload.settings.heroSubheadline}
              required
            />
            <AdminTextarea
              label="Short Note Under the Hero"
              name="ordering_notice"
              defaultValue={payload.settings.orderingNotice}
              rows={3}
            />
            <AdminInput
              label="About Section Title"
              name="about_title"
              defaultValue={payload.aboutPage.title}
              required
            />
            <AdminTextarea
              label="About Section Text"
              name="about_body"
              defaultValue={payload.aboutPage.body.join("\n\n")}
              rows={6}
              required
            />
            <div className="flex flex-wrap gap-3">
              <SaveButton label="Save Homepage Content" />
              <PreviewLink href="/" label="Preview Homepage" />
            </div>
          </form>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
