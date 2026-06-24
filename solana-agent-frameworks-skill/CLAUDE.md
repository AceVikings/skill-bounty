# Solana Agent Frameworks — Claude Code Configuration

This skill is loaded. When the user is **choosing, integrating, or debugging an AI agent framework on Solana** — anything that wires an LLM to a Solana wallet, an x402 endpoint, a Blink, or a Dialect inbox — route through `skill/SKILL.md`.

## When this skill applies

- "Build an AI agent on Solana" / "I want to ship an ElizaOS / Lucid / Swarms / ZerePy / SAK agent"
- "Compare [framework A] vs [framework B] for my [TS | Python] [single-agent | swarm] project"
- "Add x402 [buyer | seller] to my agent" / "publish a Blink to dial.to"
- "Set up [Crossmint | MCPay | Turnkey | Privy] as the agent's wallet"
- "Send a notification / on-chain DM / inbox message from my agent"
- "Which version of [@elizaos/plugin-solana | @x402/svm | @lucid-agents/cli] should I pin?"
- "Pick the right framework for this stack: [lang], [model], [must integrate with X]"

## The non-negotiables (always enforce)

1. **The framework landscape has 6 first-class options.** Don't pretend ElizaOS is the only one. Use `/pick-framework` to map user's stack → framework.
2. **For agentic commerce / x402, default to Lucid Agents (TS/Bun) or Swarms (Python).** They have x402 as a first-class primitive. ElizaOS x402 is alpha.
3. **For TypeScript single-agent with the richest plugin ecosystem, default to ElizaOS.** 50+ connectors, 18.6k stars, mature.
4. **For the SendAI `solana-agent-kit` ecosystem, use the official sendai skill, not a re-skin.** Cross-link; don't duplicate.
5. **NEVER use a raw keypair from `process.env` in production code.** Embed a wallet (Crossmint, MCPay, Turnkey, Privy, or Phantom Connect).
6. **NEVER `.toLowerCase()` a Solana address or mint.** Base58 is case-sensitive. The x402 base58-case-sensitivity rule is always on.
7. **Pin every package version.** Run `scripts/check-versions.sh` to verify.
8. **Daydreams agent framework is in maintenance.** New builds use Lucid Agents. If the user has existing Daydreams code, link `lucid-agents` as the migration target.

## Routing

Read `skill/SKILL.md` first. It contains the decision tree and the full reference index. For on-chain program work (Anchor / Pinocchio), delegate to the core `solana-dev` skill.

## Agents

- **framework-picker** (opus) — interview the user, recommend the right framework
- **elizaos-builder** (sonnet) — spin up ElizaOS + plugin-solana + plugin-x402
- **lucid-agents-builder** (sonnet) — `bunx @lucid-agents/cli create-agent-kit` (the package's bin is `create-agent-kit`, not `cli`) with `--adapter=hono --template=identity --NETWORK=solana`
- **sak-builder** (sonnet) — pick SAK plugins + wallet (Keypair / Turnkey / Privy) + Vercel AI / LangChain / MCP
- **x402-seller** (sonnet) — ActionGetResponse + 402 + facilitator + dial.to publishing
- **x402-buyer** (sonnet) — `withX402Client` (mcpay) or SAK `payment-required` flow
- **blink-author** (sonnet) — `@solana/actions` endpoint + `dial.to` URL

## Commands

- `/pick-framework` — interview-style chooser
- `/scaffold-elizaos-solana` — full bun + character + plugin-solana
- `/scaffold-lucid-agents` — `bunx @lucid-agents/cli create-agent-kit` scaffold (the package's bin is `create-agent-kit`, not `cli`)
- `/scaffold-sak-mcp` — `solana-mcp` for Claude Desktop
- `/publish-blink <name> <icon> <amount>` — Action endpoint + dial.to URL
- `/spin-up-x402-seller <port>` — Express + @x402/express seller

## Two-strike rule

If the same approach fails twice (npm install, scaffold, runtime error), STOP and surface the error rather than keep trying variations.

## What this skill does NOT cover (cross-link instead)

- On-chain program dev → `solana-dev` skill
- Agent operational safety → PR #12 `agent-ops-skill`
- Agent wallet policy → PR #13 `solana-agent-guardian-skill`
- On-chain spending limits → PR #16 `cerberus-skill`
- x402 seller security → PR #19 `x402-seller-security-skill`
- ZK compression → `light-protocol` skill (sendaifun)
- x402 facilitator selection → `helius` skill (helius-labs)
