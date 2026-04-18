-- Migration 005: Domain purchase + connection architecture
--
-- Expands business_domains to support three domain types:
--   subdomain  — {slug}.locallayer.com (automatic, no registration needed)
--   custom     — user-owned domain pointed to LocalLayer (existing flow)
--   purchased  — domain purchased through LocalLayer (future registrar integration)
--
-- Also adds:
--   provider / provider_domain_id — for future registrar API integration
--   expires_at                    — domain renewal tracking (purchased domains)
--   dns_target                    — the CNAME/A record target the user must point to
--   updated_at                    — standard mutation timestamp

-- ── 1. Add type column ──────────────────────────────────────────────────────────
ALTER TABLE business_domains
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'custom'
  CHECK (type IN ('subdomain', 'custom', 'purchased'));

COMMENT ON COLUMN business_domains.type IS
  'subdomain = auto-provisioned {slug}.locallayer.com; '
  'custom = user-owned domain they pointed here; '
  'purchased = domain bought via a registrar integration.';

-- ── 2. Registrar integration columns (future use) ───────────────────────────────
ALTER TABLE business_domains
  ADD COLUMN IF NOT EXISTS provider text;
  -- null = user managed | 'locallayer' = internal | 'namecheap' | 'cloudflare' | etc.

COMMENT ON COLUMN business_domains.provider IS
  'Registrar or DNS provider managing this domain. '
  'Null means the user manages DNS themselves.';

ALTER TABLE business_domains
  ADD COLUMN IF NOT EXISTS provider_domain_id text;

COMMENT ON COLUMN business_domains.provider_domain_id IS
  'Registrar-assigned identifier for this domain (for API calls to renew, transfer, etc.).';

-- ── 3. Expiry tracking (purchased domains) ──────────────────────────────────────
ALTER TABLE business_domains
  ADD COLUMN IF NOT EXISTS expires_at timestamptz;

COMMENT ON COLUMN business_domains.expires_at IS
  'Expiry date for purchased domains. Null for custom and subdomain types.';

-- ── 4. DNS target — what the user must point their domain to ────────────────────
ALTER TABLE business_domains
  ADD COLUMN IF NOT EXISTS dns_target text;

COMMENT ON COLUMN business_domains.dns_target IS
  'The CNAME or A record value the user must configure at their DNS provider. '
  'Populated when the domain is created/pending.';

-- ── 5. Expand status to cover expiry ────────────────────────────────────────────
-- Current: pending | verified | active | failed
-- Adding:  expired (purchased domain past expiry date)
-- We use a new constraint (drop + add since Postgres requires this pattern).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'business_domains_status_check'
  ) THEN
    ALTER TABLE business_domains DROP CONSTRAINT business_domains_status_check;
  END IF;

  ALTER TABLE business_domains
    ADD CONSTRAINT business_domains_status_check
    CHECK (status IN ('pending', 'verifying', 'verified', 'active', 'failed', 'expired'));
END;
$$;

COMMENT ON COLUMN business_domains.status IS
  'pending   = added, awaiting DNS setup; '
  'verifying = DNS record found, running full check; '
  'verified  = DNS confirmed, awaiting SSL/final activation; '
  'active    = fully live, routing traffic; '
  'failed    = verification or routing broken; '
  'expired   = purchased domain past expiry.';

-- ── 6. updated_at ───────────────────────────────────────────────────────────────
ALTER TABLE business_domains
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- ── 7. One primary domain per business ─────────────────────────────────────────
-- Partial unique index: at most one is_primary=true per business.
-- Allows multiple non-primary domains without constraint conflicts.
CREATE UNIQUE INDEX IF NOT EXISTS business_domains_primary_unique
  ON business_domains (business_id)
  WHERE is_primary = true;

-- ── 8. Efficient expiry monitoring ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS business_domains_expires_at_idx
  ON business_domains (expires_at)
  WHERE expires_at IS NOT NULL AND status != 'expired';

-- ── 9. Type-based filtering ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS business_domains_type_idx
  ON business_domains (business_id, type);

-- ── DONE ────────────────────────────────────────────────────────────────────────
--
-- ROUTING ARCHITECTURE (how domains resolve to businesses):
--
-- Priority order in middleware:
--   1. {slug}.locallayer.com  → subdomain routing (extracted directly from host)
--   2. custom-domain.com      → lookup in business_domains where status='active'
--   3. /[slug]/ path          → slug routing on platform domain (fallback)
--
-- The 'subdomain' type in business_domains is informational only — middleware
-- resolves subdomains by parsing the host header, NOT by DB lookup.
-- This means subdomains always work without a DB roundtrip.
--
-- For custom domains, the DB lookup in business_domains is required and cached.
--
-- FUTURE DOMAIN PURCHASE FLOW:
--   1. User picks a domain → POST /api/domains/purchase
--      - Creates business_domains row with type='purchased', status='pending',
--        provider='registrar-name', provider_domain_id='...', expires_at='+1yr'
--   2. Registrar API provisions domain → webhook or polling updates status
--   3. DNS auto-configured → status='verifying'
--   4. Verification passes → status='active', is_primary=true
--
-- FUTURE CUSTOM DOMAIN CONNECT FLOW:
--   1. User enters domain → POST /api/domains/connect
--      - Creates business_domains row with type='custom', status='pending',
--        dns_target='{slug}.locallayer.com' (or Vercel edge IP)
--   2. User sets CNAME/A at their DNS provider
--   3. POST /api/domains/verify → checks DNS, updates status
--   4. If verified: status='active', can set is_primary=true
