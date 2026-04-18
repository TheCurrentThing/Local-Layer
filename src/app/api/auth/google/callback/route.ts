import { NextRequest, NextResponse } from "next/server";
import {
  encryptToken,
  exchangeCodeForTokens,
  fetchGoogleUserInfo,
  isGoogleConfigured,
  verifyOAuthState,
} from "@/lib/google-client";
import { upsertGoogleConnection, appendSyncEvent } from "@/lib/google-queries";
import { getCurrentAdminBusinessId } from "@/lib/business";
import { isSupabaseConfigured } from "@/lib/supabase";
import { requireAdminAccess } from "@/lib/admin-auth";

// GET /api/auth/google/callback
// Handles the OAuth callback from Google.
// Verifies the state parameter, exchanges the code for tokens,
// stores encrypted tokens, then redirects to the admin Google page.

export const dynamic = "force-dynamic";

function errorRedirect(req: NextRequest, message: string): NextResponse {
  const url = new URL(
    `/admin/google?error=${encodeURIComponent(message)}`,
    req.url,
  );
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Pre-flight checks ──────────────────────────────────────────────────────
  if (!isGoogleConfigured()) {
    return errorRedirect(req, "Google OAuth is not configured.");
  }

  if (!isSupabaseConfigured()) {
    return errorRedirect(req, "Supabase is not configured.");
  }

  // ── OAuth error from Google ────────────────────────────────────────────────
  const oauthError = req.nextUrl.searchParams.get("error");
  if (oauthError) {
    const desc = req.nextUrl.searchParams.get("error_description") ?? oauthError;
    return errorRedirect(req, `Google returned an error: ${desc}`);
  }

  // ── State verification (CSRF) ──────────────────────────────────────────────
  const returnedState = req.nextUrl.searchParams.get("state") ?? "";
  const storedState = req.cookies.get("google_oauth_state")?.value ?? "";

  if (!storedState || !returnedState || !verifyOAuthState(returnedState)) {
    return errorRedirect(req, "OAuth state verification failed. Please try again.");
  }

  if (storedState !== returnedState) {
    return errorRedirect(req, "OAuth state mismatch. Please try again.");
  }

  // ── Authorization code ─────────────────────────────────────────────────────
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return errorRedirect(req, "No authorization code received from Google.");
  }

  // ── Admin session check ────────────────────────────────────────────────────
  try {
    await requireAdminAccess();
  } catch {
    return NextResponse.redirect(new URL("/admin/login?redirectTo=/admin/google", req.url));
  }

  let businessId: string;
  try {
    businessId = await getCurrentAdminBusinessId();
  } catch (err) {
    return errorRedirect(
      req,
      `Could not determine business: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // ── Exchange code for tokens ───────────────────────────────────────────────
  let tokenSet;
  try {
    tokenSet = await exchangeCodeForTokens(code);
  } catch (err) {
    return errorRedirect(
      req,
      `Token exchange failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // ── Fetch Google user identity ─────────────────────────────────────────────
  let userInfo;
  try {
    userInfo = await fetchGoogleUserInfo(tokenSet.access_token);
  } catch (err) {
    return errorRedirect(
      req,
      `Failed to retrieve Google account info: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // ── Store encrypted tokens ─────────────────────────────────────────────────
  try {
    const expiry = new Date(
      Date.now() + (tokenSet.expires_in ?? 3600) * 1000,
    ).toISOString();

    const scopeArr = tokenSet.scope ? tokenSet.scope.split(" ") : [];

    await upsertGoogleConnection(businessId, {
      google_account_id: userInfo.sub,
      google_account_email: userInfo.email,
      access_token_enc: encryptToken(tokenSet.access_token),
      ...(tokenSet.refresh_token
        ? { refresh_token_enc: encryptToken(tokenSet.refresh_token) }
        : {}),
      token_expiry: expiry,
      scopes: scopeArr,
    });

    await appendSyncEvent({
      business_id: businessId,
      event_type: "connection_made",
      payload: { google_account_email: userInfo.email },
    });
  } catch (err) {
    return errorRedirect(
      req,
      `Failed to store Google connection: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // ── Clear state cookie and redirect ───────────────────────────────────────
  const successUrl = new URL("/admin/google?status=connected", req.url);
  const response = NextResponse.redirect(successUrl);

  response.cookies.set("google_oauth_state", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
