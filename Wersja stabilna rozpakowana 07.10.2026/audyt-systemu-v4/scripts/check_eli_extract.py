#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""T36 — check_eli_extract.py: regresja ekstraktora jednostek ELI (F-201).

Uruchamia `shared/tools/test_eli_art_extract.py` w trybie OFFLINE (LEX_LIVE wyzerowane):
pułapka treści obwieszczenia (część 1 t.j. = przepisy ustaw zmieniających), przypisy,
indeksy górne, pełna ścieżka art./ust./pkt/lit., AMBIGUOUS, NOT_FOUND, wybór t.j.
(najnowszy bez HTML → STARSZY_TJ_NOWSZY_TYLKO_PDF). Tryb live wyłącznie ręcznie:
`LEX_LIVE=1 python3 -m unittest test_eli_art_extract` w shared/tools.
Kod: 0 PASS, 1 FAIL, 2 brak narzędzia.
"""
import argparse, os, subprocess, sys
from pathlib import Path


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root")
    a = ap.parse_args()
    root = Path(a.repo_root or Path(__file__).resolve().parents[2])
    tools = root / "shared" / "tools"
    if not (tools / "eli_art_extract.py").is_file() or not (tools / "test_eli_art_extract.py").is_file():
        print("❌ brak shared/tools/eli_art_extract.py lub test_eli_art_extract.py"); return 2
    env = {k: v for k, v in os.environ.items() if k != "LEX_LIVE"}
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    r = subprocess.run([sys.executable, "-m", "unittest", "test_eli_art_extract"], cwd=tools, env=env,
                       capture_output=True, text=True, timeout=120)
    print((r.stdout + r.stderr).strip()[-1500:])
    print(f"WYNIK: {'PASS' if r.returncode == 0 else 'FAIL'}")
    return 0 if r.returncode == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
