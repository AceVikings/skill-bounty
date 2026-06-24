# Dialect — Deep Dive (messaging, notifications, Blinks registry)

> **Org:** https://github.com/dialectlabs
> **Docs site:** https://docs.dialect.to
> **Domain:** dialect.to (canonical Blink host at dial.to)
> **Pinned repos:** `blinks` (TS, 111⭐), `blink-starter-solana` (TS, 6⭐, MIT), `blink-starter-evm` (TS, 2⭐, MIT)
> **Other repos:** `defi-dashboard`, `react` (44⭐, Apache-2.0), `monitor` (24⭐, Apache-2.0), `solana-blinks` (TS, 1⭐, MIT), `feedback-blink`, `buildstation-alerts`
> **Verified:** Dialect builds the canonical `dial.to` Blink URL pattern

## What it is

The **messaging + Blinks registry** for Solana. Three products:
1. **Notifications** — wallet push, browser push, email, Telegram, SMS
2. **Messaging** — on-chain DMs, threads, group chats, encrypted DMs
3. **Blinks registry** — `dial.to` is the canonical host

## Use cases for an AI agent

- **Send a notification when your agent takes an action** — "I just bought 1 SOL worth of USDC for you"
- **Send a DM to a user on-chain** — agent-to-user DMs (Dialect inbox)
- **Publish your Blink to dial.to** — discoverability
- **Build a defi dashboard** with `Dialect's Markets and Position APIs` (`dialectlabs/defi-dashboard`)

## The `dial.to` URL (canonical Blink host)

```
https://dial.to/?action=solana-action:<url-encoded-action-api>
```

Dialects runs the registry. See [`21-protocols-actions-blinks.md`](21-protocols-actions-blinks.md) for the full spec.

## How to integrate (best practices)

1. **Notifications** — your agent calls the Dialect API on a state change
2. **Inbox / DMs** — the user subscribes; your agent's wallet becomes a "Dialect identity"
3. **Blinks publishing** — register your action endpoint at `dial.to`; the URL becomes shareable

## ⚠ Unverified items

- **Inbox SDK npm name** — could not verify a published package. Use `https://docs.dialect.to` for the live reference; treat code examples as illustrative.
- **Exact inbox endpoint shape** — read the docs to confirm.

## Use with an agent framework

| Framework | Integration |
|---|---|
| **ElizaOS** | Custom plugin (no first-party Dialect plugin); use HTTP API |
| **Lucid Agents** | Custom adapter; use HTTP API |
| **SAK** | Custom plugin; use HTTP API |
| **Swarms** | Use Python `requests` to the Dialect API |
| **ZerePy** | Use HTTP from `main.py` |

For all frameworks, the integration is "call the Dialect HTTP API when X happens" — there is no first-party plugin in any of the 6 frameworks.

## See also

- `21-protocols-actions-blinks.md` — the Blink spec
- `00-decision-tree.md` — when to add notifications
- https://docs.dialect.to — the live docs
- https://github.com/dialectlabs — the org
