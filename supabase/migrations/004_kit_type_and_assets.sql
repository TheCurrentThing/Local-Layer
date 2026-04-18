-- Migration 004: kit_type on businesses + assets table
--
-- Adds:
--   businesses.kit_type   — which kit template a business uses; drives admin module
--                           visibility and public section rendering.
--   assets                — account-owned media library; all uploads register here
--                           so images can be reused across content blocks.

-- ── 1. kit_type column ──────────────────────────────────────────────────────────

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS kit_type text NOT NULL DEFAULT 'restaurant'
  CHECK (kit_type IN ('restaurant', 'food_truck', 'artist', 'trade'));

COMMENT ON COLUMN businesses.kit_type IS
  'Template type for this business. Controls which admin modules are visible '
  'and which public-page sections are rendered. Set at onboarding.';

-- ── 2. assets table ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assets (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      uuid        NOT NULL
                               REFERENCES businesses (id) ON DELETE CASCADE,

  -- Storage location
  storage_path     text        NOT NULL,     -- path inside 'restaurant-assets' bucket
  url              text        NOT NULL,     -- public or signed URL for rendering

  -- Type
  type             text        NOT NULL DEFAULT 'image'
                               CHECK (type IN ('image', 'video', 'document')),
  mime_type        text,                     -- e.g. 'image/webp', 'image/jpeg'
  filename         text,                     -- original upload filename

  -- Metadata
  alt_text         text,                     -- accessibility description
  width            integer,                  -- pixels (images only)
  height           integer,                  -- pixels (images only)
  file_size_bytes  integer,

  -- Organisation
  folder           text        NOT NULL DEFAULT 'general',
                   -- logical groupings: general | branding | hero | gallery | menu

  created_at       timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE assets IS
  'Account-owned media assets. Every upload goes through this table to enable '
  'reuse across content and a per-business media library view.';

COMMENT ON COLUMN assets.folder IS
  'Logical grouping used in the media library. '
  'Values: general, branding, hero, gallery, menu.';

COMMENT ON COLUMN assets.storage_path IS
  'Path within the Supabase Storage bucket "restaurant-assets". '
  'Used to generate signed URLs and for deletion.';

-- Fast lookup of all assets for a business (media library view)
CREATE INDEX IF NOT EXISTS assets_business_id_idx
  ON assets (business_id);

-- Folder-filtered listing (branding library, gallery library, etc.)
CREATE INDEX IF NOT EXISTS assets_business_folder_idx
  ON assets (business_id, folder);

-- Chronological ordering within a folder
CREATE INDEX IF NOT EXISTS assets_business_created_idx
  ON assets (business_id, created_at DESC);
