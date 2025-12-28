# User Actions Required

## Extension is Built - But Needs Configuration!

The Recollect Chrome Extension is **100% complete** and ready to use. However, you need to complete **3 simple steps** before loading it in Chrome.

---

## Action 1: Configure API Settings ⚙️

**Status**: ⚠️ REQUIRED

**Location**: `/Users/chuckwilson/Downloads/dev/recollect-test/extension/src/config/index.ts`

**What to do**:

1. Get your API Gateway URL from backend deployment:
   ```bash
   cd /Users/chuckwilson/Downloads/dev/recollect-test/backend
   sam list stack-outputs --stack-name recollect-backend
   ```

   Look for: `ApiUrl = https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod`

2. Open `src/config/index.ts` in a text editor

3. Replace these placeholders:
   ```typescript
   export const API_URL = 'YOUR_API_GATEWAY_URL_HERE';
   export const API_KEY = 'YOUR_API_KEY_HERE';
   ```

4. With your actual values:
   ```typescript
   export const API_URL = 'https://abc123xyz.execute-api.us-east-1.amazonaws.com/Prod';
   export const API_KEY = 'recollect-dev-key-12345';  // Default from backend
   ```

**Time**: 2 minutes

---

## Action 2: Generate Icons 🎨

**Status**: ⚠️ REQUIRED

**What to do**:

**Option A: Use the HTML Generator (Easiest)**
1. Open `generate-icons.html` in your browser:
   ```bash
   open generate-icons.html  # macOS
   # or double-click the file
   ```

2. Right-click each icon and select "Save image as..."

3. Save all three icons to `public/icons/`:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

**Option B: Use Node.js Script**
```bash
node create-placeholder-icons.js
# Then convert SVG to PNG using an online tool
```

**Option C: Design Custom Icons**
- Create your own 16x16, 48x48, and 128x128 PNG icons
- Save to `public/icons/`

**Time**: 3 minutes

---

## Action 3: Build & Load Extension 🚀

**Status**: ⚠️ REQUIRED

**What to do**:

1. **Install dependencies** (one time only):
   ```bash
   cd /Users/chuckwilson/Downloads/dev/recollect-test/extension
   npm install
   ```

2. **Build the extension**:
   ```bash
   npm run build
   ```

3. **Load in Chrome**:
   - Open Chrome
   - Go to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top right)
   - Click **Load unpacked**
   - Select the `dist/` folder
   - Click **Select**

4. **Test it**:
   - Navigate to https://github.com
   - Click the Recollect icon in toolbar
   - Click "Save Current Page"
   - Should see success message!

**Time**: 5 minutes

---

## Verification Script

Before loading in Chrome, verify your setup:

```bash
./verify-setup.sh
```

This checks:
- ✓ Node.js installed
- ✓ Dependencies installed
- ✓ API configured
- ✓ Icons present
- ✓ Extension built

---

## Quick Checklist

- [ ] Backend deployed to AWS Lambda + API Gateway
- [ ] API_URL updated in `src/config/index.ts`
- [ ] API_KEY updated in `src/config/index.ts`
- [ ] Three icons created and saved to `public/icons/`
- [ ] Dependencies installed (`npm install`)
- [ ] Extension built (`npm run build`)
- [ ] Loaded in Chrome and tested

---

## After Setup

Once complete, you can:
- ✅ Save any webpage with one click
- ✅ View all saved URLs in the popup
- ✅ Click URLs to open them
- ✅ Load more to see older URLs

---

## Need Help?

### Quick Start Guides
- **START_HERE.md** - Complete beginner guide
- **QUICKSTART.md** - Fast setup checklist
- **README.md** - Detailed documentation

### Troubleshooting

**"Configuration Required" warning in popup?**
→ Update `src/config/index.ts` and rebuild

**"Failed to save URL" error?**
→ Check backend is deployed and API_URL/API_KEY are correct

**Icons missing in Chrome?**
→ Make sure you created all three icon sizes

**Extension not loading?**
→ Make sure you loaded the `dist/` folder, not root

### Verification
```bash
./verify-setup.sh  # Checks everything
```

---

## Summary

**Total time needed**: ~10 minutes

1. Configure API (2 min)
2. Generate icons (3 min)
3. Build & load (5 min)

**Then you're done!** Start saving URLs effortlessly.

---

**The code is ready. Just configure and enjoy!** 🎉
