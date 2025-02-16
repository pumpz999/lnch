#!/bin/bash

# Production Deployment Script

# Exit on any error
set -e

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Pre-deployment checks
echo -e "${GREEN}🚀 Starting Production Deployment${NC}"

# Check Node.js version
NODE_VERSION=$(node --version)
echo -e "Node.js Version: ${GREEN}$NODE_VERSION${NC}"

# Install dependencies
echo -e "${GREEN}📦 Installing dependencies${NC}"
pnpm install

# Generate Prisma client
echo -e "${GREEN}🔧 Generating Prisma client${NC}"
pnpm prisma generate

# Run database migrations
echo -e "${GREEN}💾 Running database migrations${NC}"
pnpm prisma migrate deploy

# Build application
echo -e "${GREEN}🏗️ Building application${NC}"
pnpm build

# Start production server
echo -e "${GREEN}🌐 Starting production server${NC}"
pnpm start
