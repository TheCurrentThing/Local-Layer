"use client";

import { useState, useTransition } from "react";
import {
  saveSpecialAction,
  deleteSpecialAction,
  saveAnnouncementAction,
} from "@/app/admin/actions";

/* ─── icons ──────────────────────────────────────────────── */
const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M5.5 1.5l1.1 2.3 2.5.35-1.8 1.75.42 2.5L5.5 7.2 3.28 8.4l.42-2.5L2 4.15l2.5-.35z" stroke="#d97706" strokeWidth="1.1" strokeLinejoin="round" />
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
const MegaphoneIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 4.5h1.5L8 2.5v7L3.5 7.5H2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z" stroke="#d97706" strokeWidth="1.1" strokeLinejoin="round" />
    <path d="M3.5 7.5v2" stroke="#d97706" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M10 4.5a2 2 0 0 1 0 3" stroke="#d97706" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

/* ─── types ──────────────────────────────────────────────── */
type Special = {
  id: string;
  title: string;
  description: string;
  price: number | null;
  label: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

type DraftSpecial = {
  id?: string;
  title: string;
  description: string;
  price: string;
  label: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

const BLANK_DRAFT: DraftSpecial = {
  title: "", description: "", price: "", label: "",
  isActive: true, isFeatured: false, sortOrder: 0,
};

function toDraft(s: Special): DraftSpecial {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    price: s.price === null ? "" : s.price.toFixed(2),
    label: s.label,
    isActive: s.isActive,
    isFeatured: s.isFeatured,
    sortOrder: s.sortOrder,
  };
}

/* ─── PillToggle ─────────────────────────────────────────── */
function PillToggle({
  active,
  labelOn,
  labelOff,
  color = "green",
  onClick,
}: {
  active: boolean;
  labelOn: string;
  labelOff: string;
  color?: "green" | "amber";
  onClick: () => void;
}) {
  const on  = color === "green"
    ? { bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.22)",  text: "#4ade80" }
    : { bg: "rgba(217,119,6,0.12)", border: "rgba(217,119,6,0.28)",   text: "#d97706" };
  const off = { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)", text: "#3a3a42" };
  const s   = active ? on : off;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700,
        letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
        background: s.bg, color: s.text, border: `1px solid ${s.border}`, transition: "all 0.13s" }}
    >
      {active ? labelOn : labelOff}
    </button>
  );
}

/* ─── component ──────────────────────────────────────────── */
export function SpecialsEditorClient({
  specials: initSpecials,
  announcement: initAnnouncement,
}: {
  specials: Special[];
  announcement: { title: string; body: string; isActive: boolean; sortOrder: number };
}) {
  const [specials, setSpecials] = useState(initSpecials);
  const [draft, setDraft] = useState<DraftSpecial>(
    initSpecials.length > 0 ? toDraft(initSpecials[0]) : BLANK_DRAFT
  );
  const [isNew, setIsNew] = useState(initSpecials.length === 0);
  const [announcement, setAnnouncement] = useState(initAnnouncement);
  const [savedSpecial, setSavedSpecial] = useState(false);
  const [savedAnnouncement, setSavedAnnouncement] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isAnnouncementPending, startAnnouncementTransition] = useTransition();

  // The live featured special for the preview panel
  const liveSpecial = specials.find((s) => s.isFeatured && s.isActive)
    ?? specials.find((s) => s.isActive)
    ?? null;

  function selectSpecial(s: Special) {
    setDraft(toDraft(s));
    setIsNew(false);
  }

  function openNew() {
    setDraft({ ...BLANK_DRAFT, sortOrder: specials.length });
    setIsNew(true);
  }

  function handleSaveSpecial() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("redirect_to", "/admin/specials");
      if (draft.id) fd.set("special_id", draft.id);
      fd.set("title", draft.title);
      fd.set("description", draft.description);
      if (draft.price) fd.set("price", draft.price);
      fd.set("label", draft.label);
      if (draft.isActive) fd.set("is_active", "on");
      if (draft.isFeatured) fd.set("is_featured", "on");
      fd.set("sort_order", String(draft.sortOrder));
      await saveSpecialAction(fd);

      // Optimistically update local list
      if (draft.id) {
        setSpecials((prev) =>
          prev.map((s) =>
            s.id === draft.id
              ? { ...s, title: draft.title, description: draft.description, price: draft.price ? parseFloat(draft.price) : null, label: draft.label, isActive: draft.isActive, isFeatured: draft.isFeatured, sortOrder: draft.sortOrder }
              : s
          )
        );
      }
      setSavedSpecial(true);
      setTimeout(() => setSavedSpecial(false), 2500);
      if (isNew) setIsNew(false);
    });
  }

  function handleDeleteSpecial() {
    if (!draft.id) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("redirect_to", "/admin/specials");
      fd.set("special_id", draft.id!);
      await deleteSpecialAction(fd);
      const remaining = specials.filter((s) => s.id !== draft.id);
      setSpecials(remaining);
      if (remaining.length > 0) {
        setDraft(toDraft(remaining[0]));
        setIsNew(false);
      } else {
        setDraft(BLANK_DRAFT);
        setIsNew(true);
      }
    });
  }

  function handleSaveAnnouncement() {
    startAnnouncementTransition(async () => {
      const fd = new FormData();
      fd.set("redirect_to", "/admin/specials");
      fd.set("announcement_title", announcement.title);
      fd.set("announcement_body", announcement.body);
      if (announcement.isActive) fd.set("announcement_is_active", "on");
      fd.set("sort_order", String(announcement.sortOrder));
      await saveAnnouncementAction(fd);
      setSavedAnnouncement(true);
      setTimeout(() => setSavedAnnouncement(false), 2500);
    });
  }

  return (
    <div
      className="animate-fade-in"
      style={{ height: "100%", display: "flex", overflow: "hidden", padding: "2px", gap: "12px" }}
    >
      {/* ── LEFT: specials list ── */}
      <div style={{ width: 196, minWidth: 196, background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div className="panel-header">
          <span className="label-upper">Specials</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#4ade80", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {specials.filter((s) => s.isActive).length}/{specials.length} live
          </span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "6px" }}>
          {specials.length === 0 && (
            <p style={{ fontSize: 11, color: "#3a3a42", padding: "10px 8px", textAlign: "center" }}>
              No specials yet.
            </p>
          )}
          {specials.map((s) => {
            const isSelected = !isNew && draft.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => selectSpecial(s)}
                style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 8, marginBottom: 2, background: isSelected ? "rgba(217,119,6,0.09)" : "transparent", border: isSelected ? "1px solid rgba(217,119,6,0.2)" : "1px solid transparent", cursor: "pointer", transition: "background 0.12s" }}
                onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: s.isActive ? "#4ade80" : "#2e2e35", flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 12, fontWeight: isSelected ? 600 : 400, color: isSelected ? "#e2e0d8" : "#7a7a84", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.title}
                </span>
                {s.isFeatured && <StarIcon />}
              </div>
            );
          })}
        </div>
        <div style={{ padding: "10px 8px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            type="button"
            onClick={openNew}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", borderRadius: 7, background: isNew ? "rgba(217,119,6,0.1)" : "rgba(255,255,255,0.028)", border: isNew ? "1px solid rgba(217,119,6,0.22)" : "1px solid rgba(255,255,255,0.07)", cursor: "pointer", fontSize: 11, fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            <PlusIcon /> New Special
          </button>
        </div>
      </div>

      {/* ── CENTER: editor ── */}
      <div style={{ flex: 1, minWidth: 0, background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div className="panel-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: draft.isActive ? "#4ade80" : "#2e2e35" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e0d8" }}>
              {isNew ? "New Special" : (draft.title || "Untitled")}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSaveSpecial}
            disabled={isPending}
            style={savedSpecial ? {
              display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 6,
              fontSize: 11, fontWeight: 700, background: "rgba(74,222,128,0.08)", color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.2)", cursor: "default",
            } : {
              display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 7,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              cursor: "pointer", border: "none", background: "#d97706", color: "#fff",
            }}
          >
            {savedSpecial ? <><CheckIcon /> Saved</> : isPending ? "Saving…" : isNew ? "Add Special" : "Save Changes"}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Special Name</span>
            <input
              value={draft.title}
              onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
              className="ctrl-input"
              placeholder="e.g. Friday Fish Fry"
            />
          </div>

          <div>
            <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Description</span>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              className="ctrl-input"
              style={{ resize: "none" }}
              placeholder="Describe the special — what it includes, any limits, etc."
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12 }}>
            <div>
              <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Price</span>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#5a5a64", pointerEvents: "none" }}>$</span>
                <input
                  value={draft.price}
                  onChange={(e) => setDraft((p) => ({ ...p, price: e.target.value }))}
                  className="ctrl-input"
                  style={{ paddingLeft: 22 }}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            <div>
              <span className="label-upper" style={{ display: "block", marginBottom: 7 }}>Label</span>
              <input
                value={draft.label}
                onChange={(e) => setDraft((p) => ({ ...p, label: e.target.value }))}
                className="ctrl-input"
                placeholder="e.g. Every Friday · All Day"
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <PillToggle
              active={draft.isActive}
              labelOn="Live"
              labelOff="Hidden"
              color="green"
              onClick={() => setDraft((p) => ({ ...p, isActive: !p.isActive }))}
            />
            <PillToggle
              active={draft.isFeatured}
              labelOn="Featured"
              labelOff="Not Featured"
              color="amber"
              onClick={() => setDraft((p) => ({ ...p, isFeatured: !p.isFeatured }))}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
          {!isNew && draft.id ? (
            <button
              type="button"
              onClick={handleDeleteSpecial}
              disabled={isPending}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", background: "rgba(248,113,113,0.06)", color: "#f87171", border: "1px solid rgba(248,113,113,0.14)", letterSpacing: "0.06em", textTransform: "uppercase" }}
            >
              <TrashIcon /> Delete
            </button>
          ) : <div />}
          <button
            type="button"
            onClick={handleSaveSpecial}
            disabled={isPending}
            style={{ padding: "7px 18px", borderRadius: 7, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", border: "none", background: "#d97706", color: "#fff" }}
          >
            {isPending ? "Saving…" : isNew ? "Add Special" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ── RIGHT: live preview + announcement ── */}
      <div style={{ width: 236, minWidth: 236, display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Live special preview */}
        <div style={{ background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
          <div className="panel-header">
            <span className="label-upper">Live Special</span>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: liveSpecial ? "#4ade80" : "#2e2e35" }} />
          </div>
          <div style={{ padding: "14px" }}>
            {liveSpecial ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e0d8", lineHeight: 1.3 }}>{liveSpecial.title}</span>
                  {liveSpecial.price !== null && (
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#d97706", flexShrink: 0 }}>
                      ${liveSpecial.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 11, color: "#7a7a84", margin: 0, lineHeight: 1.5 }}>{liveSpecial.description}</p>
                <span style={{ fontSize: 10, color: "#4b4b54", fontStyle: "italic" }}>{liveSpecial.label}</span>
              </div>
            ) : (
              <p style={{ fontSize: 11, color: "#3a3a42", margin: 0 }}>
                No active special. Mark a special Live to feature it here.
              </p>
            )}
          </div>
        </div>

        {/* Announcement bar */}
        <div style={{ flex: 1, background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div className="panel-header">
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <MegaphoneIcon />
              <span className="label-upper">Announcement Bar</span>
            </div>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: announcement.isActive ? "#4ade80" : "#2e2e35" }} />
          </div>
          <div style={{ flex: 1, padding: "14px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <span className="label-upper" style={{ display: "block", marginBottom: 6 }}>Label</span>
              <input
                value={announcement.title}
                onChange={(e) => setAnnouncement((p) => ({ ...p, title: e.target.value }))}
                className="ctrl-input"
                placeholder="e.g. Friday Special"
                style={{ fontSize: 12 }}
              />
            </div>
            <div>
              <span className="label-upper" style={{ display: "block", marginBottom: 6 }}>Message</span>
              <textarea
                value={announcement.body}
                onChange={(e) => setAnnouncement((p) => ({ ...p, body: e.target.value }))}
                rows={3}
                className="ctrl-input"
                style={{ resize: "none", fontSize: 12 }}
                placeholder="e.g. Fish fry every Friday, all day"
              />
            </div>
            <PillToggle
              active={announcement.isActive}
              labelOn="Broadcasting"
              labelOff="Hidden"
              color="green"
              onClick={() => setAnnouncement((p) => ({ ...p, isActive: !p.isActive }))}
            />
          </div>
          <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleSaveAnnouncement}
              disabled={isAnnouncementPending}
              style={savedAnnouncement ? {
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                padding: "7px", borderRadius: 7, fontSize: 11, fontWeight: 700,
                background: "rgba(74,222,128,0.08)", color: "#4ade80",
                border: "1px solid rgba(74,222,128,0.2)", cursor: "default",
              } : {
                width: "100%", padding: "7px", borderRadius: 7, fontSize: 11, fontWeight: 700,
                letterSpacing: "0.08em", textTransform: "uppercase" as const,
                cursor: "pointer", border: "none", background: "#d97706", color: "#fff",
              }}
            >
              {savedAnnouncement ? <><CheckIcon /> Saved</> : isAnnouncementPending ? "Saving…" : "Save Announcement"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
