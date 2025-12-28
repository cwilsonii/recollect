/**
 * Type definitions for Recollect backend
 */

/**
 * Saved URL entity stored in DynamoDB
 */
export interface SavedURL {
  id: string;
  url: string;
  title: string;
  faviconUrl?: string;
  savedAt: number;
  tags?: string[];
  notes?: string;
}

/**
 * Request body for saving a new URL
 */
export interface SaveUrlRequest {
  url: string;
  title: string;
  faviconUrl?: string;
}

/**
 * Response body for saving a URL
 */
export interface SaveUrlResponse {
  id: string;
  url: string;
  title: string;
  faviconUrl?: string;
  savedAt: number;
}

/**
 * Query parameters for getting URLs
 */
export interface GetUrlsQueryParams {
  limit?: string;
  lastKey?: string;
}

/**
 * Response body for getting URLs
 */
export interface GetUrlsResponse {
  urls: SavedURL[];
  hasMore: boolean;
  lastKey?: string;
}

/**
 * Error response body
 */
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

/**
 * DynamoDB pagination token
 */
export interface PaginationToken {
  id: string;
  savedAt: number;
}

/**
 * Environment variables
 */
export interface EnvironmentVariables {
  TABLE_NAME: string;
  API_KEY: string;
  AWS_REGION: string;
}

/**
 * API Gateway HTTP event headers
 */
export interface ApiHeaders {
  'x-api-key'?: string;
  'X-API-Key'?: string;
  'content-type'?: string;
  'Content-Type'?: string;
  [key: string]: string | undefined;
}

/**
 * Validation error
 */
export class ValidationError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

/**
 * Internal server error
 */
export class InternalServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
  }
}
