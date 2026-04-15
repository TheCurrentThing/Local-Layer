import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { AdminNavItem, AdminSectionKey } from "@/types/admin";

const adminNavItems: AdminNavItem[] = [
  {
    key: "overview",
    label: "Overview",
    href: "/admin",
    description: "See what needs attention today",
  },
  {
    key: "setup",
    label: "Setup",
    href: "/admin/setup",
    description: "Walk through first-time setup",
  },
  {
    key: "branding",
    label: "Branding",
    href: "/admin/branding",
    description: "Logo, colors, fonts, business look",
  },
  {
    key: "homepage",
    label: "Homepage",
    href: "/admin/homepage",
    description: "Hero, announcement, homepage sections",
  },
  {
    key: "menu",
    label: "Menu",
    href: "/admin/menu",
    description: "Menu sections, items, prices",
  },
  {
    key: "specials",
    label: "Specials",
    href: "/admin/specials",
    description: "Today's specials and banner updates",
  },
  {
    key: "hours",
    label: "Hours",
    href: "/admin/hours",
    description: "Open hours and quick summary",
  },
  {
    key: "photos",
    label: "Photos",
    href: "/admin/photos",
    description: "Gallery image links and captions",
  },
  {
    key: "contact",
    label: "Contact Info",
    href: "/admin/contact",
    description: "Phone, address, email, social links",
  },
  {
    key: "settings",
    label: "Settings",
    href: "/admin/settings",
    description: "Site switches and visibility options",
  },
];

export function AdminShell({
  title,
  description,
  children,
  brandName,
  activeKey,
  eyebrow,
}: {
  title: string;
  description: string;
  children: ReactNode;
  brandName: string;
  activeKey: AdminSectionKey;
  eyebrow?: string;
}) {
  const activeItem =
    adminNavItems.find((item) => item.key === activeKey) ?? adminNavItems[0];

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <AdminSidebar
            brandName={brandName}
            items={adminNavItems}
            persistenceEnabled={isSupabaseConfigured()}
          />
        </div>

        <main className="space-y-6">
          <AdminHeader
            eyebrow={eyebrow ?? activeItem.label}
            title={title}
            description={description}
          />
          {children}
        </main>
      </div>
    </div>
  );
}
