// src/lib/rendering/resolve-render-contract.ts
// Pure function: SitePayload → resolved, filtered CategoryRenderContract.
//
// Guarantees:
//  1. Looks up the category contract via `${family}:${category}`; falls back
//     to a minimal safe contract for unknown combos.
//  2. Applies visibility rules per section:
//       - `required: true` → always kept, even if data is empty
//       - `visible: fn`    → kept iff fn(payload) returns true
//       - otherwise        → default per-type predicate (data-driven)
//  3. Preserves section order exactly as declared in the category contract.

import type { SitePayload } from "@/types/site";
import type {
  CategoryRenderContract,
  SectionContract,
} from "@/types/section-contract";
import {
  CATEGORY_RENDER_CONTRACTS,
  renderContractKey,
} from "@/lib/rendering/category-contracts";

function isSectionVisible(
  section: SectionContract,
  payload: SitePayload,
): boolean {
  if (typeof section.visible === "function") {
    return section.visible(payload);
  }

  switch (section.type) {
    case "menu":
      return payload.menuCategories.length > 0;
    case "specials":
      return payload.specials.length > 0;
    case "gallery":
      return payload.galleryImages.length > 0;
    case "reviews":
    case "testimonials":
      return payload.testimonials.length > 0;
    case "services":
    case "offerings":
      return payload.serviceOfferings.length > 0;
    case "service_areas":
      return payload.serviceAreas.length > 0;
    case "products":
    case "featured_items":
      return payload.products.length > 0;
    case "collections":
      return payload.collections.length > 0;
    case "events":
      return payload.events.length > 0;
    default:
      // Chrome & always-rendered sections (header, hero, footer,
      // announcement_bar, primary_cta, hours, location, contact,
      // quote_request, booking, brand_story, commissions) default to visible.
      return true;
  }
}

function getFallbackContract(payload: SitePayload): CategoryRenderContract {
  return {
    family: payload.kitFamily,
    category: payload.kitCategory,
    renderer: payload.rendererType,
    sections: [
      { type: "announcement_bar" },
      { type: "header", required: true },
      { type: "hero", required: true },
      { type: "contact", required: true },
      { type: "footer", required: true },
    ],
  };
}

export function resolveRenderContract(
  payload: SitePayload,
): CategoryRenderContract {
  const key = renderContractKey(payload.kitFamily, payload.kitCategory);
  const contract =
    CATEGORY_RENDER_CONTRACTS[key] ?? getFallbackContract(payload);

  return {
    ...contract,
    sections: contract.sections.filter((section) => {
      if (section.required) return true;
      return isSectionVisible(section, payload);
    }),
  };
}
