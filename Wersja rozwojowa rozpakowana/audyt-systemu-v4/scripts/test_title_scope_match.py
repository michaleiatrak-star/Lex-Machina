#!/usr/bin/env python3
"""
test_title_scope_match.py — Test regresyjny T8: zgodność zakresu tytuł-vs-treść.

ŹRÓDŁO BŁĘDU (regresja, którą ten test chroni przed powrotem):
  Moduł mod-KK-art148-162-przeciwko-zyciu-zdrowiu.md OBIECYWAŁ w NAZWIE
  PLIKU zakres "art. 148-162" KK, ale RZECZYWISTA treść (przed
  uzupełnieniem w tej sesji) zawierała WYŁĄCZNIE drzewa dla art. 148 i
  156-157 — art. 158-162 (bójka, narażenie, nieudzielenie pomocy) były
  NIEOBECNE mimo obietnicy w tytule (audyt 2026-07-21o).

ZASADA TESTU (HEURYSTYKA, wymaga potwierdzenia LLM/człowieka — NIE
rozstrzyga automatycznie): dla plików o nazwie zawierającej wzorzec
"artXXX-YYY" lub "artXXX_YYY" (zakres numeryczny artykułów), sprawdź
CZY treść pliku wspomina OBA krańce zakresu (XXX i YYY) w formie
"art. XXX" / "art.XXX" — jeśli KRANIEC KOŃCOWY (YYY) NIE WYSTĘPUJE
nigdzie w treści, oznacz jako PODEJRZANY (możliwe niedopełnienie
zakresu obiecanego w tytule).

⚠️ TO JEST HEURYSTYKA ze ZNANYMI ograniczeniami:
  - fałszywe pozytywy możliwe, gdy artykuł YYY jest OMÓWIONY pod inną
    postacią zapisu (np. "art. 160-162" zamiast osobnych wzmianek)
  - NIE zastępuje merytorycznej weryfikacji prawniczej
  - wykrywa TYLKO wzorzec "brakujący koniec zakresu", NIE wykrywa
    brakujących artykułów W ŚRODKU zakresu

Użycie:
    python3 test_title_scope_match.py [--repo-root /mnt/skills/user] [--quiet]

Kod wyjścia:
    0 — brak podejrzanych przypadków
    1 — znaleziono co najmniej jeden podejrzany przypadek (WYMAGA
        weryfikacji manualnej, NIE automatycznie traktowany jako FAIL
        blokujący — patrz REGRESSION-TEST-PLAN.md sekcja 3)
"""

import argparse
import re
import sys
from pathlib import Path

SKIP_SKILLS = {"shared", "audyt-systemu-v4"}

# Wzorzec nazwy pliku: "...art148-162..." lub "...art148_162..."
FILENAME_RANGE_PATTERN = re.compile(r"art(\d+)[-_](\d+)", re.IGNORECASE)


def find_module_files(repo_root: Path):
    result = []
    for skill_dir in sorted(repo_root.iterdir()):
        if not skill_dir.is_dir() or skill_dir.name in SKIP_SKILLS:
            continue
        modules_dir = skill_dir / "modules"
        if modules_dir.is_dir():
            for f in sorted(modules_dir.glob("*.md")):
                result.append(f)
    return result


def check_scope(md_path: Path):
    """Zwraca (start, end) jeśli nazwa sugeruje zakres, i czy 'end' jest
    obecny w treści — None jeśli nazwa nie ma wzorca zakresu."""
    m = FILENAME_RANGE_PATTERN.search(md_path.stem)
    if not m:
        return None

    start, end = int(m.group(1)), int(m.group(2))
    try:
        text = md_path.read_text(encoding="utf-8", errors="strict")
    except Exception:
        return None

    # Szukaj "art. END" lub "art.END" lub "artEND" w treści (elastyczne
    # dopasowanie spacji/kropki, zgodnie z konwencją polskich tekstów prawnych)
    end_pattern = re.compile(rf"art\.?\s*{end}\b")
    end_present = bool(end_pattern.search(text))

    return start, end, end_present


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default="/mnt/skills/user")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    repo_root = Path(args.repo_root).resolve()
    files = find_module_files(repo_root)

    suspicious = 0
    checked = 0
    report_lines = []

    for md_path in files:
        result = check_scope(md_path)
        if result is None:
            continue
        start, end, end_present = result
        checked += 1
        if not end_present:
            suspicious += 1
            rel = md_path.relative_to(repo_root)
            report_lines.append(
                f"  ⚠️ PODEJRZANY  {rel}: nazwa sugeruje zakres art. {start}-{end}, "
                f"ale 'art. {end}' NIE WYSTĘPUJE nigdzie w treści — "
                f"MOŻLIWE niedopełnienie zakresu (WYMAGA weryfikacji manualnej)"
            )

    if not args.quiet:
        print(f"test_title_scope_match.py — {len(files)} plików przejrzanych, "
              f"{checked} miało wzorzec zakresu w nazwie\n")
        if report_lines:
            print("\n".join(report_lines))
        else:
            print("  Brak podejrzanych przypadków niedopełnienia zakresu.")
        print()
        if suspicious:
            print(f"WYNIK T8: WARN — {suspicious} przypadków WYMAGA weryfikacji "
                  f"manualnej (heurystyka, nie automatyczny FAIL).")
        else:
            print("WYNIK T8: OK — brak podejrzanych przypadków.")

    # T8 jest heurystyką doradczą — kod wyjścia 1 oznacza "wymaga przeglądu",
    # nie twardy blokujący FAIL (zgodnie z REGRESSION-TEST-PLAN.md sekcja 3)
    sys.exit(1 if suspicious else 0)


if __name__ == "__main__":
    main()
