---
name: solana-agent-frameworks
version: "1.0.0"
license: MIT
language: en
tags:
  - solana
  - ai
  - agent
  - elizaos
  - lucid-agents
  - swarms
  - zerepy
  - sendai
  - solana-agent-kit
  - x402
  - blinks
  - solana-actions
  - dialect
  - mcpay
  - crossmint
description: >
  Comparative guide + runnable cookbook for shipping AI agents on Solana.
  Covers 6 frameworks (ElizaOS, Lucid Agents, Swarms, ZerePy, SendAI solana-agent-kit, Daydreams-legacy),
  3 protocols (x402, Solana Actions / Blinks, Dialect messaging), and agent-wallet providers
  (Crossmint, MCPay, Turnkey, Privy). Use when picking, integrating, scaffolding, or migrating
  between Solana AI agent frameworks. Verified against live sources 2026-06-24.
user-invocable: true
---

# Solana Agent Frameworks Skill

The Solana AI Kit has the [SendAI `solana-agent-kit` skill](https://github.com/sendaifun/skills/tree/main/skills/solana-agent-kit) — a great **toolkit** for one specific framework. It does not cover the other 5+ frameworks an agent builder needs to choose from, nor the x402 buyer side, nor Solana Actions / Blinks publishing, nor Dialect messaging, nor the agent-wallet providers.

**This skill is the map of the territory** — and it ships runnable code for every path.

> **Complement, don't duplicate.** The sendai `solana-agent-kit` skill is the canonical home for SAK. We link to it; we don't reskin it. The same is true for `jupiter`, `helius`, `metaplex`, `light-protocol` — we cross-link, not duplicate.

## When to use this skill

- **"Build an AI agent on Solana"** → §1 (decision tree) → §2 (frameworks)
- **"Compare [framework A] vs [framework B]"** → §1 + the two relevant `10-15-frameworks-*.md`
- **"Add x402 [buyer | seller]"** → §3 + `agents/x402-seller.md` or `agents/x402-buyer.md`
- **"Publish a Blink on dial.to"** → §3 + `21-protocols-actions-blinks.md` + `/publish-blink`
- **"Set up [Crossmint | MCPay | Turnkey | Privy] as the agent's wallet"** → §4
- **"Send a notification / on-chain DM from my agent"** → §3 + `22-protocols-dialect.md`
- **"Which version of [@x402/svm | @elizaos/plugin-solana] should I pin?"** → `90-version-compat.md`
- **"Pick the right framework for this stack"** → `/pick-framework` (interview)

## 1. The decision tree (the picker)

```
What's your stack?
├── TypeScript / Bun, single agent, want max plugins + connectors
│   └── ElizaOS  → /scaffold-elizaos-solana
├── TypeScript / Bun, agentic commerce / x402 / paid APIs / payment rails
│   └── Lucid Agents  → /scaffold-lucid-agents
├── Python, multi-agent orchestration, x402 native
│   └── Swarms  → bun? no, Python. See references/12-frameworks-swarms.md
├── Python, lightweight X/Twitter-focused agent
│   └── ZerePy  → git clone + Poetry
├── Want the SendAI SAK ecosystem (60+ Solana actions, LangChain/MCP)
│   └── SendAI solana-agent-kit  → /scaffold-sak-mcp (uses the official sendai skill)
└── You have existing Daydreams code
    └── Migrate to Lucid Agents (Daydreams agent framework is in maintenance)

Then choose a wallet:
├── Consumer UX (email/passkey)            → Crossmint @crossmint/wallets-sdk
├── x402 paid API calls (buyer)            → MCPay (mcpay/client)
├── x402 paid APIs you sell (seller)        → Express + @x402/express + facilitator
├── Production agent with policy           → Turnkey or Privy
└── Browser/mobile wallet connect          → Phantom Connect
```

For the full interview (8 questions), see [`/pick-framework`](../../commands/pick-framework.md).

## 2. The 6 frameworks, at a glance

| Framework | Lang | Solana | x402 | MCP | Latest | License | Verdict |
|---|---|---|---|---|---|---|---|
| **ElizaOS** (elizaOS/eliza) | TS | `@elizaos/plugin-solana@1.2.6` | `@elizaos/plugin-x402@2.0.0-alpha.1` | yes | `elizaos@beta` (18.6k⭐) | MIT | **Most plugins. Most connectors. Choose if you want ecosystem.** |
| **Lucid Agents** (daydreamsai/lucid-agents) | TS (Bun) | native SPL USDC | **first-class** | yes | `@lucid-agents/cli@2.5.0` (bin: `create-agent-kit`) | CLI: MIT · core/identity: Proprietary | **Choose if x402 / agentic commerce.** |
| **Swarms** (kyegomez/swarms) | Python | via `solana` / `jupiter-python-sdk` | native X402 Quickstart | yes | master (6.9k⭐) | Apache-2.0 | **Choose for Python multi-agent.** |
| **ZerePy** (blorm-network/ZerePy) | Python | `solana`, `jupiter-python-sdk`, `allora-sdk`, `goat-sdk` | not first-party | limited | `v1.1` (580⭐) | MIT | **Choose for X/Twitter agents.** |
| **SendAI SAK** (sendaifun/solana-agent-kit) | TS | native (60+ actions) | via `plugin-blinks` | `solana-mcp` | v2.0.9 (1.7k⭐) | Apache-2.0 | **Choose if you want SAK's protocol coverage.** |
| **Daydreams** (daydreamsai/daydreams) | TS | via SAK or direct | Dreams Router (x402) | yes | v0.3.22 (608⭐) | MIT | **⚠ Legacy — use Lucid Agents for new builds.** |

See:
- `10-frameworks-elizaos.md` — character config, plugin-solana, 50+ connectors
- `11-frameworks-lucid-agents.md` — `bunx @lucid-agents/cli create-agent-kit`, x402, A2A, AP2, ERC-8004
- `12-frameworks-swarms.md` — 60+ architectures, `X402 Quickstart`
- `13-frameworks-zerepy.md` — Poetry install, Solana/GOAT/Allora/Jupiter
- `14-frameworks-sak.md` — plugins, wallets (Keypair/Turnkey/Privy), Vercel AI/LangChain/MCP
- `15-frameworks-daydreams-legacy.md` — the obsolete framework + `lucid-agents` redirect

## 3. The 3 protocols

| Protocol | What it does | Spec / SDK | Reference |
|---|---|---|---|
| **x402** | HTTP 402 Payment Required → buyer pays, gets resource | `x402-foundation/x402` · `@x402/*@2.16.0` | [`20-protocols-x402.md`](20-protocols-x402.md) |
| **Solana Actions / Blinks** | Share a signed-tx action as a URL → user clicks in any wallet | `solana-developers/solana-actions` · `@solana/actions@1.6.6` | [`21-protocols-actions-blinks.md`](21-protocols-actions-blinks.md) |
| **Dialect** | On-chain DMs, notifications, blink registry at `dial.to` | `dialectlabs` org | [`22-protocols-dialect.md`](22-protocols-dialect.md) |

## 4. Agent wallets

| Provider | Best for | SDK | Reference |
|---|---|---|---|
| **Crossmint** | Consumer UX (email / passkey / phone OTP) | `@crossmint/wallets-sdk@1.6.0` | [`30-wallets-crossmint-mcpay.md`](30-wallets-crossmint-mcpay.md) |
| **MCPay** | x402 buyer (auto-pay challenges) | `mcpay@0.1.17` | same |
| **Turnkey** | Production agents with policy engine | via `solana-agent-kit/wallets` (TurnkeyWallet) | see `14-frameworks-sak.md` |
| **Privy** | Production agents with human-in-loop | via `solana-agent-kit/wallets` (PrivyWallet) | see `14-frameworks-sak.md` |
| **Phantom Connect** | Browser / mobile wallet connect | `@phantom/mcp-server` or `@solana/wallet-adapter` | see `22-protocols-dialect.md` |
| **Keypair (dev only)** | Dev / test / throwaway agents | raw `@solana/web3.js` or `@solana/kit` | — |

## 5. Agents (load only when needed)

| Agent | Use when | Model |
|---|---|---|
| `framework-picker` | User asks "which framework should I use?" | opus |
| `elizaos-builder` | User wants to spin up ElizaOS on Solana | sonnet |
| `lucid-agents-builder` | User wants `bunx @lucid-agents/cli create-agent-kit` for an x402 agent | sonnet |
| `sak-builder` | User wants SendAI SAK with the right plugins + wallet | sonnet |
| `x402-seller` | User wants to sell a paid API on Solana | sonnet |
| `x402-buyer` | User wants their agent to auto-pay x402 endpoints | sonnet |
| `blink-author` | User wants to publish a Blink to dial.to | sonnet |

## 6. Commands

| Command | What it does |
|---|---|
| `/pick-framework` | Interview the user; recommend the right framework |
| `/scaffold-elizaos-solana` | Full Bun + character + plugin-solana + plugin-x402 scaffold |
| `/scaffold-lucid-agents` | `bunx @lucid-agents/cli create-agent-kit` scaffold with `--NETWORK=solana` |
| `/scaffold-sak-mcp` | Set up `solana-mcp` for Claude Desktop |
| `/publish-blink <name> <icon> <amount>` | Generate Action endpoint, publish to `dial.to`, return URL |
| `/spin-up-x402-seller <port>` | Express + `@x402/express` + SAK trade method |

## 7. Enforced rules (always on)

1. **`rules/x402-base58-case-sensitivity.md`** — Never `.toLowerCase()` a Solana address. **Funds-loss class bug.**
2. **`rules/use-embed-wallet-not-private-key.md`** — For production code, embed a wallet (Crossmint / MCPay / Turnkey / Privy / Phantom). Never `Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY))` in prod.

## 8. Anti-patterns (don't do these)

- ❌ "Use a raw keypair from env in production" → never
- ❌ "toLowerCase() on Solana addresses" → never
- ❌ "Forget CORS on the Action endpoint" → never
- ❌ "Sign x402 payloads without maxPaymentValue guard" → never
- ❌ "Bundle all 60+ SAK tools" → model collapses; use plugins
- ❌ "Use Daydreams for a new build" → it's in maintenance; use Lucid Agents
- ❌ "Pin `@latest`" → use the verified versions in `90-version-compat.md`
- ❌ "Re-skin the sendai `solana-agent-kit` skill" → cross-link, don't duplicate

## 9. Honesty (what this skill does NOT cover)

See [`91-honesty-table.md`](91-honesty-table.md). Short version:
- On-chain program dev (Anchor, Pinocchio) → `solana-dev` skill
- Agent operational safety (kill switch, dry-run, idempotency) → PR #12 `agent-ops-skill`
- Agent wallet policy (approval flows, audit logs) → PR #13 `solana-agent-guardian-skill`
- On-chain spending limits (Squads v4) → PR #16 `cerberus-skill`
- x402 seller security (academic + lint) → PR #19 `x402-seller-security-skill`
- ZK compression / state compression → `light-protocol` skill (sendaifun)
- x402 facilitator selection (detailed) → `helius` skill (helius-labs)

## 10. Reference index (load only what you need)

### Frameworks
- [`00-decision-tree.md`](00-decision-tree.md) — full picker with 8 interview questions
- [`10-frameworks-elizaos.md`](10-frameworks-elizaos.md) — ElizaOS deep dive
- [`11-frameworks-lucid-agents.md`](11-frameworks-lucid-agents.md) — Lucid Agents deep dive
- [`12-frameworks-swarms.md`](12-frameworks-swarms.md) — Swarms deep dive
- [`13-frameworks-zerepy.md`](13-frameworks-zerepy.md) — ZerePy deep dive
- [`14-frameworks-sak.md`](14-frameworks-sak.md) — SendAI solana-agent-kit v2 deep dive
- [`15-frameworks-daydreams-legacy.md`](15-frameworks-daydreams-legacy.md) — Daydreams (obsolete) + lucid-agents redirect

### Protocols
- [`20-protocols-x402.md`](20-protocols-x402.md) — x402 buyer + seller + facilitator selection
- [`21-protocols-actions-blinks.md`](21-protocols-actions-blinks.md) — Solana Actions / Blinks / dial.to
- [`22-protocols-dialect.md`](22-protocols-dialect.md) — Dialect messaging / notifications / inbox

### Wallets
- [`30-wallets-crossmint-mcpay.md`](30-wallets-crossmint-mcpay.md) — Crossmint + MCPay + Turnkey/Privy/Phantom

### Meta
- [`90-version-compat.md`](90-version-compat.md) — the verified version matrix
- [`91-honesty-table.md`](91-honesty-table.md) — what we don't cover
- [`92-production-users.md`](92-production-users.md) — real projects shipping on each framework
- [`99-errors-faq.md`](99-errors-faq.md) — common errors + fixes

---

## Quick install (after this skill is in your project)

```bash
npx skills add https://github.com/AceVikings/solana-agent-frameworks-skill
```

Or:
```bash
git clone https://github.com/AceVikings/solana-agent-frameworks-skill
cd solana-agent-frameworks-skill
./install.sh            # interactive
./install.sh -y         # non-interactive
./install.sh --project  # project-local
```

---

*Verified against live sources on 2026-06-24. If a cited URL or version is stale, run `bash scripts/check-versions.sh` to re-verify.*
