export type KitType = "restaurant" | "food_truck" | "artist" | "trade";

export interface KitCategory {
  name: string;
  slug: string;
  serviceWindow: string;
  sortOrder: number;
  items: Array<{
    name: string;
    description: string;
    price: number;
    tags: string[];
    isFeatured: boolean;
    sortOrder: number;
  }>;
}

export interface KitSpecial {
  title: string;
  description: string;
  price: number | null;
  label: string;
  isFeatured: boolean;
  sortOrder: number;
}

export interface KitDefinition {
  type: KitType;
  label: string;
  description: string;
  tags: string[];
  categories: KitCategory[];
  specials: KitSpecial[];
  features: {
    showBreakfastMenu: boolean;
    showLunchMenu: boolean;
    showDinnerMenu: boolean;
    showSpecials: boolean;
    showGallery: boolean;
    showTestimonials: boolean;
    showMap: boolean;
    showOnlineOrdering: boolean;
    showStickyMobileBar: boolean;
  };
  defaults: {
    heroEyebrow: string;
    heroHeadline: string;
    heroSubheadline: string;
    heroPrimaryCtaLabel: string;
    aboutTitle: string;
    aboutBody: string[];
    galleryTitle: string;
    menuPreviewTitle: string;
    contactTitle: string;
  };
}

export const KITS: Record<KitType, KitDefinition> = {
  restaurant: {
    type: "restaurant",
    label: "Restaurant",
    description: "Full-service dining — menu, specials, gallery, and hours.",
    tags: ["Menu", "Specials", "Gallery", "Hours"],
    categories: [
      {
        name: "Starters",
        slug: "starters",
        serviceWindow: "all-day",
        sortOrder: 1,
        items: [
          { name: "Chef's Seasonal Starter", description: "Ask your server about today's selection.", price: 12, tags: ["Chef's Pick"], isFeatured: true, sortOrder: 1 },
          { name: "Garlic Bread", description: "Toasted sourdough, garlic butter, fresh herbs.", price: 7, tags: [], isFeatured: false, sortOrder: 2 },
        ],
      },
      {
        name: "Mains",
        slug: "mains",
        serviceWindow: "all-day",
        sortOrder: 2,
        items: [
          { name: "House Signature Main", description: "Our chef's flagship dish — ask your server for details.", price: 24, tags: ["House Favorite"], isFeatured: true, sortOrder: 1 },
          { name: "Seasonal Pasta", description: "Fresh pasta with seasonal ingredients and house sauce.", price: 18, tags: [], isFeatured: false, sortOrder: 2 },
          { name: "Garden Plate", description: "Seasonal vegetables, house-made dressing, grain.", price: 16, tags: ["Vegetarian"], isFeatured: false, sortOrder: 3 },
        ],
      },
      {
        name: "Desserts",
        slug: "desserts",
        serviceWindow: "all-day",
        sortOrder: 3,
        items: [
          { name: "Seasonal Dessert", description: "Ask your server about today's dessert selection.", price: 9, tags: [], isFeatured: false, sortOrder: 1 },
        ],
      },
      {
        name: "Drinks",
        slug: "drinks",
        serviceWindow: "all-day",
        sortOrder: 4,
        items: [
          { name: "House Lemonade", description: "Fresh-squeezed, house-made.", price: 4, tags: [], isFeatured: false, sortOrder: 1 },
          { name: "Sparkling Water", description: "500ml, chilled.", price: 3, tags: [], isFeatured: false, sortOrder: 2 },
        ],
      },
    ],
    specials: [
      { title: "Chef's Special", description: "Our rotating daily special — ask your server for today's selection.", price: null, label: "Daily Special", isFeatured: true, sortOrder: 1 },
    ],
    features: {
      showBreakfastMenu: false,
      showLunchMenu: true,
      showDinnerMenu: true,
      showSpecials: true,
      showGallery: true,
      showTestimonials: false,
      showMap: true,
      showOnlineOrdering: false,
      showStickyMobileBar: true,
    },
    defaults: {
      heroEyebrow: "Now Open",
      heroHeadline: "Great food, made right.",
      heroSubheadline: "Dine in or take out — fresh, local, and made to order.",
      heroPrimaryCtaLabel: "View Menu",
      aboutTitle: "About Us",
      aboutBody: [
        "We're a local restaurant committed to fresh ingredients, honest cooking, and genuine hospitality.",
        "Every dish is made to order. Every visit matters.",
      ],
      galleryTitle: "Our Space",
      menuPreviewTitle: "Our Menu",
      contactTitle: "Find Us",
    },
  },

  food_truck: {
    type: "food_truck",
    label: "Food Truck",
    description: "Mobile menu with rotating specials and location updates.",
    tags: ["Menu", "Specials", "Location", "Hours"],
    categories: [
      {
        name: "Today's Menu",
        slug: "todays-menu",
        serviceWindow: "all-day",
        sortOrder: 1,
        items: [
          { name: "Signature Plate", description: "Our most-loved dish. Fresh today.", price: 14, tags: ["Best Seller"], isFeatured: true, sortOrder: 1 },
          { name: "Daily Special", description: "Rotating special — check back for updates.", price: 12, tags: ["Special"], isFeatured: false, sortOrder: 2 },
        ],
      },
      {
        name: "Drinks",
        slug: "drinks",
        serviceWindow: "all-day",
        sortOrder: 2,
        items: [
          { name: "House Drink", description: "Cold, fresh, made in-house.", price: 4, tags: [], isFeatured: false, sortOrder: 1 },
          { name: "Water", description: "Bottled, chilled.", price: 2, tags: [], isFeatured: false, sortOrder: 2 },
        ],
      },
    ],
    specials: [
      { title: "Today's Special", description: "Our rotating daily special — check back for today's selection.", price: null, label: "Daily", isFeatured: true, sortOrder: 1 },
    ],
    features: {
      showBreakfastMenu: false,
      showLunchMenu: true,
      showDinnerMenu: false,
      showSpecials: true,
      showGallery: false,
      showTestimonials: false,
      showMap: true,
      showOnlineOrdering: false,
      showStickyMobileBar: true,
    },
    defaults: {
      heroEyebrow: "Find Us Today",
      heroHeadline: "Find us. Eat well.",
      heroSubheadline: "Street food done right. Check back daily for specials and location.",
      heroPrimaryCtaLabel: "See Today's Menu",
      aboutTitle: "Who We Are",
      aboutBody: [
        "We're a mobile food operation bringing fresh, handmade food to the streets.",
        "Follow us for daily specials and location updates.",
      ],
      galleryTitle: "Our Food",
      menuPreviewTitle: "Today's Menu",
      contactTitle: "Find Us",
    },
  },

  artist: {
    type: "artist",
    label: "Artist / Creator",
    description: "Portfolio, gallery, and commission or booking info.",
    tags: ["Gallery", "Portfolio", "Commissions"],
    categories: [],
    specials: [],
    features: {
      showBreakfastMenu: false,
      showLunchMenu: false,
      showDinnerMenu: false,
      showSpecials: false,
      showGallery: true,
      showTestimonials: false,
      showMap: false,
      showOnlineOrdering: false,
      showStickyMobileBar: false,
    },
    defaults: {
      heroEyebrow: "Portfolio",
      heroHeadline: "Art made with intention.",
      heroSubheadline: "Original work, commissions open. See the work.",
      heroPrimaryCtaLabel: "View Portfolio",
      aboutTitle: "About My Work",
      aboutBody: [
        "I create original work from my studio.",
        "Available for commissions, collaborations, and exhibitions. Reach out to start a conversation.",
      ],
      galleryTitle: "Portfolio",
      menuPreviewTitle: "Work",
      contactTitle: "Get in Touch",
    },
  },

  trade: {
    type: "trade",
    label: "Trade / Service",
    description: "Services, pricing, and booking for contractors and trade pros.",
    tags: ["Services", "Pricing", "Booking", "Hours"],
    categories: [],
    specials: [],
    features: {
      showBreakfastMenu: false,
      showLunchMenu: false,
      showDinnerMenu: false,
      showSpecials: false,
      showGallery: true,
      showTestimonials: false,
      showMap: true,
      showOnlineOrdering: false,
      showStickyMobileBar: true,
    },
    defaults: {
      heroEyebrow: "Licensed & Insured",
      heroHeadline: "Built right, every time.",
      heroSubheadline: "Quality work, honest pricing, and a team that shows up.",
      heroPrimaryCtaLabel: "Get a Quote",
      aboutTitle: "About Our Work",
      aboutBody: [
        "We are a licensed and insured trade business serving our local community.",
        "Every job done right, on time, and at a fair price. Call or message to get started.",
      ],
      galleryTitle: "Our Work",
      menuPreviewTitle: "Services",
      contactTitle: "Contact Us",
    },
  },
};
