// src/lib/rendering/section-component-map.tsx
// Single registry: PublicSectionType → React section component.
// All components accept `{ payload: SitePayload }`.
// Existing sections with different prop signatures are wrapped inline here
// so the renderer never deals with per-component prop shapes.
//
// Adding a new section type:
//   1. Add it to PublicSectionType in @/types/kit
//   2. Import + register it here
//   3. List it in one or more category contracts

import type { ComponentType } from "react";
import type { PublicSectionType } from "@/types/kit";
import type { SitePayload } from "@/types/site";

// ── New sections (all accept { payload }) ───────────────────────────────────
import { AnnouncementBarSection } from "@/components/sections/AnnouncementBarSection";
import { HeaderSection } from "@/components/sections/HeaderSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { PrimaryCtaSection } from "@/components/sections/PrimaryCtaSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ServiceAreasSection } from "@/components/sections/ServiceAreasSection";
import { QuoteRequestSection } from "@/components/sections/QuoteRequestSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { HoursSection } from "@/components/sections/HoursSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { MenuSection } from "@/components/sections/MenuSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { FeaturedItemsSection } from "@/components/sections/FeaturedItemsSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { CollectionsSection } from "@/components/sections/CollectionsSection";
import { BrandStorySection } from "@/components/sections/BrandStorySection";
import { CommissionsSection } from "@/components/sections/CommissionsSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { FooterSection } from "@/components/sections/FooterSection";

// ── Existing sections (wrapped to adapt their prop signatures) ───────────────
import { GallerySection } from "@/components/sections/GallerySection";
import { SpecialsSection } from "@/components/sections/SpecialsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export type SectionComponentProps = {
  payload: SitePayload;
};

// Inline adapters for existing sections with bespoke prop shapes.
function GallerySectionAdapter({ payload }: SectionComponentProps) {
  return (
    <GallerySection
      images={payload.galleryImages}
      title={payload.homePage.galleryTitle}
      subtitle={payload.homePage.gallerySubtitle}
    />
  );
}

function SpecialsSectionAdapter({ payload }: SectionComponentProps) {
  return (
    <SpecialsSection
      specials={payload.specials}
      intro={payload.homePage.specialsIntro}
    />
  );
}

function TestimonialsSectionAdapter({ payload }: SectionComponentProps) {
  return <TestimonialsSection testimonials={payload.testimonials} />;
}

function ContactSectionAdapter({ payload }: SectionComponentProps) {
  return (
    <ContactSection
      brand={payload.brand}
      hours={payload.hours}
      title={payload.homePage.contactTitle}
      subtitle={payload.homePage.contactSubtitle}
    />
  );
}

export const SECTION_COMPONENT_MAP: Partial<
  Record<PublicSectionType, ComponentType<SectionComponentProps>>
> = {
  announcement_bar: AnnouncementBarSection,
  header:           HeaderSection,
  hero:             HeroSection,
  primary_cta:      PrimaryCtaSection,
  services:         ServicesSection,
  service_areas:    ServiceAreasSection,
  quote_request:    QuoteRequestSection,
  booking:          BookingSection,
  hours:            HoursSection,
  location:         LocationSection,
  menu:             MenuSection,
  specials:         SpecialsSectionAdapter,
  reviews:          ReviewsSection,
  gallery:          GallerySectionAdapter,
  testimonials:     TestimonialsSectionAdapter,
  contact:          ContactSectionAdapter,
  featured_items:   FeaturedItemsSection,
  products:         ProductsSection,
  collections:      CollectionsSection,
  brand_story:      BrandStorySection,
  commissions:      CommissionsSection,
  events:           EventsSection,
  footer:           FooterSection,
};
