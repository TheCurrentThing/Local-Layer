import "server-only";
import { getSupabaseAdminClientOrThrow } from "@/lib/supabase";
import type { Asset, AssetRow, AssetFolder, CreateAssetInput } from "@/types/assets";

function mapAsset(row: AssetRow): Asset {
  return {
    id: row.id,
    businessId: row.business_id,
    storagePath: row.storage_path,
    url: row.url,
    type: row.type,
    mimeType: row.mime_type,
    filename: row.filename,
    altText: row.alt_text,
    width: row.width,
    height: row.height,
    fileSizeBytes: row.file_size_bytes,
    folder: row.folder,
    createdAt: row.created_at,
  };
}

function db() {
  return getSupabaseAdminClientOrThrow();
}

// ─── QUERIES ─────────────────────────────────────────────────────────────────

export async function getAssets(
  businessId: string,
  options: { folder?: AssetFolder; limit?: number } = {},
): Promise<Asset[]> {
  let query = db()
    .from("assets")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (options.folder) {
    query = query.eq("folder", options.folder);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query.returns<AssetRow[]>();
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapAsset);
}

export async function getAssetById(
  businessId: string,
  assetId: string,
): Promise<Asset | null> {
  const { data } = await db()
    .from("assets")
    .select("*")
    .eq("id", assetId)
    .eq("business_id", businessId)
    .maybeSingle<AssetRow>();
  return data ? mapAsset(data) : null;
}

export async function createAsset(input: CreateAssetInput): Promise<Asset> {
  const { data, error } = await db()
    .from("assets")
    .insert({
      business_id: input.businessId,
      storage_path: input.storagePath,
      url: input.url,
      type: input.type ?? "image",
      mime_type: input.mimeType ?? null,
      filename: input.filename ?? null,
      alt_text: input.altText ?? null,
      width: input.width ?? null,
      height: input.height ?? null,
      file_size_bytes: input.fileSizeBytes ?? null,
      folder: input.folder ?? "general",
    })
    .select()
    .single<AssetRow>();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Asset could not be created.");
  return mapAsset(data);
}

export async function updateAssetAltText(
  businessId: string,
  assetId: string,
  altText: string,
): Promise<void> {
  const { error } = await db()
    .from("assets")
    .update({ alt_text: altText })
    .eq("id", assetId)
    .eq("business_id", businessId);
  if (error) throw new Error(error.message);
}

export async function deleteAsset(
  businessId: string,
  assetId: string,
): Promise<{ storagePath: string } | null> {
  const { data, error } = await db()
    .from("assets")
    .delete()
    .eq("id", assetId)
    .eq("business_id", businessId)
    .select("storage_path")
    .maybeSingle<{ storage_path: string }>();

  if (error) throw new Error(error.message);
  return data ? { storagePath: data.storage_path } : null;
}

export async function getAssetCount(
  businessId: string,
  folder?: AssetFolder,
): Promise<number> {
  let query = db()
    .from("assets")
    .select("id", { count: "exact", head: true })
    .eq("business_id", businessId);

  if (folder) query = query.eq("folder", folder);

  const { count } = await query;
  return count ?? 0;
}
