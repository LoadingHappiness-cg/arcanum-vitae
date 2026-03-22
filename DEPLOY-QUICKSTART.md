# Deployment Quick Reference

## Your Current Workflow (Improved)

```bash
# Old way:
git pull && npm run build && pm2 start

# New way (zero-downtime + health checks):
npm run deploy
```

## Deployment Commands

| Command | Description |
|---------|-------------|
| `npm run deploy` | Local deployment with health check |
| `./deploy.sh` | Same as above (direct script) |
| `./deploy.sh <host>` | Remote deploy via SSH |
| `npm run pm2:logs` | View last 100 log lines |
| `npm run pm2:status` | Check app status |
| `npm run pm2:restart` | Zero-downtime reload |

## What Changed

✅ **Zero-downtime restarts** - Uses `pm2 reload` instead of `pm2 start`
✅ **Health checks** - Verifies `/api/health` responds before declaring success
✅ **Auto-rollback alerts** - Notifies if deployment fails health check
✅ **Better logging** - Timestamps, separate error/out logs
✅ **Memory protection** - Auto-restart if >512MB
✅ **Crash loop prevention** - Min uptime 10s, max 10 restarts

## First-Time LXC Setup

```bash
# On fresh container
sudo ./deploy-lxc.sh

# Then deploy your code
./deploy.sh
```

## Environment Setup

Create `.env` on your server:

```bash
GEMINI_API_KEY=your_key_here
ADMIN_KEY=your_admin_passkey
PORT=3000
# Optional: UMAMI_PROXY_BASE=https://your-umami-instance.com
```

## Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs arcanum-vitae

# Check memory/CPU
pm2 status
```
