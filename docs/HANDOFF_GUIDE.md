# Handoff Guide

Use this guide when selling, launching, and maintaining the template for client restaurants.

## What Is Included

This template includes:

- reusable public site layout
- homepage sections
- menu page
- about page
- contact page
- sticky mobile action bar
- Supabase schema
- simple owner-facing admin
- server-side reads and admin CRUD actions
- baseline local SEO structure

## What Needs Client-Specific Customization

Every client still needs:

- brand identity
- menu structure
- menu items and prices
- specials strategy
- hours
- contact details
- announcement defaults
- gallery images
- deployment env vars

## New Client Onboarding Checklist

Before building:

- confirm restaurant name and legal business name if different
- confirm primary phone number
- confirm public email address
- confirm full physical address
- confirm business hours
- confirm menu categories
- confirm current prices
- confirm whether online ordering should be shown
- confirm whether gallery should be shown
- confirm whether map/directions should be shown

## Assets To Request From the Client

Request:

- logo file or approval for text-only logo
- brand colors if they have them
- menu PDF or menu photos
- specials examples
- interior/exterior/food photos
- social links
- Google Business Profile link
- holiday closure schedule if known

## Content To Collect Before Launch

Minimum content set:

- hero headline
- hero subheadline
- CTA labels
- menu categories
- menu items and prices
- hours
- address
- phone
- announcement default
- at least one special

Nice-to-have:

- about story
- gallery images
- testimonials

## Recommended Client Workflow

1. Clone the template.
2. Update `src/lib/brand.ts`, `src/lib/features.ts`, and `src/lib/seed.ts`.
3. Connect the client Supabase project.
4. Run the schema.
5. Enter live content through admin.
6. Validate public pages.
7. Deploy.
8. Hand the client their editing instructions for admin.

## Site Launch Checklist

- brand name is correct
- call button works
- directions link works
- hours are correct
- menu categories are correct
- prices are correct
- featured special is current
- announcement bar is current
- admin routes work
- production env vars are correct
- client has reviewed mobile layout

## Monthly Maintenance Checklist

- review specials and remove stale entries
- review sold-out or inactive menu items
- verify hours for seasonal changes
- update announcement bar for closures/promos
- check gallery and hero content for staleness
- verify phone/address/NAP consistency
- review deployment/env health if any issues were reported

## Suggested Handoff Notes To the Client

Keep this simple:

- use admin for content updates
- use specials for short-term promos
- use announcement bar for urgent updates
- use hours for schedule changes
- contact the developer for structural redesigns, auth upgrades, or new integrations

## Current Production Caveat

The admin is usable for content management, but production auth is not complete yet.

Before handing this to a live client with public admin access, add:

- real Supabase auth
- route/session protection
- RLS policies
