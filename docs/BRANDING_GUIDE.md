# Branding Guide

This guide explains how to turn the same codebase into a diner site, cafe site, bakery site, or food truck site without changing the architecture.

## Where Branding Lives

Primary brand files:

- `src/lib/brand.ts`
- `src/lib/features.ts`
- `src/lib/seed.ts`

Brand-related live data:

- `business_settings`
- `homepage_content`
- `announcements`

## What Is Config-Only vs Content-Driven

Config-first changes:

- baseline business name
- baseline phone/email/address
- colors
- fonts
- section visibility defaults
- starter seed content for a fresh clone

Files:

- `src/lib/brand.ts`
- `src/lib/features.ts`
- `src/lib/seed.ts`

Content-driven changes after setup:

- live announcement bar
- live hero copy
- live hours summary
- live about copy
- live menu, specials, and gallery
- live business settings stored in Supabase

Routes:

- `/admin/settings`
- `/admin/specials`
- `/admin/menu`
- `/admin/hours`

Recommended workflow:

1. Rebrand the clone in `src/lib/brand.ts`
2. Adjust toggles in `src/lib/features.ts`
3. Replace fallback content in `src/lib/seed.ts`
4. Then use Supabase + admin for the client’s live content

## Change the Business Name

Update:

- `src/lib/brand.ts`

Fields:

- `businessName`
- `tagline`
- `logoText`

Then mirror or refine the values in:

- `/admin/settings`

## Change Contact Info

Update:

- `src/lib/brand.ts`

Fields:

- `phone`
- `email`
- `addressLine1`
- `city`
- `state`
- `zip`
- `socialLinks`

These values affect:

- header address
- footer contact info
- call buttons
- directions link
- local business structured data

## Change Colors

Update:

- `src/lib/brand.ts`

Fields:

- `primaryColor`
- `secondaryColor`
- `accentColor`

These are turned into CSS variables by `buildBrandCssVariables()` and applied in `src/app/layout.tsx`.

## Change Fonts

Update:

- `src/lib/brand.ts`

Fields:

- `headingFont`
- `bodyFont`

Use web-safe stacks or add the font loading strategy you want before using custom hosted fonts in production.

## Change the Logo

Current options:

1. Text-based logo using `logoText`
2. Image URL stored in `logoUrl`

Baseline config:

- `src/lib/brand.ts`

Live update path:

- `/admin/settings`

If the client has a real logo asset, add the URL and test it against the header layout.

## Restaurant-Type Examples

### Diner

Typical config:

- `showBreakfastMenu: true`
- `showLunchMenu: true`
- `showDinnerMenu: true`
- `showSpecials: true`
- `showGallery: true`
- `showStickyMobileBar: true`

Content direction:

- short hometown headline
- strong today’s special
- menu categories for breakfast, lunch, dinner

### Cafe

Typical config:

- `showBreakfastMenu: true`
- `showLunchMenu: true`
- `showDinnerMenu: false`
- `showSpecials: true`
- `showGallery: true`
- `showMap: true`

Content direction:

- coffee/pastry-forward hero
- lighter menu categories
- strong gallery use

### Food Truck

Typical config:

- `showBreakfastMenu: false`
- `showLunchMenu: true`
- `showDinnerMenu: true`
- `showGallery: false` or `true` depending on assets
- `showStickyMobileBar: true`
- `showMap: false` if location changes often

Content direction:

- shorter hours
- fewer categories
- strong phone + directions behavior
- announcement bar for temporary locations or event schedules

## Branding Checklist for a New Client

Before touching content, update:

- `src/lib/brand.ts`
- `src/lib/features.ts`
- `src/lib/seed.ts`

Then verify:

- site title/metadata looks correct
- brand colors are applied
- header/logo reads correctly
- call and directions links are correct
- sections shown/hidden match the client type
