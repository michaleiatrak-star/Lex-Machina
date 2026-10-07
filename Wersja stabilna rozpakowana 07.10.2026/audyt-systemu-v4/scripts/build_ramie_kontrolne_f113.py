#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_ramie_kontrolne_f113.py — NAKŁADKA ZGODNOŚCI dla protokołu F-113.

⚠️ 2026-09-27b (F-167): implementacja przeniesiona do `build_ramie_kontrolne.py`,
a mapa wycięć do `references/REJESTR-BRAMEK-POMIAR.json`. Ten plik pozostaje,
bo `references/PROTOKOL-WYKONAWCZY-F113.md` §1 i §5 podają go dosłownie jako
komendę — usunięcie go unieważniłoby wykonalność tamtego protokołu.

POWÓD NAKŁADKI, NIE DRUGIEJ KOPII
  Skopiowanie logiki wycinania do dwóch skryptów dałoby dwie implementacje
  rozjeżdżające się przy pierwszej zmianie treści bramki — to udokumentowana
  klasa błędu tego systemu (F-115: siedem kopii self-checku, żadna
  zaktualizowana po dodaniu AF-6). Nakładka nie ma własnej logiki.

UŻYCIE — identyczne jak dotąd, domyślnie B1…B5:
  python3 audyt-systemu-v4/scripts/build_ramie_kontrolne_f113.py \\
      --repo-root "$LEX_MACHINA_SKILLS_ROOT" --out /ścieżka/poza/repo/f113-ramie-A

Dla bramek innych niż B1…B5 (CN, REM i kolejne) używaj wprost
`build_ramie_kontrolne.py --bramki CN,REM` — patrz
`references/PLAN-POMIARU-BRAMEK-UNIWERSALNY.md`.

KODY WYJŚCIA: przekazywane bez zmian z `build_ramie_kontrolne.py`.
"""

import os
import subprocess
import sys

UNIWERSALNY = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                           "build_ramie_kontrolne.py")


def main():
    if not os.path.exists(UNIWERSALNY):
        print("⛔ BŁĄD: brak build_ramie_kontrolne.py — nakładka nie ma co wywołać.\n"
              "   Ten plik NIE zawiera własnej logiki wycinania (świadomie — patrz docstring).",
              file=sys.stderr)
        return 2

    argv = sys.argv[1:]
    if "--bramki" not in argv and "--lista" not in argv:
        argv += ["--bramki", "B1,B2,B3,B4,B5"]

    print("ℹ️  build_ramie_kontrolne_f113.py → nakładka na build_ramie_kontrolne.py "
          "(implementacja wspólna, mapa wycięć w REJESTR-BRAMEK-POMIAR.json)")
    return subprocess.run([sys.executable, UNIWERSALNY] + argv).returncode


if __name__ == "__main__":
    raise SystemExit(main())
