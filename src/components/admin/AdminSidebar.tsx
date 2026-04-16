"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clock,
  ForkKnife,
  Gear,
  House,
  ImageSquare,
  Palette,
  Sparkle,
  Storefront,
  Phone,
} from "@phosphor-icons/react";

const NAV = [
  { href: "/admin",          Icon: House,       label: "Overview"  },
  { href: "/admin/branding", Icon: Palette,     label: "Branding"  },
  { href: "/admin/homepage", Icon: Storefront,  label: "Homepage"  },
  { href: "/admin/menu",     Icon: ForkKnife,   label: "Menu"      },
  { href: "/admin/specials", Icon: Sparkle,     label: "Specials"  },
  { href: "/admin/hours",    Icon: Clock,       label: "Hours"     },
  { href: "/admin/photos",   Icon: ImageSquare, label: "Photos"    },
  { href: "/admin/contact",  Icon: Phone,       label: "Contact"   },
] as const;

export function AdminSidebar({
  brandName,
  items: _items,
  persistenceEnabled: _pe,
}: {
  brandName: string;
  items?: unknown;
  persistenceEnabled?: boolean;
}) {
  const pathname = usePathname() ?? "";
  const [expanded, setExpanded] = useState(false);
  const W = expanded ? 204 : 56;

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const initials = brandName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        width: W,
        minWidth: W,
        maxWidth: W,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0d0d10",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        transition: "width 0.2s cubic-bezier(0.4,0,0.2,1), min-width 0.2s cubic-bezier(0.4,0,0.2,1)",
        zIndex: 50,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* ── Brand header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 10px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          minHeight: 64,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            minWidth: 36,
            borderRadius: 9,
            background: "rgba(217,119,6,0.12)",
            border: "1px solid rgba(217,119,6,0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Georgia, serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#d97706",
            letterSpacing: "0.02em",
          }}
        >
          {initials}
        </div>

        {expanded && (
          <div style={{ overflow: "hidden" }} className="animate-fade-in">
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#e2e0d8",
                whiteSpace: "nowrap",
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              {brandName}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
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
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#4ade80",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Live
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Nav ── */}
      <nav
        style={{
          flex: 1,
          padding: "8px 6px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {NAV.map(({ href, Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 8,
                border: active
                  ? "1px solid rgba(217,119,6,0.2)"
                  : "1px solid transparent",
                background: active ? "rgba(217,119,6,0.1)" : "transparent",
                textDecoration: "none",
                position: "relative",
                overflow: "hidden",
                transition: "background 0.12s, border-color 0.12s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.038)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.07)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                }
              }}
            >
              {active && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 2,
                    height: "55%",
                    background: "#d97706",
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
              <Icon
                size={15}
                weight={active ? "bold" : "regular"}
                style={{
                  color: active ? "#d97706" : "#55555e",
                  flexShrink: 0,
                  transition: "color 0.12s",
                }}
              />
              {expanded && (
                <span
                  className="animate-slide-in"
                  style={{
                    fontSize: 12.5,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#e2e0d8" : "#7a7a84",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom: Settings ── */}
      <div
        style={{
          padding: "8px 6px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Link
          href="/admin/settings"
          title="Settings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 10px",
            borderRadius: 8,
            border: isActive("/admin/settings")
              ? "1px solid rgba(217,119,6,0.2)"
              : "1px solid transparent",
            background: isActive("/admin/settings")
              ? "rgba(217,119,6,0.1)"
              : "transparent",
            textDecoration: "none",
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) => {
            if (!isActive("/admin/settings"))
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.038)";
          }}
          onMouseLeave={(e) => {
            if (!isActive("/admin/settings"))
              (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <Gear
            size={15}
            weight={isActive("/admin/settings") ? "bold" : "regular"}
            style={{
              color: isActive("/admin/settings") ? "#d97706" : "#55555e",
              flexShrink: 0,
            }}
          />
          {expanded && (
            <span
              className="animate-slide-in"
              style={{ fontSize: 12.5, color: "#7a7a84", whiteSpace: "nowrap" }}
            >
              Settings
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
}
