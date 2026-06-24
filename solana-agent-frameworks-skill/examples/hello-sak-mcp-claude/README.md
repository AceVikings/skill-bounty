# hello-sak-mcp-claude

A minimal SendAI solana-agent-kit (SAK) setup with the solana-mcp server for Claude Desktop.

## What's in this example

- `package.json` — pinned versions: `solana-agent-kit@2.0.9`, plugin-token@2.0.9, plugin-defi@2.0.8, plugin-misc@2.0.6, plugin-blinks@2.0.5; `overrides` forces a single SAK version
- `tsconfig.json` — Node16 module + moduleResolution
- `index.ts` — minimal SAK agent with the 4 most common plugins
- `.env.example` — required env vars
- `claude_desktop_config.json` — Claude Desktop MCP config
- `README.md` — run instructions

## What it demonstrates

- SAK v2 scaffold
- 4 plugins: token, defi, misc, blinks
- `KeypairWallet` for dev; BaseWallet pattern for production (Turnkey/Privy/Crossmint)
- Vercel AI tools (`createVercelAITools`)
- solana-mcp config for Claude Desktop

## Quick start

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env
# edit .env: RPC_URL, OPENAI_API_KEY, and either SOLANA_PRIVATE_KEY (dev)
#         or set up a BaseWallet for production

# 3. Run
npx tsx index.ts
```

Expected output:
```
SAK agent ready with 60 tools.
Tools: deployToken, transfer, getBalance, ...
Wallet: <your-base58-public-key>
```

## Add to Claude Desktop

Copy `claude_desktop_config.json` to your Claude Desktop config location:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Restart Claude Desktop. The SAK tools (TRADE, BALANCE, WALLET_ADDRESS, etc.) appear in the tool list.

## ⚠ Production wallet warning

For dev, this example uses `KeypairWallet` with `process.env.SOLANA_PRIVATE_KEY`. **For production, use a `BaseWallet` implementation for your wallet provider** (Turnkey/Privy/Crossmint). SAK 2.0.9 does NOT export `TurnkeyWallet` or `PrivyWallet` — you must wrap your wallet SDK in a `BaseWallet` (see the `TurnkeyWallet` skeleton in `index.ts`).

## See also

- `../../references/14-frameworks-sak.md` — SAK deep dive
- `../../agents/sak-builder.md` — the specialist agent
- `../../commands/scaffold-sak-mcp.md` — the scaffold command
- `../../templates/agent.ts.sak` — minimal SAK agent
- `../../rules/use-embed-wallet-not-private-key.md` — the wallet rule
