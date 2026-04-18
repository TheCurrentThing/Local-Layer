import type { HelpCategoryMeta } from "@/types/help";

export const contact: HelpCategoryMeta = {
  slug: "contact",
  title: "Contact & Support",
  description: "Reach the LocalLayer team directly.",
  icon: "💬",
  articles: [
    {
      id: "get-in-touch",
      title: "How to reach us",
      summary: "We're a small team and we respond to every message.",
      blocks: [
        {
          type: "paragraph",
          text: "The best way to reach the LocalLayer team is by email. We're a small, focused team and we read every message — you'll hear from a real person, not a bot.",
        },
        {
          type: "link_list",
          links: [
            { label: "Email hello@locallayer.com", href: "mailto:hello@locallayer.com" },
          ],
        },
        {
          type: "tip",
          text: "We typically reply within one business day. For urgent issues, mention it in the subject line.",
        },
      ],
    },
    {
      id: "what-to-include",
      title: "What to include when you contact us",
      summary: "A little context helps us solve your problem faster.",
      blocks: [
        {
          type: "paragraph",
          text: "To help us resolve your issue quickly, it's useful to include:",
        },
        {
          type: "steps",
          items: [
            "Your business name and the email address you signed up with.",
            "A description of what you were trying to do.",
            "What happened instead (or what you expected to happen).",
            "A screenshot if something looks broken — it really helps.",
          ],
        },
      ],
    },
    {
      id: "feature-requests",
      title: "Suggest a feature or improvement",
      summary: "We love hearing what would make LocalLayer better for your business.",
      blocks: [
        {
          type: "paragraph",
          text: "If there's something you wish LocalLayer could do, tell us. Our roadmap is shaped by what real businesses need, and your feedback goes directly to the product team.",
        },
        {
          type: "link_list",
          links: [
            { label: "Send a feature request", href: "mailto:hello@locallayer.com?subject=Feature+request" },
          ],
        },
      ],
    },
  ],
};
