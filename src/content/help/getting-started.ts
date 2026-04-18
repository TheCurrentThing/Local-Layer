import type { HelpCategoryMeta } from "@/types/help";

export const gettingStarted: HelpCategoryMeta = {
  slug: "getting-started",
  title: "Getting Started",
  description: "Set up your LocalLayer site from scratch.",
  icon: "🚀",
  articles: [
    {
      id: "what-is-locallayer",
      title: "What is LocalLayer?",
      summary: "LocalLayer gives local businesses a professional website without the hassle.",
      blocks: [
        {
          type: "paragraph",
          text: "LocalLayer is a website platform built specifically for local businesses — restaurants, food trucks, artists, and tradespeople. You get a clean, fast site that works on any device, with your menu, hours, photos, and contact info all in one place.",
        },
        {
          type: "paragraph",
          text: "Your site is live immediately at a LocalLayer subdomain (yourname.locallayer.com). On higher plans you can connect your own domain.",
        },
        {
          type: "tip",
          text: "You don't need any technical skills to use LocalLayer. Everything is managed from this admin panel.",
        },
      ],
    },
    {
      id: "fill-out-branding",
      title: "Step 1 — Add your business name and brand",
      summary: "Your business name and colors appear across your entire site.",
      blocks: [
        {
          type: "paragraph",
          text: "Go to Branding in the sidebar. Add your business name, choose your primary color, and upload a logo if you have one. These settings flow through your entire site automatically.",
        },
        {
          type: "steps",
          items: [
            "Open Branding from the left sidebar.",
            "Enter your business name exactly as you want it to appear publicly.",
            "Pick a primary color that matches your brand.",
            "Upload a logo (optional but recommended).",
            "Save your changes.",
          ],
        },
        {
          type: "tip",
          text: "Use the 'View site' link in the header to see how your changes look on your live site.",
        },
      ],
    },
    {
      id: "fill-out-contact",
      title: "Step 2 — Add your contact details",
      summary: "Customers need to know where you are and how to reach you.",
      blocks: [
        {
          type: "paragraph",
          text: "Go to Contact in the sidebar. Add your address, phone number, and website. This also powers the Google Maps embed on your site.",
        },
        {
          type: "steps",
          items: [
            "Open Contact from the left sidebar.",
            "Enter your full street address.",
            "Add your phone number.",
            "Save your changes.",
          ],
        },
      ],
    },
    {
      id: "set-your-hours",
      title: "Step 3 — Set your hours",
      summary: "Let customers know when you're open.",
      blocks: [
        {
          type: "paragraph",
          text: "Go to Hours in the sidebar and set your opening and closing times for each day. You can mark days as closed if you're not open.",
        },
        {
          type: "tip",
          text: "If your hours change seasonally or for holidays, you can update them any time — changes go live immediately.",
        },
      ],
    },
    {
      id: "launch-checklist",
      title: "Step 4 — Review and launch",
      summary: "Check everything looks right before you share your site.",
      blocks: [
        {
          type: "paragraph",
          text: "Go to Launch in the sidebar. This page shows a checklist of the most important things to have set up before sharing your site with customers.",
        },
        {
          type: "steps",
          items: [
            "Open Launch from the left sidebar.",
            "Work through any incomplete items in the checklist.",
            "Click 'View site' to preview everything live.",
            "Share your LocalLayer URL with customers.",
          ],
        },
        {
          type: "tip",
          text: "Your site is already live — the Launch checklist just helps you make sure it's complete.",
        },
      ],
    },
  ],
};
