create table if not exists business_settings (
  id uuid primary key default gen_random_uuid(),
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

alter table if exists business_settings
  add column if not exists header_logo_alignment text not null default 'center';

alter table if exists business_settings
  add column if not exists theme_mode text not null default 'preset';

alter table if exists business_settings
  add column if not exists theme_preset_id text default 'classic-diner';

alter table if exists business_settings
  add column if not exists theme_tokens jsonb not null default '{}'::jsonb;

alter table if exists business_settings
  add column if not exists background_color text not null default '#f8f1e8';

alter table if exists business_settings
  add column if not exists foreground_color text not null default '#2c251f';

alter table if exists business_settings
  add column if not exists card_color text not null default '#fffaf4';

alter table if exists business_settings
  add column if not exists muted_section_color text not null default '#efe4d7';

alter table if exists business_settings
  add column if not exists highlight_section_color text not null default '#f3e1ab';

alter table if exists business_settings
  add column if not exists header_background_color text not null default '#f6efe6';

alter table if exists business_settings
  add column if not exists announcement_background_color text not null default '#f3e7d3';

alter table if exists business_settings
  add column if not exists announcement_text_color text not null default '#a53c2f';

alter table if exists business_settings
  add column if not exists border_color text not null default '#d9c7b5';

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists homepage_content (
  id uuid primary key default gen_random_uuid(),
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
  about_title text,
  about_body jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists business_hours (
  id uuid primary key default gen_random_uuid(),
  day_label text not null,
  open_text text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists specials (
  id uuid primary key default gen_random_uuid(),
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

create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  service_window text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
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

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  alt text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
