# Control Tower AI

Control Tower AI is a production-oriented SaaS foundation for agency Google Business Profile management. This initial build focuses on Sprint 1 from the uploaded builder pack: foundation, auth/OAuth, Gmail CSV import, auto-discovery scaffolding, audit logging, RBAC, and a responsive mission-control dashboard.

## Stack

- React + TypeScript + Vite
- Node.js + Express
- PostgreSQL schema scaffold in `src/server/db/schema.sql`
- Redis client hook for future workers
- Google OAuth-only auth flow scaffold
- Vitest + Supertest API coverage

## Scripts

```bash
npm install
npm run dev          # API on PORT, defaults to 3000
npm run dev:client   # Vite client on 5173, proxies /api
npm run build
npm test
npm run typecheck
npm start            # serves dist/server + dist/client
```

## Environment

```bash
PORT=3000
APP_ORIGIN=http://localhost:5173
DATABASE_URL=postgres://...
REDIS_URL=redis://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

The app runs with an in-memory seeded workspace when PostgreSQL/Redis are not configured.

## Current API Surface

- `GET /api/health`
- `GET /api/bootstrap`
- `POST /api/auth/google/start`
- `POST /api/auth/google/callback`
- `POST /api/imports/gmail/csv`
- `POST /api/google/profiles/discover`
- `GET /api/business-profiles`
- `GET /api/audit-logs`

Legacy static files from the previous app are preserved in `public/` and served under `/legacy` by the new Express app.
