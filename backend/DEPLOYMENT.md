# Deployment Guide for Recollect Backend

This guide walks you through deploying the Recollect backend to AWS.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] AWS account created
- [ ] AWS CLI installed and configured
- [ ] AWS SAM CLI installed

## Step-by-Step Deployment

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Build TypeScript Code

```bash
npm run build
```

You should see a `dist/` directory created with compiled JavaScript files.

### 3. Build SAM Application

```bash
sam build
```

This creates a `.aws-sam/` directory with your Lambda function code ready for deployment.

### 4. Deploy to AWS (First Time)

```bash
sam deploy --guided
```

You'll be prompted for the following:

1. **Stack name**: Enter `recollect-backend` (or your preference)
2. **AWS Region**: Enter `us-east-1` (or your preferred region)
3. **Confirm changes before deploy**: Enter `Y`
4. **Allow SAM CLI IAM role creation**: Enter `Y`
5. **Disable rollback**: Enter `N`
6. **SaveUrlFunction may not have authorization defined**: Enter `y`
7. **GetUrlsFunction may not have authorization defined**: Enter `y`
8. **Save arguments to configuration file**: Enter `Y`
9. **SAM configuration file**: Press Enter (default: samconfig.toml)
10. **SAM configuration environment**: Press Enter (default: default)

The deployment will take 2-3 minutes.

### 5. Get Your API URL

After deployment completes, look for the output section:

```
CloudFormation outputs from deployed stack
---------------------------------------------------------------------------
Outputs
---------------------------------------------------------------------------
Key                 ApiUrl
Description         API Gateway endpoint URL
Value               https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod
---------------------------------------------------------------------------
```

Copy this URL - you'll need it for the Chrome extension.

You can also retrieve it later with:

```bash
sam list stack-outputs --stack-name recollect-backend
```

### 6. Test Your Deployment

```bash
# Save a URL
curl -X POST https://YOUR_API_URL/Prod/api/urls \
  -H "Content-Type: application/json" \
  -H "X-API-Key: recollect-dev-key-12345" \
  -d '{
    "url": "https://example.com/test",
    "title": "Test Article"
  }'

# Get URLs
curl -X GET https://YOUR_API_URL/Prod/api/urls \
  -H "X-API-Key: recollect-dev-key-12345"
```

### 7. Update Chrome Extension Configuration

Update your Chrome extension with:
- API URL: `https://YOUR_API_URL/Prod`
- API Key: `recollect-dev-key-12345`

## Subsequent Deployments

After the first deployment, updating is simpler:

```bash
# Make your code changes
# Then build and deploy
npm run build
sam build
sam deploy
```

No prompts - it uses the saved configuration from `samconfig.toml`.

## What Gets Created in AWS

The SAM template creates the following resources:

1. **DynamoDB Table**: `saved_urls`
   - On-demand billing (pay per request)
   - Encryption at rest enabled
   - Point-in-time recovery enabled

2. **Lambda Functions**:
   - `RecollectSaveUrl` - Handles POST /api/urls
   - `RecollectGetUrls` - Handles GET /api/urls

3. **API Gateway**:
   - HTTP API with CORS enabled
   - Endpoint: /api/urls

4. **IAM Roles**:
   - Lambda execution roles with DynamoDB permissions

5. **CloudWatch Log Groups**:
   - `/aws/lambda/RecollectSaveUrl`
   - `/aws/lambda/RecollectGetUrls`

## Monitoring Your Application

### View Logs

```bash
# Real-time logs for SaveUrl function
aws logs tail /aws/lambda/RecollectSaveUrl --follow

# Real-time logs for GetUrls function
aws logs tail /aws/lambda/RecollectGetUrls --follow
```

### View in AWS Console

1. Go to AWS Console → Lambda
2. Find your functions: `RecollectSaveUrl` and `RecollectGetUrls`
3. Click on a function → Monitor tab → View logs in CloudWatch

### Check DynamoDB Data

1. Go to AWS Console → DynamoDB
2. Find table: `saved_urls`
3. Click "Explore table items" to see your saved URLs

## Cost Information

For personal use (< 100 requests/day):

- **Lambda**: FREE (within free tier)
- **API Gateway**: FREE (within free tier)
- **DynamoDB**: FREE (within free tier)
- **CloudWatch**: FREE (within free tier)

**Expected monthly cost**: $0

Even with heavy personal use (1000s of requests/day), expect < $2/month.

## Updating the API Key

For production, you should change the default API key:

1. Edit `template.yaml`:
```yaml
Environment:
  Variables:
    API_KEY: your-new-secure-key-here  # Change this
```

2. Redeploy:
```bash
sam build && sam deploy
```

3. Update Chrome extension with new API key

## Troubleshooting

### Build Fails

```bash
# Clean and retry
npm run clean
npm install
npm run build
sam build
```

### Deployment Fails

```bash
# Check AWS credentials
aws sts get-caller-identity

# Check CloudFormation events
aws cloudformation describe-stack-events \
  --stack-name recollect-backend \
  --max-items 10
```

### API Returns 500 Error

```bash
# Check Lambda logs
aws logs tail /aws/lambda/RecollectSaveUrl --since 10m

# Or test locally first
sam build
sam local invoke SaveUrlFunction -e events/save-url.json
```

### API Returns 401 Unauthorized

- Verify you're sending the correct API key in `X-API-Key` header
- Check that the API key in your request matches the one in `template.yaml`

### DynamoDB Not Found

- Ensure the stack deployed successfully
- Check DynamoDB console for `saved_urls` table
- Verify Lambda has correct TABLE_NAME environment variable

## Rollback Deployment

If something goes wrong:

```bash
# Delete the entire stack
sam delete --stack-name recollect-backend

# Then redeploy from scratch
sam build
sam deploy --guided
```

Note: This will delete all data in DynamoDB!

## Advanced Configuration

### Change AWS Region

Edit `samconfig.toml` and change the region:

```toml
region = "us-west-2"  # or your preferred region
```

Then redeploy.

### Enable API Gateway Throttling

Edit `template.yaml` and add throttling settings:

```yaml
RecollectApi:
  Type: AWS::Serverless::HttpApi
  Properties:
    DefaultRouteSettings:
      ThrottlingBurstLimit: 100
      ThrottlingRateLimit: 50
```

### Add CloudWatch Alarms

Add to `template.yaml`:

```yaml
SaveUrlErrorAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmDescription: Alert on SaveUrl Lambda errors
    MetricName: Errors
    Namespace: AWS/Lambda
    Statistic: Sum
    Period: 300
    EvaluationPeriods: 1
    Threshold: 5
    ComparisonOperator: GreaterThanThreshold
    Dimensions:
      - Name: FunctionName
        Value: !Ref SaveUrlFunction
```

## Next Steps

After successful deployment:

1. Test all endpoints thoroughly
2. Configure Chrome extension with API URL and key
3. Set up CloudWatch dashboards (optional)
4. Enable AWS WAF for additional security (optional)
5. Set up backup strategy for DynamoDB (point-in-time recovery is already enabled)

## Support Resources

- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
