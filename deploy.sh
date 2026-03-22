#!/bin/bash

# Arcanum Vitae - Zero-Downtime Deployment Script
# Usage: ./deploy.sh [remote-host]
#   If remote-host is provided, deploys via SSH to LXC container
#   If no argument, deploys locally

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="arcanum-vitae"
HEALTH_CHECK_PATH="/api/health"
HEALTH_CHECK_TIMEOUT=30
MAX_RESTART_ATTEMPTS=3

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Health check function
health_check() {
    local port="${1:-3000}"
    local max_attempts=$HEALTH_CHECK_TIMEOUT
    local attempt=1

    log_info "Waiting for application to be healthy..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" "http://localhost:${port}${HEALTH_CHECK_PATH}" | grep -q "200"; then
            log_success "Health check passed (attempt $attempt/$max_attempts)"
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
    done
    
    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Local deployment function
deploy_local() {
    log_info "Starting local deployment..."
    
    # 1. Git pull (if in a git repo)
    if [ -d ".git" ]; then
        log_info "Pulling latest changes..."
        git pull --rebase
    fi
    
    # 2. Install dependencies
    log_info "Installing dependencies..."
    npm install --production
    
    # 3. Build frontend
    log_info "Building frontend..."
    npm run build
    
    # 4. Zero-downtime PM2 restart
    log_info "Restarting application with PM2..."
    
    if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
        # App exists - use reload for zero-downtime
        pm2 reload "$APP_NAME" --update-env
        log_success "Application reloaded"
    else
        # First deployment
        pm2 start ecosystem.config.cjs
        pm2 save
        log_success "Application started"
    fi
    
    # 5. Health check
    sleep 2
    if health_check; then
        log_success "Deployment completed successfully!"
        pm2 status "$APP_NAME"
    else
        log_error "Deployment completed but health check failed!"
        log_info "Check logs with: pm2 logs $APP_NAME"
        exit 1
    fi
}

# Remote deployment function
deploy_remote() {
    local host="$1"
    local user="${2:-root}"
    local remote_path="${3:-/opt/$APP_NAME}"
    
    log_info "Starting remote deployment to $user@$host:$remote_path..."
    
    # Create remote deployment script
    cat << 'REMOTE_SCRIPT' > /tmp/arcanum-deploy-remote.sh
#!/bin/bash
set -e

APP_NAME="arcanum-vitae"
HEALTH_CHECK_PATH="/api/health"
HEALTH_CHECK_TIMEOUT=30

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

health_check() {
    local port="\${1:-3000}"
    local max_attempts=\$HEALTH_CHECK_TIMEOUT
    local attempt=1
    
    log_info "Waiting for application to be healthy..."
    while [ \$attempt -le \$max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" "http://localhost:\${port}\$HEALTH_CHECK_PATH" | grep -q "200"; then
            log_success "Health check passed (attempt \$attempt/\$max_attempts)"
            return 0
        fi
        sleep 1
        attempt=\$((attempt + 1))
    done
    
    log_error "Health check failed after \$max_attempts attempts"
    return 1
}

cd "\$(dirname "\$0")"

# Install dependencies
log_info "Installing dependencies..."
npm install --production

# Build frontend
log_info "Building frontend..."
npm run build

# Zero-downtime restart
log_info "Restarting application..."
if pm2 describe "\$APP_NAME" > /dev/null 2>&1; then
    pm2 reload "\$APP_NAME" --update-env
else
    pm2 start ecosystem.config.cjs
    pm2 save
fi

# Health check
sleep 2
if health_check; then
    log_success "Deployment completed successfully!"
    pm2 status "\$APP_NAME"
else
    log_error "Health check failed!"
    pm2 logs "\$APP_NAME" --lines 50 --nostream
    exit 1
fi
REMOTE_SCRIPT

    chmod +x /tmp/arcanum-deploy-remote.sh
    
    # Copy deployment script to remote
    log_info "Copying deployment script to remote..."
    scp /tmp/arcanum-deploy-remote.sh "$user@$host:/tmp/arcanum-deploy-remote.sh"
    
    # Copy project files (excluding node_modules and dist)
    log_info "Syncing project files to remote..."
    rsync -avz --exclude='node_modules' --exclude='dist' --exclude='.git' \
        -e ssh ./ "$user@$host:$remote_path/"
    
    # Execute remote deployment
    log_info "Executing remote deployment..."
    ssh "$user@$host" "bash /tmp/arcanum-deploy-remote.sh"
    
    # Cleanup
    rm -f /tmp/arcanum-deploy-remote.sh
    
    log_success "Remote deployment completed!"
}

# Main script
main() {
    echo "================================"
    echo "  Arcanum Vitae Deployment"
    echo "================================"
    echo ""
    
    if [ -n "$1" ]; then
        deploy_remote "$1" "${2:-root}" "${3:-/opt/$APP_NAME}"
    else
        deploy_local
    fi
}

main "$@"
