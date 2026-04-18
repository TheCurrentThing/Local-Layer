"use client";

import { useState, useTransition } from "react";
import {
  disconnectGoogleAction,
  mapGoogleLocationAction,
  updateGoogleSyncSettingsAction,
  triggerGoogleSyncAction,
  fetchGoogleReviewsAction,
  getAvailableGoogleLocationsAction,
} from "@/app/admin/google-actions";
import type { GbpAvailableLocation, GooglePresenceState, GoogleReviewCacheRow } from "@/types/google";

// ─── Small primitives ─────────────────────────────────────────────────────────

function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: "green" | "red" | "yellow" | "blue" | "muted";
}) {
  const styles: Record<string, string> = {
    green:  "background:rgba(74,222,128,0.1);color:#4ade80;border:1px solid rgba(74,222,128,0.25)",
    red:    "background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.25)",
    yellow: "background:rgba(251,191,36,0.1);color:#fbbf24;border:1px solid rgba(251,191,36,0.25)",
    blue:   "background:rgba(96,165,250,0.1);color:#60a5fa;border:1px solid rgba(96,165,250,0.25)",
    muted:  "background:rgba(255,255,255,0.05);color:#6b6b74;border:1px solid rgba(255,255,255,0.08)",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        ...Object.fromEntries(
          styles[variant].split(";").map((s) => {
            const [k, v] = s.split(":");
            return [
              k.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()),
              v?.trim(),
            ];
          }),
        ),
      }}
    >
      {label}
    </span>
  );
}

function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--admin-card)",
        border: "1px solid var(--admin-border)",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid var(--admin-border)",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--admin-text-muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
        {action}
      </div>
      <div style={{ padding: "16px" }}>{children}</div>
    </div>
  );
}

function Btn({
  onClick,
  disabled,
  variant = "primary",
  children,
  type = "button",
}: {
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  children: React.ReactNode;
  type?: "button" | "submit";
}) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 14px",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    border: "none",
    transition: "opacity 0.15s",
  };
  const variants: Record<string, React.CSSProperties> = {
    primary:   { background: "rgba(217,119,6,0.85)", color: "#fff" },
    secondary: { background: "rgba(255,255,255,0.07)", color: "var(--admin-text)", border: "1px solid var(--admin-border)" },
    danger:    { background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" },
    ghost:     { background: "transparent", color: "var(--admin-text-muted)", border: "1px solid var(--admin-border)" },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant] }}
    >
      {children}
    </button>
  );
}

function Toggle({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        cursor: "pointer",
        padding: "10px 0",
        borderBottom: "1px solid var(--admin-border)",
      }}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        style={{ marginTop: 2, accentColor: "#d97706", width: 15, height: 15 }}
      />
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--admin-text)" }}>
          {label}
        </div>
        <div style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 2 }}>
          {description}
        </div>
      </div>
    </label>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#fbbf24", fontSize: 13, letterSpacing: 1 }}>
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Main client component ────────────────────────────────────────────────────

export function GooglePresenceClient({
  presenceState,
  googleConfigured,
  statusMsg,
  errorMsg,
}: {
  presenceState: GooglePresenceState | null;
  googleConfigured: boolean;
  statusMsg: string | null;
  errorMsg: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [availableLocations, setAvailableLocations] = useState<GbpAvailableLocation[] | null>(null);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const p = presenceState;

  function flash(ok: boolean, msg: string) {
    setFeedback({ ok, msg });
    setTimeout(() => setFeedback(null), 5000);
  }

  // Status banner from URL params
  const bannerMsg = statusMsg
    ? statusMsg === "connected"
      ? "Google account connected successfully."
      : statusMsg === "location_mapped"
      ? "Google location mapped. Sync is now active."
      : statusMsg === "settings_saved"
      ? "Sync settings saved."
      : statusMsg === "disconnected"
      ? "Google account disconnected."
      : null
    : null;

  // ── Not configured ──────────────────────────────────────────────────────────
  if (!googleConfigured) {
    return (
      <div style={{ padding: "24px", maxWidth: 680 }}>
        <Panel title="Setup required">
          <p style={{ fontSize: 14, color: "var(--admin-text-muted)", lineHeight: 1.6, marginBottom: 16 }}>
            Google Business Profile integration requires four environment variables.
            Add these to your <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 3 }}>.env.local</code> file:
          </p>
          <div
            style={{
              background: "rgba(0,0,0,0.3)",
              borderRadius: 6,
              padding: "12px 14px",
              fontFamily: "ui-monospace, monospace",
              fontSize: 12,
              lineHeight: 1.8,
              color: "#a0a0b0",
            }}
          >
            <div><span style={{ color: "#4ade80" }}>GOOGLE_CLIENT_ID</span>=your-client-id</div>
            <div><span style={{ color: "#4ade80" }}>GOOGLE_CLIENT_SECRET</span>=your-client-secret</div>
            <div><span style={{ color: "#4ade80" }}>GOOGLE_REDIRECT_URI</span>=https://yourdomain.com/api/auth/google/callback</div>
            <div><span style={{ color: "#4ade80" }}>GOOGLE_TOKEN_ENCRYPTION_KEY</span>={"$("}node -e &quot;console.log(require(&apos;crypto&apos;).randomBytes(32).toString(&apos;base64&apos;))&quot;{")"}</div>
          </div>
          <p style={{ fontSize: 12, color: "var(--admin-text-muted)", marginTop: 12, lineHeight: 1.6 }}>
            Create OAuth credentials at{" "}
            <strong>Google Cloud Console → APIs & Services → Credentials</strong>.
            Enable the <strong>Business Profile API</strong> and set the redirect URI above.
          </p>
        </Panel>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: 800, display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Status banner ─────────────────────────────────────────────────── */}
      {(bannerMsg || errorMsg || feedback) && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 6,
            fontSize: 13,
            border: "1px solid",
            ...(errorMsg || (feedback && !feedback.ok)
              ? { background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }
              : { background: "rgba(74,222,128,0.08)", borderColor: "rgba(74,222,128,0.3)", color: "#4ade80" }),
          }}
        >
          {feedback ? feedback.msg : errorMsg || bannerMsg}
        </div>
      )}

      {/* ── Connection status ─────────────────────────────────────────────── */}
      <Panel
        title="Google Account"
        action={
          p?.isConnected ? (
            <form
              action={disconnectGoogleAction}
            >
              <Btn type="submit" variant="danger" disabled={isPending}>
                Disconnect
              </Btn>
            </form>
          ) : null
        }
      >
        {p?.isConnected ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <StatusBadge label="Connected" variant="green" />
            <span style={{ fontSize: 13, color: "var(--admin-text)" }}>
              {p.connection?.google_account_email}
            </span>
            <span style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>
              Connected {p.connection?.created_at ? timeAgo(p.connection.created_at) : ""}
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <StatusBadge label="Not connected" variant="muted" />
            <a href="/api/auth/google">
              <Btn variant="primary">Connect Google Account</Btn>
            </a>
          </div>
        )}
      </Panel>

      {/* ── Location mapping ──────────────────────────────────────────────── */}
      {p?.isConnected && (
        <Panel title="Google Business Location">
          {p.isLocationMapped ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <StatusBadge label="Mapped" variant="green" />
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--admin-text)" }}>
                  {p.location?.display_name}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "var(--admin-text-muted)", fontFamily: "ui-monospace, monospace" }}>
                {p.location?.google_location_name}
              </div>
              {p.location?.verification_state && (
                <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>
                  Verification: {p.location.verification_state}
                </div>
              )}
              <Btn
                variant="ghost"
                disabled={loadingLocations}
                onClick={() => {
                  setLoadingLocations(true);
                  getAvailableGoogleLocationsAction().then((r) => {
                    setAvailableLocations(r.locations);
                    setLoadingLocations(false);
                  });
                }}
              >
                {loadingLocations ? "Loading…" : "Change location"}
              </Btn>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 13, color: "var(--admin-text-muted)", margin: 0 }}>
                Select which Google Business location to sync with LocalLayer.
              </p>
              <Btn
                variant="secondary"
                disabled={loadingLocations}
                onClick={() => {
                  setLoadingLocations(true);
                  getAvailableGoogleLocationsAction().then((r) => {
                    if (!r.ok) flash(false, r.error ?? "Failed to load locations.");
                    setAvailableLocations(r.locations);
                    setLoadingLocations(false);
                  });
                }}
              >
                {loadingLocations ? "Loading locations…" : "Load available locations"}
              </Btn>
            </div>
          )}

          {/* Location picker */}
          {availableLocations !== null && (
            <form
              action={mapGoogleLocationAction}
              style={{ marginTop: 14 }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {availableLocations.length === 0 ? (
                  <p style={{ fontSize: 13, color: "var(--admin-text-muted)" }}>
                    No locations found. Ensure your Google account has access to a Business Profile location.
                  </p>
                ) : (
                  availableLocations.map((loc) => (
                    <label
                      key={loc.locationName}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 6,
                        border: "1px solid var(--admin-border)",
                        cursor: "pointer",
                        background: "rgba(255,255,255,0.03)",
                      }}
                    >
                      <input
                        type="radio"
                        name="location_name"
                        value={loc.locationName}
                        required
                        defaultChecked={loc.locationName === p?.location?.google_location_name}
                        style={{ marginTop: 2, accentColor: "#d97706" }}
                      />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--admin-text)" }}>
                          {loc.displayName}
                        </div>
                        {loc.address && (
                          <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>
                            {loc.address}
                          </div>
                        )}
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--admin-text-muted)",
                            fontFamily: "ui-monospace, monospace",
                            marginTop: 2,
                          }}
                        >
                          {loc.locationName}
                        </div>
                      </div>
                    </label>
                  ))
                )}
                {availableLocations.length > 0 && (
                  <Btn type="submit" variant="primary">
                    Map this location
                  </Btn>
                )}
              </div>
            </form>
          )}
        </Panel>
      )}

      {/* ── Sync settings ─────────────────────────────────────────────────── */}
      {p?.isLocationMapped && (
        <Panel title="Sync settings">
          <form action={updateGoogleSyncSettingsAction}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Toggle
                name="sync_hours"
                label="Sync business hours"
                description="When you update hours in LocalLayer, push them to your Google listing."
                defaultChecked={p.settings?.sync_hours ?? true}
              />
              <Toggle
                name="sync_specials_as_posts"
                label="Publish specials as Google posts"
                description="When a special is saved or updated, create or update a Google local post."
                defaultChecked={p.settings?.sync_specials_as_posts ?? true}
              />
              <Toggle
                name="sync_announcements_as_posts"
                label="Publish announcements as Google posts"
                description="When an announcement is saved, create or update a Google local post."
                defaultChecked={p.settings?.sync_announcements_as_posts ?? true}
              />
              <Toggle
                name="auto_publish_google_posts"
                label="Auto-publish posts"
                description="Posts are published immediately. Disable to queue them for manual review."
                defaultChecked={p.settings?.auto_publish_google_posts ?? true}
              />
            </div>
            <div style={{ marginTop: 14 }}>
              <Btn type="submit" variant="primary">
                Save settings
              </Btn>
            </div>
          </form>
        </Panel>
      )}

      {/* ── Sync health ───────────────────────────────────────────────────── */}
      {p?.isLocationMapped && (
        <Panel
          title="Sync health"
          action={
            <Btn
              variant="secondary"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const r = await triggerGoogleSyncAction();
                  flash(r.ok, r.message);
                });
              }}
            >
              {isPending ? "Syncing…" : "Sync now"}
            </Btn>
          }
        >
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--admin-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Pending jobs
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: p.pendingJobCount > 0 ? "#fbbf24" : "#4ade80",
                  marginTop: 4,
                }}
              >
                {p.pendingJobCount}
              </div>
            </div>
            {p.settings?.last_hours_sync_at && (
              <div>
                <div style={{ fontSize: 11, color: "var(--admin-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Last hours sync
                </div>
                <div style={{ fontSize: 13, color: "var(--admin-text)", marginTop: 4 }}>
                  {timeAgo(p.settings.last_hours_sync_at)}
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 11,
                      color: p.settings.last_hours_sync_status === "success" ? "#4ade80" : "#f87171",
                    }}
                  >
                    {p.settings.last_hours_sync_status}
                  </span>
                </div>
              </div>
            )}
            {p.settings?.last_posts_sync_at && (
              <div>
                <div style={{ fontSize: 11, color: "var(--admin-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Last post sync
                </div>
                <div style={{ fontSize: 13, color: "var(--admin-text)", marginTop: 4 }}>
                  {timeAgo(p.settings.last_posts_sync_at)}
                </div>
              </div>
            )}
          </div>
        </Panel>
      )}

      {/* ── Reviews ───────────────────────────────────────────────────────── */}
      {p?.isLocationMapped && (
        <Panel
          title="Reviews"
          action={
            <Btn
              variant="ghost"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const r = await fetchGoogleReviewsAction();
                  flash(r.ok, r.message);
                });
              }}
            >
              {isPending ? "Fetching…" : "Refresh reviews"}
            </Btn>
          }
        >
          {p.reviewSummary ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: "#fbbf24" }}>
                    {p.reviewSummary.averageRating.toFixed(1)}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>
                    {p.reviewSummary.count} review{p.reviewSummary.count !== 1 ? "s" : ""}
                  </div>
                </div>
                {p.reviewSummary.lastFetchedAt && (
                  <div style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>
                    Last fetched {timeAgo(p.reviewSummary.lastFetchedAt)}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {p.reviewSummary.latestReviews.map((r: GoogleReviewCacheRow) => (
                  <div
                    key={r.id}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 6,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--admin-border)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--admin-text)" }}>
                          {r.reviewer_name ?? "Anonymous"}
                        </span>
                        <StarRating rating={r.rating_numeric} />
                      </div>
                      <span style={{ fontSize: 11, color: "var(--admin-text-muted)", whiteSpace: "nowrap" }}>
                        {r.create_time ? timeAgo(r.create_time) : ""}
                      </span>
                    </div>
                    {r.comment && (
                      <p style={{ fontSize: 13, color: "var(--admin-text-muted)", margin: 0, lineHeight: 1.5 }}>
                        {r.comment.length > 200 ? `${r.comment.slice(0, 200)}…` : r.comment}
                      </p>
                    )}
                    {r.reply_comment && (
                      <div
                        style={{
                          marginTop: 8,
                          paddingLeft: 10,
                          borderLeft: "2px solid rgba(217,119,6,0.4)",
                        }}
                      >
                        <div style={{ fontSize: 11, color: "#d97706", fontWeight: 600, marginBottom: 2 }}>
                          Your reply
                        </div>
                        <p style={{ fontSize: 12, color: "var(--admin-text-muted)", margin: 0 }}>
                          {r.reply_comment}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: "var(--admin-text-muted)", margin: 0 }}>
              No reviews cached yet. Click <strong>Refresh reviews</strong> to fetch from Google.
            </p>
          )}
        </Panel>
      )}

      {/* ── Activity log ──────────────────────────────────────────────────── */}
      {p && p.recentEvents.length > 0 && (
        <Panel title="Activity log">
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {p.recentEvents.map((ev, i) => (
              <div
                key={ev.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "8px 0",
                  borderBottom: i < p.recentEvents.length - 1 ? "1px solid var(--admin-border)" : "none",
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    marginTop: 5,
                    flexShrink: 0,
                    background:
                      ev.error
                        ? "#f87171"
                        : ev.event_type === "job_success"
                        ? "#4ade80"
                        : "rgba(255,255,255,0.2)",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--admin-text)" }}>
                    {formatEventType(ev.event_type)}
                    {ev.entity_type && (
                      <span style={{ color: "var(--admin-text-muted)", marginLeft: 4 }}>
                        · {ev.entity_type}
                      </span>
                    )}
                  </div>
                  {ev.error && (
                    <div style={{ fontSize: 12, color: "#f87171", marginTop: 2, wordBreak: "break-word" }}>
                      {ev.error}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 11, color: "var(--admin-text-muted)", flexShrink: 0 }}>
                  {timeAgo(ev.created_at)}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      )}

    </div>
  );
}

function formatEventType(type: string): string {
  const map: Record<string, string> = {
    job_created:        "Sync job queued",
    job_started:        "Sync job started",
    job_success:        "Sync succeeded",
    job_failed:         "Sync failed",
    connection_made:    "Google account connected",
    connection_revoked: "Google account disconnected",
    location_mapped:    "Location mapped",
    reviews_fetched:    "Reviews fetched",
    settings_updated:   "Sync settings updated",
  };
  return map[type] ?? type;
}
