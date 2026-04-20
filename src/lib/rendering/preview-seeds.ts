// Category-aware seed fragments for the Branding preview stage when the real
// business payload has no content for a given family/category combo. Each
// fragment fills only the arrays the target category contract renders.
// Shell/copy fields (businessName, tagline, phone, hours, socials, theme) come
// from the real payload + branding draft — NEVER from here.
//
// This module is data-only. No resolver logic, no theme, no fonts.
// `buildPreviewPayload` in preview-payload.ts is the single consumer.

import type {
  BusinessEvent,
  Collection,
  GalleryImage,
  Product,
  ServiceArea,
  ServiceOffering,
  Testimonial,
} from "@/types/site";
import type { BusinessSpecial, MenuCategory } from "@/types/menu";
import type { KitCategory, KitFamily } from "@/types/kit";

export type CategorySeed = {
  serviceOfferings?: ServiceOffering[];
  serviceAreas?: ServiceArea[];
  products?: Product[];
  collections?: Collection[];
  galleryImages?: GalleryImage[];
  events?: BusinessEvent[];
  testimonials?: Testimonial[];
  menuCategories?: MenuCategory[];
  specials?: BusinessSpecial[];
};

// ── services/on_demand ────────────────────────────────────────────────────────
const onDemandSeed: CategorySeed = {
  serviceOfferings: [
    {
      id: "svc-1",
      title: "Emergency plumbing",
      shortDescription: "Burst pipes, clogged drains, water heater failures — we're there within 60 minutes.",
      startingPrice: "From $149",
      isFeatured: true,
      isActive: true,
      sortOrder: 1,
    },
    {
      id: "svc-2",
      title: "Electrical repair",
      shortDescription: "Breaker trips, dead outlets, lighting faults. Licensed master electricians on call.",
      startingPrice: "From $129",
      isFeatured: false,
      isActive: true,
      sortOrder: 2,
    },
    {
      id: "svc-3",
      title: "HVAC service",
      shortDescription: "No heat, no cooling, weird noises. Same-day diagnostic and repair.",
      startingPrice: "From $99 diagnostic",
      isFeatured: false,
      isActive: true,
      sortOrder: 3,
    },
  ],
  serviceAreas: [
    { id: "area-1", name: "Downtown",    isActive: true, sortOrder: 1 },
    { id: "area-2", name: "East Side",   isActive: true, sortOrder: 2 },
    { id: "area-3", name: "South Hills", isActive: true, sortOrder: 3 },
    { id: "area-4", name: "Riverside",   isActive: true, sortOrder: 4 },
    { id: "area-5", name: "North County",isActive: true, sortOrder: 5 },
  ],
  testimonials: [
    {
      id: "t-1",
      quote: "Called at 10pm with a flooded basement. Someone was there by 11 and had it fixed before midnight.",
      author: "Marcus R.",
      rating: 5,
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
    },
    {
      id: "t-2",
      quote: "Upfront pricing, clean work, respectful to the house. Exactly what I want from a trade.",
      author: "Dana P.",
      rating: 5,
      isActive: true,
      isFeatured: false,
      sortOrder: 2,
    },
  ],
};

// ── services/project ──────────────────────────────────────────────────────────
const projectSeed: CategorySeed = {
  serviceOfferings: [
    {
      id: "p-1",
      title: "Kitchen remodel",
      shortDescription: "Full-scope remodels from design to final walkthrough. 6–10 week timelines.",
      startingPrice: "Projects from $28k",
      isFeatured: true,
      isActive: true,
      sortOrder: 1,
    },
    {
      id: "p-2",
      title: "Bathroom renovation",
      shortDescription: "Tile, plumbing, lighting, fixtures. Detailed estimate within 48 hours.",
      startingPrice: "Projects from $14k",
      isFeatured: false,
      isActive: true,
      sortOrder: 2,
    },
    {
      id: "p-3",
      title: "Whole-home refresh",
      shortDescription: "Paint, flooring, trim, and finish work scoped as one coordinated project.",
      startingPrice: "Quoted per scope",
      isFeatured: false,
      isActive: true,
      sortOrder: 3,
    },
  ],
  galleryImages: [
    { id: "g-1", src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=70", alt: "Finished kitchen remodel — walnut cabinetry, quartz island", isActive: true, sortOrder: 1 },
    { id: "g-2", src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=70", alt: "Primary bath — honed marble, brass fixtures",               isActive: true, sortOrder: 2 },
    { id: "g-3", src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=70", alt: "Living area after whole-home refresh",                       isActive: true, sortOrder: 3 },
    { id: "g-4", src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=70", alt: "Trim and millwork detail",                                    isActive: true, sortOrder: 4 },
  ],
  testimonials: [
    {
      id: "pt-1",
      quote: "Delivered on the day they quoted. The crew kept the house livable through a six-week build.",
      author: "The Halvorsen family",
      rating: 5,
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
    },
  ],
};

// ── retail_products/artist ────────────────────────────────────────────────────
const artistSeed: CategorySeed = {
  galleryImages: [
    { id: "ar-1", src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1400&q=70", alt: "Large abstract canvas, warm earth palette",    isActive: true, sortOrder: 1 },
    { id: "ar-2", src: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=1400&q=70", alt: "Mixed-media studio work in progress",           isActive: true, sortOrder: 2 },
    { id: "ar-3", src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1400&q=70", alt: "Ceramic vessel series, raw clay",               isActive: true, sortOrder: 3 },
    { id: "ar-4", src: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1400&q=70", alt: "Framed studies, small format",                  isActive: true, sortOrder: 4 },
  ],
  products: [
    { id: "w-1", name: "Still life, no. 07",       price: 1850, description: "Oil on linen, 36 × 48 in. Framed in white oak.",      isActive: true, sortOrder: 1 },
    { id: "w-2", name: "Coastline study (iii)",    price: 960,  description: "Watercolor and graphite on cold-press. 18 × 24 in.", isActive: true, sortOrder: 2 },
    { id: "w-3", name: "Vessel series, raw",       price: 340,  description: "Hand-thrown stoneware. Food safe.",                  isActive: true, sortOrder: 3 },
  ],
};

// ── retail_products/retail ────────────────────────────────────────────────────
const retailSeed: CategorySeed = {
  products: [
    { id: "r-1", name: "Everyday tote",  price: 128, imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=70", description: "Waxed canvas, leather straps, solid brass hardware.", isActive: true, sortOrder: 1 },
    { id: "r-2", name: "Field cap",      price: 42,  imageUrl: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=70", description: "Washed cotton twill. Sized S/M and L/XL.",           isActive: true, sortOrder: 2 },
    { id: "r-3", name: "Enamel mug",     price: 22,  imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800&q=70", description: "Double-dipped enamel, speckled rim.",                isActive: true, sortOrder: 3 },
    { id: "r-4", name: "Weekend crew",   price: 74,  imageUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=70", description: "Heavyweight fleece, garment-dyed.",                  isActive: true, sortOrder: 4 },
  ],
  collections: [
    { id: "col-1", name: "Spring essentials", slug: "spring-essentials", coverImageUrl: "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?w=1200&q=70", isActive: true, sortOrder: 1 },
    { id: "col-2", name: "Everyday carry",    slug: "everyday-carry",    coverImageUrl: "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=1200&q=70", isActive: true, sortOrder: 2 },
    { id: "col-3", name: "Limited run",       slug: "limited-run",       coverImageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=70", isActive: true, sortOrder: 3 },
  ],
};

// ── food_service/food_truck ───────────────────────────────────────────────────
const foodTruckSeed: CategorySeed = {
  menuCategories: [
    {
      id: "street",
      name: "On the menu",
      slug: "on-the-menu",
      serviceWindow: "all-day",
      isActive: true,
      sortOrder: 1,
      items: [
        { id: "ft-1", categoryId: "street", name: "Smash burger",  description: "Double smash, house sauce, pickles, onion, sesame bun.", price: 12, tags: ["Signature"], isActive: true, isSoldOut: false, isFeatured: true,  sortOrder: 1, optionGroups: [] },
        { id: "ft-2", categoryId: "street", name: "Crinkle fries", description: "Beef-fat fried, flaky salt.",                             price: 5,  tags: [],           isActive: true, isSoldOut: false, isFeatured: false, sortOrder: 2, optionGroups: [] },
        { id: "ft-3", categoryId: "street", name: "Milkshake",     description: "Vanilla, chocolate, or strawberry. Real soft-serve.",    price: 7,  tags: [],           isActive: true, isSoldOut: false, isFeatured: false, sortOrder: 3, optionGroups: [] },
      ],
    },
  ],
  events: [
    { id: "e-1", title: "Thursday night at Fourth + Commerce", startsAt: "2025-06-05T17:00:00", location: "Fourth & Commerce lot", description: "Every Thursday evening, 5pm until sell-out.", isActive: true, sortOrder: 1 },
    { id: "e-2", title: "Saturday farmers market",             startsAt: "2025-06-07T09:00:00", location: "Riverside park",         description: "9am–2pm, rain or shine.",                   isActive: true, sortOrder: 2 },
  ],
  specials: [
    { id: "ft-sp-1", title: "Friday double-up", description: "Buy any burger, get the second for $5. Fridays only.", price: 5, label: "This week", isActive: true, isFeatured: true, sortOrder: 1 },
  ],
};

// ── food_service/restaurant ───────────────────────────────────────────────────
const restaurantSeed: CategorySeed = {
  menuCategories: [
    {
      id: "r-starters",
      name: "Starters",
      slug: "starters",
      serviceWindow: "all-day",
      isActive: true,
      sortOrder: 1,
      items: [
        { id: "rs-1", categoryId: "r-starters", name: "House focaccia",   description: "Rosemary, flaky salt, olive oil for dipping.",               price: 8,  tags: [], isActive: true, isSoldOut: false, isFeatured: false, sortOrder: 1, optionGroups: [] },
        { id: "rs-2", categoryId: "r-starters", name: "Little gem salad", description: "Little gem lettuce, shaved pecorino, lemon anchovy dressing.", price: 13, tags: [], isActive: true, isSoldOut: false, isFeatured: false, sortOrder: 2, optionGroups: [] },
      ],
    },
    {
      id: "r-mains",
      name: "Mains",
      slug: "mains",
      serviceWindow: "all-day",
      isActive: true,
      sortOrder: 2,
      items: [
        { id: "rm-1", categoryId: "r-mains", name: "Braised short rib", description: "Red wine, root vegetables, soft polenta.", price: 32, tags: [], isActive: true, isSoldOut: false, isFeatured: true,  sortOrder: 1, optionGroups: [] },
        { id: "rm-2", categoryId: "r-mains", name: "Seared trout",      description: "Citrus butter, fingerling potatoes, wilted greens.",  price: 26, tags: [], isActive: true, isSoldOut: false, isFeatured: false, sortOrder: 2, optionGroups: [] },
      ],
    },
  ],
};

// ── Registry ──────────────────────────────────────────────────────────────────

const SEED_BY_KEY: Record<string, CategorySeed> = {
  "services:on_demand":         onDemandSeed,
  "services:project":           projectSeed,
  "services:scheduled":         onDemandSeed,
  "services:professional":      projectSeed,
  "services:mobile":            onDemandSeed,
  "retail_products:artist":     artistSeed,
  "retail_products:maker":      artistSeed,
  "retail_products:retail":     retailSeed,
  "retail_products:brand":      retailSeed,
  "retail_products:vintage":    retailSeed,
  "retail_products:collector":  retailSeed,
  "food_service:food_truck":    foodTruckSeed,
  "food_service:pop_up":        foodTruckSeed,
  "food_service:restaurant":    restaurantSeed,
  "food_service:diner":         restaurantSeed,
  "food_service:cafe":          restaurantSeed,
  "food_service:bar":           restaurantSeed,
};

export function getCategorySeed(
  family: KitFamily,
  category: KitCategory,
): CategorySeed {
  return SEED_BY_KEY[`${family}:${category}`] ?? {};
}
