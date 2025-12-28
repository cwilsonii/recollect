#!/bin/bash

# Local testing script for Recollect backend
# This script helps test Lambda functions locally using SAM CLI

set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Get the backend directory (parent of scripts directory)
BACKEND_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

# Change to the backend directory
cd "$BACKEND_DIR"

echo "Working directory: $BACKEND_DIR"
echo ""

echo "================================"
echo "Recollect Backend Local Testing"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if template.yaml exists
if [ ! -f "template.yaml" ]; then
    echo -e "${RED}Error: template.yaml not found in $BACKEND_DIR${NC}"
    echo "Make sure you're running this script from the correct location"
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo -e "${RED}Error: AWS SAM CLI is not installed${NC}"
    echo "Install it from: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
npm install

echo ""
echo -e "${YELLOW}Step 2: Building TypeScript...${NC}"
npm run build

echo ""
echo -e "${YELLOW}Step 3: Building SAM application...${NC}"
sam build

echo ""
echo -e "${GREEN}Build complete!${NC}"
echo ""

# Menu for testing options
while true; do
    echo "================================"
    echo "Select a test option:"
    echo "================================"
    echo "1) Test SaveUrl function (valid request)"
    echo "2) Test SaveUrl function (minimal request)"
    echo "3) Test SaveUrl function (invalid API key)"
    echo "4) Test GetUrls function"
    echo "5) Test GetUrls function (with pagination)"
    echo "6) Start local API server"
    echo "7) Exit"
    echo ""
    read -p "Enter option (1-7): " option

    case $option in
        1)
            echo ""
            echo -e "${YELLOW}Testing SaveUrl with valid request...${NC}"
            sam local invoke SaveUrlFunction -e events/save-url.json
            ;;
        2)
            echo ""
            echo -e "${YELLOW}Testing SaveUrl with minimal request...${NC}"
            sam local invoke SaveUrlFunction -e events/save-url-minimal.json
            ;;
        3)
            echo ""
            echo -e "${YELLOW}Testing SaveUrl with invalid API key...${NC}"
            sam local invoke SaveUrlFunction -e events/save-url-invalid-api-key.json
            ;;
        4)
            echo ""
            echo -e "${YELLOW}Testing GetUrls...${NC}"
            sam local invoke GetUrlsFunction -e events/get-urls.json
            ;;
        5)
            echo ""
            echo -e "${YELLOW}Testing GetUrls with pagination...${NC}"
            sam local invoke GetUrlsFunction -e events/get-urls-with-pagination.json
            ;;
        6)
            echo ""
            echo -e "${YELLOW}Starting local API server...${NC}"
            echo "API will be available at: http://localhost:3000"
            echo "Press Ctrl+C to stop"
            echo ""
            sam local start-api
            ;;
        7)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please try again.${NC}"
            ;;
    esac

    echo ""
done
