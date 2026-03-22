# Deployment Guide

## Quick Deploy (Local)

```bash
# Option 1: Using npm script
npm run deploy

# Option 2: Direct script
./deploy.sh
```

## Remote Deploy (LXC Container)

```bash
# Deploy to remote server via SSH
npm run deploy:remote <host> [user] [path]

# Examples:
./deploy.sh 192.168.1.100
./deploy.sh root@arcanum-vitae.local /opt/arcanum-vitae
```

## Manual PM2 Commands

```bash
# View logs
npm run pm2:logs

# Check status
npm run pm2:status

# Restart (zero-downtime)
npm run pm2:restart

# Stop
npm run pm2:stop

# Delete from PM2
npm run pm2:delete
```

## What the Deploy Script Does

1. **Git Pull** - Fetches latest changes (if in a git repo)
2. **Install Dependencies** - Production-only npm install
3. **Build** - Runs `npm run build` (SEO + Vite)
4. **Zero-Downtime Restart** - Uses `pm2 reload` instead of restart
5. **Health Check** - Verifies `/api/health` responds within 30s
6. **Rollback Alert** - Notifies if health check fails

## PM2 Configuration

The app is configured with:
- **Max Memory**: 512MB (auto-restart if exceeded)
- **Min Uptime**: 10s (prevents crash loops)
- **Max Restarts**: 10 (with 4s delay between)
- **Logs**: `./logs/pm2-*.log` with timestamps

## First-Time Setup (LXC)

Run the full setup script on a fresh container:

```bash
# SSH into your LXC container
ssh root@your-container

# Run the full deployment setup
bash deploy-lxc.sh
```

This installs:
- Node.js 20
- PM2 globally
- System dependencies
- Builds and starts the app

## Environment Variables

Set these in your `.env` file or PM2 environment:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `GEMINI_API_KEY` | Google AI API key | - |
| `ADMIN_KEY` | Admin dashboard passkey | - |
| `CORS_ORIGINS` | Comma-separated allowed origins | localhost only |
| `UMAMI_PROXY_BASE` | Umami backend URL (optional) | Uses cloud.umami.is |

## Troubleshooting

### App won't start
```bash
# Check PM2 logs
pm2 logs arcanum-vitae --lines 100

# Check if port is in use
lsof -i :3000

# Restart fresh
pm2 delete arcanum-vitae
npm run deploy
```

### Health check fails
```bash
# Test health endpoint manually
curl http://localhost:3000/api/health

# Check server is running
pm2 status arcanum-vitae

# View real-time logs
pm2 logs arcanum-vitae
```

### Memory issues
```bash
# Monitor memory usage
pm2 monit

# Adjust max_memory_restart in ecosystem.config.cjs
```

## Rollback Strategy

If a deployment fails:

1. **PM2 auto-recovers** - If app crashes, PM2 restarts it
2. **Check previous version** - PM2 keeps previous code in memory during reload
3. **Manual rollback**:
   ```bash
   git revert HEAD
   npm run deploy
   ```
