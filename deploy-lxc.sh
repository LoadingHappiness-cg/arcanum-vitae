#!/bin/bash

# Arcanum Vitae - LXC Deployment Script
# Target: Debian/Ubuntu based LXC container

set -e

echo "--- Initializing Arcanum Vitae Deployment ---"

# 1. Update system and install dependencies
echo "[1/6] Updating system and installing base dependencies..."
apt update && apt upgrade -y
apt install -y curl git build-essential

# 2. Install Node.js 20
echo "[2/6] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. Install PM2 globally
echo "[3/6] Installing PM2..."
npm install -g pm2

# 4. Preparing Application
echo "[4/6] Installing application dependencies..."
# Assumes the script is run from the root of the project directory inside LXC
npm install

# 5. Build Frontend
echo "[5/6] Building frontend assets..."
npm run build

# 6. Start Application with PM2
echo "[6/6] Starting application..."
# Set your API Key here or in the environment before running
# export GEMINI_API_KEY="your-api-key-here"

pm2 delete arcanum-vitae || true
pm2 start npx --name "arcanum-vitae" -- tsx server.ts

# Save PM2 state to restart on boot
pm2 save
pm2 startup

echo "--- Deployment Complete ---"
echo "The application is running on port 3000."
echo "Configure HA-Proxy to point to this container's IP on port 3000."
