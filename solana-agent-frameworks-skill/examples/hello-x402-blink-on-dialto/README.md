# hello-x402-blink-on-dialto

A minimal x402 seller on Solana that exposes a paid endpoint. Verified end-to-end with a real 402 response.

## What's in this example

- `package.json` — pinned versions: `@x402/core@2.16.0`, `@x402/svm@2.16.0`, `@x402/express@2.16.0`
- `tsconfig.json` — Node16 module + moduleResolution (required for `@x402/*` packages)
- `server.ts` — Express server with a self-hosted facilitator + resource server
- `.env.example` — required env vars
- `README.md` — run instructions

## What it demonstrates

- x402 402 Payment Required response with the V2 schema
- Self-hosted x402Facilitator (verify/settle) + x402ResourceServer (402 emission)
- SVM server-side + facilitator-side schemes wired together
- CAIP-2 network identifier (`solana:<genesis-hash>`)
- V2 `price: { asset, amount }` schema
- `maxTimeoutSeconds: 60`
- `extra.feePayer` set automatically

## Architecture

```
self-hosted single-process:
  x402Facilitator (handles verify/settle)
  └─ registerExactSvmScheme() with signer

  x402ResourceServer (emits 402)
  └─ register(SOLANA_NETWORK, ExactSvmScheme server)
  └─ wrapped with facilitator

  paymentMiddleware (Express)
  └─ routes with PaymentOption (V2 schema)
```

## Quick start

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env
# edit .env: SOLANA_RECIPIENT=<your-base58-solana-wallet>

# 3. Run
npx tsx server.ts
```

## Test

```bash
# 1. Hit the paid endpoint — should return 402
curl -i http://localhost:3000/api/paid-weather
```

Expected response:
```
HTTP/1.1 402 Payment Required
Content-Type: application/json; charset=utf-8
PAYMENT-REQUIRED: <base64 of accepts[]>
```

Decoded `PAYMENT-REQUIRED` (base64):
```json
{
  "x402Version": 2,
  "error": "Payment required",
  "resource": {
    "url": "http://localhost:3000/api/paid-weather",
    "description": "Weather data"
  },
  "accepts": [
    {
      "scheme": "exact",
      "network": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
      "amount": "10000",
      "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "maxTimeoutSeconds": 60,
      "extra": {
        "name": "USDC",
        "version": "2",
        "feePayer": "<random-keypair-address>"
      }
    }
  ]
}
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

## ⚠ Base58 safety

NEVER `.toLowerCase()` the `payTo` or `asset` fields. Base58 is case-sensitive. This is enforced by `../../rules/x402-base58-case-sensitivity.md`.

## ⚠ Pair with security skill

For the security layer, install PR #19 `solana-x402-seller-security-skill`. It ships a zero-dependency linter (`x402-seller-lint`) that catches 10 common seller bugs (R1–R10).

## Files

- `package.json` — deps (with `type: "module"`)
- `tsconfig.json` — Node16 module + moduleResolution (required for `@x402/*`)
- `server.ts` — minimal Express seller with self-hosted facilitator
- `.env.example` — env template
- `README.md` — this file

## See also

- `../../references/20-protocols-x402.md` — x402 protocol deep dive
- `../../references/21-protocols-actions-blinks.md` — Solana Actions / Blinks
- `../../agents/x402-seller.md` — the seller specialist
- `../../agents/blink-author.md` — the Blink author specialist
- `../../commands/spin-up-x402-seller.md` — the scaffold command
- `../../commands/publish-blink.md` — publish a Blink
