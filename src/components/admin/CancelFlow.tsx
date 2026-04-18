"use client";

import { useState } from "react";
import Link from "next/link";
import type { PlanSlug } from "@/types/billing";

type Step = "choose" | "confirm-starter" | "confirm-cancel";

export function CancelFlow({
  currentPlanName,
  currentPlanSlug,
  subdomainUrl,
}: {
  currentPlanName: string;
  currentPlanSlug: PlanSlug;
  subdomainUrl: string;
}) {
  const [step, setStep] = useState<Step>("choose");

  const starterMailto = `mailto:hello@locallayer.com?subject=Switch%20to%20Starter%20plan&body=Hi%2C%20I%27d%20like%20to%20switch%20from%20${encodeURIComponent(currentPlanName)}%20to%20the%20Starter%20plan%20(%245%2Fmo).%20Please%20update%20my%20account.`;
  const cancelMailto = `mailto:hello@locallayer.com?subject=Cancel%20my%20LocalLayer%20subscription&body=Hi%2C%20I%27d%20like%20to%20cancel%20my%20LocalLayer%20subscription.%20I%20understand%20my%20site%20will%20go%20offline.`;

  if (step === "confirm-starter") {
    return (
      <div
        className="admin-scrollbar"
        style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}
      >
        {/* Back */}
        <button
          onClick={() => setStep("choose")}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, width: "fit-content" }}
        >
          <span style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>← Back to options</span>
        </button>

        {/* Summary */}
        <div
          style={{
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--admin-border)", background: "rgba(255,255,255,0.02)" }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--admin-text)" }}>
              Switch to Starter — $5/month
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "var(--admin-text-muted)" }}>
              Your site stays live. Your content is preserved.
            </p>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#4ade80" }}>
                What you keep
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  `Your site stays live at ${subdomainUrl}`,
                  "All your content, menus, photos, and hours are preserved",
                  "Full admin panel access",
                  "Upgrade to Core or Pro anytime",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: "#4ade80", fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 12.5, color: "var(--admin-text)", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: 10, borderTop: "1px solid var(--admin-border)" }}>
              <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--admin-text-muted)" }}>
                What changes
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  "Custom domain connection paused",
                  "Google Business sync paused",
                  "Signature renderer reverts to standard",
                  "Extended storage access paused",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--admin-text-muted)", fontSize: 12, flexShrink: 0, marginTop: 1 }}>—</span>
                    <span style={{ fontSize: 12.5, color: "var(--admin-text-muted)", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
            borderRadius: 12,
            padding: "14px 16px",
          }}
        >
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--admin-text-muted)", lineHeight: 1.6 }}>
            Plan changes are currently handled by our team. Click below to send us an email — we&apos;ll apply the change within one business day.
          </p>
          <a
            href={starterMailto}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 18px",
              borderRadius: 8,
              background: "rgba(217,119,6,0.12)",
              border: "1px solid rgba(217,119,6,0.3)",
              color: "#d97706",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Email us to switch to Starter →
          </a>
        </div>
      </div>
    );
  }

  if (step === "confirm-cancel") {
    return (
      <div
        className="admin-scrollbar"
        style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}
      >
        {/* Back */}
        <button
          onClick={() => setStep("choose")}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, width: "fit-content" }}
        >
          <span style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>← Back to options</span>
        </button>

        {/* Warning */}
        <div
          style={{
            background: "rgba(248,113,113,0.05)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: 12,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#f87171" }}>
            Your site will go offline.
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-muted)", lineHeight: 1.6 }}>
            Canceling your subscription removes public access to your site. Your content, menus, photos, and all data are preserved — you can reactivate at any time.
          </p>
        </div>

        {/* What happens */}
        <div
          style={{
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
            borderRadius: 12,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "var(--admin-text)" }}>
            What happens when you cancel:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { text: `${subdomainUrl} will return a 404`, negative: true },
              { text: "All your content and data is safely preserved", negative: false },
              { text: "Your admin panel remains accessible", negative: false },
              { text: "You can reactivate any time by emailing us", negative: false },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: item.negative ? "#f87171" : "#4ade80", fontSize: 12, flexShrink: 0, marginTop: 1 }}>
                  {item.negative ? "✗" : "✓"}
                </span>
                <span style={{ fontSize: 12.5, color: item.negative ? "var(--admin-text)" : "var(--admin-text-muted)", lineHeight: 1.5 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alternative reminder */}
        <div
          style={{
            background: "rgba(217,119,6,0.04)",
            border: "1px solid rgba(217,119,6,0.15)",
            borderRadius: 10,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: "var(--admin-text-muted)", flex: 1, lineHeight: 1.5 }}>
            Changed your mind? <strong style={{ color: "var(--admin-text)" }}>Starter keeps your site live for $5/month.</strong>
          </p>
          <button
            onClick={() => setStep("confirm-starter")}
            style={{
              padding: "7px 13px",
              borderRadius: 7,
              background: "rgba(217,119,6,0.1)",
              border: "1px solid rgba(217,119,6,0.25)",
              color: "#d97706",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Switch to Starter instead
          </button>
        </div>

        {/* Cancel CTA */}
        <div
          style={{
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
            borderRadius: 12,
            padding: "14px 16px",
          }}
        >
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--admin-text-muted)", lineHeight: 1.6 }}>
            Cancellations are handled by our team. Click below to send us an email — we&apos;ll process the cancellation within one business day.
          </p>
          <a
            href={cancelMailto}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 18px",
              borderRadius: 8,
              background: "rgba(107,114,128,0.08)",
              border: "1px solid rgba(107,114,128,0.2)",
              color: "var(--admin-text-muted)",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Email us to cancel →
          </a>
        </div>
      </div>
    );
  }

  // Default: choose step
  return (
    <div
      className="admin-scrollbar"
      style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}
    >
      <Link
        href="/admin/billing"
        style={{ fontSize: 11, color: "var(--admin-text-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, width: "fit-content" }}
      >
        ← Back to billing
      </Link>

      {/* Context */}
      <div
        style={{
          background: "var(--admin-surface)",
          border: "1px solid var(--admin-border)",
          borderRadius: 12,
          padding: "14px 16px",
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: "var(--admin-text)", lineHeight: 1.7 }}>
          You&apos;re currently on the{" "}
          <strong style={{ color: "var(--admin-text)" }}>{currentPlanName} plan</strong>.
          {" "}Before you make any changes, consider whether Starter is the right fit — it keeps your site live for just $5/month.
        </p>
      </div>

      {/* Two choices */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {/* Keep My Site Live — Starter */}
        <button
          onClick={() => setStep("confirm-starter")}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: "18px 16px",
            background: "rgba(217,119,6,0.04)",
            border: "1px solid rgba(217,119,6,0.25)",
            borderRadius: 12,
            textAlign: "left",
            cursor: "pointer",
            transition: "border-color 0.12s, background 0.12s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(217,119,6,0.5)";
            (e.currentTarget as HTMLElement).style.background = "rgba(217,119,6,0.07)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(217,119,6,0.25)";
            (e.currentTarget as HTMLElement).style.background = "rgba(217,119,6,0.04)";
          }}
        >
          <div>
            <span
              style={{
                display: "inline-block",
                fontSize: 8,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#d97706",
                marginBottom: 6,
              }}
            >
              Recommended
            </span>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--admin-text)", lineHeight: 1.3 }}>
              Keep My Site Live
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: "#d97706", fontWeight: 600 }}>
              Starter — $5/month
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              "Site stays live at your subdomain",
              "All content preserved",
              "Upgrade anytime",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <span style={{ color: "#4ade80", fontSize: 11, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 12, color: "var(--admin-text-muted)", lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
          <span
            style={{
              marginTop: "auto",
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 14px",
              borderRadius: 7,
              background: "rgba(217,119,6,0.12)",
              border: "1px solid rgba(217,119,6,0.3)",
              color: "#d97706",
              fontSize: 12,
              fontWeight: 700,
              width: "fit-content",
            }}
          >
            Switch to Starter →
          </span>
        </button>

        {/* Cancel completely */}
        <button
          onClick={() => setStep("confirm-cancel")}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: "18px 16px",
            background: "rgba(0,0,0,0.12)",
            border: "1px solid var(--admin-border)",
            borderRadius: 12,
            textAlign: "left",
            cursor: "pointer",
            transition: "border-color 0.12s, background 0.12s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,113,113,0.2)";
            (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.04)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--admin-border)";
            (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.12)";
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--admin-text)", lineHeight: 1.3 }}>
              Cancel Completely
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: "var(--admin-text-muted)" }}>
              End my subscription
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { text: "Site goes offline", negative: true },
              { text: "Content preserved", negative: false },
              { text: "Reactivate anytime", negative: false },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <span style={{ color: item.negative ? "#f87171" : "var(--admin-text-muted)", fontSize: 11, flexShrink: 0, marginTop: 1 }}>
                  {item.negative ? "✗" : "—"}
                </span>
                <span style={{ fontSize: 12, color: "var(--admin-text-muted)", lineHeight: 1.4 }}>{item.text}</span>
              </div>
            ))}
          </div>
          <span
            style={{
              marginTop: "auto",
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 14px",
              borderRadius: 7,
              background: "transparent",
              border: "1px solid var(--admin-border)",
              color: "var(--admin-text-muted)",
              fontSize: 12,
              fontWeight: 600,
              width: "fit-content",
            }}
          >
            Cancel subscription →
          </span>
        </button>
      </div>

      <p style={{ margin: 0, fontSize: 11, color: "var(--admin-text-muted)", textAlign: "center", lineHeight: 1.5 }}>
        Not sure? Email{" "}
        <a href="mailto:hello@locallayer.com" style={{ color: "#d97706", textDecoration: "none" }}>
          hello@locallayer.com
        </a>
        {" "}— we&apos;re happy to talk through the best option for your situation.
      </p>
    </div>
  );
}
