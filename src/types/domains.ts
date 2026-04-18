// Domain types for the business domain routing system.
//
// Three domain types are supported:
//   subdomain  — {slug}.locallayer.com   auto-provisioned, no DB record needed
//   custom     — user-owned domain they pointed at LocalLayer
//   purchased  — domain bought through LocalLayer (future registrar integration)

export type DomainType = "subdomain" | "custom" | "purchased";

export type DomainStatus =
  | "pending"     // Added, DNS not yet configured
  | "verifying"   // DNS record found, full check in progress
  | "verified"    // DNS confirmed, awaiting SSL/activation
  | "active"      // Live — routing traffic correctly
  | "failed"      // Verification or routing broken
  | "expired";    // Purchased domain past expiry date

// Raw DB row — mirrors business_domains exactly after migration 005.
export type BusinessDomainRow = {
  id: string;
  business_id: string;
  domain: string;
  type: DomainType;
  is_primary: boolean;
  status: DomainStatus;
  provider: string | null;           // null = user-managed | 'locallayer' | registrar name
  provider_domain_id: string | null; // registrar's internal domain ID
  dns_target: string | null;         // CNAME/A target the user must configure
  verification_token: string | null; // TXT record value for DNS verification
  expires_at: string | null;         // ISO timestamp for purchased domains
  last_checked_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

// Application-level type — camelCase.
export type BusinessDomain = {
  id: string;
  businessId: string;
  domain: string;
  type: DomainType;
  isPrimary: boolean;
  status: DomainStatus;
  provider: string | null;
  providerDomainId: string | null;
  dnsTarget: string | null;
  verificationToken: string | null;
  expiresAt: string | null;
  lastCheckedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateDomainInput = {
  businessId: string;
  domain: string;
  type: DomainType;
  isPrimary?: boolean;
  provider?: string;
  providerDomainId?: string;
  dnsTarget?: string;
  expiresAt?: string;
};

// ─── ROUTING DECISION ────────────────────────────────────────────────────────
//
// How a request resolves to a business — used in middleware and analytics.
export type DomainResolutionMethod =
  | "subdomain"     // host = {slug}.locallayer.com
  | "custom_domain" // host matched business_domains (status=active)
  | "slug_path";    // standard /[slug]/ routing on platform host
