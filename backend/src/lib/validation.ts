/**
 * Input validation utilities
 */

import { ValidationError } from './types';

/**
 * Validate URL format and protocol
 * @param url URL to validate
 * @param fieldName Field name for error messages
 * @returns True if valid
 * @throws ValidationError if invalid
 */
export function validateUrl(url: string, fieldName = 'url'): boolean {
  if (!url || typeof url !== 'string') {
    throw new ValidationError(`Field "${fieldName}" is required and must be a string`);
  }

  try {
    const urlObj = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new ValidationError(`Field "${fieldName}" must use HTTP or HTTPS protocol`);
    }

    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(`Field "${fieldName}" is not a valid URL`);
  }
}

/**
 * Validate string field
 * @param value Value to validate
 * @param fieldName Field name for error messages
 * @param options Validation options
 * @returns Trimmed string value
 * @throws ValidationError if invalid
 */
export function validateString(
  value: unknown,
  fieldName: string,
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  } = {}
): string {
  const { required = true, minLength, maxLength } = options;

  if (!value) {
    if (required) {
      throw new ValidationError(`Field "${fieldName}" is required`);
    }
    return '';
  }

  if (typeof value !== 'string') {
    throw new ValidationError(`Field "${fieldName}" must be a string`);
  }

  const trimmedValue = value.trim();

  if (required && trimmedValue.length === 0) {
    throw new ValidationError(`Field "${fieldName}" cannot be empty`);
  }

  if (minLength !== undefined && trimmedValue.length < minLength) {
    throw new ValidationError(
      `Field "${fieldName}" must be at least ${minLength} characters`
    );
  }

  if (maxLength !== undefined && trimmedValue.length > maxLength) {
    throw new ValidationError(
      `Field "${fieldName}" cannot exceed ${maxLength} characters`
    );
  }

  return trimmedValue;
}

/**
 * Validate number field
 * @param value Value to validate
 * @param fieldName Field name for error messages
 * @param options Validation options
 * @returns Parsed number value
 * @throws ValidationError if invalid
 */
export function validateNumber(
  value: unknown,
  fieldName: string,
  options: {
    required?: boolean;
    min?: number;
    max?: number;
    integer?: boolean;
  } = {}
): number {
  const { required = true, min, max, integer = false } = options;

  if (value === null || value === undefined || value === '') {
    if (required) {
      throw new ValidationError(`Field "${fieldName}" is required`);
    }
    return 0;
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);

  if (isNaN(numValue)) {
    throw new ValidationError(`Field "${fieldName}" must be a valid number`);
  }

  if (integer && !Number.isInteger(numValue)) {
    throw new ValidationError(`Field "${fieldName}" must be an integer`);
  }

  if (min !== undefined && numValue < min) {
    throw new ValidationError(`Field "${fieldName}" must be at least ${min}`);
  }

  if (max !== undefined && numValue > max) {
    throw new ValidationError(`Field "${fieldName}" cannot exceed ${max}`);
  }

  return numValue;
}

/**
 * Validate object has required fields
 * @param obj Object to validate
 * @param requiredFields Array of required field names
 * @throws ValidationError if any required field is missing
 */
export function validateRequiredFields(
  obj: Record<string, unknown>,
  requiredFields: string[]
): void {
  for (const field of requiredFields) {
    if (!(field in obj) || obj[field] === undefined || obj[field] === null) {
      throw new ValidationError(`Required field "${field}" is missing`);
    }
  }
}

/**
 * Sanitize string to prevent injection attacks
 * @param value String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(value: string): string {
  // Remove any null bytes
  let sanitized = value.replace(/\0/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}
