import type { HelpCategoryMeta } from "@/types/help";

export const growth: HelpCategoryMeta = {
  slug: "growth",
  title: "Growth",
  description: "Attract more customers with your LocalLayer site.",
  icon: "📈",
  articles: [
    {
      id: "share-your-site",
      title: "Share your site with customers",
      summary: "Get your LocalLayer URL in front of as many people as possible.",
      blocks: [
        {
          type: "paragraph",
          text: "Your site URL is the single most valuable thing to share. Every customer who visits is a potential repeat customer.",
        },
        {
          type: "steps",
          items: [
            "Add your LocalLayer URL to your Instagram and Facebook bios.",
            "Put it on business cards, flyers, and receipts.",
            "Add it to your Google Business Profile website field.",
            "Include it in email newsletters if you send them.",
            "Put a QR code linking to your site on your counter or tables.",
          ],
        },
      ],
    },
    {
      id: "google-business-profile",
      title: "Connect to Google Business Profile",
      summary: "Sync your hours and details to appear correctly in Google Search.",
      blocks: [
        {
          type: "paragraph",
          text: "Google Business Profile (formerly Google My Business) is free and gets your business appearing in Google Maps and local search results. It's one of the highest-impact things you can do for local discovery.",
        },
        {
          type: "steps",
          items: [
            "Claim your business at business.google.com if you haven't already.",
            "Fill in your address, hours, phone number, and website (use your LocalLayer URL).",
            "Add photos — businesses with photos get significantly more engagement.",
            "Ask satisfied customers to leave a Google review.",
          ],
        },
        {
          type: "tip",
          text: "On Core plan and above, LocalLayer can sync your hours directly to your Google Business Profile so you only have to update them in one place.",
        },
      ],
    },
    {
      id: "keep-content-fresh",
      title: "Keep your content up to date",
      summary: "Regular updates signal to Google and customers that you're active.",
      blocks: [
        {
          type: "paragraph",
          text: "Search engines and customers alike favour businesses with fresh, accurate information. A few minutes each week can make a meaningful difference.",
        },
        {
          type: "steps",
          items: [
            "Update your specials section whenever your offers change.",
            "Add new photos regularly — especially of popular or seasonal items.",
            "Keep your hours accurate, especially around holidays.",
            "Review your menu at least once a season.",
          ],
        },
      ],
    },
    {
      id: "photos-for-engagement",
      title: "Use photos to drive interest",
      summary: "Businesses with good photos get more clicks and visits.",
      blocks: [
        {
          type: "paragraph",
          text: "Studies consistently show that businesses with photos in their online listings get significantly more engagement than those without. You don't need a professional photographer — a well-lit phone photo is enough.",
        },
        {
          type: "tip",
          text: "Shoot food, drinks, or products near a window in natural daylight. Avoid flash — it flattens everything.",
        },
      ],
    },
  ],
};
