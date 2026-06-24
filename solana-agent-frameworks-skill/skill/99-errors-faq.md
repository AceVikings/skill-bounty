# Errors & FAQ — common pitfalls when shipping Solana AI agents

## ElizaOS

### E1 — `plugin-solana` fails with "Cannot find module '@solana/spl-token'"

**Cause:** The plugin version doesn't match `@solana/spl-token` major version.
**Fix:** `npm install @solana/spl-token@latest` then re-run `bun install`.

### E2 — `bun run dev` shows "No character file found"

**Cause:** `character.json` is not in the right path.
**Fix:** Place `character.json` in the project root or pass `--character ./path/to/character.json`.

### E3 — ElizaOS x402 plugin (`@elizaos/plugin-x402`) crashes with "EISDIR"

**Cause:** The plugin's storage path is a directory, not a file (alpha bug).
**Fix:** Set `STORAGE_PATH=./.elizaos-storage/x402.sqlite` and create the parent dir.

### E4 — "OPENAI_API_KEY not set"

**Fix:** `echo 'OPENAI_API_KEY=sk-...' > .env` in the project root.

## Lucid Agents

### E5 — `bunx @lucid-agents/cli` says "command not found: bunx"

**Cause:** Bun not installed.
**Fix:** `curl -fsSL https://bun.sh/install | bash` then `bun --version`.

### E6 — `PAYMENTS_RECEIVABLE_ADDRESS must be a valid Solana address"

**Cause:** The wallet is not a base58 Solana address (or is on the wrong network).
**Fix:** Generate with `solana-keygen new -o wallet.json` and pass `solana address -k wallet.json`.

### E7 — "core/identity is Proprietary — read LICENSE before commercial use"

**Cause:** `@lucid-agents/core` and `@lucid-agents/identity` are marked Proprietary.
**Fix:** Read `node_modules/@lucid-agents/core/LICENSE` before deploying commercially. If you can't accept the terms, use the CLI to scaffold and rip out the proprietary bits, or use ElizaOS/Swarms instead.

## Swarms

### E8 — "model 'gpt-5.4' not found"

**Cause:** The README's example uses `gpt-5.4`, a model that does not exist.
**Fix:** Use `gpt-4o`, `gpt-4o-mini`, `claude-3-5-sonnet-latest`, or `claude-sonnet-4-5`.

### E9 — Swarms x402 quickstart fails on "no facilitator configured"

**Cause:** No facilitator URL is set.
**Fix:** Sign up for MCPay (mcpay.fun) or PayAI (payai.network) and pass the facilitator URL.

### E10 — "No module named 'swarms'"

**Fix:** `pip install -U swarms` OR `poetry add swarms` OR `uv pip install swarms`.

## ZerePy

### E11 — `pip install zerepy` doesn't work

**Cause:** There is NO PyPI package.
**Fix:** `git clone https://github.com/blorm-network/ZerePy.git` then `poetry install --no-root`.

### E12 — `poetry: command not found"

**Fix:** `curl -sSL https://install.python-poetry.org | python3 -` then `poetry --version`.

## SendAI Solana Agent Kit (SAK)

### E13 — `Cannot find module '@solana-agent-kit/plugin-defi'"

**Fix:** `npm install @solana-agent-kit/plugin-defi`.

### E14 — "Wallet type KeypairWallet is not safe for production"

**Cause:** You're using `KeypairWallet` with a `process.env.SOLANA_PRIVATE_KEY`.
**Fix:** Use `TurnkeyWallet` or `PrivyWallet` for production. See `rules/use-embed-wallet-not-private-key.md`.

### E15 — SAK v1 imports don't work in v2

**Cause:** V1 → V2 has breaking changes (the plugin system is new).
**Fix:** Migrate to V2. The default branch is `v2`; V1 is `v1-deprecated`.

## x402

### E16 — 402 response is "lost funds" on Solana

**Cause:** Someone called `.toLowerCase()` on the `payTo` address or the mint. Base58 is case-sensitive.
**Fix:** Gate EVM normalization behind an SVM check:
```typescript
const svm = String(req.network).startsWith("solana");
const payTo = svm ? req.payTo : String(req.payTo).toLowerCase();
```
This is enforced by `rules/x402-base58-case-sensitivity.md`.

### E17 — "Payment required but maxAmountRequired is wrong"

**Cause:** Multi-rail parity violation — Base and Solana rails charge different amounts.
**Fix:** Derive the Solana atomic amount from the Base atomic amount. Don't hardcode two literals.

### E18 — "@x402/svm not found"

**Fix:** `npm install @x402/svm@2.16.0` (or `2.x` for the latest minor).

### E19 — "x402 says signature is invalid but my wallet shows the tx confirmed"

**Cause:** You're verifying against the on-chain tx but x402 wants the `X-PAYMENT` header payload.
**Fix:** x402 verification is off-chain (facilitator signs off before settlement). Don't conflate the two.

## Solana Actions / Blinks

### E20 — "CORS error when my Action is hit from a Blink"

**Cause:** Missing `ACTIONS_CORS_HEADERS` on the GET/POST handlers.
**Fix:** Always set `headers: ACTIONS_CORS_HEADERS` on every response.

### E21 — "dial.to shows my Blink as broken"

**Cause:** The `icon` URL is not HTTPS, or the `label` is > 12 chars.
**Fix:** Use an HTTPS icon URL (200x200 recommended) and a label ≤ 12 chars.

## Wallets

### E22 — Crossmint "Unauthorized: invalid API key"

**Fix:** Use a **SERVER** key for server-side wallet creation; **CLIENT** keys cannot create wallets.

### E23 — MCPay "recipient not configured"

**Fix:** Set the `recipient` map in `createMcpPaidHandler`:
```typescript
createMcpPaidHandler(server => {...}, {
  recipient: { 'solana-devnet': process.env.SVM_RECIPIENT! },
  facilitator: { url: process.env.FACILITATOR_URL! },
});
```

### E24 — Turnkey "organization not found"

**Fix:** Verify the `organizationId` is correct. The org ID is in the Turnkey dashboard URL.

## General

### E25 — "Module not found" after `bun install` in a new project

**Cause:** Cache or lockfile issue.
**Fix:** `rm -rf node_modules bun.lockb && bun install`.

### E26 — "Permission denied" on the install script

**Fix:** `chmod +x install.sh scripts/*.sh`.

### E27 — The skill isn't being loaded by Claude Code

**Cause:** Wrong install path or Claude Code needs a restart.
**Fix:** Verify the path: `ls -la ~/.claude/skills/solana-agent-frameworks/SKILL.md`. Restart Claude Code (or run `/reload`).

## See also

- `90-version-compat.md` — verify all packages are still current
- `../rules/x402-base58-case-sensitivity.md` — the funds-loss rule
- `../rules/use-embed-wallet-not-private-key.md` — the wallet rule
- `scripts/check-versions.sh` — re-verify versions
