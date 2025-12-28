# Recollect Backend - Quick Start Guide

Get your backend up and running in 5 minutes.

## Prerequisites

Install these first:

```bash
# Install Node.js (if not already installed)
# Download from: https://nodejs.org/

# Install AWS SAM CLI
brew install aws-sam-cli

# Configure AWS credentials
aws configure
```

When running `aws configure`, you'll need:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., `us-east-1`)

## Option 1: Quick Deploy to AWS (Recommended)

```bash
# Navigate to backend directory
cd backend

# Run the deployment script
./scripts/deploy.sh
```

Follow the prompts. The script will:
1. Install dependencies
2. Build TypeScript code
3. Build SAM application
4. Deploy to AWS

After deployment, you'll get an API URL like:
```
https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod
```

Save this URL - you'll need it for the Chrome extension!

## Option 2: Test Locally First

```bash
# Navigate to backend directory
cd backend

# Run the local testing script
./scripts/test-local.sh
```

This interactive script lets you:
- Test individual Lambda functions
- Start a local API server
- Test with different scenarios

To test the local API:

```bash
# In another terminal, test the local endpoints
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -H "X-API-Key: recollect-dev-key-12345" \
  -d '{"url":"https://example.com","title":"Test"}'
```

## Verify Deployment

Test your deployed API:

```bash
# Save a URL
curl -X POST https://YOUR_API_URL/Prod/api/urls \
  -H "Content-Type: application/json" \
  -H "X-API-Key: recollect-dev-key-12345" \
  -d '{
    "url": "https://github.com",
    "title": "GitHub"
  }'

# Get saved URLs
curl -X GET https://YOUR_API_URL/Prod/api/urls \
  -H "X-API-Key: recollect-dev-key-12345"
```

## Next Steps

1. **Update Chrome Extension**
   - API URL: `https://YOUR_API_URL/Prod`
   - API Key: `recollect-dev-key-12345`

2. **View Logs**
   ```bash
   aws logs tail /aws/lambda/RecollectSaveUrl --follow
   ```

3. **View DynamoDB Data**
   - Go to AWS Console → DynamoDB
   - Find table: `saved_urls`
   - Click "Explore table items"

## Troubleshooting

### AWS credentials not configured
```bash
aws configure
# Enter your Access Key ID and Secret Access Key
```

### SAM CLI not installed
```bash
# macOS
brew install aws-sam-cli

# Other platforms
# See: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
```

### Build fails
```bash
# Clean and rebuild
rm -rf node_modules dist .aws-sam
npm install
npm run build
sam build
```

### API returns 401 Unauthorized
Make sure you're sending the correct API key:
- Header: `X-API-Key: recollect-dev-key-12345`

## Manual Deployment Steps

If you prefer manual control:

```bash
# 1. Install dependencies
npm install

# 2. Build TypeScript
npm run build

# 3. Build SAM application
sam build

# 4. Deploy
sam deploy --guided
```

## Updating After Changes

```bash
# Make your code changes, then:
npm run build
sam build
sam deploy
```

## Clean Up / Delete Everything

To remove all AWS resources:

```bash
sam delete --stack-name recollect-backend
```

**Warning**: This deletes all data!

## Cost

For personal use, this should be **FREE** or **< $1/month**:
- Lambda: Free tier covers 1M requests/month
- API Gateway: Free tier covers 1M requests/month
- DynamoDB: Free tier covers 25GB storage
- Total: $0 for typical personal use

## Support

- Full documentation: [README.md](README.md)
- Deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- Issues? Check the troubleshooting sections in the guides above
