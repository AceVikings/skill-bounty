# hello-lucid-agents-solana

A minimal Lucid Agents agent on Solana with x402 payments.

## What's in this example

- `package.json` — pinned versions: `@lucid-agents/cli@2.5.0` (bin: `create-agent-kit`)
- `agent.ts` — minimal Hono agent with x402 + identity
- `.env.example` — required env vars
- `README.md` — run instructions

## What it demonstrates

- `bunx @lucid-agents/cli create-agent-kit` scaffold (the package's bin is `create-agent-kit`, not `cli`)
- Solana + x402 + A2A + ERC-8004 identity
- AgentCard at `/.well-known/agent.json`
- Paid endpoint at `/api/weather`

## Quick start

```bash
# 1. Install Bun
curl -fsSL https://bun.sh/install | bash

# 2. Generate a Solana wallet (or use an existing one)
solana-keygen new -o wallet.json --no-bip39-passphrase
SOLANA_ADDRESS=$(solana address -k wallet.json)
echo "Your address: $SOLANA_ADDRESS"

# 3. Scaffold with the Lucid Agents CLI
bunx @lucid-agents/cli create-agent-kit hello-lucid-agents-solana \
  --adapter=hono \
  --template=identity \
  --AGENT_NAME=hello-lucid-agents-solana \
  --PAYMENTS_RECEIVABLE_ADDRESS=$SOLANA_ADDRESS \
  --NETWORK=solana \
  --DEFAULT_PRICE=1000
cd hello-lucid-agents-solana

# 4. Install
bun install

# 5. Copy .env.example to .env and fill in
cp ../.env.example .env
# edit .env: SVM_SECRET_KEY (the agent's signer)

# 6. Run
bun run dev
```

## Test

```bash
# Free endpoint
curl -i http://localhost:3000/

# Paid endpoint (returns 402 if no payment)
curl -i http://localhost:3000/api/weather

# AgentCard
curl http://localhost:3000/.well-known/agent.json
```

## ⚠ License warning

`@lucid-agents/core` and `@lucid-agents/identity` are marked "Proprietary" in npm. Read `node_modules/@lucid-agents/core/LICENSE` before deploying commercially. The CLI is MIT.

## Files

- `package.json` — deps
- `agent.ts` — minimal Hono agent
- `.env.example` — env template
- `README.md` — this file

## See also

- `../../references/11-frameworks-lucid-agents.md` — Lucid Agents deep dive
- `../../agents/lucid-agents-builder.md` — the specialist agent
- `../../commands/scaffold-lucid-agents.md` — the scaffold command
- `../../templates/agent.lucid-agents.ts` — minimal agent template
