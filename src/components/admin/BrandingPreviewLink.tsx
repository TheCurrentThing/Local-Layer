"use client";

import { Button } from "@/components/ui/button";
import type { ThemeTokens } from "@/lib/theme";

type BrandingPreviewLinkProps = {
  businessName: string;
  tagline: string;
  themeMode: "preset" | "custom";
  themePresetId: string;
  themeTokens: ThemeTokens;
};

export function BrandingPreviewLink({
  businessName,
  tagline,
  themeMode,
  themePresetId,
  themeTokens,
}: BrandingPreviewLinkProps) {
  function openPreview() {
    const payload = encodeURIComponent(
      JSON.stringify({
        businessName,
        tagline,
        themeMode,
        themePresetId,
        themeTokens,
      }),
    );

    window.open(`/preview?brand_preview=${payload}`, "_blank", "noopener,noreferrer");
  }

  return (
    <Button type="button" variant="outline" onClick={openPreview}>
      Preview Website
    </Button>
  );
}

export default BrandingPreviewLink;
