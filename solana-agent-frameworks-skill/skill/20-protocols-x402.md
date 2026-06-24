# x402 Protocol — Deep Dive (buyer + seller + facilitator)

> **Canonical repo:** https://github.com/coinbase/x402 (now a dev fork)
> **Spec org:** x402-foundation
> **License:** Apache-2.0
> **Latest npm (verified 2026-06-24):** `@x402/core@2.16.0`, `@x402/svm@2.16.0`, `@x402/express@2.16.0`, `@x402/evm@2.16.0`, `@x402/paywall@2.16.0`, `@x402/extensions@2.16.0`
> **Maintainers:** `carsonroscoe_cb`, `erik_cb` (Coinbase)
> **Python:** `pip install x402`
> **Go:** `go get github.com/x402-foundation/x402/go`
> **Note on scope:** The scope is `@x402/*` (NOT `@x402-foundation/*`).

## What it is

The HTTP **402 Payment Required** protocol, turned into a cross-chain payment layer. Synchronous HTTP authorization + asynchronous on-chain settlement, glued by a third-party **facilitator**.

## Flow (12 steps, verified)

```
1.  Client GETs resource
2.  Server returns 402 + PAYMENT-REQUIRED header (b64 of accepts[])
3.  Client picks one of accepts[*] based on scheme + network
4.  Client constructs PaymentPayload (signed authorization)
5.  Client retries with PAYMENT-SIGNATURE header (b64 of payload)
6.  Resource server POSTs payload to facilitator /verify
7.  Facilitator returns Verification Response
8.  If valid, server fulfills request (or returns another 402 on fail)
9.  Server POSTs payload to facilitator /settle
10. Facilitator submits on-chain
11. Facilitator waits for confirmation
12. Server returns 200 OK + PAYMENT-RESPONSE header (b64 SettlementResponse)
```

## 402 response shape (verified)

```json
{
  "x402Version": 1,
  "accepts": [
    {
      "scheme": "exact",
      "network": "solana",
      "maxAmountRequired": "10000",
      "resource": "https://example.com/weather",
      "description": "Weather data",
      "mimeType": "application/json",
      "payTo": "<base58_solana_address>",
      "extra": { "name": "USDC", "version": "2" }
    }
  ]
}
```

Returned in the `PAYMENT-REQUIRED` header as **base64** of the JSON.

## Schemes (verified)

- **`exact`** — the only shipping scheme (buyer pays exactly the amount)
- **`upto`** — proposed (for LLM-token-billed; not yet shipped)

## Networks (verified)

- **EVM:** chainId-named (`eip155:8453` for Base)
- **SVM (Solana):** `solana` / `solana-devnet` (CAIP-2: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`)

## TypeScript packages (verified 2026-06-24)

```bash
npm install @x402/core \
  @x402/evm @x402/svm @x402/stellar \
  @x402/axios @x402/fastify @x402/fetch @x402/express @x402/hono \
  @x402/next @x402/paywall @x402/extensions
```

- `@x402/core@2.16.0` — types + shared interfaces, deps `zod ^3.24.2`
- `@x402/svm@2.16.0` — **the Solana VM adapter**, deps `@solana-program/compute-budget ^0.11.0`, `@solana-program/token-2022 ^0.6.1`, `@solana-program/token ^0.9.0`
- `@x402/express@2.16.0` — Express server middleware
- `@x402/fetch@2.16.0` / `@x402/axios@2.16.0` — client adapters
- `@x402/paywall@2.16.0` — drop-in 402 page
- `@x402/next@2.16.0` / `@x402/hono@2.16.0` / `@x402/fastify@2.16.0` — server middleware

## Seller pattern (Express)

> ⚠ **API correction (verified 2026-06-24 from `@x402/express@2.16.0` types).** `paymentMiddleware(routes)` requires a pre-configured `x402ResourceServer` as the 2nd arg. For a one-shot setup, use `paymentMiddlewareFromConfig(routes, facilitatorClients?, schemes?, ...)` — the one-arg form is **not** valid.
>
> ⚠ **Schema correction.** The current `PaymentOption` uses `price: { asset, amount }` (V2-style), not V1's separate `maxAmountRequired` + `asset` fields. The `network` is CAIP-2 format (`solana:<genesis-hash>`), not just `"solana"`.

```typescript
import express from "express";
import { paymentMiddlewareFromConfig } from "@x402/express";

const app = express();
app.use(paymentMiddlewareFromConfig(
  {
    "GET /api/paid-weather": {
      accepts: [{
        scheme: "exact",
        network: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp", // CAIP-2
        price: {
          asset: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  // USDC mint — base58, DO NOT LOWERCASE
          amount: "10000",  // 0.01 USDC (6 decimals)
        },
        payTo: "<your-base58-solana-address>",  // base58 — DO NOT LOWERCASE
        maxTimeoutSeconds: 60,
        extra: { name: "USDC", version: "2" },
      }],
      description: "Weather data",
    },
  },
  // Optional: facilitatorClients and schemes
));

app.get("/api/paid-weather", (req, res) => {
  res.json({ temp: 72, condition: "sunny" });
});

app.listen(3000);
```

## Buyer pattern (Python)

```python
# pip install x402
from x402.clients.httpx import x402HttpxClient
import httpx

client = x402HttpxClient(account=my_solana_account)
response = client.get("https://api.example.com/weather")
# Client auto-pays any 402 challenge within max_payment_value
```

## Buyer pattern (TypeScript with mcpay)

```typescript
import { withX402Client } from 'mcpay/client';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const transport = new StreamableHTTPClientTransport(new URL('https://...'));
const client = new Client({name: 'my-app', version: '1.0.0'}, {capabilities: {}});
await client.connect(transport);

const paymentClient = withX402Client(client, {
  wallet: { svm: solanaSigner },
  maxPaymentValue: BigInt(0.1 * 10 ** 6), // 0.1 USDC cap
});
```

## Buyer pattern (TypeScript with ElizaOS)

```bash
# ⚠ Alpha — pin to a specific version
npm install @elizaos/plugin-x402@2.0.0-alpha.1
```

⚠ See `10-frameworks-elizaos.md` for the alpha warning.

## Facilitator landscape (research, partial)

| Facilitator | Networks | Status | Notes |
|---|---|---|---|
| **PayAI** (payai.network) | Solana + EVM | verified | early; runs an x402 agent on Solana |
| **Corbits** (corbits.xyz) | Solana + EVM | verified | early facilitator |
| **Crossmint** | Solana + EVM | verified | also a wallet provider; receives x402 |
| **Daydreams Router** | Base, Solana | verified | `router.daydreams.systems`; pay-per-use USDC |
| **MCPay** (mcpay.fun) | EVM + SVM (solana, solana-devnet) | verified | `mcpay/handler` + `mcpay/client` + `mcpay/connect` CLI |
| **AVO Protocol** | unknown | **unverified — URL not found** | placeholder slot |
| **Pay.sh (Google Cloud × Solana)** | unknown | **unverified — URL not found** | placeholder slot |

**For production:** start with MCPay (verifiable, npm-installable, supports SVM) or Crossmint (also a wallet provider). Add a fallback to the Daydreams Router.

## SVM settlement quirks (Solana-specific)

1. **base58 is case-sensitive** — never `.toLowerCase()` `payTo`, `asset`, or mint. **Funds-loss class bug.** Enforced by `rules/x402-base58-case-sensitivity.md`.
2. **`feePayer` in `extra`** — the facilitator sponsors gas. Required for agents without SOL.
3. **Compute budget** — facilitator sets CU limit; if your tx exceeds, the settlement reverts.
4. **Blockhash expiry** — `lastValidBlockHeight` matters; `blockhash` alone is not enough.
5. **Multi-rail parity (I2)** — if you advertise Base + Solana, the dollar amount MUST match. Derive from one base.
6. **Resource binding (I3)** — sign `H(method‖URI‖body)` too, not just `(merchant, value, nonce, expiry)`. Cross-resource substitution has 100% success against the official SDKs otherwise.

## Cross-link: x402 seller security

> For the **security** of x402 sellers, see PR #19 `solana-x402-seller-security-skill`. It maps the 5 academic Security Invariants (arXiv:2605.30998) and the 5 documented attacks (arXiv:2605.11781) to concrete Solana-aware defenses, plus a zero-dependency heuristic checker. **This skill (solana-agent-frameworks) and the x402-seller-security skill are complementary.**

## See also

- `00-decision-tree.md` — when to use x402 in your agent
- `10-frameworks-elizaos.md` — the alpha x402 plugin
- `11-frameworks-lucid-agents.md` — the first-class x402 framework
- `12-frameworks-swarms.md` — the Python x402 quickstart
- `30-wallets-crossmint-mcpay.md` — wallet providers
- `../agents/x402-seller.md` — specialist seller agent
- `../agents/x402-buyer.md` — specialist buyer agent
- `../commands/publish-blink.md` — publish an x402 Blink
- `../commands/spin-up-x402-seller.md` — spin up an Express seller
- `../examples/hello-x402-blink-on-dialto/` — runnable seller example
- `../examples/hello-x402-buyer-with-mcpay/` — runnable buyer example
