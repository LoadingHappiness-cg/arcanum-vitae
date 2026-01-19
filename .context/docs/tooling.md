---
type: doc
name: tooling
description: Developer tools, CLIs, and scripts for Arcanum Vitae
category: tooling
generated: 2026-01-19
status: filled
scaffoldVersion: "2.0.0"
---
## Core Tooling

### 1. Build & Runtime

- **Vite**: Modern frontend build tool for fast HMR and optimized production bundling.
- **tsx**: Used to run TypeScript directly on the server without a separate compilation step (perfect for production stability in this setup).
- **Node.js**: Expected version 20.x+.

### 2. Process Management (Production)

- **PM2**: Handles server uptime, log rotation, and automated restarts.
  - Startup: `pm2 start npm --name arcanum-vitae -- start`
  - Management: `pm2 logs`, `pm2 list`, `pm2 flush`.

### 3. Deployment Scripts

- **deploy-lxc.sh**: A custom shell script for orchestrating deployment to Linux containers.
  - Performs: `git pull`, `npm install`, `npm run build`, and `pm2 restart`.

### 4. Search & SEO Tools

- **Favicon Generators**: Custom tools used to generate multi-size, optimized icons from symbol sources.
- **Schema.org Validators**: Used to verify the JSON-LD metadata in `index.html`.

### 5. AI Integration

- **@google/genai**: Official Google SDK for Gemini integration.
