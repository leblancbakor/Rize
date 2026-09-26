# Roadmap

Milestones, not dates. Each milestone ends with something demoable.

## M0 — Scaffold ✅

- [x] Monorepo (pnpm + turbo), shared config, CI
- [x] Prisma schema for servers, merchants, products, invoices, discounts, events
- [x] Invoice state machine with tests
- [x] i18n package with `en` catalog
- [x] Bot boots, `/ping`, `/setup` registers the server
- [x] API `/health`, webhook stubs
- [x] Docs: vision, architecture, ADR 0001–0003

## M1 — First Solana sale (the demo milestone)

- [ ] `/setup` wizard: wallet address, currency, locale (modal + validation)
- [ ] `/product add|list|remove` + a product panel message with a **Buy** button
- [ ] Invoice creation → Solana Pay QR + link in an ephemeral reply
- [ ] Helius webhook → verify tx (recipient, amount, mint, reference) → `PAID`
- [ ] Delivery: `ROLE` and `MESSAGE` types
- [ ] Expiry timer (Redis TTL + sweep fallback) → `EXPIRED`
- [ ] Devnet end-to-end demo GIF in README

## M2 — Cards + reliability

- [ ] Stripe Connect onboarding link from `/setup` and dashboard
- [ ] Card checkout via Stripe Checkout, webhook → `PAID`
- [ ] Delivery worker with retries; `WEBHOOK` delivery type
- [ ] Platform fee via Solana Pay transaction-request (two-transfer tx)
- [ ] Mainnet

## M3 — Dashboard

- [ ] Discord OAuth login, server picker (MANAGE_GUILD check)
- [ ] Product CRUD, invoice list with filters
- [ ] Merchant settings (wallet, Stripe, abandon-DM toggle + discount)
- [ ] Analytics: revenue, conversion by method, price buckets, time-to-pay

## M4 — Growth features

- [ ] Abandoned-cart DM with optional auto-discount
- [ ] Merchant-created discount codes
- [ ] Locales: es, fr, de, pt
- [ ] Stock tracking, out-of-stock handling
- [ ] Public status / stats page (servers connected, volume)

## M5 — Business

- [ ] Pro plan + billing
- [ ] Support server: FAQ, changelog, partner showcase
- [ ] Merchant onboarding docs + pitch page on the website
- [ ] First 10 external merchants

## Later / maybe

- Subscriptions (recurring roles)
- EVM chains (USDC on Base)
- Multi-wallet per merchant, per-product payout override
- Refund helper (`/refund` builds a tx for the merchant to sign)
