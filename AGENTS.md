# AGENTS.md

## Cursor Cloud specific instructions

This branch is the **Control Tower AI** app (React + TypeScript + Vite client, Node + Express API via `tsx`, Vitest + Supertest). Node `>=22` is required (see `package.json` `engines`); the VM already provides it. Dependencies are installed by the startup update script (`npm install`).

Services and how to run them (see `package.json` scripts / `README.md` for the canonical list):

- API server: `npm run dev` (tsx watch, serves `/api` on `PORT`, default `3000`).
- Web client: `npm run dev:client` (Vite on `0.0.0.0:5173`, proxies `/api` to `http://localhost:3000`). Run both together for the full app.
- Tests: `npm test` (Vitest). Typecheck: `npm run typecheck` (server + client `tsc --noEmit`). Build: `npm run build`.

Non-obvious caveats:

- The app runs fully in-memory with seeded demo data when `DATABASE_URL`/`REDIS_URL` are unset — no Postgres/Redis needed for local dev or tests. Google OAuth env vars are optional; the OAuth flow is a scaffold.
- There is no lint script; `npm run typecheck` is the closest static check.
- Known gotcha: `npm start` points to `dist/server/index.js`, but `tsc` emits the entry to `dist/server/server/index.js` (because `rootDir` is `src`). The production `start` script fails as-is; use the dev scripts. Not fixed here to avoid changing app code during environment setup.
- The Vite dev client needs the API on `:3000` for `/api` proxy calls; start `npm run dev` before/with `npm run dev:client` or the dashboard will fail to load bootstrap data.
