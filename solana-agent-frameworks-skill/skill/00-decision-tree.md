# Decision Tree — Which Solana AI agent framework for this stack?

This is the full version of the picker. Use `/pick-framework` to run it interactively, or walk through it yourself.

## Question 1 — Language

- **TypeScript** → ElizaOS, Lucid Agents, SendAI SAK, or Daydreams (legacy)
- **Python** → Swarms or ZerePy
- **Both** (polyglot via MCP) → ElizaOS + SAK (TS) ↔ Swarms (Python) over MCP

## Question 2 — Use case

- **Agentic commerce / x402 paid APIs** → Lucid Agents (TS) or Swarms (Python)
- **Trading bot / market making** → Swarms (multi-agent) or SAK (single-agent with Jupiter)
- **X / Twitter social agent** → ZerePy or ElizaOS (with `plugin-twitter`)
- **Discord / Telegram community agent** → ElizaOS (50+ connectors) or SAK
- **Game agent / on-chain character** → SAK + MagicBlock
- **Generic "I have an OpenAI key and want to talk to a wallet"** → ElizaOS (default for TS) or SAK (default for "toolkit")

## Question 3 — Multi-agent or single?

- **Single agent** → ElizaOS, SAK, ZerePy
- **Multi-agent orchestration** → Swarms (60+ architectures) or Lucid Agents (multi-agent commerce flows)

## Question 4 — Must integrate with x402?

- **Yes, paid APIs are the whole point** → Lucid Agents (native x402) or Swarms (native X402 Quickstart)
- **No, just on-chain actions** → ElizaOS / SAK / ZerePy

## Question 5 — Wallet custody model?

- **Consumer UX (email / passkey)** → Crossmint `@crossmint/wallets-sdk`
- **Production agent with policy** → Turnkey or Privy (via SAK)
- **x402 buyer auto-payer** → MCPay `mcpay/client`
- **Dev / test** → Keypair from `process.env.SOLANA_PRIVATE_KEY`

## Question 6 — LLM provider?

- **OpenAI** → all 6 work
- **Anthropic** → all 6 work
- **Local (Ollama, LMStudio, vLLM)** → ElizaOS (full support), Swarms, SAK
- **Multiple LLMs in one agent** → Swarms (multi-model) or ElizaOS

## Question 7 — Plugin / connector ecosystem?

- **50+ connectors (Discord, Telegram, Farcaster, Twitter, Slack, etc.)** → **ElizaOS**
- **60+ Solana protocol integrations (Jupiter, Raydium, Meteora, etc.)** → **SendAI SAK**
- **x402 / A2A / AP2 / ERC-8004** → **Lucid Agents**

## Question 8 — Production deployment?

- **Already on Vercel / Cloudflare / similar** → any of them
- **Mobile (React Native / Expo)** → ElizaOS (with `@elizaos/plugin-react-native`) or SAK
- **Seeker / Mobile Wallet Adapter** → SAK (best Solana Mobile coverage)
- **Standalone server (Node/Bun/Python)** → any

---

## Decision output

Map the answers to a primary framework + a wallet:

| Primary answer | Framework | Wallet | Run |
|---|---|---|---|
| TS + agentic commerce + x402 | Lucid Agents | Crossmint or MCPay | `/scaffold-lucid-agents` |
| TS + multi-connector + x402 alpha | ElizaOS | Crossmint or Turnkey | `/scaffold-elizaos-solana` |
| TS + SendAI SAK ecosystem | SAK | Turnkey or Privy | `/scaffold-sak-mcp` |
| Python + multi-agent + x402 | Swarms | Crossmint (Python) | see `12-frameworks-swarms.md` |
| Python + X/Twitter | ZerePy | Keypair (dev) or SAK wallet | see `13-frameworks-zerepy.md` |
| Legacy Daydreams | migrate to Lucid Agents | same | see `15-frameworks-daydreams-legacy.md` |

---

## Edge cases

### "I want all of them"

You don't. Pick the primary. Then bridge to others via MCP or HTTP.

### "My team only knows Python"

Pick **Swarms**. It has the broadest Python x402 support and the multi-agent orchestration primitives.

### "I have $50K to spend on an AI agent in 3 weeks"

Pick **ElizaOS**. Mature, documented, 50+ plugins, biggest community.

### "I'm building a paid API for AI agents to consume"

You're a seller. Pick **Lucid Agents** + the **x402-seller agent**. Pair with the x402-seller-security skill (PR #19) for the audit layer.

### "I'm building an AI agent that consumes paid APIs"

You're a buyer. Pick **Swarms** (Python) or **Lucid Agents** (TS). Pair with the **x402-buyer agent**.

### "I have a Lucid Agents / ElizaOS / Swarms agent and need to add a wallet"

Read [`30-wallets-crossmint-mcpay.md`](30-wallets-crossmint-mcpay.md). Crossmint works in all 3. MCPay is the lightest if you only need x402.

### "I want to send notifications / DMs from my agent"

Read [`22-protocols-dialect.md`](22-protocols-dialect.md). Dialect covers it across all frameworks.
