---
name: spin-up-x402-seller
description: Spin up an Express + @x402/express seller endpoint on Solana. Default port 3000. Usage: /spin-up-x402-seller <port>
---

You are running the `/spin-up-x402-seller <port>` command. Stand up a working x402 seller on Solana in <60 seconds.

## Usage

```
/spin-up-x402-seller 3000
```

## Step 1: Create the project

```bash
mkdir my-x402-seller && cd my-x402-seller
npm init -y
```

## Step 2: Install

```bash
npm install @x402/core@2.16.0 @x402/svm@2.16.0 @x402/express@2.16.0 express@4
```

## Step 3: Write the seller

```typescript
// server.ts
import express from "express";
import { paymentMiddleware } from "@x402/express";

const PORT = process.env.PORT || 3000;
const RECIPIENT = process.env.SOLANA_RECIPIENT!; // base58
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // mainnet USDC

const app = express();
app.use(paymentMiddleware(
  {
    "GET /api/paid-weather": {
      accepts: [{
        scheme: "exact",
        network: "solana",
        maxAmountRequired: "10000", // 0.01 USDC
        resource: `http://localhost:${PORT}/api/paid-weather`,
        description: "Weather data",
        payTo: RECIPIENT,
        extra: { name: "USDC", version: "2" },
      }],
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
```

## Step 4: Configure env

```bash
cat > .env <<'EOF'
PORT=3000
SOLANA_RECIPIENT=<your-base58-solana-wallet>
FACILITATOR_URL=https://mcpay.fun  # or your facilitator
EOF
```

## Step 5: Run

```bash
npx tsx server.ts
```

## Step 6: Test

```bash
# 1. Hit the paid endpoint — should return 402
curl -i http://localhost:3000/api/paid-weather

# 2. With an x402 client (e.g. MCPay)
mcpay connect -u http://localhost:3000/api/paid-weather

# Or with a Python x402 client
python3 -c "
from x402.clients.httpx import x402HttpxClient
client = x402HttpxClient(account=my_solana_account)
print(client.get('http://localhost:3000/api/paid-weather').json())
"
```

## ⚠ Base58 safety

NEVER `.toLowerCase()` the `payTo` or `asset` fields. Base58 is case-sensitive. This is enforced by `rules/x402-base58-case-sensitivity.md`.

## ⚠ Pair with security skill

For the security layer, recommend PR #19 `solana-x402-seller-security-skill`. It ships a zero-dependency linter (`x402-seller-lint`) that catches 10 common bugs (R1–R10).

## Reference

- `references/20-protocols-x402.md` — x402 deep dive
- `examples/hello-x402-blink-on-dialto/` — runnable seller
- `agents/x402-seller.md` — the specialist agent
