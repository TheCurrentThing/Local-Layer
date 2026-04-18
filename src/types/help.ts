export type HelpBlockType =
  | "paragraph"
  | "heading"
  | "steps"
  | "tip"
  | "warning"
  | "link_list";

export interface HelpBlock {
  type: HelpBlockType;
  text?: string;
  items?: string[];
  links?: { label: string; href: string }[];
}

export interface HelpArticle {
  id: string;
  title: string;
  summary: string;
  blocks: HelpBlock[];
}

export type HelpCategorySlug =
  | "getting-started"
  | "modules"
  | "troubleshooting"
  | "growth"
  | "domains"
  | "billing"
  | "contact";

export interface HelpCategoryMeta {
  slug: HelpCategorySlug;
  title: string;
  description: string;
  icon: string;
  articles: HelpArticle[];
}
