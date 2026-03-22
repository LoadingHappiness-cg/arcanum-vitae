#!/bin/bash

# Arcanum Vitae - LXC Initial Setup Script
# Run this ONCE on a fresh LXC container to set up the environment
# After initial setup, use ./deploy.sh for regular deployments

set -e

echo "================================"
echo "  Arcanum Vitae - Initial Setup"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (sudo ./deploy-lxc.sh)"
    exit 1
fi

# 1. Update system
log_info "[1/5] Updating system packages..."
apt update && apt upgrade -y

# 2. Install dependencies
log_info "[2/5] Installing base dependencies..."
apt install -y curl git build-essential rsync

# 3. Install Node.js 20
log_info "[3/5] Installing Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
else
    log_info "Node.js already installed: $(node --version)"
fi

# 4. Install PM2 globally
log_info "[4/5] Installing PM2..."
npm install -g pm2

# 5. Create app directory and set up structure
APP_DIR="/opt/arcanum-vitae"
log_info "[5/5] Setting up application directory at $APP_DIR..."

mkdir -p "$APP_DIR"
mkdir -p "$APP_DIR/logs"
mkdir -p "$APP_DIR/public/media/audio"
mkdir -p "$APP_DIR/public/media/images"

# Create .gitkeep files
touch "$APP_DIR/logs/.gitkeep"
touch "$APP_DIR/public/media/audio/.gitkeep"
touch "$APP_DIR/public/media/images/.gitkeep"

# Set ownership
chown -R $SUDO_USER:$SUDO_USER "$APP_DIR" 2>/dev/null || chown -R root:root "$APP_DIR"

echo ""
echo "================================"
log_success "Initial setup complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Copy your project files to: $APP_DIR"
echo "2. Or run: ./deploy.sh $APP_DIR"
echo "3. Or deploy remotely: ./deploy.sh <host> root $APP_DIR"
echo ""
echo "Don't forget to set your .env file with:"
echo "  - GEMINI_API_KEY"
echo "  - ADMIN_KEY"
echo ""
