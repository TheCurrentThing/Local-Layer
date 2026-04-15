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
import { getSitePayload } from "@/lib/queries";

export default async function HomePage() {
  const payload = await getSitePayload();

  return (
    <>
      <LocalBusinessJsonLd brand={payload.brand} hours={payload.hours} />
      <HeroSection
        brand={payload.brand}
        settings={payload.settings}
        homePage={payload.homePage}
      />
      <QuickInfoBar
        brand={payload.brand}
        settings={payload.settings}
        hours={payload.hours}
      />
      {payload.features.showSpecials ? (
        <SpecialsSection
          specials={payload.specials}
          intro={payload.homePage.specialsIntro}
        />
      ) : null}
      <FeaturedMenuSection
        categories={payload.menuCategories}
        title={payload.homePage.featuredMenuTitle}
        intro={payload.homePage.featuredMenuIntro}
      />
      <MenuPreviewSection categories={payload.menuCategories} />
      <AboutSection about={payload.aboutPage} />
      {payload.features.showGallery ? (
        <GallerySection images={payload.galleryImages} />
      ) : null}
      {payload.features.showTestimonials ? (
        <TestimonialsSection testimonials={payload.testimonials} />
      ) : null}
      <ContactSection
        brand={payload.brand}
        hours={payload.hours}
        features={payload.features}
      />
    </>
  );
}
