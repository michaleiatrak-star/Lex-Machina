#!/usr/bin/env bash
# Instaluje ci_check_shared.py jako git pre-commit hook w repozytorium
# /mnt/skills/user/. Blokuje commit, jeśli commitowana zmiana wprowadza
# zerwane odwołanie view() — dokładnie ten typ regresji, przed którym
# ostrzega dokumentacja shared/SKILL.md ("każda zmiana pliku kanonicznego
# ma potencjalnie systemowy promień rażenia").
#
# Duplikaty bajtowe NIE blokują commita (to decyzja redakcyjna, nie awaria)
# — są tylko wypisywane jako ostrzeżenie.
#
# Użycie: bash install_precommit_hook.sh [/mnt/skills/user]

set -euo pipefail
REPO_ROOT="${1:-/mnt/skills/user}"
HOOK_PATH="$REPO_ROOT/.git/hooks/pre-commit"
SCRIPT_PATH="$REPO_ROOT/audyt-systemu-v4/scripts/ci_check_shared.py"

if [ ! -d "$REPO_ROOT/.git" ]; then
  echo "BŁĄD: $REPO_ROOT nie jest repozytorium git (brak .git/). Uruchom najpierw git init." >&2
  exit 1
fi

cat > "$HOOK_PATH" <<HOOK
#!/usr/bin/env bash
# Auto-wygenerowane przez install_precommit_hook.sh — nie edytuj ręcznie.
echo "ci_check_shared.py — sprawdzanie spójności silnika przed commitem..."
python3 "$SCRIPT_PATH" --repo-root "$REPO_ROOT"
STATUS=\$?
if [ \$STATUS -ne 0 ]; then
  echo ""
  echo "COMMIT ZABLOKOWANY: napraw zerwane odwołania powyżej albo użyj git commit --no-verify"
  echo "(--no-verify pomija hook — używaj świadomie, tylko gdy błąd jest fałszywym alarmem)."
fi
exit \$STATUS
HOOK

chmod +x "$HOOK_PATH"
echo "Zainstalowano: $HOOK_PATH"
echo "Test:"
"$HOOK_PATH" || true
