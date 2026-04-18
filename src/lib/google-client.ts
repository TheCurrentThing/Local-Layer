import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "crypto";

import type {
  GbpAccount,
  GbpAvailableLocation,
  GbpLocalPost,
  GbpLocation,
  GbpPeriod,
  GbpReview,
  GoogleTokenSet,
  GoogleUserInfo,
} from "@/types/google";

// ─── Configuration ────────────────────────────────────────────────────────────

export function isGoogleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REDIRECT_URI &&
      process.env.GOOGLE_TOKEN_ENCRYPTION_KEY,
  );
}

export function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) return null;
  return { clientId, clientSecret, redirectUri };
}

// ─── Token encryption (AES-256-GCM) ─────────────────────────────────────────
// Format stored in DB: base64(iv[12] || authTag[16] || ciphertext)

const CIPHER_ALGO = "aes-256-gcm";

function getEncryptionKey(): Buffer {
  const keyB64 = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;
  if (!keyB64) {
    throw new Error(
      "GOOGLE_TOKEN_ENCRYPTION_KEY is not set. Generate with: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\"",
    );
  }
  const key = Buffer.from(keyB64, "base64");
  if (key.length !== 32) {
    throw new Error("GOOGLE_TOKEN_ENCRYPTION_KEY must be exactly 32 bytes (base64-encoded).");
  }
  return key;
}

export function encryptToken(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(CIPHER_ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptToken(encryptedB64: string): string {
  const key = getEncryptionKey();
  const buf = Buffer.from(encryptedB64, "base64");
  if (buf.length < 28) throw new Error("Invalid encrypted token — too short.");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);
  const decipher = createDecipheriv(CIPHER_ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

// ─── OAuth state (HMAC-SHA256, tamper-proof) ──────────────────────────────────

function getStateSecret(): string {
  return (
    process.env.GOOGLE_OAUTH_STATE_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "insecure-fallback-change-in-production"
  );
}

export function generateOAuthState(): string {
  const nonce = randomBytes(16).toString("hex");
  const sig = createHmac("sha256", getStateSecret()).update(nonce).digest("hex");
  return `${nonce}.${sig}`;
}

export function verifyOAuthState(state: string): boolean {
  const dot = state.lastIndexOf(".");
  if (dot === -1) return false;
  const nonce = state.slice(0, dot);
  const sig = state.slice(dot + 1);
  const expected = createHmac("sha256", getStateSecret()).update(nonce).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

// ─── OAuth URL builder ────────────────────────────────────────────────────────

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/business.manage",
  "openid",
  "email",
  "profile",
];

export function buildGoogleAuthUrl(state: string): string {
  const config = getGoogleOAuthConfig();
  if (!config) throw new Error("Google OAuth is not configured.");
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: GOOGLE_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

// ─── Token operations ─────────────────────────────────────────────────────────

export async function exchangeCodeForTokens(code: string): Promise<GoogleTokenSet> {
  const config = getGoogleOAuthConfig();
  if (!config) throw new Error("Google OAuth is not configured.");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google token exchange failed (${res.status}): ${body}`);
  }

  return res.json() as Promise<GoogleTokenSet>;
}

export async function refreshGoogleAccessToken(refreshToken: string): Promise<GoogleTokenSet> {
  const config = getGoogleOAuthConfig();
  if (!config) throw new Error("Google OAuth is not configured.");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google token refresh failed (${res.status}): ${body}`);
  }

  return res.json() as Promise<GoogleTokenSet>;
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Google user info.");
  return res.json() as Promise<GoogleUserInfo>;
}

export async function revokeGoogleToken(token: string): Promise<void> {
  await fetch(
    `https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`,
    { method: "POST" },
  );
}

// ─── GBP API helpers ──────────────────────────────────────────────────────────

const GBP_ACCT_BASE = "https://mybusinessaccountmanagement.googleapis.com/v1";
const GBP_INFO_BASE = "https://mybusinessbusinessinformation.googleapis.com/v1";
const GBP_V4_BASE   = "https://mybusiness.googleapis.com/v4";

async function gbpFetch(
  url: string,
  accessToken: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

// List all GBP accounts accessible to the connected Google account
export async function listGbpAccounts(accessToken: string): Promise<GbpAccount[]> {
  const res = await gbpFetch(`${GBP_ACCT_BASE}/accounts`, accessToken);
  if (!res.ok) throw new Error(`Failed to list GBP accounts (${res.status}).`);
  const data = (await res.json()) as { accounts?: GbpAccount[] };
  return data.accounts ?? [];
}

// List all locations for an account
export async function listGbpLocations(
  accountName: string,
  accessToken: string,
): Promise<GbpLocation[]> {
  // Try Business Information API v1 first
  const readMask = "name,title,storefrontAddress,metadata";
  const res = await gbpFetch(
    `${GBP_INFO_BASE}/${accountName}/locations?readMask=${encodeURIComponent(readMask)}`,
    accessToken,
  );

  if (res.ok) {
    const data = (await res.json()) as { locations?: GbpLocation[] };
    return data.locations ?? [];
  }

  // Fallback to v4 API
  const fallback = await gbpFetch(
    `${GBP_V4_BASE}/${accountName}/locations`,
    accessToken,
  );
  if (!fallback.ok) throw new Error(`Failed to list GBP locations (${fallback.status}).`);
  const data = (await fallback.json()) as { locations?: GbpLocation[] };
  return data.locations ?? [];
}

// Build flat list of locations across all accessible accounts
export async function listAllGbpLocations(
  accessToken: string,
): Promise<GbpAvailableLocation[]> {
  const accounts = await listGbpAccounts(accessToken);
  const results: GbpAvailableLocation[] = [];

  for (const account of accounts) {
    try {
      const locations = await listGbpLocations(account.name, accessToken);
      for (const loc of locations) {
        const parts = loc.name.split("/");
        const locationId = parts[parts.length - 1] ?? "";
        const addrParts = loc.storefrontAddress?.addressLines ?? [];
        if (loc.storefrontAddress?.locality) addrParts.push(loc.storefrontAddress.locality);
        results.push({
          accountName: account.name,
          locationName: loc.name,
          locationId,
          displayName: loc.title,
          address: addrParts.join(", ") || undefined,
        });
      }
    } catch {
      // Skip accounts that can't be listed (e.g. no location access)
    }
  }

  return results;
}

// Patch business hours on a GBP location
export async function patchGbpLocationHours(
  locationName: string,
  periods: GbpPeriod[],
  accessToken: string,
): Promise<void> {
  const url = `${GBP_INFO_BASE}/${locationName}?updateMask=regularHours`;
  const res = await gbpFetch(url, accessToken, {
    method: "PATCH",
    body: JSON.stringify({ regularHours: { periods } }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to update GBP hours (${res.status}): ${body}`);
  }
}

// Create a new GBP local post; returns resource name assigned by Google
export async function createGbpLocalPost(
  locationName: string,
  post: GbpLocalPost,
  accessToken: string,
): Promise<{ name: string }> {
  const url = `${GBP_V4_BASE}/${locationName}/localPosts`;
  const res = await gbpFetch(url, accessToken, {
    method: "POST",
    body: JSON.stringify(post),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to create GBP local post (${res.status}): ${body}`);
  }

  return res.json() as Promise<{ name: string }>;
}

// Update an existing GBP local post
export async function updateGbpLocalPost(
  postName: string,
  post: Partial<GbpLocalPost>,
  accessToken: string,
): Promise<void> {
  const url = `${GBP_V4_BASE}/${postName}?updateMask=summary,callToAction,event,offer`;
  const res = await gbpFetch(url, accessToken, {
    method: "PATCH",
    body: JSON.stringify(post),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to update GBP local post (${res.status}): ${body}`);
  }
}

// Delete a GBP local post (404 treated as success — already gone)
export async function deleteGbpLocalPost(postName: string, accessToken: string): Promise<void> {
  const res = await gbpFetch(`${GBP_V4_BASE}/${postName}`, accessToken, {
    method: "DELETE",
  });

  if (!res.ok && res.status !== 404) {
    const body = await res.text();
    throw new Error(`Failed to delete GBP local post (${res.status}): ${body}`);
  }
}

// Fetch reviews for a location, most recent first
export async function listGbpReviews(
  locationName: string,
  accessToken: string,
  pageSize = 20,
): Promise<GbpReview[]> {
  const url = `${GBP_V4_BASE}/${locationName}/reviews?pageSize=${pageSize}&orderBy=updateTime+desc`;
  const res = await gbpFetch(url, accessToken);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to fetch GBP reviews (${res.status}): ${body}`);
  }

  const data = (await res.json()) as { reviews?: GbpReview[] };
  return data.reviews ?? [];
}
