#!/usr/bin/env bash
# Instaluje run_regression_suite.py (PEŁNY zestaw testów regresyjnych
# T1-T8) jako git pre-commit hook w repozytorium /mnt/skills/user/.
#
# ⚠️ WERSJA 2.0 (2026-07-21) — POPRAWKA znaleziona przy przeglądzie na
# żądanie użytkownika ("czy jeszcze jakieś testy są wymagane, aby mieć
# poziom profesjonalny"): pierwotna wersja instalowała WYŁĄCZNIE
# ci_check_shared.py (T6/T7 — zerwane odwołania/duplikaty), mimo że
# PÓŹNIEJ w tej samej sesji dokończono PEŁNY zestaw testów T1-T8
# (REGRESSION-TEST-PLAN.md) — hook NIGDY nie został zaktualizowany, by
# wywoływać PEŁNY zestaw. To DOKŁADNIE ten sam wzorzec "zbudowano
# narzędzie, zapomniano podłączyć" znajdowany wielokrotnie w tej
# sesji w innych częściach systemu.
#
# Blokuje commit, jeśli zestaw testów zwróci FAIL na testach
# KRYTYCZNYCH (T1/T6/T7) — testy heurystyczne (T3/T8) i informacyjne
# (T2) NIE blokują (ostrzeżenie, nie FAIL), zgodnie z logiką
# run_regression_suite.py.
#
# Użycie: bash install_precommit_hook.sh [/mnt/skills/user]

set -euo pipefail
REPO_ROOT="${1:-/mnt/skills/user}"
HOOK_PATH="$REPO_ROOT/.git/hooks/pre-commit"
SCRIPT_PATH="$REPO_ROOT/audyt-systemu-v4/scripts/run_regression_suite.py"

if [ ! -d "$REPO_ROOT/.git" ]; then
  echo "BŁĄD: $REPO_ROOT nie jest repozytorium git (brak .git/). Uruchom najpierw git init." >&2
  exit 1
fi

cat > "$HOOK_PATH" <<HOOK
#!/usr/bin/env bash
# Auto-wygenerowane przez install_precommit_hook.sh (v2.0) — nie edytuj ręcznie.
echo "run_regression_suite.py — pełny zestaw testów T1-T8 przed commitem..."
python3 "$SCRIPT_PATH" --repo-root "$REPO_ROOT"
STATUS=\$?
if [ \$STATUS -ne 0 ]; then
  echo ""
  echo "COMMIT ZABLOKOWANY: co najmniej jeden test KRYTYCZNY (T1/T6/T7) nie przeszedł."
  echo "Napraw błędy powyżej albo użyj git commit --no-verify"
  echo "(--no-verify pomija hook — używaj świadomie, tylko gdy błąd jest fałszywym alarmem)."
fi
exit \$STATUS
HOOK

chmod +x "$HOOK_PATH"
echo "Zainstalowano: $HOOK_PATH (v2.0 — pełny zestaw T1-T8, nie tylko T6/T7)"
echo "Test:"
"$HOOK_PATH" || true
