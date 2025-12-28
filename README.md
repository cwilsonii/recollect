# Recollect - Personal URL Bookmarking Tool

A Chrome extension with serverless backend for saving and organizing URLs you visit.

## Project Structure

```
recollect-test/
├── backend/          # AWS Lambda + DynamoDB backend
├── extension/        # Chrome extension (React + TypeScript)
└── project.md        # Complete product definition
```

## Features

- **One-click save**: Save current webpage URL with a single click
- **View saved URLs**: Browse all saved URLs in the extension popup
- **Serverless backend**: AWS Lambda + API Gateway + DynamoDB
- **Modern UI**: React-based Chrome extension

## Tech Stack

**Backend**:
- AWS Lambda (Node.js 18)
- API Gateway
- DynamoDB
- AWS SAM for deployment

**Extension**:
- React 18
- TypeScript
- Chrome Extension Manifest V3
- Vite for building

## Quick Start

### 1. Deploy Backend

```bash
cd backend
npm install
sam build
sam deploy --guided
```

After deployment, note your API Gateway URL.

### 2. Configure Extension

Update `extension/src/config/index.ts` with your API URL and key:
```typescript
export const API_URL = 'YOUR_API_GATEWAY_URL';
export const API_KEY = 'YOUR_API_KEY';
```

### 3. Build Extension

```bash
cd extension
npm install
npm run build
```

### 4. Install in Chrome

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/dist/` folder

## Documentation

- **Backend**: See [backend/START_HERE.md](backend/START_HERE.md)
- **Extension**: See [extension/START_HERE.md](extension/START_HERE.md)
- **Product Spec**: See [project.md](project.md)

## Cost

Expected cost: $0-2/month (within AWS free tier for personal use)

## Development

Built as a personal project for URL bookmarking and content tracking.

## License

Personal use project.
