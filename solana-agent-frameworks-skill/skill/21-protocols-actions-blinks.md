# Solana Actions & Blinks — Deep Dive

> **Spec docs:** https://solana.com/docs/advanced/actions
> **SDK repo:** https://github.com/solana-developers/solana-actions
> **SDK npm:** `@solana/actions@1.6.6` (Apache-2.0, 146⭐)
> **Typedocs:** https://solana-developers.github.io/solana-actions/
> **Examples:** https://solana-actions.vercel.app/
> **Hosted registry:** https://dial.to (Dialect) — canonical Blink URL host

## What they are

A **Solana Action** is a spec for an HTTP endpoint that returns a transaction for the user to sign. A **Blink** is a shareable URL (e.g. on X) that any Blink-aware wallet can resolve into a signable transaction.

```
User sees "Swap 0.1 SOL" in a tweet
  → Click the Blink (e.g. dial.to/?action=solana-action:...)
    → Wallet fetches the action endpoint
      → Wallet prompts the user to sign
        → Tx lands on Solana
```

## Spec — `ActionGetResponse`

```typescript
import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";

const response: ActionGetResponse = {
  icon: "https://example.com/icon.png", // 200x200 recommended
  title: "Donate SOL",
  description: "Send SOL to the treasury",
  label: "Donate", // ≤ 12 chars
  links: {
    actions: [
      { label: "0.1 SOL", href: "/api/actions/memo?amount=0.1" },
      { label: "1 SOL",   href: "/api/actions/memo?amount=1.0" },
    ],
  },
};

return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
```

## Spec — POST handler

```typescript
import { createPostResponse, ActionPostResponse } from "@solana/actions";

export const POST = async (req: Request) => {
  const { account } = await req.json();
  const tx = buildMemoTransaction(account);
  const response: ActionPostResponse = createPostResponse({
    fields: {
      transaction: bs58.encode(tx.serializeMessage()),
      message: "Donation sent!",
    },
  });
  return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
};

export const OPTIONS = async () => Response.json(null, { headers: ACTIONS_CORS_HEADERS });
```

## The `dial.to` URL grammar (verified)

```
https://dial.to/?action=solana-action:<url-encoded-action-api>
```

Examples:
- `https://dial.to/?action=solana-action:https%3A%2F%2Fyour-api.com%2Fapi%2Faction%2Fswap`
- `https://dial.to/?action=solana-action:http%3A%2F%2Flocalhost%3A3000%2Fapi%2Faction%2Fmemo`

Hosted by **Dialect** at `dial.to` — the canonical Blink host.

Alternative: `solana-action:<url>` (resolved by Blink-aware clients like Phantom, Backpack, Dialect's Chrome extension).

## Publishing checklist

- [ ] Icon URL is HTTPS and 200x200 pixels
- [ ] `label` is ≤ 12 characters
- [ ] CORS headers present (`ACTIONS_CORS_HEADERS`)
- [ ] `action.json` valid against `@solana/actions` types
- [ ] No mainnet private RPCs leaked
- [ ] base58 addresses preserved (no `.toLowerCase()`)
- [ ] Tested in Phantom / Backpack / Dialect's Blink tester

## Production users

- **Jupiter** — swap Blinks in tweets
- **Dialect** — `dial.to` is the registry
- **Backpack** — first-class Blink client
- **Phantom** — first-class Blink client
- **100s of community Blinks** for swap, vote, mint, donate

## Use with an agent framework

| Framework | How to expose a Blink |
|---|---|
| **ElizaOS** | Build the Action endpoint in a SAK plugin, host on Vercel, publish to `dial.to` |
| **Lucid Agents** | Use `@lucid-agents/payments` + Actions endpoint |
| **SAK** | Use `plugin-blinks` to execute Blinks, or build your own endpoint |
| **Swarms** | Host the endpoint on FastAPI, use Python Actions SDK |
| **Daydreams (legacy)** | Use Daydreams router with Actions |

## See also

- `00-decision-tree.md` — when Blinks fit
- `22-protocols-dialect.md` — `dial.to` integration
- `20-protocols-x402.md` — for paid APIs (Blinks + x402 are complementary)
- `../agents/blink-author.md` — specialist Blink author
- `../commands/publish-blink.md` — publish a Blink to dial.to
- `../examples/hello-x402-blink-on-dialto/` — runnable Action endpoint
- `../templates/action.json.example` — minimal ActionGetResponse
