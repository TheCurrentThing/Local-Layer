export interface MenuItemOption {
  id: string;
  name: string;
  priceDelta: number;
  isActive: boolean;
  sortOrder: number;
}

export interface MenuItemOptionGroup {
  id: string;
  name: string;
  required: boolean;
  multiSelect: boolean;
  selectionLimit: number | null;
  sortOrder: number;
  options: MenuItemOption[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  isActive: boolean;
  isSoldOut: boolean;
  isFeatured: boolean;
  sortOrder: number;
  optionGroups: MenuItemOptionGroup[];
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  serviceWindow?: "breakfast" | "lunch" | "dinner" | "all-day";
  isActive: boolean;
  sortOrder: number;
  items: MenuItem[];
}

export interface BusinessSpecial {
  id: string;
  title: string;
  description: string;
  price: number | null;
  label: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
}
