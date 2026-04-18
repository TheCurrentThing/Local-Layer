-- ============================================================
-- Migration 002: Add Launch/Publish State + Enrich Domain Model
-- Safe to run multiple times (uses IF NOT EXISTS / DO block guards).
-- Run AFTER 001_add_multi_tenancy.sql on existing installs.
-- ============================================================

-- ─── 1. BUSINESSES: ADD site_status COLUMN ──────────────────────────────────
-- Possible values: 'draft' | 'ready' | 'live' | 'paused'
-- draft  → site is being configured, not publicly accessible
-- ready  → setup complete, waiting to go live
-- live   → fully public, resolves normally via slug + domains
-- paused → temporarily taken offline, not publicly accessible

alter table businesses
  add column if not exists site_status text not null default 'draft';

-- Constrain to valid states
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'businesses_site_status_check'
  ) then
    alter table businesses
      add constraint businesses_site_status_check
      check (site_status in ('draft', 'ready', 'live', 'paused'));
  end if;
end;
$$;

create index if not exists businesses_site_status_idx on businesses (site_status);

-- ─── 2. BUSINESS_DOMAINS: ENRICH SCHEMA ─────────────────────────────────────
-- Add verification + status tracking columns to business_domains.
-- status: 'pending' | 'verified' | 'active' | 'failed'
--   pending  → added but TXT record not yet checked
--   verified → TXT record confirmed; awaiting SSL/activation
--   active   → domain is live, resolving traffic correctly
--   failed   → verification check failed; user must fix DNS

alter table business_domains
  add column if not exists status text not null default 'pending';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'business_domains_status_check'
  ) then
    alter table business_domains
      add constraint business_domains_status_check
      check (status in ('pending', 'verified', 'active', 'failed'));
  end if;
end;
$$;

alter table business_domains
  add column if not exists verification_token text;

alter table business_domains
  add column if not exists last_checked_at timestamptz;

alter table business_domains
  add column if not exists notes text;

create index if not exists business_domains_status_idx on business_domains (status);

-- ─── 3. SEED: MARK EXISTING LIVE BUSINESSES ─────────────────────────────────
-- Any business that already has business_settings (i.e. was previously configured
-- in a single-tenant install) should start in 'live' state so existing deployments
-- don't break. New businesses created via /api/onboard start in 'draft'.

update businesses b
  set site_status = 'live'
  where site_status = 'draft'
    and exists (
      select 1 from business_settings bs where bs.business_id = b.id
    );

-- ─── DONE ────────────────────────────────────────────────────────────────────
-- After running this migration:
-- 1. Existing businesses with settings are now 'live' (no user disruption).
-- 2. New businesses from /api/onboard start as 'draft'.
-- 3. business_domains now has: status, verification_token, last_checked_at, notes.
-- 4. The admin Launch page can drive the draft → ready → live flow.
