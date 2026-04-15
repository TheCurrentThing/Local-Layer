import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: "var(--color-card)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        primary: "var(--brand-primary)",
        secondary: "var(--brand-secondary)",
        accent: "var(--brand-accent)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        panel: "0 22px 60px rgba(94, 48, 26, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
