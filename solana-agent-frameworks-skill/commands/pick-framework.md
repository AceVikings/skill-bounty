---
name: pick-framework
description: Interview the user and recommend the right Solana AI agent framework + wallet + scaffold command. Use when the user is unsure which framework to use.
---

You are running the `/pick-framework` command. Walk the user through the 8 questions and recommend one framework + wallet + scaffold command.

## Step 1: Ask the 8 questions

Ask **one question at a time**, in this order:

1. **Language?** TypeScript/Bun or Python?
2. **Use case?** (agentic commerce / trading bot / X social / community / game / generic)
3. **Single or multi-agent?**
4. **Need x402 / paid APIs?** (yes / no)
5. **Wallet custody model?** (consumer UX with email/passkey / production with policy / dev/test only)
6. **LLM provider?** (OpenAI / Anthropic / local / multi)
7. **Plugin / connector ecosystem?** (50+ connectors / 60+ Solana actions / x402 native)
8. **Deployment target?** (serverless / mobile / standalone server / Seeker)

## Step 2: Match to the matrix

Map the answers to one of:

| Primary answer | Framework | Wallet | Run |
|---|---|---|---|
| TS + agentic commerce + x402 | **Lucid Agents** `@lucid-agents/cli@2.5.0` (bin: `create-agent-kit`) | Crossmint or MCPay | `bunx @lucid-agents/cli create-agent-kit ...` |
| TS + multi-connector + x402 alpha OK | **ElizaOS** `elizaos@beta` + `@elizaos/plugin-solana@1.2.6` | Crossmint or Turnkey | `bun add -g elizaos@beta && elizaos create ...` |
| TS + SendAI SAK ecosystem | **SAK** `solana-agent-kit@2.0.9` | Turnkey or Privy | `npm install solana-agent-kit @solana-agent-kit/*` |
| Python + multi-agent + x402 | **Swarms** | Crossmint (Python) | `pip install -U swarms` |
| Python + X/Twitter | **ZerePy** | Keypair (dev) | `git clone https://github.com/blorm-network/ZerePy` |
| Legacy Daydreams code | migrate to Lucid Agents | — | see `15-frameworks-daydreams-legacy.md` |

## Step 3: Deliver the recommendation

| Field | Value |
|---|---|
| **Primary framework** | `[name + version]` |
| **Why this one** | `[2-3 sentences max]` |
| **Wallet** | `[name + version]` |
| **Scaffold command** | `[the actual shell command to run]` |
| **Tradeoffs accepted** | `[what you're giving up]` |
| **Risk flags** | `[alpha / proprietary / deprecated]` |

## Step 4: Hand off

Once the user has the recommendation, route to the right specialist agent:
- ElizaOS → `agents/elizaos-builder.md`
- Lucid Agents → `agents/lucid-agents-builder.md`
- SAK → `agents/sak-builder.md`

## Reference

- `references/00-decision-tree.md` — the full picker
- `references/91-honesty-table.md` — what we don't cover
- `references/90-version-compat.md` — verified version pins
- `agents/framework-picker.md` — the specialist picker
