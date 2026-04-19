-- Migration: 011_services_family.sql
--
-- Introduces the Services kit family with five conversion-based categories:
--   on_demand, project, scheduled, professional, mobile
--
-- Also introduces service_offerings, service_areas, and testimonials tables.
--
-- Transition strategy:
--   • 'trade' (migration 009) mapped to the 'services' family with kit_category='trade'.
--     It is now remapped to kit_category='project' (closest semantic match for
--     contractors/trade professionals). Migration 011 backfills this in the DB;
--     resolveKitIdentity() handles the transition window at the application layer.
--   • kit_type column is kept for backward compat — also updated to 'project'.
--   • All existing food_service and retail_products data is untouched.

BEGIN;

-- ── Service Offerings table ───────────────────────────────────────────────────
--
-- Represents the service catalog for Services-family businesses.
-- Plays the same role as menu_items for food_service businesses.

CREATE TABLE IF NOT EXISTS service_offerings (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id       uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title             text NOT NULL,
  short_description text,
  full_description  text,
  starting_price    text,   -- free-text range, e.g. "Starting at $150" or "From $95/hr"
  is_featured       bool NOT NULL DEFAULT false,
  is_active         bool NOT NULL DEFAULT true,
  sort_order        int  NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS service_offerings_business_id_idx ON service_offerings(business_id);

COMMENT ON TABLE service_offerings IS
  'Service offerings / catalog for Services-family businesses. '
  'Analogous to menu_items for food_service. '
  'Covers on-demand, project, scheduled, professional, and mobile service types.';

-- ── Service Areas table ───────────────────────────────────────────────────────
--
-- Geographic coverage areas for on_demand and mobile service businesses.

CREATE TABLE IF NOT EXISTS service_areas (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name        text NOT NULL,   -- e.g. "Downtown Austin", "Travis County", "78701"
  sort_order  int  NOT NULL DEFAULT 0,
  is_active   bool NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS service_areas_business_id_idx ON service_areas(business_id);

COMMENT ON TABLE service_areas IS
  'Geographic service coverage areas for on_demand and mobile service businesses. '
  'Rendered as a coverage list on the public site.';

-- ── Testimonials table ────────────────────────────────────────────────────────
--
-- Client testimonials — available to all families but most central to services.

CREATE TABLE IF NOT EXISTS testimonials (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  body        text NOT NULL,
  rating      smallint CHECK (rating BETWEEN 1 AND 5),
  is_featured bool NOT NULL DEFAULT false,
  is_active   bool NOT NULL DEFAULT true,
  sort_order  int  NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS testimonials_business_id_idx ON testimonials(business_id);

COMMENT ON TABLE testimonials IS
  'Client testimonials. Central trust signal for Services-family businesses. '
  'Available to all kit families.';

-- ── Enable Row Level Security ─────────────────────────────────────────────────

ALTER TABLE service_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas     ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials      ENABLE ROW LEVEL SECURITY;

-- ── kit_category constraint update ────────────────────────────────────────────
-- Add the five new services categories.
-- 'trade' is kept in the constraint temporarily to cover the backfill window.

ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_kit_category_check;

ALTER TABLE businesses
  ADD CONSTRAINT businesses_kit_category_check
  CHECK (kit_category IN (
    -- Food Service family
    'cafe', 'diner', 'restaurant', 'pop_up', 'food_truck', 'bar',
    -- Services family — five conversion-based categories
    'on_demand', 'project', 'scheduled', 'professional', 'mobile',
    -- Services legacy (migration 009 → 011 transition window)
    'trade',
    -- Retail & Products family
    'artist', 'maker', 'retail', 'brand', 'vintage', 'collector'
  ));

-- ── kit_type constraint update ────────────────────────────────────────────────

ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_kit_type_check;

ALTER TABLE businesses
  ADD CONSTRAINT businesses_kit_type_check
  CHECK (kit_type IN (
    -- Food Service
    'restaurant', 'food_truck', 'cafe', 'diner', 'pop_up', 'bar',
    -- Services (new)
    'on_demand', 'project', 'scheduled', 'professional', 'mobile',
    -- Services legacy
    'trade',
    -- Retail & Products
    'artist', 'maker', 'retail', 'brand', 'vintage', 'collector'
  ));

-- ── Backfill: trade → project ─────────────────────────────────────────────────
-- Businesses onboarded as 'trade' map to 'project' (contractor / trade professional).
-- kit_family stays 'services' — no change needed there.

UPDATE businesses
  SET
    kit_category = 'project',
    kit_type     = 'project'
  WHERE kit_category = 'trade' OR kit_type = 'trade';

COMMIT;
