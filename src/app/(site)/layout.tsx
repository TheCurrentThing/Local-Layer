import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { StickyMobileBar } from "@/components/layout/StickyMobileBar";
import { getSitePayload } from "@/lib/queries";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await getSitePayload();

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <div className="sticky top-0 z-50">
        <AnnouncementBar settings={payload.settings} />
        <SiteHeader brand={payload.brand} />
      </div>
      <main>{children}</main>
      <SiteFooter brand={payload.brand} hours={payload.hours} />
      <StickyMobileBar brand={payload.brand} features={payload.features} />
    </div>
  );
}
