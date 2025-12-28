# API Examples and Testing

This document contains example API calls for testing the Recollect backend.

## Setup

Replace `YOUR_API_URL` with your actual API Gateway URL from deployment:
```bash
export API_URL="https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod"
export API_KEY="recollect-dev-key-12345"
```

Or for local testing:
```bash
export API_URL="http://localhost:3000"
export API_KEY="recollect-dev-key-12345"
```

## POST /api/urls - Save URL

### Basic Example

```bash
curl -X POST "${API_URL}/api/urls" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{
    "url": "https://github.com",
    "title": "GitHub - Where the world builds software"
  }'
```

Expected Response (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "url": "https://github.com",
  "title": "GitHub - Where the world builds software",
  "savedAt": 1703721600000
}
```

### With Favicon

```bash
curl -X POST "${API_URL}/api/urls" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "title": "Rick Astley - Never Gonna Give You Up",
    "faviconUrl": "https://www.youtube.com/favicon.ico"
  }'
```

### Multiple URLs (run in sequence)

```bash
# Save URL 1
curl -X POST "${API_URL}/api/urls" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"url":"https://nodejs.org","title":"Node.js"}'

# Save URL 2
curl -X POST "${API_URL}/api/urls" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"url":"https://aws.amazon.com","title":"Amazon Web Services"}'

# Save URL 3
curl -X POST "${API_URL}/api/urls" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"url":"https://stackoverflow.com","title":"Stack Overflow"}'
```

### Pretty Print Response

```bash
curl -X POST "${API_URL}/api/urls" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"url":"https://example.com","title":"Example Domain"}' \
  | jq '.'
```

Note: Requires `jq` to be installed: `brew install jq`

## GET /api/urls - Retrieve URLs

### Get All URLs (default limit: 50)

```bash
curl -X GET "${API_URL}/api/urls" \
  -H "X-API-Key: ${API_KEY}"
```

Expected Response (200 OK):
```json
{
  "urls": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "url": "https://github.com",
      "title": "GitHub - Where the world builds software",
      "savedAt": 1703721600000
    }
  ],
  "hasMore": false
}
```

### Get Limited Number of URLs

```bash
# Get only 5 URLs
curl -X GET "${API_URL}/api/urls?limit=5" \
  -H "X-API-Key: ${API_KEY}"

# Get 10 URLs
curl -X GET "${API_URL}/api/urls?limit=10" \
  -H "X-API-Key: ${API_KEY}"
```

### Pagination

```bash
# First request - get first 5 URLs
RESPONSE=$(curl -s -X GET "${API_URL}/api/urls?limit=5" \
  -H "X-API-Key: ${API_KEY}")

echo "$RESPONSE" | jq '.'

# Extract lastKey from response
LAST_KEY=$(echo "$RESPONSE" | jq -r '.lastKey')

# Second request - get next 5 URLs using lastKey
if [ "$LAST_KEY" != "null" ]; then
  curl -X GET "${API_URL}/api/urls?limit=5&lastKey=${LAST_KEY}" \
    -H "X-API-Key: ${API_KEY}" \
    | jq '.'
fi
```

### Pretty Print with Details

```bash
curl -X GET "${API_URL}/api/urls?limit=10" \
  -H "X-API-Key: ${API_KEY}" \
  | jq '{
    total: (.urls | length),
    hasMore: .hasMore,
    urls: .urls | map({title, url, saved: (.savedAt | todate)})
  }'
```

## Error Cases

### Missing API Key (401 Unauthorized)

```bash
curl -X POST "${API_URL}/api/urls" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","title":"Test"}'
```

Expected Response:
```json
{
  "error": "Unauthorized",
  "message": "Missing API key. Include X-API-Key header in your request.",
  "statusCode": 401
}
```

### Invalid API Key (401 Unauthorized)

```bash
curl -X POST "${API_URL}/api/urls" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: wrong-key" \
  -d '{"url":"https://example.com","title":"Test"}'
```

### Missing Required Field (400 Bad Request)

```bash
curl -X POST "${API_URL}/api/urls" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"url":"https://example.com"}'
```

Expected Response:
```json
{
  "error": "BadRequest",
  "message": "Field \"title\" is required and must be a string",
  "statusCode": 400
}
```

### Invalid URL Format (400 Bad Request)

```bash
curl -X POST "${API_URL}/api/urls" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"url":"not-a-valid-url","title":"Test"}'
```

### Invalid Limit Parameter (400 Bad Request)

```bash
curl -X GET "${API_URL}/api/urls?limit=abc" \
  -H "X-API-Key: ${API_KEY}"
```

### Limit Too High (400 Bad Request)

```bash
curl -X GET "${API_URL}/api/urls?limit=500" \
  -H "X-API-Key: ${API_KEY}"
```

## Testing with Different HTTP Clients

### Using HTTPie

```bash
# Install HTTPie
brew install httpie

# Save URL
http POST "${API_URL}/api/urls" \
  X-API-Key:${API_KEY} \
  url=https://example.com \
  title="Example Domain"

# Get URLs
http GET "${API_URL}/api/urls?limit=5" \
  X-API-Key:${API_KEY}
```

### Using Postman

1. **POST /api/urls**
   - Method: POST
   - URL: `YOUR_API_URL/api/urls`
   - Headers:
     - `Content-Type: application/json`
     - `X-API-Key: recollect-dev-key-12345`
   - Body (raw JSON):
     ```json
     {
       "url": "https://example.com",
       "title": "Example Domain"
     }
     ```

2. **GET /api/urls**
   - Method: GET
   - URL: `YOUR_API_URL/api/urls?limit=10`
   - Headers:
     - `X-API-Key: recollect-dev-key-12345`

### Using JavaScript (fetch)

```javascript
// Save URL
const saveUrl = async () => {
  const response = await fetch('YOUR_API_URL/api/urls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'recollect-dev-key-12345'
    },
    body: JSON.stringify({
      url: 'https://example.com',
      title: 'Example Domain'
    })
  });

  const data = await response.json();
  console.log(data);
};

// Get URLs
const getUrls = async () => {
  const response = await fetch('YOUR_API_URL/api/urls?limit=10', {
    headers: {
      'X-API-Key': 'recollect-dev-key-12345'
    }
  });

  const data = await response.json();
  console.log(data);
};
```

## Load Testing

### Simple Load Test (requires `ab` - Apache Bench)

```bash
# Install Apache Bench (usually pre-installed on macOS)
# Or: brew install apache2

# Prepare test data
echo '{"url":"https://example.com","title":"Load Test"}' > /tmp/test-data.json

# Run 100 requests with 10 concurrent connections
ab -n 100 -c 10 \
  -T "application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -p /tmp/test-data.json \
  "${API_URL}/api/urls"
```

### Monitor During Load Test

```bash
# In another terminal, watch CloudWatch logs
aws logs tail /aws/lambda/RecollectSaveUrl --follow
```

## Automated Testing Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

API_URL="YOUR_API_URL_HERE"
API_KEY="recollect-dev-key-12345"

echo "Testing Recollect API..."
echo ""

# Test 1: Save URL
echo "Test 1: Save URL"
curl -s -X POST "${API_URL}/api/urls" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"url":"https://github.com","title":"GitHub"}' \
  | jq '.'
echo ""

# Test 2: Get URLs
echo "Test 2: Get URLs"
curl -s -X GET "${API_URL}/api/urls?limit=5" \
  -H "X-API-Key: ${API_KEY}" \
  | jq '.'
echo ""

# Test 3: Invalid API key (should fail)
echo "Test 3: Invalid API key (should return 401)"
curl -s -X POST "${API_URL}/api/urls" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: wrong-key" \
  -d '{"url":"https://example.com","title":"Test"}' \
  | jq '.'
echo ""

echo "Tests complete!"
```

Make it executable and run:
```bash
chmod +x test-api.sh
./test-api.sh
```

## CORS Testing

Test CORS preflight request:

```bash
curl -X OPTIONS "${API_URL}/api/urls" \
  -H "Origin: chrome-extension://your-extension-id" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: X-API-Key,Content-Type" \
  -v
```

## Monitoring Commands

### Check API Gateway metrics
```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApiGateway \
  --metric-name Count \
  --dimensions Name=ApiId,Value=YOUR_API_ID \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 3600 \
  --statistics Sum
```

### Check Lambda invocations
```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=RecollectSaveUrl \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 3600 \
  --statistics Sum
```

## Tips

1. **Use environment variables** for API_URL and API_KEY to avoid hardcoding
2. **Save responses** to files for later inspection: `curl ... > response.json`
3. **Use jq** for pretty-printing and parsing JSON responses
4. **Check status codes**: `curl -w "\nStatus: %{http_code}\n" ...`
5. **View full response headers**: Add `-v` flag to curl
6. **Test locally first** before deploying to AWS
