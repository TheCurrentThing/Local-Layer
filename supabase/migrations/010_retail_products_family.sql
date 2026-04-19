-- Migration: 010_retail_products_family.sql
--
-- Introduces the Retail & Products kit family with six categories:
--   artist, maker, retail, brand, vintage, collector
--
-- Also introduces product_collections and products tables for the new family.
--
-- Self-contained: adds kit_family/kit_category columns if not yet present
-- (safe to run whether or not 009 has been applied).
--
-- Transition strategy:
--   • 'creative' family (artist) is consolidated into 'retail_products'
--   • 'retail' placeholder family is renamed to 'retail_products'
--   • kit_category constraint is expanded for all six retail_products categories

BEGIN;

-- ── Product Collections table ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS product_collections (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name        text NOT NULL,
  slug        text NOT NULL,
  description text,
  sort_order  int  NOT NULL DEFAULT 0,
  is_active   bool NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS product_collections_business_slug_idx
  ON product_collections(business_id, slug);

COMMENT ON TABLE product_collections IS
  'Product collections for Retail & Products kit family businesses. '
  'Collections group related products into series, lines, or curated sets.';

-- ── Products table ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  collection_id uuid REFERENCES product_collections(id) ON DELETE SET NULL,
  name          text NOT NULL,
  description   text,
  price         numeric(10,2),
  tags          text[] NOT NULL DEFAULT '{}',
  is_featured   bool NOT NULL DEFAULT false,
  is_available  bool NOT NULL DEFAULT true,
  is_active     bool NOT NULL DEFAULT true,
  sort_order    int  NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_business_id_idx   ON products(business_id);
CREATE INDEX IF NOT EXISTS products_collection_id_idx ON products(collection_id);

COMMENT ON TABLE products IS
  'Product catalog for Retail & Products kit family businesses. '
  'Replaces menu_items for non-food-service categories.';

ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products             ENABLE ROW LEVEL SECURITY;

-- ── Ensure kit_family + kit_category columns exist ───────────────────────────
-- These were added in 009. Adding them here (IF NOT EXISTS) makes this migration
-- safe to run as the first migration in a fresh database.

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS kit_family text NOT NULL DEFAULT 'food_service';

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS kit_category text NOT NULL DEFAULT 'restaurant';

-- ── Drop all existing family/category/type constraints ────────────────────────

ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_kit_family_check;
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_kit_category_check;
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_kit_type_check;

-- ── Backfill kit_family + kit_category from kit_type where still at defaults ──
-- Covers rows that 009 never backfilled (fresh DB, or 009 was skipped).

UPDATE businesses
  SET
    kit_family = CASE kit_type
      WHEN 'restaurant' THEN 'food_service'
      WHEN 'food_truck' THEN 'food_service'
      WHEN 'cafe'       THEN 'food_service'
      WHEN 'diner'      THEN 'food_service'
      WHEN 'pop_up'     THEN 'food_service'
      WHEN 'bar'        THEN 'food_service'
      WHEN 'artist'     THEN 'retail_products'
      WHEN 'trade'      THEN 'services'
      ELSE 'food_service'
    END,
    kit_category = CASE kit_type
      WHEN 'restaurant' THEN 'restaurant'
      WHEN 'food_truck' THEN 'food_truck'
      WHEN 'cafe'       THEN 'cafe'
      WHEN 'diner'      THEN 'diner'
      WHEN 'pop_up'     THEN 'pop_up'
      WHEN 'bar'        THEN 'bar'
      WHEN 'artist'     THEN 'artist'
      WHEN 'trade'      THEN 'trade'
      ELSE 'restaurant'
    END
  WHERE kit_category = 'restaurant' AND kit_type <> 'restaurant';

-- ── Consolidate old family values into retail_products ────────────────────────
-- 'creative' and 'retail' were placeholder values — both map to 'retail_products'.

UPDATE businesses
  SET kit_family = 'retail_products'
  WHERE kit_family IN ('creative', 'retail');

-- ── Apply final constraints ───────────────────────────────────────────────────

ALTER TABLE businesses
  ADD CONSTRAINT businesses_kit_family_check
  CHECK (kit_family IN ('food_service', 'services', 'retail_products'));

ALTER TABLE businesses
  ADD CONSTRAINT businesses_kit_category_check
  CHECK (kit_category IN (
    -- Food Service
    'cafe', 'diner', 'restaurant', 'pop_up', 'food_truck', 'bar',
    -- Services (legacy 'trade' kept for transition window — see migration 011)
    'trade',
    -- Retail & Products
    'artist', 'maker', 'retail', 'brand', 'vintage', 'collector'
  ));

ALTER TABLE businesses
  ADD CONSTRAINT businesses_kit_type_check
  CHECK (kit_type IN (
    'restaurant', 'food_truck', 'cafe', 'diner', 'pop_up', 'bar',
    'trade',
    'artist', 'maker', 'retail', 'brand', 'vintage', 'collector'
  ));

COMMIT;
