# Deployment Guide

This guide covers local preflight, Vercel deployment, production environment setup, and post-launch checks.

## Local Preflight Checklist

Before deploying, confirm:

- `npm install` has been run
- `.env.local` works locally
- `supabase/schema.sql` has been applied to the target Supabase project
- `npm run typecheck` passes
- `npm run build` passes
- public pages load locally
- admin save actions work locally

Commands:

```bash
cd local-restaurant-template
npm run typecheck
npm run build
```

## Required Environment Variables

Set these in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Do not omit the service role key. Admin server actions depend on it.

## Vercel Deployment Steps

1. Push the code to GitHub.
2. Import the repository into Vercel.
3. Set the project root to `local-restaurant-template` if the repo contains other workspaces.
4. Add the three environment variables.
5. Deploy.

Verification:

- build completes successfully in Vercel
- production URL loads the homepage

## Supabase Production Configuration

Before launch:

1. Create the production Supabase project.
2. Run `supabase/schema.sql`.
3. Populate the initial content through admin or manually.
4. Add your auth and RLS plan before exposing admin publicly.

Current production gap:

- admin auth is still a placeholder in `src/lib/admin-auth.ts`

## Post-Deploy Checks

Check these routes:

- `/`
- `/menu`
- `/about`
- `/contact`
- `/admin`
- `/admin/settings`
- `/admin/specials`
- `/admin/menu`
- `/admin/hours`

Check these behaviors:

- call button dials the correct number
- directions link opens the correct address
- announcement bar shows the current text
- specials render correctly
- menu categories and items render in the expected order
- hours show correctly
- one admin save updates the public site

## Production Checklist

- env vars set in Vercel
- Supabase tables created
- live content entered
- favicon/logo handled if required by client
- announcement bar checked
- business contact info checked
- mobile sticky bar checked
- admin auth plan decided

## Common Deployment Mistakes

- Wrong Vercel root directory when the repo contains multiple projects
- Forgetting `SUPABASE_SERVICE_ROLE_KEY`
- Deploying before running `supabase/schema.sql`
- Assuming admin is protected when auth is still placeholder-only
- Leaving fallback seed content in place because live rows were never created

## Rollback and Update Guidance

If a deploy introduces a bad change:

1. Roll back to the previous Vercel deployment.
2. Check whether the issue is code, environment, or data.
3. Fix locally.
4. Re-run `npm run typecheck` and `npm run build`.
5. Re-deploy.

For normal content updates:

- use the admin first
- avoid redeploying for simple menu/specials/hours changes

For structural or branding changes:

- update code/config locally
- validate locally
- deploy a new build
