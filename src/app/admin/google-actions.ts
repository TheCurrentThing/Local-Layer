"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/admin-auth";
import { getCurrentAdminBusinessId } from "@/lib/business";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  buildGoogleAuthUrl,
  decryptToken,
  encryptToken,
  generateOAuthState,
  isGoogleConfigured,
  listAllGbpLocations,
  revokeGoogleToken,
} from "@/lib/google-client";
import {
  getGoogleConnection,
  getGoogleLocation,
  upsertGoogleLocation,
  deleteGoogleConnection,
  deleteGoogleLocation,
  getGooglePresenceState,
  upsertGoogleSyncSettings,
  appendSyncEvent,
} from "@/lib/google-queries";
import {
  fetchAndCacheReviews,
  processGoogleSyncJobs,
  getValidAccessToken,
} from "@/lib/google-sync";
import type { GbpAvailableLocation } from "@/types/google";

function redirectWithState(
  path: string,
  params: Record<string, string>,
): never {
  const sp = new URLSearchParams(params);
  redirect(`${path}?${sp}`);
}

function isRedirectSignal(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const d = "digest" in err ? (err as { digest?: string }).digest : null;
  return typeof d === "string" && d.startsWith("NEXT_REDIRECT");
}

async function requireGoogleAdmin() {
  await requireAdminAccess();
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }
  return getCurrentAdminBusinessId();
}

function revalidateGoogle() {
  revalidatePath("/admin/google");
  revalidatePath("/admin");
}

// ─── Connect Google ───────────────────────────────────────────────────────────
// Initiates OAuth flow. Redirects to Google; state cookie is set in the
// API route handler (/api/auth/google) for CSRF protection.

export async function initiateGoogleConnectAction(): Promise<never> {
  try {
    await requireAdminAccess();

    if (!isGoogleConfigured()) {
      redirectWithState("/admin/google", {
        error: "Google OAuth is not configured. Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, and GOOGLE_TOKEN_ENCRYPTION_KEY to your environment.",
      });
    }

    const state = generateOAuthState();
    const url = buildGoogleAuthUrl(state);

    // Pass state through URL to the API route which sets the cookie
    redirect(`/api/auth/google?state=${encodeURIComponent(state)}`);
  } catch (err) {
    if (isRedirectSignal(err)) throw err;
    redirectWithState("/admin/google", {
      error: `Could not initiate Google connection: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}

// ─── Disconnect Google ────────────────────────────────────────────────────────

export async function disconnectGoogleAction(): Promise<void> {
  try {
    const businessId = await requireGoogleAdmin();
    const connection = await getGoogleConnection(businessId);

    if (connection) {
      // Best-effort token revocation
      try {
        const token =
          connection.access_token_enc ? decryptToken(connection.access_token_enc) : null;
        if (token) await revokeGoogleToken(token);
      } catch {
        // Continue even if revocation fails
      }

      await appendSyncEvent({
        business_id: businessId,
        event_type: "connection_revoked",
        payload: { google_account_email: connection.google_account_email },
      });

      await deleteGoogleLocation(businessId);
      await deleteGoogleConnection(businessId);
    }

    revalidateGoogle();
    redirect("/admin/google?status=disconnected");
  } catch (err) {
    if (isRedirectSignal(err)) throw err;
    redirectWithState("/admin/google", {
      error: `Disconnect failed: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}

// ─── Map Google Location ──────────────────────────────────────────────────────

export async function mapGoogleLocationAction(formData: FormData): Promise<void> {
  try {
    const businessId = await requireGoogleAdmin();
    const locationName = formData.get("location_name");
    if (typeof locationName !== "string" || !locationName) {
      redirectWithState("/admin/google", { error: "No location selected." });
    }

    const connection = await getGoogleConnection(businessId);
    if (!connection || connection.status !== "active") {
      redirectWithState("/admin/google", { error: "Google account is not connected." });
    }

    // Parse identifiers from location name "accounts/123/locations/456"
    const parts = locationName.split("/");
    const locationId = parts[parts.length - 1] ?? "";
    const accountName = parts.slice(0, 2).join("/");

    // Fetch display name from available locations
    const accessToken = await getValidAccessToken(connection!);
    const available = await listAllGbpLocations(accessToken);
    const match = available.find((l) => l.locationName === locationName);

    const displayName = match?.displayName ?? locationName;

    const loc = await upsertGoogleLocation(businessId, connection!.id, {
      google_account_name: accountName,
      google_location_name: locationName,
      google_location_id: locationId,
      display_name: displayName,
    });

    // Ensure default sync settings exist
    await upsertGoogleSyncSettings(businessId, {
      sync_hours: true,
      sync_specials_as_posts: true,
      sync_announcements_as_posts: true,
      auto_publish_google_posts: true,
    });

    await appendSyncEvent({
      business_id: businessId,
      event_type: "location_mapped",
      payload: {
        google_location_name: loc.google_location_name,
        display_name: loc.display_name,
      },
    });

    revalidateGoogle();
    redirect("/admin/google?status=location_mapped");
  } catch (err) {
    if (isRedirectSignal(err)) throw err;
    redirectWithState("/admin/google", {
      error: `Location mapping failed: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}

// ─── Update sync settings ─────────────────────────────────────────────────────

export async function updateGoogleSyncSettingsAction(formData: FormData): Promise<void> {
  try {
    const businessId = await requireGoogleAdmin();

    await upsertGoogleSyncSettings(businessId, {
      sync_hours: formData.get("sync_hours") === "on",
      sync_specials_as_posts: formData.get("sync_specials_as_posts") === "on",
      sync_announcements_as_posts: formData.get("sync_announcements_as_posts") === "on",
      auto_publish_google_posts: formData.get("auto_publish_google_posts") === "on",
    });

    await appendSyncEvent({
      business_id: businessId,
      event_type: "settings_updated",
    });

    revalidateGoogle();
    redirect("/admin/google?status=settings_saved");
  } catch (err) {
    if (isRedirectSignal(err)) throw err;
    redirectWithState("/admin/google", {
      error: `Settings save failed: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}

// ─── Trigger manual sync ──────────────────────────────────────────────────────

export async function triggerGoogleSyncAction(): Promise<{
  ok: boolean;
  message: string;
  detail?: { processed: number; succeeded: number; failed: number };
}> {
  try {
    const businessId = await requireGoogleAdmin();

    const result = await processGoogleSyncJobs(businessId, 20);

    revalidateGoogle();

    return {
      ok: result.failed === 0,
      message:
        result.processed === 0
          ? "No pending sync jobs."
          : `Processed ${result.processed} job(s): ${result.succeeded} succeeded, ${result.failed} failed.`,
      detail: result,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

// ─── Fetch reviews ────────────────────────────────────────────────────────────

export async function fetchGoogleReviewsAction(): Promise<{
  ok: boolean;
  message: string;
  count?: number;
}> {
  try {
    const businessId = await requireGoogleAdmin();
    const count = await fetchAndCacheReviews(businessId);
    revalidateGoogle();
    return { ok: true, message: `Fetched ${count} review(s).`, count };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

// ─── Get available Google locations (for location picker) ─────────────────────

export async function getAvailableGoogleLocationsAction(): Promise<{
  ok: boolean;
  locations: GbpAvailableLocation[];
  error?: string;
}> {
  try {
    const businessId = await requireGoogleAdmin();
    const connection = await getGoogleConnection(businessId);

    if (!connection || connection.status !== "active") {
      return { ok: false, locations: [], error: "No active Google connection." };
    }

    const accessToken = await getValidAccessToken(connection);
    const locations = await listAllGbpLocations(accessToken);
    return { ok: true, locations };
  } catch (err) {
    return {
      ok: false,
      locations: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ─── Get presence state (for page data refresh) ───────────────────────────────

export async function getGooglePresenceStateAction() {
  const businessId = await requireGoogleAdmin();
  return getGooglePresenceState(businessId);
}
