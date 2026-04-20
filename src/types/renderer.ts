import type { KitType, RendererType } from "@/types/kit";
import type { SitePayload } from "@/types/site";

// RendererType is defined in @/types/kit — re-exported here so all existing
// `import { RendererType } from "@/types/renderer"` call sites keep compiling.
export type { RendererType } from "@/types/kit";

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
