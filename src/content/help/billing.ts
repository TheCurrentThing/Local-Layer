import type { HelpCategoryMeta } from "@/types/help";

export const billing: HelpCategoryMeta = {
  slug: "billing",
  title: "Billing",
  description: "Understand plans, pricing, and your subscription.",
  icon: "💳",
  articles: [
    {
      id: "plans-overview",
      title: "What's the difference between plans?",
      summary: "LocalLayer has five tiers designed for different stages of your business.",
      blocks: [
        {
          type: "steps",
          items: [
            "Free Trial — 90 days free. Full access to evaluate the platform, including premium features.",
            "Starter ($5/mo) — Keep your business live. Site stays online, content preserved. No premium features.",
            "Core ($19/mo) — The full operating tier. Custom domain and Google Business sync included.",
            "Pro ($79/mo) — Everything in Core, plus Signature renderer, domain purchase, and extended storage.",
            "Enterprise — Custom pricing for multi-location or high-volume businesses.",
          ],
        },
        {
          type: "tip",
          text: "Starter is designed as a fallback — if Core or Pro is ever too much, Starter keeps your site live for less than a coffee a week.",
        },
        {
          type: "link_list",
          links: [
            { label: "View your current plan", href: "/admin/billing" },
          ],
        },
      ],
    },
    {
      id: "trial-plan",
      title: "How does the free trial work?",
      summary: "Your trial gives you 90 days of broad platform access to evaluate LocalLayer.",
      blocks: [
        {
          type: "paragraph",
          text: "When you start on LocalLayer, you get a 90-day free trial. During this period you have access to most of the platform — including custom domain, Google sync, and the Signature renderer — so you can properly evaluate what LocalLayer can do for your business.",
        },
        {
          type: "paragraph",
          text: "When your trial ends, you choose a plan. Starter keeps your site live for $5/month. Core and Pro unlock the premium features you tried during the trial.",
        },
        {
          type: "tip",
          text: "Your trial end date is shown on your billing page. We'll surface a reminder as it approaches.",
        },
      ],
    },
    {
      id: "starter-plan",
      title: "What is the Starter plan?",
      summary: "Starter is a retention plan — it keeps your business live when Core or Pro isn't the right fit.",
      blocks: [
        {
          type: "paragraph",
          text: "The Starter plan ($5/month) is designed for one purpose: keeping your business online. Your site stays live at your LocalLayer subdomain, all your content is preserved, and you can upgrade to Core or Pro anytime.",
        },
        {
          type: "paragraph",
          text: "Starter does not include custom domains, Google sync, or premium rendering. It's not a growth tier — it's a fallback that makes sure you're never forced off the platform entirely.",
        },
        {
          type: "tip",
          text: "If you're on Starter and things pick up again, upgrading to Core takes one email.",
        },
      ],
    },
    {
      id: "upgrade-plan",
      title: "How do I upgrade my plan?",
      summary: "Upgrading is currently handled through our team.",
      blocks: [
        {
          type: "paragraph",
          text: "Online self-serve billing is coming soon. In the meantime, email hello@locallayer.com with the plan you'd like to move to. We'll get you set up the same day.",
        },
        {
          type: "link_list",
          links: [
            { label: "Email us to upgrade", href: "mailto:hello@locallayer.com?subject=Upgrade%20my%20LocalLayer%20plan" },
          ],
        },
      ],
    },
    {
      id: "downgrade-or-cancel",
      title: "How do I downgrade or cancel?",
      summary: "You can step down to Starter or cancel entirely — your content is always preserved.",
      blocks: [
        {
          type: "paragraph",
          text: "Go to Plan Management in your billing page and click \"Manage subscription\". You'll see two options: switch to Starter (site stays live) or cancel completely (site goes offline, content preserved).",
        },
        {
          type: "paragraph",
          text: "Both options currently require a short email to our team — we process changes within one business day.",
        },
        {
          type: "warning",
          text: "Canceling completely takes your site offline. Switching to Starter keeps your site live at your LocalLayer subdomain.",
        },
        {
          type: "link_list",
          links: [
            { label: "Go to billing", href: "/admin/billing" },
          ],
        },
      ],
    },
    {
      id: "what-happens-past-due",
      title: "What happens if my payment fails?",
      summary: "Your site stays live during payment issues — premium features are paused.",
      blocks: [
        {
          type: "paragraph",
          text: "If a payment fails, your account moves to a past-due state. Your site remains publicly accessible, but premium features (custom domain, Google sync, signature renderer) are paused until payment is resolved.",
        },
        {
          type: "paragraph",
          text: "Contact hello@locallayer.com to resolve payment issues.",
        },
      ],
    },
  ],
};
