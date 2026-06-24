# hello-sak-mcp-claude

A minimal SendAI solana-agent-kit (SAK) setup with the solana-mcp server for Claude Desktop.

## What's in this example

- `package.json` — pinned versions: `solana-agent-kit@2.0.9`
- `index.ts` — minimal SAK agent with the 4 most common plugins
- `.env.example` — required env vars
- `claude_desktop_config.json` — Claude Desktop MCP config
- `README.md` — run instructions

## What it demonstrates

- SAK v2 scaffold
- 4 plugins: token, defi, misc, blinks
- TurnkeyWallet (production) with KeypairWallet fallback (dev)
- Vercel AI tools (`createVercelAITools`)
- solana-mcp config for Claude Desktop

## Quick start

```bash
# 1. Create the project
mkdir hello-sak-mcp-claude && cd hello-sak-mcp-claude
npm init -y

# 2. Install SAK + the recommended plugins
npm install solana-agent-kit@2.0.9
npm install @solana-agent-kit/plugin-token \
            @solana-agent-kit/plugin-defi \
            @solana-agent-kit/plugin-misc \
            @solana-agent-kit/plugin-blinks

# 3. Copy index.ts from this directory
cp ../index.ts .

# 4. Copy .env.example to .env
cp ../.env.example .env
# edit .env: RPC_URL, OPENAI_API_KEY, and either SOLANA_PRIVATE_KEY (dev)
#         or TURNKEY_* / PRIVY_* (production)

# 5. Build and run
npx tsc
node dist/index.js
```

## Add to Claude Desktop

Copy `claude_desktop_config.json` to your Claude Desktop config location:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Restart Claude Desktop. The SAK tools (TRADE, BALANCE, WALLET_ADDRESS, etc.) appear in the tool list.

## ⚠ Production wallet warning

For dev, this example uses `KeypairWallet` with `process.env.SOLANA_PRIVATE_KEY`. **For production, use `TurnkeyWallet` or `PrivyWallet`.** See `rules/use-embed-wallet-not-private-key.md`.

## Files

- `package.json` — deps
- `index.ts` — minimal SAK agent
- `.env.example` — env template
- `claude_desktop_config.json` — Claude Desktop MCP config
- `README.md` — this file

## See also

- `../../references/14-frameworks-sak.md` — SAK deep dive
- `../../agents/sak-builder.md` — the specialist agent
- `../../commands/scaffold-sak-mcp.md` — the scaffold command
- `../../templates/agent.ts.sak` — minimal SAK agent
