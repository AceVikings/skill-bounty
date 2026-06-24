/**
 * Minimal x402 seller on Solana.
 *
 * Architecture (self-hosted, single-process):
 *   - x402Facilitator       (facilitator-side ExactSvmScheme + signer)
 *   - x402ResourceServer    (server-side ExactSvmScheme, with the facilitator)
 *   - paymentMiddleware     (Express integration)
 *
 * ⚠ NEVER .toLowerCase() the payTo or asset fields. Base58 is case-sensitive.
 *    See ../../rules/x402-base58-case-sensitivity.md
 *
 * For production:
 *   - Replace generateKeyPairSigner() with a keypair loaded from a secret manager
 *   - Consider running the facilitator as a separate process (e.g. :3001) and
 *     connecting via HTTPFacilitatorClient
 *   - Pair with PR #19 solana-x402-seller-security-skill for the audit layer
 *
 * Verified against @x402/express@2.16.0, @x402/svm@2.16.0, @x402/core@2.16.0
 * (2026-06-24). Returns a real 402 Payment Required with valid x402 V2 schema.
 */

import express from "express";
import { paymentMiddleware } from "@x402/express";
import { x402ResourceServer } from "@x402/core/server";
import { x402Facilitator } from "@x402/core/facilitator";
import { ExactSvmScheme as ExactSvmServerScheme } from "@x402/svm/exact/server";
import { registerExactSvmScheme } from "@x402/svm/exact/facilitator";
import { toFacilitatorSvmSigner, SOLANA_MAINNET_CAIP2 } from "@x402/svm";
import { generateKeyPairSigner } from "@solana/signers";

const PORT = Number(process.env.PORT) || 3000;
const SOLANA_RECIPIENT = process.env.SOLANA_RECIPIENT!;
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // mainnet USDC
const BASE_ATOMIC = "10000"; // 0.01 USDC — single source of truth
const SOLANA_NETWORK = SOLANA_MAINNET_CAIP2 as `${string}:${string}`; // "solana:<genesis-hash>"

async function main() {
  // Generate a random signer (in production, load from a secret manager).
  const keyPairSigner = await generateKeyPairSigner();
  const facilitatorSigner = toFacilitatorSvmSigner(keyPairSigner);

  // 1) Build the facilitator (handles verify/settle on incoming payments).
  const facilitator = registerExactSvmScheme(
    new x402Facilitator(),
    { signer: facilitatorSigner, networks: SOLANA_NETWORK },
  );

  // 2) Build the resource server (emits 402 + delegates to the facilitator).
  //    The server-side ExactSvmScheme knows how to construct the 402 response
  //    with the correct asset, amount, and CAIP-2 network.
  //    Cast facilitator to FacilitatorClient: @x402/core 2.16.0 has a type
  //    mismatch between x402Facilitator and FacilitatorClient (sync vs async
  //    getSupported return), but the methods are compatible at runtime.
  const server = new x402ResourceServer(facilitator as any).register(
    SOLANA_NETWORK,
    new ExactSvmServerScheme(),
  );

  const app = express();
  app.use(
    paymentMiddleware(
      {
        "GET /api/paid-weather": {
          accepts: [
            {
              scheme: "exact",
              network: SOLANA_NETWORK,
              price: { asset: USDC_MINT, amount: BASE_ATOMIC },
              payTo: SOLANA_RECIPIENT, // base58 — DO NOT LOWERCASE
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
      server,
    ),
  );

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
}

main().catch((err) => {
  console.error("Failed to start x402 seller:", err);
  process.exit(1);
});
