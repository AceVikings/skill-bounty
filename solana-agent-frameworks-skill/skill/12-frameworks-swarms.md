# Swarms — Deep Dive (Python, multi-agent, x402)

> **Repo:** https://github.com/kyegomez/swarms
> **Stars:** 6.9k · **Forks:** 956 · **License:** Apache-2.0
> **Install:** `pip3 install -U swarms` OR `uv pip install swarms` OR `poetry add swarms`
> **Latest branch:** `master` (5,097 commits)

## What it is

The most-mature **Python** multi-agent orchestration framework. 60+ pre-built architectures, native x402 quickstart, ships its own `CLAUDE.md` and `llms.txt` for LLM-ingestible docs.

## Architecture (60+ pre-built)

```
SequentialWorkflow        ConcurrentWorkflow       AgentRearrange (einsum)
GraphWorkflow (DAG)       MixtureOfAgents           GroupChat
ForestSwarm               HierarchicalSwarm         HeavySwarm
SwarmRouter               AutoSwarmBuilder          SocialAlgorithms
AOP (Agent Orchestration Protocol — HTTP-served agents)
```

All available as `from swarms import <name>`.

## Agent primitive

```python
from swarms import Agent

agent = Agent(
    agent_name="Researcher",
    agent_description="Research the topic and summarize.",
    system_prompt="...",
    model_name="gpt-4o",       # or claude-, groq-, etc.
    max_loops="auto",          # or int
    interactive=False,
    autosave=True,
    verbose=False,
)
```

## Hello-world (verified)

```python
from swarms import Agent, SequentialWorkflow

researcher = Agent(
    agent_name="Researcher",
    system_prompt="Research the topic and summarize.",
    model_name="gpt-4o",
)
writer = Agent(
    agent_name="Writer",
    system_prompt="Turn the research into a blog post.",
    model_name="gpt-4o",
)
workflow = SequentialWorkflow(agents=[researcher, writer])
print(workflow.run("The history of Solana"))
```

⚠ **Risk flag:** The Swarms README has examples referencing `gpt-5.4`, a model that does not exist as of 2026-06. Use `gpt-4o`, `gpt-4o-mini`, `claude-3-5-sonnet-latest`, or `claude-sonnet-4-5`.

## x402 integration (native)

Per [docs.swarms.world/examples/integrations/x402-payment](https://docs.swarms.world/examples/integrations/x402-payment):

- Dedicated `X402 Quickstart`
- Compatible with `@x402/svm` for Solana
- Use the `AOP` (Agent Orchestration Protocol) to expose agents as paid HTTP services

## MCP integration

- [docs.swarms.world/mcp](https://docs.swarms.world/mcp)
- Compatible with any MCP server (use it to bridge to SAK's `solana-mcp`)

## Solana integration

Swarms doesn't have a first-party Solana plugin. Use one of:
- The Python `solana` SDK + `jupiter-python-sdk` for swap actions
- The `allora-sdk` for AI inference
- Bridge to SendAI SAK via MCP (`solana-mcp`) for the full 60+ action surface
- Use `@x402/svm` (via the Python x402 package) for paid endpoints

## LLM providers

- OpenAI
- Anthropic
- Groq
- All Vercel AI SDK providers
- Local (Ollama, LMStudio)

## AOP — Agent Orchestration Protocol

Expose any agent as an HTTP service with `add_agent(agent, tool_name, ...)`. Combine with `@x402/svm` for a paid agent.

## When to choose Swarms

- **Python is your stack**
- You need **multi-agent orchestration** (60+ architectures)
- You want **native x402 + MCP**
- You want **a permissive license** (Apache-2.0)
- You want **multi-model** (OpenAI + Anthropic + Groq in one workflow)

## When NOT to choose Swarms

- You're **TypeScript only** (use ElizaOS or SAK)
- You need **rich plugin ecosystem** (ElizaOS has 50+)
- You want **agentic commerce first-class** (Lucid Agents does it better in TS)

## Production users

- **swarms.world** — marketplace
- **swarms_corp** — the company
- Various enterprise agent deployments (claimed in README; verify before citing)

## Risk flags

- **`gpt-5.4` in examples** — does not exist; use `gpt-4o` or `claude-sonnet-4-5`
- **First-party Solana plugin absent** — use `solana` PyPI + `jupiter-python-sdk` or bridge via MCP to SAK

## See also

- `00-decision-tree.md` — when to pick Swarms
- `14-frameworks-sak.md` — bridge to SAK via MCP for the 60+ Solana actions
- `20-protocols-x402.md` — x402 in Python
- `12-frameworks-swarms.md` — full reference
