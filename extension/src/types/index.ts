export interface SavedUrl {
  id: string;
  url: string;
  title: string;
  faviconUrl?: string;
  savedAt: number;
  tags?: string[];
  notes?: string;
}

export interface SaveUrlRequest {
  url: string;
  title: string;
  faviconUrl?: string;
}

export interface SaveUrlResponse {
  id: string;
  url: string;
  title: string;
  faviconUrl?: string;
  savedAt: number;
}

export interface GetUrlsResponse {
  urls: SavedUrl[];
  hasMore: boolean;
  lastKey?: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
