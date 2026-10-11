#!/usr/bin/env python3
"""check_testy_skilli.py — TEST T48: testy jednostkowe skilli (unittest, offline).

Dodany 2026-10-11 (AUDYT-2026-10-11b, uwaga z zewnętrznego code review): testy `test_*.py`
w skillach (insolvency, prup, cbosa_parser, walidator_cytowan, kontrakt_rachunek i in.) nie były
uruchamiane przez zestaw ani CI — `test_cbosa_parser.py` nie importował się od dodania i nikt
tego nie widział.

Metoda: każdy katalog z `test_*.py` poza `audyt-systemu-v4/scripts` (te woła orkiestrator
pojedynczo) i poza `mcp-servers`/`node_modules` → `python3 -m unittest discover` w tym katalogu.
FAIL, gdy testy nie przechodzą, ALBO gdy katalog z plikami testów nie uruchomił ani jednego
testu (pusty sukces = błąd). Sondy sieciowe pozostają wyłączone (LEX_LIVE nieustawione).
Kod wyjścia: 0 = wszystko zielone, 1 = co najmniej jeden katalog czerwony.
"""
import argparse
import os
import re
import subprocess
import sys
from pathlib import Path

POMIN = ("/node_modules/", "/mcp-servers/", "/__pycache__/", "/.git/")


def katalogi_testow(root: Path):
    out = set()
    for p in root.rglob("test_*.py"):
        s = p.as_posix()
        if any(x in s for x in POMIN):
            continue
        if p.parent == root / "audyt-systemu-v4" / "scripts":
            continue
        out.add(p.parent)
    return sorted(out)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=os.environ.get("LEX_MACHINA_ROOT")
                    or str(Path(__file__).resolve().parents[2]))
    root = Path(ap.parse_args().repo_root).resolve()
    env = {k: v for k, v in os.environ.items() if k != "LEX_LIVE"}
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    katalogi = katalogi_testow(root)
    print("TEST T48 — TESTY JEDNOSTKOWE SKILLI")
    print(f"Katalog: {root} | katalogów z testami: {len(katalogi)}")
    bledy = 0
    for k in katalogi:
        r = subprocess.run([sys.executable, "-m", "unittest", "discover", "-s", str(k), "-p", "test_*.py"],
                           cwd=str(k), capture_output=True, text=True, env=env, timeout=600)
        wynik = (r.stderr or r.stdout).strip().splitlines()
        ostatnia = wynik[-1] if wynik else ""
        ran = re.search(r"Ran (\d+) test", r.stderr or r.stdout)
        n = int(ran.group(1)) if ran else 0
        rel = k.relative_to(root).as_posix()
        if r.returncode != 0 or n == 0:
            bledy += 1
            powod = "0 testów (pusty sukces)" if r.returncode == 0 else ostatnia
            print(f"  ❌ {rel}: {powod}")
            if r.returncode != 0:
                print("\n".join("     " + l for l in wynik[-25:]))
        else:
            print(f"  ✅ {rel}: {n} testów — {ostatnia}")
    if not katalogi:
        print("WYNIK T48: FAIL — nie znaleziono żadnego katalogu z testami (pusty sukces).")
        return 1
    if bledy:
        print(f"WYNIK T48: FAIL — {bledy} katalog(ów) czerwonych.")
        return 1
    print(f"WYNIK T48: PASS — {len(katalogi)} katalogów, wszystkie zielone.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
