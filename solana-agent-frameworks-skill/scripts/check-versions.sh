#!/usr/bin/env bash
#
# Verify the version pins against the live npm registry
# Usage: bash scripts/check-versions.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
VERSION_FILE="${SKILL_ROOT}/skill/90-version-compat.md"

GREEN="\033[32m"; YELLOW="\033[33m"; RED="\033[31m"; RESET="\033[0m"
PASS=0
WARN=0
FAIL=0

ok()      { echo -e "  ${GREEN}✓${RESET} $1"; PASS=$((PASS+1)); }
warn()    { echo -e "  ${YELLOW}⚠${RESET}  $1"; WARN=$((WARN+1)); }
fail()    { echo -e "  ${RED}✗${RESET}  $1"; FAIL=$((FAIL+1)); }

check_npm() {
  local pkg="$1"
  local expected="$2"
  local actual
  actual=$(npm view "${pkg}" version 2>/dev/null || echo "NOT_FOUND")
  if [[ "${actual}" == "NOT_FOUND" ]]; then
    fail "${pkg}: NOT_FOUND on npm"
  elif [[ "${actual}" == "${expected}" ]]; then
    ok "${pkg}@${actual} matches pinned version"
  else
    # Check if the pinned version is at least the same major
    local expected_major
    expected_major=$(echo "${expected}" | cut -d. -f1)
    local actual_major
    actual_major=$(echo "${actual}" | cut -d. -f1)
    if [[ "${actual_major}" -gt "${expected_major}" ]]; then
      warn "${pkg}: pinned=${expected}, latest=${actual} (MAJOR BUMP — review)"
    else
      warn "${pkg}: pinned=${expected}, latest=${actual} (minor/patch bump — OK)"
    fi
  fi
}

# ─── Core packages ──────────────────────────────────────────────────────────
echo "Checking core packages..."
check_npm "@x402/core" "2.16.0"
check_npm "@x402/svm" "2.16.0"
check_npm "@x402/express" "2.16.0"
check_npm "@x402/paywall" "2.16.0"

# ─── ElizaOS plugins ────────────────────────────────────────────────────────
echo "Checking ElizaOS plugins..."
check_npm "@elizaos/plugin-solana" "1.2.6"
check_npm "@elizaos/plugin-x402" "2.0.0-alpha.1"
check_npm "@elizaos/plugin-twitter" "1.2.22"

# ─── Lucid Agents ───────────────────────────────────────────────────────────
echo "Checking Lucid Agents..."
check_npm "@lucid-agents/cli" "2.5.0"
check_npm "@lucid-agents/core" "2.5.0"
check_npm "@lucid-agents/identity" "2.5.0"

# ─── SendAI SAK ──────────────────────────────────────────────────────────────
echo "Checking SAK..."
check_npm "solana-agent-kit" "2.0.9"
check_npm "@solana-agent-kit/plugin-token" "2.0.9"
check_npm "@solana-agent-kit/plugin-defi" "2.0.8"
check_npm "@solana-agent-kit/plugin-misc" "2.0.6"
check_npm "@solana-agent-kit/plugin-blinks" "2.0.5"

# ─── Wallets ─────────────────────────────────────────────────────────────────
echo "Checking wallets..."
check_npm "@crossmint/wallets-sdk" "1.6.0"
check_npm "mcpay" "0.1.17"

# ─── Solana Actions ──────────────────────────────────────────────────────────
echo "Checking Solana Actions..."
check_npm "@solana/actions" "1.6.6"

# ─── Summary ─────────────────────────────────────────────────────────────────
echo ""
echo "────────────────────────────────────────"
echo -e "  ${GREEN}PASS:${RESET}  ${PASS}"
echo -e "  ${YELLOW}WARN:${RESET}  ${WARN}"
echo -e "  ${RED}FAIL:${RESET}  ${FAIL}"
echo "────────────────────────────────────────"

if [[ ${FAIL} -gt 0 ]]; then
  echo -e "${RED}Version check FAILED${RESET}"
  exit 1
fi

if [[ ${WARN} -gt 0 ]]; then
  echo -e "${YELLOW}Versions PASSED with ${WARN} warnings (review 90-version-compat.md)${RESET}"
else
  echo -e "${GREEN}All pinned versions are current${RESET}"
fi
exit 0
