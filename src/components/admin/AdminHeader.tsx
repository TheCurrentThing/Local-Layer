"use client";

import Link from "next/link";

export function AdminHeader({
  eyebrow = "Overview",
  title,
  description: _description,
  previewHref = "/",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  previewHref?: string;
}) {
  return (
    <header
      style={{
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        background: "#0d0d10",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0,
        zIndex: 30,
        gap: 16,
      }}
    >
      {/* ── Left: breadcrumb path ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "#52525c",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Admin
        </span>

        {/* chevron */}
        <svg
          width="11"
          height="11"
          viewBox="0 0 11 11"
          fill="none"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <path
            d="M3.5 3l3.5 2.5-3.5 2.5"
            stroke="#38383f"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span
          style={{
            fontSize: 10,
            color: "#6b6b75",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {eyebrow}
        </span>

        {/* chevron */}
        <svg
          width="11"
          height="11"
          viewBox="0 0 11 11"
          fill="none"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <path
            d="M3.5 3l3.5 2.5-3.5 2.5"
            stroke="#2a2a30"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#c9c7c0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </span>
      </div>

      {/* ── Right: status + actions ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        {/* Live pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: 6,
            background: "rgba(255,255,255,0.028)",
            border: "1px solid rgba(255,255,255,0.055)",
          }}
        >
          <span
            className="animate-pulse-dot"
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#4ade80",
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: "#4ade80",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Live
          </span>
        </div>

        {/* Overview */}
        <Link
          href="/admin"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 12px",
            borderRadius: 6,
            background: "rgba(255,255,255,0.028)",
            border: "1px solid rgba(255,255,255,0.055)",
            color: "#8a8894",
            textDecoration: "none",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Overview
        </Link>

        {/* Preview */}
        <a
          href={previewHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 12px",
            borderRadius: 6,
            background: "rgba(217,119,6,0.08)",
            border: "1px solid rgba(217,119,6,0.18)",
            color: "#d97706",
            textDecoration: "none",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(217,119,6,0.15)";
            el.style.borderColor = "rgba(217,119,6,0.32)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(217,119,6,0.08)";
            el.style.borderColor = "rgba(217,119,6,0.18)";
          }}
        >
          Preview
        </a>
      </div>
    </header>
  );
}
