import "server-only";

import {
  decryptToken,
  encryptToken,
  refreshGoogleAccessToken,
  patchGbpLocationHours,
  createGbpLocalPost,
  updateGbpLocalPost,
  deleteGbpLocalPost,
  listGbpReviews,
} from "@/lib/google-client";

import {
  getGoogleConnection,
  getGoogleLocation,
  getGoogleSyncSettings,
  createSyncJob,
  getPendingSyncJobs,
  markJobProcessing,
  markJobDone,
  incrementJobAttempts,
  cancelStalePendingJobs,
  appendSyncEvent,
  updateGoogleConnectionTokens,
  markGoogleConnectionStatus,
  updateHoursSyncMeta,
  updatePostsSyncMeta,
  getPostsMapEntry,
  upsertPostsMapEntry,
  markPostDeleted,
  upsertReviews,
} from "@/lib/google-queries";

import { createSupabaseAdminClient } from "@/lib/supabase";

import type {
  GbpLocalPost,
  GbpPeriod,
  GoogleConnectionRow,
  GoogleSyncJobRow,
  HoursParseResult,
  ParsedHoursPeriod,
} from "@/types/google";

// ─── Token refresh ────────────────────────────────────────────────────────────

export async function getValidAccessToken(connection: GoogleConnectionRow): Promise<string> {
  const expiry = connection.token_expiry ? new Date(connection.token_expiry) : null;
  const bufferMs = 5 * 60 * 1000; // 5-minute buffer

  const tokenStillValid = expiry && expiry.getTime() - Date.now() > bufferMs;

  if (tokenStillValid && connection.access_token_enc) {
    return decryptToken(connection.access_token_enc);
  }

  // Need to refresh
  if (!connection.refresh_token_enc) {
    throw new Error("No refresh token stored. The user must reconnect their Google account.");
  }

  const refreshToken = decryptToken(connection.refresh_token_enc);
  let tokenSet;
  try {
    tokenSet = await refreshGoogleAccessToken(refreshToken);
  } catch (err) {
    await markGoogleConnectionStatus(
      connection.id,
      "expired",
      err instanceof Error ? err.message : String(err),
    );
    throw err;
  }

  const newExpiry = new Date(Date.now() + (tokenSet.expires_in ?? 3600) * 1000);
  const newAccessTokenEnc = encryptToken(tokenSet.access_token);

  await updateGoogleConnectionTokens(connection.id, newAccessTokenEnc, newExpiry.toISOString());

  return tokenSet.access_token;
}

// ─── Hours parser ─────────────────────────────────────────────────────────────
// Converts LocalLayer's free-text hours into GBP structured periods.
// LocalLayer stores hours as:
//   day_label: "Mon–Fri" | "Monday" | "Daily" | ...
//   open_text: "7am–3pm" | "Closed" | "7:00 AM – 3:00 PM" | ...

const DAY_MAP: Record<string, string[]> = {
  MONDAY:    ["mon", "monday"],
  TUESDAY:   ["tue", "tuesday"],
  WEDNESDAY: ["wed", "wednesday"],
  THURSDAY:  ["thu", "thur", "thursday"],
  FRIDAY:    ["fri", "friday"],
  SATURDAY:  ["sat", "saturday"],
  SUNDAY:    ["sun", "sunday"],
};

function labelToGbpDays(label: string): string[] {
  const normalized = label.toLowerCase().replace(/\s+/g, "");

  // "daily" / "every day" / "7 days"
  if (
    normalized.includes("daily") ||
    normalized.includes("everyday") ||
    normalized.includes("7days")
  ) {
    return ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  }

  // "Mon–Fri" / "Mon-Sat" range patterns
  const rangeMatch = normalized.match(
    /^([a-z]+)[–\-]([a-z]+)$/,
  );
  if (rangeMatch) {
    const startKey = resolveDay(rangeMatch[1]);
    const endKey = resolveDay(rangeMatch[2]);
    if (startKey && endKey) {
      return getDayRange(startKey, endKey);
    }
  }

  // "Mon, Tue, Wed" comma-separated
  if (normalized.includes(",")) {
    const parts = normalized.split(",").map((p) => p.trim());
    const days: string[] = [];
    for (const p of parts) {
      const d = resolveDay(p);
      if (d) days.push(d);
    }
    if (days.length > 0) return days;
  }

  // Single day
  const single = resolveDay(normalized);
  if (single) return [single];

  return [];
}

function resolveDay(str: string): string | null {
  const s = str.toLowerCase().replace(/\s/g, "");
  for (const [gbpDay, aliases] of Object.entries(DAY_MAP)) {
    if (aliases.some((a) => s.startsWith(a))) return gbpDay;
  }
  return null;
}

const GBP_DAYS_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

function getDayRange(start: string, end: string): string[] {
  const si = GBP_DAYS_ORDER.indexOf(start);
  const ei = GBP_DAYS_ORDER.indexOf(end);
  if (si === -1 || ei === -1) return [];
  if (si <= ei) return GBP_DAYS_ORDER.slice(si, ei + 1);
  // Wrapping range (e.g. Fri–Mon) — uncommon but handle it
  return [
    ...GBP_DAYS_ORDER.slice(si),
    ...GBP_DAYS_ORDER.slice(0, ei + 1),
  ];
}

function parseTime(str: string): { hours: number; minutes: number } | null {
  // Normalize: "7am" "7:30am" "7:30 AM" "19:00" "7:00 PM"
  const s = str.trim().toLowerCase().replace(/\s/g, "");

  const match = s.match(/^(\d{1,2})(?::(\d{2}))?([ap]m)?$/);
  if (!match) return null;

  let h = parseInt(match[1], 10);
  const m = match[2] ? parseInt(match[2], 10) : 0;
  const ampm = match[3];

  if (ampm === "pm" && h < 12) h += 12;
  if (ampm === "am" && h === 12) h = 0;

  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { hours: h, minutes: m };
}

function parseTimeRange(
  openText: string,
): { open: { hours: number; minutes: number }; close: { hours: number; minutes: number } } | null {
  // Split on em dash, en dash, or " - "
  const parts = openText.split(/[–—]|-(?=\s|\d)/).map((p) => p.trim());
  if (parts.length !== 2) return null;

  const open = parseTime(parts[0]);
  const close = parseTime(parts[1]);
  if (!open || !close) return null;

  return { open, close };
}

export function parseHoursToGbp(
  hours: { day_label: string; open_text: string; is_active: boolean }[],
): HoursParseResult {
  const activeHours = hours.filter((h) => h.is_active);
  const periods: ParsedHoursPeriod[] = [];
  const rawRows: { day_label: string; open_text: string }[] = [];
  let anyUnparseable = false;

  for (const row of activeHours) {
    const openTextNorm = row.open_text.trim().toLowerCase();

    // Explicitly closed
    if (openTextNorm === "closed" || openTextNorm === "by appointment") {
      // GBP represents closed days by omitting them from periods
      continue;
    }

    const days = labelToGbpDays(row.day_label);
    const timeRange = parseTimeRange(row.open_text);

    if (days.length === 0 || !timeRange) {
      anyUnparseable = true;
      rawRows.push({ day_label: row.day_label, open_text: row.open_text });
      continue;
    }

    for (const day of days) {
      periods.push({
        openDay: day,
        openTime: timeRange.open,
        closeDay: day,
        closeTime: timeRange.close,
      });
    }
  }

  return {
    periods,
    unparseable: anyUnparseable,
    rawRows,
  };
}

// ─── Post payload builders ────────────────────────────────────────────────────

export function buildSpecialPost(special: {
  title: string;
  description: string;
  label: string;
  price: number | null;
}): GbpLocalPost {
  const priceStr = special.price != null ? ` — $${special.price.toFixed(2)}` : "";
  const summary = `${special.title}${priceStr}\n\n${special.description}`;

  return {
    topicType: "OFFER",
    summary: summary.slice(0, 1500), // GBP max summary length
    offer: {},
  };
}

export function buildAnnouncementPost(announcement: {
  title: string;
  body: string;
}): GbpLocalPost {
  const summary = `${announcement.title}\n\n${announcement.body}`;
  return {
    topicType: "STANDARD",
    summary: summary.slice(0, 1500),
  };
}

// ─── Job queue helpers (safe to call after any admin save) ───────────────────

export async function queueHoursSyncIfEnabled(businessId: string): Promise<void> {
  try {
    const [connection, location, settings] = await Promise.all([
      getGoogleConnection(businessId),
      getGoogleLocation(businessId),
      getGoogleSyncSettings(businessId),
    ]);

    if (!connection || connection.status !== "active") return;
    if (!location || !location.sync_enabled) return;
    if (!settings?.sync_hours) return;

    // Cancel any pending hours sync — only the latest matters
    await cancelStalePendingJobs(businessId, "sync_hours");

    const job = await createSyncJob(businessId, "sync_hours", {
      sourceEntityType: "hours",
      payload: { triggered_by: "hours_change" },
    });

    await appendSyncEvent({
      business_id: businessId,
      job_id: job.id,
      event_type: "job_created",
      entity_type: "hours",
    });
  } catch {
    // Never block admin saves due to sync queue errors
  }
}

export async function queueSpecialPostIfEnabled(
  businessId: string,
  specialId: string,
  action: "upsert" | "delete",
): Promise<void> {
  try {
    const [connection, location, settings] = await Promise.all([
      getGoogleConnection(businessId),
      getGoogleLocation(businessId),
      getGoogleSyncSettings(businessId),
    ]);

    if (!connection || connection.status !== "active") return;
    if (!location || !location.sync_enabled) return;
    if (!settings?.sync_specials_as_posts) return;

    if (action === "delete") {
      // Check if there's a mapped post to delete
      const mapped = await getPostsMapEntry(businessId, "special", specialId);
      if (!mapped || mapped.status === "deleted") return;

      const job = await createSyncJob(businessId, "delete_post", {
        sourceEntityType: "special",
        sourceEntityId: specialId,
        payload: { google_post_name: mapped.google_post_name },
      });

      await appendSyncEvent({
        business_id: businessId,
        job_id: job.id,
        event_type: "job_created",
        entity_type: "special",
        entity_id: specialId,
      });
      return;
    }

    // Check whether to create or update
    const existing = await getPostsMapEntry(businessId, "special", specialId);
    const jobType = existing && existing.status === "active" ? "update_post" : "create_post";

    // Cancel any pending job for this entity — only the latest matters
    await cancelStalePendingJobs(businessId, jobType, specialId);

    const job = await createSyncJob(businessId, jobType, {
      sourceEntityType: "special",
      sourceEntityId: specialId,
    });

    await appendSyncEvent({
      business_id: businessId,
      job_id: job.id,
      event_type: "job_created",
      entity_type: "special",
      entity_id: specialId,
    });
  } catch {
    // Never block admin saves
  }
}

export async function queueAnnouncementPostIfEnabled(
  businessId: string,
  announcementId: string,
  action: "upsert" | "delete",
): Promise<void> {
  try {
    const [connection, location, settings] = await Promise.all([
      getGoogleConnection(businessId),
      getGoogleLocation(businessId),
      getGoogleSyncSettings(businessId),
    ]);

    if (!connection || connection.status !== "active") return;
    if (!location || !location.sync_enabled) return;
    if (!settings?.sync_announcements_as_posts) return;

    if (action === "delete") {
      const mapped = await getPostsMapEntry(businessId, "announcement", announcementId);
      if (!mapped || mapped.status === "deleted") return;

      const job = await createSyncJob(businessId, "delete_post", {
        sourceEntityType: "announcement",
        sourceEntityId: announcementId,
        payload: { google_post_name: mapped.google_post_name },
      });

      await appendSyncEvent({
        business_id: businessId,
        job_id: job.id,
        event_type: "job_created",
        entity_type: "announcement",
        entity_id: announcementId,
      });
      return;
    }

    const existing = await getPostsMapEntry(businessId, "announcement", announcementId);
    const jobType = existing && existing.status === "active" ? "update_post" : "create_post";
    await cancelStalePendingJobs(businessId, jobType, announcementId);

    const job = await createSyncJob(businessId, jobType, {
      sourceEntityType: "announcement",
      sourceEntityId: announcementId,
    });

    await appendSyncEvent({
      business_id: businessId,
      job_id: job.id,
      event_type: "job_created",
      entity_type: "announcement",
      entity_id: announcementId,
    });
  } catch {
    // Never block admin saves
  }
}

// ─── Sync worker ──────────────────────────────────────────────────────────────

export interface SyncWorkerResult {
  processed: number;
  succeeded: number;
  failed: number;
  errors: string[];
}

export async function processGoogleSyncJobs(
  businessId: string,
  limit = 10,
): Promise<SyncWorkerResult> {
  const result: SyncWorkerResult = {
    processed: 0,
    succeeded: 0,
    failed: 0,
    errors: [],
  };

  const connection = await getGoogleConnection(businessId);
  if (!connection || connection.status !== "active") {
    return result;
  }

  const location = await getGoogleLocation(businessId);
  if (!location || !location.sync_enabled) {
    return result;
  }

  let accessToken: string;
  try {
    accessToken = await getValidAccessToken(connection);
  } catch (err) {
    result.errors.push(`Token refresh failed: ${err instanceof Error ? err.message : String(err)}`);
    return result;
  }

  const jobs = await getPendingSyncJobs(businessId, limit);

  for (const job of jobs) {
    result.processed++;
    await incrementJobAttempts(job.id);
    await markJobProcessing(job.id);

    try {
      await processJob(job, location.google_location_name, accessToken, businessId);

      await markJobDone(job.id, "success");
      await appendSyncEvent({
        business_id: businessId,
        job_id: job.id,
        event_type: "job_success",
        entity_type: job.source_entity_type,
        entity_id: job.source_entity_id ?? undefined,
      });

      result.succeeded++;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);

      // Retry or permanently fail
      const shouldFail = job.attempts >= job.max_attempts - 1;
      await markJobDone(job.id, shouldFail ? "failed" : "pending", errMsg);

      if (shouldFail) {
        await appendSyncEvent({
          business_id: businessId,
          job_id: job.id,
          event_type: "job_failed",
          entity_type: job.source_entity_type,
          entity_id: job.source_entity_id ?? undefined,
          error: errMsg,
        });
      }

      result.failed++;
      result.errors.push(`Job ${job.id} (${job.job_type}): ${errMsg}`);
    }
  }

  return result;
}

async function processJob(
  job: GoogleSyncJobRow,
  locationName: string,
  accessToken: string,
  businessId: string,
): Promise<void> {
  const client = createSupabaseAdminClient();
  if (!client) throw new Error("Supabase not configured.");

  switch (job.job_type) {
    case "sync_hours": {
      const { data: hoursRows } = await client
        .from("business_hours")
        .select("day_label, open_text, is_active")
        .eq("business_id", businessId)
        .order("sort_order", { ascending: true });

      const hours = (hoursRows ?? []) as {
        day_label: string;
        open_text: string;
        is_active: boolean;
      }[];

      const parsed = parseHoursToGbp(hours);

      if (parsed.unparseable && parsed.periods.length === 0) {
        throw new Error(
          `Could not parse any hours into structured format. ` +
            `Unparseable rows: ${parsed.rawRows.map((r) => r.day_label).join(", ")}. ` +
            `Update hours to use a standard format like "Mon–Fri / 9am–5pm".`,
        );
      }

      await patchGbpLocationHours(locationName, parsed.periods as GbpPeriod[], accessToken);
      await updateHoursSyncMeta(businessId, "success");
      break;
    }

    case "create_post": {
      const post = await buildEntityPost(job, businessId, client);
      if (!post) throw new Error("Source entity not found or inactive.");

      const result = await createGbpLocalPost(locationName, post, accessToken);

      await upsertPostsMapEntry({
        business_id: businessId,
        source_entity_type: job.source_entity_type!,
        source_entity_id: job.source_entity_id!,
        google_post_name: result.name,
        google_location_name: locationName,
        status: "active",
      });

      await updatePostsSyncMeta(businessId);
      break;
    }

    case "update_post": {
      const mapped = await getPostsMapEntry(
        businessId,
        job.source_entity_type!,
        job.source_entity_id!,
      );

      if (!mapped || mapped.status === "deleted") {
        // No existing post — create instead
        const post = await buildEntityPost(job, businessId, client);
        if (!post) return;
        const result = await createGbpLocalPost(locationName, post, accessToken);
        await upsertPostsMapEntry({
          business_id: businessId,
          source_entity_type: job.source_entity_type!,
          source_entity_id: job.source_entity_id!,
          google_post_name: result.name,
          google_location_name: locationName,
          status: "active",
        });
        break;
      }

      const post = await buildEntityPost(job, businessId, client);
      if (!post) return;

      await updateGbpLocalPost(mapped.google_post_name, post, accessToken);
      await updatePostsSyncMeta(businessId);
      break;
    }

    case "delete_post": {
      const postName =
        (job.payload as Record<string, string>).google_post_name ??
        (await getPostsMapEntry(businessId, job.source_entity_type!, job.source_entity_id!))
          ?.google_post_name;

      if (!postName) return; // Already gone

      await deleteGbpLocalPost(postName, accessToken);
      await markPostDeleted(
        businessId,
        job.source_entity_type!,
        job.source_entity_id!,
      );
      break;
    }

    default:
      throw new Error(`Unknown job type: ${job.job_type}`);
  }
}

async function buildEntityPost(
  job: GoogleSyncJobRow,
  businessId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any,
): Promise<GbpLocalPost | null> {
  if (job.source_entity_type === "special") {
    const { data } = await client
      .from("specials")
      .select("title, description, label, price")
      .eq("business_id", businessId)
      .eq("id", job.source_entity_id)
      .eq("is_active", true)
      .maybeSingle();

    if (!data) return null;
    return buildSpecialPost(data);
  }

  if (job.source_entity_type === "announcement") {
    const { data } = await client
      .from("announcements")
      .select("title, body")
      .eq("business_id", businessId)
      .eq("id", job.source_entity_id)
      .eq("is_active", true)
      .maybeSingle();

    if (!data) return null;
    return buildAnnouncementPost(data);
  }

  return null;
}

// ─── Reviews fetch ────────────────────────────────────────────────────────────

export async function fetchAndCacheReviews(businessId: string): Promise<number> {
  const connection = await getGoogleConnection(businessId);
  if (!connection || connection.status !== "active") {
    throw new Error("No active Google connection.");
  }

  const location = await getGoogleLocation(businessId);
  if (!location) throw new Error("No Google location mapped.");

  const accessToken = await getValidAccessToken(connection);
  const reviews = await listGbpReviews(location.google_location_name, accessToken, 50);
  await upsertReviews(businessId, reviews);

  await appendSyncEvent({
    business_id: businessId,
    event_type: "reviews_fetched",
    payload: { count: reviews.length },
  });

  return reviews.length;
}
