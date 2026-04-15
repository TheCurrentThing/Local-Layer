# Content Management Guide

This guide explains the content types in plain English and how a restaurant owner should think about updating them.

## Content Types

### Business Settings

Table:

- `business_settings`

What it stores:

- business name
- contact info
- address
- social links
- color values
- font values
- feature visibility flags

Where it is edited:

- `/admin/settings`

How often it changes:

- rarely

## Announcement Bar

Table:

- `announcements`

What it is for:

- holiday closures
- one-day promos
- fish fry notices
- event announcements
- limited-time updates

Where it appears:

- top bar across the site

Where it is edited:

- `/admin/settings`

How often it changes:

- daily or weekly

## Homepage Content

Table:

- `homepage_content`

What it stores:

- hero eyebrow
- hero headline
- hero subheadline
- primary CTA label/link
- secondary CTA label/link
- hero image URL
- quick hours summary
- ordering notice
- about title
- about body

Where it is edited:

- `/admin/settings`

How often it changes:

- rarely, except for quick-hours summary if hours messaging changes

## Hours

Table:

- `business_hours`

What it stores:

- day label
- open/close text
- sort order
- active/inactive state

Where it is edited:

- `/admin/hours`

Owner mindset:

- keep the labels simple
- use one line per row
- use inactive rows instead of deleting if you may need them later

How often it changes:

- occasionally

## Specials

Table:

- `specials`

What it stores:

- special title
- description
- optional price
- label
- featured flag
- active/inactive state
- sort order

Where it is edited:

- `/admin/specials`

Owner mindset:

- keep one main featured special strong
- use the label for context like “Today’s Special” or “Soup”
- remove or deactivate old specials instead of letting them sit stale

How often it changes:

- daily or weekly

## Menu Categories

Table:

- `menu_categories`

What it stores:

- category name
- slug
- description
- service window
- sort order
- active/inactive state

Where it is edited:

- `/admin/menu`

Plain-English explanation:

- categories are the menu sections customers browse first
- examples: Breakfast, Lunch & Sandwiches, Dinner Plates, Drinks, Pastries

## Menu Items

Table:

- `menu_items`

What it stores:

- linked category
- item name
- description
- price
- tags
- featured flag
- sold-out flag
- active/inactive state
- sort order

Where it is edited:

- `/admin/menu`

Plain-English explanation:

- items live inside categories
- each item should have a clear name, short description, and price
- use tags sparingly for things like `Popular` or `House Favorite`
- use `sold out` for short-term availability problems
- use `inactive` when the item should disappear from the public menu

How often it changes:

- weekly or monthly for most restaurants
- more often if pricing changes frequently

## Gallery Images

Table:

- `gallery_images`

What it stores:

- image URL
- alt text
- sort order
- active/inactive state

Where it is edited:

- `/admin/settings`

How often it changes:

- rarely

## What Owners Should Edit First

Highest-value edits for a local restaurant owner:

1. announcement bar
2. today’s special
3. hours
4. menu prices
5. item availability

Lower-frequency edits:

- about copy
- gallery images
- fonts and colors
- social links

## Daily vs Rare Content

Daily or weekly:

- announcement bar
- specials
- sold-out state
- price updates

Monthly or seasonal:

- hours
- category structure
- about text
- hero messaging

Rare:

- brand colors
- fonts
- logo
- legal business contact info

## How the Owner Workflow Should Feel

The admin is built around the sales pitch:

"You can update your menu, specials, and hours yourself without needing a developer."

That means:

- keep menu names short
- keep descriptions readable
- keep prices accurate
- keep one featured special obvious
- avoid overloading the announcement bar
