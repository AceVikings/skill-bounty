# Daydreams — Legacy Framework (use Lucid Agents for new builds)

> **Repo:** https://github.com/daydreamsai/daydreams
> **Stars:** 608 · **License:** MIT
> **Latest release:** v0.3.22 (Sep 3 2025) — **no major release in 9+ months**
> **Status:** **In maintenance.** The team has moved to `lucid-agents`.
> **Install:** `npm install @daydreamsai/core @ai-sdk/openai zod` then `npx create-daydreams-agent my-agent`

## ⚠ This framework is in maintenance

The Daydreams README opens with:

> *"Notice: This agent framework is no longer the core focus as features are already obsolete. The Daydreams core focus is on Agentic Commerce and not the agent harness. Check out the lucid-agents repo: https://github.com/daydreamsai/lucid-agents. We recommend the Pi agent harness for building agents and incorporating lucid-agents in it."*

**For new builds: use [Lucid Agents](11-frameworks-lucid-agents.md).** This file is for understanding existing Daydreams code, not for new development.

## What it still is (for understanding)

- TypeScript
- Composable contexts (stateful workspaces that compose via `.use()`)
- Two-tier memory: Working Memory (temp exec state) + Context Memory (persistent per-context)
- LLM provider: Vercel AI SDK (`@ai-sdk/openai`, `@ai-sdk/anthropic`)
- Dreams Router: `router.daydreams.systems` — x402 pay-per-use USDC
- MCP: `createMcpExtension(...)`
- Scaffold: `npx create-daydreams-agent my-agent`

## Hello-world (Daydreams legacy)

```typescript
import { createDreams, context, action } from "@daydreamsai/core";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const weatherContext = context({
  type: "weather",
  create: () => ({ lastQuery: null }),
}).setActions([
  action({
    name: "getWeather",
    schema: z.object({ city: z.string() }),
    handler: async ({ city }, ctx) => {
      ctx.memory.lastQuery = city;
      return { weather: `Sunny in ${city}` };
    },
  }),
]);

const agent = createDreams({ model: openai("gpt-4o"), contexts: [weatherContext] });
await agent.send({ context: weatherContext, input: "Weather in NYC?" });
```

## Migration path: Daydreams → Lucid Agents

If you have existing Daydreams code:

1. **Audit your contexts** — they map 1:1 to Lucid Agents flows
2. **Migrate x402 flows** — Daydreams uses the Dreams Router (`router.daydreams.systems`); Lucid Agents uses `@lucid-agents/payments` directly
3. **Migrate actions** — Daydreams actions map to Lucid Agents tools
4. **Migrate MCP** — same `createMcpExtension` pattern in both
5. **Migrate memory** — Daydreams has working+context; Lucid Agents has identity (ERC-8004) + memory

## Pi agent harness (mentioned in Daydreams README)

The Daydreams README recommends Pi for the agent harness:
- **Canonical repo:** https://github.com/earendil-works/pi (was `badlogic/pi-mono`, redirects to `earendil-works/pi`)
- **Description:** "AI agent toolkit: coding agent CLI, unified LLM API, TUI & web UI libraries, Slack bot, vLLM pods"

If you're starting fresh and want the Pi + Lucid Agents stack:
- **Pi** for the agent runtime (multi-provider, CLI, TUI, web UI)
- **Lucid Agents** for the agentic commerce / x402 layer

## When to use this skill's Daydreams section

- Maintaining existing Daydreams code
- Migrating Daydreams → Lucid Agents
- Understanding a Daydreams example you found online

## When NOT to use it

- New agent builds → use [Lucid Agents](11-frameworks-lucid-agents.md) instead

## See also

- `11-frameworks-lucid-agents.md` — the current framework
- `00-decision-tree.md` — when to pick each framework
- https://github.com/daydreamsai/lucid-agents — the migration target
- https://github.com/earendil-works/pi — the recommended agent harness
