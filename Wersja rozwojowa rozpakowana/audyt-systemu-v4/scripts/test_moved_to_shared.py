#!/usr/bin/env python3
"""
test_moved_to_shared.py — Test regresyjny T9: weryfikacja przeniesień do shared/.

ŹRÓDŁO BŁĘDU (regresja, którą ten test chroni przed powrotem):
  Przy przeglądzie T1 na żądanie użytkownika ("zbadaj działanie T1,
  czy jeszcze jakieś testy są wymagane"), zbudowano PRÓBNY, SZEROKI
  skaner odwołań "mod-XXX" w całym systemie, w poszukiwaniu
  DANGLING REFERENCES (odwołań do plików, które NIE ISTNIEJĄ). Wynik
  ujawnił, że WIĘKSZOŚĆ takich "podejrzanych" odwołań to w
  rzeczywistości LEGALNE wzorce: (a) cross-referencje międzyskillowe
  z jawnym prefiksem "dr-XX →", (b) odwołania do plików w shared/
  (inna struktura katalogów), (c) świadome placeholdery "rozważ w
  przyszłości", (d) notatki historyczne o PRZENIESIENIU pliku do
  shared/ pod NOWĄ nazwą. TEN test celuje WYŁĄCZNIE w kategorię (d) —
  najbardziej RYZYKOWNĄ, bo odwołuje się do KONKRETNEJ nowej
  lokalizacji, którą MOŻNA automatycznie zweryfikować.

ZASADA TESTU: dla KAŻDEJ linii w SKILL.md pasującej do wzorca
"Przeniesiony do shared/ ... `NAZWA_PLIKU`" (lub podobnego), sprawdź
CZY plik `shared/NAZWA_PLIKU.md` (LUB NAZWA_PLIKU jest wspomniana
GDZIEKOLWIEK w treści KTÓREGOŚ pliku .md w shared/, dla przypadków
zmiany nazwy przy przenosinach) FAKTYCZNIE istnieje.

⚠️ OGRANICZENIE: rozpoznaje TYLKO frazę "przeniesion* do shared" (w
różnych odmianach) w POBLIŻU nazwy pliku w formacie `mod-XXX` lub
podobnym — NIE jest to pełny parser odwołań, WYŁĄCZNIE wąski,
celowany wzorzec o NISKIM ryzyku fałszywych trafień (w odróżnieniu od
próbnego, szerokiego skanera, który dawał zbyt dużo szumu do
praktycznego użytku — patrz REGRESSION-TEST-PLAN.md sekcja 10).

Użycie:
    python3 test_moved_to_shared.py [--repo-root /mnt/skills/user] [--quiet]

Kod wyjścia:
    0 — wszystkie odnalezione deklaracje przeniesienia mają
        potwierdzenie istnienia pliku docelowego
    1 — znaleziono co najmniej jedną deklarację przeniesienia BEZ
        odnalezionego pliku docelowego (WYMAGA weryfikacji manualnej)
"""

import argparse
import re
import sys
from pathlib import Path

SKIP_SKILLS = {"shared", "audyt-systemu-v4"}

# Wzorzec: "przeniesion(y/a/e) do shared" w POBLIŻU nazwy pliku mod-XXX
MOVED_PATTERN = re.compile(
    r"przeniesion\w*\s+do\s+shared[/\s]*[^\n]{0,80}?`?(mod-[\w-]+|[A-Z][\w-]+)`?",
    re.IGNORECASE
)


def find_skill_md_files(repo_root: Path):
    result = []
    for skill_dir in sorted(repo_root.iterdir()):
        if not skill_dir.is_dir() or skill_dir.name in SKIP_SKILLS:
            continue
        skill_md = skill_dir / "SKILL.md"
        if skill_md.exists():
            result.append((skill_dir, skill_md))
    return result


def shared_file_exists_by_stem_or_mention(shared_dir: Path, name: str) -> bool:
    """Sprawdza czy plik o dokładnej nazwie istnieje w shared/, LUB czy
    stara nazwa jest wspomniana w treści KTÓREGOŚ pliku shared/ (dla
    przypadków zmiany nazwy przy przenosinach, np. mod-KK-stalking-
    szczegolowy → STALKING-NEKANIE.md, gdzie NOWY plik może zawierać
    odwołanie do STAREJ nazwy jako historyczny kontekst)."""
    direct = shared_dir / f"{name}.md"
    if direct.exists():
        return True
    # Przeszukaj TREŚĆ plików shared/ (płytko, bez podkatalogów) —
    # niska częstotliwość operacji, akceptowalne dla testu okresowego
    for f in shared_dir.glob("*.md"):
        try:
            if name in f.read_text(encoding="utf-8", errors="ignore"):
                return True
        except Exception:
            continue
    return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default="/mnt/skills/user")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    repo_root = Path(args.repo_root).resolve()
    shared_dir = repo_root / "shared"
    skill_files = find_skill_md_files(repo_root)

    unresolved = 0
    checked = 0
    report_lines = []

    for skill_dir, skill_md in skill_files:
        try:
            text = skill_md.read_text(encoding="utf-8", errors="strict")
        except Exception as e:
            report_lines.append(f"  BŁĄD ODCZYTU {skill_dir.name}: {e}")
            continue

        for m in MOVED_PATTERN.finditer(text):
            name = m.group(1)
            checked += 1
            if not shared_file_exists_by_stem_or_mention(shared_dir, name):
                unresolved += 1
                report_lines.append(
                    f"  ⚠️ NIEROZWIĄZANE PRZENIESIENIE  {skill_dir.name}: "
                    f"deklaruje przeniesienie \"{name}\" do shared/, ale NIE "
                    f"znaleziono pliku \"{name}.md\" ANI wzmianki o tej nazwie "
                    f"w ŻADNYM pliku shared/ — WYMAGA weryfikacji manualnej "
                    f"(czy plik istnieje pod INNĄ nazwą, czy naprawdę zaginął)"
                )

    if not args.quiet:
        print(f"test_moved_to_shared.py — {len(skill_files)} plików SKILL.md "
              f"przeszukanych, {checked} deklaracji przeniesienia do shared/ znalezionych\n")
        if report_lines:
            print("\n".join(report_lines))
        else:
            print("  Wszystkie zadeklarowane przeniesienia do shared/ mają "
                  "potwierdzone pliki docelowe (lub wzmiankę o nazwie).")
        print()
        if unresolved:
            print(f"WYNIK T9: WARN — {unresolved} nierozwiązanych przeniesień "
                  f"WYMAGA weryfikacji manualnej.")
        else:
            print("WYNIK T9: OK — brak nierozwiązanych przeniesień.")

    sys.exit(1 if unresolved else 0)


if __name__ == "__main__":
    main()
