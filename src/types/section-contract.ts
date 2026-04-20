// src/types/section-contract.ts
// Contract shape: a category defines an ordered list of sections to render,
// each with optional `required` and/or `visible(payload)` predicates.

import type { PublicSectionType, KitFamily, KitCategory, RendererType } from "@/types/kit";
import type { SitePayload } from "@/types/site";

export interface SectionContract {
  type: PublicSectionType;
  required?: boolean;
  visible?: (payload: SitePayload) => boolean;
}

export interface CategoryRenderContract {
  family: KitFamily;
  category: KitCategory;
  renderer: RendererType;
  sections: SectionContract[];
}
