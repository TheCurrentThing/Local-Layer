import { gettingStarted } from "./getting-started";
import { modules } from "./modules";
import { troubleshooting } from "./troubleshooting";
import { growth } from "./growth";
import { domains } from "./domains";
import { billing } from "./billing";
import { contact } from "./contact";
import type { HelpCategoryMeta, HelpCategorySlug } from "@/types/help";

export const HELP_CATEGORIES: HelpCategoryMeta[] = [
  gettingStarted,
  modules,
  troubleshooting,
  growth,
  domains,
  billing,
  contact,
];

export function getHelpCategory(slug: string): HelpCategoryMeta | undefined {
  return HELP_CATEGORIES.find((c) => c.slug === slug);
}

export function isHelpCategorySlug(value: string): value is HelpCategorySlug {
  return HELP_CATEGORIES.some((c) => c.slug === value);
}
