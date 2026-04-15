export type ThemeTokens = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  mutedText: string;
  primary: string;
  primaryText: string;
  accent: string;
  accentText: string;
  border: string;
  highlight: string;
  announcementBg: string;
  announcementText: string;
  buttonSecondaryBg: string;
  buttonSecondaryText: string;
};

export type FontPack = {
  heading: string;
  body: string;
  headingFallback: string;
  bodyFallback: string;
  label: string;
};

export type ThemePreset = {
  id: string;
  name: string;
  shortDescription: string;
  recommendedFor: string[];
  fonts: FontPack;
  colors: ThemeTokens;
};

export const FONT_PACKS: Record<string, FontPack> = {
  classicSerif: {
    heading: "Playfair Display",
    body: "Inter",
    headingFallback: "serif",
    bodyFallback: "sans-serif",
    label: "Classic Serif + Clean Sans",
  },
  editorialWarm: {
    heading: "Cormorant Garamond",
    body: "Inter",
    headingFallback: "serif",
    bodyFallback: "sans-serif",
    label: "Editorial Warm",
  },
  modernCafe: {
    heading: "DM Serif Display",
    body: "Inter",
    headingFallback: "serif",
    bodyFallback: "sans-serif",
    label: "Modern Cafe",
  },
  coastalRefined: {
    heading: "Libre Baskerville",
    body: "Inter",
    headingFallback: "serif",
    bodyFallback: "sans-serif",
    label: "Coastal Refined",
  },
  softBakery: {
    heading: "DM Serif Display",
    body: "Source Sans 3",
    headingFallback: "serif",
    bodyFallback: "sans-serif",
    label: "Soft Bakery",
  },
  tavernClassic: {
    heading: "Playfair Display",
    body: "Source Sans 3",
    headingFallback: "serif",
    bodyFallback: "sans-serif",
    label: "Tavern Classic",
  },
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "classic-diner",
    name: "Classic Diner",
    shortDescription:
      "Warm cream, burgundy, and gold with a hometown diner feel.",
    recommendedFor: ["diners", "breakfast spots", "family restaurants"],
    fonts: FONT_PACKS.classicSerif,
    colors: {
      background: "#F6EFE6",
      surface: "#FFF8F0",
      surfaceAlt: "#F3E7D3",
      text: "#2F241F",
      mutedText: "#6E5A4D",
      primary: "#B5543D",
      primaryText: "#FFFFFF",
      accent: "#E3C27A",
      accentText: "#3E2C1F",
      border: "#DCCFC2",
      highlight: "#F1E3B8",
      announcementBg: "#F3E7D3",
      announcementText: "#A14A33",
      buttonSecondaryBg: "#FFF4EA",
      buttonSecondaryText: "#A14A33",
    },
  },
  {
    id: "coffeehouse",
    name: "Coffeehouse",
    shortDescription: "Moody espresso tones with cozy premium contrast.",
    recommendedFor: ["coffee shops", "kava bars", "modern cafes"],
    fonts: FONT_PACKS.editorialWarm,
    colors: {
      background: "#1F1A17",
      surface: "#2A2421",
      surfaceAlt: "#342D29",
      text: "#F4EDE4",
      mutedText: "#C7B8A7",
      primary: "#C07A4A",
      primaryText: "#FFFFFF",
      accent: "#E8D3B3",
      accentText: "#2A1F19",
      border: "#493D35",
      highlight: "#3A302A",
      announcementBg: "#2A2421",
      announcementText: "#E8D3B3",
      buttonSecondaryBg: "#3A302A",
      buttonSecondaryText: "#F4EDE4",
    },
  },
  {
    id: "fresh-cafe",
    name: "Fresh Cafe",
    shortDescription:
      "Light, clean, organic tones with a healthy modern feel.",
    recommendedFor: ["health cafes", "juice bars", "smoothie shops"],
    fonts: FONT_PACKS.modernCafe,
    colors: {
      background: "#F7F9F6",
      surface: "#FFFFFF",
      surfaceAlt: "#EEF4EE",
      text: "#2E3A32",
      mutedText: "#67786C",
      primary: "#6FA67A",
      primaryText: "#FFFFFF",
      accent: "#DCEFE0",
      accentText: "#304436",
      border: "#D4E3D7",
      highlight: "#EAF5EC",
      announcementBg: "#EAF5EC",
      announcementText: "#36553D",
      buttonSecondaryBg: "#EFF7F0",
      buttonSecondaryText: "#36553D",
    },
  },
  {
    id: "coastal-seafood",
    name: "Coastal Seafood",
    shortDescription:
      "Cool blue, sand, and clean neutrals for a coastal table vibe.",
    recommendedFor: ["seafood", "coastal restaurants", "light lunch spots"],
    fonts: FONT_PACKS.coastalRefined,
    colors: {
      background: "#F4F7F9",
      surface: "#FFFFFF",
      surfaceAlt: "#EAF0F3",
      text: "#24323A",
      mutedText: "#5F717C",
      primary: "#3A6F8F",
      primaryText: "#FFFFFF",
      accent: "#E6D6B8",
      accentText: "#3D3125",
      border: "#D7E2E8",
      highlight: "#EAF2F7",
      announcementBg: "#EAF2F7",
      announcementText: "#2F607D",
      buttonSecondaryBg: "#F0F5F8",
      buttonSecondaryText: "#2F607D",
    },
  },
  {
    id: "dark-tavern",
    name: "Dark Tavern",
    shortDescription:
      "Deep charcoal, burgundy, and brass for a richer night-time mood.",
    recommendedFor: ["taverns", "pubs", "steakhouses", "bars"],
    fonts: FONT_PACKS.tavernClassic,
    colors: {
      background: "#121212",
      surface: "#1E1E1E",
      surfaceAlt: "#262626",
      text: "#EDEDED",
      mutedText: "#B6B6B6",
      primary: "#8C3A3A",
      primaryText: "#FFFFFF",
      accent: "#C9A46C",
      accentText: "#22180D",
      border: "#343434",
      highlight: "#211A1A",
      announcementBg: "#211A1A",
      announcementText: "#D8B37A",
      buttonSecondaryBg: "#262626",
      buttonSecondaryText: "#EDEDED",
    },
  },
  {
    id: "sunlit-brunch",
    name: "Sunlit Brunch",
    shortDescription:
      "Bright citrus warmth and airy neutrals for a lively morning crowd.",
    recommendedFor: ["brunch spots", "breakfast cafes", "daytime eateries"],
    fonts: {
      heading: "DM Sans",
      body: "Inter",
      headingFallback: "sans-serif",
      bodyFallback: "sans-serif",
      label: "Bright Modern Sans",
    },
    colors: {
      background: "#FFFDF7",
      surface: "#FFFFFF",
      surfaceAlt: "#FFF4D6",
      text: "#2A2A2A",
      mutedText: "#6B6257",
      primary: "#F4A261",
      primaryText: "#FFFFFF",
      accent: "#FFE8A3",
      accentText: "#5A4720",
      border: "#E9DFC8",
      highlight: "#FFF1C7",
      announcementBg: "#FFF1C7",
      announcementText: "#B7642E",
      buttonSecondaryBg: "#FFF7E3",
      buttonSecondaryText: "#B7642E",
    },
  },
  {
    id: "rustic-kitchen",
    name: "Rustic Kitchen",
    shortDescription:
      "Earthy olive, brown, and cream for a handmade farm-table feel.",
    recommendedFor: ["farm-to-table", "rustic kitchens", "comfort food spots"],
    fonts: {
      heading: "Merriweather",
      body: "Inter",
      headingFallback: "serif",
      bodyFallback: "sans-serif",
      label: "Rustic Editorial",
    },
    colors: {
      background: "#F4F1EC",
      surface: "#FFFDF8",
      surfaceAlt: "#EAE3D8",
      text: "#2C2C2C",
      mutedText: "#6E675E",
      primary: "#7A4E2D",
      primaryText: "#FFFFFF",
      accent: "#A3B18A",
      accentText: "#2F3A28",
      border: "#D8D0C4",
      highlight: "#E6E0D4",
      announcementBg: "#E6E0D4",
      announcementText: "#6C4428",
      buttonSecondaryBg: "#F1ECE3",
      buttonSecondaryText: "#6C4428",
    },
  },
  {
    id: "neon-street",
    name: "Neon Street",
    shortDescription:
      "High-contrast night energy with bold color pops for urban food brands.",
    recommendedFor: [
      "food trucks",
      "street food",
      "late-night spots",
      "urban fast casual",
    ],
    fonts: {
      heading: "Bebas Neue",
      body: "Inter",
      headingFallback: "sans-serif",
      bodyFallback: "sans-serif",
      label: "Bold Street",
    },
    colors: {
      background: "#0F0F0F",
      surface: "#1A1A1A",
      surfaceAlt: "#222222",
      text: "#FFFFFF",
      mutedText: "#B8B8B8",
      primary: "#FF4D6D",
      primaryText: "#FFFFFF",
      accent: "#00F5D4",
      accentText: "#062B26",
      border: "#2F2F2F",
      highlight: "#1E1E1E",
      announcementBg: "#1E1E1E",
      announcementText: "#00F5D4",
      buttonSecondaryBg: "#222222",
      buttonSecondaryText: "#FFFFFF",
    },
  },
  {
    id: "minimal-mono",
    name: "Minimal Mono",
    shortDescription:
      "Clean monochrome contrast for a sharp, modern, design-forward look.",
    recommendedFor: [
      "modern cafes",
      "minimal brands",
      "upscale counters",
      "design-led concepts",
    ],
    fonts: {
      heading: "Inter Tight",
      body: "Inter",
      headingFallback: "sans-serif",
      bodyFallback: "sans-serif",
      label: "Minimal Modern",
    },
    colors: {
      background: "#FFFFFF",
      surface: "#FAFAFA",
      surfaceAlt: "#F1F1F1",
      text: "#111111",
      mutedText: "#666666",
      primary: "#111111",
      primaryText: "#FFFFFF",
      accent: "#D9D9D9",
      accentText: "#111111",
      border: "#E5E5E5",
      highlight: "#F3F3F3",
      announcementBg: "#F3F3F3",
      announcementText: "#111111",
      buttonSecondaryBg: "#FFFFFF",
      buttonSecondaryText: "#111111",
    },
  },
];

export const DEFAULT_THEME_PRESET_ID = "classic-diner";

export function getThemePresetById(id?: string | null): ThemePreset {
  return (
    THEME_PRESETS.find((theme) => theme.id === id) ??
    THEME_PRESETS.find((theme) => theme.id === DEFAULT_THEME_PRESET_ID) ??
    THEME_PRESETS[0]
  );
}
