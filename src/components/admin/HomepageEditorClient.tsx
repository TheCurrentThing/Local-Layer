"use client";

import { useRef, useState, useTransition } from "react";
import {
  saveAnnouncementAction,
  saveHomepageContentAction,
  saveFeatureSettingsAction,
} from "@/app/admin/actions";

/* ─── icon SVGs ─────────────────────────────────────────── */
const EyeOn = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <ellipse cx="5.5" cy="5.5" rx="4.5" ry="3" stroke="#4ade80" strokeWidth="1.1" />
    <circle cx="5.5" cy="5.5" r="1.5" fill="#4ade80" />
  </svg>
);
const EyeOff = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M1.5 1.5l8 8M3.5 2.8A5 5 0 0 1 5.5 2.5c2.5 0 4 2.5 4 3s-.5 1.3-1.5 2M1.5 5.5c.3-.6.8-1.3 1.5-1.8" stroke="#2e2e35" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);
const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 12V4M6 7l3-3 3 3" stroke="#5a5a64" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 13v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1" stroke="#5a5a64" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const ArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2.5 6.5h8M7 3.5l3 3-3 3" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── types ─────────────────────────────────────────────── */
type SectionId =
  | "announcement" | "hero" | "specials" | "featured"
  | "about" | "gallery" | "testimonials";

type Section = {
  id: SectionId;
  label: string;
  live: boolean;
  toggleable: boolean;
  flagKey?: string;
  editHref?: string;
  contentHint?: string;
};

type AnnouncementState = { title: string; body: string; isActive: boolean };
type HeroState = {
  eyebrow: string; headline: string; subheadline: string;
  primaryCtaLabel: string; primaryCtaHref: string;
  secondaryCtaLabel: string; secondaryCtaHref: string;
  quickInfoHoursLabel: string; orderingNotice: string; heroImageUrl: string;
};
type SupportingState = {
  menuPreviewTitle: string; menuPreviewSubtitle: string;
  galleryTitle: string; gallerySubtitle: string;
  contactTitle: string; contactSubtitle: string;
};
type AboutState = { title: string; body: string };
type FlagsState = {
  showSpecials: boolean; showGallery: boolean;
  showTestimonials: boolean; showMap: boolean;
  showOnlineOrdering: boolean; showStickyMobileBar: boolean;
  showBreakfastMenu: boolean; showLunchMenu: boolean; showDinnerMenu: boolean;
};

type GalleryImage = { id: string; src: string; alt: string; isActive: boolean };

export function HomepageEditorClient({
  businessName,
  announcement: initAnnouncement,
  hero: initHero,
  supporting: initSupporting,
  about: initAbout,
  features: initFeatures,
  galleryImages,
}: {
  businessName: string;
  announcement: AnnouncementState;
  hero: HeroState;
  supporting: SupportingState;
  about: AboutState;
  features: FlagsState;
  galleryImages: GalleryImage[];
}) {
  const [announcement, setAnnouncement] = useState(initAnnouncement);
  const [hero, setHero] = useState(initHero);
  const [supporting, setSupporting] = useState(initSupporting);
  const [about, setAbout] = useState(initAbout);
  const [flags, setFlags] = useState(initFeatures);
  const [selected, setSelected] = useState<SectionId>("announcement");
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreviewUrl, setHeroPreviewUrl] = useState<string | null>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const sections: Section[] = [
    { id: "announcement", label: "Announcement Bar",  live: announcement.isActive, toggleable: true },
    { id: "hero",         label: "Hero Section",      live: true,                  toggleable: false },
    { id: "specials",     label: "Daily Specials",    live: flags.showSpecials,    toggleable: true, flagKey: "showSpecials",    editHref: "/admin/specials", contentHint: "Manage featured specials in the Specials section." },
    { id: "featured",     label: "Featured Menu",     live: true,                  toggleable: false, editHref: "/admin/menu",   contentHint: "Edit menu items in the Menu section." },
    { id: "about",        label: "About Section",     live: true,                  toggleable: false },
    { id: "gallery",      label: "Photo Gallery",     live: flags.showGallery,     toggleable: true, flagKey: "showGallery",     editHref: "/admin/photos",   contentHint: "Manage photos in the Photos section." },
    { id: "testimonials", label: "Testimonials",      live: flags.showTestimonials,toggleable: true, flagKey: "showTestimonials",editHref: "/admin/settings", contentHint: "Testimonials are managed in Settings." },
  ];

  const liveCount = sections.filter((s) => s.live).length;
  const sel = sections.find((s) => s.id === selected)!;

  function toggleSection(id: SectionId) {
    if (id === "announcement") {
      setAnnouncement((p) => ({ ...p, isActive: !p.isActive }));
    } else {
      const sec = sections.find((s) => s.id === id);
      if (sec?.flagKey) {
        setFlags((p) => ({ ...p, [sec.flagKey!]: !p[sec.flagKey as keyof FlagsState] }));
      }
    }
  }

  function handleSave() {
    startTransition(async () => {
      if (selected === "announcement") {
        const fd = new FormData();
        fd.set("redirect_to", "/admin/homepage");
        fd.set("announcement_title", announcement.title);
        fd.set("announcement_body", announcement.body);
        if (announcement.isActive) fd.set("announcement_is_active", "on");
        await saveAnnouncementAction(fd);
      } else if (selected === "hero" || selected === "about" || selected === "featured") {
        const fd = new FormData();
        fd.set("redirect_to", "/admin/homepage");
        fd.set("business_name", businessName);
        if (heroFile) fd.set("hero_image_file", heroFile);
        fd.set("hero_eyebrow", hero.eyebrow);
        fd.set("hero_headline", hero.headline);
        fd.set("hero_subheadline", hero.subheadline);
        fd.set("hero_primary_cta_label", hero.primaryCtaLabel);
        fd.set("hero_primary_cta_href", hero.primaryCtaHref);
        fd.set("hero_secondary_cta_label", hero.secondaryCtaLabel);
        fd.set("hero_secondary_cta_href", hero.secondaryCtaHref);
        fd.set("quick_info_hours_label", hero.quickInfoHoursLabel);
        fd.set("ordering_notice", hero.orderingNotice);
        fd.set("hero_image_url", hero.heroImageUrl);
        fd.set("menu_preview_title", supporting.menuPreviewTitle);
        fd.set("menu_preview_subtitle", supporting.menuPreviewSubtitle);
        fd.set("gallery_title", supporting.galleryTitle);
        fd.set("gallery_subtitle", supporting.gallerySubtitle);
        fd.set("contact_title", supporting.contactTitle);
        fd.set("contact_subtitle", supporting.contactSubtitle);
        fd.set("about_title", about.title);
        fd.set("about_body", about.body);
        await saveHomepageContentAction(fd);
      } else {
        // visibility-toggleable section — save feature flags
        const fd = new FormData();
        fd.set("redirect_to", "/admin/homepage");
        if (flags.showSpecials) fd.set("show_specials", "on");
        if (flags.showGallery) fd.set("show_gallery", "on");
        if (flags.showTestimonials) fd.set("show_testimonials", "on");
        if (flags.showMap) fd.set("show_map", "on");
        if (flags.showOnlineOrdering) fd.set("show_online_ordering", "on");
        if (flags.showStickyMobileBar) fd.set("show_sticky_mobile_bar", "on");
        if (flags.showBreakfastMenu) fd.set("show_breakfast_menu", "on");
        if (flags.showLunchMenu) fd.set("show_lunch_menu", "on");
        if (flags.showDinnerMenu) fd.set("show_dinner_menu", "on");
        await saveFeatureSettingsAction(fd);
      }
    });
  }

  return (
    <div
      className="animate-fade-in"
      style={{ height: "100%", display: "flex", overflow: "hidden", padding: "2px", gap: "12px" }}
    >
      {/* ── LEFT: Section list ── */}
      <div style={{ width: 224, minWidth: 224, background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div className="panel-header">
          <span className="label-upper">Homepage Sections</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#4ade80", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {liveCount}/{sections.length} live
          </span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "6px" }}>
          {sections.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelected(s.id)}
              style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 8, marginBottom: 2, background: selected === s.id ? "rgba(217,119,6,0.09)" : "transparent", border: selected === s.id ? "1px solid rgba(217,119,6,0.2)" : "1px solid transparent", cursor: "pointer", transition: "background 0.12s" }}
              onMouseEnter={(e) => { if (selected !== s.id) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={(e) => { if (selected !== s.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: s.live ? "#4ade80" : "#2e2e35", flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 12, fontWeight: selected === s.id ? 600 : 400, color: selected === s.id ? "#e2e0d8" : "#7a7a84", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {s.label}
              </span>
              {s.toggleable && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleSection(s.id); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 2, flexShrink: 0, display: "flex" }}
                >
                  {s.live ? <EyeOn /> : <EyeOff />}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── CENTER: Editor ── */}
      <div style={{ flex: 1, minWidth: 0, background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div className="panel-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: sel.live ? "#4ade80" : "#2e2e35" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e0d8" }}>{sel.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: sel.live ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.04)", color: sel.live ? "#4ade80" : "#4b4b54", border: `1px solid ${sel.live ? "rgba(74,222,128,0.18)" : "rgba(255,255,255,0.06)"}` }}>
              {sel.live ? "Visible" : "Hidden"}
            </span>
            {sel.toggleable && (
              <button
                type="button"
                onClick={() => toggleSection(sel.id)}
                style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", background: sel.live ? "rgba(239,68,68,0.08)" : "rgba(74,222,128,0.08)", color: sel.live ? "#f87171" : "#4ade80", border: `1px solid ${sel.live ? "rgba(239,68,68,0.18)" : "rgba(74,222,128,0.2)"}`, textTransform: "uppercase", letterSpacing: "0.08em" }}
              >
                {sel.live ? "Hide" : "Show"}
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {/* ── Announcement ── */}
          {selected === "announcement" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 540 }}>
              <div>
                <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Announcement Label</span>
                <input value={announcement.title} onChange={(e) => setAnnouncement((p) => ({ ...p, title: e.target.value }))} className="ctrl-input" placeholder="e.g. Friday Special" />
              </div>
              <div>
                <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Announcement Text</span>
                <input value={announcement.body} onChange={(e) => setAnnouncement((p) => ({ ...p, body: e.target.value }))} className="ctrl-input" placeholder="e.g. Fish fry every Friday, all day" />
              </div>
              {announcement.body && (
                <div>
                  <span className="label-upper" style={{ display: "block", marginBottom: 8 }}>Live Preview</span>
                  <div style={{ borderRadius: 8, padding: 16, background: "#0c0c0e", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ textAlign: "center", padding: "8px", borderRadius: 6, background: "rgba(217,119,6,0.14)" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#d97706" }}>📢 {announcement.body}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Hero ── */}
          {selected === "hero" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 600 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Small Headline (Eyebrow)</span>
                  <input value={hero.eyebrow} onChange={(e) => setHero((p) => ({ ...p, eyebrow: e.target.value }))} className="ctrl-input" />
                </div>
                <div>
                  <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Quick Hours Summary</span>
                  <input value={hero.quickInfoHoursLabel} onChange={(e) => setHero((p) => ({ ...p, quickInfoHoursLabel: e.target.value }))} className="ctrl-input" />
                </div>
              </div>
              <div>
                <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Main Headline</span>
                <input value={hero.headline} onChange={(e) => setHero((p) => ({ ...p, headline: e.target.value }))} className="ctrl-input" />
              </div>
              <div>
                <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Hero Text</span>
                <textarea value={hero.subheadline} onChange={(e) => setHero((p) => ({ ...p, subheadline: e.target.value }))} rows={3} className="ctrl-input" style={{ resize: "none" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Primary CTA Label</span>
                  <input value={hero.primaryCtaLabel} onChange={(e) => setHero((p) => ({ ...p, primaryCtaLabel: e.target.value }))} className="ctrl-input" />
                </div>
                <div>
                  <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Primary CTA Link</span>
                  <input value={hero.primaryCtaHref} onChange={(e) => setHero((p) => ({ ...p, primaryCtaHref: e.target.value }))} className="ctrl-input" />
                </div>
                <div>
                  <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Secondary CTA Label</span>
                  <input value={hero.secondaryCtaLabel} onChange={(e) => setHero((p) => ({ ...p, secondaryCtaLabel: e.target.value }))} className="ctrl-input" />
                </div>
                <div>
                  <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Secondary CTA Link</span>
                  <input value={hero.secondaryCtaHref} onChange={(e) => setHero((p) => ({ ...p, secondaryCtaHref: e.target.value }))} className="ctrl-input" />
                </div>
              </div>
              {/* Hero image upload */}
              <div>
                <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Hero Photo</span>
                <input
                  ref={heroFileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setHeroFile(file);
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setHeroPreviewUrl(url);
                    } else {
                      setHeroPreviewUrl(null);
                    }
                  }}
                />
                {/* Preview: file selection takes priority over URL */}
                {(heroPreviewUrl || hero.heroImageUrl) ? (
                  <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
                    <img
                      src={heroPreviewUrl ?? hero.heroImageUrl}
                      alt="Hero preview"
                      style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}
                    />
                    {heroFile && (
                      <div style={{ position: "absolute", top: 6, left: 8, fontSize: 9, fontWeight: 700, color: "#d97706", background: "rgba(0,0,0,0.6)", padding: "2px 7px", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        New file selected
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => heroFileInputRef.current?.click()}
                      style={{ position: "absolute", bottom: 6, right: 8, padding: "4px 10px", borderRadius: 6, background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e0d8", fontSize: 10, fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" }}
                    >
                      Replace
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => heroFileInputRef.current?.click()}
                    style={{ width: "100%", padding: "20px", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.018)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(217,119,6,0.3)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
                  >
                    <UploadIcon />
                    <span style={{ fontSize: 11, color: "#5a5a64" }}>Click to upload hero photo</span>
                    <span style={{ fontSize: 10, color: "#3a3a42" }}>PNG, JPG, WEBP · max 5MB</span>
                  </button>
                )}
                {/* URL fallback */}
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 9, color: "#3a3a42", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>Or paste a URL</span>
                  <input
                    value={hero.heroImageUrl}
                    onChange={(e) => {
                      setHero((p) => ({ ...p, heroImageUrl: e.target.value }));
                      if (e.target.value) { setHeroFile(null); setHeroPreviewUrl(null); }
                    }}
                    className="ctrl-input"
                    style={{ marginTop: 5, fontSize: 11 }}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Note Under Hero</span>
                <input value={hero.orderingNotice} onChange={(e) => setHero((p) => ({ ...p, orderingNotice: e.target.value }))} className="ctrl-input" placeholder="e.g. No online ordering — dine-in only" />
              </div>
            </div>
          )}

          {/* ── About ── */}
          {selected === "about" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 540 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>About Section Title</span>
                  <input value={about.title} onChange={(e) => setAbout((p) => ({ ...p, title: e.target.value }))} className="ctrl-input" />
                </div>
                <div>
                  <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>About Section Text</span>
                  <textarea value={about.body} onChange={(e) => setAbout((p) => ({ ...p, body: e.target.value }))} rows={7} className="ctrl-input" style={{ resize: "none" }} />
                </div>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
                <span className="label-upper" style={{ color: "#3e3e46" }}>Contact Section Headings</span>
                <div>
                  <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Contact Title</span>
                  <input value={supporting.contactTitle} onChange={(e) => setSupporting((p) => ({ ...p, contactTitle: e.target.value }))} className="ctrl-input" placeholder="e.g. Find Us" />
                </div>
                <div>
                  <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Contact Subtitle</span>
                  <textarea value={supporting.contactSubtitle} onChange={(e) => setSupporting((p) => ({ ...p, contactSubtitle: e.target.value }))} rows={2} className="ctrl-input" style={{ resize: "none" }} placeholder="e.g. We'd love to see you" />
                </div>
                <RedirectHint href="/admin/contact" label="Edit address, phone and social links in Contact" />
              </div>
            </div>
          )}

          {/* ── Featured Menu (section headings) ── */}
          {selected === "featured" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 540 }}>
              <div>
                <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Menu Preview Title</span>
                <input value={supporting.menuPreviewTitle} onChange={(e) => setSupporting((p) => ({ ...p, menuPreviewTitle: e.target.value }))} className="ctrl-input" />
              </div>
              <div>
                <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Menu Preview Subtitle</span>
                <textarea value={supporting.menuPreviewSubtitle} onChange={(e) => setSupporting((p) => ({ ...p, menuPreviewSubtitle: e.target.value }))} rows={3} className="ctrl-input" style={{ resize: "none" }} />
              </div>
              <RedirectHint href="/admin/menu" label="Edit menu items in the Menu section" />
            </div>
          )}

          {/* ── Gallery ── */}
          {selected === "gallery" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
              {/* Section headings */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Gallery Title</span>
                  <input value={supporting.galleryTitle} onChange={(e) => setSupporting((p) => ({ ...p, galleryTitle: e.target.value }))} className="ctrl-input" />
                </div>
                <div>
                  <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Gallery Subtitle</span>
                  <input value={supporting.gallerySubtitle} onChange={(e) => setSupporting((p) => ({ ...p, gallerySubtitle: e.target.value }))} className="ctrl-input" />
                </div>
              </div>

              {/* Live photo grid */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span className="label-upper">Live Photos ({galleryImages.filter(i => i.isActive).length} active)</span>
                  <a href="/admin/photos" style={{ fontSize: 10, color: "#d97706", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
                    Manage →
                  </a>
                </div>
                {galleryImages.length === 0 ? (
                  <div style={{ padding: "20px", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.018)", textAlign: "center" }}>
                    <p style={{ fontSize: 12, color: "#4b4b54", margin: 0 }}>No photos uploaded yet.</p>
                    <a href="/admin/photos" style={{ fontSize: 11, color: "#d97706", marginTop: 6, display: "inline-block", textDecoration: "none" }}>
                      Go to Photos →
                    </a>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 6 }}>
                    {galleryImages.map((img) => (
                      <div
                        key={img.id}
                        style={{ position: "relative", borderRadius: 7, overflow: "hidden", aspectRatio: "1", border: `1px solid ${img.isActive ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)"}` }}
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: img.isActive ? 1 : 0.35 }}
                        />
                        {!img.isActive && (
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 9, fontWeight: 700, color: "#4b4b54", letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: 3 }}>Hidden</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}


{/* ── Visibility-only sections ── */}
          {(selected === "specials" || selected === "testimonials") && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ padding: "14px 16px", borderRadius: 9, background: "rgba(255,255,255,0.022)", border: "1px solid rgba(255,255,255,0.065)" }}>
                <span className="label-upper" style={{ display: "block", marginBottom: 6 }}>Visibility</span>
                <p style={{ fontSize: 13, color: "#c9c7c0", margin: 0 }}>
                  Use the <strong style={{ color: "#e2e0d8" }}>{sel.live ? "Hide" : "Show"}</strong> toggle above to control whether this section appears on the homepage. Then click Save.
                </p>
              </div>
              {sel.editHref && <RedirectHint href={sel.editHref} label={sel.contentHint ?? "Edit content in its dedicated section"} />}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
          <button type="button" onClick={handleSave} disabled={isPending} className="btn-primary">
            {isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ── RIGHT: Visibility map ── */}
      <div style={{ width: 188, minWidth: 188, background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div className="panel-header">
          <span className="label-upper">Visibility Map</span>
        </div>
        <div style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 1 }}>
          {sections.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelected(s.id)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 6px", borderBottom: "1px solid rgba(255,255,255,0.035)", cursor: "pointer" }}
            >
              <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: s.live ? "#4ade80" : "#252530", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: s.live ? "#7a7a84" : "#3a3a42", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#e2e0d8", lineHeight: 1 }}>{liveCount}</span>
          <div>
            <p style={{ fontSize: 11, color: "#4ade80", fontWeight: 700, margin: 0 }}>sections</p>
            <p style={{ fontSize: 10, color: "#3a3a42", margin: 0 }}>live on site</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RedirectHint({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 8, background: "rgba(217,119,6,0.04)", border: "1px solid rgba(217,119,6,0.12)", textDecoration: "none" }}
    >
      <ArrowRight />
      <span style={{ fontSize: 12, color: "#7a7a84" }}>{label}</span>
    </a>
  );
}
