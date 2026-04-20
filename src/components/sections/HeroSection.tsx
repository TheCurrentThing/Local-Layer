// Single hero entry point for the section component map.
// Delegates to a category-specific variant resolved at render time.
// The variant contract is unchanged: one component, one slot, one payload prop.

import type { SitePayload } from "@/types/site";
import { resolveHeroVariant } from "./hero-variants";

export function HeroSection({ payload }: { payload: SitePayload }) {
  const Variant = resolveHeroVariant(payload.kitCategory);
  return <Variant payload={payload} />;
}
