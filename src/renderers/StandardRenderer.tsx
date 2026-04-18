import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FeaturedMenuSection } from "@/components/sections/FeaturedMenuSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { MenuPreviewSection } from "@/components/sections/MenuPreviewSection";
import { QuickInfoBar } from "@/components/sections/QuickInfoBar";
import { SpecialsSection } from "@/components/sections/SpecialsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { LocalBusinessJsonLd } from "@/components/layout/LocalBusinessJsonLd";
import { getPublicSections } from "@/lib/kit-config";
import type { SiteRendererProps } from "@/types/renderer";

// Kit-driven renderer: sections are determined by getPublicSections(kitType).
// Feature flags provide a second gate within the allowed section set.
// This is the default renderer for all businesses.
export function StandardRenderer({ payload, basePath }: SiteRendererProps) {
  const {
    kitType,
    brand,
    settings,
    hours,
    homePage,
    aboutPage,
    features,
    specials,
    menuCategories,
    galleryImages,
    testimonials,
  } = payload;

  const sections = getPublicSections(kitType);

  return (
    <>
      <LocalBusinessJsonLd brand={brand} hours={hours} />

      {sections.includes("hero") && (
        <HeroSection brand={brand} settings={settings} homePage={homePage} />
      )}

      {sections.includes("quick_info") && (
        <QuickInfoBar brand={brand} settings={settings} hours={hours} />
      )}

      {sections.includes("specials") && features.showSpecials && (
        <SpecialsSection specials={specials} intro={homePage.specialsIntro} />
      )}

      {sections.includes("featured_menu") && (
        <FeaturedMenuSection
          categories={menuCategories}
          title={homePage.featuredMenuTitle}
          intro={homePage.featuredMenuIntro}
        />
      )}

      {sections.includes("menu_preview") && (
        <MenuPreviewSection
          categories={menuCategories}
          title={homePage.menuPreviewTitle}
          subtitle={homePage.menuPreviewSubtitle}
          basePath={basePath}
        />
      )}

      {sections.includes("gallery") && features.showGallery && (
        <GallerySection
          images={galleryImages}
          title={homePage.galleryTitle}
          subtitle={homePage.gallerySubtitle}
        />
      )}

      {sections.includes("about") && (
        <AboutSection about={aboutPage} />
      )}

      {sections.includes("contact") && (
        <ContactSection
          brand={brand}
          hours={hours}
          title={homePage.contactTitle}
          subtitle={homePage.contactSubtitle}
        />
      )}

      {features.showTestimonials && (
        <TestimonialsSection testimonials={testimonials} />
      )}
    </>
  );
}
