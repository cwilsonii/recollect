# Recollect Chrome Extension

A Chrome extension that allows you to save and organize URLs you visit with a single click.

## Features

- **One-Click Save**: Save the current page with a single click
- **Recent URLs**: View your recently saved URLs in the popup
- **Quick Access**: Click any saved URL to open it in a new tab
- **Smart Caching**: URLs are cached locally for faster display
- **Visual Feedback**: Success/error messages and badge notifications
- **Clean UI**: Modern, responsive design

## Prerequisites

Before using the extension, you need to:

1. Deploy the backend API to AWS Lambda + API Gateway
2. Get your API Gateway URL and API Key
3. Update the extension configuration

## Setup Instructions

### 1. Install Dependencies

```bash
cd extension
npm install
```

### 2. Configure API Settings

Edit `/Users/chuckwilson/Downloads/dev/recollect-test/extension/src/config/index.ts` and update:

```typescript
// UPDATE THIS: Replace with your API Gateway URL after backend deployment
export const API_URL = 'https://abc123xyz.execute-api.us-east-1.amazonaws.com/Prod';

// UPDATE THIS: Replace with your API key from backend deployment
export const API_KEY = 'recollect-dev-key-12345';
```

**How to get these values:**

1. Deploy the backend:
   ```bash
   cd ../backend
   sam build
   sam deploy --guided
   ```

2. Get your API URL:
   ```bash
   sam list stack-outputs --stack-name recollect-backend
   ```
   Look for: `ApiUrl = https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod`

3. Get your API Key:
   - Check `backend/template.yaml` under Environment Variables
   - Default: `recollect-dev-key-12345`

### 3. Build the Extension

```bash
npm run build
```

This creates a `dist/` directory with the built extension.

### 4. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `dist/` directory from this project
5. The Recollect extension should now appear in your extensions list

### 5. Test the Extension

1. Navigate to any webpage
2. Click the Recollect extension icon in your toolbar
3. Click **Save Current Page**
4. You should see a success message and the URL in your list

## Development

### Development Mode (Watch for Changes)

```bash
npm run dev
```

This builds the extension and watches for changes. After making code changes:

1. Save your files
2. Go to `chrome://extensions/`
3. Click the reload icon on the Recollect extension
4. Test your changes

### Build for Production

```bash
npm run build
```

### Project Structure

```
extension/
├── manifest.json              # Chrome extension manifest
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Build configuration
├── public/
│   └── icons/                 # Extension icons
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
├── src/
│   ├── popup/                 # Popup UI
│   │   ├── App.tsx           # Main app component
│   │   ├── index.tsx         # React entry point
│   │   ├── index.html        # Popup HTML
│   │   └── styles.css        # Styles
│   ├── background/
│   │   └── service-worker.ts # Background service worker
│   ├── api/
│   │   └── client.ts         # API client
│   ├── config/
│   │   └── index.ts          # Configuration
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   └── components/           # React components
│       ├── SaveButton.tsx
│       ├── UrlList.tsx
│       ├── UrlItem.tsx
│       └── ErrorMessage.tsx
└── dist/                      # Built extension (generated)
```

## Usage

### Saving a URL

1. Navigate to a webpage you want to save
2. Click the Recollect extension icon
3. Click **Save Current Page**
4. You'll see a success message and badge notification

### Viewing Saved URLs

1. Click the Recollect extension icon
2. Your recently saved URLs appear in the popup
3. Click any URL to open it in a new tab
4. Click **Load More** to see older URLs

### Features

- **Automatic Caching**: First 20 URLs are cached for instant display
- **Pagination**: Load more URLs with the "Load More" button
- **Relative Timestamps**: See when you saved each URL ("2 hours ago", "yesterday", etc.)
- **Domain Display**: Clean domain names for easy identification
- **Favicons**: Website icons displayed next to each URL
- **Error Handling**: Clear error messages if something goes wrong

## Troubleshooting

### Extension Shows "Configuration Required"

**Problem**: API_URL and API_KEY are not set

**Solution**:
1. Deploy the backend first
2. Update `src/config/index.ts` with your API URL and key
3. Rebuild: `npm run build`
4. Reload extension in Chrome

### "Failed to save URL" Error

**Possible causes**:
1. Backend API not deployed or accessible
2. Incorrect API_URL or API_KEY
3. Network/CORS issues

**Solution**:
1. Check backend deployment: `aws cloudformation describe-stacks --stack-name recollect-backend`
2. Verify API is accessible: `curl -H "X-API-Key: YOUR_KEY" YOUR_API_URL/api/urls`
3. Check browser console for detailed errors

### "Cannot save browser internal pages"

This is expected. Chrome extensions cannot save internal browser pages like:
- `chrome://` pages
- `edge://` pages
- `about:` pages

Navigate to a regular webpage (http:// or https://) instead.

### Extension Not Loading

**Solution**:
1. Make sure you built the extension: `npm run build`
2. Load the `dist/` directory (not the root directory)
3. Check for errors in `chrome://extensions/`

### Popup Not Opening

**Solution**:
1. Check the console at `chrome://extensions/` for errors
2. Rebuild the extension: `npm run build`
3. Reload the extension
4. Try restarting Chrome

## Icons

The extension requires three icon sizes:
- **16x16**: Toolbar icon
- **48x48**: Extension management page
- **128x128**: Chrome Web Store

### Creating Icons

You can create custom icons using:

1. **Online Tools**:
   - [Favicon.io](https://favicon.io/) - Generate from text or image
   - [RealFaviconGenerator](https://realfavicongenerator.net/)

2. **Design Tools**:
   - Figma, Sketch, Adobe Illustrator
   - Export as PNG in required sizes

3. **Placeholder Icons** (Temporary):
   Use simple bookmark/bookmark-ribbon icons from:
   - [Heroicons](https://heroicons.com/)
   - [Feather Icons](https://feathericons.com/)

Save icons as:
- `public/icons/icon16.png`
- `public/icons/icon48.png`
- `public/icons/icon128.png`

Then rebuild: `npm run build`

## API Documentation

### Backend Endpoints

#### Save URL
```
POST /api/urls
Headers:
  X-API-Key: your-api-key
  Content-Type: application/json
Body:
  {
    "url": "https://example.com",
    "title": "Page Title",
    "faviconUrl": "https://example.com/favicon.ico"
  }
```

#### Get URLs
```
GET /api/urls?limit=20&lastKey=xxx
Headers:
  X-API-Key: your-api-key
```

See backend API documentation for more details.

## Chrome Extension APIs Used

- **chrome.tabs**: Get current tab URL and title
- **chrome.storage.local**: Cache URLs locally
- **chrome.runtime**: Message passing between components
- **chrome.action**: Badge notifications and icon management

## Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Chrome Extension Manifest V3**: Extension platform

## Scripts

- `npm run dev` - Build and watch for changes
- `npm run build` - Production build
- `npm run preview` - Preview production build

## Security Notes

- API key is stored in code (acceptable for personal use)
- For production/multi-user: Implement proper authentication
- All API calls use HTTPS
- CORS is configured on backend for extension origin

## Future Enhancements

Planned for future releases:
- Tags and categories
- Search and filtering
- Delete saved URLs
- Edit URL metadata
- Weekly summaries
- Export functionality

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend deployment logs: `aws logs tail /aws/lambda/RecollectSaveUrl --follow`
3. Check browser console for errors
4. Review API responses in Network tab

## License

Personal use application - not licensed for distribution.
