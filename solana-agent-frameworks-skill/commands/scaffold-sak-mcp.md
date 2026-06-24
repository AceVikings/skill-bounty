---
name: scaffold-sak-mcp
description: Set up SendAI solana-agent-kit + the solana-mcp server for Claude Desktop. Use when the user has chosen SAK.
---

You are running the `/scaffold-sak-mcp` command. Set up SAK with the right plugin combo + the solana-mcp server for Claude Desktop.

## Step 1: Create the project

```bash
mkdir my-sak-agent && cd my-sak-agent
npm init -y
```

## Step 2: Install SAK + the recommended plugins

```bash
npm install solana-agent-kit@2.0.9
npm install @solana-agent-kit/plugin-token \
            @solana-agent-kit/plugin-defi \
            @solana-agent-kit/plugin-misc \
            @solana-agent-kit/plugin-blinks
```

Pick only the plugins the user needs. Don't bundle all 5 — model collapses.

## Step 3: Configure env

```bash
cat > .env <<'EOF'
RPC_URL=https://api.mainnet-beta.solana.com
OPENAI_API_KEY=sk-...
# For production wallets:
TURNKEY_API_KEY=
TURNKEY_ORG_ID=
TURNKEY_SIGN_WITH=
# Or for Privy:
PRIVY_APP_ID=
PRIVY_APP_SECRET=
EOF
```

⚠ For dev, you can use a raw keypair — but the rule `use-embed-wallet-not-private-key.md` applies for production.

## Step 4: Write the agent

```typescript
// index.ts
import { SolanaAgentKit, createVercelAITools, TurnkeyWallet } from "solana-agent-kit";
import TokenPlugin from "@solana-agent-kit/plugin-token";
import DefiPlugin from "@solana-agent-kit/plugin-defi";
import MiscPlugin from "@solana-agent-kit/plugin-misc";
import BlinksPlugin from "@solana-agent-kit/plugin-blinks";

const wallet = new TurnkeyWallet({
  apiKey: process.env.TURNKEY_API_KEY!,
  organizationId: process.env.TURNKEY_ORG_ID!,
  signWith: process.env.TURNKEY_SIGN_WITH!,
});

const agent = new SolanaAgentKit(wallet, process.env.RPC_URL!, {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
})
  .use(TokenPlugin)
  .use(DefiPlugin)
  .use(MiscPlugin)
  .use(BlinksPlugin);

const tools = createVercelAITools(agent, agent.actions);
export default tools;
```

## Step 5: Build and run

```bash
npx tsc
node dist/index.js
```

## Step 6: Add the MCP server to Claude Desktop

```bash
npx solana-agent-kit@latest mcp
```

Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "solana-mcp": {
      "command": "npx",
      "args": ["-y", "solana-agent-kit@latest", "mcp"],
      "env": {
        "RPC_URL": "https://api.mainnet-beta.solana.com",
        "SOLANA_PRIVATE_KEY": "<base58-dev-only-wallet>"
      }
    }
  }
}
```

⚠ For production, use `TURNKEY_*` or `PRIVY_*` env vars instead of `SOLANA_PRIVATE_KEY`.

Restart Claude Desktop. The SAK tools (TRADE, BALANCE, WALLET_ADDRESS, etc.) appear in the tool list.

## Reference

- `references/14-frameworks-sak.md` — SAK deep dive
- `references/30-wallets-crossmint-mcpay.md` — wallet selection
- `examples/hello-sak-mcp-claude/` — runnable example
- `templates/agent.ts.sak` — minimal SAK agent
- `agents/sak-builder.md` — the specialist agent
