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
import { StandardRenderer } from "@/renderers/StandardRenderer";
import type { SiteRendererProps } from "@/types/renderer";

// Signature renderer: premium visual layout for food_service businesses.
// Non-food families fall back to StandardRenderer until SignatureRenderer
// is extended to support all families.
export function SignatureRenderer({ payload, basePath }: SiteRendererProps) {
  if (payload.kitFamily !== "food_service") {
    return <StandardRenderer payload={payload} basePath={basePath} />;
  }

  const {
    brand,
    settings,
    hours,
    homePage,
    features,
    specials,
    menuCategories,
    galleryImages,
    testimonials,
  } = payload;

  return (
    <>
      <LocalBusinessJsonLd brand={brand} hours={hours} />

      <HeroSection payload={payload} />

      <QuickInfoBar brand={brand} settings={settings} hours={hours} />

      {features.showSpecials && (
        <SpecialsSection specials={specials} intro={homePage.specialsIntro} />
      )}

      <FeaturedMenuSection
        categories={menuCategories}
        title={homePage.featuredMenuTitle}
        intro={homePage.featuredMenuIntro}
      />

      <MenuPreviewSection
        categories={menuCategories}
        title={homePage.menuPreviewTitle}
        subtitle={homePage.menuPreviewSubtitle}
        basePath={basePath}
      />

      {features.showGallery && (
        <GallerySection
          images={galleryImages}
          title={homePage.galleryTitle}
          subtitle={homePage.gallerySubtitle}
        />
      )}

      <AboutSection about={payload.aboutPage} />

      <ContactSection
        brand={brand}
        hours={hours}
        title={homePage.contactTitle}
        subtitle={homePage.contactSubtitle}
      />

      {testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}
    </>
  );
}
