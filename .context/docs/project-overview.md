---
type: doc
name: project-overview
description: High-level overview of Arcanum Vitae, an AI music manifesto and digital fiction
category: overview
generated: 2026-01-19
status: filled
scaffoldVersion: "2.0.0"
---
## Project Overview

Arcanum Vitae is an innovative AI music manifesto and digital fiction project. Created by Carlos Gavela, it serves as a "human-guided, machine-shaped archive of resistance, testimony, and experimental sound." The project combines a rich conceptual layer (the "Digital Manifesto") with a functional music player and an interactive "Mirror" that reflects user input through AI.

## Codebase Reference

> **Detailed Analysis**: For complete symbol counts, architecture layers, and dependency graphs, see [`codebase-map.json`](./codebase-map.json).

## Quick Facts

- Root: `/Users/carlosgavela/Projectos/arcanum-vitae`
- Languages: TypeScript (React/Node), CSS (Tailwind), HTML.
- Entry Points:
  - Frontend: `index.tsx` -> `App.tsx`
  - Backend: `server.ts`
- Full analysis: [`codebase-map.json`](./codebase-map.json)

## Entry Points

- [App.tsx](file:///Users/carlosgavela/Projectos/arcanum-vitae/App.tsx): Main React application entry point, handles view switching and global state.
- [server.ts](file:///Users/carlosgavela/Projectos/arcanum-vitae/server.ts): Express server entry point, handles API requests, media proxing (Umami), and AI integration.
- [index.tsx](file:///Users/carlosgavela/Projectos/arcanum-vitae/index.tsx): Client-side mounting point.

## Key Exports (from types.ts)

- `View`: Enum for application routing.
- `Album`: Interface defining the structure of music albums.
- `Track`: Interface for individual music tracks.
- `FictionDeclaration`: Interface for the manifesto's narrative content.

## File Structure & Code Organization

- `components/` — Reusable UI components (AudioPlayer, Navigation, etc.).
- `components/views/` — Main page components (MusicView, HomeView, etc.).
- `data/` — Local JSON storage (`db.json`) for the manifesto content.
- `public/` — Static assets (favicons, manifest, etc.).
- `services/` — Shared logic for Gemini AI integration.

## Technology Stack Summary

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, Helmet (security), Rate-Limiter, express-fileupload.
- **AI**: Google Gemini API (@google/genai).
- **Analytics**: Umami (self-hosted/cloud).
- **Deployment**: PM2 (Process Manager), HAProxy (External Proxy).

## Getting Started Checklist

1. Install dependencies: `npm install`
2. Configure `.env`: Copy `.env.example` to `.env` and add `ADMIN_KEY`.
3. Start development: `npm run dev`
4. Deploy: Use `deploy-lxc.sh` for production environments.

## Related Resources

- [architecture.md](./architecture.md)
- [security.md](./security.md)
- [tooling.md](./tooling.md)
- [codebase-map.json](./codebase-map.json)
