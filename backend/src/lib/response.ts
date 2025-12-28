/**
 * API response helper functions
 * Provides consistent response formatting and CORS headers
 */

import { APIGatewayProxyResult } from 'aws-lambda';
import { ErrorResponse } from './types';

/**
 * CORS headers for all API responses
 */
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-API-Key,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

/**
 * Create a successful response
 * @param statusCode HTTP status code (200, 201, etc.)
 * @param data Response data to be JSON stringified
 * @returns API Gateway proxy result
 */
export function successResponse<T>(
  statusCode: number,
  data: T
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(data),
  };
}

/**
 * Create an error response
 * @param statusCode HTTP status code (400, 401, 500, etc.)
 * @param error Error name/type
 * @param message Error message
 * @returns API Gateway proxy result
 */
export function errorResponse(
  statusCode: number,
  error: string,
  message: string
): APIGatewayProxyResult {
  const errorBody: ErrorResponse = {
    error,
    message,
    statusCode,
  };

  // Log error for CloudWatch
  console.error(`[${statusCode}] ${error}: ${message}`);

  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(errorBody),
  };
}

/**
 * Create a 200 OK response
 * @param data Response data
 * @returns API Gateway proxy result
 */
export function ok<T>(data: T): APIGatewayProxyResult {
  return successResponse(200, data);
}

/**
 * Create a 201 Created response
 * @param data Response data
 * @returns API Gateway proxy result
 */
export function created<T>(data: T): APIGatewayProxyResult {
  return successResponse(201, data);
}

/**
 * Create a 400 Bad Request response
 * @param message Error message
 * @returns API Gateway proxy result
 */
export function badRequest(message: string): APIGatewayProxyResult {
  return errorResponse(400, 'BadRequest', message);
}

/**
 * Create a 401 Unauthorized response
 * @param message Error message
 * @returns API Gateway proxy result
 */
export function unauthorized(message = 'Invalid or missing API key'): APIGatewayProxyResult {
  return errorResponse(401, 'Unauthorized', message);
}

/**
 * Create a 500 Internal Server Error response
 * @param message Error message
 * @returns API Gateway proxy result
 */
export function internalServerError(message = 'Internal server error'): APIGatewayProxyResult {
  return errorResponse(500, 'InternalServerError', message);
}
