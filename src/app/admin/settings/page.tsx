import Link from "next/link";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { AdminShell } from "@/components/admin/AdminShell";
import { HiddenField } from "@/components/admin/FormPrimitives";
import { PendingSubmitButton } from "@/components/admin/SubmitButtons";
import { saveFeatureSettingsAction } from "@/app/admin/actions";
import { getAdminSitePayload } from "@/lib/queries";
import { getKitConfig, getKitLabel } from "@/lib/kit-config";
import type { FeatureFlags } from "@/types/site";
import type { KitModules } from "@/types/kit";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminSettingsPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const payload = await getAdminSitePayload();
  const { features, kitType, brand, businessSlug } = payload;
  const kitConfig = getKitConfig(kitType);
  const { modules } = kitConfig;

  const siteStatus = "live"; // derives from business.site_status — passed through brand for now

  return (
    <AdminShell
      activeKey="settings"
      brandName={brand.businessName}
      eyebrow="System"
      title="Site Modules"
      description="Control which sections are active on your live site."
      liveHref={businessSlug ? `/${businessSlug}` : undefined}
    >
      <AdminFeedback searchParams={params} />

      {/* ── Two-column layout ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px minmax(0, 1fr)",
          gap: 12,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* ── LEFT: Kit identity + module index ── */}
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            overflowY: "auto",
          }}
          className="admin-scrollbar"
        >
          {/* Kit identity */}
          <div
            style={{
              background: "var(--admin-surface)",
              border: "1px solid var(--admin-border)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderBottom: "1px solid var(--admin-border)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "#d97706",
                }}
              >
                Kit Type
              </p>
            </div>
            <div style={{ padding: "12px 14px" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--admin-text)",
                }}
              >
                {getKitLabel(kitType)}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 11,
                  color: "var(--admin-text-muted)",
                  lineHeight: 1.5,
                }}
              >
                Controls which modules are available on this site.
              </p>
            </div>
          </div>

          {/* Active modules index */}
          <div
            style={{
              background: "var(--admin-surface)",
              border: "1px solid var(--admin-border)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderBottom: "1px solid var(--admin-border)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "#d97706",
                }}
              >
                Active Modules
              </p>
            </div>
            <div style={{ padding: "8px 6px" }}>
              <ModuleIndexItem modules={modules} moduleKey="homepage" label="Homepage" href="/admin/homepage" />
              <ModuleIndexItem modules={modules} moduleKey="branding" label="Branding" href="/admin/branding" />
              <ModuleIndexItem modules={modules} moduleKey="menu" label="Menu" href="/admin/menu" />
              <ModuleIndexItem modules={modules} moduleKey="specials" label="Specials" href="/admin/specials" />
              <ModuleIndexItem modules={modules} moduleKey="hours" label="Hours" href="/admin/hours" />
              <ModuleIndexItem modules={modules} moduleKey="photos" label="Photos" href="/admin/photos" />
              <ModuleIndexItem modules={modules} moduleKey="contact" label="Contact" href="/admin/contact" />
              <ModuleIndexItem modules={modules} moduleKey="google" label="Google" href="/admin/google" />
              <ModuleIndexItem modules={modules} moduleKey="launch" label="Launch" href="/admin/launch" />
            </div>
          </div>

          {/* Site status */}
          <div
            style={{
              background: "var(--admin-surface)",
              border: "1px solid var(--admin-border)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "12px 14px" }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "var(--admin-text-muted)",
                  marginBottom: 8,
                }}
              >
                Site Status
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  className="animate-pulse-dot"
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#4ade80",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#4ade80",
                  }}
                >
                  Live
                </span>
              </div>
              {businessSlug && (
                <a
                  href={`/${businessSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: 8,
                    fontSize: 11,
                    color: "var(--admin-text-muted)",
                    textDecoration: "none",
                    borderBottom: "1px solid var(--admin-border)",
                    paddingBottom: 1,
                  }}
                >
                  /{businessSlug} ↗
                </a>
              )}
            </div>
          </div>
        </aside>

        {/* ── RIGHT: Module control panels ── */}
        <div
          className="admin-scrollbar"
          style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}
        >
          <form action={saveFeatureSettingsAction} style={{ display: "contents" }}>
            <HiddenField name="redirect_to" value="/admin/settings" />

            {/* ── Content Sections ────────────────────────────────────────── */}
            {(modules.specials || modules.photos) && (
              <ModulePanel
                eyebrow="Content"
                title="Content Sections"
                description="Control which content sections appear on your public site."
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {modules.specials ? (
                    <ToggleRow
                      name="show_specials"
                      label="Show Specials"
                      hint="Displays the daily specials section on the homepage."
                      defaultChecked={features.showSpecials}
                    />
                  ) : (
                    <HiddenField name="show_specials" value={features.showSpecials ? "on" : ""} />
                  )}

                  {modules.photos ? (
                    <ToggleRow
                      name="show_gallery"
                      label="Show Photo Gallery"
                      hint="Shows the photo grid section on the homepage."
                      defaultChecked={features.showGallery}
                    />
                  ) : (
                    <HiddenField name="show_gallery" value={features.showGallery ? "on" : ""} />
                  )}

                  <ToggleRow
                    name="show_testimonials"
                    label="Show Testimonials"
                    hint="Shows a testimonials section if any are configured."
                    defaultChecked={features.showTestimonials}
                  />
                </div>
              </ModulePanel>
            )}

            {/* Preserve hidden when content panel not shown */}
            {!modules.specials && !modules.photos && (
              <>
                <HiddenField name="show_specials" value={features.showSpecials ? "on" : ""} />
                <HiddenField name="show_gallery" value={features.showGallery ? "on" : ""} />
                <HiddenField name="show_testimonials" value={features.showTestimonials ? "on" : ""} />
              </>
            )}

            {/* ── Menu Service Windows ─────────────────────────────────────── */}
            {modules.menu ? (
              <ModulePanel
                eyebrow="Menu"
                title="Service Windows"
                description="Control which meal periods appear on the menu page."
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <ToggleRow
                    name="show_breakfast_menu"
                    label="Breakfast"
                    hint="Shows items tagged for the breakfast service window."
                    defaultChecked={features.showBreakfastMenu}
                  />
                  <ToggleRow
                    name="show_lunch_menu"
                    label="Lunch"
                    hint="Shows items tagged for the lunch service window."
                    defaultChecked={features.showLunchMenu}
                  />
                  <ToggleRow
                    name="show_dinner_menu"
                    label="Dinner"
                    hint="Shows items tagged for the dinner service window."
                    defaultChecked={features.showDinnerMenu}
                  />
                </div>
              </ModulePanel>
            ) : (
              <>
                <HiddenField name="show_breakfast_menu" value={features.showBreakfastMenu ? "on" : ""} />
                <HiddenField name="show_lunch_menu" value={features.showLunchMenu ? "on" : ""} />
                <HiddenField name="show_dinner_menu" value={features.showDinnerMenu ? "on" : ""} />
              </>
            )}

            {/* ── Contact & Location ───────────────────────────────────────── */}
            {modules.contact ? (
              <ModulePanel
                eyebrow="Contact"
                title="Location Features"
                description="Enhance the contact section with location-specific options."
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <ToggleRow
                    name="show_map"
                    label="Show Map"
                    hint="Embeds an interactive map in the contact section."
                    defaultChecked={features.showMap}
                  />
                </div>
              </ModulePanel>
            ) : (
              <HiddenField name="show_map" value={features.showMap ? "on" : ""} />
            )}

            {/* ── Site Utility ─────────────────────────────────────────────── */}
            <ModulePanel
              eyebrow="Utility"
              title="Site Utility"
              description="Navigation and action elements that appear across the site."
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <ToggleRow
                  name="show_online_ordering"
                  label="Online Ordering Links"
                  hint="Shows ordering CTAs in the header and sticky bar."
                  defaultChecked={features.showOnlineOrdering}
                />
                <ToggleRow
                  name="show_sticky_mobile_bar"
                  label="Mobile Action Bar"
                  hint="Sticky bottom bar on mobile with call, order, and map actions."
                  defaultChecked={features.showStickyMobileBar}
                />
              </div>
            </ModulePanel>

            {/* ── Save ─────────────────────────────────────────────────────── */}
            <div style={{ paddingBottom: 16 }}>
              <PendingSubmitButton label="Save Module Settings" />
            </div>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}

// ─── MODULE PANEL ─────────────────────────────────────────────────────────────

function ModulePanel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--admin-surface)",
        border: "1px solid var(--admin-border)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          padding: "11px 16px",
          borderBottom: "1px solid var(--admin-border)",
        }}
      >
        <span
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 9,
            fontWeight: 700,
            textTransform: "uppercase" as const,
            letterSpacing: "0.2em",
            color: "#d97706",
            flexShrink: 0,
          }}
        >
          {eyebrow}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--admin-text)",
          }}
        >
          {title}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            color: "var(--admin-text-muted)",
            whiteSpace: "nowrap" as const,
          }}
        >
          {description}
        </span>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

// ─── TOGGLE ROW ───────────────────────────────────────────────────────────────

function ToggleRow({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint: string;
  defaultChecked?: boolean;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid var(--admin-border)",
        background: defaultChecked ? "rgba(217,119,6,0.04)" : "rgba(0,0,0,0.15)",
        cursor: "pointer",
        transition: "border-color 0.12s, background 0.12s",
      }}
    >
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        style={{
          width: 15,
          height: 15,
          accentColor: "#d97706",
          flexShrink: 0,
          cursor: "pointer",
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 12.5,
            fontWeight: 600,
            color: "var(--admin-text)",
            lineHeight: 1.3,
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "2px 0 0",
            fontSize: 11,
            color: "var(--admin-text-muted)",
            lineHeight: 1.4,
          }}
        >
          {hint}
        </p>
      </div>
      {/* On/Off indicator */}
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: defaultChecked ? "#4ade80" : "var(--admin-text-muted)",
          flexShrink: 0,
        }}
      >
        {defaultChecked ? "On" : "Off"}
      </span>
    </label>
  );
}

// ─── MODULE INDEX ITEM ────────────────────────────────────────────────────────

function ModuleIndexItem({
  modules,
  moduleKey,
  label,
  href,
}: {
  modules: KitModules;
  moduleKey: keyof KitModules;
  label: string;
  href: string;
}) {
  const enabled = modules[moduleKey] !== false;
  if (!enabled) return null;

  return (
    <Link
      href={href}
      className="hover:bg-white/[0.04]"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 10px",
        borderRadius: 7,
        textDecoration: "none",
        transition: "background 0.1s",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#4ade80",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "var(--admin-text-muted)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          marginLeft: "auto",
          fontSize: 10,
          color: "var(--admin-text-muted)",
          opacity: 0.5,
        }}
      >
        →
      </span>
    </Link>
  );
}
