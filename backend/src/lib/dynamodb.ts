/**
 * DynamoDB operations for Recollect
 * Provides functions to interact with the saved_urls table
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { SavedURL, PaginationToken } from './types';

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

// Create document client for easier object handling
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false,
  },
});

// Get table name from environment variable
const TABLE_NAME = process.env.TABLE_NAME || 'saved_urls';

/**
 * Save a new URL to DynamoDB
 * @param savedUrl The URL data to save
 * @returns The saved URL data
 */
export async function saveUrl(savedUrl: SavedURL): Promise<SavedURL> {
  try {
    console.log(`Saving URL to DynamoDB: ${savedUrl.id}`);

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: savedUrl,
    });

    await docClient.send(command);

    console.log(`Successfully saved URL: ${savedUrl.id}`);
    return savedUrl;
  } catch (error) {
    console.error('Error saving URL to DynamoDB:', error);
    throw new Error(`Failed to save URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get URLs from DynamoDB with pagination
 * @param limit Maximum number of URLs to return (default: 50)
 * @param lastKey Pagination token from previous request
 * @returns Object containing URLs, hasMore flag, and next pagination token
 */
export async function getUrls(
  limit: number = 50,
  lastKey?: PaginationToken
): Promise<{
  urls: SavedURL[];
  hasMore: boolean;
  lastKey?: string;
}> {
  try {
    console.log(`Fetching URLs from DynamoDB with limit: ${limit}`);

    // Build scan parameters
    const params: ScanCommandInput = {
      TableName: TABLE_NAME,
      Limit: limit,
    };

    // Add pagination token if provided
    if (lastKey) {
      console.log('Using pagination token:', lastKey);
      params.ExclusiveStartKey = lastKey;
    }

    const command = new ScanCommand(params);
    const result = await docClient.send(command);

    // Extract items and cast to SavedURL[]
    const urls = (result.Items as SavedURL[] | undefined) || [];

    // Sort by savedAt in descending order (newest first)
    urls.sort((a, b) => b.savedAt - a.savedAt);

    // Check if there are more results
    const hasMore = !!result.LastEvaluatedKey;

    // Encode pagination token as base64 if it exists
    let encodedLastKey: string | undefined;
    if (result.LastEvaluatedKey) {
      encodedLastKey = Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64');
    }

    console.log(`Successfully fetched ${urls.length} URLs, hasMore: ${hasMore}`);

    return {
      urls,
      hasMore,
      lastKey: encodedLastKey,
    };
  } catch (error) {
    console.error('Error fetching URLs from DynamoDB:', error);
    throw new Error(`Failed to fetch URLs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decode pagination token from base64 string
 * @param encodedToken Base64 encoded pagination token
 * @returns Decoded pagination token
 */
export function decodePaginationToken(encodedToken: string): PaginationToken {
  try {
    const decoded = Buffer.from(encodedToken, 'base64').toString('utf-8');
    return JSON.parse(decoded) as PaginationToken;
  } catch (error) {
    console.error('Error decoding pagination token:', error);
    throw new Error('Invalid pagination token');
  }
}
