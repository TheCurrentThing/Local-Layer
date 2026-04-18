import type { KitType } from "@/types/kit";
import type { SitePayload } from "@/types/site";

export type RendererType = "standard" | "signature";

// What kind of business + how it should be rendered.
// Passed to getRenderer() to select the right implementation.
export type RendererContext = {
  kitType: KitType;
  rendererType: RendererType;
};

// Props received by every renderer implementation.
// The renderer owns section selection and ordering — not the page.
export interface SiteRendererProps {
  payload: SitePayload;
  basePath: string;
}
