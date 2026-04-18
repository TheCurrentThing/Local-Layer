import type { RendererType } from "@/types/renderer";

// Coerce an unknown DB value to a valid RendererType.
// Anything unrecognized falls back to the safe default.
export function toRendererType(value: unknown): RendererType {
  if (value === "signature") return "signature";
  return "standard";
}
