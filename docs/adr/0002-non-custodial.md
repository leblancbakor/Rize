# ADR-0002: Non-custodial payments

- **Status:** Accepted
- **Date:** 2026-09-26

## Context

Rize routes money from buyers to merchants. There are two ways to do that:

- **Custodial:** buyers pay into wallets/accounts Rize controls; Rize tracks per-merchant balances and pays out.
- **Non-custodial:** buyers pay the merchant directly; Rize only observes and confirms.

Holding customer funds is a regulated activity in Rize's target markets (FCA cryptoasset registration in the UK, MiCA CASP authorisation in the EU, money-transmitter rules in the US). It also makes Rize a theft target and makes merchant trust a prerequisite rather than a byproduct.

## Decision

Rize is **non-custodial for every payment method.**

- **Solana:** each merchant registers their own wallet. Invoices are Solana Pay requests addressed to that wallet with a per-invoice reference key. Rize watches the chain (Helius webhooks) and confirms; it never holds keys or funds. See ADR-0003 for matching and fee mechanics.
- **Cards:** Stripe Connect. Merchants onboard a connected Stripe account; Checkout Sessions are created on that account with `application_fee_amount` for Rize's cut. Stripe is the regulated party and holds the funds.
- Rize's own fee wallet only ever receives the fee portion, atomically in the buyer's transaction.

## Alternatives considered

- **Custodial with periodic payouts** — trivial fee collection, could offer "convert crypto to fiat payout" later. Rejected: licensing burden, custody risk, and it undermines the "we never touch your money" positioning that is Rize's main trust argument against Sellix-style stores.
- **Hybrid (custodial "Rize Balance" as an opt-in)** — deferred. Could be added later behind proper licensing without changing the default flow.
- **Escrow smart contract on Solana** — non-custodial in the legal sense but adds an on-chain program to audit and maintain. Unnecessary for one-off digital goods; revisit if disputes/refunds become a product need.

## Consequences

- No payout system, no balance ledger, no hot wallet to secure.
- Refunds are the merchant's responsibility. Rize can provide a `/refund` helper that _builds_ a transaction for the merchant to sign, but never executes it.
- Fee collection on Solana requires either a two-transfer transaction (transaction-request flavour of Solana Pay) or foregoing the crypto fee in favour of the Pro tier. See ADR-0003.
- Merchants must provide a wallet / Stripe account before selling; `/setup` cannot be skipped.
- Chargebacks on card payments are handled by Stripe against the merchant's connected account, not against Rize.
