# Recollect Extension - File Structure

Complete documentation of all files in the extension project.

## Root Directory

```
extension/
├── manifest.json              # Chrome extension manifest (Manifest V3)
├── package.json               # NPM dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tsconfig.node.json         # TypeScript config for Vite
├── vite.config.ts             # Vite build configuration
├── .gitignore                 # Git ignore rules
├── .eslintrc.json            # ESLint configuration
├── README.md                  # Main documentation
├── QUICKSTART.md              # Quick setup guide
├── TESTING.md                 # Testing guide
├── PROJECT_SUMMARY.md         # Project overview
├── FILE_STRUCTURE.md          # This file
├── generate-icons.html        # Icon generation tool
├── verify-setup.sh           # Setup verification script
├── public/                    # Static assets
├── src/                       # Source code
├── node_modules/              # Dependencies (generated)
└── dist/                      # Built extension (generated)
```

## Configuration Files

### manifest.json
**Purpose**: Chrome extension manifest (Manifest V3)

**Contents**:
- Extension metadata (name, version, description)
- Permissions (activeTab, storage, host_permissions)
- Action (popup, icons)
- Background service worker
- Icons

**Key settings**:
```json
{
  "manifest_version": 3,
  "name": "Recollect",
  "version": "1.0.0",
  "permissions": ["activeTab", "storage"],
  "action": {
    "default_popup": "src/popup/index.html"
  },
  "background": {
    "service_worker": "background.js"
  }
}
```

### package.json
**Purpose**: NPM project configuration

**Scripts**:
- `dev`: Watch mode for development
- `build`: Production build
- `preview`: Preview build
- `lint`: Check code quality
- `lint:fix`: Auto-fix linting issues

**Dependencies**:
- react: ^18.2.0
- react-dom: ^18.2.0

**Dev Dependencies**:
- typescript
- vite
- @vitejs/plugin-react
- @types/chrome
- @types/react
- @types/react-dom
- eslint and plugins

### tsconfig.json
**Purpose**: TypeScript compiler configuration

**Key settings**:
- Target: ES2020
- Module: ESNext
- Strict mode: enabled
- JSX: react-jsx
- Includes chrome types

### tsconfig.node.json
**Purpose**: TypeScript config for Vite config file

**Settings**:
- Module: ESNext
- Allows synthetic default imports

### vite.config.ts
**Purpose**: Vite build configuration

**Features**:
- React plugin
- Multiple entry points (popup, background)
- Custom build output structure
- Copies manifest.json to dist
- Copies icons to dist
- Source maps in development

### .eslintrc.json
**Purpose**: ESLint code quality configuration

**Rules**:
- React recommended
- TypeScript recommended
- React hooks rules
- Custom overrides

### .gitignore
**Purpose**: Git ignore patterns

**Ignores**:
- node_modules/
- dist/
- .env files
- Editor files
- OS files
- Logs

## Source Code (src/)

```
src/
├── popup/                     # Popup UI
│   ├── App.tsx               # Main app component
│   ├── index.tsx             # React entry point
│   ├── index.html            # Popup HTML
│   └── styles.css            # All styles
├── background/
│   └── service-worker.ts     # Background service worker
├── api/
│   └── client.ts             # API client
├── config/
│   └── index.ts              # Configuration
├── types/
│   └── index.ts              # TypeScript types
└── components/               # React components
    ├── SaveButton.tsx
    ├── UrlList.tsx
    ├── UrlItem.tsx
    └── ErrorMessage.tsx
```

### src/popup/

#### index.html (152 bytes)
**Purpose**: HTML shell for React app

**Contents**:
- DOCTYPE and html tags
- Root div for React
- Script tag for index.tsx

#### index.tsx (315 bytes)
**Purpose**: React application entry point

**Contents**:
- Imports React, ReactDOM
- Imports App component
- Imports styles.css
- Renders App in strict mode

#### App.tsx (3.8 KB)
**Purpose**: Main application component

**State**:
- error: string | null
- successMessage: string | null
- refreshTrigger: number

**Features**:
- Configuration warning banner
- Success/error message display
- SaveButton integration
- UrlList integration
- Message auto-dismiss

#### styles.css (7.5 KB)
**Purpose**: All application styles

**Sections**:
- Reset and base styles
- Layout (app, header, main)
- Configuration warning
- Success/error messages
- Save button and section
- URL list and items
- Loading states (skeleton, spinner)
- Empty states
- Responsive design
- Animations

**Design system**:
- Colors: Purple gradient primary, semantic colors
- Typography: System fonts, responsive sizes
- Spacing: 8px base unit
- Components: Rounded corners, shadows, transitions

### src/background/

#### service-worker.ts (1.3 KB)
**Purpose**: Background service worker for Chrome extension

**Features**:
- Installation listener
- Message passing (urlSaved, urlSaveFailed)
- Badge management (✓ green, ! red)
- Auto-clear badges after 2-3 seconds
- Error logging

**Messages handled**:
- `urlSaved`: Show green badge
- `urlSaveFailed`: Show red badge

### src/api/

#### client.ts (2.5 KB)
**Purpose**: API client for backend communication

**Class**: ApiClient

**Methods**:
- `isConfigured()`: Check if API_URL and API_KEY are set
- `saveUrl(url, title, faviconUrl?)`: POST /api/urls
- `getUrls(limit?, lastKey?)`: GET /api/urls

**Features**:
- Configuration validation
- Proper headers (X-API-Key, Content-Type)
- Error handling with typed errors
- Query parameter building
- Singleton instance export

### src/config/

#### index.ts (1.2 KB)
**Purpose**: Application configuration

**Exports**:
- `API_URL`: Backend API Gateway URL (placeholder)
- `API_KEY`: API authentication key (placeholder)
- `STORAGE_KEYS`: Chrome storage key constants
- `UI_CONFIG`: UI settings (page size, cache duration)

**Important**: Users must update API_URL and API_KEY after backend deployment

### src/types/

#### index.ts (615 bytes)
**Purpose**: TypeScript type definitions

**Types**:
- `SavedUrl`: URL object from backend
- `SaveUrlRequest`: Request body for saving
- `SaveUrlResponse`: Response from save endpoint
- `GetUrlsResponse`: Response from get endpoint
- `ApiError`: Error response structure

**Usage**: Imported throughout app for type safety

### src/components/

#### SaveButton.tsx (2.1 KB)
**Purpose**: Button to save current page

**Props**:
- `onSave`: Callback for successful save
- `onError`: Callback for errors

**State**:
- `isSaving`: Loading state

**Features**:
- Gets current tab info (chrome.tabs API)
- Validates URL (no chrome:// pages)
- Calls API to save
- Loading state with spinner
- Success/error callbacks
- Sends message to service worker

#### UrlList.tsx (4.8 KB)
**Purpose**: Display list of saved URLs

**Props**:
- `refreshTrigger`: Number to trigger reload

**State**:
- `urls`: Array of saved URLs
- `isLoading`: Initial loading state
- `error`: Error message
- `hasMore`: More pages available
- `lastKey`: Pagination key
- `isLoadingMore`: Loading more state

**Features**:
- Fetch URLs from API
- Cache management (chrome.storage)
- Pagination ("Load More")
- Loading skeleton
- Empty state
- Error state with retry
- Auto-refresh on mount and trigger change

#### UrlItem.tsx (2.2 KB)
**Purpose**: Display single URL item

**Props**:
- `url`: SavedUrl object

**Features**:
- Displays title, domain, timestamp
- Shows favicon (with fallback)
- Relative time formatting
- Domain extraction (removes www.)
- Opens in new tab on click (chrome.tabs)
- Hover effects

**Time formatting**:
- "just now"
- "X minutes ago"
- "X hours ago"
- "yesterday"
- "X days ago"
- "X weeks ago"
- "X months ago"

#### ErrorMessage.tsx (810 bytes)
**Purpose**: Display error messages

**Props**:
- `message`: Error message text
- `onDismiss?`: Optional dismiss callback

**Features**:
- Red error styling
- Error icon (SVG)
- Dismiss button (X)
- Semantic error display

## Public Assets (public/)

```
public/
└── icons/
    ├── icon16.png    # 16x16 toolbar icon
    ├── icon48.png    # 48x48 extension management
    └── icon128.png   # 128x128 Chrome Web Store
```

**Note**: Icons must be generated using `generate-icons.html` or custom designs.

## Build Output (dist/)

```
dist/                          # Generated by 'npm run build'
├── manifest.json              # Copied from root
├── background.js              # Compiled service worker
├── icons/                     # Copied from public/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── src/
│   └── popup/
│       └── index.html         # Popup HTML
└── assets/                    # Bundled JS/CSS
    ├── index-[hash].js       # Main app bundle
    └── index-[hash].css      # Styles bundle
```

**Important**: Load the `dist/` folder in Chrome, not the root folder.

## Documentation Files

### README.md (8.1 KB)
**Purpose**: Main documentation

**Sections**:
- Features overview
- Prerequisites
- Setup instructions
- Development workflow
- Usage guide
- Troubleshooting
- Icons guide
- API documentation
- Technology stack
- Scripts reference

### QUICKSTART.md (2.4 KB)
**Purpose**: Fast setup guide

**Contents**:
- 6-step quick start
- Troubleshooting quick fixes
- Common issues solutions
- Next steps

### TESTING.md (8.9 KB)
**Purpose**: Comprehensive testing guide

**Contents**:
- Manual testing checklist
- Test scenarios for all features
- Edge cases
- Performance testing
- Browser compatibility
- Security testing
- Testing tools guide

### PROJECT_SUMMARY.md (10.5 KB)
**Purpose**: Technical project overview

**Contents**:
- Architecture overview
- Technology stack details
- Component documentation
- API integration
- Chrome APIs used
- Styling design system
- Build configuration
- Development workflow
- Security considerations
- Performance optimizations

### FILE_STRUCTURE.md (This file)
**Purpose**: Complete file documentation

**Contents**:
- Directory structure
- File purposes and contents
- Code organization
- Build output structure

## Utility Files

### generate-icons.html (4.2 KB)
**Purpose**: Generate placeholder icons

**Features**:
- HTML/JavaScript tool
- Creates 16x16, 48x48, 128x128 icons
- Canvas-based drawing
- Download buttons
- Purple gradient with bookmark icon
- Instructions for use

### verify-setup.sh (3.1 KB)
**Purpose**: Verify extension setup

**Checks**:
- Node.js and npm installed
- Dependencies installed
- API configuration set
- Icons present
- Extension built

**Output**: Color-coded status report

## File Size Summary

**Source code**: ~25 KB
- TypeScript/TSX: ~18 KB
- CSS: ~7 KB

**Documentation**: ~35 KB
- README: 8 KB
- TESTING: 9 KB
- PROJECT_SUMMARY: 11 KB
- Others: 7 KB

**Configuration**: ~5 KB
- JSON configs: 3 KB
- TypeScript configs: 2 KB

**Built extension**: ~500 KB
- React + ReactDOM: ~400 KB
- App code: ~50 KB (after minification)
- Icons: ~30 KB
- Manifest: 1 KB

## Code Organization Principles

### Separation of Concerns
- UI components in `components/`
- Business logic in `api/`
- Configuration in `config/`
- Types in `types/`
- Background tasks in `background/`

### Single Responsibility
- Each component has one job
- API client handles only API calls
- Service worker handles only background tasks

### Reusability
- Components are modular
- Types shared across project
- Config centralized

### Type Safety
- All files use TypeScript
- Strict mode enabled
- Proper interfaces defined

### Maintainability
- Clear file structure
- Consistent naming
- Comprehensive documentation
- Comments where needed

## Import Dependencies

### Component Dependencies

**App.tsx imports**:
- React
- SaveButton
- UrlList
- ErrorMessage
- apiClient

**SaveButton.tsx imports**:
- React, useState
- apiClient
- chrome.tabs, chrome.runtime

**UrlList.tsx imports**:
- React, useEffect, useState
- apiClient
- UrlItem
- config (UI_CONFIG, STORAGE_KEYS)
- types (SavedUrl)
- chrome.storage

**UrlItem.tsx imports**:
- React
- types (SavedUrl)
- chrome.tabs

**ErrorMessage.tsx imports**:
- React

### Build Dependencies

**Vite** bundles:
- React and ReactDOM
- All components
- API client
- Styles

**TypeScript** compiles:
- All .ts and .tsx files
- Type checking
- Generates .d.ts files

## Adding New Files

### Adding a Component
1. Create file in `src/components/`
2. Define props interface
3. Implement component
4. Export component
5. Import in parent component
6. Update this documentation

### Adding Configuration
1. Add to `src/config/index.ts`
2. Export constant
3. Import where needed
4. Document in README

### Adding Types
1. Add to `src/types/index.ts`
2. Export interface/type
3. Use throughout app
4. Document structure

## Version Control

### Tracked Files
- All source code
- Configuration files
- Documentation
- package.json
- Utility scripts

### Ignored Files
- node_modules/
- dist/
- .env files
- Editor configs
- OS files

## Build Process Flow

```
Source Files
    ↓
TypeScript Compilation
    ↓
Vite Bundling
    ↓
Asset Copying (manifest, icons)
    ↓
Output to dist/
    ↓
Ready for Chrome
```

## File Modification Guidelines

### When to Rebuild
- Any change to src/
- manifest.json changes
- Icon updates
- Config changes

### When to Reload Extension
- After rebuild
- manifest.json changes
- Background script changes

### When to Refresh Popup
- Component changes (after rebuild)
- Style changes (after rebuild)

## Maintenance

### Regular Updates
- Dependencies (monthly)
- TypeScript version
- React version
- Chrome types

### File Cleanup
- Remove unused imports
- Delete commented code
- Update stale documentation
- Clean dist/ before build

## Summary

Total files (excluding node_modules, dist):
- **TypeScript/TSX**: 11 files
- **Configuration**: 6 files
- **Documentation**: 6 files
- **Utilities**: 2 files
- **HTML**: 2 files
- **Total**: ~27 files

The project is well-organized with clear separation of concerns, comprehensive documentation, and production-ready code.
