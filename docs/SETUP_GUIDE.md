# Setup Guide

This guide walks through cloning the template, running it locally, connecting Supabase, and verifying that the app is reading live data.

## 1. Clone or Copy the Template

If you are starting from this repo, work inside `local-restaurant-template/`.

```bash
cd local-restaurant-template
```

Verification:

- you should see `package.json`
- you should see `.env.example`
- you should see `src/` and `supabase/`

## 2. Install Dependencies

```bash
npm install
```

Verification:

- `node_modules/` is created
- install finishes without errors

## 3. Create the Local Env File

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Bash:

```bash
cp .env.example .env.local
```

Open `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Verification:

- `.env.local` exists in `local-restaurant-template/`
- all three variables are present

## 4. Start the App Locally

```bash
npm run dev
```

Open:

- `http://localhost:3000`
- `http://localhost:3000/admin`

Verification:

- homepage loads
- admin dashboard loads
- if env vars are not configured yet, the site still renders with seed content

## 5. Create a Supabase Project

In Supabase:

1. Create a new project.
2. Copy the project URL.
3. Copy the anon key.
4. Copy the service role key.
5. Paste them into `.env.local`.

Verification:

- `.env.local` contains real project credentials

## 6. Run the SQL Schema

Open the SQL editor in Supabase and run the contents of:

- `supabase/schema.sql`

This creates:

- `business_settings`
- `announcements`
- `homepage_content`
- `business_hours`
- `specials`
- `menu_categories`
- `menu_items`
- `gallery_images`

Verification:

- each table appears in the Supabase table editor

## 7. Restart the Local App

After setting `.env.local`, restart the Next.js server:

```bash
npm run dev
```

Verification:

- site still loads
- admin still loads
- save actions no longer show the “Supabase is not configured” error

## 8. Load Starter Content

There is no dedicated seed-import script yet.

Current options:

1. Use `/admin/settings`, `/admin/specials`, `/admin/menu`, and `/admin/hours` to create the first live records.
2. Insert data manually in Supabase if you prefer.

Important behavior:

- if a table is empty, the UI falls back to the seed defaults in `src/lib/seed.ts`
- this keeps the site usable while you create the first records

Verification:

- create or update one field in admin
- save it
- refresh the public site and confirm the change appears

## 9. Verify Live Data Is Working

Minimum verification checklist:

1. Update the announcement text in `/admin/settings`
2. Update one special in `/admin/specials`
3. Update one menu item in `/admin/menu`
4. Update one hours row in `/admin/hours`
5. Reload `/`, `/menu`, and `/contact`

Expected result:

- changes are visible on the public site after save
- success feedback appears in admin after each save

## 10. Accessing Admin Routes

Current admin routes:

- `/admin`
- `/admin/settings`
- `/admin/specials`
- `/admin/menu`
- `/admin/hours`

Important:

- admin auth is not fully implemented yet
- `src/lib/admin-auth.ts` is a placeholder
- do not expose `/admin` publicly without adding real authentication

## 11. Deploy to Vercel

High-level sequence:

1. Push the project to GitHub
2. Import the repository in Vercel
3. Set the same three environment variables in Vercel
4. Deploy
5. Confirm the site and admin routes work in production

Use `DEPLOYMENT_GUIDE.md` for the full production checklist.

## 12. Production Verification

After deployment, verify:

- homepage loads
- menu page loads
- about page loads
- contact page loads
- admin dashboard loads
- one save in admin updates the public site
- phone, address, and directions link are correct

## Common First-Run Issues

- Missing env vars: admin saves will redirect with a configuration error.
- Schema not run: reads/writes will fail because tables do not exist.
- Wrong Supabase project: public content and admin content will not match expectations.
- Service role key missing: reads may fallback to seed data and writes will fail.
