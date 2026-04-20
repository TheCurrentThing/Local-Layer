// Thin notice strip. Only renders when announcementText is non-empty.

import type { SitePayload } from "@/types/site";

export function AnnouncementBarSection({ payload }: { payload: SitePayload }) {
  const text = payload.settings.announcementText;
  if (!text) return null;

  return (
    <div
      data-section="announcement_bar"
      className="px-4 py-2 text-center text-sm font-medium"
      style={{
        backgroundColor: payload.brand.announcementBackgroundColor || "var(--color-primary)",
        color: payload.brand.announcementTextColor || "#fff",
      }}
    >
      {text}
    </div>
  );
}
