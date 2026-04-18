import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase";

import type {
  GoogleConnectionRow,
  GoogleLocationRow,
  GooglePresenceState,
  GoogleReviewCacheRow,
  GoogleReviewSummary,
  GoogleSourceEntityType,
  GoogleSyncEventRow,
  GoogleSyncJobRow,
  GoogleSyncJobType,
  GoogleSyncSettingsRow,
  GooglePostsMapRow,
  GbpReview,
  GoogleStarRating,
} from "@/types/google";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function db() {
  const client = createSupabaseAdminClient();
  if (!client) throw new Error("Supabase is not configured.");
  return client;
}

function now(): string {
  return new Date().toISOString();
}

const STAR_RATING_TO_NUM: Record<GoogleStarRating, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

// ─── google_connections ───────────────────────────────────────────────────────

export async function getGoogleConnection(
  businessId: string,
): Promise<GoogleConnectionRow | null> {
  const { data } = await db()
    .from("google_connections")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle<GoogleConnectionRow>();
  return data ?? null;
}

export async function upsertGoogleConnection(
  businessId: string,
  fields: {
    google_account_id: string;
    google_account_email: string;
    access_token_enc: string;
    refresh_token_enc?: string;
    token_expiry: string;
    scopes: string[];
    status?: string;
  },
): Promise<GoogleConnectionRow> {
  const { data, error } = await db()
    .from("google_connections")
    .upsert(
      {
        business_id: businessId,
        ...fields,
        status: fields.status ?? "active",
        error_message: null,
        updated_at: now(),
      },
      { onConflict: "business_id" },
    )
    .select()
    .single<GoogleConnectionRow>();

  if (error) throw new Error(`Failed to upsert Google connection: ${error.message}`);
  if (!data) throw new Error("No data returned from Google connection upsert.");
  return data;
}

export async function updateGoogleConnectionTokens(
  connectionId: string,
  accessTokenEnc: string,
  tokenExpiry: string,
): Promise<void> {
  await db()
    .from("google_connections")
    .update({
      access_token_enc: accessTokenEnc,
      token_expiry: tokenExpiry,
      status: "active",
      error_message: null,
      updated_at: now(),
    })
    .eq("id", connectionId);
}

export async function markGoogleConnectionStatus(
  connectionId: string,
  status: string,
  errorMessage?: string,
): Promise<void> {
  await db()
    .from("google_connections")
    .update({
      status,
      error_message: errorMessage ?? null,
      updated_at: now(),
    })
    .eq("id", connectionId);
}

export async function deleteGoogleConnection(businessId: string): Promise<void> {
  await db()
    .from("google_connections")
    .delete()
    .eq("business_id", businessId);
}

// ─── google_locations ─────────────────────────────────────────────────────────

export async function getGoogleLocation(
  businessId: string,
): Promise<GoogleLocationRow | null> {
  const { data } = await db()
    .from("google_locations")
    .select("*")
    .eq("business_id", businessId)
    .eq("is_primary", true)
    .maybeSingle<GoogleLocationRow>();
  return data ?? null;
}

export async function upsertGoogleLocation(
  businessId: string,
  connectionId: string,
  fields: {
    google_account_name: string;
    google_location_name: string;
    google_location_id: string;
    display_name: string;
    verification_state?: string | null;
  },
): Promise<GoogleLocationRow> {
  // Remove any existing primary location first
  await db()
    .from("google_locations")
    .delete()
    .eq("business_id", businessId)
    .eq("is_primary", true);

  const { data, error } = await db()
    .from("google_locations")
    .insert({
      business_id: businessId,
      google_connection_id: connectionId,
      ...fields,
      is_primary: true,
      sync_enabled: true,
      updated_at: now(),
    })
    .select()
    .single<GoogleLocationRow>();

  if (error) throw new Error(`Failed to upsert Google location: ${error.message}`);
  if (!data) throw new Error("No data returned from Google location insert.");
  return data;
}

export async function deleteGoogleLocation(businessId: string): Promise<void> {
  await db()
    .from("google_locations")
    .delete()
    .eq("business_id", businessId);
}

// ─── google_sync_settings ─────────────────────────────────────────────────────

export async function getGoogleSyncSettings(
  businessId: string,
): Promise<GoogleSyncSettingsRow | null> {
  const { data } = await db()
    .from("google_sync_settings")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle<GoogleSyncSettingsRow>();
  return data ?? null;
}

export async function upsertGoogleSyncSettings(
  businessId: string,
  settings: Partial<
    Pick<
      GoogleSyncSettingsRow,
      | "sync_hours"
      | "sync_photos"
      | "sync_specials_as_posts"
      | "sync_announcements_as_posts"
      | "auto_publish_google_posts"
    >
  >,
): Promise<GoogleSyncSettingsRow> {
  const { data, error } = await db()
    .from("google_sync_settings")
    .upsert(
      { business_id: businessId, ...settings, updated_at: now() },
      { onConflict: "business_id" },
    )
    .select()
    .single<GoogleSyncSettingsRow>();

  if (error) throw new Error(`Failed to upsert sync settings: ${error.message}`);
  if (!data) throw new Error("No data from sync settings upsert.");
  return data;
}

export async function updateHoursSyncMeta(
  businessId: string,
  status: "success" | "failed",
): Promise<void> {
  await db()
    .from("google_sync_settings")
    .update({
      last_hours_sync_at: now(),
      last_hours_sync_status: status,
      updated_at: now(),
    })
    .eq("business_id", businessId);
}

export async function updatePostsSyncMeta(businessId: string): Promise<void> {
  await db()
    .from("google_sync_settings")
    .update({ last_posts_sync_at: now(), updated_at: now() })
    .eq("business_id", businessId);
}

// ─── google_sync_jobs ─────────────────────────────────────────────────────────

export async function createSyncJob(
  businessId: string,
  jobType: GoogleSyncJobType,
  opts: {
    sourceEntityType?: GoogleSourceEntityType;
    sourceEntityId?: string;
    payload?: Record<string, unknown>;
    scheduledAt?: string;
  } = {},
): Promise<GoogleSyncJobRow> {
  const { data, error } = await db()
    .from("google_sync_jobs")
    .insert({
      business_id: businessId,
      job_type: jobType,
      source_entity_type: opts.sourceEntityType ?? null,
      source_entity_id: opts.sourceEntityId ?? null,
      payload: opts.payload ?? {},
      status: "pending",
      scheduled_at: opts.scheduledAt ?? now(),
    })
    .select()
    .single<GoogleSyncJobRow>();

  if (error) throw new Error(`Failed to create sync job: ${error.message}`);
  if (!data) throw new Error("No data from sync job insert.");
  return data;
}

export async function getPendingSyncJobs(
  businessId: string,
  limit = 10,
): Promise<GoogleSyncJobRow[]> {
  const { data } = await db()
    .from("google_sync_jobs")
    .select("*")
    .eq("business_id", businessId)
    .eq("status", "pending")
    .lte("attempts", 3)
    .order("scheduled_at", { ascending: true })
    .limit(limit);
  return (data ?? []) as GoogleSyncJobRow[];
}

export async function markJobProcessing(jobId: string): Promise<void> {
  await db()
    .from("google_sync_jobs")
    .update({ status: "processing", started_at: now(), updated_at: now() })
    .eq("id", jobId);
}

export async function markJobDone(
  jobId: string,
  outcome: "success" | "failed",
  error?: string,
): Promise<void> {
  await db()
    .from("google_sync_jobs")
    .update({
      status: outcome,
      completed_at: now(),
      last_error: error ?? null,
      updated_at: now(),
    })
    .eq("id", jobId);
}

export async function incrementJobAttempts(jobId: string): Promise<void> {
  // Supabase doesn't support .increment() on arbitrary rows cleanly via JS SDK
  // so we fetch + update
  const { data } = await db()
    .from("google_sync_jobs")
    .select("attempts")
    .eq("id", jobId)
    .single<{ attempts: number }>();

  const currentAttempts = data?.attempts ?? 0;

  await db()
    .from("google_sync_jobs")
    .update({ attempts: currentAttempts + 1, updated_at: now() })
    .eq("id", jobId);
}

export async function cancelStalePendingJobs(
  businessId: string,
  jobType: GoogleSyncJobType,
  sourceEntityId?: string,
): Promise<void> {
  let query = db()
    .from("google_sync_jobs")
    .update({ status: "cancelled", updated_at: now() })
    .eq("business_id", businessId)
    .eq("job_type", jobType)
    .eq("status", "pending");

  if (sourceEntityId) {
    query = query.eq("source_entity_id", sourceEntityId);
  }

  await query;
}

// ─── google_sync_events ───────────────────────────────────────────────────────

export async function appendSyncEvent(event: {
  business_id: string;
  job_id?: string | null;
  event_type: string;
  entity_type?: string | null;
  entity_id?: string | null;
  payload?: Record<string, unknown>;
  error?: string | null;
}): Promise<void> {
  await db().from("google_sync_events").insert({
    business_id: event.business_id,
    job_id: event.job_id ?? null,
    event_type: event.event_type,
    entity_type: event.entity_type ?? null,
    entity_id: event.entity_id ?? null,
    payload: event.payload ?? {},
    error: event.error ?? null,
  });
}

export async function getRecentSyncEvents(
  businessId: string,
  limit = 20,
): Promise<GoogleSyncEventRow[]> {
  const { data } = await db()
    .from("google_sync_events")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as GoogleSyncEventRow[];
}

// ─── google_reviews_cache ─────────────────────────────────────────────────────

export async function getReviews(
  businessId: string,
  limit = 10,
): Promise<GoogleReviewCacheRow[]> {
  const { data } = await db()
    .from("google_reviews_cache")
    .select("*")
    .eq("business_id", businessId)
    .order("create_time", { ascending: false })
    .limit(limit);
  return (data ?? []) as GoogleReviewCacheRow[];
}

export async function upsertReviews(
  businessId: string,
  reviews: GbpReview[],
): Promise<void> {
  if (reviews.length === 0) return;

  const rows = reviews.map((r) => ({
    business_id: businessId,
    google_review_id: r.reviewId,
    reviewer_name: r.reviewer.isAnonymous ? null : r.reviewer.displayName,
    reviewer_photo_url: r.reviewer.profilePhotoUrl ?? null,
    star_rating: r.starRating,
    rating_numeric: STAR_RATING_TO_NUM[r.starRating],
    comment: r.comment ?? null,
    create_time: r.createTime,
    update_time: r.updateTime,
    reply_comment: r.reviewReply?.comment ?? null,
    reply_time: r.reviewReply?.updateTime ?? null,
    fetched_at: now(),
  }));

  await db()
    .from("google_reviews_cache")
    .upsert(rows, { onConflict: "business_id,google_review_id" });
}

export async function getReviewSummary(businessId: string): Promise<GoogleReviewSummary | null> {
  const reviews = await getReviews(businessId, 50);
  if (reviews.length === 0) return null;

  const total = reviews.reduce((sum, r) => sum + r.rating_numeric, 0);
  const latest = reviews
    .slice()
    .sort((a, b) => (b.create_time ?? "").localeCompare(a.create_time ?? ""))
    .slice(0, 5);

  const lastFetched = reviews.reduce<string | null>((max, r) => {
    if (!max) return r.fetched_at;
    return r.fetched_at > max ? r.fetched_at : max;
  }, null);

  return {
    count: reviews.length,
    averageRating: Math.round((total / reviews.length) * 10) / 10,
    latestReviews: latest,
    lastFetchedAt: lastFetched,
  };
}

// ─── google_posts_map ─────────────────────────────────────────────────────────

export async function getPostsMapEntry(
  businessId: string,
  sourceEntityType: string,
  sourceEntityId: string,
): Promise<GooglePostsMapRow | null> {
  const { data } = await db()
    .from("google_posts_map")
    .select("*")
    .eq("business_id", businessId)
    .eq("source_entity_type", sourceEntityType)
    .eq("source_entity_id", sourceEntityId)
    .maybeSingle<GooglePostsMapRow>();
  return data ?? null;
}

export async function upsertPostsMapEntry(entry: {
  business_id: string;
  source_entity_type: string;
  source_entity_id: string;
  google_post_name: string;
  google_location_name: string;
  status?: string;
}): Promise<void> {
  await db()
    .from("google_posts_map")
    .upsert(
      { ...entry, status: entry.status ?? "active", updated_at: now() },
      { onConflict: "business_id,source_entity_type,source_entity_id" },
    );
}

export async function markPostDeleted(
  businessId: string,
  sourceEntityType: string,
  sourceEntityId: string,
): Promise<void> {
  await db()
    .from("google_posts_map")
    .update({ status: "deleted", updated_at: now() })
    .eq("business_id", businessId)
    .eq("source_entity_type", sourceEntityType)
    .eq("source_entity_id", sourceEntityId);
}

// ─── Aggregated presence state ────────────────────────────────────────────────

export async function getGooglePresenceState(
  businessId: string,
): Promise<GooglePresenceState> {
  const [connection, location, settings, pendingJobsResult, events, reviewSummary] =
    await Promise.all([
      getGoogleConnection(businessId),
      getGoogleLocation(businessId),
      getGoogleSyncSettings(businessId),
      db()
        .from("google_sync_jobs")
        .select("id", { count: "exact", head: true })
        .eq("business_id", businessId)
        .eq("status", "pending"),
      getRecentSyncEvents(businessId, 10),
      getReviewSummary(businessId),
    ]);

  const pendingJobCount = pendingJobsResult.count ?? 0;
  const isConnected = connection !== null && connection.status === "active";
  const isLocationMapped = location !== null && location.sync_enabled;
  const canSync = isConnected && isLocationMapped;

  return {
    connection,
    location,
    settings,
    pendingJobCount,
    recentEvents: events,
    reviewSummary,
    isConnected,
    isLocationMapped,
    canSync,
  };
}
