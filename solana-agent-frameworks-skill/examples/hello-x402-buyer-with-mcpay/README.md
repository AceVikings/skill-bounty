# hello-x402-buyer-with-mcpay

A minimal x402 buyer — an agent that auto-pays 402 challenges on Solana using MCPay.

## What's in this example

- `package.json` — pinned versions: `mcpay@0.1.17`, `@x402/core@2.16.0`
- `buyer.ts` — TypeScript buyer that auto-pays up to `maxPaymentValue`
- `.env.example` — required env vars
- `README.md` — run instructions

## What it demonstrates

- `mcpay/client` `withX402Client` with `maxPaymentValue` guard
- Auto-pay 402 challenges up to a per-call cap
- Structured logging of every paid call
- Dev wallet vs production wallet guidance

## Quick start

```bash
# 1. Install
npm install mcpay@0.1.17 @x402/core@2.16.0

# 2. Copy .env.example to .env
cp .env.example .env
# edit .env: SVM_SECRET_KEY (a dev wallet with USDC on Solana)
#           MAX_PAYMENT_VALUE (in atomic units; 100000 = 0.1 USDC)

# 3. Run
npx tsx buyer.ts https://seller.example.com/api/paid-weather
```

## What it does

1. Hits the seller URL
2. If the response is 402, parses `accepts[]` and picks the Solana rail
3. Signs the payment payload with the SVM signer
4. Retries with the `PAYMENT-SIGNATURE` header
5. Logs the amount paid + tx signature

The agent will refuse to pay if:
- The amount exceeds `maxPaymentValue`
- The network is not Solana
- The wallet has insufficient USDC

## ⚠ maxPaymentValue is non-negotiable

ALWAYS set `maxPaymentValue`. Never let an agent auto-pay unbounded amounts. Default: 0.1 USDC per call.

## ⚠ Use a dedicated wallet

The buyer wallet should hold only the per-call float. Top up from the main wallet. **Never** reuse the main agent wallet for x402 buyer — a prompt injection could drain it.

## Files

- `package.json` — deps
- `buyer.ts` — minimal TypeScript buyer
- `.env.example` — env template
- `README.md` — this file

## See also

- `../../references/20-protocols-x402.md` — x402 protocol
- `../../references/30-wallets-crossmint-mcpay.md` — wallet selection
- `../../agents/x402-buyer.md` — the buyer specialist
- `../hello-x402-blink-on-dialto/` — the matching seller example
