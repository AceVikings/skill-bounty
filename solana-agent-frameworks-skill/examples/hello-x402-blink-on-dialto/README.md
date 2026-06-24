# hello-x402-blink-on-dialto

A minimal x402 seller on Solana that exposes a paid endpoint and a Solana Action (Blink) at `dial.to`.

## What's in this example

- `package.json` — pinned versions: `@x402/core@2.16.0`, `@x402/svm@2.16.0`, `@x402/express@2.16.0`
- `server.ts` — Express server with a paid `/api/paid-weather` endpoint
- `.env.example` — required env vars
- `README.md` — run instructions

## What it demonstrates

- x402 402 Payment Required response
- Multi-rail (Base + Solana) parity
- Solana Action (Blink) endpoint
- `dial.to` URL grammar
- Base58 case-sensitivity safety
- Pairs with PR #19 `solana-x402-seller-security-skill` for the audit layer

## Quick start

```bash
# 1. Install
npm install @x402/core@2.16.0 @x402/svm@2.16.0 @x402/express@2.16.0 express@4

# 2. Copy .env.example to .env
cp .env.example .env
# edit .env: SOLANA_RECIPIENT (your base58 wallet)

# 3. Run
npx tsx server.ts
```

## Test

```bash
# 1. Hit the paid endpoint — should return 402
curl -i http://localhost:3000/api/paid-weather

# Expected response (truncated):
# HTTP/1.1 402 Payment Required
# PAYMENT-REQUIRED: <base64 of accepts[]>
# {
#   "x402Version": 1,
#   "accepts": [{
#     "scheme": "exact",
#     "network": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
#     "price": { "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "amount": "10000" },
#     "payTo": "<your-base58-wallet>",
#     "maxTimeoutSeconds": 60,
#     "extra": { "name": "USDC", "version": "2" }
#   }]
# }

# 2. With an x402 client (e.g. MCPay)
# (See ../hello-x402-buyer-with-mcpay for the buyer side)
```

## Generate the dial.to URL

```python
import urllib.parse
action_api = "https://your-production-domain.com/api/action/swap"
encoded = urllib.parse.quote(action_api, safe='')
dialto_url = f"https://dial.to/?action=solana-action:{encoded}"
print(dialto_url)
# Output: https://dial.to/?action=solana-action:https%3A%2F%2Fyour-production-domain.com%2Fapi%2Faction%2Fswap
```

Paste that URL into Phantom and verify the Blink renders.

## ⚠ Base58 safety

NEVER `.toLowerCase()` the `payTo` or `asset` fields. Base58 is case-sensitive. This is enforced by `../../rules/x402-base58-case-sensitivity.md`.

## ⚠ Pair with security skill

For the security layer, install PR #19 `solana-x402-seller-security-skill`. It ships a zero-dependency linter (`x402-seller-lint`) that catches 10 common seller bugs (R1–R10).

## Files

- `package.json` — deps
- `server.ts` — minimal Express seller
- `.env.example` — env template
- `README.md` — this file

## See also

- `../../references/20-protocols-x402.md` — x402 protocol deep dive
- `../../references/21-protocols-actions-blinks.md` — Solana Actions / Blinks
- `../../agents/x402-seller.md` — the seller specialist
- `../../agents/blink-author.md` — the Blink author specialist
- `../../commands/spin-up-x402-seller.md` — the scaffold command
- `../../commands/publish-blink.md` — publish a Blink
