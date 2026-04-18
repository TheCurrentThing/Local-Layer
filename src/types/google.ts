// ─── Database row types ───────────────────────────────────────────────────────

export type GoogleConnectionStatus = "active" | "expired" | "revoked" | "error";
export type GoogleSyncJobStatus = "pending" | "processing" | "success" | "failed" | "cancelled";
export type GoogleSyncJobType = "sync_hours" | "create_post" | "update_post" | "delete_post" | "upload_photo";
export type GoogleSourceEntityType = "special" | "announcement" | "hours" | "photo";
export type GoogleStarRating = "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";

export interface GoogleConnectionRow {
  id: string;
  business_id: string;
  google_account_id: string;
  google_account_email: string;
  access_token_enc: string | null;
  refresh_token_enc: string | null;
  token_expiry: string | null;
  scopes: string[];
  status: GoogleConnectionStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoogleLocationRow {
  id: string;
  business_id: string;
  google_connection_id: string;
  google_account_name: string;
  google_location_name: string;
  google_location_id: string;
  display_name: string;
  is_primary: boolean;
  sync_enabled: boolean;
  verification_state: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoogleSyncSettingsRow {
  id: string;
  business_id: string;
  sync_hours: boolean;
  sync_photos: boolean;
  sync_specials_as_posts: boolean;
  sync_announcements_as_posts: boolean;
  auto_publish_google_posts: boolean;
  last_hours_sync_at: string | null;
  last_hours_sync_status: string | null;
  last_posts_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoogleSyncJobRow {
  id: string;
  business_id: string;
  job_type: GoogleSyncJobType;
  source_entity_type: GoogleSourceEntityType | null;
  source_entity_id: string | null;
  payload: Record<string, unknown>;
  status: GoogleSyncJobStatus;
  attempts: number;
  max_attempts: number;
  last_error: string | null;
  scheduled_at: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoogleSyncEventRow {
  id: string;
  business_id: string;
  job_id: string | null;
  event_type: string;
  entity_type: string | null;
  entity_id: string | null;
  payload: Record<string, unknown>;
  error: string | null;
  created_at: string;
}

export interface GoogleReviewCacheRow {
  id: string;
  business_id: string;
  google_review_id: string;
  reviewer_name: string | null;
  reviewer_photo_url: string | null;
  star_rating: GoogleStarRating;
  rating_numeric: number;
  comment: string | null;
  create_time: string | null;
  update_time: string | null;
  reply_comment: string | null;
  reply_time: string | null;
  fetched_at: string;
}

export interface GooglePostsMapRow {
  id: string;
  business_id: string;
  source_entity_type: string;
  source_entity_id: string;
  google_post_name: string;
  google_location_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// ─── GBP API types (subset of Google's response shapes) ──────────────────────

export interface GbpAccount {
  name: string;          // "accounts/123456789"
  accountName: string;
  type: string;          // "PERSONAL" | "LOCATION_GROUP" | "USER_GROUP" | "ORGANIZATION"
  state?: { status: string };
}

export interface GbpLocation {
  name: string;          // "accounts/123/locations/456"
  title: string;
  storeCode?: string;
  websiteUri?: string;
  metadata?: {
    mapsUri?: string;
    newReviewUri?: string;
    placeId?: string;
  };
  storefrontAddress?: {
    regionCode: string;
    locality: string;
    addressLines: string[];
  };
}

export interface GbpTimePeriod {
  hours: number;
  minutes?: number;
}

export interface GbpPeriod {
  openDay: string;   // 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
  openTime: GbpTimePeriod;
  closeDay: string;
  closeTime: GbpTimePeriod;
}

export interface GbpLocalPost {
  name?: string;
  summary: string;
  callToAction?: {
    actionType: string;
    url?: string;
  };
  topicType: string;     // 'STANDARD' | 'EVENT' | 'OFFER' | 'ALERT'
  event?: {
    title: string;
    schedule: {
      startDate: { year: number; month: number; day: number };
      startTime?: GbpTimePeriod;
      endDate: { year: number; month: number; day: number };
      endTime?: GbpTimePeriod;
    };
  };
  offer?: {
    couponCode?: string;
    redeemOnlineUrl?: string;
    termsConditions?: string;
  };
}

export interface GbpReview {
  name: string;
  reviewId: string;
  reviewer: {
    profilePhotoUrl?: string;
    displayName: string;
    isAnonymous?: boolean;
  };
  starRating: GoogleStarRating;
  comment?: string;
  createTime: string;
  updateTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
}

// ─── Application-level types ──────────────────────────────────────────────────

export interface GbpAvailableLocation {
  accountName: string;      // "accounts/123"
  locationName: string;     // "accounts/123/locations/456"
  locationId: string;       // "456"
  displayName: string;
  address?: string;
}

export interface GoogleReviewSummary {
  count: number;
  averageRating: number;
  latestReviews: GoogleReviewCacheRow[];
  lastFetchedAt: string | null;
}

export interface GooglePresenceState {
  connection: GoogleConnectionRow | null;
  location: GoogleLocationRow | null;
  settings: GoogleSyncSettingsRow | null;
  pendingJobCount: number;
  recentEvents: GoogleSyncEventRow[];
  reviewSummary: GoogleReviewSummary | null;
  isConnected: boolean;
  isLocationMapped: boolean;
  canSync: boolean;
}

export interface ParsedHoursPeriod {
  openDay: string;
  openTime: { hours: number; minutes: number };
  closeDay: string;
  closeTime: { hours: number; minutes: number };
}

export interface HoursParseResult {
  periods: ParsedHoursPeriod[];
  unparseable: boolean;
  rawRows: { day_label: string; open_text: string }[];
}

export interface GoogleTokenSet {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type: string;
  id_token?: string;
}

export interface GoogleUserInfo {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}
