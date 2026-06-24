/**
 * Minimal SendAI solana-agent-kit (SAK) agent.
 * Verified against solana-agent-kit@2.0.9 (2026-06-24).
 *
 * ⚠ For production, replace KeypairWallet with a BaseWallet implementation
 *    for your wallet provider. SAK 2.0.9 only exports KeypairWallet;
 *    TurnkeyWallet/PrivyWallet are NOT exported. See the README for the
 *    BaseWallet skeleton (Turnkey/Privy/Crossmint).
 *
 * ⚠ The plugin versions are pinned to match the latest npm registry values:
 *    - plugin-token@2.0.9 (latest)
 *    - plugin-defi@2.0.8 (latest)
 *    - plugin-misc@2.0.6 (latest)
 *    - plugin-blinks@2.0.5 (latest)
 *    The npm `overrides` field in package.json forces a single SAK version.
 */

import {
  SolanaAgentKit,
  createVercelAITools,
  KeypairWallet,
  type BaseWallet,
} from "solana-agent-kit";
import { Keypair, PublicKey, VersionedTransaction, Transaction } from "@solana/web3.js";
import bs58 from "bs58";
import TokenPlugin from "@solana-agent-kit/plugin-token";
import DefiPlugin from "@solana-agent-kit/plugin-defi";
import MiscPlugin from "@solana-agent-kit/plugin-misc";
import BlinksPlugin from "@solana-agent-kit/plugin-blinks";

async function main() {
  // ── Dev: raw keypair from env (NEVER use in production) ────────────────
  const keypair = Keypair.fromSecretKey(
    bs58.decode(process.env.SOLANA_PRIVATE_KEY || bs58.encode(new Uint8Array(64))),
  );
  const wallet = new KeypairWallet(keypair, "solana" as any);

  // ── For production, implement BaseWallet for your wallet provider ──────
  // SAK 2.0.9 only exports KeypairWallet. For Turnkey/Privy/Crossmint, wrap
  // them in a BaseWallet:
  //
  // import { Turnkey } from "@turnkey/sdk-server";
  // class TurnkeyWallet implements BaseWallet {
  //   readonly publicKey: PublicKey;
  //   constructor(publicKey: PublicKey) { this.publicKey = publicKey; }
  //   async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
  //     // Call Turnkey API to sign
  //   }
  //   async signMessage(message: Uint8Array): Promise<Uint8Array> {
  //     // Call Turnkey API to sign
  //   }
  //   async sendTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<string> {
  //     // Submit the signed transaction
  //   }
  // }
  // const wallet = new TurnkeyWallet(myPublicKey);

  const agent = new SolanaAgentKit(
    wallet,
    process.env.RPC_URL || "https://api.mainnet-beta.solana.com",
    {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || "sk-...",
    },
  )
    .use(TokenPlugin)
    .use(DefiPlugin)
    .use(MiscPlugin)
    .use(BlinksPlugin);

  const tools = createVercelAITools(agent, agent.actions);
  console.log(`SAK agent ready with ${Object.keys(tools).length} tools.`);
  console.log("Tools:", Object.keys(tools).join(", "));
  console.log("Wallet:", wallet.publicKey.toBase58());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
