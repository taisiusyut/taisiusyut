export interface Schema$CloudinarySign {
  signature: string;
  timestamp: number; // unix time
}

export interface Param$CloudinaryUpload extends Schema$CloudinarySign {
  file: File | Buffer | string;
  api_key?: string;
  eager?: string;
}

export interface Response$CloudinaryUpload {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: any[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}
