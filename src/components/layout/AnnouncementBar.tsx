import type { SiteSettings } from "@/types/site";

export function AnnouncementBar({ settings }: { settings: SiteSettings }) {
  const hasAnnouncement = settings.announcementText.trim().length > 0;

  return (
    <div
      aria-hidden={!hasAnnouncement}
      className={
        hasAnnouncement
          ? "border-b border-[var(--color-border)] bg-[var(--color-announcement-background)]"
          : "border-b border-transparent bg-transparent"
      }
    >
      <div
        className={`mx-auto flex h-9 max-w-6xl items-center justify-center px-4 text-center text-sm font-semibold sm:px-6 lg:px-8 ${
          hasAnnouncement
            ? "text-[var(--color-announcement-foreground)]"
            : "text-transparent"
        }`}
      >
        {hasAnnouncement ? settings.announcementText : "Announcement spacer"}
      </div>
    </div>
  );
}
