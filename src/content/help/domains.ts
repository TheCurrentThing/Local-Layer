import type { HelpCategoryMeta } from "@/types/help";

export const domains: HelpCategoryMeta = {
  slug: "domains",
  title: "Domains",
  description: "Understand and manage where your site lives.",
  icon: "🌐",
  articles: [
    {
      id: "your-locallayer-subdomain",
      title: "Your LocalLayer subdomain",
      summary: "Every account includes a free subdomain at yourname.locallayer.com.",
      blocks: [
        {
          type: "paragraph",
          text: "Your site is immediately available at yourname.locallayer.com — this is included on every plan with no setup required. You can share this URL straight away.",
        },
        {
          type: "tip",
          text: "Find your exact subdomain URL on the Domains page or the Account page in your admin panel.",
        },
      ],
    },
    {
      id: "custom-domain",
      title: "Using a domain you already own",
      summary: "Connect a domain like yourbusiness.com to your LocalLayer site.",
      blocks: [
        {
          type: "paragraph",
          text: "If you own a domain (e.g. yourbusiness.com), you can point it to your LocalLayer site. This is available on Core plan and above.",
        },
        {
          type: "paragraph",
          text: "Custom domain connection is being set up for self-serve. In the meantime, email hello@locallayer.com with your domain name and we'll configure it manually — usually within one business day.",
        },
        {
          type: "link_list",
          links: [
            { label: "View domain settings", href: "/admin/domains" },
            { label: "Upgrade your plan", href: "/admin/billing" },
          ],
        },
      ],
    },
    {
      id: "buy-a-domain",
      title: "Buying a new domain through LocalLayer",
      summary: "Purchase and manage a domain without leaving the platform.",
      blocks: [
        {
          type: "paragraph",
          text: "On Pro plan and above, you'll be able to purchase a domain directly through LocalLayer. This feature is coming soon.",
        },
        {
          type: "paragraph",
          text: "In the meantime, you can purchase a domain from any registrar (Namecheap, Google Domains, GoDaddy, etc.) and then point it to your LocalLayer site.",
        },
        {
          type: "link_list",
          links: [
            { label: "Email us to get started", href: "mailto:hello@locallayer.com" },
            { label: "View plan options", href: "/admin/billing" },
          ],
        },
      ],
    },
    {
      id: "what-is-dns",
      title: "What is DNS and why does it take time?",
      summary: "DNS changes can take up to 48 hours to take effect worldwide.",
      blocks: [
        {
          type: "paragraph",
          text: "DNS (Domain Name System) is the system that translates domain names like yourbusiness.com into the actual server address where your site lives. When you change DNS settings, it takes time for that change to spread to all servers around the world.",
        },
        {
          type: "paragraph",
          text: "This is called DNS propagation and can take anywhere from a few minutes to 48 hours. During this time, some visitors may see your old site or a temporary page — this is normal.",
        },
        {
          type: "tip",
          text: "Your LocalLayer subdomain always works instantly, even during DNS propagation.",
        },
      ],
    },
  ],
};
