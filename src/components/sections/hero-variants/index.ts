// Category → hero variant resolver.
//
// Contract: every variant accepts `{ payload: SitePayload }` and renders its
// own <section data-section="hero" data-hero-variant="…">. The outer
// HeroSection component remains the single entry point; it delegates here.
//
// Adding a variant:
//   1. Write HeroFoo.tsx next to this file
//   2. Add the category key to HERO_VARIANTS below
// Any category not listed falls through to HeroDefault.

import type { KitCategory } from "@/types/kit";
import type { SitePayload } from "@/types/site";
import { HeroDefault } from "./HeroDefault";
import { HeroOnDemand } from "./HeroOnDemand";
import { HeroProject } from "./HeroProject";
import { HeroArtist } from "./HeroArtist";
import { HeroFoodTruck } from "./HeroFoodTruck";
import { HeroBar } from "./HeroBar";

export type HeroVariant = (props: { payload: SitePayload }) => React.ReactElement;

const HERO_VARIANTS: Partial<Record<KitCategory, HeroVariant>> = {
  on_demand:  HeroOnDemand,
  project:    HeroProject,
  artist:     HeroArtist,
  food_truck: HeroFoodTruck,
  bar:        HeroBar,
};

export function resolveHeroVariant(category: KitCategory): HeroVariant {
  return HERO_VARIANTS[category] ?? HeroDefault;
}

export { HeroDefault };
