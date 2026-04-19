-- Migration: 012_onboarding_complete.sql
--
-- Adds an onboarding_complete flag to the businesses table.
--
-- Why DEFAULT true:
--   Every business that existed before this migration was created through a
--   deliberate setup path (either the onboarding flow or programmatic seeding),
--   so they are all considered complete. New businesses created via the public
--   onboarding flow will have this set explicitly to true by the server action
--   once the user finishes the kit-selection and site-generation steps.
--
-- Forward path:
--   The admin layout guard checks onboarding_complete = true before allowing
--   access to the dashboard. Users who sign up but abandon before completing
--   the kit step are redirected back to /onboarding to finish.

BEGIN;

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS onboarding_complete boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN businesses.onboarding_complete IS
  'Set to true when the user completes the onboarding flow (kit selection + site generation). '
  'Existing businesses inherit DEFAULT true. New sign-ups start as true only after '
  'createOnboardingBusiness() succeeds — partial sign-ups (account created, no business yet) '
  'have no row here and are caught by the "no business found" branch of the guard.';

COMMIT;
