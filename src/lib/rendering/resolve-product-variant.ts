import type { KitCategory } from "@/types/kit";

export type ProductVariant = "gallery" | "editorial" | "dense" | "balanced";

// Maps retail_products category → product presentation variant.
// Categories outside retail_products never reach ProductsSection so the
// default fallback is a safety net, not a common path.
export function resolveProductVariant(category: KitCategory): ProductVariant {
  switch (category) {
    case "artist":
    case "maker":
      return "gallery";

    case "brand":
      return "editorial";

    case "vintage":
    case "collector":
      return "dense";

    case "retail":
    default:
      return "balanced";
  }
}
