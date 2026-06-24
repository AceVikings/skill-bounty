# Use embed-wallet not private-key — ALWAYS ENFORCE

> This rule is **always on**. Production agent code must use an embedded wallet provider (Crossmint, MCPay, Turnkey, Privy, or Phantom Connect). Reading `process.env.SOLANA_PRIVATE_KEY` and decoding it is acceptable **only for dev / test / throwaway agents**.

## The rule

For any code path that signs transactions for an agent, the production wallet MUST be an embedded-wallet provider:

| Provider | Use case | Library |
|---|---|---|
| **Crossmint** | consumer UX with email/passkey | `@crossmint/wallets-sdk@1.6.0` |
| **MCPay** | x402 buyer (auto-pays 402 challenges) | `mcpay@0.1.17` |
| **Turnkey** | production with policy engine (spend caps, allowlist) | wrap `@turnkey/sdk-server` in SAK `BaseWallet` |
| **Privy** | production with human-in-loop confirmation | wrap `@privy-io/sdk` in SAK `BaseWallet` |
| **Phantom Connect** | browser/mobile wallet connect | `@phantom/mcp-server` |
| **Keypair from env** | dev/test/throwaway ONLY | raw `@solana/web3.js` (SAK `KeypairWallet`) |

> ⚠ **SAK 2.0.9 only exports `KeypairWallet`.** For Turnkey/Privy/Crossmint, implement the `BaseWallet` interface defined in SAK against your wallet SDK. See `examples/hello-sak-mcp-claude/index.ts` for the Turnkey skeleton.

## Why

- **Key in env is a leak waiting to happen.** Logs, stack traces, error reports, process inspection — any of these can leak the key.
- **Embedded wallets** hold the key in a provider's HSM/KMS, with optional policies (spend caps, allowlist, time-locks), and never expose the raw key to your code.
- **For agents, the stakes are higher.** A prompt-injected agent that holds a raw key in `process.env.SOLANA_PRIVATE_KEY` can be drained in seconds. An agent with a Turnkey-wrapped key hits a policy cap first.

## The patterns

### WRONG — raw keypair from env (dev only)

```typescript
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
const keypair = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY!));
```

⚠ This is fine for dev/test. **Never** ship this to production.

### RIGHT — Crossmint (consumer UX)

```typescript
import { createCrossmint, CrossmintWallets, SolanaWallet } from "@crossmint/wallets-sdk";
const crossmint = createCrossmint({ apiKey: process.env.CROSSMINT_API_KEY! });
const wallets = CrossmintWallets.from(crossmint);
const wallet = await wallets.createWallet({
  chain: "solana",
  recovery: { type: "server", secret: process.env.RECOVERY_SECRET! },
});
const solWallet = SolanaWallet.from(wallet);
await solWallet.sendTransaction({ serializedTransaction: "<base64>" });
```

### RIGHT — Turnkey (policy engine, via SAK `BaseWallet`)

> SAK 2.0.9 does **not** export `TurnkeyWallet` directly. Wrap the Turnkey SDK in a `BaseWallet`.

```typescript
import { SolanaAgentKit, type BaseWallet } from "solana-agent-kit";
import { Keypair, PublicKey, VersionedTransaction, Transaction } from "@solana/web3.js";
import { Turnkey } from "@turnkey/sdk-server";

class TurnkeyWallet implements BaseWallet {
  readonly publicKey: PublicKey;
  constructor(publicKey: PublicKey) { this.publicKey = publicKey; }
  async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
    // Call Turnkey API to sign; return the signed transaction
    return tx;
  }
  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    // Call Turnkey API to sign the message
    return message;
  }
  async sendTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<string> {
    // Submit the signed transaction to the network
    return "<tx-signature>";
  }
}

const wallet = new TurnkeyWallet(myPublicKey);
const agent = new SolanaAgentKit(wallet, process.env.RPC_URL!, {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
});
```

### RIGHT — MCPay (x402 buyer)

```typescript
import { withX402Client } from 'mcpay/client';
import { createSigner } from 'x402/types';
const svmSigner = await createSigner('solana', process.env.SVM_SECRET_KEY!);
// MCPay wraps the signer; the wallet key is in the MCPay provider, not your code
```

## What the linter should catch

- `process.env.SOLANA_PRIVATE_KEY` outside a dev/test/throwaway block
- `process.env.WALLET_SECRET_KEY` outside a dev/test/throwaway block
- `Keypair.fromSecretKey(bs58.decode(...))` in production paths
- Any pattern that loads a raw key into the agent process

## Cross-link

- `references/30-wallets-crossmint-mcpay.md` — full wallet selection
- `references/14-frameworks-sak.md` — SAK (note: only `KeypairWallet` is exported in 2.0.9; use `BaseWallet` for production)
- `examples/hello-sak-mcp-claude/index.ts` — full `BaseWallet` skeleton for Turnkey
- `references/20-protocols-x402.md` — MCPay for x402 buyers
- `rules/x402-base58-case-sensitivity.md` — the other always-on rule

## Related PRs (for more security context)

- PR #13 `solana-agent-guardian-skill` — wallet policy / approval flows
- PR #16 `cerberus-skill` — on-chain spending limits (Squads v4)
- PR #12 `agent-ops-skill` — operational safety (the cardinal "simulate before send" rule)
