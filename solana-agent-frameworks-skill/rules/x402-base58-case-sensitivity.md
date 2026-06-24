# x402 base58 case sensitivity — ALWAYS ENFORCE

> This rule is **always on**. Any code that touches a Solana address or mint must preserve case. Lowercasing one is **funds-loss class** — there's no chargeback on Solana.

## The bug

EVM addresses are hex. Many SDKs reflexively `.toLowerCase()` them for comparison/normalization (e.g. when reading from an EIP-712 message). Solana addresses (`payTo`, the USDC SPL mint, `feePayer`) are **base58 and case-sensitive**. Lowercasing one produces a *different, usually invalid* address. There is no chargeback: **funds are lost**.

## Examples

### WRONG — corrupts the destination on Solana

```typescript
payTo: String(req.payTo).toLowerCase(),
asset: String(req.asset).toLowerCase(),
mint:  String(req.mint).toLowerCase(),
feePayer: String(req.feePayer).toLowerCase(),
```

### RIGHT — gate EVM normalization behind an SVM check

```typescript
function normalizeForCdp(req) {
  const svm = String(req.network).startsWith("solana");
  return {
    ...req,
    payTo: svm ? req.payTo : String(req.payTo).toLowerCase(),
    asset: svm ? req.asset : String(req.asset).toLowerCase(),
    mint:  svm ? req.mint  : String(req.mint).toLowerCase(),
  };
}
```

### ALSO RIGHT — skip normalization entirely (preserve original case)

```typescript
const payTo = req.payTo;  // never touch the case
const asset = req.asset;
```

## What the linter should catch

Any unguarded `.toLowerCase()` applied to a value that came from a `payTo`, `asset`, `mint`, or `feePayer` field on a request where the `network` is or could be `solana`.

For the heuristic linter, see PR #19 `solana-x402-seller-security-skill`'s `R1` rule.

## Where to enforce

- **Server code** (sellers): any `payTo`/`asset`/`mint`/`feePayer` normalization
- **Client code** (buyers): any wallet comparison or signing
- **Agent code**: any string operation on a Solana address

## Verify it

```bash
# 1. Hit your own 402 endpoint
curl -i https://your-seller.example.com/api/paid-route

# 2. Verify the addresses in the response are the correct case
# 3. If they look lowercased, STOP and fix before going live
```

## Related

- `references/20-protocols-x402.md` — x402 protocol
- `references/30-wallets-crossmint-mcpay.md` — wallet providers
- `agents/x402-seller.md` — the seller specialist
- `agents/x402-buyer.md` — the buyer specialist

## Citation

> DIALLLOUBE-PR-19, x402-seller-security-skill: "On Solana, a single reflexive `.toLowerCase()` on a base58 address means **lost funds** — a failure mode the EVM-centric papers don't even mention."
