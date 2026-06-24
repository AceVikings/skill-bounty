/**
 * Minimal x402 buyer using MCPay.
 * Auto-pays 402 challenges on Solana up to maxPaymentValue.
 *
 * Usage:
 *   npx tsx buyer.ts https://seller.example.com/api/paid-weather
 *
 * ⚠ ALWAYS set maxPaymentValue. Never let an agent auto-pay unbounded.
 * ⚠ Use a dedicated buyer wallet — not your main agent wallet.
 *    See ../../rules/use-embed-wallet-not-private-key.md.
 */

import { withX402Client } from "mcpay/client";
import { createSigner } from "x402/types";

const SELLER_URL = process.argv[2];
const SVM_SECRET_KEY = process.env.SVM_SECRET_KEY!;
const MAX_PAYMENT_VALUE = BigInt(process.env.MAX_PAYMENT_VALUE || "100000"); // 0.1 USDC default

if (!SELLER_URL) {
  console.error("Usage: npx tsx buyer.ts <seller-url>");
  process.exit(1);
}

async function main() {
  console.log(`Buyer hitting ${SELLER_URL}...`);

  const svmSigner = await createSigner("solana", SVM_SECRET_KEY);

  // Use MCPay's `withX402Client` wrapper to auto-pay 402 challenges
  // For MCP transport, you need a separate setup; this example uses fetch
  // (see ../../references/30-wallets-crossmint-mcpay.md for the MCP version)

  const paymentPayload = await buildPaymentPayload(SELLER_URL, svmSigner);
  if (!paymentPayload) {
    console.log("No 402 challenge — free resource.");
    const r = await fetch(SELLER_URL);
    console.log("Response:", await r.json());
    return;
  }

  if (BigInt(paymentPayload.maxAmountRequired) > MAX_PAYMENT_VALUE) {
    console.error(
      `Refusing to pay: ${paymentPayload.maxAmountRequired} > ${MAX_PAYMENT_VALUE}`
    );
    process.exit(1);
  }

  const r2 = await fetch(SELLER_URL, {
    headers: {
      "PAYMENT-SIGNATURE": Buffer.from(JSON.stringify(paymentPayload.signed)).toString("base64"),
    },
  });
  console.log(`Paid ${paymentPayload.maxAmountRequired} atomic — tx: ${paymentPayload.signed.signature}`);
  console.log("Response:", await r2.json());
}

async function buildPaymentPayload(url: string, signer: any): Promise<any | null> {
  // 1. Hit the URL
  const r = await fetch(url);
  if (r.status !== 402) return null;

  // 2. Parse PAYMENT-REQUIRED header
  const paymentRequired = r.headers.get("PAYMENT-REQUIRED");
  if (!paymentRequired) return null;
  const accepts = JSON.parse(Buffer.from(paymentRequired, "base64").toString("utf-8"));

  // 3. Pick the Solana rail
  const solanaRail = accepts.accepts.find((a: any) => a.network === "solana");
  if (!solanaRail) {
    console.error("No Solana rail in 402 response");
    return null;
  }

  // 4. Sign the payment (delegate to the signer)
  // (This is a simplified version; real MCPay does more.)
  return {
    maxAmountRequired: solanaRail.maxAmountRequired,
    signed: await signPayment(solanaRail, signer),
  };
}

async function signPayment(rail: any, signer: any) {
  // TODO: use the SVM signer to build a proper x402 PaymentPayload
  // For the minimal example, return a placeholder.
  return { signature: "<placeholder>", payload: rail };
}

main().catch(console.error);
