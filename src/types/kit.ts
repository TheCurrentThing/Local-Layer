// ─── KIT FAMILY ──────────────────────────────────────────────────────────────
//
// Broad operational backbone. Families define a shared module architecture and
// the pool of categories (subtypes) that live within them.
//
// Current families:
//   food_service    → Cafes, diners, restaurants, pop-ups, food trucks, bars
//   services        → On-demand, project, scheduled, professional, mobile services
//   retail_products → Artists, makers, retail shops, brands, vintage, collectors

export type KitFamily = "food_service" | "services" | "retail_products";

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
//
// Subtypes within a family. Categories act as presets on top of shared modules:
// same capabilities, different defaults, section order, and conversion emphasis.
// They do NOT fork the product into separate systems.

// Food Service — all share the Food Service module backbone
export type FoodServiceCategory =
  | "cafe"
  | "diner"
  | "restaurant"
  | "pop_up"
  | "food_truck"
  | "bar";

// Services — organized by conversion model, not industry label.
// Industry labels (plumber, salon, consultant) live in copy/defaults, not architecture.
export type ServicesCategory =
  | "on_demand"    // Fast-response local services — plumber, HVAC, locksmith, electrician
  | "project"      // Scope-based work — contractor, roofer, landscaper, remodeler
  | "scheduled"    // Appointment-driven — salon, barber, massage, trainer, cleaner
  | "professional" // Knowledge-based — consultant, accountant, coach, agency
  | "mobile";      // Location-flexible — mobile detailing, grooming, repair

// Retail & Products — gallery-forward, product-catalog-driven
export type RetailProductsCategory =
  | "artist"
  | "maker"
  | "retail"
  | "brand"
  | "vintage"
  | "collector";

// Union of all categories across all families
export type KitCategory =
  | FoodServiceCategory
  | ServicesCategory
  | RetailProductsCategory;

// ─── KIT IDENTITY ────────────────────────────────────────────────────────────
//
// A business's resolved kit identity. Stored as kit_family + kit_category in
// the businesses table. The legacy kit_type column is kept for transition.

export type KitIdentity = {
  family: KitFamily;
  category: KitCategory;
};

// ─── MODULES ─────────────────────────────────────────────────────────────────
//
// The actual shared capabilities within a family. Modules drive admin sidebar
// visibility and public section availability.
//
// Categories set module defaults. Feature flags in business_settings give each
// business per-instance overrides on top of category defaults.

export type KitModules = {
  // ── Core ───────────────────────────────────────────────────────────────────
  homepage:      boolean;
  branding:      boolean;
  contact:       boolean;
  photos:        boolean;  // Gallery / portfolio / project photos
  hours:         boolean;  // Operating hours
  google:        boolean;
  launch:        boolean;
  events:        boolean;  // Events listing — bars, pop-ups, food trucks
  announcements: boolean;  // Time-sensitive notices

  // ── Food Service ──────────────────────────────────────────────────────────
  menu:          boolean;  // Food & drink menu catalog
  specials:      boolean;  // Specials / happy hour / featured items

  // ── Services ──────────────────────────────────────────────────────────────
  offerings:     boolean;  // Service offerings / catalog
  testimonials:  boolean;  // Client testimonials
  service_areas: boolean;  // Geographic service coverage areas
  quote_request: boolean;  // Quote / estimate request form
  booking:       boolean;  // Appointment booking flow

  // ── Retail & Products ─────────────────────────────────────────────────────
  products:      boolean;  // Product catalog
  collections:   boolean;  // Product collections / series
};

// ─── PUBLIC SECTIONS ─────────────────────────────────────────────────────────
//
// Section types that can render on the public homepage.
// Categories define the default order and inclusion per preset.
// Feature flags gate individual section visibility at render time.

export type PublicSectionType =
  | "hero"
  | "quick_info"         // Hours / key operating info bar
  | "announcements"      // Notice strip — pop-ups, closures, seasonal hours
  | "specials"           // Featured specials / happy hour (food service)
  | "events"             // Upcoming events listing
  | "featured_menu"      // Featured items spotlight (food service)
  | "menu_preview"       // Full menu category browser (food service)
  | "offerings"          // Service offerings catalog (services)
  | "featured_products"  // Featured products spotlight (retail)
  | "products"           // Full product catalog section (retail)
  | "testimonials"       // Client testimonials (services / retail)
  | "service_areas"      // Service coverage areas (services)
  | "gallery"            // Photo / portfolio gallery
  | "about"              // About section
  | "contact";           // Contact / location / map

// ─── KIT CONFIG ──────────────────────────────────────────────────────────────
//
// Fully resolved configuration for a business. This is the shape all consuming
// code should work with — not raw family/category strings.

export type KitConfig = {
  family: KitFamily;
  category: KitCategory;
  familyLabel: string; // "Food Service", "Services", "Retail & Products"
  label: string;       // "Restaurant", "On-Demand Service", "Retail Shop", etc.
  modules: KitModules;
  publicSections: PublicSectionType[];
};

// ─── BACKWARD COMPATIBILITY ───────────────────────────────────────────────────
//
// KitType was the original flat model: "restaurant" | "food_truck" | "artist" | "trade".
// It is now a type alias for KitCategory so all existing callers compile without
// changes. The original four values remain valid categories in the new system.
//
// New code should use KitCategory or KitIdentity. Existing code can migrate gradually.

export type KitType = KitCategory;

// CreativeCategory kept as a backward-compat alias (artist moved to RetailProductsCategory).
/** @deprecated Use RetailProductsCategory instead. */
export type CreativeCategory = "artist";
