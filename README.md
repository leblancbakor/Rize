# Rize

**Sell anything in Discord. Get paid in crypto or card — without leaving the server.**

Rize is a Discord payment bot. Server owners list products, buyers click a button, pay with Solana (USDC / SOL) or card (Stripe), and get their role, file, or license delivered instantly. No external store, no PayPal links, no custody of anyone's funds.

> Status: **pre-alpha scaffold.** Nothing is deployed yet. Follow along in [`docs/ROADMAP.md`](docs/ROADMAP.md) and [`docs/devlog/`](docs/devlog/).

## Why

Existing options either send buyers to a third-party storefront (Sellix, Shoppy), only gate subscriptions (LaunchPass, Whop), or bolt one payment rail onto Discord. Rize is built around three ideas:

1. **Native checkout.** The whole flow — product panel, invoice, payment instructions, confirmation, delivery — happens in Discord.
2. **Non-custodial by default.** Crypto lands directly in the merchant's wallet; card payments settle to the merchant's Stripe account. Rize only watches and confirms. See [ADR-0002](docs/adr/0002-non-custodial.md).
3. **Five-minute setup.** `/setup` in Discord, and a web dashboard for the rest.

## Repository layout

```
apps/
  bot/        Discord bot (discord.js) — slash commands, buttons, DMs
  api/        Fastify API — invoices, Helius & Stripe webhooks, dashboard backend
  web/        Next.js dashboard
packages/
  db/         Prisma schema + client (single source of truth for the data model)
  payments/   Invoice state machine, Solana Pay builder, Stripe Connect helpers
  i18n/       Locale catalogs + t() helper
  config/     Shared tsconfig / eslint
docs/
  VISION.md · ARCHITECTURE.md · ROADMAP.md · adr/ · devlog/
```

## Getting started

Requirements: Node 22+, pnpm 10+, Docker (for Postgres + Redis).

```bash
pnpm install
cp .env.example .env            # fill in DISCORD_TOKEN etc.
docker compose up -d            # postgres + redis
pnpm db:generate
pnpm db:migrate                 # creates the schema
pnpm --filter @rize/bot deploy-commands
pnpm dev                        # bot + api + web via turbo
```

Then `/ping` and `/setup` in your dev server.

## Docs

- [Vision](docs/VISION.md) — what we're building and for whom
- [Architecture](docs/ARCHITECTURE.md) — how the pieces fit
- [Roadmap](docs/ROADMAP.md) — milestones
- [ADRs](docs/adr/) — why the important decisions were made
- [Contributing](docs/CONTRIBUTING.md) — conventions

## License

MIT
