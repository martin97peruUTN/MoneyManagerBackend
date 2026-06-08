# AGENTS.md — guidance for AI coding assistants

This file orients automated agents and humans working on **MoneyManagerBackend**: an Express + TypeScript REST API for a personal finance app (accounts, currencies, transactions, transfers, categories, users).

## Stack

- **Runtime**: Node.js. The app is **ESM** (`"type": "module"`) and runs TypeScript directly with **`tsx`** — there is no `tsc`/`dist` build step. `moduleResolution: "Bundler"` keeps extensionless imports and `@/*` path aliases working at runtime.  
- **Framework**: Express 4  
- **Language**: TypeScript (`strict: true`)  
- **ORM**: Prisma 7 with **PostgreSQL** (`prisma/schema.prisma`, generator `moduleFormat = "esm"`). Client is wired through `@prisma/adapter-pg` and `pg` (`src/prisma.ts`); **`DATABASE_URL` is required**.  
- **Auth**: **Better Auth** (`src/lib/auth.ts`) is the single source of truth — email/password + Google + GitHub, cookie sessions, admin plugin. It owns the `user`/`session`/`account`(→`AuthAccount`)/`verification` tables. The session guard (`src/middleware/JWTAuthentication.ts`) reads the cookie via `auth.api.getSession` and attaches `{ userId, role, email, name }` to `req.body.user` for controllers.  
- **Docs**: Swagger UI at `/api-docs` (`src/config/swagger.ts`).  
- **Deploy**: Vercel (`vercel.json` points `@vercel/node` at `src/app.ts`); **Render** via `render.yaml` (Node 22, pnpm, `pnpm start` = `tsx src/app.ts`). No compiled `dist/`.

## Repository layout

| Area | Role |
|------|------|
| `src/app.ts` | Express app: middleware, route mounting, listen |
| `src/routes/*.routes.ts` | Route definitions |
| `src/controllers/*.controller.ts` | HTTP handlers |
| `src/services/*.service.ts` | Business logic and DB access (Prisma) |
| `src/lib/auth.ts` | Better Auth instance (prismaAdapter, email/password, Google+GitHub, admin plugin, `lastname` field) |
| `src/middleware/` | `JWTAuthentication.ts` (Better Auth session guard), `AdminRoute.ts` |
| `src/prisma.ts` | Singleton `PrismaClient` + pg pool |
| `prisma/schema.prisma` | Data model (Better Auth tables + finance models keyed by string `User.id`) |

## Auth and route conventions

- **`/api/auth/*`**: Better Auth handler, mounted with `toNodeHandler(auth)` **before** `express.json()` and before the `/api` guard, so it is public and parses its own body.  
- **`/api/*`** (everything else): Protected by the session guard (`authenticateToken`). Sign-up/sign-in/sign-out all go through `/api/auth/*` (e.g. `POST /api/auth/sign-up/email`) — there are no custom login/registration routes.  
- **Admin**: `isAdmin` applies to paths matching `*/admin` and checks `req.body.user.role === 'admin'` (roles are **lowercase** in Better Auth).  
- **CORS**: `credentials: true` with `origin` = `FRONTEND_ORIGIN` so the session cookie flows cross-origin.  
- When adding authenticated endpoints, mount them under `/api` and reuse existing middleware patterns.

## Commands

```bash
pnpm install
pnpm run dev          # tsx watch src/app.ts
pnpm start            # tsx src/app.ts
pnpm run typecheck    # tsc --noEmit (no build output)
```

Prisma (from repo root):

```bash
pnpm exec prisma generate   # also runs on pnpm install (postinstall)
pnpm exec prisma db push    # apply schema to PostgreSQL
```

Import generated types/client from `@/generated/prisma`, not `@prisma/client`.
Requires `.npmrc` (`node-linker=hoisted`) and `@prisma/client-runtime-utils` for pnpm resolution.

## Environment

See `.env.example`. Required: `DATABASE_URL`, `BETTER_AUTH_SECRET` (>= 32 chars), `BETTER_AUTH_URL` (this backend's public URL), `FRONTEND_ORIGIN` (exact frontend origin for CORS + trustedOrigins). Optional: `PORT` (default 1234), and OAuth creds `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET` (a provider is only registered when both are set, so the server boots without them). `TOKEN_SECRET` is gone.

OAuth callback URLs to register: `{BETTER_AUTH_URL}/api/auth/callback/google` and `/callback/github`.

## Conventions for changes

- Match existing **layering**: routes → controllers → services.  
- Keep **TypeScript** types accurate; avoid widening to `any`.  
- The project is **ESM + tsx**. Do not reintroduce a `tsc`/`dist` build or CommonJS `require`.  
- After **schema** changes: run `prisma generate` and ensure services align with new types. Finance models (`Account`, `TransactionCategory`) reference the **string** `User.id`.  
- Prefer **small, focused diffs**; do not refactor unrelated modules in the same change.

## Production note (cross-site cookies)

If frontend and backend are on **different domains**, the Better Auth session cookie must be `SameSite=None; Secure`; set the exact `FRONTEND_ORIGIN` and serve both over HTTPS. Same-host localhost (different ports) works in dev without extra config.

## Render (fresh deploy)

1. **Postgres**: Render dashboard → New → PostgreSQL. Copy the **Internal** or **External** connection string into `DATABASE_URL`.
2. **Web service**: New → Web Service → connect `MoneyManagerBackend` repo (or New → Blueprint if using `render.yaml`).
3. Render reads `.node-version` (**22.12.0**) and `packageManager` (**pnpm**). Do **not** set build to `yarn`.
   - **Build command**: `pnpm install --frozen-lockfile`
   - **Start command**: `pnpm start`
4. **Environment** (required):

   | Variable | Example |
   |----------|---------|
   | `DATABASE_URL` | from Render Postgres |
   | `BETTER_AUTH_SECRET` | `pnpm dlx @better-auth/cli secret` |
   | `BETTER_AUTH_URL` | `https://your-service.onrender.com` |
   | `FRONTEND_ORIGIN` | `https://your-frontend.up.railway.app` |

   Optional OAuth: `GOOGLE_*`, `GITHUB_*`. Render sets `PORT` automatically.

5. After first deploy, apply schema once (local shell with prod `DATABASE_URL`):

   ```bash
   pnpm exec prisma db push
   ```

6. OAuth callback URLs: `{BETTER_AUTH_URL}/api/auth/callback/google` and `/callback/github`.

Health check path (optional): `/api/auth/ok`.

## Related repos

Frontend: `https://github.com/martin97peruUTN/money-manager-frontend` (see README).
