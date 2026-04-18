"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clock,
  CreditCard,
  ForkKnife,
  Gear,
  Globe,
  GoogleLogo,
  House,
  ImageSquare,
  Palette,
  Question,
  RocketLaunch,
  Sparkle,
  Storefront,
  Phone,
  SignOut,
  User,
  UserCircle,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";
import { getKitModules } from "@/lib/kit-config";
import { signOutAction } from "@/app/admin/auth-actions";
import type { KitType, KitModules } from "@/types/kit";
import type { PlanSlug, SubscriptionStatus } from "@/types/billing";

// ─── NAV DEFINITION ──────────────────────────────────────────────────────────

type NavItem = {
  href: string;
  Icon: PhosphorIcon;
  label: string;
  moduleKey?: keyof KitModules;
};

// Site management nav — kit-filtered
const NAV: NavItem[] = [
  { href: "/admin",          Icon: House,          label: "Overview"  },
  { href: "/admin/branding", Icon: Palette,        label: "Branding",  moduleKey: "branding"  },
  { href: "/admin/homepage", Icon: Storefront,     label: "Homepage",  moduleKey: "homepage"  },
  { href: "/admin/menu",     Icon: ForkKnife,      label: "Menu",      moduleKey: "menu"      },
  { href: "/admin/specials", Icon: Sparkle,        label: "Specials",  moduleKey: "specials"  },
  { href: "/admin/hours",    Icon: Clock,          label: "Hours",     moduleKey: "hours"     },
  { href: "/admin/photos",   Icon: ImageSquare,    label: "Photos",    moduleKey: "photos"    },
  { href: "/admin/contact",  Icon: Phone,          label: "Contact",   moduleKey: "contact"   },
  { href: "/admin/launch",   Icon: RocketLaunch,   label: "Launch",    moduleKey: "launch"    },
  { href: "/admin/google",   Icon: GoogleLogo,     label: "Google",    moduleKey: "google"    },
];

// Platform / account nav — always visible, not kit-filtered
const PLATFORM_NAV: NavItem[] = [
  { href: "/admin/domains",  Icon: Globe,          label: "Domains"   },
  { href: "/admin/billing",  Icon: CreditCard,     label: "Billing"   },
  { href: "/admin/account",  Icon: UserCircle,     label: "Account"   },
  { href: "/admin/help",     Icon: Question,       label: "Help"      },
];

function filterNav(items: NavItem[], modules: KitModules): NavItem[] {
  return items.filter(({ moduleKey }) => !moduleKey || modules[moduleKey] !== false);
}

// ─── PLAN BADGE ───────────────────────────────────────────────────────────────

function planBadgeStyle(planSlug: PlanSlug, status: SubscriptionStatus): React.CSSProperties {
  if (status === "past_due" || status === "incomplete") {
    return { color: "#f87171", background: "rgba(248,113,113,0.1)" };
  }
  if (status === "canceled") {
    return { color: "#6b7280", background: "rgba(107,114,128,0.08)" };
  }
  switch (planSlug) {
    case "trial":
      return { color: "#34d399", background: "rgba(52,211,153,0.1)" };
    case "starter":
      return { color: "var(--admin-text-muted)", background: "rgba(255,255,255,0.05)" };
    case "core":
      return { color: "#60a5fa", background: "rgba(96,165,250,0.1)" };
    case "pro":
      return { color: "#d97706", background: "rgba(217,119,6,0.1)" };
    case "enterprise":
      return { color: "#a78bfa", background: "rgba(167,139,250,0.1)" };
    default:
      return { color: "var(--admin-text-muted)", background: "rgba(255,255,255,0.05)" };
  }
}

function planBadgeLabel(planSlug: PlanSlug, status: SubscriptionStatus): string {
  if (status === "past_due") return "Past due";
  if (status === "canceled") return "Offline";
  if (status === "paused") return "Paused";
  switch (planSlug) {
    case "trial": return "Trial";
    case "starter": return "Starter";
    case "core": return "Core";
    case "pro": return "Pro";
    case "enterprise": return "Enterprise";
    default: return "Starter";
  }
}

// ─── SHARED LINK STYLE HELPERS ───────────────────────────────────────────────

function navLinkStyle(active: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 10px",
    borderRadius: 8,
    border: active ? "1px solid rgba(217,119,6,0.2)" : "1px solid transparent",
    background: active ? "rgba(217,119,6,0.1)" : "transparent",
    textDecoration: "none",
    position: "relative",
    overflow: "hidden",
    transition: "background 0.12s, border-color 0.12s",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box" as const,
  };
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export function AdminSidebar({
  brandName,
  kitType = "restaurant",
  userEmail,
  planSlug = "starter",
  planStatus = "active",
  items: _items,
  persistenceEnabled: _pe,
}: {
  brandName: string;
  kitType?: KitType;
  userEmail?: string | null;
  planSlug?: PlanSlug;
  planStatus?: SubscriptionStatus;
  items?: unknown;
  persistenceEnabled?: boolean;
}) {
  const pathname = usePathname() ?? "";
  const [expanded, setExpanded] = useState(false);
  const W = expanded ? 204 : 56;

  const modules = getKitModules(kitType);
  const visibleNav = filterNav(NAV, modules);
  const mobileNav = [
    ...visibleNav,
    { href: "/admin/settings", Icon: Gear, label: "Settings" },
  ];

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const initials = brandName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const userInitials = userEmail
    ? userEmail.split("@")[0].slice(0, 2).toUpperCase()
    : "?";

  const badgeStyle = planBadgeStyle(planSlug, planStatus);
  const badgeLabel = planBadgeLabel(planSlug, planStatus);

  return (
    <>
    <aside
      className="admin-sidebar"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        width: W,
        minWidth: W,
        maxWidth: W,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--admin-chrome)",
        borderRight: "1px solid var(--admin-chrome-border)",
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
          borderBottom: "1px solid var(--admin-chrome-border)",
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
                color: "var(--admin-text)",
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

      {/* ── Main nav (site management) ── */}
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
        {visibleNav.map(({ href, Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              style={navLinkStyle(active)}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.038)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
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
                  color: active ? "#d97706" : "var(--admin-text-muted)",
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
                    color: active ? "var(--admin-text)" : "var(--admin-text-muted)",
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

      {/* ── Platform nav (account management) ── */}
      <div
        style={{
          padding: "4px 6px",
          borderTop: "1px solid var(--admin-chrome-border)",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {expanded && (
          <p
            className="animate-fade-in"
            style={{
              margin: "4px 10px 2px",
              fontSize: 8,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--admin-text-muted)",
              opacity: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            Platform
          </p>
        )}
        {PLATFORM_NAV.map(({ href, Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              style={navLinkStyle(active)}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.038)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
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
                  color: active ? "#d97706" : "var(--admin-text-muted)",
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
                    color: active ? "var(--admin-text)" : "var(--admin-text-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* ── Settings ── */}
      <div
        style={{
          padding: "4px 6px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Link
          href="/admin/settings"
          title="Settings"
          style={navLinkStyle(isActive("/admin/settings"))}
          onMouseEnter={(e) => {
            if (!isActive("/admin/settings"))
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.038)";
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
              color: isActive("/admin/settings") ? "#d97706" : "var(--admin-text-muted)",
              flexShrink: 0,
            }}
          />
          {expanded && (
            <span
              className="animate-slide-in"
              style={{
                fontSize: 12.5,
                color: isActive("/admin/settings") ? "var(--admin-text)" : "var(--admin-text-muted)",
                fontWeight: isActive("/admin/settings") ? 600 : 400,
                whiteSpace: "nowrap",
              }}
            >
              Settings
            </span>
          )}
        </Link>
      </div>

      {/* ── Account footer ── */}
      <div
        style={{
          borderTop: "1px solid var(--admin-chrome-border)",
          padding: "10px 6px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {/* User identity + plan badge */}
        <Link
          href="/admin/account"
          title={userEmail ?? "Account"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px",
            overflow: "hidden",
            borderRadius: 8,
            textDecoration: "none",
            border: "1px solid transparent",
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 28,
              height: 28,
              minWidth: 28,
              borderRadius: 7,
              background: "rgba(148,163,184,0.12)",
              border: "1px solid rgba(148,163,184,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {userEmail ? (
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--admin-text-muted)", letterSpacing: "0.04em" }}>
                {userInitials}
              </span>
            ) : (
              <User size={13} style={{ color: "var(--admin-text-muted)" }} />
            )}
          </div>

          {expanded && (
            <div style={{ overflow: "hidden", flex: 1 }} className="animate-fade-in">
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--admin-text-muted)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 100,
                }}
              >
                {userEmail ?? "Account"}
              </p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: 2,
                  fontSize: 8,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  padding: "1px 5px",
                  borderRadius: 3,
                  ...badgeStyle,
                }}
              >
                {badgeLabel}
              </span>
            </div>
          )}
        </Link>

        {/* Sign out */}
        <form action={signOutAction} style={{ display: "contents" }}>
          <button
            type="submit"
            title="Sign out"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid transparent",
              background: "transparent",
              textDecoration: "none",
              cursor: "pointer",
              width: "100%",
              transition: "background 0.12s, border-color 0.12s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,113,113,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.borderColor = "transparent";
            }}
          >
            <SignOut
              size={15}
              style={{ color: "var(--admin-text-muted)", flexShrink: 0, transition: "color 0.12s" }}
            />
            {expanded && (
              <span
                className="animate-slide-in"
                style={{
                  fontSize: 12.5,
                  color: "var(--admin-text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                Sign out
              </span>
            )}
          </button>
        </form>
      </div>
    </aside>

    {/* ── Mobile bottom nav ── */}
    <nav className="admin-bottom-nav">
      {mobileNav.map(({ href, Icon, label }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              minWidth: 52,
              flex: 1,
              padding: "6px 4px",
              textDecoration: "none",
              borderTop: active ? "2px solid #d97706" : "2px solid transparent",
              background: active ? "rgba(217,119,6,0.06)" : "transparent",
            }}
          >
            <Icon
              size={18}
              weight={active ? "bold" : "regular"}
              style={{ color: active ? "#d97706" : "#55555e" }}
            />
            <span style={{
              fontSize: 8,
              fontWeight: active ? 700 : 500,
              color: active ? "#d97706" : "#55555e",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
    </>
  );
}
