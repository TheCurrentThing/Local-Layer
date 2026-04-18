import { StandardRenderer } from "@/renderers/StandardRenderer";
import { SignatureRenderer } from "@/renderers/SignatureRenderer";
import type { SiteRendererProps } from "@/types/renderer";

// Entry point for all public site rendering.
// Reads rendererType from the payload and delegates to the correct implementation.
// Pages and layouts should use this — never import renderers directly.
export function SiteRenderer(props: SiteRendererProps) {
  switch (props.payload.rendererType) {
    case "signature":
      return <SignatureRenderer {...props} />;
    case "standard":
    default:
      return <StandardRenderer {...props} />;
  }
}
