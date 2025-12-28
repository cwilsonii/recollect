/**
 * Configuration for Recollect Extension
 *
 * IMPORTANT: Update these values after deploying the backend!
 *
 * 1. Deploy the backend using AWS SAM:
 *    cd backend
 *    sam build
 *    sam deploy --guided
 *
 * 2. Get your API Gateway URL from the deployment output:
 *    sam list stack-outputs --stack-name recollect-backend
 *    Look for: ApiUrl = https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod
 *
 * 3. Update API_URL below with your API Gateway URL
 *
 * 4. Update API_KEY with your actual API key (default: recollect-dev-key-12345)
 *    You can find this in backend/template.yaml under Environment Variables
 */

// UPDATE THIS: Replace with your deployed API Gateway URL
export const API_URL = 'YOUR_API_GATEWAY_URL_HERE';
// Example: 'https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod'

// UPDATE THIS: Replace with your API key
export const API_KEY = 'YOUR_API_KEY_HERE';
// Default from backend: 'recollect-dev-key-12345'

// Storage keys for Chrome storage
export const STORAGE_KEYS = {
  CACHED_URLS: 'cached_urls',
  LAST_SYNC: 'last_sync',
} as const;

// UI Configuration
export const UI_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  CACHE_DURATION_MS: 5 * 60 * 1000, // 5 minutes
} as const;
