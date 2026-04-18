import type { HelpCategoryMeta } from "@/types/help";

export const troubleshooting: HelpCategoryMeta = {
  slug: "troubleshooting",
  title: "Troubleshooting",
  description: "Fix common problems quickly.",
  icon: "🔧",
  articles: [
    {
      id: "changes-not-showing",
      title: "My changes aren't showing on the live site",
      summary: "Changes should appear within a few seconds. Here's what to check.",
      blocks: [
        {
          type: "steps",
          items: [
            "Hard-refresh your site in the browser (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac).",
            "Make sure you clicked Save before leaving the admin page.",
            "Try opening your site in a private/incognito window to rule out browser cache.",
            "Wait 60 seconds and try again — changes are usually instant but can occasionally take a moment.",
          ],
        },
        {
          type: "tip",
          text: "If you're still seeing stale content after a minute, contact us at hello@locallayer.com.",
        },
      ],
    },
    {
      id: "cant-sign-in",
      title: "I can't sign in to my admin panel",
      summary: "Steps to recover access to your account.",
      blocks: [
        {
          type: "steps",
          items: [
            "Make sure you're using the correct email address — the one you signed up with.",
            "Check your Caps Lock key is off.",
            "Try the 'Forgot password' link on the login page.",
            "Check your spam or junk folder for the password reset email.",
            "If you don't receive the email within 5 minutes, contact hello@locallayer.com.",
          ],
        },
      ],
    },
    {
      id: "photos-not-uploading",
      title: "My photos won't upload",
      summary: "Common reasons photos fail to upload and how to fix them.",
      blocks: [
        {
          type: "steps",
          items: [
            "Check the file is a JPG, PNG, or WebP — other formats may not be supported.",
            "Make sure the file is under 10 MB in size.",
            "Try a different browser if the upload button isn't responding.",
            "Check your internet connection is stable.",
          ],
        },
        {
          type: "tip",
          text: "If you regularly need to upload large files, a photo compression app like Squoosh (free, web-based) can help.",
        },
      ],
    },
    {
      id: "site-looks-wrong",
      title: "My site doesn't look right on mobile",
      summary: "LocalLayer sites are designed to work on all screen sizes.",
      blocks: [
        {
          type: "paragraph",
          text: "All LocalLayer sites are fully responsive — they're designed to look great on phones, tablets, and desktops. If something looks off on your device, it could be a browser issue.",
        },
        {
          type: "steps",
          items: [
            "Try refreshing the page on your phone.",
            "Check the site in a different browser (e.g. Chrome vs Safari).",
            "Take a screenshot and send it to hello@locallayer.com — we'll take a look.",
          ],
        },
      ],
    },
    {
      id: "menu-not-appearing",
      title: "My menu isn't showing on the site",
      summary: "A menu with no items or categories won't appear on your site.",
      blocks: [
        {
          type: "paragraph",
          text: "Your menu section only appears on your site once it has at least one category with at least one item. Empty menus are hidden automatically.",
        },
        {
          type: "steps",
          items: [
            "Go to Menu in the sidebar.",
            "Make sure you have at least one category.",
            "Make sure that category has at least one item.",
            "Save your changes and refresh your live site.",
          ],
        },
      ],
    },
  ],
};
