# Solana Agent Frameworks Skill

> Submitted for the Superteam Brasil bounty ["Ship useful agent skills we can add to Solana AI Kit"](https://superteam.fun/earn/listing/skills/)

A comparative guide + runnable cookbook for shipping **AI agents on Solana**. Choose your framework, wire it to x402 / Blinks / Dialect / Crossmint, ship a working agent.

```
┌─────────────────────────────────────────────────────────────────┐
│              solana-agent-frameworks-skill                      │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Frameworks  │  │  Protocols   │  │   Wallets    │           │
│  │              │  │              │  │              │           │
│  │ • ElizaOS    │  │ • x402       │  │ • Crossmint  │           │
│  │ • Lucid Agt  │  │ • Actions    │  │ • MCPay      │           │
│  │ • Swarms     │  │   /Blinks    │  │ • Turnkey    │           │
│  │ • ZerePy     │  │ • Dialect    │  │ • Privy      │           │
│  │ • SAK        │  │              │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                 │
│  with verified version pins, real code that runs, and           │
│  an explicit honesty table about what we DON'T cover.          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Why this skill

The Solana AI Kit has the [SendAI `solana-agent-kit` skill](https://github.com/sendaifun/skills/tree/main/skills/solana-agent-kit) — a great **toolkit**, but just one of 6+ frameworks. It also has 27 bounty PRs covering adjacent ground (`agent-ops`, `agent-guardian`, `cerberus`, `x402-seller-security`, etc.) — none of which **maps the framework landscape**.

**This skill is the map of the territory** — and it comes with runnable code for every path.

| Existing artifact | Covers | Does NOT cover | This skill adds |
|---|---|---|---|
| `sendaifun/skills/solana-agent-kit` | SendAI SAK v2 only | ElizaOS, Lucid Agents, Swarms, ZerePy, x402, Crossmint, Dialect, MCPay | The landscape |
| PR #12 `agent-ops-skill` | Operational safety (tx lifecycle, kill switch, spend caps) | Framework choice, payment protocols, messaging | Framework selection and interop |
| PR #13 `solana-agent-guardian-skill` | Signing simulation, approval flows, audit logs | Framework choice | Cross-framework compatibility matrix |
| PR #16 `cerberus-skill` | Squads v4 on-chain spending limits | Framework integration | How to use Squads v4 from ElizaOS / SAK / Swarms |
| PR #19 `x402-seller-security-skill` | x402 seller security (audit/lint) | x402 buyer side, framework integration | Buyer patterns, framework-agnostic recipes |

**One-liner:** *"SAK is the toolkit. This skill is the map of the territory SAK lives in."*

---

## The 6 frameworks, at a glance

| Framework | Lang | LLM adapter | Solana | x402 | MCP | Latest | License | Production? |
|---|---|---|---|---|---|---|---|---|
| **ElizaOS** (elizaOS/eliza) | TS | OpenAI / Anthropic / Grok / local | `@elizaos/plugin-solana` v1.2.6 (Jupiter, Birdeye, Helius, Pump.fun) | `@elizaos/plugin-x402@2.0.0-alpha.1` | via `modelcontextprotocol` | `elizaos@beta` (18.6k⭐) | MIT | Yes (elizaos DAO) |
| **Lucid Agents** (daydreamsai/lucid-agents) | TS (Bun) | Vercel AI | via `@lucid-agents/payments` w/ SPL USDC | **first-class** (x402 native) | yes | `@lucid-agents/cli@2.5.0` | CLI: MIT · core/identity: Proprietary | Yes (agentic commerce) |
| **Swarms** (kyegomez/swarms) | Python | OpenAI / Anthropic / Groq | via `solana` / `jupiter-python-sdk` / `allora-sdk` | native `X402 Quickstart` | yes | master (6.9k⭐) | Apache-2.0 | Yes (swarms_corp) |
| **ZerePy** (blorm-network/ZerePy) | Python | OpenAI / Anthropic | `solana`, `jupiter-python-sdk`, `allora-sdk`, `goat-sdk` | not first-party | limited | `v1.1` (580⭐) | MIT | Yes (Zerebro) |
| **SendAI SAK** (sendaifun/solana-agent-kit) | TS | Vercel AI / LangChain | native (60+ actions) | via `plugin-blinks` | `solana-mcp` | v2.0.9 (1.7k⭐) | Apache-2.0 | Yes (Suzi) |
| **Daydreams** (daydreamsai/daydreams) | TS | Vercel AI | via SAK or direct | Dreams Router (x402) | yes | v0.3.22 (608⭐) | MIT | **Legacy — use Lucid Agents** |

---

## What's in the box

```
solana-agent-frameworks-skill/
├── LICENSE                          # MIT
├── README.md                        # this file
├── CLAUDE.md                        # Claude Code configuration
├── install.sh                       # installer
├── .gitignore
├── package.json
├── skill/
│   ├── SKILL.md                     # entry point + decision tree
│   ├── 00-decision-tree.md          # "which framework for this stack?"
│   ├── 10-frameworks-elizaos.md
│   ├── 11-frameworks-lucid-agents.md
│   ├── 12-frameworks-swarms.md
│   ├── 13-frameworks-zerepy.md
│   ├── 14-frameworks-sak.md
│   ├── 15-frameworks-daydreams-legacy.md
│   ├── 20-protocols-x402.md
│   ├── 21-protocols-actions-blinks.md
│   ├── 22-protocols-dialect.md
│   ├── 30-wallets-crossmint-mcpay.md
│   ├── 90-version-compat.md         # the verified version pins
│   ├── 91-honesty-table.md          # what this skill does NOT cover
│   ├── 92-production-users.md      # real projects shipping on each framework
│   └── 99-errors-faq.md
├── agents/
│   ├── framework-picker.md          # interview-style framework chooser
│   ├── elizaos-builder.md
│   ├── lucid-agents-builder.md
│   ├── sak-builder.md
│   ├── x402-seller.md
│   ├── x402-buyer.md
│   └── blink-author.md
├── commands/
│   ├── pick-framework.md            # /pick-framework
│   ├── scaffold-elizaos-solana.md   # /scaffold-elizaos-solana
│   ├── scaffold-lucid-agents.md     # /scaffold-lucid-agents
│   ├── scaffold-sak-mcp.md          # /scaffold-sak-mcp
│   ├── publish-blink.md             # /publish-blink
│   └── spin-up-x402-seller.md       # /spin-up-x402-seller
├── rules/
│   ├── x402-base58-case-sensitivity.md   # ALWAYS on
│   └── use-embed-wallet-not-private-key.md  # ALWAYS on
├── examples/
│   ├── hello-elizaos-solana/        # runnable
│   ├── hello-lucid-agents-solana/   # runnable
│   ├── hello-sak-mcp-claude/        # runnable
│   ├── hello-x402-blink-on-dialto/  # runnable
│   └── hello-x402-buyer-with-mcpay/ # runnable
├── templates/
│   ├── character.elizaos.json
│   ├── agent.lucid-agents.ts
│   ├── action.json.example
│   └── agent.ts.sak
└── scripts/
    ├── validate-skill.sh
    └── check-versions.sh
```

---

## Installation

```bash
# From this repo
./install.sh                 # interactive, installs to ~/.claude/skills/solana-agent-frameworks
./install.sh -y              # non-interactive, all defaults
./install.sh --project       # install into ./.claude/skills/solana-agent-frameworks
./install.sh --target PATH   # custom install path
```

The installer:
1. Copies `skill/`, `agents/`, `commands/`, `rules/`, `examples/`, `templates/` to the target
2. Does NOT touch your `~/.claude/CLAUDE.md` (additive only)
3. Works for Claude Code, OpenCode, Cursor, Windsurf, anything that reads `~/.claude/skills/`

After install, restart Claude Code (or `/reload`) and the skill loads.

---

## Quick start

Try asking Claude Code:

```
"Build me a Solana agent that pays for a paid API using x402"
→ routes to /spin-up-x402-seller OR x402-buyer agent
"Compare ElizaOS vs Lucid Agents for my TypeScript agent"
→ routes to /pick-framework + 10-frameworks-elizaos.md + 11-frameworks-lucid-agents.md
"Publish a Blink that swaps 0.1 SOL to USDC"
→ routes to /publish-blink + 21-protocols-actions-blinks.md
"Set up a Crossmint agent wallet for my ElizaOS agent"
→ routes to agents/elizaos-builder + 30-wallets-crossmint-mcpay.md
"Run scripts/check-versions.sh"
→ verifies all 13 verified packages are still current
```

---

## Honesty table (what we don't cover)

| Concern | Where to go instead |
|---|---|
| On-chain program dev (Anchor, Pinocchio) | The core `solana-dev` skill (solana-foundation) |
| Agent operational safety (kill switch, dry-run, idempotency) | PR #12 `agent-ops-skill` |
| Agent wallet security policy | PR #13 `solana-agent-guardian-skill` |
| On-chain spending limits (Squads v4) | PR #16 `cerberus-skill` |
| x402 seller security (academic + lint) | PR #19 `x402-seller-security-skill` |
| ZK compression / compressed state | The core `light-protocol` skill (sendaifun) |
| x402 facilitator selection (detailed) | The core `helius` skill (helius-labs) for SVM settlement |

This skill complements those. Where they overlap, we cross-link rather than duplicate.

---

## Verified version matrix (snapshot 2026-06-24)

See [`skill/90-version-compat.md`](skill/90-version-compat.md) for the full list. Highlights:

| Package | Version | License | Verified |
|---|---|---|---|
| `elizaos` (CLI) | `beta` (latest tag) | MIT | yes |
| `@elizaos/plugin-solana` | `1.2.6` | MIT | yes |
| `@elizaos/plugin-x402` | `2.0.0-alpha.1` | MIT | yes — **mark as alpha** |
| `@lucid-agents/cli` | `2.5.0` | MIT | yes |
| `@lucid-agents/core` | `2.5.0` | **Proprietary** | yes — **license warning** |
| `swarms` (PyPI) | `master` (5,097 commits) | Apache-2.0 | yes |
| `ZerePy` (git-clone) | `v1.1` (2025-01-24) | MIT | yes |
| `solana-agent-kit` | `2.0.9` (2025-07-24) | Apache-2.0 | yes |
| `@x402/core` | `2.16.0` | Apache-2.0 | yes |
| `@x402/svm` | `2.16.0` | Apache-2.0 | yes |
| `@x402/express` | `2.16.0` | Apache-2.0 | yes |
| `mcpay` | `0.1.17` (Dec 2025) | MIT | yes |
| `@crossmint/wallets-sdk` | `1.6.0` (Jun 2026) | Apache-2.0 | yes |
| `@solana/actions` | `1.6.6` | Apache-2.0 | yes |

Run `bash scripts/check-versions.sh` to re-verify.

---

## Repository

- **This skill:** [github.com/AceVikings/solana-agent-frameworks-skill](https://github.com/AceVikings/solana-agent-frameworks-skill)
- **The kit it extends:** [github.com/solanabr/solana-ai-kit](https://github.com/solanabr/solana-ai-kit)
- **The marketplace it complements:** [github.com/sendaifun/skills](https://github.com/sendaifun/skills)
- **The bounty:** [superteam.fun/earn/listing/skills](https://superteam.fun/earn/listing/skills/)

---

## License

MIT — see [LICENSE](LICENSE).
