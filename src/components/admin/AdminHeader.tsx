"use client";

import Link from "next/link";
import { signOutAction } from "@/app/admin/auth-actions";
import { AdminThemeToggle } from "@/components/admin/AdminThemeToggle";

export function AdminHeader({
  eyebrow = "Overview",
  title,
  description: _description,
  previewHref = "/preview",
  liveHref,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  previewHref?: string;
  liveHref?: string;
}) {
  return (
    <header
      style={{
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        background: "var(--admin-chrome)",
        borderBottom: "1px solid var(--admin-chrome-border)",
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
            color: "var(--admin-text-muted)",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Admin
        </span>

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
            color: "var(--admin-text-dim)",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {eyebrow}
        </span>

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
            color: "var(--admin-text)",
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
            background: "var(--admin-panel-bg)",
            border: "1px solid var(--admin-panel-border)",
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

        {/* View Live Site */}
        {liveHref && (
          <a
            href={liveHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              borderRadius: 6,
              background: "rgba(74,222,128,0.06)",
              border: "1px solid rgba(74,222,128,0.16)",
              color: "#4ade80",
              textDecoration: "none",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            View Live
          </a>
        )}

        {/* Theme toggle */}
        <AdminThemeToggle />

        {/* Overview */}
        <Link
          href="/admin"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 12px",
            borderRadius: 6,
            background: "var(--admin-panel-bg)",
            border: "1px solid var(--admin-panel-border)",
            color: "var(--admin-ghost-text)",
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

        {/* Sign Out */}
        <form action={signOutAction}>
          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "5px 12px",
              borderRadius: 6,
              background: "transparent",
              border: "1px solid var(--admin-chrome-border)",
              color: "var(--admin-text-dim)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </form>
      </div>
    </header>
  );
}
