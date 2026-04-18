-- ─── MIGRATION 008: PLAN MODEL UPDATE ──────────────────────────────────────
--
-- Replaces the Free/Core/Pro/Enterprise model with Trial/Starter/Core/Pro/Enterprise.
-- Starter is the retention plan ("keep your site live").
-- Trial is the onboarding plan (90-day broad access).
--
-- Changes:
--   1. Add trial, starter to plan_slug constraint
--   2. Migrate existing `free` rows → `starter`
--   3. Remove `free` from plan_slug constraint
--   4. Add canceled_at column

BEGIN;

-- Step 1: Drop the current plan_slug CHECK constraint
ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_plan_slug_check;

-- Step 2: Add updated constraint that includes trial and starter, keeps free
-- temporarily so we can migrate without violating the constraint mid-flight
ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_plan_slug_check
  CHECK (plan_slug IN ('free', 'trial', 'starter', 'core', 'pro', 'enterprise'));

-- Step 3: Migrate existing free-tier records to starter
UPDATE subscriptions
  SET plan_slug  = 'starter',
      updated_at = now()
  WHERE plan_slug = 'free';

-- Step 4: Drop temporary constraint and replace without `free`
ALTER TABLE subscriptions
  DROP CONSTRAINT subscriptions_plan_slug_check;

ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_plan_slug_check
  CHECK (plan_slug IN ('trial', 'starter', 'core', 'pro', 'enterprise'));

-- Step 5: Add canceled_at column (when the subscription was fully canceled)
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS canceled_at timestamptz;

COMMIT;
