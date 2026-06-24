/**
 * Minimal x402 seller on Solana.
 * ⚠ NEVER .toLowerCase() the payTo or asset fields. Base58 is case-sensitive.
 *    See ../../rules/x402-base58-case-sensitivity.md.
 * ⚠ For production, install PR #19 solana-x402-seller-security-skill
 *    and run `x402-seller-lint` on this file.
 *
 * Verified against @x402/express@2.16.0 types (2026-06-24).
 * Uses paymentMiddlewareFromConfig (the one-arg form of paymentMiddleware
 * is NOT valid in 2.16.0 — it requires a pre-configured x402ResourceServer).
 */

import express from "express";
import { paymentMiddlewareFromConfig } from "@x402/express";

const PORT = Number(process.env.PORT) || 3000;
const SOLANA_RECIPIENT = process.env.SOLANA_RECIPIENT!;
const SOLANA_NETWORK = "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp" as const; // Solana mainnet (CAIP-2)
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // mainnet USDC
const BASE_ATOMIC = "10000"; // 0.01 USDC — single source of truth

const app = express();
app.use(paymentMiddlewareFromConfig(
  {
    "GET /api/paid-weather": {
      accepts: [
        {
          scheme: "exact",
          network: SOLANA_NETWORK, // CAIP-2: "solana:<genesis-hash>"
          price: {
            asset: USDC_MINT,         // base58 — DO NOT LOWERCASE
            amount: BASE_ATOMIC,      // 0.01 USDC (6 decimals)
          },
          payTo: SOLANA_RECIPIENT,   // base58 — DO NOT LOWERCASE
          maxTimeoutSeconds: 60,
          extra: { name: "USDC", version: "2" },
        },
        // Optional: Base rail with the SAME dollar amount (multi-rail parity)
        // {
        //   scheme: "exact",
        //   network: "eip155:8453",
        //   price: { asset: process.env.USDC_ON_BASE!, amount: BASE_ATOMIC },
        //   payTo: process.env.BASE_RECIPIENT!,
        //   maxTimeoutSeconds: 60,
        //   extra: { name: "USDC", version: "2" },
        // },
      ],
      description: "Weather data",
    },
  },
));

app.get("/api/paid-weather", (req, res) => {
  res.json({ temp: 72, condition: "sunny", timestamp: Date.now() });
});

app.get("/", (req, res) => {
  res.json({ message: "x402 seller. Hit /api/paid-weather to pay." });
});

app.listen(PORT, () => {
  console.log(`x402 seller on http://localhost:${PORT}`);
  console.log(`Try: curl -i http://localhost:${PORT}/api/paid-weather`);
});
