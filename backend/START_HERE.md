# START HERE - Recollect Backend

Welcome! This guide will get you from zero to deployed in 10 minutes.

## What Is This?

This is a production-ready serverless backend for the Recollect URL bookmarking application. It provides:

- **POST /api/urls** - Save a URL
- **GET /api/urls** - Retrieve saved URLs with pagination

Built with AWS Lambda, API Gateway, and DynamoDB.

## What You Need

Before starting, make sure you have:

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **AWS Account** - [Sign up here](https://aws.amazon.com/)
3. **AWS CLI** - Configured with credentials
4. **AWS SAM CLI** - [Install guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

### Quick Install (macOS)

```bash
# Install AWS SAM CLI
brew install aws-sam-cli

# Configure AWS credentials
aws configure
# Enter your Access Key ID and Secret Access Key
```

## Three Options to Get Started

### Option 1: Quick Deploy (Recommended)

Just run this command:

```bash
cd backend
./scripts/deploy.sh
```

The script will:
1. Install dependencies
2. Build TypeScript code
3. Deploy to AWS
4. Show you the API URL

**Time**: ~5 minutes

### Option 2: Test Locally First

Want to test before deploying?

```bash
cd backend
./scripts/test-local.sh
```

This interactive menu lets you:
- Test individual functions
- Start a local API server
- Try different test scenarios

**Time**: ~3 minutes to test, then deploy with Option 1

### Option 3: Manual Step-by-Step

Prefer full control?

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Build TypeScript
npm run build

# 3. Build SAM
sam build

# 4. Deploy
sam deploy --guided
```

**Time**: ~10 minutes (includes prompts)

## After Deployment

### 1. Get Your API URL

After deployment, you'll see output like:

```
Outputs
---------------------------------------------------------------------------
Key                 ApiUrl
Value               https://abc123.execute-api.us-east-1.amazonaws.com/Prod
```

Save this URL!

### 2. Test Your API

```bash
# Set your API URL
export API_URL="https://YOUR_API_URL_HERE/Prod"

# Save a URL
curl -X POST "${API_URL}/api/urls" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: recollect-dev-key-12345" \
  -d '{
    "url": "https://github.com",
    "title": "GitHub"
  }'

# Get URLs
curl -X GET "${API_URL}/api/urls" \
  -H "X-API-Key: recollect-dev-key-12345"
```

### 3. Configure Chrome Extension

Update your Chrome extension with:
- **API URL**: `https://YOUR_API_URL/Prod`
- **API Key**: `recollect-dev-key-12345`

## What Just Happened?

The deployment created:

1. **DynamoDB Table** (`saved_urls`) - Stores your URLs
2. **2 Lambda Functions** - Handle API requests
3. **API Gateway** - Routes HTTP requests to Lambda
4. **IAM Roles** - Permissions for Lambda
5. **CloudWatch Logs** - Monitor your application

All managed by CloudFormation, fully serverless, auto-scaling.

## Cost

For personal use: **FREE** (within AWS free tier)

- Lambda: 1M requests/month free
- API Gateway: 1M requests/month free
- DynamoDB: 25GB storage free

Even with heavy use: < $2/month

## Common Commands

```bash
# View logs
aws logs tail /aws/lambda/RecollectSaveUrl --follow

# Redeploy after code changes
npm run build && sam build && sam deploy

# Delete everything
sam delete --stack-name recollect-backend
```

## Need Help?

### Quick Troubleshooting

**"SAM CLI not found"**
```bash
brew install aws-sam-cli
```

**"AWS credentials not configured"**
```bash
aws configure
```

**"Deployment failed"**
```bash
# Check CloudFormation events
aws cloudformation describe-stack-events --stack-name recollect-backend
```

**"API returns 401"**
- Make sure you're sending `X-API-Key: recollect-dev-key-12345` header

### Full Documentation

- [QUICKSTART.md](QUICKSTART.md) - 5-minute quick start
- [README.md](README.md) - Complete reference
- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment guide
- [API_EXAMPLES.md](API_EXAMPLES.md) - API testing examples
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical deep dive

## Project Structure

```
backend/
├── START_HERE.md           ← You are here
├── QUICKSTART.md          ← Quick start guide
├── README.md              ← Full documentation
├── template.yaml          ← AWS infrastructure
├── src/
│   ├── handlers/          ← Lambda functions
│   └── lib/              ← Shared code
├── events/               ← Test files
└── scripts/              ← Helper scripts
```

## Next Steps

1. **Deploy** - Run `./scripts/deploy.sh`
2. **Test** - Try the API with curl
3. **Configure Extension** - Add API URL and key
4. **Use It** - Start saving URLs!

## Security Note

The default API key is `recollect-dev-key-12345`. This is fine for personal use, but for production:

1. Edit `template.yaml`
2. Change `API_KEY` environment variable
3. Redeploy: `sam build && sam deploy`
4. Update Chrome extension with new key

## What Makes This Production-Ready?

- TypeScript strict mode
- Comprehensive error handling
- Input validation
- API key authentication
- HTTPS/TLS encryption
- CloudWatch logging
- Auto-scaling serverless architecture
- Infrastructure as code
- Complete documentation

## Support

For detailed information, see:
- [INDEX.md](INDEX.md) - Complete file index
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Project overview
- [CHECKLIST.md](CHECKLIST.md) - Implementation checklist

## You're All Set!

Deploy the backend, configure your Chrome extension, and start bookmarking!

**Questions?** Check the documentation files listed above.

**Issues?** See troubleshooting sections in README.md and DEPLOYMENT.md.

---

**Quick Deploy Command:**
```bash
cd backend && ./scripts/deploy.sh
```

**Let's go!** 🚀
