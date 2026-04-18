-- ============================================================
-- BranchKit Multi-Tenant Schema
-- Every tenant-owned table is tied to a businesses row.
-- Run this for fresh installations.
-- For existing single-tenant instances, run migrations/001_add_multi_tenancy.sql first.
-- ============================================================

-- ─── BUSINESSES ─────────────────────────────────────────────────────────────
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  is_active boolean not null default true,
  site_status text not null default 'draft' check (site_status in ('draft', 'ready', 'live', 'paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists businesses_site_status_idx on businesses (site_status);

-- ─── BUSINESS SETTINGS ──────────────────────────────────────────────────────
create table if not exists business_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  business_name text not null,
  tagline text not null,
  logo_url text,
  header_logo_alignment text not null default 'center',
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  google_business_url text,
  phone text not null,
  email text,
  address_line_1 text not null,
  city text not null,
  state text not null,
  zip text not null,
  theme_mode text not null default 'preset',
  theme_preset_id text default 'classic-diner',
  theme_tokens jsonb not null default '{}'::jsonb,
  background_color text not null default '#f8f1e8',
  foreground_color text not null default '#2c251f',
  card_color text not null default '#fffaf4',
  muted_section_color text not null default '#efe4d7',
  highlight_section_color text not null default '#f3e1ab',
  header_background_color text not null default '#f6efe6',
  announcement_background_color text not null default '#f3e7d3',
  announcement_text_color text not null default '#a53c2f',
  border_color text not null default '#d9c7b5',
  primary_color text not null,
  secondary_color text not null,
  accent_color text not null,
  heading_font text not null,
  body_font text not null,
  show_breakfast_menu boolean not null default true,
  show_lunch_menu boolean not null default true,
  show_dinner_menu boolean not null default true,
  show_specials boolean not null default true,
  show_gallery boolean not null default true,
  show_testimonials boolean not null default false,
  show_map boolean not null default true,
  show_online_ordering boolean not null default false,
  show_sticky_mobile_bar boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_settings_business_id_idx on business_settings (business_id);

-- ─── ANNOUNCEMENTS ──────────────────────────────────────────────────────────
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  title text not null,
  body text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists announcements_business_id_idx on announcements (business_id);

-- ─── HOMEPAGE CONTENT ───────────────────────────────────────────────────────
create table if not exists homepage_content (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  hero_eyebrow text not null,
  hero_headline text not null,
  hero_subheadline text not null,
  hero_primary_cta_label text not null,
  hero_primary_cta_href text not null,
  hero_secondary_cta_label text not null,
  hero_secondary_cta_href text not null,
  hero_image_url text,
  quick_info_hours_label text not null,
  ordering_notice text,
  gallery_title text,
  gallery_subtitle text,
  menu_preview_title text,
  menu_preview_subtitle text,
  contact_title text,
  contact_subtitle text,
  about_title text,
  about_body jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists homepage_content_business_id_idx on homepage_content (business_id);

-- ─── BUSINESS HOURS ─────────────────────────────────────────────────────────
create table if not exists business_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  day_label text not null,
  open_text text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_hours_business_id_idx on business_hours (business_id);

-- ─── SPECIALS ───────────────────────────────────────────────────────────────
create table if not exists specials (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(10,2),
  label text not null,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists specials_business_id_idx on specials (business_id);

-- ─── MENU CATEGORIES ────────────────────────────────────────────────────────
-- slug is unique per business (not globally) so two businesses can both have "lunch"
create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  service_window text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint menu_categories_business_slug_unique unique (business_id, slug)
);

create index if not exists menu_categories_business_id_idx on menu_categories (business_id);

-- ─── MENU ITEMS ─────────────────────────────────────────────────────────────
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  category_id uuid not null references menu_categories(id) on delete cascade,
  name text not null,
  description text not null,
  price numeric(10,2) not null,
  tags jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  is_sold_out boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists menu_items_business_id_idx on menu_items (business_id);
create index if not exists menu_items_category_id_idx on menu_items (category_id);

-- ─── GALLERY IMAGES ─────────────────────────────────────────────────────────
create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  src text not null,
  alt text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_images_business_id_idx on gallery_images (business_id);

-- ─── PAGE VIEWS ─────────────────────────────────────────────────────────────
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  path text not null,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on page_views (created_at desc);
create index if not exists page_views_path_idx on page_views (path);
create index if not exists page_views_business_id_idx on page_views (business_id);

-- ─── BUSINESS DOMAINS ────────────────────────────────────────────────────────
-- One business may have multiple custom domains; one can be marked primary.
-- Status flow: pending → verified → active (or failed on check failure).
-- Public resolver only routes 'active' domains for 'live' businesses.
create table if not exists business_domains (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  domain text not null unique,
  is_primary boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'verified', 'active', 'failed')),
  verification_token text,
  verified_at timestamptz,
  last_checked_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_domains_domain_idx on business_domains (domain);
create index if not exists business_domains_business_id_idx on business_domains (business_id);
create index if not exists business_domains_status_idx on business_domains (status);
