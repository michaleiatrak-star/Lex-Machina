#!/usr/bin/env bash
# dostarcz_skill.sh — deterministyczne wymuszenie ZASADY 7 (OUTPUT-COMPLETENESS).
#
# Zastępuje PROZĘ zasady (którą można pominąć mimo jej obecności w SKILL.md —
# patrz incydenty AUDYT-2026-07-10b oraz AUDYT-2026-07-13e) MECHANIZMEM: skrypt
# odmawia wygenerowania archiwum, jeśli liczba plików się nie zgadza, zamiast
# polegać na tym, że ktoś/coś "pamięta" o sprawdzeniu.
#
# Zasada projektowa: present_files wolno wywoływać WYŁĄCZNIE na pliku, który
# ten skrypt wypisał na końcu jako "GOTOWE DO present_files:". Jeśli skrypt
# zwrócił kod wyjścia != 0, present_files się nie wywołuje — koniec dyskusji,
# bez wyjątków improwizowanych w danej chwili.
#
# Użycie (jeden skill):
#   bash dostarcz_skill.sh mcp-zrodla-prawa-v1
#
# Użycie (wiele skilli, każdy dostaje WŁASNY zip — zgodnie z <skill>.zip,
# liczba pojedyncza, nie jeden zbiorczy archiwum):
#   bash dostarcz_skill.sh mcp-zrodla-prawa-v1 audit-trail-portal-v1 shared
#
# Repo root i katalog wyjściowy można nadpisać zmiennymi środowiskowymi:
#   REPO_ROOT=/mnt/skills/user OUT_DIR=/mnt/user-data/outputs bash dostarcz_skill.sh <skill>

set -uo pipefail

REPO_ROOT="${REPO_ROOT:-/mnt/skills/user}"
OUT_DIR="${OUT_DIR:-/mnt/user-data/outputs}"
WORK_DIR="${WORK_DIR:-/home/claude/dostawa_$$}"

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

  # KROK 1 — policz pliki oryginału PRZED kopiowaniem
  PRZED=$(find "$SRC" -type f -not -path "*/__pycache__/*" | wc -l)

  # KROK 2 — skopiuj CAŁE drzewo (nie pojedynczy plik) do katalogu roboczego
  DEST="$WORK_DIR/$SKILL"
  rm -rf "$DEST"
  cp -r "$SRC" "$DEST"
  find "$DEST" -name "__pycache__" -exec rm -rf {} + 2>/dev/null

  # KROK 4 — policz pliki w kopii PO skopiowaniu (edycje, jeśli są, dzieją się
  # na kopii PRZED tym krokiem w normalnym workflow — tu weryfikujemy stan
  # finalny gotowy do spakowania)
  PO=$(find "$DEST" -type f | wc -l)

  echo "== $SKILL =="
  echo "   KROK 1 (oryginał na dysku): $PRZED plików"
  echo "   KROK 4 (kopia robocza):     $PO plików"

  if [ "$PRZED" != "$PO" ]; then
    echo "   WYNIK: MISMATCH — różnica niewyjaśniona. ODMOWA spakowania $SKILL." >&2
    OGOLNY_STATUS=1
    continue
  fi

  # KROK 5 — spakuj CAŁY katalog (nie pojedyncze pliki) do archiwum <skill>.zip
  ZIP_PATH="$OUT_DIR/${SKILL}.zip"
  rm -f "$ZIP_PATH"
  (cd "$WORK_DIR" && zip -rq "$ZIP_PATH" "$SKILL" -x '*/__pycache__/*')

  # Weryfikacja końcowa: policz realne pliki (nie wpisy katalogów) w samym ZIP-ie
  W_ZIPIE=$(unzip -Z1 "$ZIP_PATH" | grep -v '/$' | wc -l)

  if [ "$W_ZIPIE" != "$PRZED" ]; then
    echo "   WYNIK: MISMATCH w samym archiwum ($W_ZIPIE != $PRZED). ODMOWA wydania $SKILL." >&2
    rm -f "$ZIP_PATH"
    OGOLNY_STATUS=1
    continue
  fi

  echo "   WYNIK: OK — $PRZED = $PO = $W_ZIPIE (dysk = kopia = archiwum)."
  echo "   GOTOWE DO present_files: $ZIP_PATH"
  GOTOWE_PLIKI+=("$ZIP_PATH")
done

echo ""
echo "=== PODSUMOWANIE ==="
if [ "${#GOTOWE_PLIKI[@]}" -gt 0 ]; then
  echo "Archiwa zatwierdzone do present_files (${#GOTOWE_PLIKI[@]}):"
  for f in "${GOTOWE_PLIKI[@]}"; do echo "  - $f"; done
else
  echo "Brak zatwierdzonych archiwów."
fi

if [ "$OGOLNY_STATUS" != 0 ]; then
  echo ""
  echo "UWAGA: co najmniej jeden skill NIE został zatwierdzony (patrz MISMATCH powyżej)."
  echo "present_files WOLNO wywołać wyłącznie na plikach z listy 'zatwierdzone' powyżej,"
  echo "nigdy na pominiętych/niezgodnych."
fi

exit "$OGOLNY_STATUS"
