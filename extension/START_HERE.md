# START HERE - Recollect Chrome Extension

Welcome to the Recollect Chrome Extension! This guide will get you up and running.

## What is Recollect?

Recollect is a Chrome extension that lets you save URLs with one click and access them later. Think of it as a personal bookmarking system with a clean, modern interface.

## What You Need

Before you start, make sure you have:

1. **Node.js 18+** installed ([download here](https://nodejs.org))
2. **Chrome browser** installed
3. **Backend API deployed** (see `/Users/chuckwilson/Downloads/dev/recollect-test/backend/README.md`)

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd /Users/chuckwilson/Downloads/dev/recollect-test/extension
npm install
```

This installs React, TypeScript, Vite, and other dependencies.

### Step 2: Configure API

You need to tell the extension where your backend API is.

**Get your API details:**

```bash
cd /Users/chuckwilson/Downloads/dev/recollect-test/backend
sam list stack-outputs --stack-name recollect-backend
```

Look for:
- **ApiUrl**: `https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod`
- **API Key**: Found in `backend/template.yaml` (default: `recollect-dev-key-12345`)

**Update configuration:**

Edit `/Users/chuckwilson/Downloads/dev/recollect-test/extension/src/config/index.ts`:

```typescript
export const API_URL = 'https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/Prod';
export const API_KEY = 'recollect-dev-key-12345';
```

Replace `YOUR-API-ID` with your actual API Gateway ID.

### Step 3: Create Icons

Open `generate-icons.html` in your browser:

```bash
open generate-icons.html  # macOS
# or double-click the file in Finder
```

Download all three icons:
1. Right-click each icon → "Save image as..."
2. Save to `public/icons/` as:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

**Or use these commands to create the directory:**

```bash
mkdir -p public/icons
```

Then save the icons there.

### Step 4: Build the Extension

```bash
npm run build
```

This creates a `dist/` folder with your extension ready to load.

### Step 5: Load in Chrome

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right corner)
4. Click **Load unpacked**
5. Navigate to and select the `dist/` folder
6. Click **Select**

You should see the Recollect extension appear in your list!

### Step 6: Test It

1. Navigate to any website (try https://github.com)
2. Click the Recollect icon in your Chrome toolbar
3. Click **"Save Current Page"**
4. You should see:
   - A success message
   - A green checkmark badge on the icon
   - The URL appears in your list

Done! The extension is working.

## Verification

Run the verification script to check your setup:

```bash
./verify-setup.sh
```

This checks:
- ✓ Node.js installed
- ✓ Dependencies installed
- ✓ API configured
- ✓ Icons present
- ✓ Extension built

## What's Next?

### Daily Use

1. Click the extension icon while browsing
2. Click "Save Current Page" to bookmark
3. View your saved URLs in the popup
4. Click any URL to open it

### Making Changes

If you want to customize the extension:

```bash
npm run dev  # Start watch mode
```

Then:
1. Edit files in `src/`
2. Changes auto-rebuild
3. Go to `chrome://extensions/`
4. Click reload button on Recollect
5. Test your changes

### Troubleshooting

**"Configuration Required" warning?**
- Update `src/config/index.ts` with your API URL and key
- Rebuild: `npm run build`
- Reload extension

**"Failed to save URL" error?**
- Check backend is running:
  ```bash
  curl -H "X-API-Key: YOUR_KEY" YOUR_API_URL/api/urls
  ```
- Verify API URL and key are correct
- Check browser console for details

**Extension not loading?**
- Make sure you built it: `npm run build`
- Load the `dist/` folder (not root)
- Check `chrome://extensions/` for errors

**Icons missing?**
- Generate icons using `generate-icons.html`
- Save to `public/icons/`
- Rebuild: `npm run build`

## Documentation

We've included comprehensive documentation:

- **README.md** - Full documentation and reference
- **QUICKSTART.md** - Fast setup guide
- **TESTING.md** - How to test the extension
- **PROJECT_SUMMARY.md** - Technical overview
- **FILE_STRUCTURE.md** - Complete file documentation
- **This file (START_HERE.md)** - Getting started

Choose based on what you need:
- Want to get started fast? → This file (START_HERE.md)
- Need detailed setup? → README.md
- Want to test thoroughly? → TESTING.md
- Curious about the code? → PROJECT_SUMMARY.md

## Project Structure

```
extension/
├── src/                       # Source code
│   ├── popup/                # Popup UI (what you see)
│   ├── background/           # Background tasks
│   ├── components/           # React components
│   ├── api/                  # Backend communication
│   ├── config/               # Configuration (UPDATE THIS!)
│   └── types/                # TypeScript types
├── public/icons/             # Extension icons (CREATE THESE!)
├── dist/                     # Built extension (LOAD THIS IN CHROME!)
├── manifest.json             # Extension config
├── package.json              # Dependencies
└── vite.config.ts           # Build config
```

## Key Commands

```bash
# Install dependencies
npm install

# Build extension (production)
npm run build

# Build and watch for changes (development)
npm run dev

# Check code quality
npm run lint

# Verify setup
./verify-setup.sh
```

## How It Works

1. **You click "Save Current Page"**
   → Extension gets current tab URL and title
   → Sends to your backend API
   → Saves in DynamoDB

2. **You open the popup**
   → Extension fetches your saved URLs from API
   → Displays them in a list
   → Caches them locally for speed

3. **You click a URL**
   → Opens in a new tab
   → Easy access to saved content

## Features

- ✓ One-click save
- ✓ View recent URLs
- ✓ Click to open
- ✓ Pagination (load more)
- ✓ Smart caching
- ✓ Error handling
- ✓ Clean, modern UI
- ✓ Fast and responsive

## Technology

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Chrome Extension API** - Browser integration
- **AWS Lambda + API Gateway** - Backend (separate)

## Support

Having issues?

1. Check troubleshooting section above
2. Read README.md for detailed docs
3. Check browser console for errors
4. Verify backend is deployed and accessible
5. Review TESTING.md for common issues

## Backend Integration

This extension connects to your backend API. Make sure:

1. Backend is deployed to AWS Lambda
2. API Gateway is configured
3. CORS allows chrome-extension:// origin
4. API key matches what you put in config

See `/Users/chuckwilson/Downloads/dev/recollect-test/backend/README.md` for backend setup.

## Development Tips

### Working on the UI
1. `npm run dev` - Auto-rebuild on changes
2. Edit files in `src/popup/` and `src/components/`
3. Reload extension in Chrome after rebuild
4. Check browser console for errors

### Working on the Background Script
1. Edit `src/background/service-worker.ts`
2. Rebuild: `npm run build`
3. Reload extension in Chrome
4. Check service worker console (chrome://extensions/ → "service worker")

### Working on Styles
1. Edit `src/popup/styles.css`
2. Rebuild (auto with `npm run dev`)
3. Reload extension
4. Changes appear immediately

### Working on API Integration
1. Edit `src/api/client.ts`
2. Test with real API calls
3. Check Network tab in DevTools
4. Verify request/response format

## Security Notes

- API key is stored in code (acceptable for personal use)
- All API calls use HTTPS
- Extension only requests minimal permissions
- Data is private to you (single user)

## Performance

Expected performance:
- Popup opens in < 500ms
- Save operation in < 2s
- Cached URLs load instantly
- Smooth scrolling
- Low memory usage

## Next Steps After Setup

1. **Use it daily** - Save URLs as you browse
2. **Customize it** - Change colors, layout, features
3. **Add features** - Tags, search, categories (Phase 2)
4. **Share feedback** - Document what works/doesn't

## Future Enhancements

Planned features:
- Tags and categories
- Search and filter
- Delete saved URLs
- Edit URL metadata
- Weekly summaries
- Export functionality

## Contributing

This is a personal project, but you can:
- Customize for your needs
- Add features you want
- Share improvements
- Fork and extend

## Version

Current version: **1.0.0**

This is the MVP (Minimum Viable Product) with core functionality:
- Save URLs
- View saved URLs
- Click to open

## License

Personal use only. Not licensed for distribution.

## Questions?

- Check README.md for detailed answers
- Review TESTING.md for testing guidance
- Read PROJECT_SUMMARY.md for technical details
- Look at the code - it's well-documented!

## Final Checklist

Before using the extension, verify:

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Backend deployed to AWS
- [ ] API_URL updated in `src/config/index.ts`
- [ ] API_KEY updated in `src/config/index.ts`
- [ ] Icons created and saved to `public/icons/`
- [ ] Extension built (`npm run build`)
- [ ] Extension loaded in Chrome
- [ ] Test save works

If all checked, you're ready to go! 🚀

---

**Enjoy using Recollect!**

Save URLs effortlessly and never lose track of great content again.
