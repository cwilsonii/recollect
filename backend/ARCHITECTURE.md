# Recollect Backend Architecture

## Overview

The Recollect backend is a serverless REST API built on AWS using Lambda, API Gateway, and DynamoDB. It follows modern serverless best practices with strong typing, comprehensive error handling, and production-ready security.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Chrome Extension                         │
│                     (React + TypeScript)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS (TLS 1.2+)
                         │ X-API-Key: recollect-dev-key-12345
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (HTTP API)                     │
│                    CORS Enabled | Throttling                    │
│                                                                  │
│  ┌────────────────────┐        ┌────────────────────┐          │
│  │  POST /api/urls    │        │  GET /api/urls     │          │
│  └─────────┬──────────┘        └─────────┬──────────┘          │
└────────────┼─────────────────────────────┼─────────────────────┘
             │                             │
             ▼                             ▼
┌────────────────────────┐    ┌────────────────────────┐
│  Lambda: SaveUrl       │    │  Lambda: GetUrls       │
│  Runtime: Node.js 18   │    │  Runtime: Node.js 18   │
│  Arch: ARM64           │    │  Arch: ARM64           │
│  Memory: 256 MB        │    │  Memory: 256 MB        │
│  Timeout: 30s          │    │  Timeout: 30s          │
│                        │    │                        │
│  - Validate API key    │    │  - Validate API key    │
│  - Validate input      │    │  - Parse query params  │
│  - Generate UUID       │    │  - Query DynamoDB      │
│  - Save to DynamoDB    │    │  - Sort & paginate     │
│  - Return 201          │    │  - Return 200          │
└───────────┬────────────┘    └───────────┬────────────┘
            │                             │
            └──────────────┬──────────────┘
                           ▼
              ┌─────────────────────────┐
              │      DynamoDB Table      │
              │      "saved_urls"        │
              │                          │
              │  PK: id (String/UUID)    │
              │  SK: savedAt (Number)    │
              │                          │
              │  GSI: savedAt-index      │
              │  Billing: On-Demand      │
              │  Encryption: Enabled     │
              │  PITR: Enabled           │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌─────────────────────────┐
              │    CloudWatch Logs      │
              │  Retention: 14 days     │
              │                         │
              │  /aws/lambda/          │
              │    RecollectSaveUrl    │
              │    RecollectGetUrls    │
              └─────────────────────────┘
```

## Components

### 1. API Gateway (HTTP API)

**Purpose**: Entry point for all API requests, handles routing and CORS.

**Type**: HTTP API (cheaper and simpler than REST API)

**Features**:
- CORS configuration for Chrome extension origins
- Routes requests to appropriate Lambda functions
- Automatic CloudWatch logging
- Low latency (no authorizer needed - API key validation in Lambda)

**Endpoints**:
- `POST /api/urls` → SaveUrlFunction
- `GET /api/urls` → GetUrlsFunction

**Configuration**:
```yaml
CorsConfiguration:
  AllowOrigins: ["*"]
  AllowHeaders: ["Content-Type", "X-API-Key", "Authorization"]
  AllowMethods: ["GET", "POST", "OPTIONS"]
  MaxAge: 300
```

### 2. Lambda Functions

#### SaveUrlFunction

**Purpose**: Create and save a new URL bookmark.

**Handler**: `dist/handlers/saveUrl.handler`

**Flow**:
1. Extract and validate API key from headers
2. Parse and validate request body (URL, title, faviconUrl)
3. Generate UUID for the URL
4. Create SavedURL object with timestamp
5. Save to DynamoDB
6. Return 201 Created with URL data

**Input**:
```typescript
{
  url: string;           // Required, must be valid HTTP/HTTPS URL
  title: string;         // Required, max 500 chars
  faviconUrl?: string;   // Optional, must be valid URL if provided
}
```

**Output** (201 Created):
```typescript
{
  id: string;            // Generated UUID
  url: string;
  title: string;
  faviconUrl?: string;
  savedAt: number;       // Unix timestamp (ms)
}
```

**Error Responses**:
- 400: Invalid input (missing fields, invalid URL, etc.)
- 401: Missing or invalid API key
- 500: Internal server error (DynamoDB failure, etc.)

#### GetUrlsFunction

**Purpose**: Retrieve saved URLs with pagination.

**Handler**: `dist/handlers/getUrls.handler`

**Flow**:
1. Extract and validate API key from headers
2. Parse query parameters (limit, lastKey)
3. Query DynamoDB with pagination
4. Sort results by savedAt (newest first)
5. Return 200 OK with URLs and pagination info

**Input** (query parameters):
```typescript
{
  limit?: number;    // Optional, 1-100, default 50
  lastKey?: string;  // Optional, base64 encoded pagination token
}
```

**Output** (200 OK):
```typescript
{
  urls: SavedURL[];       // Array of saved URLs
  hasMore: boolean;       // True if more results available
  lastKey?: string;       // Pagination token for next page
}
```

**Error Responses**:
- 400: Invalid query parameters
- 401: Missing or invalid API key
- 500: Internal server error

### 3. DynamoDB Table

**Table Name**: `saved_urls`

**Billing Mode**: PAY_PER_REQUEST (on-demand)

**Primary Key**:
- Partition Key: `id` (String) - UUID v4
- Sort Key: `savedAt` (Number) - Unix timestamp in milliseconds

**Global Secondary Index**:
- Index Name: `savedAt-index`
- Key: `savedAt` (Number)
- Projection: ALL attributes
- Purpose: Enable efficient queries sorted by time

**Attributes**:
```typescript
{
  id: string;            // UUID - primary partition key
  url: string;           // The saved URL
  title: string;         // Page title
  faviconUrl?: string;   // Favicon URL (optional)
  savedAt: number;       // Unix timestamp - sort key
  tags?: string[];       // Tags for organization (future)
  notes?: string;        // User notes (future)
}
```

**Features**:
- Server-side encryption (SSE) enabled
- Point-in-time recovery (PITR) enabled
- On-demand billing (scales automatically, no provisioning needed)

**Access Patterns**:
1. Save URL: `PutItem` with id and savedAt
2. Get URLs: `Scan` with limit and pagination
3. Future: Query by savedAt for chronological sorting (via GSI)

### 4. IAM Roles

#### Lambda Execution Role

Auto-generated by SAM with policies:

**SaveUrlFunction**:
- `DynamoDBCrudPolicy` for saved_urls table
  - PutItem
  - GetItem
  - UpdateItem
  - DeleteItem

**GetUrlsFunction**:
- `DynamoDBReadPolicy` for saved_urls table
  - GetItem
  - Query
  - Scan

**Both Functions**:
- CloudWatch Logs access (automatic)
  - CreateLogGroup
  - CreateLogStream
  - PutLogEvents

### 5. CloudWatch Logs

**Log Groups**:
- `/aws/lambda/RecollectSaveUrl`
- `/aws/lambda/RecollectGetUrls`

**Retention**: 14 days

**Content**:
- Lambda execution logs
- Custom application logs (console.log)
- Error traces
- Performance metrics

## Code Structure

```
src/
├── handlers/              # Lambda function handlers
│   ├── saveUrl.ts        # POST /api/urls handler
│   └── getUrls.ts        # GET /api/urls handler
│
└── lib/                   # Shared libraries
    ├── types.ts          # TypeScript type definitions
    ├── response.ts       # API response helpers
    ├── dynamodb.ts       # DynamoDB operations
    ├── auth.ts           # API key validation
    └── validation.ts     # Input validation utilities
```

### Design Patterns

#### 1. Separation of Concerns

- **Handlers**: Thin controllers, orchestrate flow
- **Libraries**: Business logic, database operations, validation
- **Types**: Type safety across the application

#### 2. Error Handling

Custom error classes:
```typescript
class ValidationError extends Error { statusCode: 400 }
class AuthenticationError extends Error { statusCode: 401 }
class InternalServerError extends Error { statusCode: 500 }
```

Consistent error responses:
```typescript
{
  error: "ErrorType",
  message: "Human-readable message",
  statusCode: 400
}
```

#### 3. Response Standardization

Helper functions for consistent responses:
```typescript
ok(data)              // 200 OK
created(data)         // 201 Created
badRequest(message)   // 400 Bad Request
unauthorized(message) // 401 Unauthorized
internalServerError() // 500 Internal Server Error
```

All responses include CORS headers automatically.

#### 4. Input Validation

Multi-layer validation:
1. API key validation (authentication)
2. Request body schema validation
3. Field-level validation (URL format, string length, etc.)
4. Sanitization (trim whitespace, remove null bytes)

## Security

### 1. Authentication

**Method**: API Key via `X-API-Key` header

**Implementation**:
- API key stored in Lambda environment variable
- Validated on every request
- Case-insensitive header name support

**Default Key**: `recollect-dev-key-12345` (change for production!)

**Future Enhancements**:
- Rotate API keys regularly
- Use AWS Secrets Manager for key storage
- Implement rate limiting per API key

### 2. Authorization

Currently: Single user (no authorization needed)

Future: Could add user IDs to partition keys for multi-user support

### 3. Data Protection

**In Transit**:
- TLS 1.2+ for all API calls
- HTTPS only (enforced by API Gateway)

**At Rest**:
- DynamoDB encryption enabled (AES-256)
- CloudWatch Logs encrypted

### 4. Input Validation

Prevent injection attacks:
- URL validation (protocol check, format validation)
- String length limits (prevent DOS)
- Type checking (TypeScript + runtime validation)
- Sanitization (remove null bytes, trim whitespace)

### 5. CORS

Current: Allow all origins (`*`)

Production recommendation:
```yaml
AllowOrigins:
  - "chrome-extension://YOUR_EXTENSION_ID"
```

### 6. Least Privilege IAM

Lambda functions have minimal required permissions:
- SaveUrl: DynamoDB write access to saved_urls only
- GetUrls: DynamoDB read access to saved_urls only

## Scalability

### Current Capacity

- **Lambda**: Scales automatically to 1000 concurrent executions (default quota)
- **API Gateway**: Scales automatically to 10,000 requests/second (default quota)
- **DynamoDB**: On-demand mode scales automatically

### Performance Targets

- API response time: < 300ms (p99)
- Lambda cold start: < 1s (ARM64 is faster)
- Lambda warm execution: < 100ms
- DynamoDB latency: < 10ms

### Optimization Strategies

**Current**:
- ARM64 architecture (better price/performance)
- On-demand DynamoDB (no capacity planning)
- 256MB Lambda memory (balanced)

**Future**:
- Add DynamoDB DAX for caching (if needed)
- Use provisioned concurrency for Lambda (if cold starts become issue)
- Implement connection pooling (not needed for single user)

## Monitoring and Observability

### CloudWatch Metrics (Automatic)

**Lambda**:
- Invocations
- Errors
- Duration
- Throttles
- Concurrent Executions

**API Gateway**:
- Request Count
- 4xx Errors
- 5xx Errors
- Latency

**DynamoDB**:
- ConsumedReadCapacityUnits
- ConsumedWriteCapacityUnits
- UserErrors
- SystemErrors

### Logging Strategy

All logs go to CloudWatch with structured format:

```javascript
console.log('SaveUrl handler invoked', {
  method: event.httpMethod,
  path: event.path,
  // No sensitive data!
});
```

**What to Log**:
- Request metadata (method, path, query params)
- Errors with stack traces
- Performance timings
- Business events (URL saved, etc.)

**What NOT to Log**:
- API keys
- Full request bodies (may contain sensitive data)
- User credentials

### Alerting (Optional for Production)

Recommended CloudWatch Alarms:
1. Lambda error rate > 5%
2. API Gateway 5xx errors > 10/minute
3. DynamoDB throttling events
4. Lambda duration > 25s (approaching timeout)

## Cost Optimization

### Current Configuration

**Lambda**:
- ARM64 (20% cheaper than x86)
- 256MB memory (right-sized)
- On-demand billing

**DynamoDB**:
- On-demand billing (pay per request)
- No provisioned capacity (no waste)

**API Gateway**:
- HTTP API (cheaper than REST API)
- No usage plans needed

### Cost Breakdown (Personal Use)

Assuming 1,000 requests/month:

| Service      | Usage          | Cost      |
|-------------|----------------|-----------|
| Lambda      | 1,000 invokes  | $0.00 *   |
| API Gateway | 1,000 requests | $0.00 *   |
| DynamoDB    | 1,000 writes   | $0.00 *   |
| DynamoDB    | 1GB storage    | $0.25     |
| CloudWatch  | Logs           | $0.00 *   |
| **Total**   |                | **$0.25** |

*Within free tier

Even with 100,000 requests/month: ~$2-3/month

### Cost Optimization Tips

1. Use on-demand billing (no idle capacity costs)
2. Set CloudWatch log retention (14 days vs 30 days)
3. Use ARM64 Lambda architecture
4. Right-size Lambda memory (256MB is good balance)
5. Delete old DynamoDB data if not needed (future feature)

## Deployment

### Infrastructure as Code

Using AWS SAM (template.yaml):
- Declarative infrastructure
- Version controlled
- Repeatable deployments
- CloudFormation under the hood

### Deployment Process

1. Build TypeScript: `npm run build`
2. Package Lambda: `sam build`
3. Deploy to AWS: `sam deploy`

### Environments

Current: Single environment (Prod)

Future: Could add Dev/Staging with separate stacks:
```bash
sam deploy --config-env dev
sam deploy --config-env prod
```

## Testing Strategy

### Local Testing

```bash
# Test individual functions
sam local invoke SaveUrlFunction -e events/save-url.json

# Run local API
sam local start-api
```

### Integration Testing

Test against deployed API:
```bash
curl -X POST https://API_URL/api/urls ...
```

### Load Testing

```bash
ab -n 1000 -c 10 https://API_URL/api/urls
```

## Future Enhancements

### Phase 2: Organization
- Add DELETE endpoint
- Add UPDATE endpoint (for tags/notes)
- Implement tagging system

### Phase 3: Search
- Add search endpoint
- DynamoDB full-text search or integrate Elasticsearch

### Phase 4: Analytics
- Add analytics endpoints
- Weekly summaries
- Usage statistics

### Advanced Features
- Multi-user support (add userId to partition key)
- Real-time updates (WebSocket API)
- Data export (CSV/JSON)
- Backup and restore

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check API key in request headers
   - Verify API_KEY environment variable

2. **500 Internal Server Error**
   - Check CloudWatch Logs
   - Verify DynamoDB table exists
   - Check Lambda IAM permissions

3. **Timeout**
   - Check Lambda timeout setting (30s)
   - Verify DynamoDB performance
   - Check for infinite loops

4. **CORS Errors**
   - Verify CORS configuration in API Gateway
   - Check browser console for details
   - Ensure preflight requests work

### Debugging Commands

```bash
# View logs
aws logs tail /aws/lambda/RecollectSaveUrl --follow

# Test function locally
sam local invoke SaveUrlFunction -e events/save-url.json --debug

# Check DynamoDB table
aws dynamodb describe-table --table-name saved_urls

# Check API Gateway
aws apigatewayv2 get-apis
```

## References

- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [API Gateway Best Practices](https://docs.aws.amazon.com/apigateway/latest/developerguide/best-practices.html)
