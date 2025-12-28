# Recollect Extension - Quick Start Guide

Get the Recollect Chrome extension up and running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Chrome browser
- Backend deployed to AWS (see backend README)

## 1. Install Dependencies

```bash
cd extension
npm install
```

## 2. Configure API

Edit `src/config/index.ts`:

```typescript
export const API_URL = 'https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/Prod';
export const API_KEY = 'recollect-dev-key-12345';
```

**Get these values from backend deployment:**

```bash
cd ../backend
sam list stack-outputs --stack-name recollect-backend
```

## 3. Generate Icons

Open `generate-icons.html` in your browser:

```bash
open generate-icons.html  # macOS
# or just double-click the file
```

Download all three icons and save to `public/icons/`:
- icon16.png
- icon48.png
- icon128.png

## 4. Build Extension

```bash
npm run build
```

This creates the `dist/` folder with your extension.

## 5. Load in Chrome

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `dist/` folder
5. Done! The extension icon appears in your toolbar

## 6. Test It

1. Go to any website (e.g., github.com)
2. Click the Recollect icon
3. Click "Save Current Page"
4. See your saved URL in the list

## Troubleshooting

**"Configuration Required" warning?**
- Update `src/config/index.ts` with your API URL and key
- Rebuild: `npm run build`
- Reload extension in Chrome

**"Failed to save URL" error?**
- Check backend is deployed: `aws cloudformation describe-stacks --stack-name recollect-backend`
- Test API: `curl -H "X-API-Key: YOUR_KEY" YOUR_API_URL/api/urls`
- Check browser console for errors

**Extension not loading?**
- Make sure you loaded the `dist/` folder (not root)
- Check for errors at `chrome://extensions/`
- Try rebuilding: `npm run build`

## Development Mode

To work on the extension:

```bash
npm run dev  # Watch for changes
```

After making changes:
1. Save your files
2. Go to `chrome://extensions/`
3. Click reload icon on Recollect extension
4. Test changes

## Next Steps

- Read full [README.md](README.md) for detailed documentation
- Customize the icons for your personal style
- Check the backend logs if you encounter API errors
- Explore the code in `src/` to add features

## Common Issues

### Icons Missing
Solution: Generate icons using `generate-icons.html` and save to `public/icons/`

### Build Errors
Solution: Delete `node_modules` and `dist`, then:
```bash
npm install
npm run build
```

### API Not Working
Solution: Verify backend deployment and check API URL/key are correct

## Support

- Backend docs: `../backend/README.md`
- Project overview: `../project.md`
- Browser console: Check for error messages
- AWS logs: `aws logs tail /aws/lambda/RecollectSaveUrl --follow`
