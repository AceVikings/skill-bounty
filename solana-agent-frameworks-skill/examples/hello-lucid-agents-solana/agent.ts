/**
 * Minimal Lucid Agents agent (Solana + x402 + identity).
 * For the full scaffold, use `bunx @lucid-agents/cli create-agent-kit ...` (the package's bin is `create-agent-kit`, not `cli`).
 */

import { Hono } from "hono";

const SOLANA_RECIPIENT = process.env.SOLANA_RECIPIENT!;
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

const app = new Hono();

// AgentCard at /.well-known/agent.json
app.get("/.well-known/agent.json", (c) => {
  return c.json({
    name: "hello-lucid-agents-solana",
    description: "A minimal Lucid Agents agent on Solana",
    network: "solana",
    payments: {
      scheme: "exact",
      network: "solana",
      payTo: SOLANA_RECIPIENT,
      maxAmountRequired: "1000",
      extra: { name: "USDC", version: "2" },
    },
    capabilities: ["weather", "echo"],
  });
});

// Paid endpoint — caller must pay 0.001 USDC
app.get("/api/weather", async (c) => {
  // TODO: verify x402 payment from headers (PAYMENT-SIGNATURE)
  // For the minimal example, we trust the upstream middleware
  return c.json({
    temp: 72,
    condition: "sunny",
    timestamp: Date.now(),
    paidTo: SOLANA_RECIPIENT,
  });
});

// Free endpoint
app.get("/", (c) => c.json({
  name: "hello-lucid-agents-solana",
  message: "Visit /api/weather (paid) or /.well-known/agent.json",
}));

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`hello-lucid-agents-solana listening on http://localhost:${port}`);
});
