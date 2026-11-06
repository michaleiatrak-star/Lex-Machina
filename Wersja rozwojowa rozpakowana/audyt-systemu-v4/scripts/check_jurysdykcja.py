#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
T50 — check_jurysdykcja.py
Klucze jurysdykcji `JUR:` (shared/UNIVERSAL-RUNTIME-ADAPTER.md §1B) i równoważność migracji.

CO SPRAWDZA
  A. manifest prawo-polskie-v2/JURYSDYKCJA.md: każdy klucz wskazuje istniejący moduł;
  B. każdy `JUR:<klucz>` użyty w skillach ma wiersz w manifeście;
  C. równoważność: każdy wiersz przeniesiony ze skilla wykonawczego
     (references/migracja-jurysdykcji/*.tsv) ma w module klucza linię z tym przepisem
     i tym terminem — przeniesienie niczego nie zgubiło.

Użycie: check_jurysdykcja.py [katalog_skilli]   (domyślnie: Wersja rozwojowa rozpakowana)
"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve()
ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE.parents[2]
MANIFEST = ROOT / "prawo-polskie-v2" / "JURYSDYKCJA.md"
MIGRATIONS = HERE.parents[1] / "references" / "migracja-jurysdykcji"
KEY = re.compile(r"JUR:[a-z0-9-]+")


def manifest():
    keys = {}
    for line in MANIFEST.read_text(encoding="utf-8").splitlines():
        match = re.match(r"\|\s*`(JUR:[a-z0-9-]+)`\s*\|\s*`([^`]+)`\s*\|", line)
        if match:
            keys[match.group(1)] = match.group(2)
    return keys


def main():
    errors = []
    keys = manifest()
    if not keys:
        errors.append("A: manifest bez kluczy")
    for key, module in keys.items():
        if not (ROOT / module).is_file():
            errors.append(f"A: {key} → {module}: brak modułu")
    used = {}
    for path in ROOT.rglob("*.md"):
        if "audyt-systemu-v4" in path.parts or path == MANIFEST or "CHANGELOG" in path.name:
            continue
        for key in KEY.findall(path.read_text(encoding="utf-8")):
            used.setdefault(key, path.relative_to(ROOT).as_posix())
    for key, where in sorted(used.items()):
        if key not in keys:
            errors.append(f"B: {key} (np. {where}) bez wiersza w manifeście")
    checked = 0
    for table in sorted(MIGRATIONS.glob("*.tsv")):
        for row in table.read_text(encoding="utf-8").splitlines():
            if not row.strip() or row.startswith("#"):
                continue
            key, provision, term, label = row.split("\t")
            module = keys.get(key)
            if not module:
                errors.append(f"C: {table.name}: {key} bez modułu")
                continue
            lines = (ROOT / module).read_text(encoding="utf-8").splitlines()
            if not any(re.search(provision, line) and re.search(term, line, re.I) for line in lines):
                errors.append(f"C: {table.name}: {label} ({provision} / {term}) — brak w {module}")
            checked += 1
    print(f"T50: klucze {len(keys)}, użyte {len(used)}, wiersze migracji sprawdzone {checked}")
    for error in errors:
        print("  ✗ " + error)
    print("WYNIK T50: " + ("FAIL" if errors else "PASS"))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
