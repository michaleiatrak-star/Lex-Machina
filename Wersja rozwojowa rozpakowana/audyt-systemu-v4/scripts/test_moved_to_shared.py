#!/usr/bin/env python3
"""
test_moved_to_shared.py — Test regresyjny T9: weryfikacja przeniesień do shared/.

ŹRÓDŁO BŁĘDU:
  Test historycznie sprawdzał, czy deklarowany CEL przeniesienia do shared/
  faktycznie istnieje. To chroni przed dangling references, ale nie wykrywało
  lustrzanego problemu: po skutecznym przeniesieniu mogła pozostać STARA lokalna
  kopia `modules/mod-*.md`. Taka kopia nadal wchodziła do inwentarza modułów,
  mogła zawierać nieaktualną treść i wymuszała sztuczną rejestrację w lokalnej
  MAPA-AKTOW mimo kanonicznego routingu do shared/.

  Przypadek referencyjny F-138 / DR-16: `mod-KPC-przesluchanie-swiadkow.md`
  pozostał fizycznie po migracji do `shared/PRZESLUCHANIE-SWIADKOW-KPC.md` i
  zawierał starszą treść niż kanoniczna kopia shared. Ręczny cross-check
  `dysk - MAPA-AKTOW` ujawnił kopię; T9 w poprzedniej postaci jej nie zgłaszał.

ZASADA TESTU:
  dla KAŻDEJ deklaracji w SKILL.md pasującej do wzorca
  "przeniesion* do shared ... `NAZWA`":

  1. potwierdź, że cel w shared/ istnieje bezpośrednio LUB stara nazwa jest
     wspomniana w którymś pliku shared/ (obsługa rename przy migracji);
  2. jeżeli `NAZWA` zaczyna się od `mod-`, sprawdź, czy w źródłowym skillu
     NIE pozostał `modules/NAZWA.md`.

  Pozostawiona lokalna kopia jest WARN i daje exit 1 — wymaga decyzji:
  albo usunąć stale duplicate, albo wycofać deklarację pełnego przeniesienia.

⚠️ OGRANICZENIE: test rozpoznaje tylko frazę "przeniesion* do shared" w
pobliżu nazwy pliku. Nie jest pełnym parserem wszystkich cross-referencji.

Użycie:
    python3 test_moved_to_shared.py [--repo-root SKILLS_ROOT] [--quiet]

Kod wyjścia:
    0 — cele przeniesień istnieją i brak lokalnych stale copies;
    1 — nierozwiązany cel lub pozostawiona lokalna kopia.
"""

import argparse
import os
import re
import sys
from pathlib import Path

SKIP_SKILLS = {"shared", "audyt-systemu-v4"}

MOVED_PATTERN = re.compile(
    r"przeniesion\w*\s+do\s+shared[/\s]*[^\n]{0,80}?`?(mod-[\w-]+|[A-Z][\w-]+)`?",
    re.IGNORECASE,
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
    """Cel istnieje bezpośrednio albo stara nazwa występuje w shared/."""
    direct = shared_dir / f"{name}.md"
    if direct.exists():
        return True
    for f in shared_dir.glob("*.md"):
        try:
            if name in f.read_text(encoding="utf-8", errors="ignore"):
                return True
        except Exception:
            continue
    return False


def stale_source_copy(skill_dir: Path, name: str):
    """Zwraca lokalną kopię mod-*.md pozostawioną po deklarowanym move."""
    if not name.lower().startswith("mod-"):
        return None
    candidate = skill_dir / "modules" / f"{name}.md"
    return candidate if candidate.exists() else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--repo-root", default=os.environ.get("LEX_MACHINA_SKILLS_ROOT", ".")
    )
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    repo_root = Path(args.repo_root).resolve()
    shared_dir = repo_root / "shared"
    skill_files = find_skill_md_files(repo_root)

    unresolved = 0
    stale = 0
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
                    f"w ŻADNYM pliku shared/ — WYMAGA weryfikacji manualnej"
                )

            stale_copy = stale_source_copy(skill_dir, name)
            if stale_copy is not None:
                stale += 1
                report_lines.append(
                    f"  ⚠️ STALE SOURCE COPY  {skill_dir.name}: deklaruje "
                    f"przeniesienie \"{name}\" do shared/, ale lokalny plik "
                    f"nadal istnieje: {stale_copy.relative_to(repo_root)} — "
                    f"usuń kopię albo wycofaj deklarację pełnego przeniesienia"
                )

    if not args.quiet:
        print(
            f"test_moved_to_shared.py — {len(skill_files)} plików SKILL.md "
            f"przeszukanych, {checked} deklaracji przeniesienia do shared/ znalezionych\n"
        )
        if report_lines:
            print("\n".join(report_lines))
        else:
            print(
                "  Wszystkie deklarowane cele shared istnieją i nie pozostawiono "
                "lokalnych kopii mod-* po przeniesieniu."
            )
        print()
        if unresolved or stale:
            print(
                f"WYNIK T9: WARN — unresolved={unresolved}, stale_source={stale}."
            )
        else:
            print("WYNIK T9: OK — brak nierozwiązanych przeniesień i stale copies.")

    sys.exit(1 if (unresolved or stale) else 0)


if __name__ == "__main__":
    main()
