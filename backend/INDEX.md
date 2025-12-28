# Recollect Backend - Complete Index

## Quick Navigation

### Getting Started (Start Here!)
1. [QUICKSTART.md](QUICKSTART.md) - Deploy in 5 minutes
2. [README.md](README.md) - Complete documentation
3. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Project overview

### Deployment & Configuration
- [DEPLOYMENT.md](DEPLOYMENT.md) - Step-by-step deployment guide
- [template.yaml](template.yaml) - AWS SAM infrastructure template
- [package.json](package.json) - Dependencies and scripts
- [tsconfig.json](tsconfig.json) - TypeScript configuration

### Architecture & Design
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
- [src/lib/types.ts](src/lib/types.ts) - Type definitions

### API Documentation
- [API_EXAMPLES.md](API_EXAMPLES.md) - Complete API testing guide

### Source Code

#### Lambda Handlers
- [src/handlers/saveUrl.ts](src/handlers/saveUrl.ts) - POST /api/urls
- [src/handlers/getUrls.ts](src/handlers/getUrls.ts) - GET /api/urls

#### Shared Libraries
- [src/lib/types.ts](src/lib/types.ts) - TypeScript types
- [src/lib/response.ts](src/lib/response.ts) - API responses
- [src/lib/dynamodb.ts](src/lib/dynamodb.ts) - Database operations
- [src/lib/auth.ts](src/lib/auth.ts) - Authentication
- [src/lib/validation.ts](src/lib/validation.ts) - Input validation

### Testing
- [scripts/test-local.sh](scripts/test-local.sh) - Interactive testing
- [events/save-url.json](events/save-url.json) - Test event: save URL
- [events/get-urls.json](events/get-urls.json) - Test event: get URLs
- [events/save-url-minimal.json](events/save-url-minimal.json) - Minimal request
- [events/save-url-invalid-api-key.json](events/save-url-invalid-api-key.json) - Auth test
- [events/get-urls-with-pagination.json](events/get-urls-with-pagination.json) - Pagination test

### Deployment Scripts
- [scripts/deploy.sh](scripts/deploy.sh) - Automated deployment

### Configuration Files
- [.eslintrc.json](.eslintrc.json) - ESLint rules
- [.gitignore](.gitignore) - Git ignore patterns
- [.env.example](.env.example) - Environment variables template
- [samconfig.toml.example](samconfig.toml.example) - SAM config template

## File Descriptions

### Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| QUICKSTART.md | 5-minute quick start | All users |
| README.md | Complete reference | All users |
| DEPLOYMENT.md | Deployment walkthrough | DevOps/Deployment |
| ARCHITECTURE.md | Technical deep dive | Developers |
| API_EXAMPLES.md | API testing examples | Developers/QA |
| PROJECT_SUMMARY.md | Project overview | All users |
| INDEX.md | This file | All users |

### Source Files

| File | Lines | Purpose |
|------|-------|---------|
| src/handlers/saveUrl.ts | ~180 | Save URL Lambda handler |
| src/handlers/getUrls.ts | ~120 | Get URLs Lambda handler |
| src/lib/types.ts | ~140 | TypeScript interfaces |
| src/lib/response.ts | ~80 | Response helpers |
| src/lib/dynamodb.ts | ~130 | DynamoDB operations |
| src/lib/auth.ts | ~60 | Authentication logic |
| src/lib/validation.ts | ~150 | Input validation |

### Configuration Files

| File | Purpose |
|------|---------|
| template.yaml | AWS SAM infrastructure template |
| package.json | Node.js dependencies and scripts |
| tsconfig.json | TypeScript compiler settings |
| .eslintrc.json | ESLint linting rules |
| .gitignore | Git ignore patterns |

### Test Files

| File | Purpose |
|------|---------|
| events/save-url.json | Test saving URL with all fields |
| events/save-url-minimal.json | Test saving URL (minimal) |
| events/save-url-invalid-api-key.json | Test auth failure |
| events/get-urls.json | Test getting URLs |
| events/get-urls-with-pagination.json | Test pagination |

### Scripts

| File | Purpose |
|------|---------|
| scripts/deploy.sh | Automated deployment |
| scripts/test-local.sh | Interactive local testing |

## Common Tasks

### First Time Setup
```bash
cd backend
npm install
./scripts/deploy.sh
```
See: [QUICKSTART.md](QUICKSTART.md)

### Local Testing
```bash
./scripts/test-local.sh
```
See: [README.md#local-development](README.md#local-development)

### Deploy Updates
```bash
npm run build
sam build
sam deploy
```
See: [DEPLOYMENT.md#subsequent-deployments](DEPLOYMENT.md#subsequent-deployments)

### Test API
```bash
# See comprehensive examples
cat API_EXAMPLES.md
```
See: [API_EXAMPLES.md](API_EXAMPLES.md)

### View Logs
```bash
aws logs tail /aws/lambda/RecollectSaveUrl --follow
```
See: [README.md#monitoring-and-logs](README.md#monitoring-and-logs)

### Delete Stack
```bash
sam delete --stack-name recollect-backend
```
See: [DEPLOYMENT.md#cleanup](DEPLOYMENT.md#cleanup)

## NPM Scripts

| Command | Purpose |
|---------|---------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run watch` | Watch mode for development |
| `npm run clean` | Remove build artifacts |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run sam:build` | Build SAM application |
| `npm run sam:deploy` | Deploy to AWS |
| `npm run sam:local` | Start local API server |
| `npm run sam:invoke:save` | Test SaveUrl locally |
| `npm run sam:invoke:get` | Test GetUrls locally |

## API Endpoints Reference

### POST /api/urls
- **File**: [src/handlers/saveUrl.ts](src/handlers/saveUrl.ts)
- **Purpose**: Save a new URL
- **Auth**: Required (X-API-Key header)
- **Input**: `{ url, title, faviconUrl? }`
- **Output**: `{ id, url, title, faviconUrl?, savedAt }`
- **Status**: 201 Created (success), 400/401/500 (errors)

### GET /api/urls
- **File**: [src/handlers/getUrls.ts](src/handlers/getUrls.ts)
- **Purpose**: Retrieve saved URLs
- **Auth**: Required (X-API-Key header)
- **Query Params**: `limit` (1-100), `lastKey` (pagination)
- **Output**: `{ urls[], hasMore, lastKey? }`
- **Status**: 200 OK (success), 400/401/500 (errors)

## AWS Resources Created

| Resource | Name | Type |
|----------|------|------|
| DynamoDB Table | saved_urls | Table |
| Lambda Function | RecollectSaveUrl | Function |
| Lambda Function | RecollectGetUrls | Function |
| API Gateway | RecollectApi | HTTP API |
| IAM Role | SaveUrlFunctionRole | Role |
| IAM Role | GetUrlsFunctionRole | Role |
| CloudWatch Logs | /aws/lambda/RecollectSaveUrl | Log Group |
| CloudWatch Logs | /aws/lambda/RecollectGetUrls | Log Group |

## Project Statistics

- **Total Files**: 23+
- **Documentation Files**: 7
- **Source Files**: 7 TypeScript files
- **Test Events**: 5
- **Scripts**: 2
- **Configuration Files**: 5+
- **Lines of Code**: ~1,100+ (excluding comments)
- **Lines of Documentation**: ~2,500+

## Technology Stack Summary

- **Language**: TypeScript 5.3+ (strict mode)
- **Runtime**: Node.js 18 (ARM64)
- **Framework**: AWS SAM
- **Database**: DynamoDB
- **API**: API Gateway HTTP API
- **Compute**: AWS Lambda
- **Logging**: CloudWatch Logs
- **IaC**: AWS SAM (CloudFormation)
- **Build**: TypeScript Compiler (tsc)
- **Linting**: ESLint with TypeScript plugin

## Support Resources

### Internal Documentation
- [README.md](README.md) - Main documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture details
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide

### External Resources
- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Troubleshooting Quick Links

- [Build Issues](README.md#build-fails)
- [Deployment Issues](DEPLOYMENT.md#deployment-fails)
- [API Errors](README.md#lambda-function-errors)
- [Authentication Issues](DEPLOYMENT.md#api-returns-401-unauthorized)
- [DynamoDB Issues](DEPLOYMENT.md#dynamodb-not-found)

## Changelog

### Version 1.0.0 (Initial Release)
- POST /api/urls endpoint
- GET /api/urls endpoint with pagination
- API key authentication
- DynamoDB integration
- CloudWatch logging
- Complete documentation
- Testing infrastructure
- Deployment automation

## License

MIT

## Contact

For questions or issues, refer to the documentation files above.

---

**Last Updated**: 2025-12-27

**Version**: 1.0.0

**Status**: Production Ready
