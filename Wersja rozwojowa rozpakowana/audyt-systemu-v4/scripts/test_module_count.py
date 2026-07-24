#!/usr/bin/env python3
"""
test_module_count.py — Test regresyjny T2: zgodność licznika modułów.

ŹRÓDŁO BŁĘDU (regresja, którą ten test chroni przed powrotem):
  Audyt 2026-07-21o (AUDIT-JOURNAL.md) — DR-03/SKILL.md deklarował
  nagłówkiem "## Moduły (37 łącznie — ...)", podczas gdy fizycznie na
  dysku było 52 plików w modules/*.md. Licznik w nagłówku NIE był
  aktualizowany przy dodawaniu modułów w poprzednich sesjach.

ZASADA TESTU: dla KAŻDEGO skilla ze strukturą `modules/*.md`, JEŻELI
SKILL.md zawiera linię pasującą do wzorca "(<liczba> łącznie" —
wyekstrahowana liczba MUSI się zgadzać z rzeczywistą liczbą plików
*.md w modules/ (z tolerancją na jawnie odnotowane wyjątki, np.
"1 przeniesiony do shared/" — TAKIE adnotacje SĄ rozpoznawane i
ODEJMOWANE od liczby fizycznej przed porównaniem).

Test jest DETERMINISTYCZNY — wyłącznie analiza plików na dysku.

Użycie:
    python3 test_module_count.py [--repo-root /mnt/skills/user] [--quiet]

Kod wyjścia:
    0 — wszystkie liczniki zgodne (lub brak deklarowanego licznika)
    1 — znaleziono co najmniej jedną rozbieżność
"""

import argparse
import re
import sys
from pathlib import Path

SKIP_SKILLS = {"shared", "audyt-systemu-v4"}

# Wzorzec liczący linię typu: "## Moduły (52 łącznie — ..." lub
# "## Moduły (21 łącznie — ✓ 21 OK, ..."
COUNT_PATTERN = re.compile(r"\(\s*(\d+)\s*łącznie", re.IGNORECASE)

# ⚠️ POPRAWKA 2026-07-21 (znaleziona przy PIERWSZYM uruchomieniu tego
# testu): notatki typu "1 przeniesiony do shared/" w nagłówku SĄ
# OPISOWE/HISTORYCZNE — liczba "łącznie" JUŻ je uwzględnia (to znaczy:
# fizyczna liczba plików W TYM skillu == zadeklarowana liczba, notatka
# tylko WYJAŚNIA, że gdzieś w przeszłości jeden moduł STĄD trafił do
# shared/, nie że należy go DALEJ odejmować od bieżącej liczby). Usunięto
# automatyczne odejmowanie — WCZEŚNIEJSZA wersja dawała FAŁSZYWE
# POZYTYWY dla DR-03 i DR-16, gdzie declared==actual_physical, ale
# notatka była błędnie interpretowana jako dodatkowy wyjątek.


def find_skills_with_modules(repo_root: Path):
    result = []
    for skill_dir in sorted(repo_root.iterdir()):
        if not skill_dir.is_dir() or skill_dir.name in SKIP_SKILLS:
            continue
        modules_dir = skill_dir / "modules"
        skill_md = skill_dir / "SKILL.md"
        if modules_dir.is_dir() and skill_md.exists():
            result.append((skill_dir, modules_dir, skill_md))
    return result


def check_count(skill_dir: Path, modules_dir: Path, skill_md: Path):
    """Zwraca (deklarowana, rzeczywista, wyjątki) lub None jeśli brak deklaracji."""
    try:
        text = skill_md.read_text(encoding="utf-8", errors="strict")
    except Exception as e:
        return None, f"BŁĄD ODCZYTU SKILL.md: {e}"

    m = COUNT_PATTERN.search(text)
    if not m:
        return None, None  # brak deklaracji licznika — test nie dotyczy tego skilla

    declared = int(m.group(1))
    actual_physical = len(list(modules_dir.glob("*.md")))

    return (declared, actual_physical), None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default="/mnt/skills/user")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    repo_root = Path(args.repo_root).resolve()
    skills = find_skills_with_modules(repo_root)

    mismatches = 0
    checked = 0
    report_lines = []

    for skill_dir, modules_dir, skill_md in skills:
        result, err = check_count(skill_dir, modules_dir, skill_md)
        if err:
            report_lines.append(f"  BŁĄD  {skill_dir.name}: {err}")
            mismatches += 1
            continue
        if result is None:
            continue  # brak deklaracji licznika w tym SKILL.md
        declared, actual_physical = result
        checked += 1
        if declared != actual_physical:
            mismatches += 1
            report_lines.append(
                f"  BŁĄD  {skill_dir.name}: SKILL.md deklaruje {declared} modułów, "
                f"fizycznie na dysku {actual_physical} plików "
                f"— ROZBIEŻNOŚĆ {abs(declared - actual_physical)}"
            )

    if not args.quiet:
        print(f"test_module_count.py — {len(skills)} skilli sprawdzonych, "
              f"{checked} miało deklarowany licznik\n")
        if report_lines:
            print("\n".join(report_lines))
        else:
            print("  Wszystkie deklarowane liczniki zgodne z rzeczywistością.")
        print()
        if mismatches:
            print(f"WYNIK T2: FAIL — {mismatches} rozbieżności licznika modułów.")
        else:
            print("WYNIK T2: OK — brak rozbieżności liczników.")

    sys.exit(1 if mismatches else 0)


if __name__ == "__main__":
    main()
