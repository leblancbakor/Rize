# Vision

## One line

Rize is **the** payment bot for Discord: any product, crypto or card, checkout that never leaves the server, and setup that takes five minutes.

## Who it's for

**Merchants** — Discord servers that sell digital goods and access:

- Game asset / script sellers (FiveM, Roblox, Minecraft, cheats/mods communities)
- Freelancers and small studios selling services through their Discord
- Paid communities (premium roles, VIP channels, coaching)
- Crypto-native projects that want to sell in USDC without a web store

Today they use a hosted store (Sellix/Shoppy) plus glue bots, PayPal friends-and-family, or manual "DM me to buy". All three leak buyers out of the server, feel sketchy, or don't scale.

**Buyers** — server members who want to buy something in two clicks, with a payment method they already use, and get it immediately.

## What makes Rize different

|                         | Hosted stores (Sellix) | Subscription gates (LaunchPass, Whop) | **Rize**                    |
| ----------------------- | ---------------------- | ------------------------------------- | --------------------------- |
| Checkout location       | External website       | External website                      | Inside Discord              |
| One-off products        | Yes                    | No                                    | Yes                         |
| Crypto                  | Yes (custodial)        | Limited                               | Yes, non-custodial (Solana) |
| Cards                   | Yes                    | Yes                                   | Yes (Stripe Connect)        |
| Custody of funds        | Yes                    | Yes                                   | **No**                      |
| Setup                   | Web store + bot glue   | Web                                   | `/setup` in Discord         |
| Fees                    | % + monthly            | $29+/mo + %                           | Small % or Pro tier         |
| Abandoned-cart recovery | No                     | No                                    | Yes, with optional discount |

## Principles

1. **Never hold money.** Non-custodial crypto, Stripe Connect for cards. Rize is software, not a bank.
2. **Discord is the UI.** Every buyer-facing step happens in Discord. The dashboard is for merchants.
3. **Boring on the inside.** Postgres, a state machine, and webhooks. No clever infra until the numbers demand it.
4. **Data from day one.** Every invoice transition is an event. Conversion by payment method, price buckets, time-to-pay — these numbers _are_ the sales pitch.
5. **Multilingual.** English first; Spanish, French, German, Portuguese follow. The i18n layer exists before the second language does.

## Not in scope (for now)

- Custodial balances or payouts
- Fiat off-ramps
- Chains other than Solana (EVM is a "later", not a "never")
- Subscriptions / recurring billing (v2)
- Physical goods / shipping

## Business model (open — to be decided by data)

Candidates:

- **Transaction fee** — ~1.5% on crypto (taken atomically in the same tx), ~1% + Stripe fees on card.
- **Free + Pro** — core free, Pro (~$10–15/mo) unlocks analytics, custom branding, multiple wallets, priority support.
- **Hybrid** — free tier with the small fee, Pro removes it.

Leaning hybrid. Decide after the first ~20 merchants tell us what they'd pay for.

## Success looks like

- A merchant can go from "add bot" to first sale in under five minutes, with no docs.
- Buyers describe it as "just click and pay".
- Merchants trust it _because_ it never touches their money.
- The GitHub repo reads as a clear, well-documented system that someone else could contribute to.
