import { NextRequest, NextResponse } from "next/server";
import {
  buildGoogleAuthUrl,
  generateOAuthState,
  isGoogleConfigured,
} from "@/lib/google-client";

// GET /api/auth/google
// Initiates the Google OAuth flow.
// Sets a secure, httpOnly state cookie for CSRF protection,
// then redirects the browser to Google's authorization endpoint.

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!isGoogleConfigured()) {
    return NextResponse.redirect(
      new URL(
        "/admin/google?error=Google+OAuth+is+not+configured.+Check+your+environment+variables.",
        req.url,
      ),
    );
  }

  // Accept a pre-generated state from the server action, or generate a fresh one
  const incomingState = req.nextUrl.searchParams.get("state");
  const state = incomingState ?? generateOAuthState();
  const authUrl = buildGoogleAuthUrl(state);

  const response = NextResponse.redirect(authUrl);

  // Store state in a short-lived httpOnly cookie for verification on callback
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes — plenty for an OAuth round-trip
    path: "/",
  });

  return response;
}
