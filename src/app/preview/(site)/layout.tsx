export const dynamic = "force-dynamic";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { StickyMobileBar } from "@/components/layout/StickyMobileBar";
import { PageViewTracker } from "@/components/PageViewTracker";
import { buildBrandCssVariables } from "@/lib/brand";
import { getBrandFontVariableClassNames } from "@/lib/font-registry";
import { getSitePayload } from "@/lib/queries";
import { getThemePresetById } from "@/lib/theme";

export default async function PreviewSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await getSitePayload();
  const { brand, settings, hours, features } = payload;
  const fontClassNames = getBrandFontVariableClassNames(
    brand,
    getThemePresetById(brand.themePresetId).fonts,
  );

  return (
    <div
      className={`${fontClassNames} min-h-screen pb-24 md:pb-0`}
      style={buildBrandCssVariables(brand)}
    >
      <PageViewTracker />
      <div className="sticky top-0 z-50">
        <AnnouncementBar settings={settings} />
        <SiteHeader brand={brand} basePath="/preview" />
      </div>
      <main>{children}</main>
      <SiteFooter brand={brand} hours={hours} />
      <StickyMobileBar brand={brand} features={features} basePath="/preview" />
    </div>
  );
}
