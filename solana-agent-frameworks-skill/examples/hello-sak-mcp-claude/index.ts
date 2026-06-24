/**
 * Minimal SendAI solana-agent-kit (SAK) agent.
 * ⚠ For production, replace KeypairWallet with TurnkeyWallet or PrivyWallet.
 *    See rules/use-embed-wallet-not-private-key.md.
 */

import {
  SolanaAgentKit,
  createVercelAITools,
  KeypairWallet,
  TurnkeyWallet,
} from "solana-agent-kit";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

import TokenPlugin from "@solana-agent-kit/plugin-token";
import DefiPlugin from "@solana-agent-kit/plugin-defi";
import MiscPlugin from "@solana-agent-kit/plugin-misc";
import BlinksPlugin from "@solana-agent-kit/plugin-blinks";

async function main() {
  // ── Wallet (dev: keypair; prod: Turnkey/Privy) ───────────────────────────
  let wallet;
  if (process.env.TURNKEY_API_KEY) {
    wallet = new TurnkeyWallet({
      apiKey: process.env.TURNKEY_API_KEY!,
      organizationId: process.env.TURNKEY_ORG_ID!,
      signWith: process.env.TURNKEY_SIGN_WITH!,
    });
  } else {
    console.warn(
      "⚠ Using KeypairWallet from process.env.SOLANA_PRIVATE_KEY — DEV ONLY. " +
      "For production, set TURNKEY_API_KEY + TURNKEY_ORG_ID + TURNKEY_SIGN_WITH."
    );
    const keypair = Keypair.fromSecretKey(
      bs58.decode(process.env.SOLANA_PRIVATE_KEY!)
    );
    wallet = new KeypairWallet(keypair);
  }

  // ── Agent ────────────────────────────────────────────────────────────────
  const agent = new SolanaAgentKit(wallet, process.env.RPC_URL!, {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  })
    .use(TokenPlugin)
    .use(DefiPlugin)
    .use(MiscPlugin)
    .use(BlinksPlugin);

  // ── Vercel AI tools ──────────────────────────────────────────────────────
  const tools = createVercelAITools(agent, agent.actions);
  console.log(`SAK agent ready with ${Object.keys(tools).length} tools.`);
  console.log("Tools:", Object.keys(tools).join(", "));
}

main().catch(console.error);
