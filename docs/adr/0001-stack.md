# ADR-0001: Stack — Node + TypeScript monorepo

- **Status:** Accepted
- **Date:** 2026-09-26

## Context

Rize has three runtime surfaces (Discord bot, HTTP API, web dashboard) that share one data model, one payment layer, and one set of translations. The project will be maintained for a long time by a small team, and the repo doubles as a portfolio piece, so readability and conventional tooling matter more than raw performance.

## Decision

- **Runtime:** Node.js 22 LTS.
- **Language:** TypeScript, strict mode, ESM throughout.
- **Repo:** pnpm workspaces + Turborepo. `apps/*` are deployables, `packages/*` are shared libraries imported by path (no publishing).
- **Bot:** discord.js v14.
- **API:** Fastify v5. Chosen over Express for schema-driven validation, built-in pino logging, and speed; over Hono/Elysia for maturity and Node-first design.
- **Dashboard:** Next.js (App Router).
- **Database:** PostgreSQL via Prisma. Redis for TTL timers and rate limits.
- **Validation:** zod for env and request bodies.
- **Tooling:** ESLint flat config + Prettier shared via `packages/config`; `tsx` for dev, `tsup` for builds; Node's built-in test runner.

## Alternatives considered

- **Bun** — faster startup, native TS, all-in-one. Rejected for now: the Discord / Solana / Stripe libraries are Node-first, Prisma has had compatibility gaps, and hosting support is thinner. Revisit when compatibility is a non-issue; nothing in the codebase blocks a switch.
- **Separate repos per app** — cleaner deploy boundaries, but sharing the Prisma client and i18n across three repos means publishing packages or duplicating code. Not worth it at this size.
- **Drizzle instead of Prisma** — lighter and closer to SQL, but Prisma's schema file is the most readable data-model document for a portfolio repo, and Prisma Studio is useful early on.
- **Python (discord.py / FastAPI)** — viable, but the dashboard would be a second language, and the Solana Pay reference implementation is TypeScript.

## Consequences

- One `pnpm install`, one `pnpm dev`, one CI pipeline.
- Prisma is the single source of truth for types; `pnpm db:generate` is a required step after clone.
- Adding a fourth surface (e.g. a delivery worker) is a new folder in `apps/`.
- We accept Prisma's runtime overhead and Node's slightly slower cold start versus Bun.
