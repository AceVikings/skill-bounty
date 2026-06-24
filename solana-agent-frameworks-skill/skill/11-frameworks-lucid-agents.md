# Lucid Agents — Deep Dive (the current Daydreams direction)

> **Repo:** https://github.com/daydreamsai/lucid-agents
> **Default branch:** `master` · **License:** CLI = MIT · core/identity = Proprietary
> **Latest:** `@lucid-agents/cli@2.5.0` (2026-02-14)
> **Maintainer:** `realm_lord <realm.lord.eth@gmail.com>` (the Daydreams founder)
> **Install (verified 2026-06-24):** `bunx @lucid-agents/cli create-agent-kit my-agent --adapter=hono --template=identity --AGENT_NAME=... --PAYMENTS_RECEIVABLE_ADDRESS=... --NETWORK=solana --DEFAULT_PRICE=1000`
>
> (shorthand `bunx create-agent-kit my-agent` works after `npm i @lucid-agents/cli -g` or local install)
>
> ⚠ The package's actual `bin` is `create-agent-kit`, not `cli`. `bunx create-agent-kit my-agent` will fail with "command not found" (there's no top-level `create-agent-kit` package). **Use `bunx @lucid-agents/cli create-agent-kit my-agent`**. The shorthand `bunx create-agent-kit` only works after you've installed `@lucid-agents/cli` locally.

## What it is

The **current** focus of the Daydreams team. After Daydreams the agent framework was marked in-maintenance, the team built **Lucid Agents** as a first-class agentic commerce SDK with native x402, A2A, AP2, and ERC-8004 support.

**Two important notes:**

1. **License split.** The `cli` package is MIT. `core` and `identity` are marked **"Proprietary"** in npm. **Investigate before recommending for production builds.** The CLI scaffolding tool (MIT) is safe to use.
2. **It's the Daydreams successor.** If you see old Daydreams examples online, they're for the obsolete framework.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Lucid Agents                                │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌────────────────────┐ │
│  │  @lucid-      │  │  @lucid-      │  │  @lucid-agents/    │ │
│  │  agents/cli   │  │  agents/core  │  │  identity          │ │
│  │  (MIT)        │  │  (Proprietary)│  │  (Proprietary)     │ │
│  │  bunx scaff.  │  │  agent loop   │  │  ERC-8004          │ │
│  └───────────────┘  └───────────────┘  └────────────────────┘ │
│                                                                 │
│  18 sub-packages: a2a, analytics, ap2, api-sdk, catalog,       │
│  cli, core, eslint-config, examples, express, hono, http,       │
│  identity, mpp, payments, prettier-config, scheduler,           │
│  tanstack                                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Feature matrix (verified 2026-06-24)

- ✅ **x402** — first-class, native integration
- ✅ **A2A** — Agent-to-Agent protocol
- ✅ **AP2** — Agent Payments Protocol
- ✅ **ERC-8004** — agent identity standard
- ✅ **SPL USDC on Solana** — mainnet + devnet
- ✅ **Multi-framework adapters** — Hono, TanStack (UI + headless), Express, Next
- ✅ **Pay-per-call endpoints** with payment policies
- ✅ **Bi-directional payment tracking**
- ✅ **SSE streaming**
- ✅ **AgentCard auto-discovery** at `/.well-known/agent.json`

## Networks

- **EVM:** Base, Ethereum, Sepolia
- **Solana:** mainnet, devnet (with SPL USDC)

## Hello-world (verified)

```bash
bunx @lucid-agents/cli create-agent-kit my-agent \
  --adapter=hono \
  --template=identity \
  --AGENT_NAME=my-solana-agent \
  --PAYMENTS_RECEIVABLE_ADDRESS=<your-solana-wallet> \
  --NETWORK=solana \
  --DEFAULT_PRICE=1000
```

This generates a Bun project wired with:
- The Hono adapter
- x402 payment middleware
- ERC-8004 identity
- AgentCard at `/.well-known/agent.json`
- Sample paid endpoint

Then:
```bash
cd my-agent
bun install
bun run dev
```

## License deep-dive

| Package | License | Production-safe? |
|---|---|---|
| `@lucid-agents/cli` | MIT | yes |
| `@lucid-agents/core` | "Proprietary" (per npm) | **investigate** — proprietary licenses in npm can restrict commercial use |
| `@lucid-agents/identity` | "Proprietary" | same |
| `@lucid-agents/payments` | (verify) | verify |
| `@lucid-agents/a2a` | (verify) | verify |
| `@lucid-agents/hono` | (verify) | verify |
| `@lucid-agents/express` | (verify) | verify |

**Action:** Before recommending for production, run `npm view @lucid-agents/core license` and read the actual license text. If it says "UNLICENSED" or "SEE LICENSE IN ...", you must read the source.

## When to choose Lucid Agents

- **Agentic commerce is your primary use case** (paid APIs, x402, M2M payments)
- You're on **TypeScript + Bun** (the framework assumes Bun)
- You need **agent identity** (ERC-8004)
- You want **A2A multi-agent flows**
- You're comfortable with **a Proprietary license** for `core`/`identity` (or use the CLI to scaffold and rip out the proprietary bits)

## When NOT to choose Lucid Agents

- You want **MIT-only stack** end-to-end (use ElizaOS or SAK instead)
- You need **Python** (use Swarms)
- You want **maximum plugin ecosystem** (ElizaOS has 50+)

## Risk flags

- **Proprietary license on `core`/`identity`** — confirm before commercial use
- **Bun-only** — no Node fallback
- **Tied to Daydreams org** — if the team pivots again, you're on the hook

## See also

- `00-decision-tree.md` — when to pick Lucid Agents
- `10-frameworks-elizaos.md` — the x402-alpha alternative
- `15-frameworks-daydreams-legacy.md` — the obsolete Daydreams framework
- `20-protocols-x402.md` — x402 deep dive
- `../examples/hello-lucid-agents-solana/` — runnable example
- `../templates/agent.lucid-agents.ts` — minimal agent template
