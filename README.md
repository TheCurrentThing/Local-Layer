# Local Restaurant Website System

Reusable Next.js restaurant website template for local food businesses. This project is designed to be cloned, rebranded, populated with content, connected to Supabase, and deployed quickly for diners, cafes, bakeries, sandwich shops, food trucks, and similar owner-operated businesses.

## Overview

This template packages the strongest parts of the current restaurant site work into a reusable system with:

- a centralized brand layer
- feature toggles for different restaurant types
- typed content models
- reusable public-facing sections
- a simple owner-facing admin
- Supabase-backed reads and writes
- seed-backed fallback behavior during setup

The goal is practical reuse, not a one-off custom build.

## Features

- Next.js App Router architecture built for Vercel deployment
- typed data models for settings, hours, specials, menu, gallery, and homepage content
- owner-editable admin routes for common restaurant tasks
- server-side Supabase queries with fallback seed content
- server actions for CRUD on the core restaurant data
- sticky mobile call/menu/directions bar
- local business JSON-LD component for local SEO support
- clean section-based homepage composition

## Who This Is For

Use this template for:

- diners
- cafes
- bakeries
- sandwich shops
- food trucks
- kava bars
- breakfast spots
- lunch counters
- other local food businesses with simple owner-editable needs

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase
- React server components + server actions

## Folder Structure

```text
local-restaurant-template/
  src/
    app/
      (site)/
        page.tsx
        menu/page.tsx
        about/page.tsx
        contact/page.tsx
      admin/
        actions.ts
        page.tsx
        settings/page.tsx
        specials/page.tsx
        menu/page.tsx
        hours/page.tsx
      globals.css
      layout.tsx
    components/
      admin/
      layout/
      sections/
      ui/
    lib/
      admin-auth.ts
      brand.ts
      features.ts
      queries.ts
      seed.ts
      supabase.ts
      utils.ts
    types/
      admin.ts
      menu.ts
      site.ts
  supabase/
    schema.sql
  docs/
    README.md
    SETUP_GUIDE.md
    BRANDING_GUIDE.md
    CONTENT_GUIDE.md
    DEPLOYMENT_GUIDE.md
    HANDOFF_GUIDE.md
  .env.example
  package.json
```

## Quick Start

```bash
cd local-restaurant-template
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

If Supabase is not configured yet, the site will render with the starter seed content from `src/lib/seed.ts`.

## Environment Setup

Create `local-restaurant-template/.env.local` from `.env.example`.

Required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

What each one does:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public anon key for browser-safe Supabase usage
- `SUPABASE_SERVICE_ROLE_KEY`: server-only key used by server queries and admin server actions

Do not expose `SUPABASE_SERVICE_ROLE_KEY` outside server environments.

## Supabase Setup

The schema lives in `supabase/schema.sql`. Run that SQL inside the target Supabase project.

Tables included:

- `business_settings`
- `announcements`
- `homepage_content`
- `business_hours`
- `specials`
- `menu_categories`
- `menu_items`
- `gallery_images`

Current behavior:

- public pages read live data through `src/lib/queries.ts`
- admin writes go through `src/app/admin/actions.ts`
- if Supabase is missing or a dataset has not been created yet, seed defaults prevent the UI from breaking

## Branding Customization

Baseline branding lives in:

- `src/lib/brand.ts`
- `src/lib/features.ts`
- `src/lib/seed.ts`

For a new client clone, start here first:

1. Update `src/lib/brand.ts` with business name, phone, address, colors, fonts, and social links.
2. Update `src/lib/features.ts` for sections you want on or off.
3. Update `src/lib/seed.ts` so the fallback content matches the client.
4. Then connect Supabase and use `/admin/settings` to populate the live content layer.

Brand settings saved through admin now feed the site payload and root layout styling. For a fresh clone, `brand.ts` is still the baseline fallback and the fastest place to set the initial brand.

## Feature Toggles

Feature toggles live in `src/lib/features.ts`.

Available flags:

- `showBreakfastMenu`
- `showLunchMenu`
- `showDinnerMenu`
- `showSpecials`
- `showGallery`
- `showTestimonials`
- `showMap`
- `showOnlineOrdering`
- `showStickyMobileBar`

Use these to adapt the same codebase for different client types without deleting sections or branching the architecture.

## Content and Admin Overview

Owner-facing routes:

- `/admin`
- `/admin/settings`
- `/admin/specials`
- `/admin/menu`
- `/admin/hours`

Current admin coverage:

- business settings
- feature visibility flags
- announcement bar
- homepage hero copy
- about copy
- gallery images
- specials
- menu categories
- menu items
- business hours

Most useful owner edits:

- today's special
- announcement bar
- hours
- menu prices
- item availability

## Data Flow

- `src/lib/queries.ts` is the read layer for the public site and admin pages.
- `src/app/admin/actions.ts` is the write layer for admin CRUD.
- `src/lib/supabase.ts` contains server-safe Supabase client helpers.
- `src/lib/admin-auth.ts` is currently a placeholder hook for future admin auth.

## Local Development

```bash
npm install
npm run dev
```

Validation:

```bash
npm run typecheck
npm run build
```

## Deployment Summary

Recommended deployment target: Vercel.

High-level deploy flow:

1. Create Supabase project.
2. Run `supabase/schema.sql`.
3. Set Vercel environment variables.
4. Deploy the `local-restaurant-template` project.
5. Verify public pages and admin routes.
6. Add real admin auth before exposing `/admin` publicly.

Detailed steps are in:

- `docs/SETUP_GUIDE.md`
- `docs/DEPLOYMENT_GUIDE.md`
- `docs/HANDOFF_GUIDE.md`

## Known Next Steps

These are still needed before full production hardening:

- replace the placeholder admin auth in `src/lib/admin-auth.ts`
- add Supabase auth/session enforcement around `/admin`
- add RLS policies that match the auth model
- decide whether to add a scripted seed/import path for faster client onboarding
- extend metadata/page SEO if a client needs deeper local SEO coverage

## Documentation Index

- `docs/README.md`
- `docs/SETUP_GUIDE.md`
- `docs/BRANDING_GUIDE.md`
- `docs/CONTENT_GUIDE.md`
- `docs/DEPLOYMENT_GUIDE.md`
- `docs/HANDOFF_GUIDE.md`
