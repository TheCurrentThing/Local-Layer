"use client";

import { useState, useTransition } from "react";
import {
  saveCategoryAction,
  saveMenuItemAction,
  deleteMenuItemAction,
} from "@/app/admin/actions";
import type { MenuCategory, MenuItem } from "@/types/menu";

/* ─── icon SVGs ──────────────────────────────────────────────── */

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path
      d="M6.5 1.5l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4L3.9 9.7l.5-3L2.2 4.6l3-.4z"
      stroke="#d97706"
      strokeWidth="1.1"
      strokeLinejoin="round"
      fill={filled ? "#d97706" : "none"}
    />
  </svg>
);

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M8.5 1.5a1.2 1.2 0 0 1 1.7 1.7L3.5 9.9l-2.3.6.6-2.3z"
      stroke="#3a3a42"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EditIconActive = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M8.5 1.5a1.2 1.2 0 0 1 1.7 1.7L3.5 9.9l-2.3.6.6-2.3z"
      stroke="#d97706"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 4h9M5 4V2.5h3V4M5.5 6v4M7.5 6v4M3 4l.7 6.5a1 1 0 0 0 1 .9h3.6a1 1 0 0 0 1-.9L10 4"
      stroke="#f87171" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M5.5 2v7M2 5.5h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M3 3l7 7M10 3l-7 7" stroke="#5a5a64" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/* ─── types ──────────────────────────────────────────────────── */

type DraftItem = {
  id?: string;
  name: string;
  price: string;
  description: string;
  isFeatured: boolean;
  isActive: boolean;
  isSoldOut: boolean;
};

const emptyDraft = (): DraftItem => ({
  name: "",
  price: "",
  description: "",
  isFeatured: false,
  isActive: true,
  isSoldOut: false,
});

/* ─── component ──────────────────────────────────────────────── */

export function MenuEditorClient({
  categories,
}: {
  categories: MenuCategory[];
}) {
  const [activeCatId, setActiveCatId] = useState<string>(
    categories[0]?.id ?? ""
  );
  const [draft, setDraft] = useState<DraftItem | null>(null);
  const [showNewCat, setShowNewCat] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const activeCat = categories.find((c) => c.id === activeCatId) ?? categories[0] ?? null;

  function openItem(item: MenuItem) {
    setDraft({
      id: item.id,
      name: item.name,
      price: item.price.toFixed(2),
      description: item.description,
      isFeatured: item.isFeatured,
      isActive: item.isActive,
      isSoldOut: item.isSoldOut,
    });
  }

  function openNew() {
    setDraft(emptyDraft());
  }

  function close() {
    setDraft(null);
  }

  function handleSave() {
    if (!draft || !activeCat) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("redirect_to", "/admin/menu");
      fd.set("category_id", activeCat.id);
      fd.set("name", draft.name);
      fd.set("description", draft.description);
      fd.set("price", draft.price);
      if (draft.isActive) fd.set("is_active", "on");
      if (draft.isSoldOut) fd.set("is_sold_out", "on");
      if (draft.isFeatured) fd.set("is_featured", "on");
      if (draft.id) fd.set("menu_item_id", draft.id);
      await saveMenuItemAction(fd);
    });
  }

  function handleDelete() {
    if (!draft?.id || !activeCat) return;
    startDeleteTransition(async () => {
      const fd = new FormData();
      fd.set("redirect_to", "/admin/menu");
      fd.set("category_id", activeCat.id);
      fd.set("menu_item_id", draft.id!);
      await deleteMenuItemAction(fd);
    });
    setDraft(null);
  }

  function handleAddCategory(formData: FormData) {
    startTransition(async () => {
      formData.set("redirect_to", "/admin/menu");
      await saveCategoryAction(formData);
    });
    setShowNewCat(false);
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        height: "100%",
        display: "flex",
        overflow: "hidden",
        padding: "2px",
        gap: "12px",
      }}
    >
      {/* ── LEFT: Categories ── */}
      <div
        style={{
          width: 172,
          minWidth: 172,
          background: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="panel-header">
          <span className="label-upper">Categories</span>
        </div>

        <div style={{ flex: 1, padding: "6px", overflowY: "auto" }}>
          {categories.map((cat) => {
            const active = cat.id === activeCatId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCatId(cat.id);
                  setDraft(null);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 10px",
                  borderRadius: 8,
                  marginBottom: 3,
                  background: active ? "rgba(217,119,6,0.1)" : "transparent",
                  border: active
                    ? "1px solid rgba(217,119,6,0.2)"
                    : "1px solid transparent",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#e2e0d8" : "#7a7a84",
                  }}
                >
                  {cat.name}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    padding: "1px 6px",
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.045)",
                    color: "#4b4b54",
                  }}
                >
                  {cat.items.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* New category */}
        <div style={{ padding: "8px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {showNewCat ? (
            <form action={handleAddCategory} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <input
                name="name"
                placeholder="Category name"
                required
                autoFocus
                className="ctrl-input"
                style={{ fontSize: 11 }}
              />
              <input type="hidden" name="is_active" value="on" />
              <div style={{ display: "flex", gap: 5 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 10, padding: "5px 8px" }}>
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewCat(false)}
                  className="btn-ghost"
                  style={{ fontSize: 10, padding: "5px 8px" }}
                >
                  ✕
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewCat(true)}
              className="btn-ghost"
              style={{ width: "100%", justifyContent: "center", fontSize: 11 }}
            >
              <PlusIcon />
              New Category
            </button>
          )}
        </div>
      </div>

      {/* ── CENTER: Item table ── */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          background: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Table header */}
        <div className="panel-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e0d8" }}>
              {activeCat?.name ?? "No category"}
            </span>
            {activeCat && (
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 7px",
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.045)",
                  color: "#5a5a64",
                }}
              >
                {activeCat.items.length} items
              </span>
            )}
          </div>
          {activeCat && (
            <button
              type="button"
              onClick={openNew}
              className="btn-ghost"
              style={{ fontSize: 11, padding: "5px 10px" }}
            >
              <PlusIcon />
              Add Item
            </button>
          )}
        </div>

        {/* Column headers */}
        {activeCat && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 76px 52px 60px",
              padding: "6px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {(["Item", "Price", "★", ""] as const).map((h) => (
              <span key={h} className="label-upper">
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Rows */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {!activeCat ? (
            <div style={{ padding: "24px 16px", fontSize: 13, color: "#4b4b54" }}>
              Add a category to get started.
            </div>
          ) : activeCat.items.length === 0 ? (
            <div style={{ padding: "24px 16px", fontSize: 13, color: "#4b4b54" }}>
              No items yet. Use &quot;Add Item&quot; above.
            </div>
          ) : (
            activeCat.items.map((item) => {
              const isSelected = draft?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => openItem(item)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 76px 52px 60px",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.038)",
                    cursor: "pointer",
                    background: isSelected
                      ? "rgba(217,119,6,0.06)"
                      : "transparent",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.025)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 12.5,
                        fontWeight: 500,
                        color: "#c9c7c0",
                        margin: 0,
                      }}
                    >
                      {item.name}
                    </p>
                    <p style={{ fontSize: 11, color: "#3e3e46", marginTop: 2 }}>
                      {item.description}
                    </p>
                  </div>
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#d97706" }}
                  >
                    ${item.price.toFixed(2)}
                  </span>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <StarIcon filled={item.isFeatured} />
                  </span>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    {isSelected ? <EditIconActive /> : <EditIcon />}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── RIGHT: Item editor ── */}
      <div
        style={{
          width: 256,
          minWidth: 256,
          background: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {draft ? (
          <>
            <div className="panel-header">
              <span className="label-upper">
                {draft.id ? "Edit Item" : "New Item"}
              </span>
              <button
                type="button"
                onClick={close}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 2,
                  display: "flex",
                }}
              >
                <CloseIcon />
              </button>
            </div>

            <div
              style={{
                flex: 1,
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: 13,
                overflowY: "auto",
              }}
            >
              {/* Name */}
              <div>
                <span
                  className="label-upper"
                  style={{ display: "block", marginBottom: 6 }}
                >
                  Name
                </span>
                <input
                  value={draft.name}
                  onChange={(e) =>
                    setDraft((p) => p && { ...p, name: e.target.value })
                  }
                  className="ctrl-input"
                  placeholder="Item name"
                />
              </div>

              {/* Price */}
              <div>
                <span
                  className="label-upper"
                  style={{ display: "block", marginBottom: 6 }}
                >
                  Price ($)
                </span>
                <input
                  value={draft.price}
                  type="number"
                  step="0.01"
                  min="0"
                  onChange={(e) =>
                    setDraft((p) => p && { ...p, price: e.target.value })
                  }
                  className="ctrl-input"
                  placeholder="0.00"
                />
              </div>

              {/* Description */}
              <div>
                <span
                  className="label-upper"
                  style={{ display: "block", marginBottom: 6 }}
                >
                  Description
                </span>
                <textarea
                  value={draft.description}
                  onChange={(e) =>
                    setDraft((p) => p && { ...p, description: e.target.value })
                  }
                  rows={3}
                  className="ctrl-input"
                  style={{ resize: "none" }}
                  placeholder="Short description"
                />
              </div>

              {/* Featured toggle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span className="label-upper">Featured</span>
                <button
                  type="button"
                  onClick={() =>
                    setDraft((p) => p && { ...p, isFeatured: !p.isFeatured })
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 10px",
                    borderRadius: 7,
                    background: draft.isFeatured
                      ? "rgba(217,119,6,0.1)"
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${draft.isFeatured ? "rgba(217,119,6,0.25)" : "rgba(255,255,255,0.07)"}`,
                    color: draft.isFeatured ? "#d97706" : "#5a5a64",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    transition: "background 0.12s",
                  }}
                >
                  <StarIcon filled={draft.isFeatured} />
                  {draft.isFeatured ? "Featured" : "Not featured"}
                </button>
              </div>

              {/* Active / Sold out toggles */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() =>
                    setDraft((p) => p && { ...p, isActive: !p.isActive })
                  }
                  style={{
                    padding: "5px 10px",
                    borderRadius: 7,
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: draft.isActive
                      ? "rgba(74,222,128,0.08)"
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${draft.isActive ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.07)"}`,
                    color: draft.isActive ? "#4ade80" : "#5a5a64",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  {draft.isActive ? "Live" : "Hidden"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDraft((p) => p && { ...p, isSoldOut: !p.isSoldOut })
                  }
                  style={{
                    padding: "5px 10px",
                    borderRadius: 7,
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: draft.isSoldOut
                      ? "rgba(251,191,36,0.08)"
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${draft.isSoldOut ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.07)"}`,
                    color: draft.isSoldOut ? "#fbbf24" : "#5a5a64",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  {draft.isSoldOut ? "Sold Out" : "In Stock"}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                gap: 8,
                padding: "12px 14px",
                borderTop: "1px solid rgba(255,255,255,0.055)",
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="btn-primary"
                style={{ flex: 1, justifyContent: "center" }}
              >
                {isPending ? "Saving…" : "Save"}
              </button>
              {draft.id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn-danger"
                  style={{ padding: "7px 10px" }}
                >
                  <TrashIcon />
                </button>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <EditIcon />
            </div>
            <p style={{ fontSize: 12, color: "#3a3a42", lineHeight: 1.5 }}>
              Select an item
              <br />
              to edit its details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
