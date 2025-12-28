/**
 * Lambda handler for retrieving URLs
 * GET /api/urls
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUrls, decodePaginationToken } from '../lib/dynamodb';
import {
  ok,
  badRequest,
  unauthorized,
  internalServerError,
} from '../lib/response';
import {
  GetUrlsResponse,
  ApiHeaders,
  ValidationError,
  AuthenticationError,
  PaginationToken,
} from '../lib/types';

/**
 * Validate API key from request headers
 * @param headers Request headers
 * @returns True if valid, throws error otherwise
 */
function validateApiKey(headers: ApiHeaders): boolean {
  const apiKey = headers['x-api-key'] || headers['X-API-Key'];
  const expectedApiKey = process.env.API_KEY;

  if (!expectedApiKey) {
    console.error('API_KEY environment variable not set');
    throw new Error('Server configuration error');
  }

  if (!apiKey) {
    throw new AuthenticationError('Missing API key');
  }

  if (apiKey !== expectedApiKey) {
    throw new AuthenticationError('Invalid API key');
  }

  return true;
}

/**
 * Parse and validate query parameters
 * @param event API Gateway event
 * @returns Validated limit and lastKey
 */
function parseQueryParameters(event: APIGatewayProxyEvent): {
  limit: number;
  lastKey?: PaginationToken;
} {
  const queryParams = event.queryStringParameters || {};

  // Parse limit parameter
  let limit = 50; // Default limit
  if (queryParams.limit) {
    const parsedLimit = parseInt(queryParams.limit, 10);

    if (isNaN(parsedLimit)) {
      throw new ValidationError('Parameter "limit" must be a valid number');
    }

    if (parsedLimit < 1) {
      throw new ValidationError('Parameter "limit" must be at least 1');
    }

    if (parsedLimit > 100) {
      throw new ValidationError('Parameter "limit" cannot exceed 100');
    }

    limit = parsedLimit;
  }

  // Parse lastKey parameter (pagination token)
  let lastKey: PaginationToken | undefined;
  if (queryParams.lastKey) {
    try {
      lastKey = decodePaginationToken(queryParams.lastKey);
    } catch (error) {
      throw new ValidationError('Invalid pagination token');
    }
  }

  return { limit, lastKey };
}

/**
 * Lambda handler for GET /api/urls
 * Retrieves saved URLs with pagination support
 */
export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  console.log('GetUrls handler invoked', {
    method: event.httpMethod,
    path: event.path,
    queryParams: event.queryStringParameters,
    headers: event.headers,
  });

  try {
    // Validate API key
    validateApiKey(event.headers as ApiHeaders);

    // Parse and validate query parameters
    const { limit, lastKey } = parseQueryParameters(event);

    console.log('Fetching URLs with parameters:', { limit, lastKey });

    // Fetch URLs from DynamoDB
    const result = await getUrls(limit, lastKey);

    // Create response
    const response: GetUrlsResponse = {
      urls: result.urls,
      hasMore: result.hasMore,
      lastKey: result.lastKey,
    };

    console.log(`Successfully retrieved ${result.urls.length} URLs`);
    return ok(response);
  } catch (error) {
    console.error('Error in GetUrls handler:', error);

    // Handle specific error types
    if (error instanceof ValidationError) {
      return badRequest(error.message);
    }

    if (error instanceof AuthenticationError) {
      return unauthorized(error.message);
    }

    // Generic error handler
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return internalServerError(errorMessage);
  }
}
