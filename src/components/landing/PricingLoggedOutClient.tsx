"use client";

import { useState } from "react";
import Link from "next/link";
import { PLAN_CONFIGS } from "@/lib/plan-config";
import type { BillingInterval, PlanSlug } from "@/types/billing";

type PlanMeta = {
  slug: PlanSlug;
  tagline: string;
  bullets: string[];
  cta: string;
  ctaHref: string;
  badge?: string;
};

const PLAN_META: Record<PlanSlug, PlanMeta> = {
  trial: {
    slug: "trial",
    tagline: "10 days to try the full platform.",
    bullets: ["Site live immediately", "Access to premium features", "No credit card required"],
    cta: "Start Free Trial",
    ctaHref: "/onboarding",
    badge: "No credit card",
  },
  starter: {
    slug: "starter",
    tagline: "Keep your business live.",
    bullets: ["Site live at your subdomain", "Full content management", "Upgrade anytime"],
    cta: "Get Starter",
    ctaHref: "/onboarding",
  },
  core: {
    slug: "core",
    tagline: "The full operating tier.",
    bullets: ["Custom domain", "Google Business sync", "All site modules"],
    cta: "Get Core",
    ctaHref: "/onboarding",
    badge: "Most popular",
  },
  pro: {
    slug: "pro",
    tagline: "Premium presentation.",
    bullets: ["Signature renderer", "Domain purchase", "Extended storage (25 GB)"],
    cta: "Get Pro",
    ctaHref: "/onboarding",
  },
  enterprise: {
    slug: "enterprise",
    tagline: "Multi-location and agency.",
    bullets: ["All Pro features", "Custom contract", "Priority support"],
    cta: "Contact Us",
    ctaHref: "mailto:hello@locallayer.com?subject=Enterprise%20inquiry",
  },
};

const DISPLAY_ORDER: PlanSlug[] = ["trial", "starter", "core", "pro", "enterprise"];

function PlanCard({
  slug,
  interval,
}: {
  slug: PlanSlug;
  interval: BillingInterval;
}) {
  const config = PLAN_CONFIGS[slug];
  const meta = PLAN_META[slug];
  const isHighlight = config.highlight;
  const yearly = interval === "yearly";

  let displayPrice: string;
  let displayInterval: string | null = null;
  let savingsNote: string | null = null;

  if (config.monthlyPrice === null) {
    displayPrice = "Custom";
  } else if (config.monthlyPrice === 0) {
    displayPrice = "Free";
  } else if (yearly && config.yearlyPricePerMonth !== null) {
    displayPrice = `$${config.yearlyPricePerMonth.toFixed(2)}`;
    displayInterval = "/mo";
    savingsNote = `$${config.yearlyPrice?.toFixed(2)}/yr — save $${((config.monthlyPrice * 12) - (config.yearlyPrice ?? 0)).toFixed(2)}`;
  } else {
    displayPrice = `$${config.monthlyPrice.toFixed(2)}`;
    displayInterval = "/mo";
  }

  return (
    <div
      className={[
        "relative flex flex-col gap-4 rounded-sm p-5 border transition-colors duration-150",
        isHighlight ? "bg-primary/5 border-primary/30" : "bg-card border-border",
      ].join(" ")}
    >
      {meta.badge && (
        <span
          className={[
            "absolute -top-px left-4 px-2 py-0.5 font-mono text-[9px] tracking-[0.18em] uppercase rounded-b-sm font-bold",
            isHighlight
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {meta.badge}
        </span>
      )}

      <div className="flex flex-col gap-1 pt-2">
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
          {slug}
        </span>
        <p className="font-heading text-lg font-semibold text-foreground leading-tight">
          {config.name}
        </p>
        <div className="flex items-baseline gap-0.5">
          <span className={["font-mono text-2xl font-bold", isHighlight ? "text-primary" : "text-foreground"].join(" ")}>
            {displayPrice}
          </span>
          {displayInterval && (
            <span className="font-mono text-xs text-muted-foreground">{displayInterval}</span>
          )}
        </div>
        {savingsNote && (
          <p className="font-mono text-[10px] text-primary leading-snug">{savingsNote}</p>
        )}
        <p className="text-xs text-muted-foreground leading-snug mt-0.5">{meta.tagline}</p>
      </div>

      <ul className="flex flex-col gap-1.5 flex-1">
        {meta.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className={["text-[11px] mt-0.5 shrink-0", isHighlight ? "text-primary" : "text-muted-foreground"].join(" ")}>✓</span>
            <span className="text-xs text-muted-foreground leading-snug">{b}</span>
          </li>
        ))}
      </ul>

      <Link
        href={meta.ctaHref}
        className={[
          "mt-auto flex items-center justify-center px-4 py-2 rounded-sm font-mono text-[11px] tracking-wide font-medium transition-all duration-150 hover:-translate-y-0.5",
          isHighlight
            ? "bg-primary text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
            : "bg-muted text-muted-foreground hover:text-foreground hover:border-border border border-transparent",
        ].join(" ")}
      >
        {meta.cta} →
      </Link>
    </div>
  );
}

export function PricingLoggedOutClient() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const yearly = interval === "yearly";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-primary">
          pricing
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl text-foreground tracking-tight">
          One platform. Clear plan state.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md leading-relaxed">
          Start free. Stay on Starter if you want to keep it simple. Upgrade when your business is ready.
        </p>

        {/* Billing interval toggle */}
        <div className="flex items-center gap-1 p-1 rounded-sm bg-muted border border-border mt-1">
          <button
            onClick={() => setInterval("monthly")}
            className={[
              "px-3 py-1 rounded-sm font-mono text-[10px] tracking-[0.12em] uppercase font-medium transition-all duration-150",
              !yearly
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("yearly")}
            className={[
              "flex items-center gap-1.5 px-3 py-1 rounded-sm font-mono text-[10px] tracking-[0.12em] uppercase font-medium transition-all duration-150",
              yearly
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            Yearly
            <span className="px-1 py-0.5 rounded-sm bg-primary/10 text-primary text-[8px] tracking-[0.1em] font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {DISPLAY_ORDER.map((slug) => (
          <PlanCard key={slug} slug={slug} interval={interval} />
        ))}
      </div>

      <p className="text-center font-mono text-[10px] text-muted-foreground/40 tracking-[0.15em]">
        All plans include your LocalLayer subdomain · No hidden fees · Cancel anytime
      </p>
    </div>
  );
}
