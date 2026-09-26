# Architecture

## Overview

```
                 ┌──────────────┐          ┌──────────────┐
   buyers ──────▶│  apps/bot    │          │  apps/web    │◀────── merchants
   (Discord)     │  discord.js  │          │  Next.js     │        (dashboard)
                 └──────┬───────┘          └──────┬───────┘
                        │  HTTP (internal)        │  HTTP + session cookie
                        ▼                         ▼
                 ┌──────────────────────────────────────────┐
                 │               apps/api  (Fastify)        │
                 │  invoices · products · analytics · auth  │
                 │  ┌────────────────┐ ┌─────────────────┐  │
                 │  │ /webhooks/helius│ │ /webhooks/stripe│  │
                 │  └───────▲────────┘ └────────▲────────┘  │
                 └──────────┼───────────────────┼───────────┘
                            │                   │
                     Helius (Solana)         Stripe
                            │
                 ┌──────────┴───────────┐  ┌──────────┐
                 │  Postgres (Prisma)   │  │  Redis   │  expiry timers, rate limits
                 └──────────────────────┘  └──────────┘
```

Three deployable apps share three internal packages. The database is the only shared state; apps never import each other.

## The invoice lifecycle

`Invoice` is the central object. Everything else (DMs, delivery, analytics, discounts) hangs off its state transitions.

```
 CREATED ──▶ AWAITING ──▶ PAID ──▶ DELIVERED
    │            │          │          │
    └────────────┴─▶ EXPIRED│          │
                            └──────────┴─▶ REFUNDED
```

Transitions are enforced in `packages/payments/src/invoice-state.ts`. Every transition writes an `Event` row.

### Solana (USDC / SOL) — non-custodial

1. Buyer clicks **Buy**. Bot asks API to create an invoice → status `CREATED`.
2. API generates a Solana Pay URL: recipient = merchant wallet, amount, and a fresh **reference** pubkey unique to this invoice. Bot shows QR + deep-link in an ephemeral message → `AWAITING`. Expiry timer set in Redis (default 15 min).
3. Buyer pays from any Solana Pay-compatible wallet. The tx includes the reference key as a read-only account.
4. Helius webhook (subscribed to merchant wallets) delivers the tx to `/webhooks/helius`. API finds the invoice by reference, verifies recipient + amount + token mint on the tx → `PAID`.
5. API tells the bot to deliver (role / message / webhook) → `DELIVERED`. Ephemeral message updated.

Platform fee: the _transaction request_ flavour of Solana Pay lets our API return a tx with two transfers (merchant + Rize fee) that the buyer signs once. See [ADR-0003](adr/0003-invoice-matching.md).

### Card — Stripe Connect

1. Same invoice creation.
2. API creates a Stripe Checkout Session **on the merchant's connected account** with `application_fee_amount` = Rize fee. Bot shows a "Pay by card" link button → `AWAITING`.
3. `checkout.session.completed` webhook → `PAID` → deliver → `DELIVERED`.

Stripe is the regulated party; Rize never holds card funds.

### Expiry & abandoned cart

- A Redis key with TTL per invoice. On expiry (or a periodic sweep as fallback) → `EXPIRED`.
- If the merchant has abandoned-cart DMs enabled, the bot DMs the buyer with a "start again" button, optionally attaching an auto-generated single-use `Discount`. If they buy, `ABANDON_DM_CONVERTED` is logged.

## Data model

See `packages/db/prisma/schema.prisma`. Key rules:

- Money is integer minor units + currency code. Never floats.
- `Server` = a Discord guild. `Merchant` = its payout config (1:1).
- `Product` carries its delivery type and payload.
- `Event` is append-only and is the source for all analytics.

## Auth

- **Bot → API:** shared secret header (internal network).
- **Dashboard → API:** Discord OAuth2 (`identify guilds`), session cookie. Merchant access to a server requires `MANAGE_GUILD` on that guild, re-checked against Discord on login.
- **Webhooks:** Helius auth header; Stripe signature verification on the raw body.

## i18n

`packages/i18n` — JSON catalogs per locale, dot-path keys, `{placeholder}` interpolation. Buyer-facing strings use the buyer's Discord locale; merchant-facing strings use the server's configured locale. Unknown locales fall back to `en`.

## Deployment (target)

- `bot` + `api`: single small VPS or Fly.io machines, Docker.
- `web`: Vercel.
- Postgres: managed (Neon / Supabase / Fly Postgres). Redis: Upstash or Fly.
- Helius for Solana RPC + webhooks (mainnet), devnet for development.

## Open questions

- Transaction-request vs transfer-request as the _only_ Solana flow (transaction-request needs the wallet to reach our API; some wallets handle this poorly).
- Whether delivery should be a separate worker process with retries (probably yes by M2).
- Rate limiting / anti-abuse on invoice creation (a buyer spamming Buy creates many reference keys — cheap, but Helius webhook noise).
