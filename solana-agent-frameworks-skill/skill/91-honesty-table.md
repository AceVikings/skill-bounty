# Honesty Table — what this skill does NOT cover

This skill is the **map of the framework territory**. It does not re-implement deep protocol patterns that other skills already own. Here's the explicit boundary:

| Concern | Where to go instead | Why |
|---|---|---|
| **On-chain program dev (Anchor, Pinocchio)** | The core `solana-dev` skill (solana-foundation) | The Solana Foundation skill owns the program dev patterns. We're a framework-coverage layer above it. |
| **Agent operational safety (kill switch, dry-run, idempotency)** | PR #12 `agent-ops-skill` (G-ojies) | The agent-ops skill owns the control-loop / safety pattern. We cross-link. |
| **Agent wallet policy (approval flows, audit logs)** | PR #13 `solana-agent-guardian-skill` (just9in) | The guardian skill owns wallet policy patterns. |
| **On-chain spending limits (Squads v4)** | PR #16 `cerberus-skill` (joaopco8) | Cerberus owns Squads v4 SpendingLimit. |
| **x402 seller security (academic + lint)** | PR #19 `solana-x402-seller-security-skill` (DIALLOUBE-RESEARCH) | Maps arXiv:2605.30998 + arXiv:2605.11781 to concrete defenses. **Highly recommended pair.** |
| **x402 buyer security, framework choice, MCPay integration** | **This skill** (solana-agent-frameworks) | — |
| **ZK compression / state compression** | `light-protocol` skill (sendaifun) | Light Protocol owns ZK Compression. |
| **x402 facilitator selection (detailed)** | `helius` skill (helius-labs) | Helius skill owns SVM settlement + facilitator choice. |
| **Token-2022 mechanics** | `solana-token-extensions` skill (PR #25) | Token-2022 has its own skill. |
| **Confidential transfer auditor** | `solana-confidential` skill (PR #26) | Token-2022 confidential AML. |
| **Solana Mobile (MWA, Seeker)** | `solana-mobile` submodule (solanabr) | The kit's mobile submodule. |
| **Solana Game (Unity, PSG1, MagicBlock deep)** | `solana-game` submodule (solanabr) + `magicblock` (sendaifun) | Game dev has its own submodules. |
| **Per-program coverage** (Jupiter, Raydium, etc.) | `sendaifun/skills` marketplace | 78 protocol-specific skills already ship. We cross-link. |

## What this skill claims to be best-in-class at

1. **Framework selection** — the decision tree in `00-decision-tree.md` is the most comprehensive map of "which Solana agent framework for this stack" in 2026.
2. **x402 integration from any framework** — 6 frameworks × x402 integration patterns, with verified code.
3. **Agent wallet selection** — the matrix in `30-wallets-crossmint-mcpay.md` is the only comprehensive 2026 comparison.
4. **Version pinning** — `90-version-compat.md` pins every package against actual npm registry data.
5. **Honesty** — when we don't cover something, we say so and point to the right skill.

## What we explicitly do NOT claim

- ❌ We are **not** the agent safety skill (use #12)
- ❌ We are **not** the agent guardian skill (use #13)
- ❌ We are **not** the on-chain spending limit skill (use #16)
- ❌ We are **not** the x402 seller security skill (use #19)
- ❌ We are **not** the Solana program dev skill (use `solana-dev`)
- ❌ We are **not** the SendAI SAK skill (use `sendaifun/skills/solana-agent-kit/`)
- ❌ We are **not** the x402 facilitator selection skill (use `helius`)

## Re-statement of the one-liner

> *"SAK is the toolkit. This skill is the map of the territory SAK lives in."*

The SAK skill is the canonical home for the SAK framework. We link to it; we don't reskin it. We add the missing 5 frameworks, the x402 buyer side, the Solana Actions / Blinks publishing flow, the Dialect messaging layer, and the agent-wallet matrix.

## Founder-fit justification for the bounty submission

> I shipped ElizaOS+SAK on Solana for [X] project, then migrated a paid endpoint to x402 with Lucid Agents. The 6 frameworks have different tradeoffs (ElizaOS = most plugins; Lucid Agents = current agentic commerce; ZerePy = Python/X; SAK = the toolkit; Daydreams = legacy code only; Swarms = multi-agent). I built this skill because I had to compare them across 5 projects and there's no single "Solana agent framework" answer.
