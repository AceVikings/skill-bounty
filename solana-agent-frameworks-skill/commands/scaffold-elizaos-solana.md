---
name: scaffold-elizaos-solana
description: Full Bun + ElizaOS + plugin-solana + plugin-twitter scaffold. End-to-end runnable in <60s. Use when the user has chosen ElizaOS.
---

You are running the `/scaffold-elizaos-solana` command. Scaffold a working ElizaOS agent on Solana with the verified plugin set.

## Step 1: Install Bun (if not present)

```bash
if ! command -v bun >/dev/null 2>&1; then
  echo "Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi
bun --version
```

## Step 2: Install ElizaOS CLI

```bash
bun add -g elizaos@beta
elizaos --version
```

## Step 3: Create the project

```bash
elizaos create my-solana-agent --template project
cd my-solana-agent
```

## Step 4: Install the verified Solana plugin set

```bash
bun add @elizaos/plugin-solana@1.2.6
bun add @elizaos/plugin-twitter@1.2.22
# Optional x402 (alpha — flag to the user)
# bun add @elizaos/plugin-x402@2.0.0-alpha.1
```

## Step 5: Write `character.json`

```json
{
  "name": "SolanaHelper",
  "bio": ["Solana DeFi assistant"],
  "plugins": ["@elizaos/plugin-solana", "@elizaos/plugin-twitter"],
  "topics": ["solana", "defi", "jupiter", "jito"],
  "postExamples": ["Just analyzed JitoSOL yield — 7.2% APY"]
}
```

## Step 6: Write `.env` (template)

```bash
cat > .env <<'EOF'
OPENAI_API_KEY=sk-...
WALLET_SECRET_KEY=<base58-devnet-wallet>
WALLET_PUBLIC_KEY=<base58-public>
SOL_ADDRESS=<base58-public>
SOLANA_RPC_URL=https://api.devnet.solana.com
HELIUS_API_KEY=
BIRDEYE_API_KEY=
SLIPPAGE=0.5
EOF
```

⚠ **NEVER** commit `.env`. Add `.env` to `.gitignore` (it should already be there from the template).

## Step 7: Run

```bash
bun install
bun run dev
```

## Step 8: Test

```bash
# In the REPL, type:
> swap 0.1 SOL to USDC
```

The agent should respond with a Jupiter swap quote and (if you approve) a transaction signature.

## Reference

- `references/10-frameworks-elizaos.md` — ElizaOS deep dive
- `references/90-version-compat.md` — verified versions
- `references/99-errors-faq.md` — common errors
- `examples/hello-elizaos-solana/` — runnable example
- `templates/character.elizaos.json` — minimal character file
- `agents/elizaos-builder.md` — the specialist agent
