// src/lib/rendering/category-contracts.ts
// Strict per-category section order and required/optional flags.
// Structure lives HERE — not in the renderer, not in components.
//
// Keys are `${family}:${category}` so two families can safely share a
// category name in the future without colliding.
// Categories not defined here fall through to the resolver's safe fallback.

import type { KitCategory, KitFamily } from "@/types/kit";
import type { CategoryRenderContract } from "@/types/section-contract";

export function renderContractKey(
  family: KitFamily,
  category: KitCategory,
): string {
  return `${family}:${category}`;
}

export const CATEGORY_RENDER_CONTRACTS: Record<string, CategoryRenderContract> = {
  // ── Food Service ────────────────────────────────────────────────────────────

  [renderContractKey("food_service", "restaurant")]: {
    family: "food_service",
    category: "restaurant",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "menu", required: true },
      { type: "specials" },
      { type: "gallery" },
      { type: "reviews" },
      { type: "hours" },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  [renderContractKey("food_service", "cafe")]: {
    family: "food_service",
    category: "cafe",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "menu", required: true },
      { type: "gallery" },
      { type: "hours" },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  [renderContractKey("food_service", "diner")]: {
    family: "food_service",
    category: "diner",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "specials" },
      { type: "menu", required: true },
      { type: "hours" },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  [renderContractKey("food_service", "pop_up")]: {
    family: "food_service",
    category: "pop_up",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "events" },
      { type: "menu", required: true },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  [renderContractKey("food_service", "food_truck")]: {
    family: "food_service",
    category: "food_truck",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "location", required: true },
      { type: "menu", required: true },
      { type: "specials" },
      { type: "events" },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  [renderContractKey("food_service", "bar")]: {
    family: "food_service",
    category: "bar",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "specials" },
      { type: "events" },
      { type: "gallery" },
      { type: "hours" },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  // ── Services ────────────────────────────────────────────────────────────────

  [renderContractKey("services", "on_demand")]: {
    family: "services",
    category: "on_demand",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "primary_cta", required: true },
      { type: "services", required: true },
      { type: "service_areas", required: true },
      { type: "testimonials" },
      { type: "hours" },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  [renderContractKey("services", "project")]: {
    family: "services",
    category: "project",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "gallery" },
      { type: "services", required: true },
      { type: "testimonials" },
      { type: "quote_request", required: true },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  [renderContractKey("services", "scheduled")]: {
    family: "services",
    category: "scheduled",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "services", required: true },
      { type: "testimonials" },
      { type: "booking", required: true },
      { type: "hours" },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  [renderContractKey("services", "professional")]: {
    family: "services",
    category: "professional",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "services", required: true },
      { type: "testimonials" },
      { type: "quote_request" },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  [renderContractKey("services", "mobile")]: {
    family: "services",
    category: "mobile",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "service_areas", required: true },
      { type: "services", required: true },
      { type: "testimonials" },
      { type: "booking" },
      { type: "hours" },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  // ── Retail & Products ────────────────────────────────────────────────────────

  [renderContractKey("retail_products", "artist")]: {
    family: "retail_products",
    category: "artist",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "gallery", required: true },
      { type: "featured_items" },
      { type: "brand_story" },
      { type: "commissions" },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  [renderContractKey("retail_products", "maker")]: {
    family: "retail_products",
    category: "maker",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "featured_items" },
      { type: "gallery" },
      { type: "brand_story" },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  [renderContractKey("retail_products", "retail")]: {
    family: "retail_products",
    category: "retail",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "featured_items" },
      { type: "collections" },
      { type: "products", required: true },
      { type: "hours" },
      { type: "location" },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  [renderContractKey("retail_products", "brand")]: {
    family: "retail_products",
    category: "brand",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "featured_items" },
      { type: "collections" },
      { type: "gallery" },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  [renderContractKey("retail_products", "vintage")]: {
    family: "retail_products",
    category: "vintage",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "products", required: true },
      { type: "gallery" },
      { type: "hours" },
      { type: "location" },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },

  [renderContractKey("retail_products", "collector")]: {
    family: "retail_products",
    category: "collector",
    renderer: "standard",
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "featured_items" },
      { type: "products", required: true },
      { type: "gallery" },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  },
};
