#!/usr/bin/env python3
"""
test_header_snapshot.py — Test regresyjny T4: integralność nagłówków Markdown.

ŹRÓDŁO BŁĘDU (regresja, którą ten test chroni przed powrotem):
  W tej sesji, CO NAJMNIEJ DWUKROTNIE, edycja przez str_replace
  PRZYPADKOWO usunęła sąsiedni nagłówek "## ŁĄCZ Z" przy wstawianiu
  nowej treści TUŻ PRZED nim (np. mod-wypadek-przy-pracy-choroba-
  zawodowa.md, sesja dot. PIP/Straży Granicznej) — błąd ZŁAPANY
  DOPIERO przy rutynowej weryfikacji `grep "^## "` PO edycji, nie
  automatycznie.

ZASADA TESTU: ten skrypt NIE wykrywa błędu SAM — wymaga PARY migawek
(przed edycją / po edycji) tego samego pliku, dostarczonych przez
wywołującego (LLM/audytora). Prowadzi PROTOKÓŁ: policz `^## ` PRZED
str_replace, policz PONOWNIE PO — jeśli liczba PO < liczba PRZED (dla
edycji, która MIAŁA TYLKO DODAĆ treść, nie usuwać sekcji) — FLAGA.

Ponieważ ten skrypt działa NA ŻĄDANIE (nie ma dostępu do "stanu przed"
bez jawnego zapisania go najpierw), oferuje DWA tryby:
  1) --snapshot <plik>   → zapisuje bieżącą liczbę nagłówków `^## ` do
                           pliku .header_snapshot obok, jako punkt
                           odniesienia PRZED edycją
  2) --verify <plik>     → porównuje BIEŻĄCĄ liczbę nagłówków z
                           zapisaną migawką; FAIL jeśli mniejsza

Użycie (workflow LLM przy każdej edycji str_replace na pliku .md):
    python3 test_header_snapshot.py --snapshot ścieżka/do/pliku.md
    # ... (LLM wykonuje str_replace) ...
    python3 test_header_snapshot.py --verify ścieżka/do/pliku.md

Kod wyjścia:
    0 — liczba nagłówków >= migawka (OK, ewentualnie dodano sekcje)
    1 — liczba nagłówków < migawka (REGRESJA — utracono nagłówek)
    2 — błąd użycia (brak migawki przy --verify, itp.)
"""

import argparse
import re
import sys
from pathlib import Path

HEADER_PATTERN = re.compile(r"^## ", re.MULTILINE)


def count_headers(path: Path) -> int:
    text = path.read_text(encoding="utf-8", errors="strict")
    return len(HEADER_PATTERN.findall(text))


def snapshot_path_for(md_path: Path) -> Path:
    return md_path.with_suffix(md_path.suffix + ".header_snapshot")


def main():
    ap = argparse.ArgumentParser()
    group = ap.add_mutually_exclusive_group(required=True)
    group.add_argument("--snapshot", metavar="PLIK.md",
                        help="Zapisz bieżącą liczbę nagłówków jako punkt odniesienia")
    group.add_argument("--verify", metavar="PLIK.md",
                        help="Porównaj bieżącą liczbę nagłówków z zapisaną migawką")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    if args.snapshot:
        md_path = Path(args.snapshot)
        if not md_path.exists():
            print(f"BŁĄD: plik {md_path} nie istnieje.")
            sys.exit(2)
        count = count_headers(md_path)
        snap_path = snapshot_path_for(md_path)
        snap_path.write_text(str(count), encoding="utf-8")
        if not args.quiet:
            print(f"MIGAWKA zapisana: {md_path.name} — {count} nagłówków '## ' "
                  f"(punkt odniesienia PRZED edycją)")
        sys.exit(0)

    if args.verify:
        md_path = Path(args.verify)
        if not md_path.exists():
            print(f"BŁĄD: plik {md_path} nie istnieje.")
            sys.exit(2)
        snap_path = snapshot_path_for(md_path)
        if not snap_path.exists():
            print(f"BŁĄD: brak migawki dla {md_path.name} — uruchom najpierw --snapshot "
                  f"PRZED edycją.")
            sys.exit(2)
        before = int(snap_path.read_text(encoding="utf-8").strip())
        after = count_headers(md_path)
        if not args.quiet:
            print(f"WERYFIKACJA: {md_path.name} — PRZED: {before} nagłówków, "
                  f"PO: {after} nagłówków")
        if after < before:
            print(f"WYNIK T4: FAIL — UTRACONO {before - after} nagłówek(-ów) "
                  f"'## ' podczas edycji! Sprawdź, czy str_replace przypadkowo "
                  f"nie usunął sąsiedniej sekcji.")
            sys.exit(1)
        else:
            if not args.quiet:
                print("WYNIK T4: OK — brak utraty nagłówków (liczba nie zmalała).")
            snap_path.unlink(missing_ok=True)  # migawka zużyta, sprzątamy
            sys.exit(0)


if __name__ == "__main__":
    main()
