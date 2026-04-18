// Canonical kit-type definitions for LocalLayer.
//
// KitType is persisted in businesses.kit_type. It drives:
//   1. Which admin sidebar modules are visible
//   2. Which public-page sections are rendered (and in what order)
//   3. Which feature flags are seeded at onboarding

export type KitType = "restaurant" | "food_truck" | "artist" | "trade";

// Which admin modules are active for a given kit.
// Modules set to false hide the corresponding sidebar item and admin page.
export type KitModules = {
  homepage: boolean;
  branding: boolean;
  menu: boolean;
  specials: boolean;
  hours: boolean;
  photos: boolean;
  contact: boolean;
  google: boolean;
  launch: boolean;
};

// Ordered list of public section types that should render on the homepage.
// Sections the kit omits simply don't appear — no feature-flag gymnastics needed.
export type PublicSectionType =
  | "hero"
  | "quick_info"
  | "specials"
  | "featured_menu"
  | "menu_preview"
  | "gallery"
  | "about"
  | "contact";

export type KitConfig = {
  type: KitType;
  label: string;
  modules: KitModules;
  // Sections that render on the public homepage, in display order.
  // Feature flags in business_settings can suppress a section even if listed here.
  publicSections: PublicSectionType[];
};
