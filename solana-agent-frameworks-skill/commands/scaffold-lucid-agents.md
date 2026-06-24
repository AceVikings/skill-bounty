---
name: scaffold-lucid-agents
description: bunx @lucid-agents/cli create-agent-kit scaffold (the package's bin is `create-agent-kit`, not `cli`) for Solana with x402 + A2A + ERC-8004. Use when the user has chosen Lucid Agents.
---

You are running the `/scaffold-lucid-agents` command. Scaffold a working Lucid Agents agent on Solana.

## Step 1: Install Bun (if not present)

```bash
if ! command -v bun >/dev/null 2>&1; then
  echo "Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi
bun --version
```

## Step 2: Generate a Solana wallet (if you don't have one)

```bash
if ! command -v solana-keygen >/dev/null 2>&1; then
  # Use the Solana CLI; or generate one in TypeScript
  echo "Install solana CLI: sh -c \"\$(curl -sSfL https://release.solana.com/stable/install)\""
  exit 1
fi
solana-keygen new -o wallet.json --no-bip39-passphrase
solana address -k wallet.json
```

Copy the address — you'll use it for `PAYMENTS_RECEIVABLE_ADDRESS`.

## Step 3: Scaffold the Lucid Agents project

```bash
bunx @lucid-agents/cli create-agent-kit my-agent \
  --adapter=hono \
  --template=identity \
  --AGENT_NAME=my-solana-agent \
  --PAYMENTS_RECEIVABLE_ADDRESS=<paste-your-solana-address> \
  --NETWORK=solana \
  --DEFAULT_PRICE=1000
cd my-agent
```

⚠ **Bin name correction (verified 2026-06-24).** The package's actual `bin` is `create-agent-kit`, not `cli`. `bunx create-agent-kit my-agent` fails with "command not found" (no top-level `create-agent-kit` package). **Use `bunx @lucid-agents/cli create-agent-kit my-agent`**. After a local install, you can use the shorthand `bunx create-agent-kit my-agent`.

## Step 4: Install

```bash
bun install
```

## Step 5: Configure env

```bash
cat > .env <<'EOF'
# Server signer for the agent (a hot wallet for x402 settlements)
SVM_SECRET_KEY=<base58-secret-key>
# Optional: facilitator URL (defaults to MCPay)
FACILITATOR_URL=https://mcpay.fun
# Optional: max payment value the agent will accept
MAX_PAYMENT_VALUE=100000
EOF
```

⚠ For production, use a Turnkey/Privy signer instead of a raw keypair.

## Step 6: Run

```bash
bun run dev
```

The agent runs on `http://localhost:3000` (Hono default). The AgentCard is at `http://localhost:3000/.well-known/agent.json`.

## Step 7: Test

```bash
curl -i http://localhost:3000/
# Should return 402 (the agent is paid)
```

Then with an x402 client:
```bash
# MCPay client auto-pays
mcpay connect -u "http://localhost:3000/" -a "<facilitator-api-key>"
```

## ⚠ License warning

`@lucid-agents/core` and `@lucid-agents/identity` are marked "Proprietary" in npm. Read `node_modules/@lucid-agents/core/LICENSE` before deploying commercially. The CLI is MIT.

## Reference

- `references/11-frameworks-lucid-agents.md` — Lucid Agents deep dive
- `references/90-version-compat.md` — verified versions
- `examples/hello-lucid-agents-solana/` — runnable example
- `templates/agent.lucid-agents.ts` — minimal agent template
- `agents/lucid-agents-builder.md` — the specialist agent
