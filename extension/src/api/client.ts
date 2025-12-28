import { API_URL, API_KEY } from '../config';
import type {
  SaveUrlRequest,
  SaveUrlResponse,
  GetUrlsResponse,
  ApiError,
} from '../types';

class ApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = API_URL;
    this.apiKey = API_KEY;
  }

  /**
   * Check if the API is configured
   */
  isConfigured(): boolean {
    return (
      this.baseUrl !== 'YOUR_API_GATEWAY_URL_HERE' &&
      this.apiKey !== 'YOUR_API_KEY_HERE' &&
      this.baseUrl.length > 0 &&
      this.apiKey.length > 0
    );
  }

  /**
   * Save a URL to the backend
   */
  async saveUrl(
    url: string,
    title: string,
    faviconUrl?: string
  ): Promise<SaveUrlResponse> {
    if (!this.isConfigured()) {
      throw new Error(
        'API not configured. Please update API_URL and API_KEY in src/config/index.ts'
      );
    }

    const requestBody: SaveUrlRequest = {
      url,
      title,
      ...(faviconUrl && { faviconUrl }),
    };

    const response = await fetch(`${this.baseUrl}/api/urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to save URL');
    }

    return response.json();
  }

  /**
   * Get saved URLs from the backend
   */
  async getUrls(limit?: number, lastKey?: string): Promise<GetUrlsResponse> {
    if (!this.isConfigured()) {
      throw new Error(
        'API not configured. Please update API_URL and API_KEY in src/config/index.ts'
      );
    }

    const params = new URLSearchParams();
    if (limit) {
      params.append('limit', limit.toString());
    }
    if (lastKey) {
      params.append('lastKey', lastKey);
    }

    const url = `${this.baseUrl}/api/urls${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Failed to fetch URLs');
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
