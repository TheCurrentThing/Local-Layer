import type {
  KitFamily,
  KitCategory,
  FoodServiceCategory,
  ServicesCategory,
  RetailProductsCategory,
  KitIdentity,
  KitConfig,
  KitModules,
  PublicSectionType,
  KitType,
} from "@/types/kit";

// ─── FAMILY LABELS ────────────────────────────────────────────────────────────

const FAMILY_LABELS: Record<KitFamily, string> = {
  food_service:    "Food Service",
  services:        "Services",
  retail_products: "Retail & Products",
};

// ─── CATEGORY → FAMILY MAP ────────────────────────────────────────────────────
//
// Authoritative mapping — derives family from category so callers only need
// the category string to get a full KitIdentity.

const CATEGORY_FAMILY: Record<KitCategory, KitFamily> = {
  // Food Service
  cafe:         "food_service",
  diner:        "food_service",
  restaurant:   "food_service",
  pop_up:       "food_service",
  food_truck:   "food_service",
  bar:          "food_service",
  // Services — five conversion-based categories
  on_demand:    "services",
  project:      "services",
  scheduled:    "services",
  professional: "services",
  mobile:       "services",
  // Retail & Products
  artist:       "retail_products",
  maker:        "retail_products",
  retail:       "retail_products",
  brand:        "retail_products",
  vintage:      "retail_products",
  collector:    "retail_products",
};

// ─── LEGACY CATEGORY MAP ──────────────────────────────────────────────────────
//
// DB values that were valid in prior migrations but are no longer in KitCategory.
// Migration 011 backfills these — this map handles the transition window.

const LEGACY_CATEGORY_MAP: Partial<Record<string, KitCategory>> = {
  trade: "project", // Migration 009: trade → services. Migration 011: trade → project.
};

// ─── FOOD SERVICE MODULE SYSTEM ───────────────────────────────────────────────
//
// All Food Service categories share this module base.
// Category presets merge into it — they override specific keys, not the whole map.

const FOOD_SERVICE_BASE: KitModules = {
  homepage:      true,
  branding:      true,
  contact:       true,
  photos:        true,
  hours:         true,
  google:        true,
  launch:        true,
  events:        false,
  announcements: false,
  menu:          true,
  specials:      true,
  offerings:     false,
  testimonials:  false,
  service_areas: false,
  quote_request: false,
  booking:       false,
  products:      false,
  collections:   false,
};

// ─── FOOD SERVICE CATEGORY PRESETS ───────────────────────────────────────────
//
// Each preset is a lens on the shared Food Service system:
//   modules       — partial override merged into FOOD_SERVICE_BASE
//   publicSections — homepage section order for this category (in render order)

type CategoryPreset = {
  label: string;
  modules: Partial<KitModules>;
  publicSections: PublicSectionType[];
};

const FOOD_SERVICE_PRESETS: Record<FoodServiceCategory, CategoryPreset> = {
  restaurant: {
    label: "Restaurant",
    modules: {},
    publicSections: [
      "hero",
      "quick_info",
      "specials",
      "featured_menu",
      "menu_preview",
      "gallery",
      "about",
      "contact",
    ],
  },

  cafe: {
    label: "Café",
    modules: { specials: false },
    publicSections: [
      "hero",
      "quick_info",
      "menu_preview",
      "gallery",
      "about",
      "contact",
    ],
  },

  diner: {
    label: "Diner",
    modules: {},
    publicSections: [
      "hero",
      "quick_info",
      "specials",
      "menu_preview",
      "about",
      "contact",
    ],
  },

  pop_up: {
    label: "Pop-Up",
    modules: { hours: false, events: true, announcements: true },
    publicSections: [
      "hero",
      "announcements",
      "events",
      "menu_preview",
      "about",
      "contact",
    ],
  },

  food_truck: {
    label: "Food Truck",
    modules: { events: true },
    publicSections: [
      "hero",
      "quick_info",
      "specials",
      "featured_menu",
      "menu_preview",
      "about",
      "contact",
    ],
  },

  bar: {
    label: "Bar",
    modules: { events: true },
    publicSections: [
      "hero",
      "quick_info",
      "specials",
      "events",
      "gallery",
      "about",
      "contact",
    ],
  },
};

// ─── SERVICES MODULE SYSTEM ───────────────────────────────────────────────────
//
// Services categories share one conversion-focused module backbone.
// Categories are organized by HOW they convert customers, not by industry label.
//
//   on_demand   → call/request now (plumber, HVAC, locksmith, electrician, handyman)
//   project     → quote + plan + execute (contractor, roofer, landscaper, remodeler)
//   scheduled   → book an appointment (salon, barber, massage, trainer, cleaner)
//   professional → consult + advise (consultant, accountant, coach, agency)
//   mobile      → we come to you (mobile detailing, grooming, repair)
//
// Add a new industry by picking the right category preset — don't fork the system.

const SERVICES_BASE: KitModules = {
  homepage:      true,
  branding:      true,
  contact:       true,
  photos:        true,   // Project photos / work gallery
  hours:         true,   // Most services have operating hours
  google:        true,
  launch:        true,
  events:        false,
  announcements: false,
  menu:          false,
  specials:      false,
  offerings:     true,   // Service catalog — always on for services
  testimonials:  true,   // Trust signal — always on for services
  service_areas: false,  // Geographic coverage — on_demand + mobile override
  quote_request: false,  // Quote form — on_demand + project override
  booking:       false,  // Appointment flow — scheduled + mobile override
  products:      false,
  collections:   false,
};

const SERVICES_PRESETS: Record<ServicesCategory, CategoryPreset> = {
  on_demand: {
    label: "On-Demand Service",
    // Fast-response businesses: service areas + quote request are core conversion tools.
    modules: { service_areas: true, quote_request: true },
    publicSections: [
      "hero",
      "quick_info",
      "offerings",
      "service_areas",
      "testimonials",
      "contact",
    ],
  },

  project: {
    label: "Project-Based Service",
    // Project work: gallery of past work + quote request drive trust and conversion.
    modules: { quote_request: true },
    publicSections: [
      "hero",
      "offerings",
      "gallery",
      "testimonials",
      "contact",
    ],
  },

  scheduled: {
    label: "Scheduled Appointment",
    // Appointment-based: booking + hours are the primary conversion path.
    modules: { booking: true },
    publicSections: [
      "hero",
      "quick_info",
      "offerings",
      "testimonials",
      "contact",
    ],
  },

  professional: {
    label: "Professional Service",
    // Knowledge-based: no gallery needed; announcements for availability/news.
    modules: { photos: false, announcements: true },
    publicSections: [
      "hero",
      "offerings",
      "testimonials",
      "about",
      "contact",
    ],
  },

  mobile: {
    label: "Mobile Service",
    // Location-flexible: service areas + booking tell customers where and how.
    modules: { service_areas: true, booking: true, announcements: true },
    publicSections: [
      "hero",
      "quick_info",
      "service_areas",
      "offerings",
      "testimonials",
      "contact",
    ],
  },
};

// ─── RETAIL & PRODUCTS MODULE SYSTEM ─────────────────────────────────────────

const RETAIL_PRODUCTS_BASE: KitModules = {
  homepage:      true,
  branding:      true,
  contact:       true,
  photos:        true,
  hours:         false,
  google:        true,
  launch:        true,
  events:        false,
  announcements: false,
  menu:          false,
  specials:      false,
  offerings:     false,
  testimonials:  false,
  service_areas: false,
  quote_request: false,
  booking:       false,
  products:      true,
  collections:   false,
};

const RETAIL_PRODUCTS_PRESETS: Record<RetailProductsCategory, CategoryPreset> = {
  artist: {
    label: "Artist / Creator",
    modules: { products: false },
    publicSections: ["hero", "gallery", "about", "contact"],
  },

  maker: {
    label: "Maker / Craft",
    modules: {},
    publicSections: ["hero", "featured_products", "gallery", "about", "contact"],
  },

  retail: {
    label: "Retail Shop",
    modules: { hours: true, collections: true },
    publicSections: [
      "hero",
      "quick_info",
      "featured_products",
      "products",
      "gallery",
      "about",
      "contact",
    ],
  },

  brand: {
    label: "Brand / Lifestyle",
    modules: { collections: true },
    publicSections: ["hero", "featured_products", "gallery", "about", "contact"],
  },

  vintage: {
    label: "Vintage / Thrift",
    modules: { hours: true, collections: true },
    publicSections: [
      "hero",
      "quick_info",
      "products",
      "gallery",
      "about",
      "contact",
    ],
  },

  collector: {
    label: "Collector / Rare",
    modules: { collections: true },
    publicSections: ["hero", "featured_products", "products", "gallery", "about", "contact"],
  },
};

// ─── CORE RESOLVER ────────────────────────────────────────────────────────────
//
// All resolution paths lead here. Given a KitIdentity, returns the full
// resolved KitConfig. Add a new family by adding a case.

function resolveConfig(identity: KitIdentity): KitConfig {
  const { family, category } = identity;

  let base: KitModules;
  let preset: CategoryPreset;

  switch (family) {
    case "food_service":
      base   = FOOD_SERVICE_BASE;
      preset = FOOD_SERVICE_PRESETS[category as FoodServiceCategory]
             ?? FOOD_SERVICE_PRESETS.restaurant;
      break;
    case "services":
      base   = SERVICES_BASE;
      preset = SERVICES_PRESETS[category as ServicesCategory]
             ?? SERVICES_PRESETS.on_demand;
      break;
    case "retail_products":
      base   = RETAIL_PRODUCTS_BASE;
      preset = RETAIL_PRODUCTS_PRESETS[category as RetailProductsCategory]
             ?? RETAIL_PRODUCTS_PRESETS.maker;
      break;
    default:
      base   = FOOD_SERVICE_BASE;
      preset = FOOD_SERVICE_PRESETS.restaurant;
  }

  return {
    family,
    category,
    familyLabel:    FAMILY_LABELS[family],
    label:          preset.label,
    modules:        { ...base, ...preset.modules },
    publicSections: preset.publicSections,
  };
}

// ─── PUBLIC API — NEW ─────────────────────────────────────────────────────────

// Preferred entry point for new code: resolve from explicit KitIdentity.
export function getKitFamilyConfig(identity: KitIdentity): KitConfig {
  return resolveConfig(identity);
}

// Shorthand: resolve from category alone (family derived automatically).
export function getCategoryConfig(category: KitCategory): KitConfig {
  return resolveConfig({
    family: CATEGORY_FAMILY[category] ?? "food_service",
    category,
  });
}

// Resolve a KitIdentity from raw DB column values.
// Handles the legacy → new transition:
//   1. Prefers kit_category; falls back to kit_type (legacyKitType)
//   2. Remaps legacy DB values via LEGACY_CATEGORY_MAP (e.g. 'trade' → 'project')
//   3. Falls back to 'restaurant' if completely unrecognized
// Old 'creative' kit_family DB values self-correct because family is derived from category.
export function resolveKitIdentity({
  kitFamily: _kitFamily,
  kitCategory,
  legacyKitType,
}: {
  kitFamily?: string | null;
  kitCategory?: string | null;
  legacyKitType?: string | null;
}): KitIdentity {
  const category = isKitCategory(kitCategory)
    ? kitCategory
    : isKitCategory(legacyKitType)
    ? legacyKitType
    : (LEGACY_CATEGORY_MAP[kitCategory as string]
      ?? LEGACY_CATEGORY_MAP[legacyKitType as string]
      ?? "restaurant") as KitCategory;

  return {
    family: CATEGORY_FAMILY[category] ?? "food_service",
    category,
  };
}

// ─── PUBLIC API — BACKWARD COMPAT SHIMS ──────────────────────────────────────
//
// These preserve the existing API surface so all callers continue to compile
// without changes. They route through the new resolver internally.

export function getKitConfig(kitType: KitType): KitConfig {
  return getCategoryConfig(kitType);
}

export function getKitModules(kitType: KitType): KitModules {
  return getCategoryConfig(kitType).modules;
}

export function getPublicSections(kitType: KitType): PublicSectionType[] {
  return getCategoryConfig(kitType).publicSections;
}

export function getKitLabel(kitType: KitType): string {
  return getCategoryConfig(kitType).label;
}

// ─── TYPE GUARDS & COERCERS ───────────────────────────────────────────────────

export const ALL_KIT_CATEGORIES: readonly KitCategory[] = [
  "cafe", "diner", "restaurant", "pop_up", "food_truck", "bar",
  "on_demand", "project", "scheduled", "professional", "mobile",
  "artist", "maker", "retail", "brand", "vintage", "collector",
];

export const ALL_KIT_FAMILIES: readonly KitFamily[] = [
  "food_service", "services", "retail_products",
];

export const FOOD_SERVICE_CATEGORIES: readonly FoodServiceCategory[] = [
  "cafe", "diner", "restaurant", "pop_up", "food_truck", "bar",
];

export const SERVICES_CATEGORIES: readonly ServicesCategory[] = [
  "on_demand", "project", "scheduled", "professional", "mobile",
];

export const RETAIL_PRODUCTS_CATEGORIES: readonly RetailProductsCategory[] = [
  "artist", "maker", "retail", "brand", "vintage", "collector",
];

export function isKitCategory(value: unknown): value is KitCategory {
  return typeof value === "string"
    && (ALL_KIT_CATEGORIES as readonly string[]).includes(value);
}

export function isKitFamily(value: unknown): value is KitFamily {
  return typeof value === "string"
    && (ALL_KIT_FAMILIES as readonly string[]).includes(value);
}

// isKitType is now an alias for isKitCategory (KitType = KitCategory).
export function isKitType(value: unknown): value is KitType {
  return isKitCategory(value);
}

export function toKitType(value: unknown, fallback: KitType = "restaurant"): KitType {
  return isKitCategory(value) ? value : fallback;
}

export function toKitCategory(
  value: unknown,
  fallback: KitCategory = "restaurant",
): KitCategory {
  return isKitCategory(value) ? value : fallback;
}

export function toKitFamily(
  value: unknown,
  fallback: KitFamily = "food_service",
): KitFamily {
  return isKitFamily(value) ? value : fallback;
}
