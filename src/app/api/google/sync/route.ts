import { NextRequest, NextResponse } from "next/server";
import { processGoogleSyncJobs } from "@/lib/google-sync";
import { getCurrentAdminBusinessId } from "@/lib/business";
import { isSupabaseConfigured } from "@/lib/supabase";

// POST /api/google/sync
// Processes pending Google sync jobs for a business.
//
// Protected by LOCALLAYER_ONBOARD_SECRET header (or GOOGLE_SYNC_SECRET if set).
// Can be called by:
//   - An external cron job (Vercel Cron, GitHub Actions, etc.)
//   - The admin UI "Sync Now" button (via server action)
//
// Body (optional):
//   { business_id?: string, limit?: number }

export const dynamic = "force-dynamic";
export const maxDuration = 60; // seconds — generous window for API calls

function isSyncAuthorized(req: NextRequest): boolean {
  const secret =
    process.env.GOOGLE_SYNC_SECRET || process.env.LOCALLAYER_ONBOARD_SECRET;

  if (!secret) {
    // No secret configured → only allow in development
    return process.env.NODE_ENV === "development";
  }

  const authHeader = req.headers.get("authorization");
  const secretHeader = req.headers.get("x-locallayer-secret");

  // Accept either Authorization: Bearer <secret> or X-LocalLayer-Secret: <secret>
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7) === secret;
  }

  return secretHeader === secret;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isSyncAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  let bodyBusinessId: string | undefined;
  let limit = 10;

  try {
    const body = await req.json().catch(() => ({}));
    if (typeof body.business_id === "string") bodyBusinessId = body.business_id;
    if (typeof body.limit === "number" && body.limit > 0 && body.limit <= 50) {
      limit = body.limit;
    }
  } catch {
    // Body is optional
  }

  let businessId: string;
  try {
    businessId = bodyBusinessId ?? (await getCurrentAdminBusinessId());
  } catch (err) {
    return NextResponse.json(
      { error: `Could not determine business: ${err instanceof Error ? err.message : String(err)}` },
      { status: 400 },
    );
  }

  try {
    const result = await processGoogleSyncJobs(businessId, limit);
    return NextResponse.json({
      ok: result.failed === 0,
      ...result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}

// GET /api/google/sync — health check
export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!isSyncAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    message: "Google sync worker ready. POST to this endpoint to process pending jobs.",
    env: {
      supabaseConfigured: isSupabaseConfigured(),
      googleConfigured: Boolean(
        process.env.GOOGLE_CLIENT_ID &&
          process.env.GOOGLE_CLIENT_SECRET &&
          process.env.GOOGLE_TOKEN_ENCRYPTION_KEY,
      ),
    },
  });
}
