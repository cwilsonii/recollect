#!/bin/bash

# Deployment script for Recollect backend
# Builds and deploys the application to AWS

set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Get the backend directory (parent of scripts directory)
BACKEND_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

# Change to the backend directory
cd "$BACKEND_DIR"

echo "Working directory: $BACKEND_DIR"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "================================"
echo "Recollect Backend Deployment"
echo "================================"
echo ""

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

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not configured${NC}"
    echo "Run 'aws configure' to set up your AWS credentials"
    exit 1
fi

echo -e "${GREEN}AWS credentials verified${NC}"
echo "Account: $(aws sts get-caller-identity --query Account --output text)"
echo "Region: $(aws configure get region)"
echo ""

# Ask for confirmation
read -p "Do you want to proceed with deployment? (y/n): " confirm
if [[ $confirm != [yY] ]]; then
    echo "Deployment cancelled"
    exit 0
fi

echo ""
echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
npm install

echo ""
echo -e "${YELLOW}Step 2: Building TypeScript...${NC}"
npm run build

echo ""
echo -e "${YELLOW}Step 3: Building SAM application...${NC}"
sam build

echo ""
echo -e "${YELLOW}Step 4: Deploying to AWS...${NC}"
echo ""

# Check if samconfig.toml exists
if [ -f samconfig.toml ]; then
    echo "Using existing configuration from samconfig.toml"
    sam deploy
else
    echo "First time deployment - running guided deployment"
    echo "You will be prompted for configuration options"
    echo ""
    sam deploy --guided
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Get stack name from samconfig.toml
STACK_NAME=$(grep "stack_name" samconfig.toml | cut -d'"' -f2 2>/dev/null || echo "sam-app")

echo "Getting stack outputs for: $STACK_NAME"
echo ""

# Get and display outputs
if aws cloudformation describe-stacks --stack-name "$STACK_NAME" &> /dev/null; then
    aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query 'Stacks[0].Outputs' --output table

    echo ""
    echo -e "${GREEN}Your API is ready!${NC}"
    echo ""

    # Extract the API URL
    API_URL=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' --output text)

    echo -e "${YELLOW}Important Information:${NC}"
    echo "API URL: $API_URL"
    echo "API Key: recollect-dev-key-12345"
    echo ""
else
    echo -e "${RED}Could not find stack: $STACK_NAME${NC}"
    echo "Try running: sam list stack-outputs"
fi

echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update your Chrome extension configuration:"
echo "   Edit: extension/src/config/index.ts"
echo "   Set API_URL to: $API_URL"
echo "   Set API_KEY to: recollect-dev-key-12345"
echo ""
echo "2. Test your API:"
echo "   curl $API_URL/api/urls -H \"X-API-Key: recollect-dev-key-12345\""
echo ""
