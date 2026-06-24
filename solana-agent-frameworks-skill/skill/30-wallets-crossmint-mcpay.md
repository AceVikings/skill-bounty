# Agent Wallets — Crossmint + MCPay (+ Turnkey, Privy, Phantom)

> **Crossmint:** `@crossmint/wallets-sdk@1.6.0` (Apache-2.0, 11,974 weekly DLs)
> **MCPay:** `mcpay@0.1.17` (MIT, Dec 2025, by `microchipgnu`)
> **Turnkey:** via SAK `TurnkeyWallet` (Apache-2.0)
> **Privy:** via SAK `PrivyWallet` (Apache-2.0)
> **Phantom Connect:** `@phantom/mcp-server` (npm)

## Decision: which wallet to use

| Need | Provider | Why |
|---|---|---|
| Consumer UX (email / passkey / phone OTP) | **Crossmint** | only one with consumer-grade onboarding |
| x402 buyer (auto-pay 402 challenges) | **MCPay** | built for this exact flow |
| x402 seller (your service gets paid) | any (you receive to your own wallet) | — |
| Production agent with policy engine | **Turnkey** | spend caps, allowlist, time-locks |
| Production agent with human-in-loop | **Privy** | requires user auth per tx |
| Browser / mobile wallet connect | **Phantom Connect** | largest installed base |
| Dev / test / throwaway | **KeypairWallet** | raw `@solana/web3.js` Keypair |

## Crossmint (verified 2026-06-24)

| Field | Value |
|---|---|
| Repo | https://github.com/Crossmint/crossmint-sdk (50⭐, Apache-2.0) |
| Agent starter | https://github.com/Crossmint/agent-launchpad-starter-kit (34⭐) — "secure, non-custodial Next.js application for deploying AI agents with integrated wallet functionality" |
| Telegram agent | https://github.com/Crossmint/crossmint-checkout-telegram-agent (21⭐) |
| npm | `@crossmint/wallets-sdk@1.6.0` (Apache-2.0, 11,974 weekly DLs) |
| Chains | EVM, **Solana**, Stellar |

### Signer model

Two tiers:
- **Recovery** — email OTP, phone OTP, server, external
- **Operational** — server, external, passkey, device

Falls back to recovery if operational fails.

### Hello-world (verified)

```bash
npm install @crossmint/wallets-sdk
```

```typescript
import { createCrossmint, CrossmintWallets, SolanaWallet } from "@crossmint/wallets-sdk";

const crossmint = createCrossmint({ apiKey: "<SERVER_KEY>" });
const wallets = CrossmintWallets.from(crossmint);
const wallet = await wallets.createWallet({
  chain: "solana",
  recovery: { type: "server", secret: process.env.RECOVERY_SECRET! },
});

// Send a Solana tx
const solWallet = SolanaWallet.from(wallet);
const sig = await solWallet.sendTransaction({
  serializedTransaction: "<base64>",
});
```

### Per-wallet features

`wallet.balances()` · `wallet.send(addr, 'usdc', '10')` · `wallet.transfers({tokens, status})` · `wallet.nfts({perPage, page})` · `wallet.signers()` · `wallet.useSigner({type, secret})` · `wallet.approve({transactionId})` · `wallet.addSigner({type, secret})`

### React UI SDK

`@crossmint/client-sdk-react-ui` (provider + hooks) · `@crossmint/client-sdk-react-native-ui`

## MCPay (verified 2026-06-24)

| Field | Value |
|---|---|
| npm | `mcpay@0.1.17` (MIT, 7 months old) |
| Deps | `@modelcontextprotocol/sdk`, `x402`, `x402-fetch`, `viem`, `commander`, `zod`, `mcp-handler` |
| Networks | EVM: base-sepolia, base, avalanche-fuji, avalanche, iotex, sei, sei-testnet · **SVM: solana-devnet, solana** |
| Domain | mcpay.fun / mcpay.tech |
| API surface | `mcpay/connect` (CLI), `mcpay/client` (`withX402Client`), `mcpay/handler` (`createMcpPaidHandler`, `server.paidTool(name, desc, {price, currency}, schema, ...)`) |

### Buyer pattern (TypeScript)

```typescript
import { withX402Client } from 'mcpay/client';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { createSigner } from 'x402/types';

const svmSigner = await createSigner('solana', process.env.SVM_SECRET_KEY!);
const transport = new StreamableHTTPClientTransport(new URL('https://...'));
const client = new Client({name: 'my-app', version: '1.0.0'}, {capabilities: {}});
await client.connect(transport);

const paymentClient = withX402Client(client, {
  wallet: { svm: svmSigner },
  maxPaymentValue: BigInt(0.1 * 10 ** 6), // 0.1 USDC cap
});
```

### Seller pattern (TypeScript)

```typescript
import { createMcpPaidHandler } from 'mcpay/handler';
import { z } from 'zod';

const handler = createMcpPaidHandler((server) => {
  server.paidTool('hello', 'Say hello', { price: 0.05, currency: 'USD' },
    { name: z.string() }, {},
    async ({ name }) => ({ content: [{ type: 'text', text: `Hello, ${name}!` }] })
  );
}, {
  recipient: {
    'solana-devnet': process.env.SVM_RECIPIENT!,
  },
  facilitator: { url: "FACILITATOR_URL" },
});
```

## Turnkey & Privy (via SAK)

These come as **wallets inside SAK**, not as standalone npm packages. See `14-frameworks-sak.md` for the full pattern.

```typescript
import { SolanaAgentKit, TurnkeyWallet, PrivyWallet } from "solana-agent-kit";

// Turnkey (policy engine)
const wallet = new TurnkeyWallet({
  apiKey: process.env.TURNKEY_API_KEY!,
  organizationId: process.env.TURNKEY_ORG_ID!,
  signWith: process.env.TURNKEY_SIGN_WITH!,
});

// Privy (human-in-loop)
const wallet = new PrivyWallet({
  appId: process.env.PRIVY_APP_ID!,
  appSecret: process.env.PRIVY_APP_SECRET!,
  // ... requires user auth per tx
});
```

## Phantom Connect

```bash
npm install @phantom/mcp-server
# or
claude mcp add phantom -- npx -y @phantom/mcp-server
```

**⚠ Safety:** Phantom MCP can **sign and submit transactions**. Use only with explicit user consent. Never install as a default.

## See also

- `00-decision-tree.md` — which wallet for which agent
- `14-frameworks-sak.md` — TurnkeyWallet + PrivyWallet via SAK
- `20-protocols-x402.md` — MCPay's x402 integration
- `../rules/use-embed-wallet-not-private-key.md` — the enforced rule
