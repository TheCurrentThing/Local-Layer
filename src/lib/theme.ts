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
  sectionDark?: string;
  sectionDarkAlt?: string;
  sectionDarkText?: string;
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

export type SectionPattern = {
  type: "none" | "noise" | "dots" | "checker" | "stripes" | "organic";
  opacity: number;
  scale?: number;
};

export type AccentPattern = {
  type: "none" | "dots" | "checker" | "memphis" | "organic" | "stripes";
  intensity?: "low" | "medium";
};

export type ThemePatterns = {
  section?: SectionPattern;
  accent?: AccentPattern;
};

export type ThemePreset = {
  id: string;
  name: string;
  shortDescription: string;
  recommendedFor: string[];
  fonts: FontPack;
  colors: ThemeTokens;
  patterns?: ThemePatterns;
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
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "classic-diner",
    name: "Classic Diner",
    shortDescription:
      "Warm cream, burgundy, and gold with a hometown diner feel.",
    recommendedFor: ["diners", "breakfast spots", "family restaurants"],
    fonts: FONT_PACKS.classicSerif,
    patterns: {
      section: {
        type: "checker",
        opacity: 0.06,
        scale: 0.8,
      },
      accent: {
        type: "checker",
        intensity: "low",
      },
    },
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
    patterns: {
      section: {
        type: "noise",
        opacity: 0.05,
      },
      accent: {
        type: "none",
      },
    },
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
    patterns: {
      section: {
        type: "dots",
        opacity: 0.08,
        scale: 1.2,
      },
      accent: {
        type: "dots",
        intensity: "low",
      },
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
    patterns: {
      section: {
        type: "stripes",
        opacity: 0.07,
        scale: 1,
      },
      accent: {
        type: "memphis",
        intensity: "medium",
      },
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
    id: "wild-herb",
    name: "Wild Herb",
    shortDescription:
      "Muted sage, olive gold, and clay red for an earthy, handcrafted food brand.",
    recommendedFor: [
      "farm-to-table",
      "rustic cafes",
      "wellness kitchens",
      "artisan food spots",
    ],
    fonts: {
      heading: "Merriweather",
      body: "Inter",
      headingFallback: "serif",
      bodyFallback: "sans-serif",
      label: "Rustic Editorial",
    },
    patterns: {
      section: {
        type: "organic",
        opacity: 0.07,
      },
      accent: {
        type: "organic",
        intensity: "low",
      },
    },
    colors: {
      background: "#F4F1EA",
      surface: "#FFFDF8",
      surfaceAlt: "#E7E1D7",
      text: "#2E2926",
      mutedText: "#6E655F",
      primary: "#942911",
      primaryText: "#FFFFFF",
      accent: "#94B9AF",
      accentText: "#1E302C",
      border: "#D5CDC0",
      highlight: "#9D8420",
      announcementBg: "#593837",
      announcementText: "#F3E8D8",
      buttonSecondaryBg: "#EEF4F1",
      buttonSecondaryText: "#35514A",
    },
  },
  {
    id: "coastal-breeze",
    name: "Coastal Breeze",
    shortDescription:
      "Fresh ocean blues with deep evergreen and vibrant tangerine accents.",
    recommendedFor: [
      "seafood spots",
      "cafes",
      "modern diners",
      "fresh food brands",
    ],
    fonts: {
      heading: "Sora",
      body: "Inter",
      headingFallback: "sans-serif",
      bodyFallback: "sans-serif",
      label: "Clean Modern",
    },
    patterns: {
      section: {
        type: "dots",
        opacity: 0.05,
        scale: 0.9,
      },
      accent: {
        type: "stripes",
        intensity: "low",
      },
    },
    colors: {
      background: "#F4FAFB",
      surface: "#FFFFFF",
      surfaceAlt: "#E6F2F5",
      text: "#1C2B2E",
      mutedText: "#5F7A80",
      primary: "#D84727",
      primaryText: "#FFFFFF",
      accent: "#5EB1BF",
      accentText: "#0E2A2F",
      border: "#D6E3E6",
      highlight: "#EF7B45",
      announcementBg: "#042A2B",
      announcementText: "#EAF6F7",
      buttonSecondaryBg: "#EAF6F7",
      buttonSecondaryText: "#042A2B",
    },
  },
  {
    id: "garden-bistro",
    name: "Garden Bistro",
    shortDescription:
      "Soft almond and custard tones with plum depth, tea green freshness, and a cool twilight accent.",
    recommendedFor: [
      "cafes",
      "bistros",
      "brunch spots",
      "casual dining",
    ],
    fonts: {
      heading: "Lora",
      body: "Inter",
      headingFallback: "serif",
      bodyFallback: "sans-serif",
      label: "Soft Editorial",
    },
    patterns: {
      section: {
        type: "noise",
        opacity: 0.03,
      },
      accent: {
        type: "organic",
        intensity: "low",
      },
    },
    colors: {
      background: "#FAF6EC",
      surface: "#FFFFFF",
      surfaceAlt: "#F1EDE2",
      text: "#2F2B28",
      mutedText: "#6F665F",
      primary: "#E08E45",
      primaryText: "#FFFFFF",
      accent: "#BDF7B7",
      accentText: "#1F2E1F",
      border: "#DED7C8",
      highlight: "#F8F4A6",
      announcementBg: "#6B2737",
      announcementText: "#F7E8EA",
      buttonSecondaryBg: "#EEF6EE",
      buttonSecondaryText: "#2F4F3F",
    },
  },
  {
    id: "ember-teal",
    name: "Ember & Teal",
    shortDescription:
      "Bold flame orange with cool teal contrast, grounded by soft neutrals and deep charcoal.",
    recommendedFor: [
      "modern restaurants",
      "burger spots",
      "fusion kitchens",
      "urban cafes",
    ],
    fonts: {
      heading: "Sora",
      body: "Inter",
      headingFallback: "sans-serif",
      bodyFallback: "sans-serif",
      label: "Modern Contrast",
    },
    patterns: {
      section: {
        type: "stripes",
        opacity: 0.06,
      },
      accent: {
        type: "checker",
        intensity: "low",
      },
    },
    colors: {
      background: "#F7F3EA",
      surface: "#FFFFFF",
      surfaceAlt: "#EFE7DA",
      text: "#1F1F1F",
      mutedText: "#6B6258",
      primary: "#FF4000",
      primaryText: "#FFFFFF",
      accent: "#50B2C0",
      accentText: "#0F2A2E",
      border: "#DED6C8",
      highlight: "#FAAA8D",
      announcementBg: "#201E1F",
      announcementText: "#F7F3EA",
      buttonSecondaryBg: "#E8F4F6",
      buttonSecondaryText: "#201E1F",
    },
  },
  {
    id: "quiet-reserve",
    name: "Quiet Reserve",
    shortDescription:
      "Muted slate and sage tones with deep bordeaux and black for a refined, understated experience.",
    recommendedFor: [
      "fine dining",
      "wine bars",
      "upscale cafes",
      "modern restaurants",
    ],
    fonts: {
      heading: "Playfair Display",
      body: "Inter",
      headingFallback: "serif",
      bodyFallback: "sans-serif",
      label: "Refined Editorial",
    },
    patterns: {
      section: {
        type: "noise",
        opacity: 0.04,
      },
      accent: {
        type: "none",
      },
    },
    colors: {
      background: "#F4F2EF",
      surface: "#FFFFFF",
      surfaceAlt: "#E7E3DD",
      text: "#2A2A2A",
      mutedText: "#6E6A65",
      primary: "#5A2328",
      primaryText: "#FFFFFF",
      accent: "#7A9B76",
      accentText: "#1E2A1F",
      border: "#D3CEC7",
      highlight: "#C8BFC7",
      sectionDark: "#1A1415",
      sectionDarkAlt: "#231B1D",
      sectionDarkText: "#F4F2EF",
      announcementBg: "#090302",
      announcementText: "#F4F2EF",
      buttonSecondaryBg: "#EDEBE7",
      buttonSecondaryText: "#2A2A2A",
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
