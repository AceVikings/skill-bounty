---
name: publish-blink
description: Generate a Solana Action endpoint, validate against @solana/actions types, publish to dial.to, and return the shareable Blink URL. Usage: /publish-blink <name> <icon-url> <amount>
---

You are running the `/publish-blink <name> <icon-url> <amount>` command. Generate a working Solana Action endpoint, validate it, and publish to dial.to.

## Usage

```
/publish-blink my-swap https://my-domain.com/icon.png 0.1
```

## Step 1: Confirm inputs

Ask the user for any missing inputs:
- `name` — what the action does (e.g. "my-swap")
- `icon-url` — HTTPS icon URL, ideally 200x200
- `amount` — the default amount (e.g. "0.1" SOL or "1000" USDC atomic)

## Step 2: Generate the Action endpoint (Next.js example)

Create `app/api/action/<name>/route.ts`:

```typescript
import {
  ActionGetResponse,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from "@solana/actions";

export const GET = async () => {
  const response: ActionGetResponse = {
    icon: "<icon-url>",
    title: "<human-readable title>",
    description: "<what it does>",
    label: "<≤12 chars>",  // CRITICAL: ≤ 12 chars or wallets truncate
    links: {
      actions: [
        { label: "<amount>", href: `/api/action/<name>?amount=<amount>` },
        // Add more if needed
      ],
    },
  };
  return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
};

export const OPTIONS = async () =>
  Response.json(null, { headers: ACTIONS_CORS_HEADERS });

export const POST = async (req: Request) => {
  // Build the transaction (left as exercise; depends on the action)
  // For a swap, integrate Jupiter; for a transfer, build a SystemProgram::Transfer.
  // See examples/hello-x402-blink-on-dialto/ for a working swap.
  const tx = new Transaction(); // <-- build the actual transaction

  const response: ActionPostResponse = createPostResponse({
    fields: {
      transaction: bs58.encode(tx.serializeMessage()),
      message: "<human-readable success message>",
    },
  });
  return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
};
```

## Step 3: Validate the shape

Run the validator:
```bash
node -e "
const ajv = require('ajv');
const schema = require('@solana/actions/dist/types/ActionGetResponse.json');
const validate = ajv.compile(schema);
const data = require('./app/api/action/<name>/route.ts');
console.log(validate(data) ? 'VALID' : 'INVALID: ' + JSON.stringify(validate.errors));
"
```

Or run `npx vercel dev` and `curl -i http://localhost:3000/api/action/<name>` to verify the live response.

## Step 4: Test CORS

```bash
curl -i -X OPTIONS http://localhost:3000/api/action/<name> -H "Origin: https://dial.to" -H "Access-Control-Request-Method: GET"
```

Should return 204 with `Access-Control-Allow-Origin: *` (or specific origin).

## Step 5: Generate the dial.to URL

```bash
ACTION_API="https://your-production-domain.com/api/action/<name>"
ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$ACTION_API', safe=''))")
DIALTO_URL="https://dial.to/?action=solana-action:$ENCODED"
echo $DIALTO_URL
```

Output: `https://dial.to/?action=solana-action:https%3A%2F%2Fyour-production-domain.com%2Fapi%2Faction%2Fmy-swap`

## Step 6: Test in a wallet

1. Copy the `DIALTO_URL`
2. Open Phantom wallet
3. Paste the URL into the in-app browser
4. Verify the Blink renders correctly
5. Sign the transaction
6. Verify the tx lands on Solana

Also test in Backpack and the Dialect Chrome extension.

## Step 7: Publish checklist

- [ ] Icon URL is HTTPS and 200x200
- [ ] `label` is ≤ 12 characters
- [ ] CORS headers on every response
- [ ] `action.json` valid against `@solana/actions` types
- [ ] base58 addresses preserved (no `.toLowerCase()`)
- [ ] Tested in Phantom
- [ ] Tested in Backpack
- [ ] Tested in Dialect's Blink tester

## Step 8: Hand off

Return to the user:
- The dial.to URL
- The icon + label
- The list of tested wallets
- A "ready to share on X" suggestion

## Reference

- `references/21-protocols-actions-blinks.md` — Solana Actions deep dive
- `examples/hello-x402-blink-on-dialto/` — runnable example
- `templates/action.json.example` — minimal ActionGetResponse
- `agents/blink-author.md` — the specialist agent
