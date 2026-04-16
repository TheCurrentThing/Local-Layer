import type { FeatureFlags } from "@/types/site";

// Toggle optional sections here before a new client launch.
export const featureFlags: FeatureFlags = {
  showBreakfastMenu: false,
  showLunchMenu: true,
  showDinnerMenu: true,
  showSpecials: true,
  showGallery: true,
  showTestimonials: false,
  showMap: true,
  showOnlineOrdering: false,
  showStickyMobileBar: true,
};
