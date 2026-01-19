---
type: doc
name: security
description: Security protocols and administrative access controls
category: security
generated: 2026-01-19
status: filled
scaffoldVersion: "2.0.0"
---
## Security Protocols

Arcanum Vitae implements several layers of security to protect the manifesto's integrity and the server's stability.

### 1. Administrative Access

- **ADMIN_KEY**: All write operations (`/api/save`, `/api/upload`) require a valid `ADMIN_KEY` configured in the `.env` file.
- **Token-based Auth**: The backend issues a short-lived token upon successful key validation, which must be sent in the `Authorization` header for subsequent requests.

### 2. Network Security

- **Express Helmet**: Standard security headers are enforced via the `helmet` middleware, including a strict Content Security Policy (CSP).
- **CORS**: Restricted to specific origins defined in `CORS_ORIGINS`.
- **Rate Limiting**: Implemented via `express-rate-limit` to prevent brute-force attacks and DDoS on API endpoints.

### 3. Media Handling

- **Upload Validation**: The `/api/upload` endpoint validates file types (image/audio) and enforces a 50MB size limit.
- **Storage**: Media is stored in the `public/media` directory and served statically.

### 4. AI Proxy

- All requests to the Gemini API are handled strictly on the server-side (`services/gemini.ts`). The `GEMINI_API_KEY` is never exposed to the client.
