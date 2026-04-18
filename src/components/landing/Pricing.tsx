import Link from "next/link";
import { getAdminUser } from "@/lib/admin-auth";
import { getCurrentAdminBusinessId } from "@/lib/business";
import { getBusinessSubscription, deriveDisplayState } from "@/lib/billing-queries";
import type { SubscriptionDisplayState } from "@/types/billing";

// ─── LOGGED-OUT VIEW ─────────────────────────────────────────────────────────

type PlanCard = {
  slug: string;
  name: string;
  price: string;
  interval?: string;
  tagline: string;
  bullets: string[];
  cta: string;
  ctaHref: string;
  highlight?: boolean;
  badge?: string;
};

const PLAN_CARDS: PlanCard[] = [
  {
    slug: "trial",
    name: "Free Trial",
    price: "Free",
    tagline: "10 days to try the full platform.",
    bullets: [
      "Site live immediately",
      "Access to premium features",
      "No credit card required",
    ],
    cta: "Start Free Trial",
    ctaHref: "/onboarding",
    badge: "No credit card",
  },
  {
    slug: "starter",
    name: "Starter",
    price: "$5",
    interval: "/mo",
    tagline: "Keep your business live.",
    bullets: [
      "Site live at your subdomain",
      "Full content management",
      "Upgrade anytime",
    ],
    cta: "Get Starter",
    ctaHref: "/onboarding",
  },
  {
    slug: "core",
    name: "Core",
    price: "$19",
    interval: "/mo",
    tagline: "The full operating tier.",
    bullets: [
      "Custom domain",
      "Google Business sync",
      "All site modules",
    ],
    cta: "Get Core",
    ctaHref: "/onboarding",
    highlight: true,
    badge: "Most popular",
  },
  {
    slug: "pro",
    name: "Pro",
    price: "$79",
    interval: "/mo",
    tagline: "Premium presentation.",
    bullets: [
      "Signature renderer",
      "Domain purchase",
      "Extended storage (25 GB)",
    ],
    cta: "Get Pro",
    ctaHref: "/onboarding",
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    price: "Custom",
    tagline: "Multi-location and agency.",
    bullets: [
      "All Pro features",
      "Custom contract",
      "Priority support",
    ],
    cta: "Contact Us",
    ctaHref: "mailto:hello@locallayer.com?subject=Enterprise%20inquiry",
  },
];

function PlanCardView({ plan }: { plan: PlanCard }) {
  const isHighlight = plan.highlight;

  return (
    <div
      className={[
        "relative flex flex-col gap-4 rounded-sm p-5 border transition-colors duration-150",
        isHighlight
          ? "bg-primary/5 border-primary/30"
          : "bg-card border-border",
      ].join(" ")}
    >
      {plan.badge && (
        <span
          className={[
            "absolute -top-px left-4 px-2 py-0.5 font-mono text-[9px] tracking-[0.18em] uppercase rounded-b-sm font-bold",
            isHighlight
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {plan.badge}
        </span>
      )}

      <div className="flex flex-col gap-1 pt-2">
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
          {plan.slug}
        </span>
        <p className="font-heading text-lg font-semibold text-foreground leading-tight">
          {plan.name}
        </p>
        <div className="flex items-baseline gap-0.5">
          <span className={["font-mono text-2xl font-bold", isHighlight ? "text-primary" : "text-foreground"].join(" ")}>
            {plan.price}
          </span>
          {plan.interval && (
            <span className="font-mono text-xs text-muted-foreground">{plan.interval}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-snug mt-0.5">{plan.tagline}</p>
      </div>

      <ul className="flex flex-col gap-1.5 flex-1">
        {plan.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className={["text-[11px] mt-0.5 shrink-0", isHighlight ? "text-primary" : "text-muted-foreground"].join(" ")}>✓</span>
            <span className="text-xs text-muted-foreground leading-snug">{b}</span>
          </li>
        ))}
      </ul>

      <Link
        href={plan.ctaHref}
        className={[
          "mt-auto flex items-center justify-center px-4 py-2 rounded-sm font-mono text-[11px] tracking-wide font-medium transition-all duration-150 hover:-translate-y-0.5",
          isHighlight
            ? "bg-primary text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
            : "bg-muted text-muted-foreground hover:text-foreground hover:border-border border border-transparent",
        ].join(" ")}
      >
        {plan.cta} →
      </Link>
    </div>
  );
}

function PricingLoggedOut() {
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {PLAN_CARDS.map((plan) => (
          <PlanCardView key={plan.slug} plan={plan} />
        ))}
      </div>

      <p className="text-center font-mono text-[10px] text-muted-foreground/40 tracking-[0.15em]">
        All plans include your LocalLayer subdomain · No hidden fees · Cancel anytime
      </p>
    </div>
  );
}

// ─── LOGGED-IN VIEW ───────────────────────────────────────────────────────────

type UpgradeOption = {
  planName: string;
  planSlug: string;
  price: string;
  headline: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  highlight?: boolean;
};

function getUpgradeOptions(display: SubscriptionDisplayState): UpgradeOption[] {
  const { planSlug } = display;

  switch (planSlug) {
    case "trial":
      return [
        {
          planName: "Starter",
          planSlug: "starter",
          price: "$5/mo",
          headline: "Keep your site live",
          bullets: ["Site stays online", "Content preserved", "Upgrade anytime"],
          ctaLabel: "Switch to Starter",
          ctaHref: "mailto:hello@locallayer.com?subject=Switch%20to%20Starter%20plan",
        },
        {
          planName: "Core",
          planSlug: "core",
          price: "$19/mo",
          headline: "Custom domain + Google sync",
          bullets: ["Connect your domain", "Google Business sync", "All modules"],
          ctaLabel: "Upgrade to Core",
          ctaHref: "mailto:hello@locallayer.com?subject=Upgrade%20to%20Core%20plan",
          highlight: true,
        },
        {
          planName: "Pro",
          planSlug: "pro",
          price: "$79/mo",
          headline: "Premium presentation",
          bullets: ["Signature renderer", "Domain purchase", "Extended storage"],
          ctaLabel: "Upgrade to Pro",
          ctaHref: "mailto:hello@locallayer.com?subject=Upgrade%20to%20Pro%20plan",
        },
      ];
    case "starter":
      return [
        {
          planName: "Core",
          planSlug: "core",
          price: "$19/mo",
          headline: "Ready to grow?",
          bullets: ["Custom domain", "Google Business sync", "Full module access"],
          ctaLabel: "Upgrade to Core",
          ctaHref: "mailto:hello@locallayer.com?subject=Upgrade%20to%20Core%20plan",
          highlight: true,
        },
        {
          planName: "Pro",
          planSlug: "pro",
          price: "$79/mo",
          headline: "Premium platform",
          bullets: ["Signature renderer", "Domain purchase", "25 GB storage"],
          ctaLabel: "Upgrade to Pro",
          ctaHref: "mailto:hello@locallayer.com?subject=Upgrade%20to%20Pro%20plan",
        },
      ];
    case "core":
      return [
        {
          planName: "Pro",
          planSlug: "pro",
          price: "$79/mo",
          headline: "Take it further",
          bullets: ["Signature renderer", "Buy a domain via LocalLayer", "Extended storage"],
          ctaLabel: "Upgrade to Pro",
          ctaHref: "mailto:hello@locallayer.com?subject=Upgrade%20to%20Pro%20plan",
          highlight: true,
        },
      ];
    case "enterprise":
      return [
        {
          planName: "Enterprise",
          planSlug: "enterprise",
          price: "Custom",
          headline: "Your account team is here.",
          bullets: ["Custom contract", "Priority support", "Multi-location setup"],
          ctaLabel: "Contact support",
          ctaHref: "mailto:hello@locallayer.com?subject=Enterprise%20support",
        },
      ];
    default:
      return [];
  }
}

function PricingLoggedIn({ display }: { display: SubscriptionDisplayState }) {
  const upgradeOptions = getUpgradeOptions(display);
  const showTrialWarning = display.isOnTrial && display.trialDaysRemaining !== null && display.trialDaysRemaining <= 5;

  const statusColor =
    display.isCanceled ? "#6b7280"
    : display.isPastDue ? "#f87171"
    : display.isOnTrial ? "#34d399"
    : display.isOnStarter ? "hsl(var(--muted-foreground))"
    : "hsl(var(--primary))";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-primary">
          your plan
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl text-foreground tracking-tight">
          {display.isCanceled
            ? "Your site is currently offline."
            : `You're on ${display.planName}.`}
        </h2>
      </div>

      {/* Current plan card */}
      <div className="max-w-lg mx-auto w-full rounded-sm border border-border bg-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: statusColor }}
            />
            <span className="font-heading text-lg font-semibold text-foreground">
              {display.planName}
            </span>
            <span
              className="font-mono text-[9px] tracking-[0.18em] uppercase px-2 py-0.5 rounded-sm font-bold"
              style={{ color: statusColor, background: `${statusColor}18` }}
            >
              {display.isCanceled ? "Offline"
               : display.isPastDue ? "Past due"
               : display.status === "active" ? "Active"
               : display.status}
            </span>
          </div>
          <Link
            href="/admin/billing"
            className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
          >
            Manage →
          </Link>
        </div>

        {showTrialWarning && display.trialDaysRemaining !== null && (
          <div className="rounded-sm border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="font-mono text-xs text-primary">
              {display.trialDaysRemaining === 0
                ? "Your trial ends today. Choose a plan to keep your site live."
                : `${display.trialDaysRemaining} day${display.trialDaysRemaining === 1 ? "" : "s"} left in your trial. Choose a plan to keep your site live.`}
            </p>
          </div>
        )}

        {display.isCanceled && (
          <div className="rounded-sm border border-border bg-muted/40 px-4 py-3">
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              Your content is preserved. Email{" "}
              <a href="mailto:hello@locallayer.com" className="text-primary underline-offset-2 hover:underline">
                hello@locallayer.com
              </a>{" "}
              to reactivate.
            </p>
          </div>
        )}

        {display.isOnStarter && !display.isCanceled && (
          <p className="font-mono text-xs text-muted-foreground leading-relaxed">
            Your site is live at your LocalLayer subdomain. Upgrade to Core to connect your own domain and sync with Google.
          </p>
        )}

        {(display.planSlug === "pro" || display.planSlug === "enterprise") && !display.isCanceled && (
          <p className="font-mono text-xs text-muted-foreground leading-relaxed">
            You&apos;re on the full platform. All features are active.{" "}
            {display.renewalDate && (
              <>Renews {display.renewalDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.</>
            )}
          </p>
        )}

        {display.planSlug === "core" && !display.isCanceled && (
          <p className="font-mono text-xs text-muted-foreground leading-relaxed">
            Custom domain and Google sync are active.
            {display.renewalDate && (
              <> Renews {display.renewalDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.</>
            )}
          </p>
        )}
      </div>

      {/* Upgrade options */}
      {upgradeOptions.length > 0 && !display.isCanceled && (
        <div className={[
          "grid gap-3 max-w-2xl mx-auto w-full",
          upgradeOptions.length === 1 ? "grid-cols-1 max-w-sm" : "grid-cols-1 sm:grid-cols-2",
        ].join(" ")}>
          {upgradeOptions.map((opt) => (
            <div
              key={opt.planSlug}
              className={[
                "flex flex-col gap-3 rounded-sm border p-4",
                opt.highlight ? "bg-primary/5 border-primary/30" : "bg-card border-border",
              ].join(" ")}
            >
              {opt.highlight && (
                <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-primary font-bold">
                  Recommended
                </span>
              )}
              <div>
                <p className="font-heading text-base font-semibold text-foreground">{opt.planName}</p>
                <p className="font-mono text-xs text-muted-foreground">{opt.price} · {opt.headline}</p>
              </div>
              <ul className="flex flex-col gap-1">
                {opt.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="text-[10px] mt-0.5 shrink-0 text-muted-foreground">✓</span>
                    <span className="text-xs text-muted-foreground leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={opt.ctaHref}
                className={[
                  "flex items-center justify-center px-4 py-2 rounded-sm font-mono text-[11px] tracking-wide font-medium transition-all duration-150 hover:-translate-y-0.5",
                  opt.highlight
                    ? "bg-primary text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                    : "bg-muted text-muted-foreground hover:text-foreground border border-border",
                ].join(" ")}
              >
                {opt.ctaLabel} →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export default async function Pricing() {
  // Try to resolve the logged-in user and their subscription state.
  // Fail gracefully — if anything goes wrong, show the logged-out view.
  let display: SubscriptionDisplayState | null = null;

  try {
    const user = await getAdminUser();
    if (user) {
      const businessId = await getCurrentAdminBusinessId();
      const subscription = await getBusinessSubscription(businessId);
      display = deriveDisplayState(subscription);
    }
  } catch {
    // Auth or billing not configured — show logged-out marketing view.
  }

  return (
    <section
      id="pricing"
      className="bg-background py-24 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {display ? (
          <PricingLoggedIn display={display} />
        ) : (
          <PricingLoggedOut />
        )}
      </div>
    </section>
  );
}
