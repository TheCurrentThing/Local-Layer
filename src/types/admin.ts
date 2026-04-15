export type AdminSectionKey =
  | "overview"
  | "setup"
  | "branding"
  | "homepage"
  | "menu"
  | "specials"
  | "hours"
  | "photos"
  | "contact"
  | "settings";

export interface AdminNavItem {
  label: string;
  href: string;
  key: AdminSectionKey;
  description: string;
}
