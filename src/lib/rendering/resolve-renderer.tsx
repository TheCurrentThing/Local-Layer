// src/lib/rendering/resolve-renderer.tsx
// Single decision point for which renderer shell wraps a payload.
// Preview and live both call this — never hand-pick a renderer elsewhere.
//
// Safety: SignatureRenderer today is food_service only. Non-food payloads
// that request "signature" silently fall through to StandardRenderer.
// In development we warn so this downgrade is findable; production stays silent.

import type { ComponentType } from "react";
import type { RendererType } from "@/types/kit";
import type { SitePayload } from "@/types/site";
import type { SiteRendererProps } from "@/types/renderer";
import { StandardRenderer } from "@/renderers/StandardRenderer";
import { SignatureRenderer } from "@/renderers/SignatureRenderer";

function warnSignatureDowngrade(
  payload: SitePayload,
  effective: RendererType,
): void {
  if (process.env.NODE_ENV === "production") return;
  console.warn(
    "[resolveRenderer] Signature renderer requested for non-food family; falling back to Standard.",
    {
      requested: payload.rendererType,
      effective,
      family: payload.kitFamily,
      category: payload.kitCategory,
    },
  );
}

export function resolveRenderer(
  payload: SitePayload,
): ComponentType<SiteRendererProps> {
  if (payload.rendererType === "signature") {
    if (payload.kitFamily === "food_service") {
      return SignatureRenderer;
    }
    warnSignatureDowngrade(payload, "standard");
    return StandardRenderer;
  }
  return StandardRenderer;
}
