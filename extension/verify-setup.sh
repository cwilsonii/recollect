#!/bin/bash

# Recollect Extension - Setup Verification Script
# This script checks if your extension is properly configured

echo "🔍 Recollect Extension - Setup Verification"
echo "==========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the extension directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found${NC}"
    echo "Please run this script from the extension directory"
    exit 1
fi

# Check Node.js
echo -e "${BLUE}Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Please install Node.js 18 or later from https://nodejs.org"
    exit 1
fi

# Check npm
echo -e "${BLUE}Checking npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi

# Check if node_modules exists
echo ""
echo -e "${BLUE}Checking dependencies...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Dependencies not installed${NC}"
    echo "Run: npm install"
fi

# Check configuration
echo ""
echo -e "${BLUE}Checking API configuration...${NC}"
if [ -f "src/config/index.ts" ]; then
    if grep -q "YOUR_API_GATEWAY_URL_HERE" src/config/index.ts; then
        echo -e "${YELLOW}⚠ API_URL not configured${NC}"
        echo "Update API_URL in src/config/index.ts"
        CONFIG_OK=false
    else
        echo -e "${GREEN}✓ API_URL configured${NC}"
        CONFIG_OK=true
    fi

    if grep -q "YOUR_API_KEY_HERE" src/config/index.ts; then
        echo -e "${YELLOW}⚠ API_KEY not configured${NC}"
        echo "Update API_KEY in src/config/index.ts"
        CONFIG_OK=false
    else
        echo -e "${GREEN}✓ API_KEY configured${NC}"
    fi
else
    echo -e "${RED}❌ config/index.ts not found${NC}"
    CONFIG_OK=false
fi

# Check icons
echo ""
echo -e "${BLUE}Checking icons...${NC}"
ICONS_OK=true
for size in 16 48 128; do
    if [ -f "public/icons/icon${size}.png" ]; then
        echo -e "${GREEN}✓ icon${size}.png exists${NC}"
    else
        echo -e "${YELLOW}⚠ icon${size}.png missing${NC}"
        ICONS_OK=false
    fi
done

if [ "$ICONS_OK" = false ]; then
    echo "Generate icons: open generate-icons.html"
fi

# Check if built
echo ""
echo -e "${BLUE}Checking build...${NC}"
if [ -d "dist" ]; then
    if [ -f "dist/manifest.json" ]; then
        echo -e "${GREEN}✓ Extension built (dist/ exists)${NC}"
    else
        echo -e "${YELLOW}⚠ dist/ exists but incomplete${NC}"
        echo "Run: npm run build"
    fi
else
    echo -e "${YELLOW}⚠ Extension not built${NC}"
    echo "Run: npm run build"
fi

# Summary
echo ""
echo "==========================================="
echo -e "${BLUE}Summary${NC}"
echo "==========================================="

if [ "$CONFIG_OK" = true ] && [ "$ICONS_OK" = true ] && [ -d "dist" ]; then
    echo -e "${GREEN}✓ Extension is ready to load in Chrome!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Open Chrome → chrome://extensions/"
    echo "2. Enable 'Developer mode'"
    echo "3. Click 'Load unpacked'"
    echo "4. Select the 'dist' folder"
else
    echo -e "${YELLOW}⚠ Setup incomplete${NC}"
    echo ""
    echo "To complete setup:"
    if [ "$CONFIG_OK" != true ]; then
        echo "1. Update src/config/index.ts with API_URL and API_KEY"
    fi
    if [ "$ICONS_OK" != true ]; then
        echo "2. Generate icons using generate-icons.html"
    fi
    if [ ! -d "node_modules" ]; then
        echo "3. Install dependencies: npm install"
    fi
    if [ ! -d "dist" ]; then
        echo "4. Build extension: npm run build"
    fi
fi

echo ""
