"use client";

import { useMemo, useState } from "react";
import { fontPackToFontStacks } from "@/lib/font-registry";
import {
  THEME_PRESETS,
  getThemePresetById,
  type ThemePreset,
  type ThemeTokens,
} from "@/lib/theme";
import { resolveTheme } from "@/lib/theme-utils";

// Decorative preview items — not real menu data
const PREVIEW_ITEMS = ["Daily Special", "House Classic", "Chef's Pick"];

export function BrandingThemeForm({
  initialBrand,
}: {
  initialBrand: {
    businessName: string;
    tagline: string;
    logoUrl?: string;
    themeMode: "preset" | "custom";
    themePresetId: string | null;
    themeTokens: ThemeTokens;
  };
}) {
  // ── BranchKit state (preserved exactly) ──────────────────────────────────
  const initialPreset = getThemePresetById(initialBrand.themePresetId);
  const [businessName, setBusinessName] = useState(initialBrand.businessName);
  const [tagline, setTagline] = useState(initialBrand.tagline);
  const [selectedPreset, setSelectedPreset] = useState<ThemePreset>(initialPreset);
  const [themeMode, setThemeMode] = useState<"preset" | "custom">(initialBrand.themeMode);
  const [themeTokens, setThemeTokens] = useState<ThemeTokens>(initialBrand.themeTokens);

  const resolvedTheme = useMemo(
    () => resolveTheme({ themeMode, themePresetId: selectedPreset.id, themeTokens }),
    [selectedPreset.id, themeMode, themeTokens],
  );
  const colors = resolvedTheme.resolvedColors;
  const fontStacks = fontPackToFontStacks(selectedPreset.fonts);

  function handlePresetSelect(preset: ThemePreset) {
    setSelectedPreset(preset);
    setThemeMode("preset");
    setThemeTokens(preset.colors);
  }

  function handleCustomColorChange(key: keyof ThemeTokens, value: string) {
    setThemeMode("custom");
    setThemeTokens((prev) => ({ ...prev, [key]: value }));
  }

  function resetToPreset() {
    setThemeMode("preset");
    setThemeTokens(selectedPreset.colors);
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        height: "100%",
        display: "flex",
        overflow: "hidden",
        gap: 10,
      }}
    >
      {/* ── Hidden form fields for Server Action ── */}
      <input type="hidden" name="theme_mode" value={themeMode} />
      <input type="hidden" name="theme_preset_id" value={selectedPreset.id} />
      <input
        type="hidden"
        name="theme_tokens"
        value={JSON.stringify(colors)}
      />

      {/* ═══════════════════════════════════════════════
          LEFT RAIL: Theme + typography selector
      ═══════════════════════════════════════════════ */}
      <div
        style={{
          width: 186,
          minWidth: 186,
          background: "rgba(255,255,255,0.01)",
          border: "1px solid rgba(255,255,255,0.038)",
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px 10px 10px",
          }}
        >
          {/* ── Color Theme ── */}
          <span className="section-label">Color Theme</span>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {THEME_PRESETS.map((preset) => {
              const active = selectedPreset.id === preset.id;
              const bg = preset.colors.background;
              const accent = preset.colors.primary;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "7px 8px 7px 6px",
                    borderRadius: 7,
                    background: active ? "rgba(255,255,255,0.04)" : "transparent",
                    border: "none",
                    borderLeft: active
                      ? `2px solid ${accent}`
                      : "2px solid transparent",
                    cursor: "pointer",
                    width: "100%",
                    transition: "background 0.1s, border-color 0.1s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.025)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {/* Swatch */}
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 6,
                      background: bg,
                      border: `1.5px solid ${accent}40`,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "flex-end",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: 8,
                        background: `linear-gradient(to right, ${accent}cc, ${accent}66)`,
                      }}
                    />
                    {active && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(0,0,0,0.3)",
                        }}
                      >
                        {/* Inline check */}
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 5l2.5 2.5L8 2.5"
                            stroke={accent}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <span
                    style={{
                      fontSize: 11.5,
                      color: active ? "#ccc9c2" : "#5e5e68",
                      fontWeight: active ? 500 : 400,
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Divider ── */}
          <div
            style={{
              margin: "14px 6px",
              borderTop: "1px solid rgba(255,255,255,0.04)",
            }}
          />

          {/* ── Typography (driven by active preset) ── */}
          <span className="section-label">Typography</span>

          <div
            style={{
              padding: "8px 8px 8px 6px",
              borderRadius: 7,
              background: "rgba(255,255,255,0.03)",
              borderLeft: `2px solid ${colors.primary}`,
            }}
          >
            <p
              style={{
                fontSize: 11.5,
                color: "#ccc9c2",
                fontWeight: 500,
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              {selectedPreset.fonts.label}
            </p>
            <p
              style={{
                fontSize: 9.5,
                color: "#48484e",
                marginTop: 3,
                letterSpacing: "0.02em",
              }}
            >
              {selectedPreset.fonts.heading} / {selectedPreset.fonts.body}
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          CENTER: Live preview stage
      ═══════════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "#060608",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.5), 0 24px 64px rgba(0,0,0,0.65), 0 4px 16px rgba(0,0,0,0.4)",
          position: "relative",
        }}
      >
        {/* Amber top-edge accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            right: "20%",
            height: 1,
            background: `linear-gradient(to right, transparent, rgba(217,119,6,0.35), transparent)`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Browser chrome */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 14px",
            background: "rgba(255,255,255,0.018)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            flexShrink: 0,
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div
                key={c}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: c,
                  opacity: 0.55,
                }}
              />
            ))}
          </div>

          {/* URL bar */}
          <div
            style={{
              flex: 1,
              margin: "0 10px",
              padding: "3px 10px",
              borderRadius: 4,
              background: "rgba(255,255,255,0.032)",
              fontSize: 10.5,
              color: "#3e3e48",
              textAlign: "center",
              fontFamily: "ui-monospace, monospace",
              letterSpacing: "0.02em",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {businessName.toLowerCase().replace(/\s+/g, "") || "yoursite"}.com
          </div>

          {/* Preview indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
            }}
          >
            <span
              className="animate-pulse-dot"
              style={{
                display: "inline-block",
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: colors.primary,
                opacity: 0.85,
              }}
            />
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#6a5530",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Preview
            </span>
          </div>
        </div>

        {/* Simulated restaurant page */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            background: colors.background,
            position: "relative",
          }}
        >
          {/* Nav bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 32px",
              borderBottom: `1px solid ${colors.primary}1a`,
            }}
          >
            <span
              style={{
                fontFamily: fontStacks.heading,
                fontSize: 18,
                fontWeight: 700,
                color: colors.text,
                letterSpacing: "-0.02em",
              }}
            >
              {businessName || "Your Restaurant"}
            </span>
            <div style={{ display: "flex", gap: 22 }}>
              {["Menu", "Specials", "Hours", "Contact"].map((l) => (
                <span
                  key={l}
                  style={{
                    fontSize: 11,
                    color: colors.mutedText,
                    letterSpacing: "0.01em",
                  }}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* Announcement bar */}
          <div
            style={{
              textAlign: "center",
              padding: "6px",
              background: `${colors.primary}10`,
              borderBottom: `1px solid ${colors.primary}18`,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: colors.primary,
                fontWeight: 600,
                letterSpacing: "0.08em",
                opacity: 0.9,
              }}
            >
              Now open — fresh daily specials await
            </span>
          </div>

          {/* Hero */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "36px 32px 20px",
            }}
          >
            <span
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                color: colors.primary,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                opacity: 0.75,
              }}
            >
              {selectedPreset.name}
            </span>
            <h1
              style={{
                fontFamily: fontStacks.heading,
                fontSize: 36,
                fontWeight: 700,
                color: colors.text,
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                margin: "10px 0 0",
              }}
            >
              {businessName || "Your Restaurant"}
            </h1>
            <p
              style={{
                fontSize: 12,
                color: colors.mutedText,
                marginTop: 12,
                maxWidth: 270,
                lineHeight: 1.65,
                fontFamily: fontStacks.body,
              }}
            >
              {tagline || "Great food, great people."}
            </p>
            <div
              style={{
                marginTop: 20,
                padding: "8px 24px",
                borderRadius: 7,
                background: colors.primary,
                color: colors.primaryText,
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
              }}
            >
              View Full Menu
            </div>
          </div>

          {/* Menu cards */}
          <div
            style={{
              padding: "0 32px 32px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
            }}
          >
            {PREVIEW_ITEMS.map((item) => (
              <div
                key={item}
                style={{
                  borderRadius: 7,
                  padding: "11px 12px",
                  background: colors.surface,
                  border: `1px solid ${colors.primary}14`,
                }}
              >
                <p
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: colors.text,
                    margin: 0,
                    fontFamily: fontStacks.body,
                  }}
                >
                  {item}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: colors.primary,
                    marginTop: 4,
                    fontWeight: 500,
                    opacity: 0.85,
                  }}
                >
                  $9.99
                </p>
              </div>
            ))}
          </div>

          {/* Bottom vignette */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 72,
              background: `linear-gradient(to bottom, transparent, ${colors.background}f0)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          RIGHT RAIL: Identity controls
      ═══════════════════════════════════════════════ */}
      <div
        style={{
          width: 220,
          minWidth: 220,
          background: "rgba(255,255,255,0.01)",
          border: "1px solid rgba(255,255,255,0.038)",
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div className="panel-header">
          <span className="label-upper">Identity</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              className="animate-pulse-dot"
              style={{
                display: "inline-block",
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#4ade80",
              }}
            />
            <span
              style={{
                fontSize: 9,
                color: "#2d5c3e",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Live
            </span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ── Active config ── */}
          <div style={{ padding: "14px 16px 12px" }}>
            <span className="section-label">Active</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Theme swatch */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: selectedPreset.colors.background,
                  border: `1.5px solid ${colors.primary}50`,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "flex-end",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 9,
                    background: `linear-gradient(to right, ${colors.primary}cc, ${colors.primary}55)`,
                  }}
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#c2c0b9",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {selectedPreset.name}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "#48484e",
                    marginTop: 2,
                    letterSpacing: "0.01em",
                  }}
                >
                  {selectedPreset.fonts.label}
                </p>
              </div>
            </div>
          </div>

          <div
            style={{ borderTop: "1px solid rgba(255,255,255,0.038)", margin: "0 16px" }}
          />

          {/* ── Brand details ── */}
          <div style={{ padding: "12px 16px" }}>
            <span className="section-label">Brand</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <label
                  className="label-upper-dim"
                  style={{ display: "block", marginBottom: 5 }}
                  htmlFor="bk-business-name"
                >
                  Name
                </label>
                <input
                  id="bk-business-name"
                  name="business_name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="ctrl-input"
                />
              </div>
              <div>
                <label
                  className="label-upper-dim"
                  style={{ display: "block", marginBottom: 5 }}
                  htmlFor="bk-tagline"
                >
                  Tagline
                </label>
                <input
                  id="bk-tagline"
                  name="tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  required
                  className="ctrl-input"
                />
              </div>
            </div>
          </div>

          <div
            style={{ borderTop: "1px solid rgba(255,255,255,0.038)", margin: "0 16px" }}
          />

          {/* ── Accent color override ── */}
          <div style={{ padding: "12px 16px" }}>
            <span className="section-label">Accent</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => handleCustomColorChange("primary", e.target.value)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 7,
                    border: `1.5px solid ${colors.primary}60`,
                    background: "transparent",
                    padding: 3,
                    cursor: "pointer",
                    display: "block",
                  }}
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 11.5,
                    fontFamily: "ui-monospace, monospace",
                    color: "#8a8890",
                    letterSpacing: "0.04em",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {colors.primary.toUpperCase()}
                </p>
                <p
                  style={{
                    fontSize: 9.5,
                    color: "#3c3c46",
                    marginTop: 2,
                    letterSpacing: "0.02em",
                  }}
                >
                  {themeMode === "custom" ? "Custom override" : "From preset"}
                </p>
              </div>
            </div>
          </div>

          <div
            style={{ borderTop: "1px solid rgba(255,255,255,0.038)", margin: "0 16px" }}
          />

          {/* ── Logo ── */}
          <div style={{ padding: "12px 16px" }}>
            <span className="section-label">Logo</span>
            <input
              name="logo_url"
              defaultValue={initialBrand.logoUrl ?? ""}
              placeholder="https://..."
              className="ctrl-input"
              style={{ marginBottom: 8 }}
            />
            <label
              htmlFor="bk-logo-upload"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                padding: "13px 10px 11px",
                borderRadius: 8,
                border: "1px dashed rgba(255,255,255,0.07)",
                cursor: "pointer",
                transition: "border-color 0.12s, background 0.12s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(217,119,6,0.25)";
                el.style.background = "rgba(217,119,6,0.03)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.07)";
                el.style.background = "transparent";
              }}
            >
              {/* Upload icon */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 8V2M6 2L4 4M6 2l2 2M2 10h8"
                  stroke="#3c3c46"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                style={{
                  fontSize: 10.5,
                  color: "#48484e",
                  textAlign: "center",
                  lineHeight: 1.4,
                }}
              >
                {initialBrand.logoUrl ? "Replace logo" : "PNG or SVG"}
              </span>
            </label>
            <input
              id="bk-logo-upload"
              type="file"
              name="logo_file"
              accept=".png,.jpg,.jpeg,.webp,.svg"
              style={{ display: "none" }}
            />
            {initialBrand.logoUrl ? null : (
              <p
                style={{
                  fontSize: 9.5,
                  color: "#32323a",
                  marginTop: 6,
                  textAlign: "center",
                  letterSpacing: "0.03em",
                }}
              >
                No logo set
              </p>
            )}
          </div>

          <div style={{ flex: 1 }} />
        </div>

        {/* ── CTA footer ── */}
        <div
          style={{
            padding: "10px 14px 13px",
            borderTop: "1px solid rgba(255,255,255,0.045)",
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <button
            type="submit"
            className="btn-primary"
            style={{ justifyContent: "center", width: "100%", padding: "9px 14px" }}
          >
            Apply &amp; Save
          </button>
          <button
            type="button"
            onClick={resetToPreset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "6px 14px",
              borderRadius: 7,
              fontSize: 10,
              fontWeight: 400,
              letterSpacing: "0.04em",
              cursor: "pointer",
              background: "transparent",
              color: "#3e3e48",
              border: "1px solid transparent",
              transition: "color 0.12s, border-color 0.12s",
              width: "100%",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#6a6a74";
              el.style.borderColor = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#3e3e48";
              el.style.borderColor = "transparent";
            }}
          >
            {/* Rotate icon */}
            <svg
              width="9"
              height="9"
              viewBox="0 0 9 9"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 4.5A3.5 3.5 0 1 0 4.5 1H2.5M2.5 1L1 2.5M2.5 1L4 2.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Reset to preset
          </button>
        </div>
      </div>
    </div>
  );
}
