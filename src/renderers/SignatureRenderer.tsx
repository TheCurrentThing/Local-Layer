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
import type { SiteRendererProps } from "@/types/renderer";

// Signature renderer: all sections rendered without kit-level gating.
// Feature flags still suppress individual sections (showSpecials, showGallery, etc.).
// Reserved for premium tiers — designed for maximum visual impact.
export function SignatureRenderer({ payload, basePath }: SiteRendererProps) {
  const {
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

  return (
    <>
      <LocalBusinessJsonLd brand={brand} hours={hours} />

      <HeroSection brand={brand} settings={settings} homePage={homePage} />

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

      <AboutSection about={aboutPage} />

      <ContactSection
        brand={brand}
        hours={hours}
        title={homePage.contactTitle}
        subtitle={homePage.contactSubtitle}
      />

      {features.showTestimonials && (
        <TestimonialsSection testimonials={testimonials} />
      )}
    </>
  );
}
