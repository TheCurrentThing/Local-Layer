import type { BusinessSpecial, MenuCategory } from "@/types/menu";
import type { ThemeTokens } from "@/lib/theme";
import type { KitFamily, KitCategory, KitType } from "@/types/kit";
import type { RendererType } from "@/types/renderer";

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  googleBusiness?: string;
}

export type LogoAlignment = "center" | "left";
export type ThemeMode = "preset" | "custom";

export interface BrandConfig {
  businessName: string;
  tagline: string;
  logoText: string;
  logoUrl?: string;
  logoAlignment: LogoAlignment;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  socialLinks: SocialLinks;
  themeMode: ThemeMode;
  themePresetId: string | null;
  themeTokens: ThemeTokens;
  backgroundColor: string;
  foregroundColor: string;
  cardColor: string;
  mutedSectionColor: string;
  highlightSectionColor: string;
  headerBackgroundColor: string;
  announcementBackgroundColor: string;
  announcementTextColor: string;
  borderColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
}

export interface FeatureFlags {
  showBreakfastMenu: boolean;
  showLunchMenu: boolean;
  showDinnerMenu: boolean;
  showSpecials: boolean;
  showGallery: boolean;
  showTestimonials: boolean;
  showMap: boolean;
  showOnlineOrdering: boolean;
  showStickyMobileBar: boolean;
}

export interface SiteSettings {
  announcementText: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;
  quickInfoHoursLabel: string;
  orderingNotice: string;
}

export interface BusinessHour {
  id: string;
  dayLabel: string;
  openText: string;
  sortOrder: number;
  isActive: boolean;
}

export interface HomePageContent {
  heroImageUrl?: string;
  quickInfoItems?: string[];
  specialsIntro: string;
  featuredMenuTitle: string;
  featuredMenuIntro: string;
  galleryTitle: string;
  gallerySubtitle: string;
  menuPreviewTitle: string;
  menuPreviewSubtitle: string;
  contactTitle: string;
  contactSubtitle: string;
}

export interface AboutPageContent {
  title: string;
  body: string[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  rating?: number | null;
  isFeatured?: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface ServiceOffering {
  id: string;
  title: string;
  shortDescription: string | null;
  startingPrice: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface ServiceArea {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  price?: number | null;
  imageUrl?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface Collection {
  id: string;
  name: string;
  slug?: string;
  coverImageUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface BusinessEvent {
  id: string;
  title: string;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface SitePayload {
  kitType: KitType;         // compat alias — mirrors kitCategory
  kitFamily: KitFamily;
  kitCategory: KitCategory;
  rendererType: RendererType;
  brand: BrandConfig;
  features: FeatureFlags;
  settings: SiteSettings;
  hours: BusinessHour[];
  homePage: HomePageContent;
  aboutPage: AboutPageContent;
  specials: BusinessSpecial[];
  menuCategories: MenuCategory[];
  serviceOfferings: ServiceOffering[];
  serviceAreas: ServiceArea[];
  products: Product[];
  collections: Collection[];
  events: BusinessEvent[];
  galleryImages: GalleryImage[];
  testimonials: Testimonial[];
}
