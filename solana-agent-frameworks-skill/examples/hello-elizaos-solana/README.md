# hello-elizaos-solana

A minimal ElizaOS agent on Solana with the verified plugin set.

## What's in this example

- `package.json` — pinned versions: `elizaos@beta`, `@elizaos/plugin-solana@1.2.6`, `@elizaos/plugin-twitter@1.2.22`
- `character.json` — minimal character config (SolanaHelper)
- `.env.example` — required env vars
- `README.md` — run instructions

## What it demonstrates

- Bun-based ElizaOS scaffold
- Solana plugin (Jupiter, Birdeye, Helius, Anchor, FOMO.fund, Pump.fun actions)
- Twitter plugin (read-only, for context)
- Env-driven config
- Swap test: "swap 0.1 SOL to USDC" → Jupiter quote

## Quick start

```bash
# 1. Install Bun
curl -fsSL https://bun.sh/install | bash

# 2. Install ElizaOS CLI
bun add -g elizaos@beta

# 3. Create the project
elizaos create hello-elizaos-solana --template project
cd hello-elizaos-solana

# 4. Install the verified Solana plugin set
bun add @elizaos/plugin-solana@1.2.6
bun add @elizaos/plugin-twitter@1.2.22

# 5. Copy character.json from this directory
cp ../character.json .

# 6. Copy .env.example to .env and fill in
cp ../.env.example .env
# edit .env: OPENAI_API_KEY, SOLANA_RPC_URL, HELIUS_API_KEY, BIRDEYE_API_KEY, WALLET_*

# 7. Run
bun install
bun run dev
```

## Test

In the REPL:
```
> swap 0.1 SOL to USDC
```

The agent should respond with a Jupiter swap quote and (if approved) a transaction signature.

## Files

- `package.json` — deps and scripts
- `character.json` — agent personality + plugin list
- `.env.example` — env var template
- `README.md` — this file

## See also

- `../../references/10-frameworks-elizaos.md` — ElizaOS deep dive
- `../../agents/elizaos-builder.md` — the specialist agent
- `../../commands/scaffold-elizaos-solana.md` — the scaffold command
- `../../templates/character.elizaos.json` — character file template
