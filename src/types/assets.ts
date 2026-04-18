export type AssetType = "image" | "video" | "document";

export type AssetFolder =
  | "general"
  | "branding"
  | "hero"
  | "gallery"
  | "menu";

// Raw DB row — mirrors the assets table exactly.
export type AssetRow = {
  id: string;
  business_id: string;
  storage_path: string;
  url: string;
  type: AssetType;
  mime_type: string | null;
  filename: string | null;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  file_size_bytes: number | null;
  folder: AssetFolder;
  created_at: string;
};

// Application-level type used in components — camelCase.
export type Asset = {
  id: string;
  businessId: string;
  storagePath: string;
  url: string;
  type: AssetType;
  mimeType: string | null;
  filename: string | null;
  altText: string | null;
  width: number | null;
  height: number | null;
  fileSizeBytes: number | null;
  folder: AssetFolder;
  createdAt: string;
};

export type CreateAssetInput = {
  businessId: string;
  storagePath: string;
  url: string;
  type?: AssetType;
  mimeType?: string;
  filename?: string;
  altText?: string;
  width?: number;
  height?: number;
  fileSizeBytes?: number;
  folder?: AssetFolder;
};
