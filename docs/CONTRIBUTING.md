# Contributing

## Workflow

- `main` is always green. Work on branches, open a PR, CI must pass.
- Small PRs. One concern each.
- Every non-trivial decision gets an ADR in `docs/adr/` **before** the code lands.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/):

```
feat(bot): add /product add command
fix(api): verify token mint on helius webhook
docs(adr): 0004 delivery worker
chore: bump discord.js
```

Scopes: `bot`, `api`, `web`, `db`, `payments`, `i18n`, `config`, `adr`, `ci`.

## Code

- TypeScript strict everywhere. No `any` without a comment.
- Money is integer minor units. No floats, ever.
- Invoice status changes go through `assertTransition`. No direct `status:` writes.
- Every buyer- or merchant-facing string goes through `t()` — no hardcoded English in the bot.
- Log with structured fields (`logger.info({ invoiceId }, 'msg')`), never string concatenation.

## Running checks locally

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## ADR template

Copy `docs/adr/0000-template.md`, increment the number, fill it in.

## Devlog

Add a short entry to `docs/devlog/` when a milestone step lands. Date, what changed, what surprised you. This is the project's memory.
