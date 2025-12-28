# Recollect Extension - Testing Guide

This guide covers how to test the Recollect Chrome extension thoroughly.

## Prerequisites

- Extension built and loaded in Chrome
- Backend API deployed and accessible
- Configuration updated in `src/config/index.ts`

## Quick Verification

Run the setup verification script:

```bash
./verify-setup.sh
```

This checks:
- Node.js and npm installed
- Dependencies installed
- API configuration set
- Icons present
- Extension built

## Manual Testing Checklist

### 1. Installation and Setup

- [ ] Extension loads without errors in `chrome://extensions/`
- [ ] Extension icon appears in Chrome toolbar
- [ ] No console errors when clicking extension icon
- [ ] Popup opens with correct dimensions (400x500px)

### 2. Configuration

#### Test: Missing Configuration
1. Set API_URL to placeholder in `src/config/index.ts`
2. Rebuild: `npm run build`
3. Reload extension
4. Open popup

**Expected**: Yellow warning banner showing "Configuration Required"

#### Test: Valid Configuration
1. Set correct API_URL and API_KEY
2. Rebuild and reload
3. Open popup

**Expected**: No warning banner

### 3. Save Functionality

#### Test: Save Regular Webpage
1. Navigate to https://github.com
2. Click Recollect icon
3. Click "Save Current Page"

**Expected**:
- Button shows "Saving..." with spinner
- Success message appears: "Page saved successfully!"
- Green checkmark badge on extension icon
- Badge clears after 2 seconds
- URL appears in list

#### Test: Save Multiple Pages
1. Visit https://stackoverflow.com and save
2. Visit https://developer.mozilla.org and save
3. Visit https://nodejs.org and save

**Expected**:
- Each save succeeds
- URLs appear in order (most recent first)
- Each URL has title, domain, and timestamp

#### Test: Invalid Pages
1. Navigate to `chrome://extensions/`
2. Try to save

**Expected**:
- Error: "Cannot save browser internal pages"
- Red badge on extension icon

#### Test: Network Error
1. Stop backend API or disconnect internet
2. Try to save a page

**Expected**:
- Error message displayed
- Red badge on extension icon
- Can dismiss error message

### 4. URL List Display

#### Test: Empty State
1. Clear DynamoDB table (delete all URLs)
2. Open popup

**Expected**:
- Bookmark icon
- "No saved URLs yet"
- "Click 'Save Current Page' to get started"

#### Test: Loading State
1. Open popup for first time (no cache)

**Expected**:
- Skeleton loading animation
- 5 skeleton items showing
- Smooth transition to real data

#### Test: URL Display
For each URL in the list, verify:
- [ ] Title is displayed correctly
- [ ] Domain is extracted and shown (without www.)
- [ ] Timestamp shows relative time ("2 hours ago")
- [ ] Favicon displays (if available)
- [ ] Hover effect works

#### Test: Click URL
1. Click any URL in the list

**Expected**:
- Opens in new tab
- Correct URL loaded
- Popup remains open (doesn't close)

### 5. Pagination

#### Test: Load More
1. Save 25+ URLs
2. Open popup (shows first 20)
3. Scroll to bottom
4. Click "Load More"

**Expected**:
- Button shows "Loading..." with spinner
- Next 20 URLs appear
- No duplicates
- If more exist, "Load More" still visible
- If no more, button disappears

#### Test: Last Page
1. Click "Load More" until end

**Expected**:
- Button disappears when no more URLs
- No error messages

### 6. Caching

#### Test: Cache Working
1. Open popup (loads from API)
2. Close popup
3. Immediately reopen popup

**Expected**:
- URLs appear instantly (from cache)
- Fresh data loads in background
- No flickering

#### Test: Cache Expiration
1. Open popup
2. Wait 6 minutes (cache expires after 5 min)
3. Reopen popup

**Expected**:
- Loading state shown
- Fresh data fetched from API

### 7. Error Handling

#### Test: API Error
1. Set invalid API_KEY in config
2. Try to save URL

**Expected**:
- Clear error message
- Dismissible error banner
- Red badge

#### Test: Network Timeout
1. Disconnect internet
2. Try to fetch URLs

**Expected**:
- Error state shown
- "Try Again" button appears
- Clicking retry fetches data

#### Test: Error Dismissal
1. Trigger any error
2. Click X to dismiss

**Expected**:
- Error banner disappears
- Can continue using extension

### 8. Visual and UX

#### Test: Responsive Design
- [ ] Popup is 400px wide
- [ ] Maximum height ~600px
- [ ] Scrollbar appears when needed
- [ ] All elements properly aligned

#### Test: Loading States
- [ ] Save button shows spinner while saving
- [ ] Skeleton screens while loading list
- [ ] Load More button shows spinner
- [ ] All transitions smooth

#### Test: Hover States
- [ ] Save button has hover effect
- [ ] URL items highlight on hover
- [ ] Load More button has hover effect
- [ ] Dismiss buttons change on hover

#### Test: Typography
- [ ] All text is readable
- [ ] Font sizes appropriate
- [ ] Colors have good contrast
- [ ] No text overflow/truncation issues

### 9. Background Service Worker

#### Test: Badge Notifications
1. Save a URL

**Expected**:
- Green badge with ✓ appears
- Clears after 2 seconds

2. Trigger error

**Expected**:
- Red badge with ! appears
- Clears after 3 seconds

#### Test: Service Worker Logging
1. Open `chrome://extensions/`
2. Click "Inspect views: service worker"
3. Save a URL

**Expected**:
- No errors in console
- "Recollect extension installed" on first load

### 10. Edge Cases

#### Test: Very Long Title
1. Save page with 200+ character title

**Expected**:
- Title truncated with ellipsis
- No layout breaking

#### Test: URL Without Favicon
1. Save page with no favicon

**Expected**:
- URL displays without icon
- No broken image icon
- Layout not affected

#### Test: Special Characters in URL
1. Save URL with query params, anchors, special chars

**Expected**:
- URL saved correctly
- Displays properly in list
- Opens correctly when clicked

#### Test: Rapid Clicking
1. Click Save button multiple times rapidly

**Expected**:
- Button disabled while saving
- Only one request sent
- No duplicate saves

### 11. Performance

#### Test: Large Number of URLs
1. Save 100+ URLs
2. Open popup

**Expected**:
- Loads in < 1 second
- Pagination works correctly
- Scrolling is smooth
- No memory leaks

#### Test: Popup Load Time
Measure time from click to fully loaded:

**Expected**: < 500ms

#### Test: Save Operation Time
Measure time from click to success message:

**Expected**: < 2 seconds (depends on API)

### 12. Cross-Browser Testing

#### Chrome
- [ ] Version 88+
- [ ] All features work
- [ ] No console errors

#### Edge (Chromium)
- [ ] Version 88+
- [ ] All features work
- [ ] Compatible with Chrome extension

#### Other Chromium Browsers
Test on Brave, Vivaldi, etc.:
- [ ] Extension loads
- [ ] Core features work

### 13. Security Testing

#### Test: API Key Protection
1. Open browser DevTools
2. Go to Network tab
3. Save a URL

**Verify**:
- API key sent only to configured API_URL
- HTTPS used for all requests
- No key exposed in page context

#### Test: CORS
1. Save URL
2. Check Network tab

**Verify**:
- Preflight (OPTIONS) request succeeds
- POST request has correct CORS headers
- No CORS errors

### 14. Regression Testing

After any code change, verify:
- [ ] Save still works
- [ ] List displays correctly
- [ ] Pagination works
- [ ] Caching works
- [ ] Error handling works
- [ ] Badge notifications work

## Automated Testing

While this project doesn't include automated tests, here's what you could test:

### Unit Tests (Future)
- API client methods
- Time formatting functions
- URL parsing/domain extraction
- Configuration validation

### Integration Tests (Future)
- Save flow end-to-end
- List fetch and display
- Pagination logic
- Cache management

### E2E Tests (Future)
Using Playwright or Puppeteer:
- Complete user workflows
- Multi-page scenarios
- Error recovery

## Testing Tools

### Chrome DevTools

**Console**:
- Check for errors
- View log messages
- Debug issues

**Network Tab**:
- Monitor API calls
- Check request/response
- Verify headers

**Application Tab**:
- Inspect chrome.storage
- View cached data
- Clear storage

**Performance Tab**:
- Measure load times
- Check for memory leaks
- Profile rendering

### Testing with curl

Test backend API directly:

```bash
# Save URL
curl -X POST "YOUR_API_URL/api/urls" \
  -H "X-API-Key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://test.com","title":"Test"}'

# Get URLs
curl "YOUR_API_URL/api/urls?limit=5" \
  -H "X-API-Key: YOUR_KEY"
```

### Chrome Storage Inspector

1. Open `chrome://extensions/`
2. Click extension details
3. Under "Inspect views", click "service worker"
4. In console, run:
```javascript
chrome.storage.local.get(null, console.log)
```

## Common Issues and Solutions

### Issue: URLs not loading
**Check**:
1. Backend API is running
2. API_URL is correct
3. API_KEY is valid
4. Network connectivity

### Issue: Save not working
**Check**:
1. Current page URL is valid (not chrome://)
2. Backend API accessible
3. API returns 201
4. Check browser console for errors

### Issue: Cache not working
**Check**:
1. chrome.storage permission granted
2. Storage not full
3. Cache key correct
4. Check Application tab in DevTools

### Issue: Badge not showing
**Check**:
1. Background service worker loaded
2. Message passing working
3. Check service worker console

## Test Data

For consistent testing, use these URLs:

1. https://github.com - "GitHub: Let's build from here"
2. https://stackoverflow.com - "Stack Overflow - Where Developers Learn, Share, & Build Careers"
3. https://developer.mozilla.org - "MDN Web Docs"
4. https://nodejs.org - "Node.js"
5. https://www.typescriptlang.org - "TypeScript: JavaScript With Syntax For Types"

## Test Reports

After testing, document:
- Browser version tested
- Date tested
- Tests passed/failed
- Issues found
- Steps to reproduce issues

## Performance Benchmarks

Target metrics:
- Popup load: < 500ms
- Save operation: < 2s
- Cache load: < 100ms
- List scroll: 60fps
- Memory usage: < 50MB

## Acceptance Criteria

Extension is ready when:
- ✓ All manual tests pass
- ✓ No console errors
- ✓ Performance targets met
- ✓ Error handling works
- ✓ Documentation complete
- ✓ Setup verified

## Next Steps After Testing

1. Fix any issues found
2. Re-test affected areas
3. Update documentation if needed
4. Consider automated tests
5. Plan next features
