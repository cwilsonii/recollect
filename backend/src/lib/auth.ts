/**
 * Authentication utilities
 */

import { ApiHeaders, AuthenticationError } from './types';

/**
 * Extract API key from request headers
 * Supports both lowercase and uppercase variants
 * @param headers Request headers
 * @returns API key if found
 * @throws AuthenticationError if not found
 */
export function extractApiKey(headers: ApiHeaders): string {
  const apiKey = headers['x-api-key'] || headers['X-API-Key'];

  if (!apiKey) {
    throw new AuthenticationError('Missing API key. Include X-API-Key header in your request.');
  }

  return apiKey;
}

/**
 * Validate API key against expected value
 * @param apiKey API key from request
 * @returns True if valid
 * @throws AuthenticationError if invalid
 */
export function validateApiKey(apiKey: string): boolean {
  const expectedApiKey = process.env.API_KEY;

  if (!expectedApiKey) {
    console.error('API_KEY environment variable is not set');
    throw new Error('Server configuration error: API key not configured');
  }

  if (apiKey !== expectedApiKey) {
    throw new AuthenticationError('Invalid API key');
  }

  return true;
}

/**
 * Authenticate request by validating API key
 * @param headers Request headers
 * @returns True if authenticated
 * @throws AuthenticationError if not authenticated
 */
export function authenticateRequest(headers: ApiHeaders): boolean {
  const apiKey = extractApiKey(headers);
  return validateApiKey(apiKey);
}
