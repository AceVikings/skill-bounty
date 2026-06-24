#!/usr/bin/env bash
#
# Validate the solana-agent-frameworks skill structure
# Usage: bash scripts/validate-skill.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# ─── Colors ──────────────────────────────────────────────────────────────────
GREEN="\033[32m"; YELLOW="\033[33m"; RED="\033[31m"; RESET="\033[0m"

PASS=0
WARN=0
FAIL=0

ok()      { echo -e "  ${GREEN}✓${RESET} $1"; PASS=$((PASS+1)); }
warn()    { echo -e "  ${YELLOW}⚠${RESET}  $1"; WARN=$((WARN+1)); }
fail()    { echo -e "  ${RED}✗${RESET}  $1"; FAIL=$((FAIL+1)); }
section() { echo -e "\n${YELLOW}$1${RESET}"; }

# ─── Top-level files ─────────────────────────────────────────────────────────
section "Top-level files"
# Required at source (standalone repo) AND install location
for f in LICENSE package.json; do
  if [[ -f "${SKILL_ROOT}/${f}" ]]; then ok "${f} exists"; else fail "${f} missing"; fi
done
# Required only at source (standalone repo) — install location doesn't need these
for f in README.md CLAUDE.md install.sh .gitignore; do
  if [[ -f "${SKILL_ROOT}/${f}" ]]; then ok "${f} exists (source)"; else ok "${f} not present (install location — OK)"; fi
done

# ─── skill/ directory ────────────────────────────────────────────────────────
section "skill/ directory"
if [[ -f "${SKILL_ROOT}/skill/SKILL.md" ]]; then ok "SKILL.md exists"; else fail "SKILL.md missing"; fi
SKILL_SIZE=$(wc -l < "${SKILL_ROOT}/skill/SKILL.md")
if [[ ${SKILL_SIZE} -le 500 ]]; then ok "SKILL.md ≤ 500 lines (${SKILL_SIZE})"; else warn "SKILL.md is ${SKILL_SIZE} lines (>500)"; fi
grep -q "^name: solana-agent-frameworks" "${SKILL_ROOT}/skill/SKILL.md" && ok "SKILL.md has frontmatter 'name'" || fail "SKILL.md missing frontmatter 'name'"
grep -q "^license: MIT" "${SKILL_ROOT}/skill/SKILL.md" && ok "SKILL.md has license MIT" || fail "SKILL.md missing license"

for f in 00-decision-tree.md 10-frameworks-elizaos.md 11-frameworks-lucid-agents.md 12-frameworks-swarms.md 13-frameworks-zerepy.md 14-frameworks-sak.md 15-frameworks-daydreams-legacy.md 20-protocols-x402.md 21-protocols-actions-blinks.md 22-protocols-dialect.md 30-wallets-crossmint-mcpay.md 90-version-compat.md 91-honesty-table.md 92-production-users.md 99-errors-faq.md; do
  if [[ -f "${SKILL_ROOT}/skill/${f}" ]]; then ok "skill/${f} exists"; else fail "skill/${f} missing"; fi
done

# ─── agents/ directory ───────────────────────────────────────────────────────
section "agents/ directory"
for f in framework-picker.md elizaos-builder.md lucid-agents-builder.md sak-builder.md x402-seller.md x402-buyer.md blink-author.md; do
  if [[ -f "${SKILL_ROOT}/agents/${f}" ]]; then ok "agents/${f} exists"; else fail "agents/${f} missing"; fi
  grep -q "^name: " "${SKILL_ROOT}/agents/${f}" 2>/dev/null && ok "agents/${f} has frontmatter 'name'" || fail "agents/${f} missing frontmatter"
  grep -q "^description: " "${SKILL_ROOT}/agents/${f}" 2>/dev/null && ok "agents/${f} has frontmatter 'description'" || fail "agents/${f} missing description"
done

# ─── commands/ directory ─────────────────────────────────────────────────────
section "commands/ directory"
for f in pick-framework.md scaffold-elizaos-solana.md scaffold-lucid-agents.md scaffold-sak-mcp.md publish-blink.md spin-up-x402-seller.md; do
  if [[ -f "${SKILL_ROOT}/commands/${f}" ]]; then ok "commands/${f} exists"; else fail "commands/${f} missing"; fi
  grep -q "^name: " "${SKILL_ROOT}/commands/${f}" 2>/dev/null && ok "commands/${f} has frontmatter 'name'" || fail "commands/${f} missing frontmatter"
  grep -q "^description: " "${SKILL_ROOT}/commands/${f}" 2>/dev/null && ok "commands/${f} has frontmatter 'description'" || fail "commands/${f} missing description"
done

# ─── rules/ directory ────────────────────────────────────────────────────────
section "rules/ directory"
for f in x402-base58-case-sensitivity.md use-embed-wallet-not-private-key.md; do
  if [[ -f "${SKILL_ROOT}/rules/${f}" ]]; then ok "rules/${f} exists"; else fail "rules/${f} missing"; fi
done

# ─── examples/ directory ─────────────────────────────────────────────────────
section "examples/ directory"
for d in hello-elizaos-solana hello-lucid-agents-solana hello-sak-mcp-claude hello-x402-blink-on-dialto hello-x402-buyer-with-mcpay; do
  if [[ -d "${SKILL_ROOT}/examples/${d}" ]]; then ok "examples/${d}/ exists"; else warn "examples/${d}/ missing"; fi
done

# ─── templates/ directory ────────────────────────────────────────────────────
section "templates/ directory"
for f in character.elizaos.json agent.lucid-agents.ts action.json.example agent.ts.sak; do
  if [[ -f "${SKILL_ROOT}/templates/${f}" ]]; then ok "templates/${f} exists"; else warn "templates/${f} missing"; fi
done

# ─── scripts/ directory ──────────────────────────────────────────────────────
section "scripts/ directory"
for f in validate-skill.sh check-versions.sh; do
  if [[ -f "${SKILL_ROOT}/scripts/${f}" ]]; then ok "scripts/${f} exists"; else fail "scripts/${f} missing"; fi
  if [[ -x "${SKILL_ROOT}/scripts/${f}" ]]; then ok "scripts/${f} is executable"; else warn "scripts/${f} not executable"; fi
done

# ─── License check ───────────────────────────────────────────────────────────
section "License"
if [[ -f "${SKILL_ROOT}/LICENSE" ]]; then
  if grep -q "MIT License" "${SKILL_ROOT}/LICENSE"; then ok "LICENSE is MIT"; else fail "LICENSE is not MIT"; fi
else
  fail "LICENSE missing"
fi

# ─── Version pin check ───────────────────────────────────────────────────────
section "Version pins"
if [[ -f "${SKILL_ROOT}/skill/90-version-compat.md" ]]; then
  for pkg in "@x402/core" "@x402/svm" "@elizaos/plugin-solana" "@lucid-agents/cli" "solana-agent-kit" "@crossmint/wallets-sdk" "mcpay" "@solana/actions"; do
    if grep -q "${pkg}" "${SKILL_ROOT}/skill/90-version-compat.md"; then
      ok "${pkg} is pinned in 90-version-compat.md"
    else
      warn "${pkg} not pinned in 90-version-compat.md"
    fi
  done
fi

# ─── Summary ─────────────────────────────────────────────────────────────────
echo ""
echo "────────────────────────────────────────"
echo -e "  ${GREEN}PASS:${RESET}  ${PASS}"
echo -e "  ${YELLOW}WARN:${RESET}  ${WARN}"
echo -e "  ${RED}FAIL:${RESET}  ${FAIL}"
echo "────────────────────────────────────────"

if [[ ${FAIL} -gt 0 ]]; then
  echo -e "${RED}Validation FAILED${RESET}"
  exit 1
fi

if [[ ${WARN} -gt 0 ]]; then
  echo -e "${YELLOW}Validation PASSED with warnings${RESET}"
else
  echo -e "${GREEN}Validation PASSED${RESET}"
fi
exit 0
