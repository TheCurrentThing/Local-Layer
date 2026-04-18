import type { HelpCategoryMeta } from "@/types/help";

export const modules: HelpCategoryMeta = {
  slug: "modules",
  title: "Modules",
  description: "Learn how each section of your site works.",
  icon: "🧩",
  articles: [
    {
      id: "menu-module",
      title: "Menu",
      summary: "Add your food or service menu so customers know what you offer.",
      blocks: [
        {
          type: "paragraph",
          text: "The Menu module lets you build a full menu with categories and items. Each item can have a name, description, and price.",
        },
        {
          type: "steps",
          items: [
            "Open Menu from the left sidebar.",
            "Click 'Add category' to create a section (e.g. Starters, Mains, Drinks).",
            "Inside each category, click 'Add item' to add individual items.",
            "Fill in the name, description, and price for each item.",
            "Save your changes.",
          ],
        },
        {
          type: "tip",
          text: "Categories and items appear in the order you create them. You can delete categories or items using the trash icon.",
        },
      ],
    },
    {
      id: "specials-module",
      title: "Specials",
      summary: "Highlight deals, seasonal offers, or featured items.",
      blocks: [
        {
          type: "paragraph",
          text: "Specials appear as a highlighted section on your site, separate from your main menu. Use it for daily deals, seasonal items, or anything you want to draw attention to.",
        },
        {
          type: "tip",
          text: "Keep specials fresh — customers who visit repeatedly will look for new offers.",
        },
      ],
    },
    {
      id: "hours-module",
      title: "Hours",
      summary: "Keep your opening times accurate and up to date.",
      blocks: [
        {
          type: "paragraph",
          text: "Your hours appear on your site and can also sync to your Google Business Profile (on Core plan and above). Keep them accurate so customers don't show up when you're closed.",
        },
        {
          type: "tip",
          text: "Update your hours for public holidays — it only takes a minute and saves customer frustration.",
        },
      ],
    },
    {
      id: "photos-module",
      title: "Photos",
      summary: "Show off your space, food, or work with a photo gallery.",
      blocks: [
        {
          type: "paragraph",
          text: "Upload photos to build a gallery on your site. Great photos are one of the most effective ways to attract new customers.",
        },
        {
          type: "tip",
          text: "Phone photos are fine — just make sure they're well-lit and in focus. Natural light works best for food.",
        },
      ],
    },
    {
      id: "homepage-module",
      title: "Homepage",
      summary: "Customize the headline and description visitors see first.",
      blocks: [
        {
          type: "paragraph",
          text: "The Homepage module controls the headline text and tagline at the top of your site. This is the first thing visitors see, so make it count.",
        },
        {
          type: "tip",
          text: "Be specific. 'Hand-crafted wood-fired pizza in East Austin' is better than just 'Great pizza'.",
        },
      ],
    },
    {
      id: "contact-module",
      title: "Contact",
      summary: "Let customers find you, call you, and get directions.",
      blocks: [
        {
          type: "paragraph",
          text: "The Contact section displays your address, phone number, and a map. Keep this accurate — it's how customers find you.",
        },
      ],
    },
  ],
};
