/**
 * Lambda handler for saving URLs
 * POST /api/urls
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { saveUrl } from '../lib/dynamodb';
import {
  created,
  badRequest,
  unauthorized,
  internalServerError,
} from '../lib/response';
import {
  SaveUrlRequest,
  SaveUrlResponse,
  SavedURL,
  ApiHeaders,
  ValidationError,
  AuthenticationError,
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
 * Validate URL format
 * @param url URL to validate
 * @returns True if valid, throws error otherwise
 */
function validateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new ValidationError('URL must use HTTP or HTTPS protocol');
    }
    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError('Invalid URL format');
  }
}

/**
 * Validate and parse request body
 * @param body Request body string
 * @returns Parsed and validated request data
 */
function validateRequestBody(body: string | null): SaveUrlRequest {
  if (!body) {
    throw new ValidationError('Request body is required');
  }

  let requestData: SaveUrlRequest;
  try {
    requestData = JSON.parse(body) as SaveUrlRequest;
  } catch (error) {
    throw new ValidationError('Invalid JSON in request body');
  }

  // Validate required fields
  if (!requestData.url || typeof requestData.url !== 'string') {
    throw new ValidationError('Field "url" is required and must be a string');
  }

  if (!requestData.title || typeof requestData.title !== 'string') {
    throw new ValidationError('Field "title" is required and must be a string');
  }

  // Validate URL format
  validateUrl(requestData.url);

  // Validate optional fields
  if (requestData.faviconUrl && typeof requestData.faviconUrl !== 'string') {
    throw new ValidationError('Field "faviconUrl" must be a string');
  }

  // Validate faviconUrl if provided
  if (requestData.faviconUrl) {
    try {
      validateUrl(requestData.faviconUrl);
    } catch (error) {
      // If favicon URL is invalid, just remove it instead of failing
      console.warn('Invalid favicon URL, removing:', requestData.faviconUrl);
      delete requestData.faviconUrl;
    }
  }

  // Trim whitespace
  requestData.url = requestData.url.trim();
  requestData.title = requestData.title.trim();
  if (requestData.faviconUrl) {
    requestData.faviconUrl = requestData.faviconUrl.trim();
  }

  // Validate length constraints
  if (requestData.url.length > 2048) {
    throw new ValidationError('URL exceeds maximum length of 2048 characters');
  }

  if (requestData.title.length > 500) {
    throw new ValidationError('Title exceeds maximum length of 500 characters');
  }

  if (requestData.faviconUrl && requestData.faviconUrl.length > 2048) {
    throw new ValidationError('Favicon URL exceeds maximum length of 2048 characters');
  }

  return requestData;
}

/**
 * Lambda handler for POST /api/urls
 * Saves a new URL to the database
 */
export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  console.log('SaveUrl handler invoked', {
    method: event.httpMethod,
    path: event.path,
    headers: event.headers,
  });

  try {
    // Validate API key
    validateApiKey(event.headers as ApiHeaders);

    // Validate and parse request body
    const requestData = validateRequestBody(event.body);

    // Create SavedURL object
    const savedUrl: SavedURL = {
      id: uuidv4(),
      url: requestData.url,
      title: requestData.title,
      faviconUrl: requestData.faviconUrl,
      savedAt: Date.now(),
    };

    // Save to DynamoDB
    await saveUrl(savedUrl);

    // Create response
    const response: SaveUrlResponse = {
      id: savedUrl.id,
      url: savedUrl.url,
      title: savedUrl.title,
      faviconUrl: savedUrl.faviconUrl,
      savedAt: savedUrl.savedAt,
    };

    console.log('URL saved successfully:', savedUrl.id);
    return created(response);
  } catch (error) {
    console.error('Error in SaveUrl handler:', error);

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
