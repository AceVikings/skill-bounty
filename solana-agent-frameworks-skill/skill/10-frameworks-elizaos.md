# ElizaOS — Deep Dive

> **Repo:** https://github.com/elizaOS/eliza
> **Stars:** 18.6k · **License:** MIT · **Default branch:** `develop`
> **Latest:** `elizaos@beta` (CLI), `@elizaos/core`, `@elizaos/agent`
> **Install (project):** `bun add -g elizaos@beta` then `elizaos create my-first-agent --template project`
> **Original author:** Shaw (now "shawticus" on npm)

## What it is

The most-mature, most-connected TypeScript framework for AI agents. 50+ first-party plugins, 2,151+ commits, active development, mature plugin model.

**Two important notes:**

1. **Project was renamed.** The old `ai16z` org is read-only archived. **Use `elizaOS/eliza`** — never link to the old repo.
2. **`@elizaos/plugin-x402` is alpha** (v2.0.0-alpha.1). Don't put it in production-critical paths. For production x402, use Lucid Agents.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                       elizaOS                            │
│                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────┐ │
│  │  @elizaos/core  │  │ @elizaos/agent │  │  elizaos   │ │
│  │  agent loop,    │  │  AgentRuntime, │  │  CLI       │ │
│  │  plugin model,  │  │  default       │  │  create,   │ │
│  │  LLM adapter    │  │  plugin map    │  │  info,     │ │
│  └────────────────┘  └────────────────┘  │  upgrade   │ │
│                                          └────────────┘ │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────┐ │
│  │   Connectors   │  │    Providers   │  │  Services  │ │
│  │ Discord, TG,   │  │ Twitter/X,     │  │  long-     │ │
│  │ Farcaster,     │  │ Bluesky, iMsg, │  │  running   │ │
│  │ Slack, etc.    │  │ Nostr, GitHub  │  │  tasks     │ │
│  └────────────────┘  └────────────────┘  └────────────┘ │
│                                                          │
│  3-layer: framework → project → app plugin              │
│  3 plugin hooks: actions, providers, services            │
└──────────────────────────────────────────────────────────┘
```

## Solana plugin

| Field | Value |
|---|---|
| npm | `@elizaos/plugin-solana` v1.2.6 |
| Maintainer | shawticus (Shaw, ElizaOS founder) |
| Deps | `@solana/web3.js`, `@solana/spl-token`, Jupiter, Birdeye, Helius, Anchor, FOMO.fund, Pump.fun |
| Providers | `TokenProvider`, `WalletProvider`, `TrustScoreProvider` |
| Actions | `EXECUTE_SWAP`, `SEND_TOKEN`, `SEND_SOL`, `TAKE_ORDER`, `CREATE_AND_BUY_TOKEN` (Pump.fun/FOMO), `EXECUTE_SWAP_DAO` |
| Env vars | `WALLET_SECRET_SALT`, `WALLET_SECRET_KEY`, `WALLET_PUBLIC_KEY`, `SOL_ADDRESS`, `SLIPPAGE`, `SOLANA_RPC_URL`, `HELIUS_API_KEY`, `BIRDEYE_API_KEY` |

### x402 plugin (alpha)

| Field | Value |
|---|---|
| npm | `@elizaos/plugin-x402@2.0.0-alpha.1` |
| License | MIT |
| Deps | `better-sqlite3 11.7.0`, `pg 8.13.1`, `viem 2.21.0` |
| Maintainers | Shaw (`shawticus`), `odilitime` |
| Source | Migrated to `elizaos/eliza` monorepo (the old `elizaos-plugins/plugin-x402` URL is 404). Look in `packages/agent/src/api/x402-route-validation.ts` and `packages/cloud-api/v1/x402/*` |
| Status | **Alpha** — multiple dist-tags exist (`alpha: 2.0.0-alpha.5`, `beta: 2.0.0-beta.1`, `latest: 2.0.0-alpha.1`, `next: 2.0.0-alpha.6`). Pin to a specific tag |

**Honest take:** ElizaOS x402 plugin is young. For production x402, use Lucid Agents or wire `@x402/svm` directly. If you must use ElizaOS, pin `2.0.0-alpha.1` and accept the alpha status.

## Hello-world (verified)

```bash
bun add -g elizaos@beta
elizaos create my-first-agent --template project
cd my-first-agent
echo 'OPENAI_API_KEY=sk-...' > .env
bun install
bun run dev
```

### Character config

```json
{
  "name": "SolanaHelper",
  "bio": ["Solana DeFi assistant"],
  "plugins": ["@elizaos/plugin-solana", "@elizaos/plugin-twitter"],
  "topics": ["solana", "defi", "jupiter", "jito"],
  "postExamples": ["Just analyzed JitoSOL yield — 7.2% APY"]
}
```

## Connectors shipped (50+)

Discord · Telegram · Farcaster · Twitter/X · Bluesky · browser · video · TEE · calendar · contacts · files · Linear · GitHub · Nostr · Matrix · iMessage · BlueBubbles · Google Chat · Feishu · Line · Instagram · Slack — and many more.

## Model providers

OpenAI · Anthropic · Google GenAI · Groq · Llama local · Ollama · LMStudio · xAI · NearAI

## Memory

`@elizaos/plugin-sql` (default) + ChromaDB / Supabase / Mongo (community)

## Production users

- **ElizaOS DAO** — original governance
- **ai16z** — historic; token ticker still around
- **Shaw's launches** — multiple agent projects

⚠ The 18.6k stars are a proxy. Don't claim specific enterprise customers without receipts.

## When to choose ElizaOS

- You want **the most connectors** (50+)
- You're building a **TS / Bun** stack
- You want **the largest community** (Discord, GitHub)
- x402 is **not your primary use case** (use Lucid Agents if it is)
- You have **time to learn the plugin model** (3 hooks: actions, providers, services)

## When NOT to choose ElizaOS

- You need **production x402** (use Lucid Agents)
- You want **Python** (use Swarms or ZerePy)
- You want a **single toolkit** not a framework (use SendAI SAK)

## Risk flags

- **x402 plugin is alpha** — not production-ready
- **`plugin-solana` v1.2.6** is stable but Solana Actions integration is via `plugin-blinks` (older SAK-style flow)
- **Default branch is `develop`** — pin your version

## See also

- `00-decision-tree.md` — when to pick ElizaOS
- `11-frameworks-lucid-agents.md` — the x402-first alternative
- `14-frameworks-sak.md` — if you want SAK's protocol coverage
- `../examples/hello-elizaos-solana/` — runnable example
- `../templates/character.elizaos.json` — minimal character file
