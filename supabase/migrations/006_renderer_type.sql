-- Migration 006: renderer_type on businesses
--
-- Introduces a first-class visual rendering engine choice.
--
-- kit_type   → WHAT kind of business (product config, module availability)
-- renderer_type → HOW that business website is visually presented
--
-- Values:
--   standard  : kit-driven section renderer (current default)
--   signature : premium full-section renderer for higher tiers

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS renderer_type text NOT NULL DEFAULT 'standard'
    CHECK (renderer_type IN ('standard', 'signature'));

COMMENT ON COLUMN businesses.renderer_type IS
  'Visual rendering engine. standard = kit-driven sections; signature = full premium layout.';
