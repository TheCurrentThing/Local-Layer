export type AdminSectionKey =
  // ── Site management (kit-aware)
  | "overview"
  | "setup"
  | "branding"
  | "homepage"
  | "menu"
  | "specials"
  | "hours"
  | "photos"
  | "contact"
  | "launch"
  | "google"
  // ── Site configuration
  | "settings"
  // ── Platform / account management
  | "domains"
  | "billing"
  | "account"
  | "help";

export interface AdminNavItem {
  label: string;
  href: string;
  key: AdminSectionKey;
  description: string;
}
