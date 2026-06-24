#!/usr/bin/env bash
#
# Solana Agent Frameworks Skill — installer
# Installs the solana-agent-frameworks skill into your agent's skills directory.
#
set -euo pipefail

# ─── Colors ──────────────────────────────────────────────────────────────────
BOLD="\033[1m"; GREEN="\033[32m"; CYAN="\033[36m"; YELLOW="\033[33m"; RED="\033[31m"; RESET="\033[0m"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_NAME="solana-agent-frameworks"

# Defaults
DEST_BASE="${HOME}/.claude"
ASSUME_YES=0

usage() {
  cat <<EOF
${BOLD}Solana Agent Frameworks Skill installer${RESET}

Usage: ./install.sh [options]

Options:
  -y, --yes          Non-interactive; accept all defaults
  -p, --project      Install into ./.claude (project-local) instead of ~/.claude
      --target PATH  Install to a custom path (e.g. ./.cursor/skills)
  -h, --help         Show this help

Default install location: ${DEST_BASE}/skills/${SKILL_NAME}
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -y|--yes) ASSUME_YES=1; shift ;;
    -p|--project) DEST_BASE="$(pwd)/.claude"; shift ;;
    --target) DEST_BASE="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo -e "${RED}Unknown option: $1${RESET}"; usage; exit 1 ;;
  esac
done

# ─── Banner ──────────────────────────────────────────────────────────────────
echo -e "${CYAN}${BOLD}"
echo "  ┌─────────────────────────────────────────────────┐"
echo "  │  Solana Agent Frameworks Skill                   │"
echo "  │  pick + ship AI agents on Solana                 │"
echo "  └─────────────────────────────────────────────────┘"
echo -e "${RESET}"
echo -e "  Install target: ${BOLD}${DEST_BASE}/skills/${SKILL_NAME}${RESET}"
echo ""

if [[ "${ASSUME_YES}" -ne 1 ]]; then
  read -r -p "Proceed with installation? [Y/n] " reply
  case "${reply}" in [nN]*) echo "Aborted."; exit 0 ;; esac
fi

SKILLS_DIR="${DEST_BASE}/skills"
DEST="${SKILLS_DIR}/${SKILL_NAME}"
mkdir -p "${SKILLS_DIR}"

# ─── 1. Install the skill ────────────────────────────────────────────────────
echo -e "${CYAN}→${RESET} installing solana-agent-frameworks skill..."
rm -rf "${DEST}"
mkdir -p "${DEST}"
cp -R "${SCRIPT_DIR}/skill"           "${DEST}/skill"
cp -R "${SCRIPT_DIR}/agents"          "${DEST}/agents"
cp -R "${SCRIPT_DIR}/commands"        "${DEST}/commands"
cp -R "${SCRIPT_DIR}/rules"           "${DEST}/rules"
cp -R "${SCRIPT_DIR}/examples"        "${DEST}/examples"
cp -R "${SCRIPT_DIR}/templates"       "${DEST}/templates"
cp -R "${SCRIPT_DIR}/scripts"         "${DEST}/scripts"
cp    "${SCRIPT_DIR}/LICENSE"         "${DEST}/LICENSE"
cp    "${SCRIPT_DIR}/package.json"    "${DEST}/package.json"
echo -e "${GREEN}✓${RESET} skill files copied to ${DEST}"

# ─── 2. Make scripts executable ──────────────────────────────────────────────
chmod +x "${DEST}/scripts/"*.sh 2>/dev/null || true

# ─── 3. Optional: validate the install ───────────────────────────────────────
if command -v bash >/dev/null 2>&1; then
  if [[ -f "${DEST}/scripts/validate-skill.sh" ]]; then
    echo -e "${CYAN}→${RESET} running self-validation..."
    if bash "${DEST}/scripts/validate-skill.sh" >/dev/null 2>&1; then
      echo -e "${GREEN}✓${RESET} self-validation: PASS"
    else
      echo -e "${YELLOW}⚠${RESET}  self-validation: had warnings (non-fatal)"
    fi
  fi
fi

# ─── Done ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}✓ Solana Agent Frameworks skill installed.${RESET}"
echo ""
echo -e "  Entry point: ${BOLD}${DEST}/SKILL.md${RESET}"
echo ""
echo -e "  Try asking Claude Code:"
echo -e "    ${BOLD}\"build me a Solana agent that pays for a paid API using x402\"${RESET}"
echo -e "    ${BOLD}\"compare ElizaOS vs Lucid Agents for my TypeScript agent\"${RESET}"
echo -e "    ${BOLD}\"publish a Blink that swaps 0.1 SOL to USDC\"${RESET}"
echo -e "    ${BOLD}\"set up a Crossmint agent wallet for my ElizaOS agent\"${RESET}"
echo ""
echo -e "  Commands available: ${BOLD}/pick-framework, /scaffold-elizaos-solana,${RESET}"
echo -e "                      ${BOLD}/scaffold-lucid-agents, /scaffold-sak-mcp,${RESET}"
echo -e "                      ${BOLD}/publish-blink, /spin-up-x402-seller${RESET}"
echo ""
