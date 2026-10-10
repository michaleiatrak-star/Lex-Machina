#!/usr/bin/env bash
# Instaluje run_regression_suite.py (PEŁNY zestaw testów regresyjnych
# T1-T8) jako git pre-commit hook w repozytorium korpusu skilli.
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
# Użycie: bash install_precommit_hook.sh [--force] [--test] SKILLS_ROOT
#         (albo bez argumentu przy ustawionym LEX_MACHINA_SKILLS_ROOT)
#
# 2026-10-10: korzeń obowiązkowy (bez fallbacku na bieżący katalog), kontrola,
# że cel jest repozytorium skilli Lex Machina, istniejący hook nie jest
# nadpisywany bez --force (wtedy kopia pre-commit.bak.<znacznik czasu>),
# hook nie jest uruchamiany automatycznie (tylko z --test).

set -euo pipefail
FORCE=0
RUN_TEST=0
REPO_ARG=""
for arg in "$@"; do
  case "$arg" in
    --force) FORCE=1 ;;
    --test) RUN_TEST=1 ;;
    -h|--help) sed -n '2,30p' "$0"; exit 0 ;;
    -*) echo "BŁĄD: nieznana opcja $arg" >&2; exit 2 ;;
    *)
      if [ -n "$REPO_ARG" ]; then echo "BŁĄD: podano więcej niż jedną ścieżkę" >&2; exit 2; fi
      REPO_ARG="$arg" ;;
  esac
done

REPO_ROOT="${REPO_ARG:-${LEX_MACHINA_SKILLS_ROOT:-}}"
if [ -z "$REPO_ROOT" ]; then
  echo "BŁĄD: podaj ścieżkę repozytorium skilli jako argument albo ustaw LEX_MACHINA_SKILLS_ROOT." >&2
  echo "      (bieżący katalog nie jest przyjmowany domyślnie)" >&2
  exit 2
fi
if [ ! -d "$REPO_ROOT" ]; then
  echo "BŁĄD: $REPO_ROOT nie istnieje albo nie jest katalogiem." >&2
  exit 2
fi
REPO_ROOT="$(cd "$REPO_ROOT" && pwd -P)"
SCRIPT_PATH="$REPO_ROOT/audyt-systemu-v4/scripts/run_regression_suite.py"
if [ ! -f "$SCRIPT_PATH" ]; then
  echo "BŁĄD: $REPO_ROOT nie jest korzeniem korpusu skilli Lex Machina" >&2
  echo "      (brak audyt-systemu-v4/scripts/run_regression_suite.py)." >&2
  exit 2
fi

# Katalog hooków repozytorium git zawierającego korpus (obsługuje także
# korpus w podkatalogu repozytorium i worktree).
if ! HOOKS_DIR="$(git -C "$REPO_ROOT" rev-parse --path-format=absolute --git-path hooks 2>/dev/null)"; then
  echo "BŁĄD: $REPO_ROOT nie leży w repozytorium git." >&2
  exit 1
fi
mkdir -p "$HOOKS_DIR"
HOOK_PATH="$HOOKS_DIR/pre-commit"

if [ -e "$HOOK_PATH" ] || [ -L "$HOOK_PATH" ]; then
  if [ "$FORCE" -ne 1 ]; then
    echo "ODMOWA: $HOOK_PATH już istnieje. Nie nadpisuję istniejącego hooka." >&2
    echo "        Użyj --force (zostanie zachowana kopia pre-commit.bak.<znacznik czasu>)." >&2
    exit 3
  fi
  BACKUP="$HOOK_PATH.bak.$(date +%Y%m%d-%H%M%S)"
  N=1
  while [ -e "$BACKUP" ] || [ -L "$BACKUP" ]; do BACKUP="$HOOK_PATH.bak.$(date +%Y%m%d-%H%M%S).$N"; N=$((N+1)); done
  mv "$HOOK_PATH" "$BACKUP"
  echo "Kopia istniejącego hooka: $BACKUP"
fi

Q_SCRIPT="$(printf '%q' "$SCRIPT_PATH")"
Q_ROOT="$(printf '%q' "$REPO_ROOT")"
cat > "$HOOK_PATH" <<HOOK
#!/usr/bin/env bash
# Auto-wygenerowane przez install_precommit_hook.sh (v2.1) — nie edytuj ręcznie.
echo "run_regression_suite.py — pełny zestaw testów T1-T8 przed commitem..."
python3 $Q_SCRIPT --repo-root $Q_ROOT
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
echo "Zainstalowano: $HOOK_PATH (v2.1 — pełny zestaw testów regresyjnych)"
if [ "$RUN_TEST" -eq 1 ]; then
  echo "Test (--test):"
  "$HOOK_PATH" || true
else
  echo "Hook nie został uruchomiony (użyj --test, aby uruchomić go od razu)."
fi
