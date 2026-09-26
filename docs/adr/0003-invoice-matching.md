# ADR-0003: Solana invoice matching and fee collection

- **Status:** Accepted
- **Date:** 2026-09-26

## Context

Non-custodial (ADR-0002) means many buyers pay into the _same_ merchant wallet. Rize must reliably map an incoming transaction to exactly one invoice, detect the amount and token, and take its platform fee without holding funds.

## Decision

### Matching: Solana Pay reference keys

Every invoice gets a freshly generated public key (`Invoice.solanaReference`, no private key is kept). The Solana Pay URL includes it as `reference=`; compliant wallets add it as a read-only account on the transfer instruction. Matching then works two ways:

1. **Push:** Helius enhanced-transaction webhook on merchant wallets → for each tx, look for a known reference key among account keys → load invoice → verify.
2. **Pull (fallback / reconciliation):** `getSignaturesForAddress(reference)` on a sweep for `AWAITING` invoices near expiry, in case a webhook was missed.

Verification checks, in order: tx succeeded, recipient == merchant wallet, token mint == expected (USDC mint or native SOL), amount ≥ `amountMinor`, reference present, signature not already used. Only then `AWAITING → PAID`.

### Fee collection: transaction-request

Solana Pay's **transfer request** (`solana:<recipient>?amount=…`) supports a single recipient, so the fee can't be split there. Solana Pay's **transaction request** (`solana:https://api.rize.gg/tx/<invoice>`) has the wallet POST the buyer's pubkey to our API, and we return a serialized transaction. That transaction contains:

- transfer `amount − fee` → merchant wallet
- transfer `fee` → `RIZE_FEE_WALLET`
- reference key on the first instruction
- memo `Rize #<short id>`

The buyer signs once. Both transfers are atomic. Rize never holds anything.

**M1 ships the transfer-request flavour (no fee) to get an end-to-end demo fast; M2 switches the default to transaction-request.** The transfer-request path stays as a fallback for wallets that don't support transaction requests, with the fee then being zero for that invoice (recorded in `Invoice.feeMinor`).

## Alternatives considered

- **Memo-only matching** — put the invoice id in a memo instruction. Rejected as the primary mechanism: not all wallets preserve memos, and parsing memos is fragile. Kept as a human-readable extra.
- **Unique deposit address per invoice** — derive a fresh address per invoice, sweep to the merchant later. Rejected: the sweep makes Rize custodial for the duration, and pays rent + fees per invoice.
- **Amount-based matching (e.g. 19.990123 USDC)** — no extra accounts needed, but collides at scale and looks odd to buyers. Rejected.
- **Fee via a separate second transaction** — buyer signs twice, or merchant pays fee later. Bad UX / uncollectable. Rejected.
- **On-chain program that splits payments** — cleanest atomic guarantee, but an audit surface and deploy cost for a two-instruction transaction that the transaction-request flavour already gives us. Not now.

## Consequences

- Reference key generation is free (no rent — the key is never funded).
- The API must expose a public, unauthenticated `GET/POST /tx/:invoiceId` endpoint for wallets; it needs rate limiting and must only serve `AWAITING` invoices.
- Helius webhook subscriptions must be updated whenever a merchant changes their wallet.
- Matching is idempotent by design: `solanaTxSig` is unique, so a replayed webhook is a no-op.
- Devnet USDC uses a different mint; mint addresses live in config, not code.
