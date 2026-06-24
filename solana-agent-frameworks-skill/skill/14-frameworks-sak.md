# SendAI Solana Agent Kit (SAK) — Deep Dive

> **Repo:** https://github.com/sendaifun/solana-agent-kit
> **Stars:** 1.7k · **Forks:** 871 · **License:** Apache-2.0
> **Default branch:** `v2` (1,430 commits)
> **Latest npm:** `solana-agent-kit` v2.0.9 (2025-07-24)
> **Plugin scope (npm):** `@solana-agent-kit/*`
> **Plugins:** `plugin-token`, `plugin-nft`, `plugin-defi`, `plugin-misc`, `plugin-blinks`
> **Wallets:** `KeypairWallet` (dev), `TurnkeyWallet` (policy), `PrivyWallet` (human-in-loop)
> **Treasury (donations):** `EKHTbXpsm6YDgJzMkFxNU1LNXeWcUW7Ezf8mjUNQQ4Pa`
> **Companion product:** Suzi (`suzi.trade`)
> **Attribution:** "System prompt logic adapted from Coinbase AgentKit (Apache 2.0)"

## What it is

The **canonical Solana agent toolkit**. 60+ typed actions across token ops, NFTs, DeFi, Blinks, misc. The sendai team's official answer to "I want to call 60 Solana protocols from my agent."

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│              solana-agent-kit v2                              │
│                                                              │
│  Core:                                                        │
│    new SolanaAgentKit(wallet, rpcUrl, { OPENAI_API_KEY })    │
│      .use(TokenPlugin)                                       │
│      .use(NFTPlugin)                                         │
│      .use(DefiPlugin)                                        │
│      .use(MiscPlugin)                                        │
│      .use(BlinksPlugin)                                      │
│                                                              │
│  Wallet:                                                     │
│    KeypairWallet    (dev)                                    │
│    TurnkeyWallet     (policy engine)                         │
│    PrivyWallet       (human-in-the-loop confirmation)         │
│                                                              │
│  LLM adapter:                                                 │
│    createVercelAITools(agent, agent.actions)                  │
│    createSolanaTools(agent)                                  │
│    LangChain tools                                           │
│    MCP server (solana-mcp)                                   │
└──────────────────────────────────────────────────────────────┘
```

## Key actions (from v2 README, verified 2026-06-24)

| Plugin | npm | Actions |
|---|---|---|
| **token** | `@solana-agent-kit/plugin-token@2.0.9` ✓ | `deployToken`, `deployToken2022`, `transfer`, `getBalance`, `stake`, `bridge` (Wormhole), `cctpTransfer`, `rugCheck` |
| **nft** | `@solana-agent-kit/plugin-nft@2.0.x` ✓ | `deployCollection`, `mintNFT`, `create3LandCollection`, `create3LandSingle` |
| **defi** | `@solana-agent-kit/plugin-defi@2.0.8` (latest) ✓ | `trade` (Jupiter), `lendAssets` (Lulo), `stakeWithJup`, `stakeWithSolayer`, `openPerpTradeLong` (Adrena), `closePerpTradeLong`, `driftPerpTrade`, `voltrDepositStrategy`, `swapSanctumLST`, `addSanctumLiquidity`, `swap` |
| **misc** | `@solana-agent-kit/plugin-misc@2.0.6` (latest) ✓ | `sendCompressedAirdrop` (Light Protocol + Helius), `fetchPythPrice`, `simulateSwitchboardFeed`, `getPriceInference` (Allora), `getAsset` |
| **blinks** | `@solana-agent-kit/plugin-blinks@2.0.5` (latest) ✓ | `executeBlink` (consumes Solana Actions) |

> ⚠ **DeBridge + OKX DEX** — `14-frameworks-sak.md` (v1) listed `@solana-agent-kit/plugin-debridge` and `@solana-agent-kit/plugin-okx-dex` as standalone npm packages, but **neither exists on the npm registry** as of 2026-06-24. They may live in the SAK monorepo as workspace-internal plugins. Skip them.
>
> ⚠ **`TurnkeyWallet` / `PrivyWallet` are NOT exported by SAK 2.0.9.** SAK 2.0.9 only exports `KeypairWallet`. For production wallets, implement the `BaseWallet` interface (defined in SAK) against your wallet SDK (Turnkey / Privy / Crossmint). See `examples/hello-sak-mcp-claude/index.ts` for the Turnkey skeleton.

## Dependencies (verified)

`@solana/web3.js`, `@solana/spl-token`, `@metaplex-foundation/*`, `@lightprotocol/compressed-token`, `@coingecko/sdk`, Jupiter, Raydium, Orca, Meteora, Drift, Adrena, Manifest, Lulo, Sanctum, Helius, Jito

## Hello-world (verified)

```bash
npm install solana-agent-kit@2.0.9
npm install @solana-agent-kit/plugin-token@2.0.9 \
            @solana-agent-kit/plugin-nft@2.0.x \
            @solana-agent-kit/plugin-defi@2.0.8 \
            @solana-agent-kit/plugin-misc@2.0.6 \
            @solana-agent-kit/plugin-blinks@2.0.5
```

```typescript
import { SolanaAgentKit, createVercelAITools, KeypairWallet } from "solana-agent-kit";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import TokenPlugin from "@solana-agent-kit/plugin-token@2.0.9";
import DefiPlugin from "@solana-agent-kit/plugin-defi@2.0.8";
import MiscPlugin from "@solana-agent-kit/plugin-misc@2.0.6";
import BlinksPlugin from "@solana-agent-kit/plugin-blinks@2.0.5";

const keypair = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY!));
const wallet = new KeypairWallet(keypair);

const agent = new SolanaAgentKit(wallet, process.env.RPC_URL!, {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
})
  .use(TokenPlugin)
  .use(DefiPlugin)
  .use(MiscPlugin)
  .use(BlinksPlugin);

const tools = createVercelAITools(agent, agent.actions);
```

⚠ **For production**, replace `KeypairWallet` with `TurnkeyWallet` or `PrivyWallet` — see `rules/use-embed-wallet-not-private-key.md`.

## Production: which wallet to use

| Wallet | How | Trust model |
|---|---|---|
| `KeypairWallet` (SAK 2.0.9) | dev / test / throwaway | key in env (DO NOT use in prod) |
| Custom `BaseWallet` for Turnkey | implement `BaseWallet` interface → wrap `@turnkey/sdk-server` | key sharded via Turnkey (policy engine: spend caps, allowlist) |
| Custom `BaseWallet` for Privy | implement `BaseWallet` interface → wrap `@privy-io/sdk` | key in Privy (human-in-loop confirmation) |
| Custom `BaseWallet` for Crossmint | implement `BaseWallet` interface → wrap `@crossmint/wallets-sdk` | consumer UX (email/passkey) |

> ⚠ **SAK 2.0.9 does not export `TurnkeyWallet` or `PrivyWallet`.** Both were referenced in older docs and earlier SAK versions. Use the `BaseWallet` pattern shown in `examples/hello-sak-mcp-claude/index.ts`.

## V1 vs V2

- **V2 is current** (default branch is `v2`, 1,430 commits)
- **V1 deprecated** (`v1-deprecated` branch)
- **Always use v2.** The new plugin system + wallet adapters are not in v1.

## When to choose SAK

- You want **60+ Solana actions** out of the box
- You want **LangChain / Vercel AI / MCP** integration
- You want a **permissive license** (Apache-2.0)
- You're on **TypeScript**
- You want **production wallet support** (Turnkey, Privy)

## When NOT to choose SAK

- You want **multi-agent orchestration** (use Swarms or Lucid Agents)
- You want **50+ connectors** (Discord, Telegram, etc.) (use ElizaOS)
- You want **agentic commerce / x402** as the primary primitive (use Lucid Agents)

## Cross-link

> The sendai team maintains the official `solana-agent-kit` skill at `sendaifun/skills/skills/solana-agent-kit/`. **This skill does not duplicate it** — use the official skill for the SAK-specific patterns, and refer to this skill for the framework comparison and decision-making.

## See also

- `00-decision-tree.md` — when to pick SAK
- `30-wallets-crossmint-mcpay.md` — alternative wallet providers
- `../examples/hello-sak-mcp-claude/` — runnable example with solana-mcp
- `../templates/agent.ts.sak` — minimal SAK agent
