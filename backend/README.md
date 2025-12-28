# Recollect Backend

Production-ready backend API for the Recollect personal URL bookmarking application, built with AWS SAM, Lambda, and DynamoDB.

## Overview

This serverless backend provides REST API endpoints for saving and retrieving URLs. It's designed for personal use with simple API key authentication.

### Architecture

- **Runtime**: Node.js 18 (ARM64)
- **Framework**: AWS SAM (Serverless Application Model)
- **Language**: TypeScript (strict mode)
- **Database**: DynamoDB (on-demand billing)
- **API**: API Gateway HTTP API
- **Authentication**: API key via X-API-Key header

### API Endpoints

| Method | Endpoint      | Description                    |
|--------|---------------|--------------------------------|
| POST   | /api/urls     | Save a new URL                 |
| GET    | /api/urls     | Retrieve saved URLs (paginated)|

## Prerequisites

- Node.js 18 or higher
- AWS CLI configured with credentials
- AWS SAM CLI installed
- An AWS account

### Install AWS SAM CLI

```bash
# macOS
brew install aws-sam-cli

# Or follow: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
```

### Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and preferred region
```

## Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build
```

## Local Development

### Build the SAM application

```bash
npm run sam:build
# or
sam build
```

### Start local API server

```bash
npm run sam:local
# or
sam local start-api
```

The API will be available at `http://localhost:3000`

### Test individual functions

```bash
# Test SaveUrl function
npm run sam:invoke:save
# or
sam local invoke SaveUrlFunction -e events/save-url.json

# Test GetUrls function
npm run sam:invoke:get
# or
sam local invoke GetUrlsFunction -e events/get-urls.json
```

### Watch mode for development

```bash
# Terminal 1 - Watch TypeScript files
npm run watch

# Terminal 2 - Run SAM local
npm run sam:local
```

## Deployment

### First-time deployment

```bash
# Build the application
sam build

# Deploy with guided prompts
sam deploy --guided
```

You'll be prompted for:
- Stack name: `recollect-backend` (or your preference)
- AWS Region: `us-east-1` (or your preference)
- Confirm changes before deploy: `Y`
- Allow SAM CLI IAM role creation: `Y`
- Save arguments to config file: `Y`

### Subsequent deployments

```bash
sam build && sam deploy
```

### Get API URL after deployment

```bash
sam list stack-outputs --stack-name recollect-backend
```

Look for the `ApiUrl` output value.

## Testing the API

### Save a URL

```bash
curl -X POST https://YOUR_API_URL/Prod/api/urls \
  -H "Content-Type: application/json" \
  -H "X-API-Key: recollect-dev-key-12345" \
  -d '{
    "url": "https://example.com/article",
    "title": "Interesting Article",
    "faviconUrl": "https://example.com/favicon.ico"
  }'
```

### Get URLs

```bash
curl -X GET https://YOUR_API_URL/Prod/api/urls?limit=10 \
  -H "X-API-Key: recollect-dev-key-12345"
```

### Get URLs with pagination

```bash
curl -X GET "https://YOUR_API_URL/Prod/api/urls?limit=10&lastKey=YOUR_PAGINATION_TOKEN" \
  -H "X-API-Key: recollect-dev-key-12345"
```

## Project Structure

```
backend/
├── template.yaml          # AWS SAM template (infrastructure as code)
├── package.json           # Node.js dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── .eslintrc.json         # ESLint configuration
├── src/
│   ├── handlers/
│   │   ├── saveUrl.ts    # POST /api/urls handler
│   │   └── getUrls.ts    # GET /api/urls handler
│   └── lib/
│       ├── dynamodb.ts   # DynamoDB operations
│       ├── response.ts   # API response helpers
│       └── types.ts      # TypeScript type definitions
└── events/               # Test events for SAM local
    ├── save-url.json
    └── get-urls.json
```

## API Documentation

### POST /api/urls

Save a new URL to the database.

**Headers:**
- `Content-Type: application/json`
- `X-API-Key: recollect-dev-key-12345`

**Request Body:**
```json
{
  "url": "https://example.com/article",
  "title": "Article Title",
  "faviconUrl": "https://example.com/favicon.ico"  // optional
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "url": "https://example.com/article",
  "title": "Article Title",
  "faviconUrl": "https://example.com/favicon.ico",
  "savedAt": 1703721600000
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input (missing fields, invalid URL format)
- `401 Unauthorized` - Missing or invalid API key
- `500 Internal Server Error` - Server error

### GET /api/urls

Retrieve saved URLs with pagination.

**Headers:**
- `X-API-Key: recollect-dev-key-12345`

**Query Parameters:**
- `limit` (optional): Number of URLs to return (1-100, default: 50)
- `lastKey` (optional): Pagination token from previous response

**Response (200 OK):**
```json
{
  "urls": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "url": "https://example.com/article",
      "title": "Article Title",
      "faviconUrl": "https://example.com/favicon.ico",
      "savedAt": 1703721600000
    }
  ],
  "hasMore": true,
  "lastKey": "eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsInNhdmVkQXQiOjE3MDM3MjE2MDAwMDB9"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid query parameters
- `401 Unauthorized` - Missing or invalid API key
- `500 Internal Server Error` - Server error

## Environment Variables

The following environment variables are automatically configured in `template.yaml`:

- `TABLE_NAME`: DynamoDB table name (default: `saved_urls`)
- `API_KEY`: API key for authentication (default: `recollect-dev-key-12345`)
- `AWS_REGION`: AWS region (auto-detected)

**Security Note:** For production, change the API key to a secure value:
1. Update `template.yaml` - change the `API_KEY` value
2. Redeploy: `sam build && sam deploy`
3. Update the Chrome extension with the new API key

## DynamoDB Schema

**Table Name:** `saved_urls`

**Primary Key:**
- Partition Key: `id` (String) - UUID
- Sort Key: `savedAt` (Number) - Unix timestamp

**Global Secondary Index:**
- Index Name: `savedAt-index`
- Key: `savedAt` (Number)
- Projection: ALL

**Attributes:**
- `id` (String) - Unique identifier (UUID)
- `url` (String) - Saved URL
- `title` (String) - Page title
- `faviconUrl` (String, optional) - Favicon URL
- `savedAt` (Number) - Unix timestamp (milliseconds)
- `tags` (String[], optional) - Tags for organization (future)
- `notes` (String, optional) - User notes (future)

## Monitoring and Logs

### View CloudWatch Logs

```bash
# SaveUrl function logs
aws logs tail /aws/lambda/RecollectSaveUrl --follow

# GetUrls function logs
aws logs tail /aws/lambda/RecollectGetUrls --follow
```

### View metrics in AWS Console

1. Go to CloudWatch Console
2. Navigate to Logs → Log Groups
3. Find `/aws/lambda/RecollectSaveUrl` or `/aws/lambda/RecollectGetUrls`

## Cost Estimate

For personal use with moderate traffic:

- **Lambda**: Free tier covers 1M requests/month, 400,000 GB-seconds/month
- **API Gateway**: $3.50 per million requests (after free tier)
- **DynamoDB**: Free tier covers 25GB storage, 25 read/write capacity units
- **CloudWatch Logs**: First 5GB free

**Expected monthly cost:** $0-$2 (likely within free tier)

## Cleanup / Delete Stack

To remove all AWS resources:

```bash
sam delete --stack-name recollect-backend
```

This will delete:
- Lambda functions
- API Gateway
- DynamoDB table (including all data)
- IAM roles
- CloudWatch log groups

## Security

- **API Key Authentication**: Simple header-based authentication
- **CORS**: Configured to allow all origins (`*`) - restrict in production
- **HTTPS**: All API calls use TLS 1.2+
- **DynamoDB Encryption**: Server-side encryption enabled
- **IAM Permissions**: Lambda functions have minimal required permissions

**Production Recommendations:**
1. Use a strong, randomly generated API key
2. Restrict CORS to specific Chrome extension origin
3. Enable API Gateway throttling
4. Set up CloudWatch alarms for errors
5. Enable AWS WAF for additional protection

## Troubleshooting

### Build fails

```bash
# Clean and rebuild
npm run clean
npm install
npm run build
sam build
```

### Deployment fails

```bash
# Check AWS credentials
aws sts get-caller-identity

# Check SAM version
sam --version

# View CloudFormation events
aws cloudformation describe-stack-events --stack-name recollect-backend
```

### Lambda function errors

```bash
# View recent logs
aws logs tail /aws/lambda/RecollectSaveUrl --follow

# Test function locally with verbose output
sam local invoke SaveUrlFunction -e events/save-url.json --debug
```

### DynamoDB access denied

Ensure Lambda execution role has DynamoDB permissions (automatically configured by SAM).

## Development Scripts

- `npm run build` - Build TypeScript
- `npm run watch` - Watch and rebuild TypeScript on changes
- `npm run clean` - Remove build artifacts
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and auto-fix issues
- `npm run sam:build` - Build SAM application
- `npm run sam:deploy` - Deploy to AWS
- `npm run sam:local` - Start local API server
- `npm run sam:invoke:save` - Test SaveUrl function locally
- `npm run sam:invoke:get` - Test GetUrls function locally

## License

MIT

## Support

For issues or questions, please refer to the project documentation or AWS SAM documentation.
