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
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        // ── Admin design-system tokens ───────────────────────────────
        admin: {
          bg:           "var(--admin-bg)",
          chrome:       "var(--admin-chrome)",
          "chrome-border": "var(--admin-chrome-border)",
          text: {
            DEFAULT: "var(--admin-text)",
            muted:   "var(--admin-text-muted)",
            dim:     "var(--admin-text-dim)",
          },
          panel: {
            bg:     "var(--admin-panel-bg)",
            border: "var(--admin-panel-border)",
          },
          "row-border": "var(--admin-row-border)",
          "hover-bg":   "var(--admin-hover-bg)",
          input: {
            bg:          "var(--admin-input-bg)",
            border:      "var(--admin-input-border)",
            text:        "var(--admin-input-text)",
            placeholder: "var(--admin-input-placeholder)",
          },
          ghost: {
            bg:          "var(--admin-ghost-bg)",
            border:      "var(--admin-ghost-border)",
            text:        "var(--admin-ghost-text)",
            "hover-bg":  "var(--admin-ghost-hover-bg)",
            "hover-border": "var(--admin-ghost-hover-border)",
            "hover-text": "var(--admin-ghost-hover-text)",
          },
          label:        "var(--admin-label-upper)",
          "label-dim":  "var(--admin-label-upper-dim)",
          scrollbar:    "var(--admin-scrollbar)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel: "0 22px 60px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
