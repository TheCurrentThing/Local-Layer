-- ============================================================
-- Google Business Profile Integration
-- Adds 7 tables for OAuth, location mapping, sync queue,
-- audit log, reviews cache, and post tracking.
-- All tables are business_id scoped (multi-tenant safe).
-- ============================================================

-- ─── 1. google_connections ────────────────────────────────────────────────────
-- One OAuth connection per business. Stores encrypted tokens.

create table if not exists google_connections (
  id                  uuid primary key default gen_random_uuid(),
  business_id         uuid not null references businesses(id) on delete cascade,

  -- Google account identity (from userinfo endpoint)
  google_account_id   text not null,
  google_account_email text not null,

  -- AES-256-GCM encrypted token blobs (iv + tag + ciphertext, base64)
  access_token_enc    text,
  refresh_token_enc   text,
  token_expiry        timestamptz,
  scopes              text[] not null default '{}',

  -- Connection health
  status              text not null default 'active'
    check (status in ('active', 'expired', 'revoked', 'error')),
  error_message       text,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- One connection per business
create unique index if not exists google_connections_business_id_uidx
  on google_connections (business_id);

-- ─── 2. google_locations ──────────────────────────────────────────────────────
-- Maps a LocalLayer business to a specific GBP location.

create table if not exists google_locations (
  id                      uuid primary key default gen_random_uuid(),
  business_id             uuid not null references businesses(id) on delete cascade,
  google_connection_id    uuid not null references google_connections(id) on delete cascade,

  -- GBP resource identifiers
  google_account_name     text not null,   -- e.g. "accounts/123456789"
  google_location_name    text not null,   -- e.g. "accounts/123456789/locations/987654321"
  google_location_id      text not null,   -- short numeric ID for reference

  display_name            text not null,   -- business title on Google

  -- State
  is_primary              boolean not null default true,
  sync_enabled            boolean not null default true,
  verification_state      text,            -- 'VERIFIED' | 'UNVERIFIED' | 'PENDING'

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists google_locations_business_id_idx
  on google_locations (business_id);

-- Only one primary location per business
create unique index if not exists google_locations_business_primary_uidx
  on google_locations (business_id) where is_primary = true;

-- ─── 3. google_sync_settings ──────────────────────────────────────────────────
-- Per-business sync configuration and last-sync metadata.

create table if not exists google_sync_settings (
  id                          uuid primary key default gen_random_uuid(),
  business_id                 uuid not null references businesses(id) on delete cascade unique,

  sync_hours                  boolean not null default true,
  sync_photos                 boolean not null default false,
  sync_specials_as_posts      boolean not null default true,
  sync_announcements_as_posts boolean not null default true,
  auto_publish_google_posts   boolean not null default true,

  -- Last sync metadata
  last_hours_sync_at          timestamptz,
  last_hours_sync_status      text,        -- 'success' | 'failed'
  last_posts_sync_at          timestamptz,

  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists google_sync_settings_business_id_idx
  on google_sync_settings (business_id);

-- ─── 4. google_sync_jobs ──────────────────────────────────────────────────────
-- Outbound sync queue. Admin writes save to LocalLayer first;
-- Google sync happens asynchronously via this queue.

create table if not exists google_sync_jobs (
  id                  uuid primary key default gen_random_uuid(),
  business_id         uuid not null references businesses(id) on delete cascade,

  job_type            text not null
    check (job_type in ('sync_hours', 'create_post', 'update_post', 'delete_post', 'upload_photo')),

  source_entity_type  text,    -- 'special' | 'announcement' | 'hours' | 'photo'
  source_entity_id    uuid,    -- uuid of the source entity (not FK enforced for flexibility)

  payload             jsonb not null default '{}',

  status              text not null default 'pending'
    check (status in ('pending', 'processing', 'success', 'failed', 'cancelled')),

  attempts            integer not null default 0,
  max_attempts        integer not null default 3,
  last_error          text,

  scheduled_at        timestamptz not null default now(),
  started_at          timestamptz,
  completed_at        timestamptz,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists google_sync_jobs_business_status_idx
  on google_sync_jobs (business_id, status);

-- Partial index for fast pending job polling
create index if not exists google_sync_jobs_pending_idx
  on google_sync_jobs (status, scheduled_at)
  where status = 'pending';

-- ─── 5. google_sync_events ────────────────────────────────────────────────────
-- Append-only audit log. Never updated — insert only.

create table if not exists google_sync_events (
  id              uuid primary key default gen_random_uuid(),
  business_id     uuid not null references businesses(id) on delete cascade,
  job_id          uuid references google_sync_jobs(id) on delete set null,

  event_type      text not null,
  -- 'job_created' | 'job_started' | 'job_success' | 'job_failed'
  -- 'connection_made' | 'connection_revoked' | 'location_mapped'
  -- 'reviews_fetched' | 'settings_updated'

  entity_type     text,
  entity_id       uuid,

  payload         jsonb default '{}',
  error           text,

  created_at      timestamptz not null default now()
);

create index if not exists google_sync_events_business_created_idx
  on google_sync_events (business_id, created_at desc);

create index if not exists google_sync_events_job_idx
  on google_sync_events (job_id)
  where job_id is not null;

-- ─── 6. google_reviews_cache ──────────────────────────────────────────────────
-- Cached reviews fetched from GBP. Read-only mirror — not written by admin.

create table if not exists google_reviews_cache (
  id                  uuid primary key default gen_random_uuid(),
  business_id         uuid not null references businesses(id) on delete cascade,

  google_review_id    text not null,
  reviewer_name       text,
  reviewer_photo_url  text,

  -- GBP returns textual star ratings
  star_rating         text not null
    check (star_rating in ('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE')),
  rating_numeric      smallint not null
    check (rating_numeric between 1 and 5),

  comment             text,
  create_time         timestamptz,
  update_time         timestamptz,

  -- Reply (written by business)
  reply_comment       text,
  reply_time          timestamptz,

  fetched_at          timestamptz not null default now(),

  unique (business_id, google_review_id)
);

create index if not exists google_reviews_cache_business_created_idx
  on google_reviews_cache (business_id, create_time desc);

-- ─── 7. google_posts_map ──────────────────────────────────────────────────────
-- Bidirectional mapping: LocalLayer entity ↔ GBP local post resource name.
-- Prevents duplicate post creation on re-sync.

create table if not exists google_posts_map (
  id                    uuid primary key default gen_random_uuid(),
  business_id           uuid not null references businesses(id) on delete cascade,

  source_entity_type    text not null,   -- 'special' | 'announcement'
  source_entity_id      uuid not null,

  google_post_name      text not null,   -- GBP post resource name
  google_location_name  text not null,

  status                text not null default 'active'
    check (status in ('active', 'deleted')),

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  unique (business_id, source_entity_type, source_entity_id)
);

create index if not exists google_posts_map_business_idx
  on google_posts_map (business_id);

create index if not exists google_posts_map_source_idx
  on google_posts_map (business_id, source_entity_type, source_entity_id);
