import { AdminShell } from "@/components/admin/AdminShell";
import { AdminFeedback } from "@/components/admin/AdminFeedback";
import { getAdminSitePayload } from "@/lib/queries";
import { getLaunchAdminPayload } from "@/lib/launch";
import { getCurrentAdminBusinessId } from "@/lib/business";
import {
  publishSiteAction,
  pauseSiteAction,
  markSiteReadyAction,
  unpublishSiteAction,
  addDomainAction,
  removeDomainAction,
  setPrimaryDomainAction,
  verifyDomainAction,
} from "@/app/admin/launch-actions";
import type { LaunchChecklistItem, BusinessDomainRecord } from "@/lib/launch";
import type { SiteStatus } from "@/lib/business";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SiteStatus }) {
  const map: Record<SiteStatus, { label: string; color: string; bg: string; border: string }> = {
    draft: { label: "Draft", color: "#9896a0", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)" },
    ready: { label: "Ready", color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
    live: { label: "Live", color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)" },
    paused: { label: "Paused", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
  };
  const s = map[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        borderRadius: 20,
        background: s.bg,
        border: `1px solid ${s.border}`,
        fontSize: 11,
        fontWeight: 700,
        color: s.color,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      {status === "live" && (
        <span
          className="animate-pulse-dot"
          style={{
            display: "inline-block",
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: s.color,
          }}
        />
      )}
      {s.label}
    </span>
  );
}

// ─── DOMAIN STATUS BADGE ──────────────────────────────────────────────────────

function DomainStatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    pending: { color: "#9896a0", bg: "rgba(255,255,255,0.04)" },
    verified: { color: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
    active: { color: "#4ade80", bg: "rgba(74,222,128,0.08)" },
    failed: { color: "#f87171", bg: "rgba(239,68,68,0.08)" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        background: s.bg,
        fontSize: 10,
        fontWeight: 700,
        color: s.color,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {status}
    </span>
  );
}

// ─── CHECKLIST ITEM ───────────────────────────────────────────────────────────

function CheckItem({ item }: { item: LaunchChecklistItem }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          minWidth: 18,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
          background: item.passed ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${item.passed ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.1)"}`,
        }}
      >
        {item.passed ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: item.critical ? "#f87171" : "#3a3a42", display: "block" }} />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: item.passed ? "#c9c7c0" : item.critical ? "#f87171" : "#6b6b75",
            margin: 0,
          }}
        >
          {item.label}
          {item.critical && !item.passed && (
            <span style={{ marginLeft: 6, fontSize: 9, color: "#f87171", fontWeight: 700, letterSpacing: "0.08em" }}>
              REQUIRED
            </span>
          )}
        </p>
        <p style={{ fontSize: 11, color: "#4b4b54", marginTop: 2 }}>{item.description}</p>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default async function AdminLaunchPage({ searchParams }: AdminPageProps) {
  const [payload, businessId] = await Promise.all([
    getAdminSitePayload(),
    getCurrentAdminBusinessId(),
  ]);

  const launch = await getLaunchAdminPayload(businessId);
  const status = launch?.business.site_status ?? "draft";
  const isLive = status === "live";
  const isPaused = status === "paused";
  const isDraft = status === "draft";
  const isReady = status === "ready";
  const checklist = launch?.checklist;
  const domains = launch?.domains ?? [];
  const publicUrl = launch?.publicUrl ?? `/${payload.businessSlug}`;

  return (
    <AdminShell
      activeKey="launch"
      brandName={payload.brand.businessName}
      eyebrow="Launch"
      title="Launch Control"
      liveHref={isLive && payload.businessSlug ? `/${payload.businessSlug}` : undefined}
      contentClassName="min-h-0 flex flex-1 flex-col overflow-hidden"
    >
      <AdminFeedback searchParams={searchParams} />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 320px",
          gap: 12,
          overflow: "hidden",
        }}
      >
        {/* ── LEFT: Status + Actions + Domains ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, overflow: "auto", paddingRight: 2 }}>

          {/* Site Status Panel */}
          <div
            style={{
              background: "rgba(255,255,255,0.018)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div className="panel-header">
              <span className="label-upper">Site Status</span>
              <StatusBadge status={status} />
            </div>

            <div style={{ padding: "16px" }}>
              {/* Status description */}
              <p style={{ fontSize: 13, color: "#7a7a84", marginBottom: 16, lineHeight: 1.55 }}>
                {isDraft && "Your site is in draft mode. Configure your content, then mark it Ready when you're done."}
                {isReady && "Your site is ready to launch. Click Publish to make it publicly accessible."}
                {isLive && "Your site is live and publicly accessible via your slug URL."}
                {isPaused && "Your site is paused and not publicly accessible. You can restore it at any time."}
              </p>

              {/* Temporary URL */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.028)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="label-upper" style={{ marginBottom: 4 }}>Hosted URL</p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: isLive ? "#4ade80" : "#52525c",
                      fontFamily: "ui-monospace, monospace",
                      margin: 0,
                      wordBreak: "break-all",
                    }}
                  >
                    {publicUrl}
                  </p>
                </div>
                {isLive && (
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "6px 12px",
                      borderRadius: 6,
                      background: "rgba(74,222,128,0.08)",
                      border: "1px solid rgba(74,222,128,0.18)",
                      color: "#4ade80",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textDecoration: "none",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    Open ↗
                  </a>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(isDraft || isReady) && (
                  <form action={publishSiteAction}>
                    <button
                      type="submit"
                      disabled={!checklist?.readyToPublish && isDraft}
                      style={{
                        padding: "9px 20px",
                        borderRadius: 7,
                        background: checklist?.readyToPublish || isReady ? "#d97706" : "rgba(255,255,255,0.04)",
                        border: "none",
                        color: checklist?.readyToPublish || isReady ? "#fff" : "#3a3a42",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: checklist?.readyToPublish || isReady ? "pointer" : "not-allowed",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Publish Site
                    </button>
                  </form>
                )}

                {isDraft && (
                  <form action={markSiteReadyAction}>
                    <button
                      type="submit"
                      style={{
                        padding: "9px 20px",
                        borderRadius: 7,
                        background: "rgba(96,165,250,0.1)",
                        border: "1px solid rgba(96,165,250,0.2)",
                        color: "#60a5fa",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Mark Ready
                    </button>
                  </form>
                )}

                {isLive && (
                  <form action={pauseSiteAction}>
                    <button
                      type="submit"
                      style={{
                        padding: "9px 20px",
                        borderRadius: 7,
                        background: "rgba(245,158,11,0.08)",
                        border: "1px solid rgba(245,158,11,0.18)",
                        color: "#f59e0b",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Pause Site
                    </button>
                  </form>
                )}

                {isPaused && (
                  <>
                    <form action={publishSiteAction}>
                      <button
                        type="submit"
                        style={{
                          padding: "9px 20px",
                          borderRadius: 7,
                          background: "#d97706",
                          border: "none",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Restore Live
                      </button>
                    </form>
                    <form action={unpublishSiteAction}>
                      <button
                        type="submit"
                        style={{
                          padding: "9px 20px",
                          borderRadius: 7,
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#55555e",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Reset to Draft
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Custom Domains Panel */}
          <div
            style={{
              background: "rgba(255,255,255,0.018)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div className="panel-header">
              <span className="label-upper">Custom Domains</span>
              <span style={{ fontSize: 10, color: "#3a3a42" }}>
                {domains.length} {domains.length === 1 ? "domain" : "domains"}
              </span>
            </div>

            <div style={{ padding: "14px 16px" }}>
              {/* Add domain form */}
              <form action={addDomainAction} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input
                  type="text"
                  name="domain"
                  placeholder="www.yourdomain.com"
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#e2e0d8",
                    fontSize: 13,
                    outline: "none",
                    minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "8px 14px",
                    borderRadius: 6,
                    background: "rgba(217,119,6,0.12)",
                    border: "1px solid rgba(217,119,6,0.22)",
                    color: "#d97706",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Add Domain
                </button>
              </form>

              {/* Domain list */}
              {domains.length === 0 ? (
                <p style={{ fontSize: 12, color: "#3a3a42", textAlign: "center", padding: "12px 0" }}>
                  No custom domains configured. Your site is available at the hosted URL above.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {domains.map((d) => (
                    <DomainRow key={d.id} domain={d} />
                  ))}
                </div>
              )}

              {/* DNS instructions */}
              <div
                style={{
                  marginTop: 16,
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.018)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <p className="label-upper" style={{ marginBottom: 6 }}>DNS Setup</p>
                <p style={{ fontSize: 11, color: "#4b4b54", lineHeight: 1.6 }}>
                  1. Add your domain above — a verification token will be generated.<br />
                  2. In your DNS provider, add a{" "}
                  <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 3 }}>TXT</code>{" "}
                  record with the token shown.<br />
                  3. Also add a{" "}
                  <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 3 }}>CNAME</code>{" "}
                  pointing your domain to your hosting platform.<br />
                  4. Click <strong style={{ color: "#9896a0" }}>Verify</strong> when DNS has propagated (may take up to 48h).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Launch Checklist ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            overflow: "auto",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.018)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              overflow: "hidden",
              flex: 1,
            }}
          >
            <div className="panel-header">
              <span className="label-upper">Launch Checklist</span>
              {checklist && (
                <span
                  style={{
                    fontSize: 11,
                    color: checklist.allPassed ? "#4ade80" : "#9896a0",
                    fontWeight: 600,
                  }}
                >
                  {checklist.passedCount}/{checklist.totalCount}
                </span>
              )}
            </div>

            <div style={{ padding: "8px 16px 16px" }}>
              {/* Overall readiness */}
              {checklist && (
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: checklist.readyToPublish
                      ? "rgba(74,222,128,0.06)"
                      : "rgba(239,68,68,0.06)",
                    border: `1px solid ${checklist.readyToPublish ? "rgba(74,222,128,0.15)" : "rgba(239,68,68,0.15)"}`,
                    marginBottom: 12,
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: checklist.readyToPublish ? "#4ade80" : "#f87171",
                      margin: 0,
                    }}
                  >
                    {checklist.readyToPublish
                      ? "Ready to publish"
                      : "Complete required items to publish"}
                  </p>
                  <p style={{ fontSize: 11, color: "#52525c", marginTop: 3 }}>
                    {checklist.passedCount} of {checklist.totalCount} items complete
                    {!checklist.criticalPassed && " · Complete all required items first"}
                  </p>
                </div>
              )}

              {checklist?.items.map((item) => (
                <CheckItem key={item.key} item={item} />
              ))}

              {!checklist && (
                <p style={{ fontSize: 12, color: "#3a3a42", padding: "16px 0" }}>
                  Launch checklist not available — configure Supabase to enable.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

// ─── DOMAIN ROW (separate component for clarity) ───────────────────────────

function DomainRow({ domain: d }: { domain: BusinessDomainRecord }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 8,
        background: "rgba(255,255,255,0.022)",
        border: "1px solid rgba(255,255,255,0.065)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          {d.isPrimary && (
            <span
              style={{
                fontSize: 8,
                padding: "2px 6px",
                borderRadius: 3,
                background: "rgba(217,119,6,0.1)",
                border: "1px solid rgba(217,119,6,0.2)",
                color: "#d97706",
                fontWeight: 700,
                letterSpacing: "0.1em",
                flexShrink: 0,
              }}
            >
              PRIMARY
            </span>
          )}
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#c9c7c0",
              fontFamily: "ui-monospace, monospace",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {d.domain}
          </span>
        </div>
        <DomainStatusBadge status={d.status} />
      </div>

      {/* Verification token */}
      {d.verificationToken && d.status === "pending" && (
        <div style={{ marginBottom: 8 }}>
          <p className="label-upper" style={{ marginBottom: 4 }}>TXT Record Value</p>
          <code
            style={{
              display: "block",
              fontSize: 10,
              padding: "6px 10px",
              borderRadius: 5,
              background: "rgba(0,0,0,0.3)",
              color: "#9896a0",
              wordBreak: "break-all",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            {d.verificationToken}
          </code>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {(d.status === "pending" || d.status === "failed") && (
          <form action={verifyDomainAction}>
            <input type="hidden" name="domain_id" value={d.id} />
            <button type="submit" style={smallBtnStyle("#60a5fa", "rgba(96,165,250,0.1)", "rgba(96,165,250,0.2)")}>
              Verify
            </button>
          </form>
        )}

        {!d.isPrimary && d.status === "active" && (
          <form action={setPrimaryDomainAction}>
            <input type="hidden" name="domain_id" value={d.id} />
            <button type="submit" style={smallBtnStyle("#d97706", "rgba(217,119,6,0.08)", "rgba(217,119,6,0.18)")}>
              Set Primary
            </button>
          </form>
        )}

        <form action={removeDomainAction}>
          <input type="hidden" name="domain_id" value={d.id} />
          <button
            type="submit"
            style={smallBtnStyle("#f87171", "rgba(239,68,68,0.06)", "rgba(239,68,68,0.15)")}
          >
            Remove
          </button>
        </form>
      </div>
    </div>
  );
}

function smallBtnStyle(color: string, bg: string, border: string) {
  return {
    padding: "4px 10px",
    borderRadius: 5,
    background: bg,
    border: `1px solid ${border}`,
    color,
    fontSize: 10,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  };
}
