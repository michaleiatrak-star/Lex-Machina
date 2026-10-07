#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""T41 — check_limit_plikow.py: liczba plików każdego skilla < 200 (AUDYT-2026-09-29c).

Reguła użytkownika: skill nie może mieć 200 plików lub więcej. Liczone jak przy pakowaniu
(ZASADA 7): wszystkie pliki, z plikami ukrytymi (.claude-plugin), bez `__pycache__` i `node_modules`.
FAIL ≥ 200 (BLOKER); WARN ≥ 190 (zapas na jedno wydanie). Przed redukcją sprawdź, czy nadmiar nie
jest RELIKTEM: plik usunięty w poprzednim wydaniu, wskrzeszony przez instalację „na nakładkę”
(przypadki 6.146 i 6.149 → AUDYT-2026-09-29, -29c). Scalanie plików tylko bez utraty treści.
Kod: 0 PASS/WARN, 1 FAIL.
"""
import argparse, sys
from pathlib import Path

LIMIT, OSTRZ = 200, 190
POMIN = {"__pycache__", "node_modules", ".git"}


def policz(skill: Path) -> int:
    return sum(1 for p in skill.rglob("*") if p.is_file() and not (set(p.relative_to(skill).parts) & POMIN))


def main() -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("--repo-root"); ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if a.selftest:
        import tempfile
        with tempfile.TemporaryDirectory() as t:
            s = Path(t) / "x"; (s / "__pycache__").mkdir(parents=True)
            for i in range(3):
                (s / f"{i}.md").write_text("x")
            (s / "__pycache__" / "a.pyc").write_text("x")
            ok = policz(s) == 3
        print(f"SELFTEST: {'OK' if ok else 'FAIL'} (pomija __pycache__)"); return 0 if ok else 1
    root = Path(a.repo_root or Path(__file__).resolve().parents[2])
    fail = False
    for sk in sorted(p for p in root.iterdir() if (p / "SKILL.md").is_file()):
        n = policz(sk)
        if n >= LIMIT:
            print(f"⛔ {sk.name}: {n} plików (limit < {LIMIT})"); fail = True
        elif n >= OSTRZ:
            print(f"⚠️ {sk.name}: {n} plików — zapas {LIMIT - 1 - n}")
    print(f"T41 → WYNIK: {'FAIL' if fail else 'PASS'}")
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
