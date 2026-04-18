import type { KitType, KitConfig, KitModules, PublicSectionType } from "@/types/kit";

// ─── PER-KIT CONFIGURATION ───────────────────────────────────────────────────
//
// This is the single source of truth for what each kit supports.
// Nothing else in the codebase should hard-code kit-specific logic.
//
// Rules:
//   modules  — controls admin sidebar visibility
//   publicSections — controls homepage section rendering (in display order)

const KIT_CONFIGS: Record<KitType, KitConfig> = {
  restaurant: {
    type: "restaurant",
    label: "Restaurant",
    modules: {
      homepage: true,
      branding: true,
      menu: true,
      specials: true,
      hours: true,
      photos: true,
      contact: true,
      google: true,
      launch: true,
    },
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

  food_truck: {
    type: "food_truck",
    label: "Food Truck",
    modules: {
      homepage: true,
      branding: true,
      menu: true,
      specials: true,
      hours: true,
      photos: true,
      contact: true,
      google: true,
      launch: true,
    },
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

  artist: {
    type: "artist",
    label: "Artist / Creator",
    modules: {
      homepage: true,
      branding: true,
      menu: false,
      specials: false,
      hours: false,
      photos: true,
      contact: true,
      google: true,
      launch: true,
    },
    publicSections: ["hero", "gallery", "about", "contact"],
  },

  trade: {
    type: "trade",
    label: "Trade / Service",
    modules: {
      homepage: true,
      branding: true,
      menu: false,
      specials: false,
      hours: true,
      photos: true,
      contact: true,
      google: true,
      launch: true,
    },
    publicSections: ["hero", "gallery", "quick_info", "about", "contact"],
  },
};

// ─── RESOLVERS ───────────────────────────────────────────────────────────────

export function getKitConfig(kitType: KitType): KitConfig {
  return KIT_CONFIGS[kitType] ?? KIT_CONFIGS.restaurant;
}

export function getKitModules(kitType: KitType): KitModules {
  return getKitConfig(kitType).modules;
}

export function getPublicSections(kitType: KitType): PublicSectionType[] {
  return getKitConfig(kitType).publicSections;
}

// Returns the kit label for display purposes (e.g. "Food Truck").
export function getKitLabel(kitType: KitType): string {
  return getKitConfig(kitType).label;
}

// Type guard — ensures an unknown string is a valid KitType.
export function isKitType(value: unknown): value is KitType {
  return (
    typeof value === "string" &&
    Object.keys(KIT_CONFIGS).includes(value)
  );
}

// Normalise an unknown value to a KitType with a safe fallback.
export function toKitType(value: unknown, fallback: KitType = "restaurant"): KitType {
  return isKitType(value) ? value : fallback;
}
