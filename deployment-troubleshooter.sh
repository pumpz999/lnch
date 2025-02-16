#!/bin/bash

# Deployment Troubleshooter Script

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Comprehensive Deployment Check
function run_deployment_check() {
    echo -e "${YELLOW}🔍 Running Comprehensive Deployment Check${NC}"

    # Check Node.js
    echo -n "Checking Node.js version: "
    NODE_MAJOR_VERSION=$(node --version | cut -d. -f1 | sed 's/v//')
    if [[ "$NODE_MAJOR_VERSION" -ge 18 ]]; then
        echo -e "${GREEN}✓ Node.js version $NODE_MAJOR_VERSION is compatible${NC}"
    else
        echo -e "${RED}✗ Node.js 18+ required. Current: $(node --version)${NC}"
        exit 1
    fi

    # Check npm
    echo -n "Checking npm: "
    npm --version > /dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ npm installed${NC}"
    else
        echo -e "${RED}✗ npm not found${NC}"
        exit 1
    fi

    # Clean and reinstall dependencies
    echo -e "${YELLOW}🔄 Cleaning and reinstalling dependencies${NC}"
    npm cache clean --force
    rm -rf node_modules
    npm install

    # Ensure Node.js is in module mode
    export NODE_OPTIONS=--experimental-vm-modules

    # Generate Prisma client
    echo -n "Generating Prisma client: "
    npx prisma generate
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Prisma client generated${NC}"
    else
        echo -e "${RED}✗ Prisma client generation failed${NC}"
        exit 1
    fi

    # Run deployment validation script
    echo -e "${YELLOW}🚀 Running deployment validation${NC}"
    node --experimental-vm-modules scripts/deployment-check.js

    echo -e "${GREEN}🎉 Deployment Preparation Complete!${NC}"
}

# Execute deployment check
run_deployment_check
