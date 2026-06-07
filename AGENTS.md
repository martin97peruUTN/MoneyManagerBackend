# AGENTS.md — guidance for AI coding assistants

This file orients automated agents and humans working on **MoneyManagerBackend**: an Express + TypeScript REST API for a personal finance app (accounts, currencies, transactions, transfers, categories, users).

## Stack

- **Runtime**: Node.js  
- **Framework**: Express 4  
- **Language**: TypeScript (`strict: true`, emits **CommonJS** to `dist/`)  
- **ORM**: Prisma 7 with **PostgreSQL** (`prisma/schema.prisma`). Client is wired through `@prisma/adapter-pg` and `pg` (`src/prisma.ts`); **`DATABASE_URL` is required**.  
- **Auth**: JWT in `Authorization: Bearer <token>`. Middleware attaches decoded payload to `req.body.user`.  
- **Docs**: Swagger UI at `/api-docs` (`src/config/swagger.ts`).  
- **Deploy**: Vercel (`vercel.json` builds `src/app.ts` with `@vercel/node`); README also lists Render URLs.

## Repository layout

| Area | Role |
|------|------|
| `src/app.ts` | Express app: middleware, route mounting, listen |
| `src/routes/*.routes.ts` | Route definitions |
| `src/controllers/*.controller.ts` | HTTP handlers |
| `src/services/*.service.ts` | Business logic and DB access (Prisma) |
| `src/middleware/` | `JWTAuthentication.ts`, `AdminRoute.ts` |
| `src/prisma.ts` | Singleton `PrismaClient` + pg pool |
| `prisma/schema.prisma` | Data model |
| `src/services/user.mysql2.service.ts` | Legacy/alternate MySQL path — prefer Prisma for new work unless explicitly extending this |

## Auth and route conventions

- **`/api/*`**: Protected by JWT (`authenticateToken`). Unauthenticated entry points include **login** and **user creation** routes (see `app.ts` mount order).  
- **Admin**: `isAdmin` applies to paths matching `*/admin` (see comments in `app.ts` for admin endpoints).  
- When adding authenticated endpoints, mount them under `/api` and reuse existing middleware patterns.

## Commands

```bash
pnpm install
pnpm run dev          # nodemon on src/app.ts
pnpm run build        # tsc → dist/
pnpm start            # build then node dist/app.js
pnpm run serve        # watch tsc + nodemon dist (local workflow)
```

Prisma (from repo root):

```bash
pnpm exec prisma generate   # also runs on pnpm install (postinstall)
pnpm exec prisma db push    # apply schema to PostgreSQL
```

Import generated types/client from `@/generated/prisma`, not `@prisma/client`.
Requires `.npmrc` (`node-linker=hoisted`) and `@prisma/client-runtime-utils` for pnpm resolution.

## Environment

Typical variables (infer exact names from code): `DATABASE_URL`, `TOKEN_SECRET`, `PORT` (optional; default 3001 so Next.js can use 3000). Use `dotenv` locally as the app already does in `prisma.ts`.

## Conventions for changes

- Match existing **layering**: routes → controllers → services.  
- Keep **TypeScript** types accurate; avoid widening to `any`.  
- Do not add `"type": "module"` to `package.json` — project comment in `app.ts` notes it breaks the current TS/CJS setup.  
- After **schema** changes: run `prisma generate` and ensure services align with new types.  
- Prefer **small, focused diffs**; do not refactor unrelated modules in the same change.

## Related repos

Frontend: `https://github.com/martin97peruUTN/money-manager-frontend` (see README).
