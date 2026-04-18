-- Migration 007: subscriptions table
--
-- Introduces a first-class billing/subscription layer.
-- Plans are code-defined (see src/lib/plan-config.ts).
-- This table tracks the business's current plan relationship.
--
-- Design decisions:
--   UNIQUE on business_id  — one subscription record per business
--   No record = free tier  — graceful fallback, no required seeding
--   provider = 'none'      — billing managed externally or not yet connected
--   provider = 'stripe'    — Stripe integration (future)

CREATE TABLE IF NOT EXISTS subscriptions (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id              uuid        NOT NULL UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
  plan_slug                text        NOT NULL DEFAULT 'free'
                                         CHECK (plan_slug IN ('free', 'core', 'pro', 'enterprise')),
  status                   text        NOT NULL DEFAULT 'active'
                                         CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'paused')),
  billing_interval         text        CHECK (billing_interval IN ('monthly', 'yearly')),
  provider                 text        NOT NULL DEFAULT 'none'
                                         CHECK (provider IN ('none', 'stripe')),
  provider_customer_id     text,
  provider_subscription_id text,
  current_period_start     timestamptz,
  current_period_end       timestamptz,
  cancel_at_period_end     boolean     NOT NULL DEFAULT false,
  trial_end                timestamptz,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_business_id ON subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_slug   ON subscriptions(plan_slug);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status      ON subscriptions(status);

COMMENT ON TABLE subscriptions IS
  'One record per business. No record means free tier. Plans are code-defined in src/lib/plan-config.ts.';

COMMENT ON COLUMN subscriptions.provider IS
  'Billing provider: none = no provider / managed externally; stripe = Stripe integration.';

COMMENT ON COLUMN subscriptions.plan_slug IS
  'References code-defined plan in src/lib/plan-config.ts. free/core/pro/enterprise.';
