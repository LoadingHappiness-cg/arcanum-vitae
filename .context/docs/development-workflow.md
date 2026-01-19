---
type: doc
name: development-workflow
description: Standard development process and deployment pipeline
category: workflow
generated: 2026-01-19
status: filled
scaffoldVersion: "2.0.0"
---
## Development Workflow

### 1. Environment Setup

- Ensure Node.js 20+ is installed.
- Run `npm install` to install all frontend and backend dependencies.
- Configure `.env` with at least `ADMIN_KEY`.

### 2. Local Development

- Run `npm run dev` to start the Vite development server.
- The backend can be run in development mode using `tsx server.ts`.
- Note: The frontend expects the backend to be available on port 3000 by default.

### 3. Testing & Verification

- Manually verify UI changes and responsive behavior.
- Ensure `ADMIN_KEY` is working by testing a save/upload operation in the Admin Dashboard.

### 4. Production Build & Deployment

1. Run `npm run build` to generate the production frontend assets in `dist/`.
2. Ensure `dist/` and `public/` are available to the server.
3. Deploy to the LXC container using `deploy-lxc.sh` or manual git push.
4. Manage the server process using PM2:
   `pm2 start npm --name arcanum-vitae -- start`

### 5. Post-Deployment

- Monitor PM2 logs for any runtime errors: `pm2 logs arcanum-vitae`.
- Verify external access via HAProxy/Cloudflare.
