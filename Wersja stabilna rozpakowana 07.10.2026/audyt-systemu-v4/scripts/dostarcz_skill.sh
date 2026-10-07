#!/usr/bin/env bash
# dostarcz_skill.sh — deterministyczne wymuszenie kompletności wydania skilla.
#
# Zasady:
#  - jeden skill = jeden osobny ZIP,
#  - ZIP zawiera CAŁE drzewo skilla,
#  - liczba plików przed kopiowaniem, po kopiowaniu i w ZIP musi być identyczna,
#  - twardy limit: maksymalnie 200 plików w jednym skillu,
#  - T22 (rejestr frontmatteru = dysk) musi przejść — F-223, od 6.158,
#  - pliki kanału pluginów w korzeniu skilla (.claude-plugin/, .mcp.json) NIE wchodzą
#    do paczki: claude.ai odrzuca skill z manifestem pluginu (od 6.187); zostają
#    w repozytorium dla marketplace.
#
# Użycie:
#   bash dostarcz_skill.sh audyt-systemu-v4
#   bash dostarcz_skill.sh skill-a skill-b   # każdy dostaje WŁASNY ZIP
#
# Root repo i katalog wyjściowy można podać jawnie:
#   REPO_ROOT=/sciezka/do/repo OUT_DIR=/sciezka/wyjscie bash dostarcz_skill.sh <skill>

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUTO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REPO_ROOT="${REPO_ROOT:-${LEX_MACHINA_ROOT:-$AUTO_ROOT}}"
OUT_DIR="${OUT_DIR:-$PWD/outputs}"
WORK_DIR="${WORK_DIR:-${TMPDIR:-/tmp}/lex-machina-dostawa_$$}"
MAX_FILES="${MAX_FILES:-200}"
WARN_FILES="${WARN_FILES:-195}"

if [ "$#" -lt 1 ]; then
  echo "Użycie: $0 <skill1> [<skill2> ...]" >&2
  exit 2
fi

mkdir -p "$WORK_DIR" "$OUT_DIR"
OGOLNY_STATUS=0
GOTOWE_PLIKI=()

for SKILL in "$@"; do
  SRC="$REPO_ROOT/$SKILL"

  if [ ! -d "$SRC" ]; then
    echo "BŁĄD: $SRC nie istnieje — pomijam $SKILL." >&2
    OGOLNY_STATUS=1
    continue
  fi

  PRZED=$(find "$SRC" -type f -not -path "*/__pycache__/*" -not -path "$SRC/.*" | wc -l | tr -d ' ')

  echo "== $SKILL =="
  echo "   KROK 1 (oryginał): $PRZED plików"

  if [ "$PRZED" -gt "$MAX_FILES" ]; then
    echo "   WYNIK: LIMIT PRZEKROCZONY — $PRZED > $MAX_FILES. ODMOWA spakowania." >&2
    OGOLNY_STATUS=1
    continue
  elif [ "$PRZED" -ge "$WARN_FILES" ]; then
    echo "   OSTRZEŻENIE: $PRZED plików — blisko limitu $MAX_FILES."
  fi

  DEST="$WORK_DIR/$SKILL"
  rm -rf "$DEST"
  cp -r "$SRC" "$DEST"
  find "$DEST" -name "__pycache__" -exec rm -rf {} + 2>/dev/null
  find "$DEST" -mindepth 1 -maxdepth 1 -name '.*' -exec rm -rf {} +

  # F-223 (6.158): wydanie z frontmatterem przepisanym przez hosta = ODMOWA.
  # T22 na samej kopii roboczej tego skilla (katalog tymczasowy z jednym skillem).
  T22="$SCRIPT_DIR/check_frontmatter_rejestracja.py"
  if [ -f "$T22" ] && command -v python3 >/dev/null 2>&1; then
    T22_DIR="$WORK_DIR/.t22_$SKILL"; rm -rf "$T22_DIR"; mkdir -p "$T22_DIR"
    ln -s "$DEST" "$T22_DIR/$SKILL"
    if ! PYTHONDONTWRITEBYTECODE=1 python3 "$T22" "$T22_DIR" > "$T22_DIR.log" 2>&1; then
      echo "   WYNIK: T22 FAIL — rejestr frontmatteru ≠ dysk (log: $T22_DIR.log). ODMOWA spakowania $SKILL." >&2
      grep '⛔' "$T22_DIR.log" | head -5 >&2
      rm -rf "$T22_DIR"; OGOLNY_STATUS=1; continue
    fi
    rm -rf "$T22_DIR"
    echo "   T22: PASS (frontmatter = dysk)"
  fi

  PO=$(find "$DEST" -type f | wc -l | tr -d ' ')
  echo "   KROK 2 (kopia):    $PO plików"

  if [ "$PRZED" != "$PO" ]; then
    echo "   WYNIK: MISMATCH — różnica niewyjaśniona. ODMOWA spakowania $SKILL." >&2
    OGOLNY_STATUS=1
    continue
  fi

  ZIP_PATH="$OUT_DIR/${SKILL}.zip"
  rm -f "$ZIP_PATH"
  (cd "$WORK_DIR" && zip -rq "$ZIP_PATH" "$SKILL" -x '*/__pycache__/*')

  W_ZIPIE=$(unzip -Z1 "$ZIP_PATH" | grep -v '/$' | wc -l | tr -d ' ')
  if [ "$W_ZIPIE" != "$PRZED" ]; then
    echo "   WYNIK: MISMATCH w ZIP ($W_ZIPIE != $PRZED). ODMOWA wydania $SKILL." >&2
    rm -f "$ZIP_PATH"
    OGOLNY_STATUS=1
    continue
  fi

  echo "   WYNIK: OK — $PRZED = $PO = $W_ZIPIE (oryginał = kopia = ZIP)."
  echo "   GOTOWE DO DOSTARCZENIA: $ZIP_PATH"
  GOTOWE_PLIKI+=("$ZIP_PATH")
done

echo ""
echo "=== PODSUMOWANIE ==="
if [ "${#GOTOWE_PLIKI[@]}" -gt 0 ]; then
  echo "Archiwa zatwierdzone do dostarczenia (${#GOTOWE_PLIKI[@]}):"
  for f in "${GOTOWE_PLIKI[@]}"; do echo "  - $f"; done
else
  echo "Brak zatwierdzonych archiwów."
fi

if [ "$OGOLNY_STATUS" != 0 ]; then
  echo "UWAGA: co najmniej jeden skill NIE został zatwierdzony."
  echo "Dostarczaj wyłącznie pliki z listy zatwierdzonej powyżej."
fi

exit "$OGOLNY_STATUS"
