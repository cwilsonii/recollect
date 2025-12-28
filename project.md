# Recollect - Personal URL Bookmarking Tool

## Executive Summary

**What**: Recollect is a Chrome extension that allows you to save the URL you're currently viewing with a single click.

**Why**: You consume many articles and videos but find it difficult to remember and find what you've consumed. This application helps you track and reference that content.

**Who**: Personal use application (single user - you).

**When**: Available anytime you're using Chrome.

**How**: Chrome extension (frontend) + AWS Lambda functions (backend API) + API Gateway + DynamoDB database.

---

## 1. Product Overview

### Vision Statement
Recollect allows you to store URLs you've visited for future reference. The roadmap:
- **Phase 1 (MVP)**: Save URLs with one click
- **Phase 2**: Add tags/categories to organize URLs
- **Phase 3**: Search and filter saved URLs
- **Phase 4**: Generate weekly summaries of content consumed (amount, topics, etc.)

### Core Value Proposition
Instantly save and retrieve URLs you've visited without relying on browser history or manual bookmarking.

### Success Metrics
Since this is for personal use, success = the tool works reliably and you use it regularly:
- Extension successfully saves URLs 99%+ of the time
- Can retrieve any saved URL in under 2 seconds
- Backend API responds in under 300ms

---

## 2. Functional Requirements

### User Stories

**MVP (Phase 1)**:
- As a user, I want to click the extension icon to save the current URL, so that I can reference it later
- As a user, I want to see my saved URLs in a list, so that I can browse what I've saved
- As a user, I want to click a saved URL to open it, so that I can return to that content

**Phase 2**:
- As a user, I want to add tags to saved URLs, so that I can categorize my content
- As a user, I want to delete saved URLs, so that I can remove content I no longer need

**Phase 3**:
- As a user, I want to search my saved URLs by title, URL, or tag, so that I can quickly find specific content
- As a user, I want to filter by tags, so that I can see all URLs in a category

**Phase 4**:
- As a user, I want to receive weekly summaries of my saved content, so that I can see my consumption patterns

### MVP Feature List (Phase 1)

#### Extension Features
- [x] Chrome extension with browser action button (icon in toolbar)
- [x] Click button to save current URL
- [x] Visual confirmation when URL is saved (badge or notification)
- [x] Popup view showing recently saved URLs
- [x] Click saved URL to open in new tab

#### Backend Features
- [x] REST API endpoint to save URL
- [x] REST API endpoint to retrieve all saved URLs
- [x] Store URLs in DynamoDB with metadata:
  - URL
  - Page title
  - Timestamp saved
  - Favicon URL (optional)

### User Workflows

#### Saving a URL
1. User is browsing a webpage in Chrome
2. User clicks the Recollect extension icon
3. Extension captures current tab's URL and title
4. Extension sends data to backend API
5. Backend saves to DynamoDB
6. Extension shows success confirmation

#### Viewing Saved URLs
1. User clicks extension icon
2. Extension popup opens
3. Extension fetches saved URLs from backend API
4. URLs displayed in a list (most recent first)
5. User clicks a URL to open it in a new tab

---

## 3. Technical Requirements

### Architecture Overview

```
┌─────────────────┐
│  Chrome Browser │
│                 │
│  ┌───────────┐  │
│  │ Extension │  │      HTTPS        ┌────────────────┐
│  │  (React)  │──┼─────────────────>│  API Gateway   │
│  └───────────┘  │                   └───────┬────────┘
│                 │                           │
└─────────────────┘                           │
                                              v
                                    ┌─────────────────┐
                                    │ Lambda Function │
                                    │   (Node.js)     │
                                    └────────┬────────┘
                                             │
                                             v
                                    ┌─────────────────┐
                                    │    DynamoDB     │
                                    │  (saved_urls)   │
                                    └─────────────────┘
```

### Technology Stack

**Chrome Extension**:
- Manifest V3
- React 18 (for popup UI)
- TypeScript
- Chrome Extension APIs (tabs, storage)

**Backend**:
- Runtime: AWS Lambda (Node.js 18+)
- Framework: Serverless functions (no Express needed)
- Language: TypeScript
- API Gateway: AWS API Gateway (REST API or HTTP API)
- Database: AWS DynamoDB
- Authentication: Simple API key (since it's single user)

**Infrastructure**:
- Backend hosting: AWS Lambda + API Gateway
- Database: AWS DynamoDB
- Region: Single region (us-east-1 or your preferred)
- Deployment: AWS SAM, Serverless Framework, or CDK

**Development Tools**:
- Package manager: npm
- Build tool: Vite (for extension), tsc (for backend)
- Linting: ESLint
- Git: GitHub

### Deployment Model
- **Single user**: No multi-tenancy needed
- **Single region**: Deploy backend to one AWS region
- **No authentication complexity**: Use a simple API key stored in extension

### Performance Requirements
- API response time: < 300ms for all endpoints
- Extension popup load time: < 500ms
- Database query time: < 100ms
- Extension should work offline and queue saves if needed

### Security Requirements

**Since this is personal use, keep it simple**:
- HTTPS for all API calls (TLS 1.3)
- Simple API key authentication (hardcoded in extension for now)
- Data at rest: DynamoDB encryption enabled
- CORS: Restrict to extension origin only

**No need for**:
- User accounts or authentication flows
- Role-based access control
- SOC 2 compliance
- Multi-factor authentication

---

## 4. Data Model

### Core Entity: SavedURL

**DynamoDB Table**: `saved_urls`

**Attributes**:
```typescript
{
  id: string,              // Primary key (UUID)
  url: string,             // The saved URL
  title: string,           // Page title
  faviconUrl?: string,     // Page favicon (optional)
  savedAt: number,         // Unix timestamp
  tags?: string[],         // Tags/categories (Phase 2)
  notes?: string           // User notes (Phase 2)
}
```

**DynamoDB Schema**:
- Partition key: `id`
- Sort key: `savedAt` (to enable chronological queries)
- GSI (Global Secondary Index): On `savedAt` for sorting

**Example Record**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "url": "https://example.com/article",
  "title": "Interesting Article About Technology",
  "faviconUrl": "https://example.com/favicon.ico",
  "savedAt": 1703721600000,
  "tags": [],
  "notes": ""
}
```

---

## 5. API Design

### Base URL
`https://api.recollect.yourdomain.com` (or your API Gateway URL)

### Authentication
All requests include header: `X-API-Key: your-secret-key`

### Endpoints

#### 1. Save URL
```
POST /api/urls
Content-Type: application/json
X-API-Key: your-secret-key

Request Body:
{
  "url": "https://example.com/article",
  "title": "Article Title",
  "faviconUrl": "https://example.com/favicon.ico"
}

Response (201 Created):
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "url": "https://example.com/article",
  "title": "Article Title",
  "faviconUrl": "https://example.com/favicon.ico",
  "savedAt": 1703721600000
}
```

#### 2. Get All URLs
```
GET /api/urls?limit=50&offset=0
X-API-Key: your-secret-key

Response (200 OK):
{
  "urls": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "url": "https://example.com/article",
      "title": "Article Title",
      "savedAt": 1703721600000
    },
    ...
  ],
  "total": 150,
  "hasMore": true
}
```

#### 3. Delete URL (Phase 2)
```
DELETE /api/urls/:id
X-API-Key: your-secret-key

Response (204 No Content)
```

#### 4. Update URL (Phase 2)
```
PATCH /api/urls/:id
Content-Type: application/json
X-API-Key: your-secret-key

Request Body:
{
  "tags": ["tech", "article"],
  "notes": "Great read about AI"
}

Response (200 OK):
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "url": "https://example.com/article",
  "title": "Article Title",
  "tags": ["tech", "article"],
  "notes": "Great read about AI",
  "savedAt": 1703721600000
}
```

---

## 6. Chrome Extension Design

### Manifest (manifest.json)
```json
{
  "manifest_version": 3,
  "name": "Recollect",
  "version": "1.0.0",
  "description": "Save and organize URLs you visit",
  "permissions": ["activeTab", "storage"],
  "host_permissions": ["https://api.recollect.yourdomain.com/*"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  }
}
```

### Extension Structure
```
extension/
├── manifest.json
├── popup.html          # Popup UI
├── popup.tsx           # React app for popup
├── background.ts       # Service worker for background tasks
├── content.ts          # Content script (if needed)
├── icons/              # Extension icons
└── styles/             # CSS files
```

### Popup UI Design

**Simple list view**:
```
┌─────────────────────────────────┐
│ Recollect                    ⚙️ │
├─────────────────────────────────┤
│                                 │
│ 📄 Article Title                │
│    https://example.com/article  │
│    Saved 2 hours ago            │
│                                 │
│ 📄 Another Article              │
│    https://another.com/page     │
│    Saved yesterday              │
│                                 │
│ [Load More]                     │
│                                 │
└─────────────────────────────────┘
```

**Button to save current page**: Integrated into the popup or as a separate button

---

## 7. Implementation Steps for Sub-Agents

### Phase 1: Backend Setup

**For Backend Engineer**:
1. Initialize serverless Node.js/TypeScript project (using AWS SAM or Serverless Framework)
2. Set up DynamoDB table `saved_urls` with proper schema
3. Implement Lambda function for POST /api/urls endpoint
4. Implement Lambda function for GET /api/urls endpoint with pagination
5. Add API key authentication (using API Gateway API keys or custom authorizer)
6. Add error handling and logging (CloudWatch)
7. Test endpoints locally (using SAM local or Serverless offline)
8. Deploy to AWS (Lambda + API Gateway using SAM/Serverless/CDK)

**Files to create**:
- `backend/template.yaml` or `serverless.yml` - Infrastructure as Code
- `backend/src/handlers/saveUrl.ts` - Lambda handler for POST /api/urls
- `backend/src/handlers/getUrls.ts` - Lambda handler for GET /api/urls
- `backend/src/lib/dynamodb.ts` - DynamoDB operations
- `backend/src/lib/auth.ts` - API key validation helper
- `backend/src/types/index.ts` - TypeScript types
- `backend/package.json` - Dependencies

### Phase 2: Chrome Extension

**For Frontend Engineer**:
1. Initialize Chrome extension project with Manifest V3
2. Create popup UI with React + TypeScript
3. Implement "Save URL" functionality
   - Get current tab URL and title
   - Send to backend API
   - Show success/error feedback
4. Implement "View URLs" in popup
   - Fetch from backend API
   - Display in list format
   - Make URLs clickable
5. Add icons and branding
6. Test extension locally
7. Package for Chrome Web Store (optional)

**Files to create**:
- `extension/manifest.json` - Extension manifest
- `extension/popup.html` - Popup HTML
- `extension/src/popup.tsx` - React popup app
- `extension/src/background.ts` - Background service worker
- `extension/src/api/client.ts` - API client for backend
- `extension/src/types/index.ts` - TypeScript types
- `extension/package.json` - Dependencies

### Phase 3: Integration & Testing

**For QA/Testing**:
1. Test saving URLs from extension
2. Test viewing saved URLs
3. Test error handling (network failures, etc.)
4. Test with various websites (HTTP, HTTPS, SPAs)
5. Performance testing (large number of saved URLs)

---

## 8. Development Workflow

### Local Development

**Backend** (using AWS SAM):
```bash
cd backend
npm install
sam build
sam local start-api  # Start API Gateway locally on localhost:3000
# Or test individual functions:
sam local invoke SaveUrlFunction -e events/save-url.json
```

**Backend** (using Serverless Framework):
```bash
cd backend
npm install
serverless offline  # Start API locally on localhost:3000
```

**Extension**:
```bash
cd extension
npm install
npm run dev  # Build extension
# Load unpacked extension in Chrome from dist/
```

### Git Strategy
- Branch naming: `feature/feature-name`, `fix/bug-name`
- Main branch: `main`
- Simple workflow: commit to feature branch, merge to main

### Environment Variables

**Backend** (configured in template.yaml or serverless.yml):
```yaml
Environment:
  Variables:
    AWS_REGION: us-east-1
    DYNAMODB_TABLE: saved_urls
    API_KEY: your-secret-api-key-here
```

**Local testing** (.env or samconfig.toml):
```
AWS_REGION=us-east-1
DYNAMODB_TABLE=saved_urls
API_KEY=your-secret-api-key-here
```

**Extension**:
- API key and API URL stored in extension config

### Deployment Process

#### Option 1: AWS SAM (Recommended for AWS-native deployments)

**Initial Setup**:
```bash
# Install AWS SAM CLI
brew install aws-sam-cli  # macOS
# or follow: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

# Configure AWS credentials
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and preferred region
```

**Deploy to AWS**:
```bash
cd backend

# Build the application
sam build

# Deploy (first time - guided)
sam deploy --guided
# This will ask you:
# - Stack name: recollect-backend
# - AWS Region: us-east-1 (or your preference)
# - Confirm changes before deploy: Y
# - Allow SAM CLI IAM role creation: Y
# - Save arguments to config file: Y

# Subsequent deploys (uses saved config)
sam deploy
```

**What gets created**:
- DynamoDB table: `saved_urls`
- Lambda functions: `SaveUrlFunction`, `GetUrlsFunction`
- API Gateway REST API with endpoints:
  - POST /api/urls
  - GET /api/urls
- IAM roles for Lambda execution
- CloudWatch Log Groups

**After deployment**:
```bash
# Get your API URL
sam list stack-outputs --stack-name recollect-backend
# Look for output: ApiUrl = https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod

# Test the API
curl -X POST https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod/api/urls \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{"url": "https://example.com", "title": "Test"}'
```

#### Option 2: Serverless Framework (Simpler, more abstracted)

**Initial Setup**:
```bash
# Install Serverless Framework
npm install -g serverless

# Configure AWS credentials (if not already done)
serverless config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_KEY
```

**Deploy to AWS**:
```bash
cd backend

# Deploy everything
serverless deploy

# Deploy just a single function (faster)
serverless deploy function -f saveUrl
```

**What gets created**:
- Same as SAM: DynamoDB table, Lambda functions, API Gateway, IAM roles, CloudWatch logs

**After deployment**:
```bash
# Serverless will output the API endpoint URL automatically
# endpoints:
#   POST - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/api/urls
#   GET - https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/api/urls
```

#### Option 3: AWS CDK (Most flexible, code-based infrastructure)

**Initial Setup**:
```bash
# Install AWS CDK
npm install -g aws-cdk

# Bootstrap CDK in your AWS account (one-time)
cdk bootstrap
```

**Deploy to AWS**:
```bash
cd backend

# Install dependencies
npm install

# Synthesize CloudFormation template (optional - to preview)
cdk synth

# Deploy
cdk deploy

# Deploy with approval
cdk deploy --require-approval never
```

### Deployment Workflow Overview

```
Local Development
       ↓
┌──────────────────┐
│  Write Code      │
│  - Lambda funcs  │
│  - IaC config    │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Build           │
│  sam build       │
│  or npm build    │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Deploy          │
│  sam deploy      │
│  or sls deploy   │
└────────┬─────────┘
         ↓
    AWS Cloud
┌──────────────────────┐
│ CloudFormation       │
│ (creates/updates)    │
│  ↓                   │
│ - Lambda Functions   │
│ - API Gateway        │
│ - DynamoDB Table     │
│ - IAM Roles          │
│ - CloudWatch Logs    │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ Get API Gateway URL  │
│ Configure Extension  │
└──────────────────────┘
```

### Updating After Initial Deployment

**Code changes**:
```bash
# Make changes to your Lambda function code
# Then redeploy

# SAM:
sam build && sam deploy

# Serverless:
serverless deploy function -f saveUrl  # Faster for single function
# or
serverless deploy  # Full deployment
```

**Infrastructure changes** (adding new endpoints, changing DynamoDB schema):
```bash
# Update template.yaml or serverless.yml
# Then run full deploy

sam build && sam deploy
# or
serverless deploy
```

### Cost Estimate

For personal use with low traffic:
- **Lambda**: Free tier = 1M requests/month, 400,000 GB-seconds/month
- **API Gateway**: $3.50 per million requests (after free tier)
- **DynamoDB**: Free tier = 25GB storage, 25 read/write capacity units
- **CloudWatch Logs**: First 5GB free

**Expected monthly cost**: $0 - $2 (well within free tier for personal use)

### Rolling Back Deployments

**SAM**:
```bash
# CloudFormation manages versions
# To rollback, redeploy previous version of code
# Or delete and redeploy stack
aws cloudformation delete-stack --stack-name recollect-backend
```

**Serverless**:
```bash
# Remove deployment
serverless remove
```

---

## 9. Future Enhancements (Post-MVP)

### Phase 2: Organization
- Add tags/categories
- Add notes to saved URLs
- Delete saved URLs
- Edit URL metadata

### Phase 3: Search & Discovery
- Full-text search across titles and URLs
- Filter by tags
- Sort by date, title, etc.
- Duplicate URL detection

### Phase 4: Analytics & Insights
- Weekly email summaries
- Statistics dashboard (total saved, most common tags, etc.)
- Export saved URLs to CSV/JSON
- Chrome history integration

### Phase 5: Advanced Features
- Browser history analysis (suggest URLs to save)
- Content preview/screenshot
- Archive webpage content (full HTML/PDF)
- Share collections with others

---

## 10. Agent-Specific Instructions

### For Solution Architect Agent
- Keep architecture simple: REST API + DynamoDB is sufficient
- No need for microservices, message queues, or complex caching
- Single region deployment is fine
- Focus on reliability over scalability (single user)

### For Backend Engineer Agent
- Use AWS Lambda with Node.js 18+ and TypeScript
- Create separate Lambda functions for each endpoint (saveUrl, getUrls)
- Use AWS SAM, Serverless Framework, or CDK for infrastructure as code
- Use AWS SDK v3 for DynamoDB operations
- Keep authentication simple (API Gateway API keys or custom header validation)
- Add CloudWatch logging (console.log automatically goes to CloudWatch)
- Follow REST conventions (proper status codes, JSON responses)
- Keep Lambda handlers thin - delegate business logic to separate modules
- Use environment variables for configuration (table name, API key, region)

### For Frontend Engineer Agent
- Use React 18 with TypeScript for extension popup
- Use Chrome Extension APIs (chrome.tabs, chrome.storage)
- Follow Manifest V3 guidelines
- Keep UI simple and fast (minimal dependencies)
- Handle network errors gracefully
- Use local storage for caching recent URLs

### For DevOps Engineer Agent
- Deploy backend using AWS Lambda + API Gateway (serverless)
- **Recommended**: Use AWS SAM for infrastructure as code (simple, AWS-native, good for beginners)
  - Alternative: Serverless Framework (simpler config, more abstracted)
  - Alternative: AWS CDK (most flexible, write infrastructure in TypeScript)
- Set up DynamoDB table with on-demand billing
- Configure CORS properly for extension origin (chrome-extension://* or specific extension ID)
- Set up API Gateway with API key authentication (use API Gateway API Keys feature)
- Configure CloudWatch Logs for Lambda functions (automatic)
- Set up CloudWatch alarms for errors and throttling (optional for MVP)
- Keep deployment simple (serverless, no containers or Kubernetes needed)
- Use environment variables for configuration (DynamoDB table name, API key, region)
- After deployment, capture API Gateway URL and provide it to frontend team

### For Database Architect Agent
- Single DynamoDB table is sufficient
- Use UUID for partition key
- Add GSI on savedAt for chronological sorting
- Enable point-in-time recovery (PITR)
- Use on-demand billing (no need to provision capacity)

---

## 11. Success Criteria

### MVP Success (Phase 1)
- [x] Chrome extension installed and functional
- [x] Can save current URL with one click
- [x] Can view saved URLs in popup
- [x] Backend API deployed and accessible
- [x] DynamoDB storing data reliably
- [x] End-to-end flow works consistently

### Technical Requirements Met
- [x] API responds in < 300ms
- [x] Extension loads in < 500ms
- [x] No data loss
- [x] Proper error handling for network failures

---

## 12. Open Questions & Decisions

**Answered**:
- ✅ Storage: Using DynamoDB (backend database)
- ✅ User model: Single user (personal use)
- ✅ MVP scope: Save URL with one click
- ✅ Backend hosting: AWS Lambda + API Gateway (serverless)

**Recommended (can be changed)**:
- **IaC Tool**: AWS SAM (simple, AWS-native, works well for this use case)
  - Use Serverless Framework if you prefer simpler YAML config
  - Use CDK if you want to write infrastructure in TypeScript

**To Decide**:
- [ ] Do you have an AWS account set up?
- [ ] Do you want to publish the extension to Chrome Web Store or just use it locally?
- [ ] Do you want email summaries eventually? If so, which email service (AWS SES, SendGrid)?

---

## 13. Getting Started

### Quick Start for Backend (AWS SAM)

```bash
# 1. Install prerequisites
brew install aws-sam-cli
aws configure  # Enter your AWS credentials

# 2. Create backend project
mkdir -p recollect/backend
cd recollect/backend

# 3. Initialize SAM project
sam init --runtime nodejs18.x --name recollect-backend --app-template hello-world

# 4. Create your Lambda handlers
# - src/handlers/saveUrl.ts
# - src/handlers/getUrls.ts
# - src/lib/dynamodb.ts

# 5. Update template.yaml with your resources
# - DynamoDB table
# - Lambda functions
# - API Gateway endpoints

# 6. Build and deploy
sam build
sam deploy --guided

# 7. Get your API URL
sam list stack-outputs --stack-name recollect-backend
# Copy the ApiUrl output

# 8. Test
curl -X POST <ApiUrl>/api/urls \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-key" \
  -d '{"url": "https://test.com", "title": "Test"}'
```

### For Sub-Agents Building This

**Start with backend first**:
1. Backend engineer: Set up Lambda functions + DynamoDB, create API endpoints using SAM
2. DevOps engineer: Deploy backend to AWS Lambda + API Gateway, get API URL
3. Frontend engineer: Build Chrome extension, connect to deployed API
4. QA engineer: Test end-to-end flow

**Key files to create**:
- Backend: `template.yaml`, `saveUrl.ts`, `getUrls.ts`, `dynamodb.ts`
- Extension: `manifest.json`, `popup.tsx`, `background.ts`

**Critical handoff**: After backend deployment, DevOps provides:
- API Gateway URL (e.g., `https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod`)
- API Key for authentication
- DynamoDB table name

**Timeline estimate**:
- Backend setup & deployment: 1-2 days
- Extension development: 1-2 days
- Integration & testing: 1 day
- **Total: 3-5 days for MVP**

---

## Appendix

### A. Technology Choices Rationale

**Why DynamoDB?**
- Serverless, no DB maintenance
- Simple key-value model fits use case
- Scales automatically (even though it's single user)
- Pay-per-use pricing (cheap for single user)

**Why AWS Lambda?**
- Serverless, no server maintenance
- Pay only for what you use (extremely cheap for personal use)
- Auto-scales (though not needed for single user)
- Easy integration with API Gateway and DynamoDB
- No need to manage servers, security patches, or uptime
- Perfect for low-traffic applications with sporadic usage

**Why React for Extension?**
- Familiar framework
- Component reusability
- Good TypeScript support
- Easy to build UI quickly

### B. Assumptions
- You have an AWS account
- You're familiar with Chrome extension development basics
- You can deploy Node.js applications
- You use Chrome as your primary browser

### C. Out of Scope (for MVP)
- Multi-user support
- User authentication (login/signup)
- Mobile app
- Firefox/Safari extensions
- Real-time sync across devices
- Offline mode with sync
- Content archiving
- Social features
