// Onboarding kit definitions — seed content and defaults per category.
//
// IMPORTANT: This file is distinct from src/lib/kit-config.ts.
//   kit-config.ts  — module visibility, section order, resolver logic (runtime)
//   kits.ts        — default content seeded once at business creation (onboarding only)
//
// Adding a new category:
//   1. Add a CategoryPreset in kit-config.ts  (module + section defaults)
//   2. Add a KitDefinition here               (seed content + feature flags)
//   That's it. Nothing else needs to change.

import type { KitCategory } from "@/types/kit";

// ─── SEED CONTENT TYPES ───────────────────────────────────────────────────────

export interface KitMenuCategory {
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

// Seed offering for services-family businesses.
// Seeded into service_offerings table at onboarding.
export interface KitOffering {
  title: string;
  shortDescription: string;
  startingPrice: string | null; // free-text, e.g. "Starting at $150" or null
  isFeatured: boolean;
  sortOrder: number;
}

export interface KitDefinition {
  category: KitCategory;
  label: string;
  description: string;
  tags: string[];
  categories: KitMenuCategory[];  // Food service menu — empty for services/retail
  specials: KitSpecial[];         // Food service specials — empty for services/retail
  offerings: KitOffering[];       // Services catalog — empty for food service/retail
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

// ─── FOOD SERVICE KIT DEFINITIONS ────────────────────────────────────────────

export const KITS: Record<KitCategory, KitDefinition> = {

  // ── Restaurant ─────────────────────────────────────────────────────────────

  restaurant: {
    category: "restaurant",
    label: "Restaurant",
    description: "Full-service dining — menu, specials, gallery, and hours.",
    tags: ["Menu", "Specials", "Gallery", "Hours"],
    offerings: [],
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

  // ── Café ────────────────────────────────────────────────────────────────────

  cafe: {
    category: "cafe",
    label: "Café",
    description: "Coffee, pastries, and a menu worth returning for.",
    tags: ["Coffee", "Menu", "Hours", "Gallery"],
    offerings: [],
    categories: [
      {
        name: "Coffee & Drinks",
        slug: "coffee-drinks",
        serviceWindow: "all-day",
        sortOrder: 1,
        items: [
          { name: "Espresso", description: "Double shot, house blend.", price: 3.5, tags: ["House Staple"], isFeatured: true, sortOrder: 1 },
          { name: "Latte", description: "Espresso, steamed milk, light foam.", price: 5, tags: [], isFeatured: false, sortOrder: 2 },
          { name: "Pour Over", description: "Single origin, brewed to order.", price: 5.5, tags: ["Single Origin"], isFeatured: true, sortOrder: 3 },
          { name: "Cold Brew", description: "Steeped 18 hours, served over ice.", price: 5, tags: [], isFeatured: false, sortOrder: 4 },
        ],
      },
      {
        name: "Pastries & Bites",
        slug: "pastries-bites",
        serviceWindow: "all-day",
        sortOrder: 2,
        items: [
          { name: "Butter Croissant", description: "Baked fresh daily, flaky and golden.", price: 4, tags: ["Baked Daily"], isFeatured: true, sortOrder: 1 },
          { name: "Seasonal Muffin", description: "Rotating seasonal flavors, baked in-house.", price: 3.5, tags: [], isFeatured: false, sortOrder: 2 },
          { name: "Avocado Toast", description: "Sourdough, smashed avocado, chili flake, lemon.", price: 9, tags: [], isFeatured: false, sortOrder: 3 },
        ],
      },
    ],
    specials: [],
    features: {
      showBreakfastMenu: true,
      showLunchMenu: true,
      showDinnerMenu: false,
      showSpecials: false,
      showGallery: true,
      showTestimonials: false,
      showMap: true,
      showOnlineOrdering: false,
      showStickyMobileBar: false,
    },
    defaults: {
      heroEyebrow: "Open Daily",
      heroHeadline: "Good coffee. Good company.",
      heroSubheadline: "Freshly roasted, carefully made. Pastries baked every morning.",
      heroPrimaryCtaLabel: "See Our Menu",
      aboutTitle: "About the Café",
      aboutBody: [
        "We're a neighborhood café built around one idea: coffee worth slowing down for.",
        "Everything on the menu is made in-house or sourced from people we trust.",
      ],
      galleryTitle: "Come In",
      menuPreviewTitle: "On the Menu",
      contactTitle: "Find Us",
    },
  },

  // ── Diner ───────────────────────────────────────────────────────────────────

  diner: {
    category: "diner",
    label: "Diner",
    description: "Comfort food, all-day breakfast, and honest value.",
    tags: ["Menu", "Specials", "Hours", "All-Day Breakfast"],
    offerings: [],
    categories: [
      {
        name: "Breakfast",
        slug: "breakfast",
        serviceWindow: "breakfast",
        sortOrder: 1,
        items: [
          { name: "Two Eggs Any Style", description: "Two eggs, toast, house potatoes.", price: 8, tags: ["All Day"], isFeatured: true, sortOrder: 1 },
          { name: "Stack of Pancakes", description: "Three buttermilk pancakes, maple syrup, butter.", price: 9, tags: ["House Favorite"], isFeatured: false, sortOrder: 2 },
          { name: "Veggie Scramble", description: "Seasonal vegetables, three eggs, toast.", price: 10, tags: ["Vegetarian"], isFeatured: false, sortOrder: 3 },
        ],
      },
      {
        name: "Burgers & Sandwiches",
        slug: "burgers-sandwiches",
        serviceWindow: "all-day",
        sortOrder: 2,
        items: [
          { name: "Classic Cheeseburger", description: "Beef patty, American cheese, pickles, onion, house sauce, brioche bun.", price: 13, tags: ["Best Seller"], isFeatured: true, sortOrder: 1 },
          { name: "Club Sandwich", description: "Turkey, bacon, lettuce, tomato, mayo on toasted white.", price: 12, tags: [], isFeatured: false, sortOrder: 2 },
          { name: "Grilled Cheese", description: "Three-cheese blend on sourdough, served with cup of soup.", price: 10, tags: [], isFeatured: false, sortOrder: 3 },
        ],
      },
      {
        name: "Sides",
        slug: "sides",
        serviceWindow: "all-day",
        sortOrder: 3,
        items: [
          { name: "House Fries", description: "Crispy, seasoned, served hot.", price: 4, tags: [], isFeatured: false, sortOrder: 1 },
          { name: "Onion Rings", description: "Beer-battered, golden fried.", price: 5, tags: [], isFeatured: false, sortOrder: 2 },
        ],
      },
    ],
    specials: [
      { title: "Blue Plate Special", description: "Daily rotating plate — a full meal at a fair price. Ask the server what's on today.", price: null, label: "Today's Plate", isFeatured: true, sortOrder: 1 },
    ],
    features: {
      showBreakfastMenu: true,
      showLunchMenu: true,
      showDinnerMenu: true,
      showSpecials: true,
      showGallery: false,
      showTestimonials: false,
      showMap: true,
      showOnlineOrdering: false,
      showStickyMobileBar: true,
    },
    defaults: {
      heroEyebrow: "Open Early",
      heroHeadline: "Good food. No fuss.",
      heroSubheadline: "Comfort classics, all-day breakfast, and a seat that's always ready.",
      heroPrimaryCtaLabel: "See the Menu",
      aboutTitle: "About the Diner",
      aboutBody: [
        "We've been feeding this neighborhood for years — honest food, fair prices, and no pretense.",
        "Breakfast runs all day. The coffee's always hot.",
      ],
      galleryTitle: "Inside",
      menuPreviewTitle: "The Menu",
      contactTitle: "Come Find Us",
    },
  },

  // ── Pop-Up ──────────────────────────────────────────────────────────────────

  pop_up: {
    category: "pop_up",
    label: "Pop-Up",
    description: "Here today. A rotating menu, location-driven experience.",
    tags: ["Events", "Menu", "Location", "Announcements"],
    offerings: [],
    categories: [
      {
        name: "This Week's Menu",
        slug: "this-weeks-menu",
        serviceWindow: "all-day",
        sortOrder: 1,
        items: [
          { name: "Signature Plate", description: "Our rotating weekly signature — check back for updates.", price: 16, tags: ["This Week"], isFeatured: true, sortOrder: 1 },
          { name: "Small Plate", description: "A curated bite to go alongside the main.", price: 8, tags: [], isFeatured: false, sortOrder: 2 },
        ],
      },
      {
        name: "Drinks",
        slug: "drinks",
        serviceWindow: "all-day",
        sortOrder: 2,
        items: [
          { name: "House Beverage", description: "Non-alcoholic, house-made, seasonal.", price: 4, tags: [], isFeatured: false, sortOrder: 1 },
        ],
      },
    ],
    specials: [],
    features: {
      showBreakfastMenu: false,
      showLunchMenu: true,
      showDinnerMenu: false,
      showSpecials: false,
      showGallery: true,
      showTestimonials: false,
      showMap: true,
      showOnlineOrdering: false,
      showStickyMobileBar: false,
    },
    defaults: {
      heroEyebrow: "Find Us This Weekend",
      heroHeadline: "Here today. Worth it.",
      heroSubheadline: "A rotating menu, a new location, and a reason to show up. Follow along.",
      heroPrimaryCtaLabel: "See Where We Are",
      aboutTitle: "Who We Are",
      aboutBody: [
        "We're a pop-up food operation that shows up where the food's good and the people are hungry.",
        "Follow us for location updates and this week's menu.",
      ],
      galleryTitle: "What We Make",
      menuPreviewTitle: "This Week's Menu",
      contactTitle: "Find Us",
    },
  },

  // ── Food Truck ──────────────────────────────────────────────────────────────

  food_truck: {
    category: "food_truck",
    label: "Food Truck",
    description: "Mobile menu with rotating specials and location updates.",
    tags: ["Menu", "Specials", "Location", "Hours"],
    offerings: [],
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

  // ── Bar ─────────────────────────────────────────────────────────────────────

  bar: {
    category: "bar",
    label: "Bar",
    description: "Drinks, events, and the neighborhood's go-to spot.",
    tags: ["Specials", "Events", "Hours", "Gallery"],
    offerings: [],
    categories: [
      {
        name: "Cocktails",
        slug: "cocktails",
        serviceWindow: "all-day",
        sortOrder: 1,
        items: [
          { name: "House Old Fashioned", description: "Bourbon, house bitters, orange, sugar. On the rocks.", price: 13, tags: ["House Classic"], isFeatured: true, sortOrder: 1 },
          { name: "Seasonal Spritz", description: "Rotating seasonal aperitivo, prosecco, soda. Ask the bartender.", price: 11, tags: ["Seasonal"], isFeatured: false, sortOrder: 2 },
          { name: "Mezcal Negroni", description: "Mezcal, Campari, sweet vermouth, orange peel.", price: 14, tags: [], isFeatured: false, sortOrder: 3 },
        ],
      },
      {
        name: "Beer & Wine",
        slug: "beer-wine",
        serviceWindow: "all-day",
        sortOrder: 2,
        items: [
          { name: "Draft Beer", description: "Ask your bartender what's on tap.", price: 7, tags: [], isFeatured: false, sortOrder: 1 },
          { name: "House Red", description: "Glass pour. Ask for tonight's selection.", price: 9, tags: [], isFeatured: false, sortOrder: 2 },
          { name: "House White", description: "Glass pour. Ask for tonight's selection.", price: 9, tags: [], isFeatured: false, sortOrder: 3 },
        ],
      },
      {
        name: "Small Plates",
        slug: "small-plates",
        serviceWindow: "all-day",
        sortOrder: 3,
        items: [
          { name: "Bar Nuts", description: "Spiced, warm, house blend.", price: 5, tags: [], isFeatured: false, sortOrder: 1 },
          { name: "Charcuterie Board", description: "Rotating selection of cured meats, pickles, and accompaniments.", price: 18, tags: ["Shareable"], isFeatured: true, sortOrder: 2 },
        ],
      },
    ],
    specials: [
      { title: "Happy Hour", description: "Half-price well drinks and $2 off drafts. Check our hours for when it runs.", price: null, label: "Happy Hour", isFeatured: true, sortOrder: 1 },
    ],
    features: {
      showBreakfastMenu: false,
      showLunchMenu: false,
      showDinnerMenu: true,
      showSpecials: true,
      showGallery: true,
      showTestimonials: false,
      showMap: true,
      showOnlineOrdering: false,
      showStickyMobileBar: true,
    },
    defaults: {
      heroEyebrow: "Open Tonight",
      heroHeadline: "Cold drinks. Good times.",
      heroSubheadline: "Your neighborhood bar. Pull up a stool.",
      heroPrimaryCtaLabel: "See Our Menu",
      aboutTitle: "About the Bar",
      aboutBody: [
        "We're your neighborhood bar — nothing fancy, just good drinks, good music, and people you'll want to come back for.",
        "Happy hour runs daily. Events on the weekends. Door's open.",
      ],
      galleryTitle: "The Bar",
      menuPreviewTitle: "Drinks & Bites",
      contactTitle: "Find Us",
    },
  },

  // ─── SERVICES KIT DEFINITIONS ─────────────────────────────────────────────────
  //
  // Five conversion-based categories. Industry labels are seed copy only —
  // they don't fork the module system or create separate code paths.
  //
  // These categories answer: how does this business convert a new customer?
  //   on_demand   → call or request right now
  //   project     → scoped work, quote first
  //   scheduled   → book an appointment
  //   professional → consult, advise, engage
  //   mobile      → we come to you

  // ── On-Demand Service ────────────────────────────────────────────────────────

  on_demand: {
    category: "on_demand",
    label: "On-Demand Service",
    description: "Fast local response — call now, request service, get it done today.",
    tags: ["Service Areas", "Offerings", "Testimonials", "Quote Request"],
    categories: [],
    specials: [],
    offerings: [
      {
        title: "Emergency Call-Out",
        shortDescription: "Same-day and after-hours response. We show up when you need us.",
        startingPrice: "Starting at $95",
        isFeatured: true,
        sortOrder: 1,
      },
      {
        title: "Diagnostics & Assessment",
        shortDescription: "Full inspection to identify the issue before any work begins.",
        startingPrice: "Starting at $75",
        isFeatured: false,
        sortOrder: 2,
      },
      {
        title: "Scheduled Maintenance",
        shortDescription: "Routine service visit to keep everything running right.",
        startingPrice: "From $120",
        isFeatured: false,
        sortOrder: 3,
      },
    ],
    features: {
      showBreakfastMenu: false,
      showLunchMenu: false,
      showDinnerMenu: false,
      showSpecials: false,
      showGallery: false,
      showTestimonials: true,
      showMap: true,
      showOnlineOrdering: false,
      showStickyMobileBar: true,
    },
    defaults: {
      heroEyebrow: "Licensed & Insured",
      heroHeadline: "Fast, reliable service when you need it.",
      heroSubheadline: "Local experts available now. Call or request service online.",
      heroPrimaryCtaLabel: "Request Service",
      aboutTitle: "About Us",
      aboutBody: [
        "We're a licensed and insured local service team built around one promise: show up fast and do it right.",
        "Available for same-day appointments and after-hours emergencies. Serving our community.",
      ],
      galleryTitle: "Our Work",
      menuPreviewTitle: "Services",
      contactTitle: "Get in Touch",
    },
  },

  // ── Project-Based Service ────────────────────────────────────────────────────

  project: {
    category: "project",
    label: "Project-Based Service",
    description: "Scoped work from quote to completion — contractors, builders, remodelers.",
    tags: ["Quote Request", "Gallery", "Testimonials", "Offerings"],
    categories: [],
    specials: [],
    offerings: [
      {
        title: "Free Consultation & Quote",
        shortDescription: "We come out, assess the scope, and give you a clear written estimate.",
        startingPrice: null,
        isFeatured: true,
        sortOrder: 1,
      },
      {
        title: "Full Project Management",
        shortDescription: "End-to-end management from planning through final walkthrough.",
        startingPrice: "Custom pricing",
        isFeatured: false,
        sortOrder: 2,
      },
      {
        title: "Small Jobs & Repairs",
        shortDescription: "Quick, targeted fixes — no project too small.",
        startingPrice: "Starting at $200",
        isFeatured: false,
        sortOrder: 3,
      },
    ],
    features: {
      showBreakfastMenu: false,
      showLunchMenu: false,
      showDinnerMenu: false,
      showSpecials: false,
      showGallery: true,
      showTestimonials: true,
      showMap: false,
      showOnlineOrdering: false,
      showStickyMobileBar: true,
    },
    defaults: {
      heroEyebrow: "Licensed & Insured",
      heroHeadline: "Built right, from start to finish.",
      heroSubheadline: "Quality work, honest timelines, and a crew you can count on.",
      heroPrimaryCtaLabel: "Request a Quote",
      aboutTitle: "About Our Work",
      aboutBody: [
        "We're a licensed contractor serving our local community with straightforward work and honest pricing.",
        "Every project managed end-to-end. Call or message to get started with a free consultation.",
      ],
      galleryTitle: "Our Work",
      menuPreviewTitle: "Services",
      contactTitle: "Get a Quote",
    },
  },

  // ── Scheduled Appointment ────────────────────────────────────────────────────

  scheduled: {
    category: "scheduled",
    label: "Scheduled Appointment",
    description: "Book your next appointment — salon, barber, massage, trainer, and more.",
    tags: ["Booking", "Offerings", "Hours", "Testimonials"],
    categories: [],
    specials: [],
    offerings: [
      {
        title: "Standard Session",
        shortDescription: "Our signature service. Ask about what's included.",
        startingPrice: "Starting at $60",
        isFeatured: true,
        sortOrder: 1,
      },
      {
        title: "Premium Experience",
        shortDescription: "Elevated service with extra time and attention to detail.",
        startingPrice: "Starting at $95",
        isFeatured: false,
        sortOrder: 2,
      },
      {
        title: "First-Time Visit",
        shortDescription: "New client? This is the right way to start.",
        startingPrice: "From $45",
        isFeatured: false,
        sortOrder: 3,
      },
    ],
    features: {
      showBreakfastMenu: false,
      showLunchMenu: false,
      showDinnerMenu: false,
      showSpecials: false,
      showGallery: true,
      showTestimonials: true,
      showMap: true,
      showOnlineOrdering: false,
      showStickyMobileBar: true,
    },
    defaults: {
      heroEyebrow: "Now Booking",
      heroHeadline: "Book your next appointment.",
      heroSubheadline: "Professional service on your schedule. Easy booking, no surprises.",
      heroPrimaryCtaLabel: "Book Now",
      aboutTitle: "About Us",
      aboutBody: [
        "We're a professional service built around one thing: making every appointment feel worth it.",
        "Easy booking, consistent results, and people you'll want to come back to.",
      ],
      galleryTitle: "Our Space",
      menuPreviewTitle: "Services",
      contactTitle: "Book or Contact Us",
    },
  },

  // ── Professional Service ─────────────────────────────────────────────────────

  professional: {
    category: "professional",
    label: "Professional Service",
    description: "Expert guidance and advisory — consultants, agencies, coaches, accountants.",
    tags: ["Testimonials", "Offerings", "Contact", "Announcements"],
    categories: [],
    specials: [],
    offerings: [
      {
        title: "Initial Consultation",
        shortDescription: "One hour to understand your situation and where we can help.",
        startingPrice: "From $150",
        isFeatured: true,
        sortOrder: 1,
      },
      {
        title: "Ongoing Engagement",
        shortDescription: "Regular collaboration with dedicated support and deliverables.",
        startingPrice: "Custom pricing",
        isFeatured: false,
        sortOrder: 2,
      },
      {
        title: "Project-Based Work",
        shortDescription: "Clear scope, clear timeline, clear outcome.",
        startingPrice: "Contact for pricing",
        isFeatured: false,
        sortOrder: 3,
      },
    ],
    features: {
      showBreakfastMenu: false,
      showLunchMenu: false,
      showDinnerMenu: false,
      showSpecials: false,
      showGallery: false,
      showTestimonials: true,
      showMap: false,
      showOnlineOrdering: false,
      showStickyMobileBar: false,
    },
    defaults: {
      heroEyebrow: "Available for Engagements",
      heroHeadline: "Expert guidance when it matters.",
      heroSubheadline: "Strategy, planning, and execution — built around your goals.",
      heroPrimaryCtaLabel: "Get in Touch",
      aboutTitle: "About Our Work",
      aboutBody: [
        "We're an independent professional service firm working with clients who need real expertise, not generic advice.",
        "Straightforward engagements, clear deliverables, and a genuine focus on your outcomes.",
      ],
      galleryTitle: "Our Work",
      menuPreviewTitle: "Services",
      contactTitle: "Start a Conversation",
    },
  },

  // ── Mobile Service ───────────────────────────────────────────────────────────

  mobile: {
    category: "mobile",
    label: "Mobile Service",
    description: "We come to you — mobile detailing, grooming, repair, and more.",
    tags: ["Service Areas", "Booking", "Offerings", "Announcements"],
    categories: [],
    specials: [],
    offerings: [
      {
        title: "Mobile Visit",
        shortDescription: "We bring everything to your location — home, office, wherever works.",
        startingPrice: "Starting at $80",
        isFeatured: true,
        sortOrder: 1,
      },
      {
        title: "Premium Package",
        shortDescription: "Full-service treatment with everything included.",
        startingPrice: "Starting at $140",
        isFeatured: false,
        sortOrder: 2,
      },
      {
        title: "Fleet or Group Rate",
        shortDescription: "Serving multiple units at the same location.",
        startingPrice: "Contact for pricing",
        isFeatured: false,
        sortOrder: 3,
      },
    ],
    features: {
      showBreakfastMenu: false,
      showLunchMenu: false,
      showDinnerMenu: false,
      showSpecials: false,
      showGallery: false,
      showTestimonials: true,
      showMap: false,
      showOnlineOrdering: false,
      showStickyMobileBar: true,
    },
    defaults: {
      heroEyebrow: "We Come to You",
      heroHeadline: "Professional service at your location.",
      heroSubheadline: "Mobile service delivered to your home, office, or wherever you need it.",
      heroPrimaryCtaLabel: "Check Availability",
      aboutTitle: "About Our Service",
      aboutBody: [
        "We're a fully mobile service bringing professional-grade work directly to your location.",
        "No appointments to drive to. We handle everything on-site.",
      ],
      galleryTitle: "Our Work",
      menuPreviewTitle: "Services",
      contactTitle: "Book or Inquire",
    },
  },

  // ─── RETAIL & PRODUCTS KIT DEFINITIONS ───────────────────────────────────────

  artist: {
    category: "artist",
    label: "Artist / Creator",
    description: "Portfolio, gallery, and commission or booking info.",
    tags: ["Gallery", "Portfolio", "Commissions"],
    categories: [],
    specials: [],
    offerings: [],
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

  maker: {
    category: "maker",
    label: "Maker / Craft",
    description: "Handmade goods — products, gallery, and the story behind the work.",
    tags: ["Products", "Handmade", "Gallery"],
    categories: [],
    specials: [],
    offerings: [],
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
      heroEyebrow: "Handmade",
      heroHeadline: "Made by hand. Built to last.",
      heroSubheadline: "Every piece is crafted with care. Browse the collection.",
      heroPrimaryCtaLabel: "Shop Now",
      aboutTitle: "About My Craft",
      aboutBody: [
        "I'm an independent maker creating handmade goods from my studio.",
        "Each piece is made to order or in small batches. Quality over quantity — always.",
      ],
      galleryTitle: "The Work",
      menuPreviewTitle: "Shop",
      contactTitle: "Get in Touch",
    },
  },

  retail: {
    category: "retail",
    label: "Retail Shop",
    description: "Physical or online shop with products, collections, and hours.",
    tags: ["Products", "Collections", "Hours", "Gallery"],
    categories: [],
    specials: [],
    offerings: [],
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
      heroEyebrow: "Now Open",
      heroHeadline: "Shop local. Shop well.",
      heroSubheadline: "Curated products, thoughtfully chosen. Stop in or browse online.",
      heroPrimaryCtaLabel: "Browse Products",
      aboutTitle: "About the Shop",
      aboutBody: [
        "We're an independent retail shop bringing thoughtfully curated products to our community.",
        "Every item on the shelf is here for a reason. Come see why.",
      ],
      galleryTitle: "In the Shop",
      menuPreviewTitle: "Featured Products",
      contactTitle: "Visit Us",
    },
  },

  brand: {
    category: "brand",
    label: "Brand / Lifestyle",
    description: "Brand identity and product lines for lifestyle and DTC businesses.",
    tags: ["Products", "Collections", "Brand", "Gallery"],
    categories: [],
    specials: [],
    offerings: [],
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
      heroEyebrow: "New Collection",
      heroHeadline: "A brand with a point of view.",
      heroSubheadline: "Designed with intention. Built for the life you actually live.",
      heroPrimaryCtaLabel: "Shop the Collection",
      aboutTitle: "About the Brand",
      aboutBody: [
        "We're an independent brand built around a clear point of view.",
        "Every product we make reflects something we believe in. Browse the collection.",
      ],
      galleryTitle: "The Look",
      menuPreviewTitle: "Shop",
      contactTitle: "Contact",
    },
  },

  vintage: {
    category: "vintage",
    label: "Vintage / Thrift",
    description: "Curated vintage and secondhand with rotating inventory.",
    tags: ["Vintage", "Curated", "Hours", "Gallery"],
    categories: [],
    specials: [],
    offerings: [],
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
      heroEyebrow: "New Arrivals Weekly",
      heroHeadline: "Old things, new homes.",
      heroSubheadline: "Carefully sourced vintage and secondhand. Inventory rotates constantly.",
      heroPrimaryCtaLabel: "See What's In",
      aboutTitle: "About the Shop",
      aboutBody: [
        "We're a curated vintage and thrift shop with a sharp eye for the good stuff.",
        "Inventory rotates weekly. Come back often — something new is always waiting.",
      ],
      galleryTitle: "Recent Finds",
      menuPreviewTitle: "Current Inventory",
      contactTitle: "Find Us",
    },
  },

  collector: {
    category: "collector",
    label: "Collector / Rare",
    description: "Rare, limited, and curated items organized into collections.",
    tags: ["Rare", "Curated", "Collections", "Gallery"],
    categories: [],
    specials: [],
    offerings: [],
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
      heroEyebrow: "Curated Collection",
      heroHeadline: "Rare things, carefully chosen.",
      heroSubheadline: "A curated archive of rare and limited pieces. Inquire to acquire.",
      heroPrimaryCtaLabel: "Browse the Archive",
      aboutTitle: "About the Collection",
      aboutBody: [
        "We source, curate, and sell rare and collectible items for serious enthusiasts.",
        "Every piece in the archive has been vetted for authenticity and condition. Reach out to inquire.",
      ],
      galleryTitle: "The Archive",
      menuPreviewTitle: "Available Now",
      contactTitle: "Inquire",
    },
  },
};
