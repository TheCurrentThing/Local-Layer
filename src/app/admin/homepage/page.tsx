import { AdminShell } from "@/components/admin/AdminShell";
import { HomepageEditorClient } from "@/components/admin/HomepageEditorClient";
import { getAdminSitePayload } from "@/lib/queries";

export default async function AdminHomepagePage() {
  const payload = await getAdminSitePayload();

  return (
    <AdminShell
      activeKey="homepage"
      brandName={payload.brand.businessName}
      eyebrow="Homepage"
      title="Homepage"
      previewHref="/"
      contentClassName="min-h-0 flex flex-1 flex-col overflow-hidden"
    >
      <HomepageEditorClient
        businessName={payload.brand.businessName}
        announcement={{
          title: payload.meta.announcementTitle ?? "",
          body: payload.meta.announcementBody ?? "",
          isActive: payload.meta.announcementIsActive,
        }}
        hero={{
          eyebrow: payload.settings.heroEyebrow ?? "",
          headline: payload.settings.heroHeadline ?? "",
          subheadline: payload.settings.heroSubheadline ?? "",
          primaryCtaLabel: payload.settings.heroPrimaryCtaLabel ?? "",
          primaryCtaHref: payload.settings.heroPrimaryCtaHref ?? "",
          secondaryCtaLabel: payload.settings.heroSecondaryCtaLabel ?? "",
          secondaryCtaHref: payload.settings.heroSecondaryCtaHref ?? "",
          quickInfoHoursLabel: payload.settings.quickInfoHoursLabel ?? "",
          orderingNotice: payload.settings.orderingNotice ?? "",
          heroImageUrl: payload.homePage.heroImageUrl ?? "",
        }}
        supporting={{
          menuPreviewTitle: payload.homePage.menuPreviewTitle ?? "",
          menuPreviewSubtitle: payload.homePage.menuPreviewSubtitle ?? "",
          galleryTitle: payload.homePage.galleryTitle ?? "",
          gallerySubtitle: payload.homePage.gallerySubtitle ?? "",
          contactTitle: payload.homePage.contactTitle ?? "",
          contactSubtitle: payload.homePage.contactSubtitle ?? "",
        }}
        about={{
          title: payload.aboutPage.title ?? "",
          body: payload.aboutPage.body.join("\n\n") ?? "",
        }}
        galleryImages={payload.galleryImages}
        features={{
          showSpecials: payload.features.showSpecials,
          showGallery: payload.features.showGallery,
          showTestimonials: payload.features.showTestimonials,
          showMap: payload.features.showMap,
          showOnlineOrdering: payload.features.showOnlineOrdering,
          showStickyMobileBar: payload.features.showStickyMobileBar,
          showBreakfastMenu: payload.features.showBreakfastMenu,
          showLunchMenu: payload.features.showLunchMenu,
          showDinnerMenu: payload.features.showDinnerMenu,
        }}
      />
    </AdminShell>
  );
}
