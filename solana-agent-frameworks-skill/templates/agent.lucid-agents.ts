/**
 * Minimal Lucid Agents agent template (Solana + x402 + A2A + identity).
 *
 * Setup:
 *   bun install @lucid-agents/cli
 *   bunx @lucid-agents/cli create-agent-kit my-agent \
 *     --adapter=hono \
 *     --template=identity \
 *     --AGENT_NAME=my-solana-agent \
 *     --PAYMENTS_RECEIVABLE_ADDRESS=<your-solana-wallet> \
 *     --NETWORK=solana \
 *     --DEFAULT_PRICE=1000
 *   cd my-agent && bun install
 *
 * This file is the minimal agent surface — extend with your own tools.
 */

import { Hono } from "hono";

const app = new Hono();

// AgentCard at /.well-known/agent.json (auto-discovery)
app.get("/.well-known/agent.json", (c) => {
  return c.json({
    name: "my-solana-agent",
    description: "A minimal Lucid Agents agent on Solana",
    network: "solana",
    payments: {
      scheme: "exact",
      network: "solana",
      payTo: process.env.SOLANA_RECIPIENT!,
      maxAmountRequired: "1000", // 0.001 USDC
      extra: { name: "USDC", version: "2" },
    },
    capabilities: ["weather", "echo"],
  });
});

// Paid endpoint — caller must pay 0.001 USDC to call
app.get("/api/weather", async (c) => {
  // TODO: verify x402 payment from headers (PAYMENT-SIGNATURE)
  // For the minimal example, we trust the upstream middleware
  return c.json({
    temp: 72,
    condition: "sunny",
    timestamp: Date.now(),
    paidTo: process.env.SOLANA_RECIPIENT!,
  });
});

// Free endpoint
app.get("/", (c) => c.json({
  name: "my-solana-agent",
  message: "Visit /api/weather (paid) or /.well-known/agent.json",
}));

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`my-solana-agent listening on http://localhost:${port}`);
});
