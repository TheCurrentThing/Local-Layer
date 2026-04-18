-- ============================================================
-- Migration 001: Add Multi-Tenancy
-- Run this against an existing single-tenant BranchKit database.
-- Safe to run multiple times (uses IF NOT EXISTS / IF EXISTS guards).
-- ============================================================

-- ─── 1. CREATE BUSINESSES TABLE ─────────────────────────────────────────────
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── 2. SEED DEFAULT BUSINESS FROM EXISTING SETTINGS ────────────────────────
-- Reads the existing business_name to create the default business row.
-- Uses a slugified version of the name as the slug.
-- If business_settings is empty, falls back to slug='default'.
do $$
declare
  existing_name text;
  existing_slug text;
begin
  -- Try to get name from existing settings
  select business_name into existing_name
  from business_settings
  order by created_at
  limit 1;

  if existing_name is not null then
    -- Slugify: lowercase, replace non-alphanumeric with hyphen, trim hyphens
    existing_slug := lower(
      regexp_replace(
        regexp_replace(
          regexp_replace(existing_name, '[^a-zA-Z0-9\s]', '', 'g'),
          '\s+', '-', 'g'
        ),
        '^-+|-+$', '', 'g'
      )
    );

    -- If slug is empty after slugification, fall back
    if existing_slug = '' then
      existing_slug := 'default';
    end if;

    insert into businesses (slug, name)
    values (existing_slug, existing_name)
    on conflict (slug) do nothing;
  end if;

  -- If still no business row (empty DB or conflict), insert placeholder
  if not exists (select 1 from businesses) then
    insert into businesses (slug, name) values ('default', 'My Business');
  end if;
end;
$$;

-- ─── 3. BUSINESS_SETTINGS: ADD business_id ──────────────────────────────────
alter table business_settings
  add column if not exists business_id uuid references businesses(id) on delete cascade;

update business_settings
  set business_id = (select id from businesses order by created_at limit 1)
  where business_id is null;

alter table business_settings
  alter column business_id set not null;

create index if not exists business_settings_business_id_idx on business_settings (business_id);

-- ─── 4. ANNOUNCEMENTS: ADD business_id ──────────────────────────────────────
alter table announcements
  add column if not exists business_id uuid references businesses(id) on delete cascade;

update announcements
  set business_id = (select id from businesses order by created_at limit 1)
  where business_id is null;

alter table announcements
  alter column business_id set not null;

create index if not exists announcements_business_id_idx on announcements (business_id);

-- ─── 5. HOMEPAGE_CONTENT: ADD business_id ───────────────────────────────────
alter table homepage_content
  add column if not exists business_id uuid references businesses(id) on delete cascade;

update homepage_content
  set business_id = (select id from businesses order by created_at limit 1)
  where business_id is null;

alter table homepage_content
  alter column business_id set not null;

create index if not exists homepage_content_business_id_idx on homepage_content (business_id);

-- ─── 6. BUSINESS_HOURS: ADD business_id ─────────────────────────────────────
alter table business_hours
  add column if not exists business_id uuid references businesses(id) on delete cascade;

update business_hours
  set business_id = (select id from businesses order by created_at limit 1)
  where business_id is null;

alter table business_hours
  alter column business_id set not null;

create index if not exists business_hours_business_id_idx on business_hours (business_id);

-- ─── 7. SPECIALS: ADD business_id ───────────────────────────────────────────
alter table specials
  add column if not exists business_id uuid references businesses(id) on delete cascade;

update specials
  set business_id = (select id from businesses order by created_at limit 1)
  where business_id is null;

alter table specials
  alter column business_id set not null;

create index if not exists specials_business_id_idx on specials (business_id);

-- ─── 8. MENU_CATEGORIES: ADD business_id + FIX UNIQUE CONSTRAINT ────────────
alter table menu_categories
  add column if not exists business_id uuid references businesses(id) on delete cascade;

update menu_categories
  set business_id = (select id from businesses order by created_at limit 1)
  where business_id is null;

alter table menu_categories
  alter column business_id set not null;

-- Drop the old global unique on slug; replace with per-business unique
alter table menu_categories drop constraint if exists menu_categories_slug_key;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'menu_categories_business_slug_unique'
  ) then
    alter table menu_categories
      add constraint menu_categories_business_slug_unique
      unique (business_id, slug);
  end if;
end;
$$;

create index if not exists menu_categories_business_id_idx on menu_categories (business_id);

-- ─── 9. MENU_ITEMS: ADD business_id ─────────────────────────────────────────
alter table menu_items
  add column if not exists business_id uuid references businesses(id) on delete cascade;

-- Derive business_id from the parent category
update menu_items mi
  set business_id = mc.business_id
  from menu_categories mc
  where mi.category_id = mc.id
    and mi.business_id is null;

-- Any orphaned items (unlikely): assign to default business
update menu_items
  set business_id = (select id from businesses order by created_at limit 1)
  where business_id is null;

alter table menu_items
  alter column business_id set not null;

create index if not exists menu_items_business_id_idx on menu_items (business_id);
create index if not exists menu_items_category_id_idx on menu_items (category_id);

-- ─── 10. GALLERY_IMAGES: ADD business_id ────────────────────────────────────
alter table gallery_images
  add column if not exists business_id uuid references businesses(id) on delete cascade;

update gallery_images
  set business_id = (select id from businesses order by created_at limit 1)
  where business_id is null;

alter table gallery_images
  alter column business_id set not null;

create index if not exists gallery_images_business_id_idx on gallery_images (business_id);

-- ─── 11. PAGE_VIEWS: ADD business_id (nullable — legacy rows stay null) ──────
-- page_views may not exist on older installs; create it if missing, then add column.
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on page_views (created_at desc);
create index if not exists page_views_path_idx on page_views (path);

alter table page_views
  add column if not exists business_id uuid references businesses(id) on delete cascade;

create index if not exists page_views_business_id_idx on page_views (business_id);

-- ─── 12. BUSINESS_DOMAINS (future custom domain routing) ────────────────────
create table if not exists business_domains (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  domain text not null unique,
  is_primary boolean not null default false,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_domains_domain_idx on business_domains (domain);
create index if not exists business_domains_business_id_idx on business_domains (business_id);

-- ─── DONE ────────────────────────────────────────────────────────────────────
-- After running this migration:
-- 1. Note the id from: SELECT id, slug, name FROM businesses;
-- 2. Set BRANCHKIT_BUSINESS_ID=<that-id> in your .env.local (optional but recommended)
--    Without this env var the app will use the first business found in the DB.
-- 3. The public site is now available at /<slug> in addition to /preview
