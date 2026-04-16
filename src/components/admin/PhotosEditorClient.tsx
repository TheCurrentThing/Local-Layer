"use client";

import { useRef, useState, useTransition } from "react";
import { useMobile } from "@/hooks/useMobile";
import { saveGalleryImageAction, deleteGalleryImageAction } from "@/app/admin/actions";

/* ─── icons ──────────────────────────────────────────────── */
const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 13V5M7 8l3-3 3 3" stroke="#5a5a64" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 15v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1" stroke="#5a5a64" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 3h8M5 3V2h2v1M4 3v6.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5V3" stroke="#f87171" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M2 5.5l2.5 2.5 4.5-5" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M5.5 2v7M2 5.5h7" stroke="#d97706" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/* ─── types ──────────────────────────────────────────────── */
type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  isActive: boolean;
  sortOrder: number;
};

type DraftImage = {
  id?: string;
  src: string;
  alt: string;
  isActive: boolean;
  sortOrder: number;
};

const BLANK_DRAFT: DraftImage = { src: "", alt: "", isActive: true, sortOrder: 0 };

function toDraft(img: GalleryImage): DraftImage {
  return { id: img.id, src: img.src, alt: img.alt, isActive: img.isActive, sortOrder: img.sortOrder };
}

/* ─── component ──────────────────────────────────────────── */
export function PhotosEditorClient({
  images: initImages,
  businessName,
}: {
  images: GalleryImage[];
  businessName: string;
}) {
  const isMobile = useMobile();
  const [mobileTab, setMobileTab] = useState<"library" | "edit">("library");
  const [images, setImages] = useState(initImages);
  const [draft, setDraft] = useState<DraftImage>(
    initImages.length > 0 ? toDraft(initImages[0]) : BLANK_DRAFT
  );
  const [isNew, setIsNew] = useState(initImages.length === 0);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const liveCount = images.filter((i) => i.isActive).length;

  function selectImage(img: GalleryImage) {
    setDraft(toDraft(img));
    setIsNew(false);
    setPhotoFile(null);
    setPreviewUrl(null);
    if (isMobile) setMobileTab("edit");
  }

  function openNew() {
    setDraft({ ...BLANK_DRAFT, sortOrder: images.length });
    setIsNew(true);
    setPhotoFile(null);
    setPreviewUrl(null);
    if (isMobile) setMobileTab("edit");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl(null);
  }

  function handleSave() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("redirect_to", "/admin/photos");
      fd.set("business_name", businessName);
      if (draft.id) fd.set("gallery_image_id", draft.id);
      if (photoFile) fd.set("photo_file", photoFile);
      if (draft.src) fd.set("src", draft.src);
      fd.set("alt", draft.alt);
      fd.set("sort_order", String(draft.sortOrder));
      if (draft.isActive) fd.set("is_active", "on");
      await saveGalleryImageAction(fd);

      if (draft.id) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === draft.id
              ? { ...img, src: previewUrl ?? draft.src, alt: draft.alt, isActive: draft.isActive, sortOrder: draft.sortOrder }
              : img
          )
        );
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      if (isNew) setIsNew(false);
      setPhotoFile(null);
    });
  }

  function handleDelete() {
    if (!draft.id) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("redirect_to", "/admin/photos");
      fd.set("gallery_image_id", draft.id!);
      await deleteGalleryImageAction(fd);
      const remaining = images.filter((img) => img.id !== draft.id);
      setImages(remaining);
      if (remaining.length > 0) {
        setDraft(toDraft(remaining[0]));
        setIsNew(false);
      } else {
        setDraft(BLANK_DRAFT);
        setIsNew(true);
      }
      setPhotoFile(null);
      setPreviewUrl(null);
    });
  }

  const displaySrc = previewUrl ?? (draft.src || null);
  const selectedId = draft.id;

  const TABS = [
    { id: "library" as const, label: "Library" },
    { id: "edit" as const, label: "Edit" },
  ];
  const panelStyle = (tab: typeof mobileTab) =>
    isMobile
      ? { flex: 1, minHeight: 0, width: "100%", display: mobileTab === tab ? "flex" : "none", flexDirection: "column" as const }
      : {};

  return (
    <div
      className="animate-fade-in"
      style={isMobile
        ? { height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }
        : { height: "100%", display: "flex", overflow: "hidden", padding: "2px", gap: "12px" }
      }
    >
      {isMobile && (
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          {TABS.map((tab) => (
            <button key={tab.id} type="button" onClick={() => setMobileTab(tab.id)} style={{
              flex: 1, padding: "12px 4px", border: "none", background: "transparent",
              borderBottom: mobileTab === tab.id ? "2px solid #d97706" : "2px solid transparent",
              color: mobileTab === tab.id ? "#d97706" : "#4b4b54",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ── LEFT: thumbnail grid ── */}
      <div style={{ width: isMobile ? undefined : 210, minWidth: isMobile ? undefined : 210, ...panelStyle("library"), background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div className="panel-header">
          <span className="label-upper">Library</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#4ade80", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {liveCount}/{images.length} live
          </span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {images.length === 0 && (
            <p style={{ fontSize: 11, color: "#3a3a42", padding: "12px 6px", textAlign: "center" }}>
              No photos yet.
            </p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {images.map((img) => {
              const isSelected = !isNew && selectedId === img.id;
              return (
                <div
                  key={img.id}
                  onClick={() => selectImage(img)}
                  style={{ position: "relative", aspectRatio: "1", borderRadius: 7, overflow: "hidden", cursor: "pointer", border: isSelected ? "2px solid #d97706" : "2px solid transparent", transition: "border-color 0.12s" }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: img.isActive ? 1 : 0.4 }}
                  />
                  {/* status dot */}
                  <span style={{ position: "absolute", top: 5, left: 5, width: 6, height: 6, borderRadius: "50%", background: img.isActive ? "#4ade80" : "#2e2e35", boxShadow: "0 0 0 1.5px rgba(0,0,0,0.5)" }} />
                  {!img.isActive && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)" }}>
                      <span style={{ fontSize: 8, fontWeight: 700, color: "#4b4b54", letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(0,0,0,0.6)", padding: "2px 5px", borderRadius: 3 }}>Hidden</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: "10px 8px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            type="button"
            onClick={openNew}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", borderRadius: 7, background: isNew ? "rgba(217,119,6,0.1)" : "rgba(255,255,255,0.028)", border: isNew ? "1px solid rgba(217,119,6,0.22)" : "1px solid rgba(255,255,255,0.07)", cursor: "pointer", fontSize: 11, fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            <PlusIcon /> Upload Photo
          </button>
        </div>
      </div>

      {/* ── CENTER: editor ── */}
      <div style={{ flex: 1, minWidth: isMobile ? undefined : 0, ...panelStyle("edit"), background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div className="panel-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: draft.isActive ? "#4ade80" : "#2e2e35" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e0d8" }}>
              {isNew ? "New Photo" : (draft.alt || "Untitled Photo")}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            style={saved ? {
              display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 6,
              fontSize: 11, fontWeight: 700, background: "rgba(74,222,128,0.08)", color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.2)", cursor: "default",
            } : {
              display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 7,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              cursor: "pointer", border: "none", background: "#d97706", color: "#fff",
            }}
          >
            {saved ? <><CheckIcon /> Saved</> : isPending ? "Saving…" : isNew ? "Upload" : "Save Changes"}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Photo preview / upload zone */}
          <div>
            <span className="label-upper" style={{ display: "block", marginBottom: 8 }}>Photo</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {displaySrc ? (
              <div style={{ position: "relative", borderRadius: 9, overflow: "hidden", marginBottom: 8 }}>
                <img
                  src={displaySrc}
                  alt={draft.alt || "Preview"}
                  style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block" }}
                />
                {photoFile && (
                  <div style={{ position: "absolute", top: 8, left: 10, fontSize: 9, fontWeight: 700, color: "#d97706", background: "rgba(0,0,0,0.65)", padding: "2px 8px", borderRadius: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    New file selected
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ position: "absolute", bottom: 8, right: 10, padding: "5px 12px", borderRadius: 6, background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e0d8", fontSize: 10, fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  Replace
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ width: "100%", padding: "32px 20px", borderRadius: 9, border: "1px dashed rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.018)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 8 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(217,119,6,0.3)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
              >
                <UploadIcon />
                <span style={{ fontSize: 12, color: "#5a5a64" }}>Click to upload a photo</span>
                <span style={{ fontSize: 10, color: "#3a3a42" }}>PNG, JPG, WEBP · max 5MB</span>
              </button>
            )}
            {/* URL fallback */}
            <div style={{ marginTop: 4 }}>
              <span style={{ fontSize: 9, color: "#3a3a42", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>Or paste a URL</span>
              <input
                value={draft.src}
                onChange={(e) => {
                  setDraft((p) => ({ ...p, src: e.target.value }));
                  if (e.target.value) { setPhotoFile(null); setPreviewUrl(null); }
                }}
                className="ctrl-input"
                style={{ marginTop: 5, fontSize: 11 }}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Description / Alt Text</span>
            <input
              value={draft.alt}
              onChange={(e) => setDraft((p) => ({ ...p, alt: e.target.value }))}
              className="ctrl-input"
              placeholder="e.g. Outdoor patio on a sunny afternoon"
            />
            <p style={{ fontSize: 10, color: "#3a3a42", marginTop: 4 }}>Shown as a caption and used for accessibility.</p>
          </div>

          {/* Visibility + sort */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              onClick={() => setDraft((p) => ({ ...p, isActive: !p.isActive }))}
              style={{
                padding: "5px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
                background: draft.isActive ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.04)",
                color: draft.isActive ? "#4ade80" : "#3a3a42",
                border: `1px solid ${draft.isActive ? "rgba(74,222,128,0.22)" : "rgba(255,255,255,0.08)"}`,
                transition: "all 0.13s",
              }}
            >
              {draft.isActive ? "Live" : "Hidden"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="label-upper">Order</span>
              <input
                value={draft.sortOrder}
                onChange={(e) => setDraft((p) => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))}
                type="number"
                min="0"
                style={{ width: 52, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 8px", color: "#c9c7c0", fontSize: 12, outline: "none", fontFamily: "inherit", textAlign: "center" }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
          {!isNew && draft.id ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", background: "rgba(248,113,113,0.06)", color: "#f87171", border: "1px solid rgba(248,113,113,0.14)", letterSpacing: "0.06em", textTransform: "uppercase" }}
            >
              <TrashIcon /> Delete
            </button>
          ) : <div />}
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            style={{ padding: "7px 18px", borderRadius: 7, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", border: "none", background: "#d97706", color: "#fff" }}
          >
            {isPending ? "Saving…" : isNew ? "Upload Photo" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ── RIGHT: stats (desktop only) ── */}
      {!isMobile && <div style={{ width: 200, minWidth: 200, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Counts */}
        <div style={{ background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
          <div className="panel-header">
            <span className="label-upper">Stats</span>
          </div>
          <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 11, color: "#4b4b54" }}>Total photos</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#e2e0d8", lineHeight: 1 }}>{images.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 11, color: "#4b4b54" }}>Live on site</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#4ade80", lineHeight: 1 }}>{liveCount}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 11, color: "#4b4b54" }}>Hidden</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#2e2e35", lineHeight: 1 }}>{images.length - liveCount}</span>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div style={{ flex: 1, background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
          <div className="panel-header">
            <span className="label-upper">How It Works</span>
          </div>
          <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { dot: "#d97706", text: "Click a photo in the grid to edit it." },
              { dot: "#4ade80", text: "Toggle Live/Hidden to control what guests see." },
              { dot: "#d97706", text: "Use Order to set the sequence in the gallery." },
              { dot: "#4ade80", text: "Upload a new file or paste a URL — either works." },
            ].map(({ dot, text }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: dot, flexShrink: 0, marginTop: 4 }} />
                <span style={{ fontSize: 11, color: "#4b4b54", lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  );
}
