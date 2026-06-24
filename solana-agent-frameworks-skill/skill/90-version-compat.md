# Version Compatibility Matrix (verified 2026-06-24)

This is the source-of-truth for which package versions this skill recommends. Run `bash scripts/check-versions.sh` to re-verify.

## Core frameworks

| Package | Version | License | Verified | Notes |
|---|---|---|---|---|
| `elizaos` (CLI) | `@beta` | MIT | yes | install via `bun add -g elizaos@beta` |
| `@elizaos/core` | latest (beta) | MIT | yes | agent loop + plugin model |
| `@elizaos/agent` | latest (beta) | MIT | yes | `AgentRuntime` + default plugin map |
| `@elizaos/cli` | latest (beta) | MIT | yes | `create`, `info`, `upgrade`, `version` |
| `@elizaos/ui` | latest (beta) | MIT | yes | — |

## ElizaOS plugins

| Package | Version | License | Verified | Notes |
|---|---|---|---|---|
| `@elizaos/plugin-solana` | `1.2.6` | MIT | yes | Jupiter, Birdeye, Helius, Anchor, FOMO.fund, Pump.fun |
| `@elizaos/plugin-x402` | `2.0.0-alpha.1` | MIT | yes | **ALPHA** — pin to specific tag |
| `@elizaos/plugin-twitter` | `1.2.22` | MIT | yes | Twitter API v2 + OAuth 1.0a |

## Lucid Agents

| Package | Version | License | Verified | Notes |
|---|---|---|---|---|
| `@lucid-agents/cli` | `2.5.0` | MIT | yes | safe to use for scaffolding |
| `@lucid-agents/core` | `2.5.0` | **Proprietary** | yes | **investigate before commercial use** |
| `@lucid-agents/identity` | `2.5.0` | **Proprietary** | yes | **investigate before commercial use** |
| `@lucid-agents/payments` | `2.5.0` | (verify) | yes | x402 + A2A + AP2 + ERC-8004 |
| `@lucid-agents/a2a` | `2.5.0` | (verify) | yes | Agent-to-Agent protocol |
| `@lucid-agents/hono` | `2.5.0` | (verify) | yes | Hono adapter |
| `@lucid-agents/express` | `2.5.0` | (verify) | yes | Express adapter |
| `@lucid-agents/tanstack` | `2.5.0` | (verify) | yes | TanStack adapter |

## Swarms (Python)

| Package | Version | License | Verified | Notes |
|---|---|---|---|---|
| `swarms` | latest (master) | Apache-2.0 | yes | 5,097 commits |

## ZerePy (Python)

| Package | Version | License | Verified | Notes |
|---|---|---|---|---|
| `ZerePy` (git-clone) | `v1.1` (2025-01-24) | MIT | yes | `git clone https://github.com/blorm-network/ZerePy.git` |
| `ZerePy` (PyPI) | — | — | n/a | **no PyPI**; must git-clone |
| `solana` (PyPI) | `^0.35.0` | MIT | yes | ZerePy dep |
| `jupiter-python-sdk` | latest | MIT | yes | ZerePy dep |
| `allora-sdk` | latest | MIT | yes | ZerePy dep |
| `goat-sdk` | latest | MIT | yes | ZerePy dep |

## SendAI Solana Agent Kit

| Package | Version | License | Verified | Notes |
|---|---|---|---|---|
| `solana-agent-kit` | `2.0.9` (2025-07-24) | Apache-2.0 | yes | 60+ actions |
| `@solana-agent-kit/plugin-token` | `2.0.x` | Apache-2.0 | yes | token ops |
| `@solana-agent-kit/plugin-nft` | `2.0.x` | Apache-2.0 | yes | NFT ops |
| `@solana-agent-kit/plugin-defi` | `2.0.x` | Apache-2.0 | yes | Drift, Kamino, Jupiter, etc. |
| `@solana-agent-kit/plugin-misc` | `2.0.x` | Apache-2.0 | yes | compressed airdrop, Pyth, Switchboard, Allora |
| `@solana-agent-kit/plugin-blinks` | `2.0.x` | Apache-2.0 | yes | execute Solana Actions |

## x402

| Package | Version | License | Verified | Notes |
|---|---|---|---|---|
| `@x402/core` | `2.16.0` | Apache-2.0 | yes | types + shared interfaces |
| `@x402/svm` | `2.16.0` | Apache-2.0 | yes | **Solana VM adapter** |
| `@x402/evm` | `2.16.0` | Apache-2.0 | yes | EVM adapter |
| `@x402/stellar` | `2.16.0` | Apache-2.0 | yes | Stellar adapter |
| `@x402/express` | `2.16.0` | Apache-2.0 | yes | Express server middleware |
| `@x402/fastify` | `2.16.0` | Apache-2.0 | yes | Fastify middleware |
| `@x402/hono` | `2.16.0` | Apache-2.0 | yes | Hono middleware |
| `@x402/next` | `2.16.0` | Apache-2.0 | yes | Next.js middleware |
| `@x402/fetch` | `2.16.0` | Apache-2.0 | yes | fetch client adapter |
| `@x402/axios` | `2.16.0` | Apache-2.0 | yes | axios client adapter |
| `@x402/paywall` | `2.16.0` | Apache-2.0 | yes | drop-in 402 page |
| `@x402/extensions` | `2.16.0` | Apache-2.0 | yes | extension points |
| `x402` (Python) | latest | Apache-2.0 | yes | `pip install x402` |
| `@x402-foundation/*` | — | — | **DOES NOT EXIST** | the scope is `@x402/*`, not `@x402-foundation/*` |

## Solana Actions

| Package | Version | License | Verified | Notes |
|---|---|---|---|---|
| `@solana/actions` | `1.6.6` | Apache-2.0 | yes | server-side Action endpoint SDK |

## Wallets

| Package | Version | License | Verified | Notes |
|---|---|---|---|---|
| `@crossmint/wallets-sdk` | `1.6.0` (Jun 2026) | Apache-2.0 | yes | consumer UX wallets |
| `@crossmint/client-sdk-react-ui` | latest | Apache-2.0 | yes | React UI |
| `@crossmint/client-sdk-react-native-ui` | latest | Apache-2.0 | yes | React Native UI |
| `mcpay` | `0.1.17` (Dec 2025) | MIT | yes | x402 over MCP |
| `@phantom/mcp-server` | latest | (verify) | yes | wallet connect MCP |
| `solana-agent-kit` (TurnkeyWallet) | `2.0.9` | Apache-2.0 | yes | via SAK |
| `solana-agent-kit` (PrivyWallet) | `2.0.9` | Apache-2.0 | yes | via SAK |

## Solana primitives

| Package | Version | License | Verified | Notes |
|---|---|---|---|---|
| `@solana/web3.js` | `^1.91.1` | MIT | yes | legacy v1 (will deprecate) |
| `@solana/kit` | latest | MIT | yes | modern tree-shakeable SDK |
| `@solana/spl-token` | latest | MIT | yes | SPL token operations |
| `bs58` | `^5.0.0` | MIT | yes | base58 encoding |

## Bun

| Runtime | Version | License | Verified | Notes |
|---|---|---|---|---|
| `bun` | `>= 1.0.0` | MIT | yes | required for ElizaOS / Lucid Agents |

## Re-verification

Run `bash scripts/check-versions.sh` from the skill root. It runs `npm view <pkg> version` for each verified package and warns if a major version has bumped.

Last verified: **2026-06-24** by opencode + npm view + direct repo reads.
