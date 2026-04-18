export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { StickyMobileBar } from "@/components/layout/StickyMobileBar";
import { PageViewTracker } from "@/components/PageViewTracker";
import { buildBrandCssVariables } from "@/lib/brand";
import { getBrandFontVariableClassNames } from "@/lib/font-registry";
import { getBusinessSitePayload } from "@/lib/queries";
import { getThemePresetById } from "@/lib/theme";

type SlugLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function SlugSiteLayout({ children, params }: SlugLayoutProps) {
  const { slug } = await params;
  const payload = await getBusinessSitePayload(slug);

  if (!payload) {
    notFound();
  }

  const { brand, settings, hours, features } = payload;
  const basePath = `/${slug}`;
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
        <SiteHeader brand={brand} basePath={basePath} />
      </div>
      <main>{children}</main>
      <SiteFooter brand={brand} hours={hours} />
      <StickyMobileBar brand={brand} features={features} basePath={basePath} />
    </div>
  );
}
